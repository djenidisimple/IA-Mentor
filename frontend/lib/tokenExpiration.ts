/**
 * Utilitaires pour la gestion de l'expiration du token JWT
 */

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

/**
 * Décoder le payload d'un token JWT
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (e) {
    console.error('[Token] Failed to decode token', e)
    return null
  }
}

/**
 * Obtenir le token depuis le localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return null
    
    const parsed = JSON.parse(authStorage)
    return parsed.state?.token || null
  } catch (e) {
    console.error('[Token] Failed to parse auth-storage', e)
    return null
  }
}

/**
 * Obtenir le temps restant en minutes
 */
export function getTimeUntilExpiration(token: string): number | null {
  const payload = decodeToken(token)
  if (!payload) return null
  
  const expiryTime = payload.exp * 1000 // convertir en ms
  const now = Date.now()
  const minutesLeft = (expiryTime - now) / 1000 / 60
  
  return minutesLeft > 0 ? Math.floor(minutesLeft) : 0
}

/**
 * Vérifier si le token expire bientôt (par défaut: dans moins de 5 minutes)
 */
export function isTokenExpiringSoon(thresholdMinutes: number = 5): boolean {
  const token = getStoredToken()
  if (!token) return false
  
  const minutesLeft = getTimeUntilExpiration(token)
  return minutesLeft !== null && minutesLeft < thresholdMinutes && minutesLeft > 0
}

/**
 * Vérifier si le token a expiré
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload) return true
  
  const expiryTime = payload.exp * 1000
  return Date.now() >= expiryTime
}

/**
 * Obtenir le temps de renouvellement du token (en ms)
 * Déclenche une alerte 5 minutes avant l'expiration
 */
export function getTokenRefreshTime(token: string, thresholdMinutes: number = 5): number | null {
  const payload = decodeToken(token)
  if (!payload) return null
  
  const expiryTime = payload.exp * 1000
  const refreshTime = expiryTime - (thresholdMinutes * 60 * 1000)
  const now = Date.now()
  
  return refreshTime > now ? refreshTime - now : 0
}
