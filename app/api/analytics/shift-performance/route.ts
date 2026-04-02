/**
 * API Route: GET /api/analytics/shift-performance
 * Buscar desempenho por turno ao longo do ano
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/analytics/shift-performance?${queryString}` : '/analytics/shift-performance'

    console.log('📡 [API Proxy] Chamando backend:', endpoint)
    
    const data = await backendFetch(endpoint, {
      method: 'GET',
    })

    console.log('✅ [API Proxy] Resposta recebida:', {
      type: typeof data,
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : 'N/A'
    })

    return Response.json(data)
  } catch (error) {
    console.error('❌ [API Proxy] Erro ao chamar backend:', error)
    return createErrorResponse(error)
  }
}
