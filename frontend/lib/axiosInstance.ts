// lib/axiosInstance.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/lib/store/authStore'

// ── Déclaration du flag interne pour éviter les boucles ───────────────────────
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
    _isRefreshCall?: boolean
  }
}

// ── Instance principale ───────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  withCredentials: true, //  Envoie toujours les cookies HttpOnly (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

// ── Intercepteur REQUEST : attache l'access token ────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ne pas attacher de token pour l'appel /refresh lui-même
    if (config._isRefreshCall) return config

    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Intercepteur RESPONSE : refresh silencieux sur 401 ───────────────────────
//
// Problème classique : si plusieurs requêtes partent en même temps et que
// toutes reçoivent un 401, on ne veut pas appeler /refresh 10 fois.
// Solution : file d'attente (queue) + verrou (isRefreshing).

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  pendingQueue = []
}

api.interceptors.response.use(
  // Requête réussie → on laisse passer
  (response) => response,

  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    // On n'intercepte que les 401 et on évite les boucles infinies
    const is401          = error.response?.status === 401
    const alreadyRetried = originalRequest._retry === true
    const isRefreshCall  = originalRequest._isRefreshCall === true

    if (!is401 || alreadyRetried || isRefreshCall) {
      return Promise.reject(error)
    }

    // ── Cas 1 : un refresh est déjà en cours ─────────────────────────────────
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      })
    }

    // ── Cas 2 : on lance le refresh ───────────────────────────────────────────
    originalRequest._retry = true
    isRefreshing = true

    try {
      const newToken = await useAuthStore.getState().refreshAccessToken()

      if (!newToken) {
        // Refresh token invalide → logout complet
        processQueue(new Error('Session expirée'), null)
        // Rediriger vers login si on est côté client
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      //  Relancer toutes les requêtes en attente avec le nouveau token
      processQueue(null, newToken)

      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)

    } catch (refreshError) {
      processQueue(refreshError, null)
      return Promise.reject(refreshError)

    } finally {
      isRefreshing = false
    }
  }
)

export default api