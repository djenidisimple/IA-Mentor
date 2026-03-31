import { apiFetch } from './api'
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth.types'

export const authApi = {

  register: (data: RegisterRequest) =>
    apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}