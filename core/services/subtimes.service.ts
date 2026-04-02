/**
 * SubTimes Service - Serviço de gerenciamento de sub-times
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  SubTeam,
  CreateSubTeamRequest,
  UpdateSubTeamRequest,
  Tecnico,
} from '@/core/types'

class SubTimesService {
  /**
   * Cria novo sub-time
   */
  async create(data: CreateSubTeamRequest): Promise<SubTeam> {
    try {
      const response = await apiClient.post<SubTeam>(
        API_ENDPOINTS.SUBTIMES,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista sub-times
   */
  async findAll(params?: { teamId?: string }): Promise<SubTeam[]> {
    try {
      const response = await apiClient.get<SubTeam[]>(
        API_ENDPOINTS.SUBTIMES,
        { params }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista sub-times de um time específico
   */
  async findByTeam(teamId: string): Promise<SubTeam[]> {
    try {
      const response = await apiClient.get<SubTeam[]>(
        `${API_ENDPOINTS.SUBTIMES}/team/${teamId}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca sub-time por ID
   */
  async findOne(id: string): Promise<SubTeam> {
    try {
      const response = await apiClient.get<SubTeam>(
        `${API_ENDPOINTS.SUBTIMES}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza sub-time
   */
  async update(id: string, data: UpdateSubTeamRequest): Promise<SubTeam> {
    try {
      const response = await apiClient.patch<SubTeam>(
        `${API_ENDPOINTS.SUBTIMES}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca membros de um sub-time
   */
  async getMembers(id: string): Promise<Tecnico[]> {
    try {
      const response = await apiClient.get<Tecnico[]>(
        `${API_ENDPOINTS.SUBTIMES}/${id}/members`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta sub-time
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.SUBTIMES}/${id}`
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

export default new SubTimesService()
