/**
 * Users Service - Serviço de gerenciamento de usuários
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  UserQueryParams,
  PaginatedResponse,
} from '@/core/types'

class UsersService {
  /**
   * Cria novo usuário
   */
  async create(data: CreateUserRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>(API_ENDPOINTS.USERS, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista usuários com filtros e paginação
   */
  async findAll(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        API_ENDPOINTS.USERS,
        { params }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca usuário por ID
   */
  async findOne(id: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca perfil do usuário logado
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>(
        `${API_ENDPOINTS.USERS}/profile`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza usuário
   */
  async update(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.patch<User>(
        `${API_ENDPOINTS.USERS}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza perfil do usuário logado
   */
  async updateProfile(data: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.patch<User>(
        `${API_ENDPOINTS.USERS}/profile`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Altera senha do usuário logado
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        `${API_ENDPOINTS.USERS}/change-password`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Reseta senha de um usuário (apenas Master)
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ message: string; temporaryPassword: string }> {
    try {
      const response = await apiClient.post<{
        message: string
        temporaryPassword: string
      }>(`${API_ENDPOINTS.USERS}/reset-password`, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Ativa/desativa usuário
   */
  async toggleStatus(id: string): Promise<User> {
    try {
      const response = await apiClient.patch<User>(
        `${API_ENDPOINTS.USERS}/${id}/toggle-status`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta usuário
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.USERS}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = Array.isArray(error.response.data?.message)
        ? error.response.data.message.join(', ')
        : error.response.data?.message || 'Erro ao processar requisição'

      return new Error(message)
    }
    return new Error('Erro de conexão com o servidor')
  }
}

export default new UsersService()
