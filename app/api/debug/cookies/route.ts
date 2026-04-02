/**
 * API Route: GET /api/debug/cookies
 * Rota de debug para verificar cookies
 */

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  return Response.json({
    message: 'Debug de Cookies',
    cookies: allCookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value.substring(0, 20) + '...', // Mostra apenas início
      hasValue: !!cookie.value,
    })),
    total: allCookies.length,
    hasAccessToken: !!cookieStore.get('access_token'),
    hasRefreshToken: !!cookieStore.get('refresh_token'),
  })
}
