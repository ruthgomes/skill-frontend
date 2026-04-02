/**
 * API Route: POST /api/auth/refresh
 * Proxy para renovar token de autenticação
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse } from '@/app/api/lib/backend-client'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Obter refresh token dos cookies
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    console.log('🔄 Tentando refresh token:', refreshToken ? 'encontrado' : 'NÃO ENCONTRADO')

    if (!refreshToken) {
      // Listar todos os cookies para debug
      const allCookies = cookieStore.getAll()
      console.log('📋 Cookies disponíveis:', allCookies.map(c => c.name))
      
      throw {
        status: 401,
        message: 'Refresh token não encontrado',
      }
    }

    // Fazer requisição ao backend
    const data = await backendFetch('/auth/refresh', {
      method: 'POST',
      body: { refreshToken: refreshToken }, // Backend espera camelCase
    })

    // Suporta tanto camelCase quanto snake_case
    const accessToken = data.access_token || data.accessToken
    const newRefreshToken = data.refresh_token || data.refreshToken

    // Atualizar tokens nos cookies
    if (accessToken) {
      cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 horas
      })

      if (newRefreshToken) {
        cookieStore.set('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      console.log('✅ Tokens atualizados nos cookies')
    }

    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
