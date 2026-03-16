/**
 * Evaluations Service - Serviço de gerenciamento de avaliações
 * Baseado em: docs/integration/AVALIACOES_INTEGRATION.md
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  Evaluation,
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
  SubmitEvaluationRequest,
  ApproveEvaluationRequest,
  EvaluationQueryParams,
} from '@/core/types'

class EvaluationsService {
  /**
   * Cria nova avaliação
   */
  async create(data: CreateEvaluationRequest): Promise<Evaluation> {
    try {
      const response = await apiClient.post<Evaluation>(
        API_ENDPOINTS.EVALUATIONS,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista avaliações com filtros
   */
  async findAll(params?: EvaluationQueryParams): Promise<Evaluation[]> {
    try {
      const response = await apiClient.get<Evaluation[]>(
        API_ENDPOINTS.EVALUATIONS,
        { params }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Lista avaliações de um técnico específico
   */
  async findByTecnico(tecnicoId: string): Promise<Evaluation[]> {
    try {
      const response = await apiClient.get<Evaluation[]>(
        `${API_ENDPOINTS.EVALUATIONS}/tecnico/${tecnicoId}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca avaliação por ID
   */
  async findOne(id: string): Promise<Evaluation> {
    try {
      const response = await apiClient.get<Evaluation>(
        `${API_ENDPOINTS.EVALUATIONS}/${id}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Atualiza avaliação (apenas se estiver em draft)
   */
  async update(
    id: string,
    data: UpdateEvaluationRequest
  ): Promise<Evaluation> {
    try {
      const response = await apiClient.patch<Evaluation>(
        `${API_ENDPOINTS.EVALUATIONS}/${id}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Submete avaliação para aprovação
   */
  async submit(id: string, data: SubmitEvaluationRequest): Promise<Evaluation> {
    try {
      const response = await apiClient.post<Evaluation>(
        `${API_ENDPOINTS.EVALUATIONS}/${id}/submit`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Aprova ou rejeita avaliação
   */
  async approve(
    id: string,
    data: ApproveEvaluationRequest
  ): Promise<Evaluation> {
    try {
      const response = await apiClient.post<Evaluation>(
        `${API_ENDPOINTS.EVALUATIONS}/${id}/approve`,
        data
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Deleta avaliação
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.EVALUATIONS}/${id}`
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

export default new EvaluationsService()
