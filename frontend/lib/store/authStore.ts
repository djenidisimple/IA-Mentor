import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
  // Le token vit UNIQUEMENT en mémoire (Zustand State)
  token: string | null
  user: User | null
  isHydrated: boolean // Pour savoir si le localStorage a été lu
  isAuthenticated: boolean

  setAuth: (token: string, user: User) => void
  setHydrated: () => void
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<string | null>
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,
      isAuthenticated: false,

      setHydrated: () => set({ isHydrated: true }),

      // 1. Connexion initiale (Login/Register)
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true })
      },

      // 2. Déconnexion complète
      logout: async () => {
        try {
          // Appelle le backend pour révoquer le Refresh Token en DB et supprimer le cookie
          await api.post('/api/auth/logout')
        } catch (error) {
          console.error('[AuthStore] Logout server-side failed', error)
        } finally {
          // Nettoyage local quoi qu'il arrive
          set({ token: null, user: null, isAuthenticated: false })
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage')
          }
        }
      },

      // 3. Rafraîchissement silencieux (appelé par l'intercepteur ou au reload)
      refreshAccessToken: async () => {
        try {
          const res = await api.post(
            '/api/auth/refresh',
            {},
            {
              // Flags personnalisés pour l'intercepteur axiosInstance
              _isRefreshCall: true, 
              withCredentials: true, // Crucial pour envoyer le cookie httpOnly
              headers: { 
                // On s'assure de ne pas envoyer un ancien Bearer token expiré
                'Authorization': '' 
              }
            } as any
          )

          // Le backend doit renvoyer { token, email, username, role, ... }
          const { token, ...userData } = res.data

          // Si on a déjà un user partiel en cache, on merge les données
          const currentUser = get().user
          const updatedUser = {
            ...(currentUser || {}),
            ...userData
          } as User

          set({ 
            token: token, 
            user: updatedUser, 
            isAuthenticated: true 
          })

          console.log('[AuthStore] Refresh success')
          return token

        } catch (error) {
          console.error('[AuthStore] Refresh failed - Session expired', error)
          // Si le refresh échoue, on considère la session comme morte
          set({ token: null, user: null, isAuthenticated: false })
          return null
        }
      },

      // 4. Vérification des rôles
      hasRole: (role: string) => {
        const user = get().user
        if (user?.role === role) return true
        return user?.roles?.includes(role) ?? false
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      // On ne persiste que l'utilisateur et son statut pour l'UI
      // Le token n'est jamais mis dans le localStorage (Sécurité)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      // Au rechargement de la page
      onRehydrateStorage: () => (state) => {
        if (state) {
          // On marque que l'hydratation est finie
          state.setHydrated();
          // Le token est null au démarrage car non persisté
          state.token = null;
          console.log('[AuthStore] Rehydrated: Ready to refresh');
        }
      },
    }
  )
)