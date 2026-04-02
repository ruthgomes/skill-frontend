/**
 * API Route: GET /api/auth/me
 * Proxy para obter dados do usuário autenticado
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const data = await backendFetch('/auth/me', {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
