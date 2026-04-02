/**
 * API Route: POST /api/auth/logout
 * Proxy para logout do usuário
 */

import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse } from '@/app/api/lib/backend-client'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Fazer requisição ao backend
    await backendFetch('/auth/logout', {
      method: 'POST',
    })

    // Limpar cookies
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')

    return Response.json({ message: 'Logout realizado com sucesso' })
  } catch (error) {
    // Mesmo com erro, limpar cookies
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    
    return createErrorResponse(error)
  }
}
