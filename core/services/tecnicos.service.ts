/**
 * Tecnicos Service - Serviço de gerenciamento de técnicos
 * Baseado em: docs/integration/TECNICOS_INTEGRATION.md
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  Tecnico,
  CreateTecnicoRequest,
  UpdateTecnicoRequest,
  TecnicoQueryParams,
  PaginatedResponse,
} from '@/core/types'

class TecnicosService {
  /**
   * Cria novo técnico
   */
  async create(data: CreateTecnicoRequest): Promise<Tecnico> {
    try {
      const response = await apiClient.post<Tecnico>(
        API_ENDPOINTS.TECNICOS,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Cria novo técnico com foto em um único request
   */
  async createWithPhoto(data: CreateTecnicoRequest, photoFile?: File): Promise<Tecnico> {
    try {
      const formData = new FormData()
      
      // Adicionar foto se fornecida
      if (photoFile) {
        formData.append('photo', photoFile)
      }
      
      // Adicionar todos os campos do técnico
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value))
        }
      })
      
      const response = await apiClient.post<Tecnico>(
        `${API_ENDPOINTS.TECNICOS}/with-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista técnicos com filtros (retorna resposta paginada)
   */
  async findAll(params?: TecnicoQueryParams): Promise<PaginatedResponse<Tecnico>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Tecnico>>(
        API_ENDPOINTS.TECNICOS,
        { params }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca técnico por ID
   */
  async findOne(id: string): Promise<Tecnico> {
    try {
      const response = await apiClient.get<Tecnico>(
        `${API_ENDPOINTS.TECNICOS}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza técnico
   */
  async update(id: string, data: UpdateTecnicoRequest): Promise<Tecnico> {
    try {
      const response = await apiClient.patch<Tecnico>(
        `${API_ENDPOINTS.TECNICOS}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Upload de foto do técnico
   */
  async uploadPhoto(id: string, file: File): Promise<Tecnico> {
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await apiClient.post<Tecnico>(
        `${API_ENDPOINTS.TECNICOS}/${id}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Remove foto do técnico
   */
  async removePhoto(id: string): Promise<Tecnico> {
    try {
      const response = await apiClient.delete<Tecnico>(
        `${API_ENDPOINTS.TECNICOS}/${id}/photo`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca skills de um técnico
   */
  async getSkills(id: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        `${API_ENDPOINTS.TECNICOS}/${id}/skills`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza pontuação de uma skill
   */
  async updateSkillScore(
    tecnicoId: string,
    skillId: string,
    score: number
  ): Promise<any> {
    try {
      const response = await apiClient.patch<any>(
        `${API_ENDPOINTS.TECNICOS}/${tecnicoId}/skills/${skillId}`,
        { score }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta técnico
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.TECNICOS}/${id}`
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

export default new TecnicosService()
