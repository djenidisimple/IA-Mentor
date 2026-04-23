/**
 * Hook React pour surveiller l'expiration du token et refresh automatique
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { getStoredToken, getTimeUntilExpiration, isTokenExpiringSoon } from '@/lib/tokenExpiration'
import { refreshToken, AuthService } from '@/lib/api-auth'

export interface TokenExpirationState {
  isExpiringSoon: boolean
  minutesLeft: number | null
  isExpired: boolean
  isRefreshing: boolean
}

/**
 * Hook pour surveiller l'expiration du token et renouveler automatiquement
 * @param thresholdMinutes - Nombre de minutes avant expiration pour déclencher l'alerte
 * @param pollInterval - Intervalle de vérification en ms (par défaut 60s)
 * @param autoRefresh - Si true, renouvelle automatiquement le token avant expiration
 */
export function useTokenExpiration(
  thresholdMinutes: number = 5,
  pollInterval: number = 60000,
  autoRefresh: boolean = true
): TokenExpirationState {
  const [state, setState] = useState<TokenExpirationState>({
    isExpiringSoon: false,
    minutesLeft: null,
    isExpired: false,
    isRefreshing: false,
  })

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasRefreshedRef = useRef<boolean>(false);

  const checkTokenStatus = useCallback(() => {
    const token = getStoredToken()
    
    if (!token) {
      setState({
        isExpiringSoon: false,
        minutesLeft: null,
        isExpired: true,
        isRefreshing: false,
      })
      return
    }

    const minutesLeft = getTimeUntilExpiration(token)
    const isExpiring = isTokenExpiringSoon(thresholdMinutes)
    const isExpired = minutesLeft === 0 || (minutesLeft !== null && minutesLeft < 0)

    setState((prev) => ({
      ...prev,
      isExpiringSoon: isExpiring,
      minutesLeft: minutesLeft !== null && minutesLeft > 0 ? minutesLeft : 0,
      isExpired,
    }))
  }, [thresholdMinutes])

  // Fonction pour renouveler le token
  const performTokenRefresh = useCallback(async () => {
    if (hasRefreshedRef.current) return; // Éviter les refreshs multiples

    if (!AuthService.isAuthenticated()) {
      console.log('[Token] User not authenticated - skipping refresh');
      return;
    }

    console.log('[Token] Token expiring soon - Attempting automatic refresh...');
    setState((prev) => ({ ...prev, isRefreshing: true }));
    hasRefreshedRef.current = true;

    try {
      await refreshToken();
      console.log('[Token] Token refreshed successfully');
      checkTokenStatus(); // Mettre à jour l'état
    } catch (error) {
      console.error('[Token] Automatic token refresh failed:', error);
      // Si le refresh échoue, le token est vraiment expiré
      setState((prev) => ({ ...prev, isExpired: true }));
      AuthService.logout();
    } finally {
      setState((prev) => ({ ...prev, isRefreshing: false }));
    }
  }, [checkTokenStatus])

  useEffect(() => {
    // Vérification initiale
    checkTokenStatus()

    // Mettre en place un intervalle de vérification
    const interval = setInterval(() => {
      checkTokenStatus();

      // Si le token expire bientôt et autoRefresh activé, refresh maintenant
      if (autoRefresh && isTokenExpiringSoon(thresholdMinutes) && !hasRefreshedRef.current) {
        performTokenRefresh();
      }
    }, pollInterval);

    // Écouter les événements de logout
    const handleLogout = () => {
      hasRefreshedRef.current = false;
      setState({
        isExpiringSoon: false,
        minutesLeft: null,
        isExpired: true,
        isRefreshing: false,
      })
    }

    window.addEventListener('auth:logout', handleLogout)

    return () => {
      clearInterval(interval)
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [checkTokenStatus, performTokenRefresh, pollInterval, thresholdMinutes, autoRefresh])

  return state
}
