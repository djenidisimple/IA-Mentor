"use client"
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated, isHydrated, refreshAccessToken, logout } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // 1. On attend que Zustand ait fini de lire le localStorage
    if (!isHydrated) return;

    const initAuth = async () => {
      // 2. Maintenant isAuthenticated reflète la réalité du stockage
      if (isAuthenticated && !token) {
        try {
          const newToken = await refreshAccessToken()
          if (!newToken) await logout()
        } catch (err) {
          await logout()
        }
      }
      setIsInitializing(false)
    }

    initAuth()
  }, [isHydrated, isAuthenticated, token]); // On ajoute isHydrated ici

  if (isInitializing || !isHydrated) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>
  }

  return <>{children}</>
}