import { ApiResponse } from '@/types/challenge.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown,
    public redirectUrl?: string // ⭐ Nouveau: pour capturer les redirections
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ⭐ Extraction du token (fonction pure pour testabilité)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return null
    
    const parsed = JSON.parse(authStorage)
    return parsed.state?.token || null
  } catch (e) {
    console.error('[Auth] Failed to parse auth-storage', e)
    return null
  }
}

// ⭐ Service d'authentification (à importer dans les composants)
export const AuthService = {
  logout: (redirectPath: string = '/login') => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('auth-storage')
    localStorage.removeItem('user') // Si vous stockez d'autres données
    
    // Dispatch d'un événement personnalisé pour que les stores Zustand puissent réagir
    window.dispatchEvent(new CustomEvent('auth:logout'))
    
    // Navigation programmatique (sera gérée par le composant)
    window.location.href = redirectPath
  },
  
  getToken: getAuthToken,
  
  isAuthenticated: (): boolean => {
    return !!getAuthToken()
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const token = getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    // ⭐ CRITICAL : Empêche le navigateur de suivre automatiquement les redirections
    const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
      credentials: 'include',
      redirect: 'manual', // 🔥 CECI RÉSOUT LA BOUCLE INFINIE
    })

    // ⭐ Gestion explicite des redirections (3xx)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location')
      
      // Si le backend redirige vers /login, on déconnecte proprement
      if (location?.includes('/login')) {
        AuthService.logout()
        throw new ApiError(
          'Session expired - Redirecting to login',
          response.status,
          null,
          location
        )
      }
      
      // Pour les autres redirections (ex: /api/v2/...), on pourrait les suivre manuellement
      // Mais ici, on considère ça comme une erreur
      throw new ApiError(
        `Unexpected redirect to: ${location}`,
        response.status,
        null,
        location || undefined
      )
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    const contentType = response.headers.get('content-type')
    
    let jsonResponse: ApiResponse<T>
    if (contentType?.includes('application/json')) {
      jsonResponse = await response.json()
    } else {
      const text = await response.text()
      throw new ApiError(`Invalid content type: ${contentType}`, response.status, text)
    }

    // Gestion des erreurs HTTP 4xx/5xx
    if (!response.ok) {
      // 401 Unauthorized → Déconnexion forcée
      if (response.status === 401) {
        AuthService.logout()
        throw new ApiError(
          jsonResponse.message || 'Unauthorized - Please login again',
          response.status,
          jsonResponse
        )
      }
      
      // 403 Forbidden → Ne pas déconnecter, juste notifier
      if (response.status === 403) {
        throw new ApiError(
          jsonResponse.message || 'Access forbidden',
          response.status,
          jsonResponse
        )
      }
      
      throw new ApiError(
        jsonResponse.message || `HTTP error ${response.status}`,
        response.status,
        jsonResponse
      )
    }

    // Validation de la structure
    if (!jsonResponse || typeof jsonResponse !== 'object') {
      throw new ApiError('Invalid response structure', response.status)
    }

    return jsonResponse.data
  } catch (error) {
    // Erreur réseau (CORS, serveur down, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to server')
    }
    
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error')
  }
}