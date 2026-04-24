/**
 * Point d'entrée principal pour l'API
 * Réexporte les éléments des modules spécialisés
*/
import { useAuthStore } from './store/authStore'

export { apiFetch } from './api-client'
export { normalizeEndpoint } from './api-client'
export { AuthService, getAuthHeaders } from './api-auth'
export { ApiError, isApiError, getErrorMessage } from './api-errors'