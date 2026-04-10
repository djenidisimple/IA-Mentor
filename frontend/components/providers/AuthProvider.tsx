'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    // This runs once after the component has mounted on the client,
    // ensuring the Zustand persisted store has had a chance to rehydrate.
    setMounted(true)
  }, [])

  // Show a global loading screen until hydration is complete so we don't flash unauthorized state.
  if (!mounted) {
    return <LoadingScreen minDuration={0} />
  }

  return <>{children}</>
}
