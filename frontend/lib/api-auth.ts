import { ApiError } from './api-errors'
import { AuthResponse } from '@/types/auth.types'

/**
 * Récupère le token d'authentification depuis le localStorage
 */
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

/**
 * Sauvegarde les données d'authentification dans le localStorage
 */
function saveAuthData(authResponse: AuthResponse): void {
  if (typeof window === 'undefined') return

  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return

    const parsed = JSON.parse(authStorage)
    parsed.state = {
      ...parsed.state,
      token: authResponse.token,
      email: authResponse.email,
      username: authResponse.username,
      role: authResponse.role,
    }

    localStorage.setItem('auth-storage', JSON.stringify(parsed))
    localStorage.setItem('user', JSON.stringify({
      email: authResponse.email,
      username: authResponse.username,
      role: authResponse.role,
    }))
  } catch (e) {
    console.error('[Auth] Failed to save auth data', e)
  }
}

// Suivi des refresh en cours pour éviter les appels concurrents
let refreshTokenPromise: Promise<AuthResponse> | null = null

/**
 * Renouvelle le token JWT
 * Retourne la nouvelle AuthResponse ou null si le refresh échoue
 */
export async function refreshToken(): Promise<AuthResponse | null> {
  if (typeof window === 'undefined') return null

  // Si un refresh est déjà en cours, attendre le résultat
  if (refreshTokenPromise) {
    try {
      return await refreshTokenPromise
    } catch (e) {
      return null
    }
  }

  // Créer une nouvelle promesse de refresh
  refreshTokenPromise = new Promise(async (resolve, reject) => {
    try {
      const token = getAuthToken()
      if (!token) {
        reject(new Error('No token available'))
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      )

      if (!response.ok) {
        reject(new Error(`Refresh failed with status ${response.status}`))
        return
      }

      const authResponse: AuthResponse = await response.json()
      saveAuthData(authResponse)
      resolve(authResponse)
    } catch (error) {
      console.error('[Auth] Token refresh failed:', error)
      reject(error)
    } finally {
      // Réinitialiser après le refresh
      refreshTokenPromise = null
    }
  })

  return refreshTokenPromise
}

/**
 * Service d'authentification centralisé
 * Gère l'accès au token et la déconnexion
 */
export const AuthService = {
  /**
   * Récupère le token JWT actuel
   */
  getToken: getAuthToken,

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken()
  },

  /**
   * Effectue la déconnexion de l'utilisateur
   */
  logout: (redirectPath: string = '/login') => {
    if (typeof window === 'undefined') return

    // Nettoie le localStorage
    localStorage.removeItem('auth-storage')
    localStorage.removeItem('user')

    // Notifie les stores (Zustand, etc.)
    window.dispatchEvent(new CustomEvent('auth:logout'))

    // Redirige vers la page de login
    window.location.href = redirectPath
  },
}

/**
 * Construit les headers HTTP incluant l'authentification
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
