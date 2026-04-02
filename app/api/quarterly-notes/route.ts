/**
 * API Route: /api/quarterly-notes
 * GET: Listar notas trimestrais com filtros
 * POST: Criar nova nota trimestral
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/quarterly-notes?${queryString}` : '/quarterly-notes'

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

    const data = await backendFetch('/quarterly-notes', {
      method: 'POST',
      body,
    })

    return Response.json(data, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}
