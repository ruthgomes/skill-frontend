/**
 * API Route: /api/skills/[id]
 * GET: Buscar skill por ID
 * PATCH: Atualizar skill
 * DELETE: Remover skill
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody } from '@/app/api/lib/backend-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const data = await backendFetch(`/skills/${id}`, {
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

    const data = await backendFetch(`/skills/${id}`, {
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

    await backendFetch(`/skills/${id}`, {
      method: 'DELETE',
    })

    return Response.json({ message: 'Skill removida com sucesso' })
  } catch (error) {
    return createErrorResponse(error)
  }
}
