"use client"

import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Previne múltiplos redirecionamentos
    if (hasRedirected.current || isLoading) return

    hasRedirected.current = true

    // Redireciona usuários autenticados para /home
    if (user) {
      router.replace("/home")
    } else {
      // Redireciona usuários não autenticados para /login
      router.replace("/login")
    }
  }, [user, isLoading, router])

  // Retorna null enquanto redireciona
  return null
}
