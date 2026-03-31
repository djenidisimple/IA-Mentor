const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  // Récupère le token depuis localStorage
  const token = localStorage.getItem('token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erreur serveur')
  }

  return response.json()
}