/**
 * API Route: POST /api/auth/login
 * Proxy para autenticação de usuário
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, parseRequestBody } from '@/app/api/lib/backend-client'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)

    // Fazer requisição ao backend
    const data = await backendFetch('/auth/login', {
      method: 'POST',
      body,
    })

    // Suporta tanto camelCase quanto snake_case
    const accessToken = data.access_token || data.accessToken
    const refreshToken = data.refresh_token || data.refreshToken

    // Se houver tokens na resposta, armazenar em cookies
    if (accessToken) {
      const cookieStore = await cookies()
      
      cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 horas
      })

      if (refreshToken) {
        cookieStore.set('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      console.log('✅ Tokens salvos nos cookies')
    }

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
