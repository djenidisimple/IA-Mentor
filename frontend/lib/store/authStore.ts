import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/auth.types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)