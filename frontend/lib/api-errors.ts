/**
 * Classe personnalisée pour les erreurs API
 * Permet une meilleure gestion et distinction des erreurs
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown,
    public redirectUrl?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Vérifie si une erreur est une erreur API
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Récupère le message d'erreur de manière sûre
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Une erreur est survenue'
}
