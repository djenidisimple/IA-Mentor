import { AuthResponse } from '@/types/auth.types'
import { useAuthStore } from '@/lib/store/authStore'

/**
 * Renouvelle l'access token via le refresh token (cookie HttpOnly).
 *
 * La logique réelle (verrou anti-concurrence, mise à jour du store) vit dans
 * `useAuthStore.refreshAccessToken()`.
 */
export async function refreshToken(): Promise<AuthResponse | null> {
  const newAccessToken = await useAuthStore.getState().refreshAccessToken()
  if (!newAccessToken) return null

  return { token: newAccessToken } as AuthResponse
}

export const AuthService = {
  // Getter : évite de figer la valeur au chargement du module (toujours null).
  getToken: (): string | null => useAuthStore.getState().token,

  isAuthenticated: (): boolean => useAuthStore.getState().isAuthenticated,

  logout: (redirectPath: string = '/login') => {
    useAuthStore.getState().logout()
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('auth:logout'))
    window.location.href = redirectPath
  },
}

export function getAuthHeaders(): HeadersInit {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
