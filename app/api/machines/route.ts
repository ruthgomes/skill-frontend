/**
 * API Route: /api/machines
 * GET: Listar máquinas com filtros
 * POST: Criar nova máquina
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/machines?${queryString}` : '/machines'

    const data = await backendFetch(endpoint, {
      method: 'GET',
    })

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)

    const data = await backendFetch('/machines', {
      method: 'POST',
      body,
    })

    return Response.json(data, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}
