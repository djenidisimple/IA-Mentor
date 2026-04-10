'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { User } from '@/types/auth.types'

function OAuth2CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // Decode the JWT to get user info, or create a placeholder User object.
      // Ideally, the backend should return user details, but we can construct a basic one based on the decoded token payload.
      
      const payloadBase64 = token.split('.')[1]
      let decodedPayload: any = {}
      try {
         decodedPayload = JSON.parse(atob(payloadBase64))
      } catch (e) {
         console.error("Failed to parse token payload", e)
      }

      // We extract what we can from the token, the rest defaults
      const user: User = {
        id: Date.now(), // Fallback ID if not in token
        username: decodedPayload.username || decodedPayload.name || decodedPayload.sub || 'github_user',
        email: decodedPayload.email || decodedPayload.sub || '',
        avatarUrl: decodedPayload.avatarUrl || decodedPayload.picture || '',
        points: 0,
        isPremium: false,
        role: decodedPayload.role || 'USER',
        createdAt: new Date().toISOString(),
      }

      setAuth(token, user)

      // Redirect to home
      // Use replace so they can't hit 'Back' to return to the callback url
      router.replace('/home')
    } else {
      // If no token, maybe an error occurred, redirect to login
      router.replace('/login?error=OAuth2_Failed')
    }
  }, [searchParams, router, setAuth])

  return <LoadingScreen />
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OAuth2CallbackHandler />
    </Suspense>
  )
}
