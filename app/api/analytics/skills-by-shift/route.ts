/**
 * API Route: GET /api/analytics/skills-by-shift
 * Buscar habilidades por turno
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/analytics/skills-by-shift?${queryString}` : '/analytics/skills-by-shift'

    const data = await backendFetch(endpoint, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
