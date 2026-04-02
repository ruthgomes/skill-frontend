/**
 * API Route: /api/tecnicos/[id]
 * GET: Buscar técnico por ID
 * PATCH: Atualizar técnico
 * DELETE: Remover técnico
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody } from '@/app/api/lib/backend-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const data = await backendFetch(`/tecnicos/${id}`, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await parseRequestBody(request)

    const data = await backendFetch(`/tecnicos/${id}`, {
      method: 'PATCH',
      body,
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await backendFetch(`/tecnicos/${id}`, {
      method: 'DELETE',
    })

    return Response.json({ message: 'Técnico removido com sucesso' })
  } catch (error) {
    return createErrorResponse(error)
  }
}
