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
    let dataPayload: any = undefined;
    if (options.body) {
      const bodyStr = options.body.toString();
      try {
        dataPayload = JSON.parse(bodyStr);
      } catch {
        dataPayload = bodyStr;
      }
    }

    const axiosOptions: any = {
      method: options.method || 'GET',
      url: normalizeEndpoint(endpoint),
      data: dataPayload,
      headers: options.headers,
    }

    if (axiosOptions.headers && axiosOptions.headers['Content-Type']) {
      axiosOptions.headers['Content-Type'] = axiosOptions.headers['Content-Type'];
    }

    const response = await api.request(axiosOptions)

    const result = response.data;

    // Certaines réponses sont directement ApiResponse{success, data, message}
    // d'autres sont des listes ou objets simples
    if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
        return result.data as T;
    }
    return result as T;
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