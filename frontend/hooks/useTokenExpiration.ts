/**
 * Hook React pour surveiller l'expiration du token et le renouveler automatiquement.
 *
 * Source de vérité : le store Zustand (le token n'est pas persisté), via
 * `getStoredToken()`. L'ancienne version lisait le localStorage et ne voyait
 * donc jamais de token.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { getStoredToken, decodeToken } from '@/lib/tokenExpiration'
import { refreshToken, AuthService } from '@/lib/api-auth'
import { useAuthStore } from '@/lib/store/authStore'

export interface TokenExpirationState {
  isExpiringSoon: boolean
  minutesLeft: number | null
  isExpired: boolean
  isRefreshing: boolean
}

const EMPTY_STATE: TokenExpirationState = {
  isExpiringSoon: false,
  minutesLeft: null,
  isExpired: false,
  isRefreshing: false,
}

/**
 * @param thresholdMinutes - Nombre de minutes avant expiration pour déclencher l'alerte
 * @param pollInterval - Intervalle de vérification en ms (par défaut 60s)
 * @param autoRefresh - Si true, renouvelle automatiquement le token avant expiration
 */
export function useTokenExpiration(
  thresholdMinutes: number = 5,
  pollInterval: number = 60000,
  autoRefresh: boolean = true
): TokenExpirationState {
  const [state, setState] = useState<TokenExpirationState>(EMPTY_STATE)

  const hasRefreshedRef = useRef<boolean>(false)
  const mountedRef = useRef<boolean>(true)

  const checkTokenStatus = useCallback(() => {
    const token = getStoredToken()

    if (!token) {
      setState(EMPTY_STATE)
      return
    }

    const payload = decodeToken(token)
    if (!payload || typeof payload.exp !== 'number') {
      setState({ ...EMPTY_STATE, isExpired: true })
      return
    }

    const secondsLeft = payload.exp - Date.now() / 1000
    const minutesLeft = secondsLeft > 0 ? Math.floor(secondsLeft / 60) : 0

    setState((prev) => ({
      ...prev,
      isExpiringSoon: secondsLeft > 0 && secondsLeft < thresholdMinutes * 60,
      minutesLeft,
      isExpired: secondsLeft <= 0,
    }))
  }, [thresholdMinutes])

  const performTokenRefresh = useCallback(async () => {
    if (hasRefreshedRef.current) return

    if (!AuthService.isAuthenticated()) {
      return
    }

    hasRefreshedRef.current = true
    setState((prev) => ({ ...prev, isRefreshing: true }))

    try {
      const newToken = await refreshToken()
      if (!newToken) {
        throw new Error('Refresh returned null')
      }
      // Nouveau token : on autorise un prochain rafraîchissement au cycle suivant.
      hasRefreshedRef.current = false
      checkTokenStatus()
    } catch (error) {
      console.error('[Token] Automatic token refresh failed:', error)
      setState((prev) => ({ ...prev, isExpired: true }))
      // Déconnexion locale : l'intercepteur Axios gère déjà la redirection.
      await useAuthStore.getState().logout()
    } finally {
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, isRefreshing: false }))
      }
    }
  }, [checkTokenStatus])

  useEffect(() => {
    mountedRef.current = true
    checkTokenStatus()

    const interval = setInterval(() => {
      checkTokenStatus()

      if (autoRefresh && isTokenExpiringSoonNow(thresholdMinutes) && !hasRefreshedRef.current) {
        performTokenRefresh()
      }
    }, pollInterval)

    // Un refresh manuel (bouton de l'alerte ou intercepteur) remet le compteur à zéro.
    const handleRefreshed = () => {
      hasRefreshedRef.current = false
      checkTokenStatus()
    }
    const handleLogout = () => {
      hasRefreshedRef.current = false
      setState(EMPTY_STATE)
    }

    window.addEventListener('auth:token-refreshed', handleRefreshed)
    window.addEventListener('auth:logout', handleLogout)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
      window.removeEventListener('auth:token-refreshed', handleRefreshed)
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [checkTokenStatus, performTokenRefresh, pollInterval, thresholdMinutes, autoRefresh])

  return state
}

/** Lecture directe du store, sans dépendre du state React (utilisable dans un interval). */
function isTokenExpiringSoonNow(thresholdMinutes: number): boolean {
  const token = getStoredToken()
  if (!token) return false

  const payload = decodeToken(token)
  if (!payload || typeof payload.exp !== 'number') return false

  const secondsLeft = payload.exp - Date.now() / 1000
  return secondsLeft > 0 && secondsLeft < thresholdMinutes * 60
}
