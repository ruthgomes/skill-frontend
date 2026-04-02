/**
 * API Route: /api/evaluations/tecnico/[id]
 * GET: Buscar avaliações de um técnico específico
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse } from '@/app/api/lib/backend-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const data = await backendFetch(`/evaluations/tecnico/${id}`, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
