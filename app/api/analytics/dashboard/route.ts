/**
 * API Route: GET /api/analytics/dashboard
 * Buscar dados do dashboard de analytics
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/analytics/dashboard?${queryString}` : '/analytics/dashboard'

    const data = await backendFetch(endpoint, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
