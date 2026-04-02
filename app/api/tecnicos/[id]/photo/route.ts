/**
 * API Route: POST /api/tecnicos/[id]/photo
 * Upload de foto do técnico
 */

import { NextRequest } from 'next/server'
import { createErrorResponse } from '@/app/api/lib/backend-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const API_PREFIX = process.env.BACKEND_API_PREFIX || '/api/v1'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()

    // Obter token dos cookies
    const token = request.cookies.get('access_token')?.value

    // Fazer upload direto ao backend mantendo FormData
    const response = await fetch(`${BACKEND_URL}${API_PREFIX}/tecnicos/${id}/photo`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        status: response.status,
        data: errorData,
      }
    }

    const data = await response.json()
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

    // Obter token dos cookies
    const token = request.cookies.get('access_token')?.value

    const response = await fetch(`${BACKEND_URL}${API_PREFIX}/tecnicos/${id}/photo`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        status: response.status,
        data: errorData,
      }
    }

    return Response.json({ message: 'Foto removida com sucesso' })
  } catch (error) {
    return createErrorResponse(error)
  }
}
