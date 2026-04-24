'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated, refreshAccessToken, logout } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      // Si on est censé être connecté mais qu'on n'a pas de token (ex: après un F5)
      if (isAuthenticated && !token) {
        try {
          const newToken = await refreshAccessToken()
          if (!newToken) {
            // Si le refresh échoue (cookie expiré), on nettoie tout
            await logout()
          }
        } catch (err) {
          await logout()
        }
      }
      setIsInitializing(false)
    }

    initAuth()
  }, [isAuthenticated, token, refreshAccessToken, logout])

  // Optionnel : Afficher un loader pendant que la session se restaure
  if (isInitializing) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>
  }

  return <>{children}</>
}