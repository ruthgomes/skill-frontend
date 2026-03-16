/**
 * API Client - Cliente Axios configurado para comunicação com backend
 * Inclui interceptors para autenticação e tratamento de erros
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/core/constants/app.constants'

// Cria instância do axios
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_CONFIG.baseURL}${API_CONFIG.apiPrefix}`,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: API_CONFIG.withCredentials,
})

// ============================================
// INTERCEPTOR DE REQUISIÇÃO
// ============================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adiciona token de autenticação se existir
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
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

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        // Sem refresh token, redireciona para login
        handleAuthError()
        return Promise.reject(error)
      }

      try {
        // Tenta renovar o token
        const { data } = await axios.post(
          `${API_CONFIG.baseURL}${API_CONFIG.apiPrefix}/auth/refresh`,
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = data

        // Salva novos tokens
        setAccessToken(accessToken)
        setRefreshToken(newRefreshToken)

        // Processa fila de requisições pendentes
        processQueue(null, accessToken)

        // Retenta requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
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
// FUNÇÕES AUXILIARES DE TOKEN
// ============================================

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('accessToken', token)
}

function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('refreshToken', token)
}

function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

function handleAuthError(): void {
  clearTokens()
  if (typeof window !== 'undefined') {
    // Redireciona para login (pode ser ajustado conforme necessidade)
    window.location.href = '/login'
  }
}

// ============================================
// EXPORTS
// ============================================

export default apiClient

export {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  handleAuthError,
}
