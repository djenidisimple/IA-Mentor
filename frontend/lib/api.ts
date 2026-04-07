import { ApiResponse } from '@/types/challenge.types'

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

  const jsonResponse = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(jsonResponse.message || 'Erreur serveur')
  }

  // On retourne uniquement le champ data car c'est ce que les services attendent
  return (jsonResponse as ApiResponse<T>).data
}