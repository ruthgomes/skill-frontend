/**
 * Teams Service - Serviço de gerenciamento de times
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamQueryParams,
  SubTeam,
  Tecnico,
} from '@/core/types'

class TeamsService {
  /**
   * Cria novo time
   */
  async create(data: CreateTeamRequest): Promise<Team> {
    try {
      const response = await apiClient.post<Team>(API_ENDPOINTS.TEAMS, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista times com filtros
   */
  async findAll(params?: TeamQueryParams): Promise<Team[]> {
    try {
      const response = await apiClient.get<Team[]>(API_ENDPOINTS.TEAMS, {
        params,
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca time por ID
   */
  async findOne(id: string): Promise<Team> {
    try {
      const response = await apiClient.get<Team>(
        `${API_ENDPOINTS.TEAMS}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza time
   */
  async update(id: string, data: UpdateTeamRequest): Promise<Team> {
    try {
      const response = await apiClient.patch<Team>(
        `${API_ENDPOINTS.TEAMS}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca subtimes de um time
   */
  async getSubTimes(id: string): Promise<SubTeam[]> {
    try {
      const response = await apiClient.get<SubTeam[]>(
        `${API_ENDPOINTS.TEAMS}/${id}/subtimes`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca membros de um time
   */
  async getMembers(id: string): Promise<Tecnico[]> {
    try {
      const response = await apiClient.get<Tecnico[]>(
        `${API_ENDPOINTS.TEAMS}/${id}/members`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta time
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.TEAMS}/${id}`
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

export default new TeamsService()
