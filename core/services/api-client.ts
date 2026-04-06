/**
 * API Client - Cliente Axios configurado para comunicação com backend
 * Inclui interceptors para autenticação e tratamento de erros
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/core/constants/app.constants'

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_CONFIG.baseURL}${API_CONFIG.apiPrefix}`,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ============================================
// INTERCEPTOR DE REQUISIÇÃO
// ============================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTOR DE RESPOSTA
// ============================================

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Se erro 401 e não é tentativa de renovação
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Adiciona na fila para retentar depois
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Busca o refreshToken do localStorage
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('skillfix_refresh_token') : null
        
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Tenta renovar o token enviando refreshToken no body
        const response = await axios.post(
          `${API_CONFIG.baseURL}${API_CONFIG.apiPrefix}/auth/refresh`, 
          { refreshToken }, 
          {
            withCredentials: true,
          }
        )

        // Armazena o novo refreshToken
        if (response.data?.refreshToken && typeof window !== 'undefined') {
          localStorage.setItem('skillfix_refresh_token', response.data.refreshToken)
        }

        // Processa fila de requisições pendentes
        processQueue(null, null)

        // Retenta requisição original
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Falha ao renovar token, loga usuário
        processQueue(refreshError as AxiosError, null)
        handleAuthError()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function handleAuthError(): void {
  if (typeof window !== 'undefined') {
    // Limpa dados de autenticação
    localStorage.removeItem('skillfix_auth_user')
    localStorage.removeItem('skillfix_refresh_token')
    // Redireciona para login
    window.location.href = '/login'
  }
}

// ============================================
// EXPORTS
// ============================================

export default apiClient

export { handleAuthError }
