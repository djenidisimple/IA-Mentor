'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { PageSkeleton } from '@/components/ui/Skeleton'

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
    return <PageSkeleton />
  }

  return <>{children}</>
}
