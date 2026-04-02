/**
 * API Route: GET /api/analytics/top-performers
 * Buscar top performers por senioridade
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/analytics/top-performers?${queryString}` : '/analytics/top-performers'

    const data = await backendFetch(endpoint, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
