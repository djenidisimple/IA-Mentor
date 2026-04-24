'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Navbar from "@/components/Navbar"
import LoadingScreen from '@/components/ui/LoadingScreen'

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
      return <LoadingScreen minDuration={0} />
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