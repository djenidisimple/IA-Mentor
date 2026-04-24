import { ApiError } from './api-errors'
import { ApiResponse } from '@/types/challenge.types'
import api from './axiosInstance' // Import de l'instance Axios configurée

export function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const axiosOptions: any = {
      method: options.method || 'GET',
      url: normalizeEndpoint(endpoint),
      data: options.body ? JSON.parse(options.body.toString()) : undefined,
      headers: options.headers,
    }

    const response = await api.request(axiosOptions) // Utilisation de l'instance Axios

    const result = response.data;

    if (result && Object.prototype.hasOwnProperty.call(result, 'data')) {
        return result.data;
    }
    return result;
  } catch (error: any) {
    if (error.response) {
      // Erreur de l'API (ex: 401, 403)
      // L'intercepteur Axios dans axiosInstance.ts gère déjà le refresh ou le logout
      // Donc, si une erreur arrive ici, c'est qu'elle doit être propagée.
      throw new ApiError(
        error.response.data?.message || `HTTP error ${error.response.status}`,
        error.response.status,
        error.response.data
      )
    } else if (error.request) {
      // Pas de réponse reçue
      throw new ApiError('Network error: No response from server', 0)
    } else {
      // Autres erreurs (ex: configuration de la requête)
      throw new ApiError(error.message || 'Unknown error')
    }
  }
}