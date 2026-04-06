/**
 * API Route: GET /api/analytics/shift-performance
 * Buscar desempenho por turno ao longo do ano
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    console.log('🔍 [DEBUG] Query params recebidos:', {
      url: request.url,
      year: searchParams.get('year'),
      quarter: searchParams.get('quarter'),
      yearType: typeof searchParams.get('year'),
      allParams: Object.fromEntries(searchParams.entries())
    })
    
    const params = extractSearchParams(request)
    
    // Garantir que year e quarter sejam strings numéricas válidas
    if (params.year) {
      const yearNum = parseInt(params.year, 10)
      if (isNaN(yearNum)) {
        return Response.json(
          { message: 'Parâmetro year deve ser um número válido' },
          { status: 400 }
        )
      }
      params.year = String(yearNum)
    }
    
    if (params.quarter) {
      const quarterNum = parseInt(params.quarter, 10)
      if (isNaN(quarterNum) || quarterNum < 1 || quarterNum > 4) {
        return Response.json(
          { message: 'Parâmetro quarter deve ser um número entre 1 e 4' },
          { status: 400 }
        )
      }
      params.quarter = String(quarterNum)
    }
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/analytics/shift-performance?${queryString}` : '/analytics/shift-performance'

    console.log('📡 [API Proxy] Chamando backend:', endpoint, { 
      params,
      queryString,
      paramTypes: Object.entries(params).map(([k, v]) => `${k}: ${typeof v}`)
    })
    
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
