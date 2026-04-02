/**
 * API Route: /api/users/[id]
 * GET: Buscar usuário por ID
 * PATCH: Atualizar usuário
 * DELETE: Remover usuário
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody } from '@/app/api/lib/backend-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const data = await backendFetch(`/users/${id}`, {
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

    const data = await backendFetch(`/users/${id}`, {
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

    await backendFetch(`/users/${id}`, {
      method: 'DELETE',
    })

    return Response.json({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    return createErrorResponse(error)
  }
}
