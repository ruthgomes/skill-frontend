/**
 * Auth Service - Serviço de autenticação
 * Baseado em: docs/integration/AUTH_INTEGRATION.md
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '@/core/types'

class AuthService {
  /**
   * Realiza login do usuário
   * @param credentials - Email e senha
   * @returns Tokens de acesso e atualização
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      )

      return data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Renova o access token usando refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const { data } = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH
      )

      return data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca dados do usuário autenticado
   * @returns Dados do usuário logado
   */
  async me(): Promise<User> {
    try {
      const { data } = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME)
      return data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  /**
   * Solicita reset da senha (esqueci minha senha)
   */
  async forgotPassword(email: string): Promise<{ message: string; temporaryPassword?: string }> {
    try {
      const response = await apiClient.post<{ message: string; temporaryPassword?: string }>(
        `${API_ENDPOINTS.USERS}/forgot-password`,
        { email }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset de senha com nova senha
   */
  async resetPassword(email: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        `${API_ENDPOINTS.USERS}/reset-password`,
        { email, newPassword }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Verifica se usuário está autenticado
   * Nota: Esta verificação é simplificada.
   * Para verificação real, use o endpoint /auth/me
   */
  isAuthenticated(): boolean {
    return true
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = Array.isArray(error.response.data?.message)
        ? error.response.data.message.join(', ')
        : error.response.data?.message || 'Erro ao autenticar'

      return new Error(message)
    }
    return new Error('Erro de conexão com o servidor')
  }
}

export default new AuthService()
