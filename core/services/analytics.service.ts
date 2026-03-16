/**
 * Analytics Service - Serviço de analytics e dashboards
 * Baseado em: docs/integration/ANALYTICS_INTEGRATION.md
 */

import apiClient from './api-client'
import { API_ENDPOINTS } from '@/core/constants/app.constants'
import type {
  DashboardMetrics,
  PerformanceTrend,
  SkillsMatrix,
  TopPerformer,
  SkillsCoverage,
  TeamComparison,
  QuarterlyReport,
  SkillGapsResponse,
} from '@/core/types'

class AnalyticsService {
  /**
   * Busca métricas principais do dashboard
   */
  async getDashboard(
    teamId?: string,
    period: string = 'month'
  ): Promise<DashboardMetrics> {
    try {
      const response = await apiClient.get<DashboardMetrics>(
        `${API_ENDPOINTS.ANALYTICS}/dashboard`,
        { params: { teamId, period } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca tendências de desempenho
   */
  async getPerformanceTrends(
    tecnicoId?: string,
    teamId?: string,
    quarters: number = 4
  ): Promise<PerformanceTrend[]> {
    try {
      const response = await apiClient.get<PerformanceTrend[]>(
        `${API_ENDPOINTS.ANALYTICS}/performance-trends`,
        { params: { tecnicoId, teamId, quarters } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca matriz de skills
   */
  async getSkillsMatrix(
    teamId?: string,
    subtimeId?: string
  ): Promise<SkillsMatrix> {
    try {
      const response = await apiClient.get<SkillsMatrix>(
        `${API_ENDPOINTS.ANALYTICS}/skills-matrix`,
        { params: { teamId, subtimeId } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca top performers
   */
  async getTopPerformers(
    limit: number = 10,
    quarter?: number,
    year?: number
  ): Promise<TopPerformer[]> {
    try {
      const response = await apiClient.get<TopPerformer[]>(
        `${API_ENDPOINTS.ANALYTICS}/top-performers`,
        { params: { limit, quarter, year } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca cobertura de skills
   */
  async getSkillsCoverage(teamId?: string): Promise<SkillsCoverage> {
    try {
      const response = await apiClient.get<SkillsCoverage>(
        `${API_ENDPOINTS.ANALYTICS}/skills-coverage`,
        { params: { teamId } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca comparação entre times
   */
  async getTeamComparison(
    metric: string = 'score'
  ): Promise<TeamComparison[]> {
    try {
      const response = await apiClient.get<TeamComparison[]>(
        `${API_ENDPOINTS.ANALYTICS}/team-comparison`,
        { params: { metric } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca relatório trimestral completo
   */
  async getQuarterlyReport(
    quarter: number,
    year: number
  ): Promise<QuarterlyReport> {
    try {
      const response = await apiClient.get<QuarterlyReport>(
        `${API_ENDPOINTS.ANALYTICS}/quarterly-report`,
        { params: { quarter, year } }
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Busca análise de gaps de competências
   */
  async getSkillGaps(teamId?: string): Promise<SkillGapsResponse> {
    try {
      const response = await apiClient.get<SkillGapsResponse>(
        `${API_ENDPOINTS.ANALYTICS}/skill-gaps`,
        { params: { teamId } }
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

export default new AnalyticsService()
