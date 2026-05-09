"use client"
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import LoadingScreen from '../ui/LoadingScreen'
import { useRouter } from 'next/navigation'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
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
      } else if (isAuthenticated && token) {
        router.replace('/home')
      }
      setIsInitializing(false)
    }

    initAuth()
  }, [isHydrated, isAuthenticated, token]);

  if (isInitializing || (isAuthenticated && !token) || !isHydrated) {
    return <LoadingScreen minDuration={0} />
  }

  return <>{children}</>
}