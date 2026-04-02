/**
 * Backend Client - Helper para fazer chamadas ao backend real
 * Usado pelos API Route Handlers como proxy
 */

import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const API_PREFIX = process.env.BACKEND_API_PREFIX || '/api/v1'

interface BackendRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  isFormData?: boolean
}

/**
 * Faz requisição ao backend com autenticação automática
 */
export async function backendFetch(
  endpoint: string,
  options: BackendRequestOptions = {}
) {
  const { method = 'GET', body, headers = {}, isFormData = false } = options

  // Obter token de autenticação dos cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  // Construir headers
  const requestHeaders: HeadersInit = {
    ...headers,
  }

  // Adicionar Content-Type apenas se não for FormData
  if (!isFormData && method !== 'GET') {
    requestHeaders['Content-Type'] = 'application/json'
  }

  // Adicionar token de autenticação se existir
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  // Construir URL completa
  const url = `${BACKEND_URL}${API_PREFIX}${endpoint}`

  // Preparar body
  let requestBody: any = undefined
  if (body && method !== 'GET') {
    requestBody = isFormData ? body : JSON.stringify(body)
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      cache: 'no-store',
    })

    // Se resposta não for ok, lançar erro com detalhes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      }
    }

    // Retornar resposta JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    // Se não for JSON, retornar resposta vazia
    return null
  } catch (error: any) {
    // Re-lançar erro para ser tratado pelo route handler
    throw error
  }
}

/**
 * Helper para construir resposta de erro padronizada
 */
export function createErrorResponse(error: any, defaultStatus = 500) {
  const status = error.status || defaultStatus
  const message = error.data?.message || error.message || 'Erro interno do servidor'
  const details = error.data || {}

  return Response.json(
    {
      message,
      ...details,
    },
    { status }
  )
}

/**
 * Helper para validar body da requisição
 */
export async function parseRequestBody(request: Request) {
  try {
    return await request.json()
  } catch {
    throw {
      status: 400,
      message: 'Corpo da requisição inválido',
    }
  }
}

/**
 * Helper para extrair parâmetros da URL
 */
export function extractSearchParams(request: Request): Record<string, string> {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string> = {}
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}
