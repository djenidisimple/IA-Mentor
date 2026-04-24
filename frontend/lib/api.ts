/**
 * Point d'entrée principal pour l'API
 * Réexporte les éléments des modules spécialisés
*/

export { apiFetch } from './api-client'
export { normalizeEndpoint } from './api-client'
export { AuthService, getAuthHeaders } from './api-auth'
export { ApiError, isApiError, getErrorMessage } from './api-errors'