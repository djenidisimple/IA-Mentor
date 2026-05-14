import { ApiError } from './api-errors'
import { AuthResponse } from '@/types/auth.types'
import { useAuthStore } from '@/lib/store/authStore' // Import de useAuthStore


let refreshTokenPromise: Promise<AuthResponse | null>;

export async function refreshToken(): Promise<AuthResponse | null> {
  // Utilise la logique de refresh centralisée dans authStore
  const newAccessToken = await useAuthStore.getState().refreshAccessToken()
  if (newAccessToken) {
    // Le backend ne renvoie plus l'objet User complet au refresh.
    // Pour être complet, on pourrait refetch l'utilisateur si nécessaire.
    // Pour l'instant, on considère que le `user` dans `authStore` est à jour ou non essentiel pour le seul `refreshToken`.
    // Cependant, le AuthResponse du backend contient `email`, `username`, `role`. On peut les utiliser pour mettre à jour l'état du user dans Zustand.
    const { user } = useAuthStore.getState()
    if (user) {
        // Si l'utilisateur est présent, on suppose qu'il est déjà à jour par l'intercepteur Axios
        // via le `set({ token: accessToken, user, isAuthenticated: true })` de `refreshAccessToken`
    }
    return { token: newAccessToken } as AuthResponse // Retourne un AuthResponse partiel avec le nouveau token
  }
  return null
}

export const AuthService = {
  getToken: useAuthStore.getState().token, // Récupère le token directement de Zustand

  isAuthenticated: (): boolean => useAuthStore.getState().isAuthenticated,

  logout: (redirectPath: string = '/login') => {
    useAuthStore.getState().logout() // Appelle le logout centralisé de Zustand
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