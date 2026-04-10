'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, token } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isAuthenticated && token) {
      router.replace('/home')
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, token, router])

  if (isChecking) {
    return <LoadingScreen minDuration={0} />
  }

  return <>{children}</>
}
