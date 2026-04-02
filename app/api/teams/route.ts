/**
 * API Route: /api/teams
 * GET: Listar times com filtros
 * POST: Criar novo time
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    
    // Construir query string
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/teams?${queryString}` : '/teams'

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

    const data = await backendFetch('/teams', {
      method: 'POST',
      body,
    })

    return Response.json(data, { status: 201 })
  } catch (error) {
    return createErrorResponse(error)
  }
}
