import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/axiosInstance'

interface User {
  id: number
  email: string
  username: string
  roles?: string[]
  avatarUrl?: string
  points?: number
  isPremium?: boolean
  role?: string
  createdAt?: string
}

interface AuthState {
  // ✅ Le token vit UNIQUEMENT en mémoire Zustand — jamais dans localStorage
  token: string | null
  user: User | null
  isAuthenticated: boolean

  setAuth: (token: string, user: User) => void
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<string | null>
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Appelé après login/register — le refresh token est déjà dans le cookie
      // posé par le serveur, on ne le touche pas ici.
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true })
      },

      // Logout propre : révoque le refresh token en DB + supprime le cookie
      logout: async () => {
        try {
          await api.post('/api/auth/logout')
        } catch {
          // On continue le logout local même si le serveur est injoignable
        } finally {
          set({ token: null, user: null, isAuthenticated: false })
        }
      },

      // Appelé silencieusement par l'intercepteur Axios quand le JWT expire
      refreshAccessToken: async () => {
        try {
          const res = await api.post(
            '/api/auth/refresh',
            {},
            {
              // ✅ Envoie le cookie HttpOnly automatiquement, même cross-origin
              withCredentials: true,
              // Flag pour ne pas re-intercepter cette requête (évite la boucle infinie)
              _isRefreshCall: true,
              // On s'assure de NE PAS envoyer l'ancien token expiré
              headers: { Authorization: '' }
            } as any
          )

          // Le backend renvoie { token, email, username, role }
          const { token, email, username, role } = res.data as any
          
          const updatedUser = get().user ? {
            ...get().user!,
            email,
            username,
            role
          } : { email, username, role } as User

          set({ token, user: updatedUser, isAuthenticated: true })
          return token

        } catch (error) {
          console.error('[AuthStore] Refresh failed', error)
          // Refresh token expiré ou révoqué → vrai logout
          set({ token: null, user: null, isAuthenticated: false })
          return null
        }
      },

      hasRole: (role: string) => {
        const { user } = get()
        return user?.roles?.includes(role) ?? false
      },
    }),

    {
      name: 'auth-storage',

      // ✅ CRITIQUE : on ne persiste QUE user — jamais le token.
      // Le token est en mémoire pure (perdu au refresh de page → géré par /refresh).
      // user est persisté pour afficher le nom/avatar immédiatement au reload.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      // Au reload de page, isAuthenticated peut être true mais token = null.
      // L'intercepteur Axios va automatiquement appeler /refresh au premier appel API.
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Token toujours null au reload — c'est voulu
          state.token = null
        }
      },
    }
  )
)
