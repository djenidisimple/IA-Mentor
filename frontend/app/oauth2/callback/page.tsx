'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axiosInstance'
import { useAuthStore } from '@/lib/store/authStore'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { User } from '@/types/auth.types'

interface OAuth2ExchangeResponse {
  id: number
  token: string
  email: string
  username: string
  role: string
}

function OAuth2CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  // React StrictMode exécute les effets deux fois en dev : le code est à usage
  // unique, il faut donc empêcher un second échange.
  const hasExchangedRef = useRef(false)

  useEffect(() => {
    if (hasExchangedRef.current) return
    hasExchangedRef.current = true

    const code = searchParams.get('code')

    if (!code) {
      router.replace('/login?error=OAuth2_Failed')
      return
    }

    const exchangeCode = async () => {
      try {
        // Le backend échange le code à usage unique contre un JWT et pose le
        // cookie de refresh. Le token ne transite plus dans l'URL.
        const { data } = await api.post<OAuth2ExchangeResponse>('/api/auth/oauth2/exchange', { code })

        const user: User = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          points: 0,
          isPremium: false,
          createdAt: new Date().toISOString(),
        }

        setAuth(data.token, user)
        router.replace('/home')
      } catch (error) {
        console.error('[OAuth2] Code exchange failed', error)
        router.replace('/login?error=OAuth2_Failed')
      }
    }

    exchangeCode()
  }, [searchParams, router, setAuth])

  return <PageSkeleton />
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <OAuth2CallbackHandler />
    </Suspense>
  )
}
