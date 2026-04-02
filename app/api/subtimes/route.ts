/**
 * API Route: /api/subtimes
 * GET: Listar subtimes com filtros
 * POST: Criar novo subtime
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/subtimes?${queryString}` : '/subtimes'

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

    const data = await backendFetch('/subtimes', {
      method: 'POST',
      body,
    })

    return Response.json(data, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}
