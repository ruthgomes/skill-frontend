"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useNotification } from "@/core/contexts"
import { AppLayout } from "@/shared/components/layout"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle, UserPlus, ArrowLeft, Shield } from "lucide-react"
import { tecnicosService, subtimesService } from "@/core/services"
import type { Tecnico, SubTeam } from "@/core/types"
import { fetchAllPaginated } from "@/core/utils/pagination.utils"

interface CoordenadorMigration {
  tecnico: Tecnico
  email: string
  password: string
  ledSubtimeId: string
  status: 'pending' | 'migrating' | 'success' | 'error'
  errorMessage?: string
}

export default function MigrarCoordenadoresPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useNotification()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [coordenadores, setCoordenadores] = useState<CoordenadorMigration[]>([])
  const [subtimes, setSubtimes] = useState<SubTeam[]>([])

  useEffect(() => {
    if (!user || user.role !== "master") {
      router.replace("/login")
      return
    }
    loadData()
  }, [user, router])

  const loadData = async () => {
    try {
      setLoading(true)

      // Carregar todos os técnicos
      const allTecnicos = await fetchAllPaginated(
        (page, limit) => tecnicosService.findAll({ page, limit })
      )

      // Filtrar apenas coordenadores sem conta
      const coordenadoresSemConta = allTecnicos.filter(
        (t) => t.senioridade === "Coordenador" && !t.hasUserAccount
      )

      // Carregar todos os subtimes
      const allSubtimes = await subtimesService.findAll()

      setSubtimes(allSubtimes)
      setCoordenadores(
        coordenadoresSemConta.map((tecnico) => ({
          tecnico,
          email: tecnico.email || '',
          password: '',
          ledSubtimeId: tecnico.subtimeId || tecnico.ledSubtimeId || '',
          status: 'pending',
        }))
      )
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err)
      showError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const updateCoordenador = (index: number, field: keyof CoordenadorMigration, value: string) => {
    setCoordenadores((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const migrarCoordenador = async (index: number) => {
    const coord = coordenadores[index]

    // Validações
    if (!coord.email) {
      showError(`E-mail é obrigatório para ${coord.tecnico.name}`)
      return
    }

    if (!coord.password) {
      showError(`Senha é obrigatória para ${coord.tecnico.name}`)
      return
    }

    if (coord.password.length < 8) {
      showError(`A senha deve ter no mínimo 8 caracteres para ${coord.tecnico.name}`)
      return
    }

    if (!coord.ledSubtimeId) {
      showError(`Sub-time é obrigatório para ${coord.tecnico.name}`)
      return
    }

    try {
      // Atualizar status para 'migrating'
      setCoordenadores((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: 'migrating' }
        return updated
      })

      // Fazer PATCH na API
      await tecnicosService.update(coord.tecnico.id, {
        email: coord.email,
        password: coord.password,
        ledSubtimeId: coord.ledSubtimeId,
      })

      // Atualizar status para 'success'
      setCoordenadores((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: 'success' }
        return updated
      })

      showSuccess(`✅ ${coord.tecnico.name} migrado com sucesso!`)
    } catch (err) {
      console.error(`❌ Erro ao migrar ${coord.tecnico.name}:`, err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'

      // Atualizar status para 'error'
      setCoordenadores((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: 'error', errorMessage }
        return updated
      })

      showError(`Erro ao migrar ${coord.tecnico.name}: ${errorMessage}`)
    }
  }

  const migrarTodos = async () => {
    setSubmitting(true)

    for (let i = 0; i < coordenadores.length; i++) {
      if (coordenadores[i].status !== 'success') {
        await migrarCoordenador(i)
      }
    }

    setSubmitting(false)
    showSuccess('Migração em lote concluída!')
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/tecnicos')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Técnicos
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Migração de Coordenadores
          </h1>
          <p className="text-muted-foreground mt-2">
            Adicione credenciais de acesso (email, senha e sub-time) aos coordenadores existentes
          </p>
        </div>

        {coordenadores.length === 0 ? (
          <Alert className="border-green-300 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-700" />
            <AlertDescription className="text-green-700">
              🎉 Todos os coordenadores já possuem credenciais de acesso!
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="mb-6 border-blue-300 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-700" />
              <AlertDescription className="text-blue-700">
                <strong>{coordenadores.length} coordenador{coordenadores.length > 1 ? 'es' : ''}</strong> sem credenciais de acesso.
                Preencha os dados abaixo para criar as contas.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 mb-6">
              {coordenadores.map((coord, index) => {
                const subtime = subtimes.find((st) => st.id === coord.ledSubtimeId)

                return (
                  <Card key={coord.tecnico.id} className={
                    coord.status === 'success' ? 'border-green-300 bg-green-50/50' :
                    coord.status === 'error' ? 'border-red-300 bg-red-50/50' :
                    coord.status === 'migrating' ? 'border-blue-300 bg-blue-50/50' :
                    ''
                  }>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {coord.tecnico.name}
                            {coord.status === 'success' && (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Migrado
                              </Badge>
                            )}
                            {coord.status === 'error' && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Erro
                              </Badge>
                            )}
                            {coord.status === 'migrating' && (
                              <Badge className="bg-blue-600 text-white">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Migrando...
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Matrícula: {coord.tecnico.workday} | Cargo: {coord.tecnico.cargo}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {coord.status === 'success' ? (
                        <Alert className="border-green-300 bg-green-100">
                          <CheckCircle className="h-4 w-4 text-green-700" />
                          <AlertDescription className="text-green-700">
                            Conta criada com sucesso! Email: <strong>{coord.email}</strong>
                            {subtime && ` | Sub-time: ${subtime.name}`}
                          </AlertDescription>
                        </Alert>
                      ) : coord.status === 'error' ? (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {coord.errorMessage || 'Erro ao criar conta'}
                          </AlertDescription>
                        </Alert>
                      ) : null}

                      {coord.status !== 'success' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`email-${index}`}>E-mail *</Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              value={coord.email}
                              onChange={(e) => updateCoordenador(index, 'email', e.target.value)}
                              placeholder="coordenador@empresa.com"
                              disabled={coord.status === 'migrating'}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`password-${index}`}>Senha * (mín. 8 caracteres)</Label>
                            <Input
                              id={`password-${index}`}
                              type="password"
                              value={coord.password}
                              onChange={(e) => updateCoordenador(index, 'password', e.target.value)}
                              placeholder="Mínimo 8 caracteres"
                              minLength={8}
                              disabled={coord.status === 'migrating'}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`subtime-${index}`}>Sub-time que lidera *</Label>
                            <select
                              id={`subtime-${index}`}
                              className="w-full border border-input rounded-md p-2 bg-background h-10"
                              value={coord.ledSubtimeId}
                              onChange={(e) => updateCoordenador(index, 'ledSubtimeId', e.target.value)}
                              disabled={coord.status === 'migrating'}
                              required
                            >
                              <option value="">Selecione...</option>
                              {subtimes.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {coord.status !== 'success' && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => migrarCoordenador(index)}
                            disabled={coord.status === 'migrating'}
                            size="sm"
                          >
                            {coord.status === 'migrating' ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Migrando...
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Criar Credenciais
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Botão de migração em lote */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/tecnicos')}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={migrarTodos}
                disabled={submitting || coordenadores.every((c) => c.status === 'success')}
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Migrar Todos Pendentes
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
