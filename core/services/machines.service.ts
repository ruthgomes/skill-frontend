/**
 * Machines Service - Serviço de gerenciamento de máquinas
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  Machine,
  CreateMachineRequest,
  UpdateMachineRequest,
  MachineQueryParams,
  Skill,
} from '@/core/types'

class MachinesService {
  /**
   * Cria nova máquina
   */
  async create(data: CreateMachineRequest): Promise<Machine> {
    try {
      const response = await apiClient.post<Machine>(
        API_ENDPOINTS.MACHINES,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista máquinas com filtros
   */
  async findAll(params?: MachineQueryParams): Promise<Machine[]> {
    try {
      const response = await apiClient.get<Machine[]>(
        API_ENDPOINTS.MACHINES,
        { params }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca máquina por ID
   */
  async findOne(id: string): Promise<Machine> {
    try {
      const response = await apiClient.get<Machine>(
        `${API_ENDPOINTS.MACHINES}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza máquina
   */
  async update(id: string, data: UpdateMachineRequest): Promise<Machine> {
    try {
      const response = await apiClient.patch<Machine>(
        `${API_ENDPOINTS.MACHINES}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca skills associadas a uma máquina
   */
  async getSkills(id: string): Promise<Skill[]> {
    try {
      const response = await apiClient.get<Skill[]>(
        `${API_ENDPOINTS.MACHINES}/${id}/skills`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta máquina
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.MACHINES}/${id}`
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

export default new MachinesService()
