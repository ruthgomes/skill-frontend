"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNotification } from "@/core/contexts"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { error: showError, success: showSuccess } = useNotification()

  useEffect(() => {
    if (!token || !email) {
      setError("Link inválido ou expirado")
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (newPassword.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha")
      }

      setSuccess(true)
      showSuccess("Senha redefinida com sucesso! Faça login com sua nova senha.")
      
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      setError(err.message)
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Flex-background.png" 
          alt="Background" 
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full max-w-md relative z-20">
        <Card className="border-0 shadow-lg rounded-xl">
          <div className="flex justify-center pt-5 pb-3">
            <h1 className="text-3xl font-bold text-[#0096d6]">SkillFix</h1>
          </div>
          <CardContent className="px-7 pb-6">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Voltar para login
            </Link>

            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-0.5">Redefinir senha</h2>
              <p className="text-xs text-gray-600">
                Digite sua nova senha
              </p>
            </div>

            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 text-center">
                  Senha redefinida com sucesso! Redirecionando para o login...
                </AlertDescription>
              </Alert>
            ) : error && !token ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-medium text-gray-900">
                    Nova senha
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      required
                      className="pl-10 pr-10 h-10 text-sm border-gray-300 focus:border-[#005486] focus:ring-[#005486]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-900">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      required
                      className="pl-10 h-10 text-sm border-gray-300 focus:border-[#005486] focus:ring-[#005486]"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10 bg-[#005486] hover:bg-[#004070] text-white text-sm font-medium rounded-lg transition-colors" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redefinindo...
                    </>
                  ) : (
                    "Redefinir senha"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#005486]" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
