/**
 * Auth Service - Serviço de autenticação
 * Baseado em: docs/integration/AUTH_INTEGRATION.md
 */

import apiClient, {
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from './api-client'
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

      // Salva tokens no localStorage
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)

      return data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Renova o access token usando refresh token
   * @param refreshToken - Token de atualização
   * @returns Novos tokens e dados do usuário
   */
  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      const { data } = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        request
      )

      // Atualiza tokens no localStorage
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)

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
      // Ignora erros de logout no backend
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Sempre limpa tokens locais
      clearTokens()
    }
  }

  /**
   * Verifica se usuário está autenticado
   * @returns true se houver token de acesso
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('accessToken')
    return !!token
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
