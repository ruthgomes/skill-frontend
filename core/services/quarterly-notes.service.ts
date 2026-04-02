/**
 * Quarterly Notes Service - Serviço de gerenciamento de notas trimestrais
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  QuarterlyNote,
  CreateQuarterlyNoteRequest,
  UpdateQuarterlyNoteRequest,
  QuarterlyNoteQueryParams,
} from '@/core/types'

class QuarterlyNotesService {
  /**
   * Cria nova nota trimestral
   */
  async create(data: CreateQuarterlyNoteRequest): Promise<QuarterlyNote> {
    try {
      const response = await apiClient.post<QuarterlyNote>(
        API_ENDPOINTS.QUARTERLY_NOTES,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista notas trimestrais com filtros
   */
  async findAll(params?: QuarterlyNoteQueryParams): Promise<QuarterlyNote[]> {
    try {
      const response = await apiClient.get<QuarterlyNote[]>(
        API_ENDPOINTS.QUARTERLY_NOTES,
        { params }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista notas de um técnico específico
   */
  async findByTecnico(tecnicoId: string): Promise<QuarterlyNote[]> {
    try {
      const response = await apiClient.get<QuarterlyNote[]>(
        `${API_ENDPOINTS.QUARTERLY_NOTES}/tecnico/${tecnicoId}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca nota trimestral por ID
   */
  async findOne(id: string): Promise<QuarterlyNote> {
    try {
      const response = await apiClient.get<QuarterlyNote>(
        `${API_ENDPOINTS.QUARTERLY_NOTES}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza nota trimestral
   */
  async update(
    id: string,
    data: UpdateQuarterlyNoteRequest
  ): Promise<QuarterlyNote> {
    try {
      const response = await apiClient.patch<QuarterlyNote>(
        `${API_ENDPOINTS.QUARTERLY_NOTES}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta nota trimestral
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.QUARTERLY_NOTES}/${id}`
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

export default new QuarterlyNotesService()
