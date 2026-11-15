/**
 * Utilitaires pour la gestion de l'expiration du token JWT.
 *
 * Le token d'accès vit uniquement en mémoire (store Zustand) : il n'est jamais
 * écrit dans le localStorage. Toutes les lectures passent donc par le store.
 */

import { useAuthStore } from '@/lib/store/authStore'

interface TokenPayload {
  exp: number
  iat: number
  sub: string
  [key: string]: unknown
}

/**
 * Décode un segment JWT encodé en base64url (RFC 4648 §5).
 * `atob` seul échoue sur les caractères `-` / `_` et sur l'absence de padding.
 */
function decodeBase64UrlSegment(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Décoder le payload d'un token JWT
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    return JSON.parse(decodeBase64UrlSegment(parts[1]))
  } catch (e) {
    console.error('[Token] Failed to decode token', e)
    return null
  }
}

/**
 * Obtenir le token d'accès courant.
 *
 * ⚠️ Le token n'est PAS persisté dans le localStorage (choix de sécurité), il
 * faut donc le lire depuis le store Zustand. L'ancienne lecture de
 * `auth-storage` renvoyait toujours `null` et rendait ces utilitaires inertes.
 */
export function getStoredToken(): string | null {
  return useAuthStore.getState().token
}

/**
 * Temps restant avant expiration, en secondes (négatif si déjà expiré).
 */
export function getSecondsUntilExpiration(token: string): number | null {
  const payload = decodeToken(token)
  if (!payload || typeof payload.exp !== 'number') return null

  return Math.floor(payload.exp - Date.now() / 1000)
}

/**
 * Obtenir le temps restant en minutes (0 si expiré ou dans la minute)
 */
export function getTimeUntilExpiration(token: string): number | null {
  const secondsLeft = getSecondsUntilExpiration(token)
  if (secondsLeft === null) return null

  return secondsLeft > 0 ? Math.floor(secondsLeft / 60) : 0
}

/**
 * Vérifier si le token expire bientôt (par défaut : dans moins de 5 minutes)
 */
export function isTokenExpiringSoon(thresholdMinutes: number = 5): boolean {
  const token = getStoredToken()
  if (!token) return false

  const secondsLeft = getSecondsUntilExpiration(token)
  if (secondsLeft === null) return false

  return secondsLeft > 0 && secondsLeft < thresholdMinutes * 60
}

/**
 * Vérifier si le token a expiré
 */
export function isTokenExpired(token: string): boolean {
  const secondsLeft = getSecondsUntilExpiration(token)
  if (secondsLeft === null) return true

  return secondsLeft <= 0
}

/**
 * Obtenir le temps de renouvellement du token (en ms)
 * Déclenche une alerte 5 minutes avant l'expiration
 */
export function getTokenRefreshTime(token: string, thresholdMinutes: number = 5): number | null {
  const secondsLeft = getSecondsUntilExpiration(token)
  if (secondsLeft === null) return null

  const refreshInMs = (secondsLeft - thresholdMinutes * 60) * 1000
  return refreshInMs > 0 ? refreshInMs : 0
}
