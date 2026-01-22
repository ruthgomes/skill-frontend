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
    <div className="min-h-screen bg-linear-to-br from-background via-white to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-0">
            <Image 
              src="/Flex.svg" 
              alt="FLEX" 
              width={96} 
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-primary">SKILL</h1>
        </div>

        <Card className="border border-border shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@example.com"
                  disabled={isLoading}
                  required
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                  className="border-primary/20 focus:border-primary"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-card text-muted-foreground">Contas de Demo</span>
              </div>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="w-full p-3 bg-secondary/50 rounded border border-primary/20 hover:bg-secondary transition-colors text-left text-sm font-medium"
                >
                  <div className="text-primary">{account.name}</div>
                  <div className="text-muted-foreground text-xs mt-1">{account.email}</div>
                  <div className="text-muted-foreground text-xs">Senha: password</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
