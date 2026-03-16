/**
 * Skills Service - Serviço de gerenciamento de skills (competências)
 * Baseado em: docs/integration/SKILLS_INTEGRATION.md
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillQueryParams,
} from '@/core/types'

class SkillsService {
  /**
   * Cria nova skill
   */
  async create(data: CreateSkillRequest): Promise<Skill> {
    try {
      const response = await apiClient.post<Skill>(API_ENDPOINTS.SKILLS, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista skills com filtros
   */
  async findAll(params?: SkillQueryParams): Promise<Skill[]> {
    try {
      const response = await apiClient.get<Skill[]>(API_ENDPOINTS.SKILLS, {
        params,
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista skills de uma máquina específica
   */
  async findByMachine(machineId: string): Promise<Skill[]> {
    try {
      const response = await apiClient.get<Skill[]>(
        `${API_ENDPOINTS.SKILLS}/machine/${machineId}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista skills de um sub-time específico
   */
  async findBySubTime(subtimeId: string): Promise<Skill[]> {
    try {
      const response = await apiClient.get<Skill[]>(
        `${API_ENDPOINTS.SKILLS}/subtime/${subtimeId}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca skill por ID
   */
  async findOne(id: string): Promise<Skill> {
    try {
      const response = await apiClient.get<Skill>(
        `${API_ENDPOINTS.SKILLS}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza skill
   */
  async update(id: string, data: UpdateSkillRequest): Promise<Skill> {
    try {
      const response = await apiClient.patch<Skill>(
        `${API_ENDPOINTS.SKILLS}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta skill
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.SKILLS}/${id}`
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

export default new SkillsService()
