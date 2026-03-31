"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/core/contexts"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { error: showError } = useNotification()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao solicitar redefinição de senha")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
      showError(err.message)
    } finally {
      setLoading(false)
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
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para login
            </Link>

            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-0.5">Esqueci minha senha</h2>
              <p className="text-xs text-gray-600">
                Digite seu e-mail e enviaremos uma nova senha temporária
              </p>
            </div>

            {success ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <p>Uma nova senha temporária foi enviada para <strong>{email}</strong>.</p>
                    <p className="text-xs mt-2">
                      Verifique sua caixa de entrada e spam. Use a nova senha para fazer login.
                    </p>
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => router.push("/login")}
                  className="w-full bg-[#005486] hover:bg-[#004070] text-white"
                >
                  Voltar para o login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-gray-900">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
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
                      Enviando...
                    </>
                  ) : (
                    "Enviar nova senha"
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
