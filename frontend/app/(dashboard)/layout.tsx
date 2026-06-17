'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Navbar from "@/components/Navbar"
import { DashboardSkeleton } from '@/components/ui/Skeleton'

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { isAuthenticated, token } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
      // If we aren't authenticated in the store, boot the user to login.
      if (!isAuthenticated || !token) {
        router.replace('/login')
      } else {
        setIsChecking(false)
      }
    }, [isAuthenticated, token, router])

    if (isChecking) {
      return <DashboardSkeleton />
    }

    return (
        <>
            <Navbar />
            <div>
              {children}
            </div>
        </>
    )
}