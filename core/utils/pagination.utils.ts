/**
 * Utilitários para trabalhar com paginação
 */

import type { PaginatedResponse } from '@/core/types'

/**
 * Busca todos os dados de um endpoint paginado
 * Faz múltiplas requisições até obter todos os registros
 * 
 * @param fetchFn - Função que faz a requisição paginada
 * @param maxLimit - Limite máximo por página (padrão: 100)
 * @returns Array com todos os dados
 * 
 * @example
 * ```typescript
 * const allTecnicos = await fetchAllPaginated(
 *   (page, limit) => tecnicosService.findAll({ page, limit })
 * )
 * ```
 */
export async function fetchAllPaginated<T>(
  fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  maxLimit: number = 100
): Promise<T[]> {
  let allData: T[] = []
  let currentPage = 1
  let hasMorePages = true

  while (hasMorePages) {
    const response = await fetchFn(currentPage, maxLimit)
    
    allData = [...allData, ...response.data]
    
    // Verificar se há mais páginas
    const totalPages = response.meta?.totalPages || 1
    hasMorePages = currentPage < totalPages
    
    currentPage++
    
    // Limite de segurança: não buscar mais de 50 páginas
    if (currentPage > 50) {
      console.warn('⚠️ fetchAllPaginated: Limite de 50 páginas atingido')
      break
    }
  }

  return allData
}

/**
 * Busca apenas a primeira página
 * Útil quando você quer exibir dados rapidamente e implementar load more depois
 * 
 * @param fetchFn - Função que faz a requisição paginada
 * @param limit - Limite por página (padrão: 100)
 * @returns Dados da primeira página e metadados de paginação
 */
export async function fetchFirstPage<T>(
  fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  limit: number = 100
): Promise<PaginatedResponse<T>> {
  return fetchFn(1, limit)
}
