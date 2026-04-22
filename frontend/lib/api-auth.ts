import { ApiError } from './api-errors'

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
