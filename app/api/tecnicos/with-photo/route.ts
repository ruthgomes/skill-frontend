/**
 * API Route: POST /api/tecnicos/with-photo
 * Criar técnico com foto em uma única requisição
 */

import { NextRequest } from 'next/server'
import { createErrorResponse } from '@/app/api/lib/backend-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const API_PREFIX = process.env.BACKEND_API_PREFIX || '/api/v1'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Obter token dos cookies
    const token = request.cookies.get('access_token')?.value

    // Fazer upload direto ao backend mantendo FormData
    const response = await fetch(`${BACKEND_URL}${API_PREFIX}/tecnicos/with-photo`, {
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
    return Response.json(data, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}
