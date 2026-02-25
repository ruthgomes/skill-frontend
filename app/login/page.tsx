"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
      router.push(email === "master@example.com" ? "/home" : "/meu-desempenho")
    } catch (err) {
      const errorMessage = "Email ou senha inválidos"
      setError(errorMessage)
    }
  }

  const demoAccounts = [
    { email: "master@example.com", name: "Master" },
    { email: "tecnico@example.com", name: "Técnico" },
  ]

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password")
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
            <Image 
              src="/Flex.svg" 
              alt="FLEX" 
              width={100} 
              height={50}
              className="object-contain"
            />
          </div>
          <CardContent className="px-7 pb-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-0.5">Login</h2>
              <p className="text-xs text-gray-600">Entre com suas credenciais para continuar</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-900">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@example.com"
                  disabled={isLoading}
                  required
                  className="h-10 text-sm border-gray-300 focus:border-[#005486] focus:ring-[#005486]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-900">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                  className="h-10 text-sm border-gray-300 focus:border-[#005486] focus:ring-[#005486]"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-10 text-white text-sm font-medium rounded-lg mt-3" 
                style={{ backgroundColor: '#005486' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004070'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005486'}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2 bg-white text-gray-500 uppercase tracking-wider">Contas de Demo</span>
              </div>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="w-full p-2.5 rounded-lg transition-colors text-left"
                  style={{ backgroundColor: '#e6f2f8' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cce5f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e6f2f8'}
                >
                  <div className="text-xs font-semibold text-gray-900">{account.name}</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">{account.email}</div>
                  <div className="text-[11px] text-gray-600">Senha: password</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
