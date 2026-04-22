/**
 * Hook React pour surveiller l'expiration du token
 */

import { useEffect, useState, useCallback } from 'react'
import { getStoredToken, getTimeUntilExpiration, isTokenExpiringSoon } from '@/lib/tokenExpiration'

export interface TokenExpirationState {
  isExpiringSoon: boolean
  minutesLeft: number | null
  isExpired: boolean
}

/**
 * Hook pour surveiller l'expiration du token
 * @param thresholdMinutes - Nombre de minutes avant expiration pour déclencher l'alerte
 * @param pollInterval - Intervalle de vérification en ms (par défaut 60s)
 */
export function useTokenExpiration(
  thresholdMinutes: number = 5,
  pollInterval: number = 60000
): TokenExpirationState {
  const [state, setState] = useState<TokenExpirationState>({
    isExpiringSoon: false,
    minutesLeft: null,
    isExpired: false,
  })

  const checkTokenStatus = useCallback(() => {
    const token = getStoredToken()
    
    if (!token) {
      setState({
        isExpiringSoon: false,
        minutesLeft: null,
        isExpired: true,
      })
      return
    }

    const minutesLeft = getTimeUntilExpiration(token)
    const isExpiring = isTokenExpiringSoon(thresholdMinutes)
    const isExpired = minutesLeft === 0 || (minutesLeft !== null && minutesLeft < 0)

    setState({
      isExpiringSoon: isExpiring,
      minutesLeft: minutesLeft !== null && minutesLeft > 0 ? minutesLeft : 0,
      isExpired,
    })
  }, [thresholdMinutes])

  useEffect(() => {
    // Vérification initiale
    checkTokenStatus()

    // Mettre en place un intervalle de vérification
    const interval = setInterval(checkTokenStatus, pollInterval)

    // Écouter les événements de logout
    const handleLogout = () => {
      setState({
        isExpiringSoon: false,
        minutesLeft: null,
        isExpired: true,
      })
    }

    window.addEventListener('auth:logout', handleLogout)

    return () => {
      clearInterval(interval)
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [checkTokenStatus, pollInterval])

  return state
}
