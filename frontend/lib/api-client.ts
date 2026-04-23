import { ApiError } from './api-errors'
import { ApiResponse } from '@/types/challenge.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Normalise un endpoint (ajoute le slash en début si nécessaire)
 */
export function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
}

/**
 * Construit l'URL complète pour un endpoint
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_URL}${normalizeEndpoint(endpoint)}`
}

/**
 * Gère les réponses avec redirection (3xx)
 */
function handleRedirect(status: number, location: string | null): void {
  if (location?.includes('/login')) {
    const { AuthService } = require('./api-auth')
    AuthService.logout()
    throw new ApiError('Session expired - Redirecting to login', status, null, location)
  }

  throw new ApiError(`Unexpected redirect to: ${location}`, status, null, location || undefined)
}

/**
 * Gère les réponses d'erreur (4xx/5xx)
 */
function handleErrorResponse<T>(
  status: number,
  jsonResponse: ApiResponse<T>
): void {
  if (status === 401) {
    const { AuthService } = require('./api-auth')
    AuthService.logout()
    throw new ApiError(
      jsonResponse.message || 'Unauthorized - Please login again',
      status,
      jsonResponse
    )
  }

  if (status === 403) {
    throw new ApiError(
      jsonResponse.message || 'Access forbidden',
      status,
      jsonResponse
    )
  }

  throw new ApiError(
    jsonResponse.message || `HTTP error ${status}`,
    status,
    jsonResponse
  )
}

/**
 * Client HTTP principal pour les appels API
 * @param endpoint Endpoint de l'API (ex: /api/users)
 * @param options Options de la requête fetch
 * @param isRetry Indique si c'est un retry après refresh (pour éviter les boucles)
 * @returns Les données retournées par l'API
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<T> {
  const { getAuthHeaders, AuthService, refreshToken } = require('./api-auth')

  const headers: HeadersInit = {
    ...getAuthHeaders(),
    ...options.headers,
  }

  try {
    const response = await fetch(buildApiUrl(endpoint), {
      ...options,
      headers,
      credentials: 'include',
      redirect: 'manual',
    })

    // Gestion des redirections (3xx)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location')
      handleRedirect(response.status, location)
    }

    // Gestion du No Content (204)
    if (response.status === 204) {
      return {} as T
    }

    // Validation du content-type
    const contentType = response.headers.get('content-type')
    let jsonResponse: ApiResponse<T>

    if (contentType?.includes('application/json')) {
      jsonResponse = await response.json()
    } else {
      const text = await response.text()
      throw new ApiError(`Invalid content type: ${contentType}`, response.status, text)
    }

    // Gestion des erreurs (4xx/5xx)
    if (!response.ok) {
      // Cas spécial: 401 Unauthorized - Tenter un refresh si pas déjà retry
      if (response.status === 401 && !isRetry && AuthService.isAuthenticated()) {
        console.log('[API] Token expired - Attempting refresh...')
        
        try {
          // Tenter de renouveler le token
          await refreshToken()
          console.log('[API] Token refreshed successfully - Retrying original request...')
          
          // Retry la requête originale avec le nouveau token
          return apiFetch<T>(endpoint, options, true)
        } catch (refreshError) {
          console.error('[API] Token refresh failed - Logging out', refreshError)
          // Si le refresh échoue, faire un logout
          AuthService.logout()
          throw new ApiError(
            'Session expired and refresh failed - Please login again',
            401,
            jsonResponse
          )
        }
      }
      
      handleErrorResponse(response.status, jsonResponse)
    }

    // Validation de la structure de réponse
    if (!jsonResponse || typeof jsonResponse !== 'object') {
      throw new ApiError('Invalid response structure', response.status)
    }

    return jsonResponse.data
  } catch (error) {
    // Erreur réseau
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to server')
    }

    // Erreur API déjà gérée
    if (error instanceof ApiError) {
      throw error
    }

    // Erreur inconnue
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error')
  }
}
