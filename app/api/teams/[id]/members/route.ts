/**
 * API Route: GET /api/teams/[id]/members
 * Listar membros de um time
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse } from '@/app/api/lib/backend-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const data = await backendFetch(`/teams/${id}/members`, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
