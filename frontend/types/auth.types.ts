export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  id: number
  token: string
  email: string
  username: string
  role: string
}

export interface User {
  id: number
  username: string
  email: string
  avatarUrl?: string
  points: number
  isPremium: boolean
  role: string
  createdAt: string
}