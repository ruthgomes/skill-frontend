"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth, useNotification } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent } from "@/shared/components/ui/card"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const { error: showErrorToast } = useNotification()
  const router = useRouter()
  const { setTheme } = useTheme()

  // Força o tema claro na página de login
  useEffect(() => {
    setTheme('light')
  }, [setTheme])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validações básicas
    if (!email || !password) {
      setError("Preencha todos os campos")
      return
    }

    try {
      await login(email, password)
      // Usa replace em vez de push para não adicionar no histórico
      router.replace("/home")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Email ou senha inválidos"
      setError(errorMessage)
      showErrorToast(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Flex-background.png" 
          alt="Background" 
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Imagem AI.svg - posição fixa no lado esquerdo */}
      <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 z-10">
        <Image 
          src="/AI.svg" 
          alt="AI" 
          width={280} 
          height={280}
          className="object-contain"
          priority
        />
      </div>

      {/* Formulário centralizado */}
      <div className="w-full max-w-md relative z-20">
        <Card className="border-0 shadow-lg rounded-xl">
          <div className="flex justify-center pt-5 pb-3">
            <h1 className="text-3xl font-bold text-[#0096d6]">SkillFix</h1>
          </div>
          <CardContent className="px-7 pb-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-0.5">Login</h2>
              <p className="text-xs text-gray-600">Entre com suas credenciais para continuar</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-900">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@example.com"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                  className="h-10 text-sm border-gray-300 focus:border-[#005486] focus:ring-[#005486]"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-900">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="h-10 text-sm border-gray-300 focus:border-[#005486] focus:ring-[#005486]"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded" role="alert">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-10 bg-[#005486] hover:bg-[#004070] text-white text-sm font-medium rounded-lg mt-3 transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
