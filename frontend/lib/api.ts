import { ApiResponse } from '@/types/challenge.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Normaliser l'endpoint
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  // Récupérer le token de manière sécurisée
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
      // Ajouter credentials si nécessaire pour les cookies
      credentials: 'include',
    })

    // Vérifier le content-type
    const contentType = response.headers.get('content-type')
    
    // Si la réponse est vide
    if (response.status === 204) {
      return {} as T
    }

    // Parser la réponse JSON
    let jsonResponse: ApiResponse<T>
    if (contentType?.includes('application/json')) {
      jsonResponse = await response.json()
    } else {
      const text = await response.text()
      throw new ApiError(`Invalid content type: ${contentType}`, response.status, text)
    }

    // Gérer les erreurs HTTP
    if (!response.ok) {
      throw new ApiError(
        jsonResponse.message || `HTTP error ${response.status}`,
        response.status,
        jsonResponse
      )
    }

    // Vérifier la structure de la réponse
    if (!jsonResponse || typeof jsonResponse !== 'object') {
      throw new ApiError('Invalid response structure', response.status)
    }

    // Retourner les données
    return jsonResponse.data
  } catch (error) {
    // Gérer les erreurs réseau
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to server')
    }
    
    // Relancer l'erreur si c'est déjà une ApiError
    if (error instanceof ApiError) {
      throw error
    }
    
    // Erreur inconnue
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error')
  }
}