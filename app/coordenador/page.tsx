"use client"

import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/shared/components/layout"
import { useEffect, useState } from "react"
import { tecnicosService, subtimesService } from "@/core/services"
import type { Tecnico, SubTeam } from "@/core/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Users, TrendingUp, AlertCircle, Loader2, Eye } from "lucide-react"
import { useNotification } from "@/core/contexts"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function CoordenadorDashboard() {
  const { user, isCoordenador } = useAuth()
  const { error: showError } = useNotification()
  const router = useRouter()
  
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !isCoordenador) {
      router.replace("/login")
    } else {
      fetchTecnicos()
    }
  }, [user, isCoordenador, router])

  const fetchTecnicos = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Carregando técnicos do sub-time...')
      console.log('👤 Usuário logado:', {
        id: user?.id,
        name: user?.name,
        role: user?.role,
        tecnicoId: user?.tecnicoId,
        email: user?.email
      })
      
      // DEBUG: Verificar sub-times do coordenador
      if (user?.tecnicoId) {
        try {
          const allSubtimes = await subtimesService.findAll()
          console.log('📋 TODOS os sub-times disponíveis:', allSubtimes)
          
          const mySubtimes = allSubtimes.filter(st => st.coordenadorId === user.tecnicoId)
          console.log('🎯 Sub-times que eu lidero (via coordenadorId):', mySubtimes)
          console.log('📊 Quantidade de sub-times:', mySubtimes.length)
          
          // DEBUG: Buscar o próprio técnico para ver ledSubtimeId
          try {
            const meuTecnico = await tecnicosService.findOne(user.tecnicoId)
            console.log('👨‍💼 MEU registro de técnico completo:', meuTecnico)
            console.log('🔗 ledSubtimeId no meu registro:', meuTecnico.ledSubtimeId)
            console.log('🔗 ledSubtime (objeto completo):', meuTecnico.ledSubtime)
            
            if (!meuTecnico.ledSubtimeId) {
              console.error('❌ PROBLEMA IDENTIFICADO: O campo ledSubtimeId está VAZIO!')
              console.error('❌ SOLUÇÃO: Edite este coordenador e selecione o sub-time que ele deve liderar.')
              console.error('❌ Acesse como Admin → Técnicos → Editar → Selecione o sub-time no dropdown')
            }
          } catch (tecnicoErr) {
            console.error('❌ Erro ao buscar próprio técnico:', tecnicoErr)
          }
          
          if (mySubtimes.length === 0) {
            console.warn('⚠️ PROBLEMA: Coordenador não está associado a nenhum sub-time!')
            console.warn('⚠️ Isso significa que ledSubtimeId está vazio ou não foi configurado.')
            console.warn('⚠️ VERIFIQUE: Este coordenador foi criado SEM selecionar um sub-time!')
          } else {
            mySubtimes.forEach(st => {
              console.log(`  - ${st.name} (ID: ${st.id}) - Técnicos: ${st.tecnicos?.length || 0}`)
            })
          }
        } catch (debugErr) {
          console.error('❌ Erro ao buscar sub-times para debug:', debugErr)
        }
      } else {
        console.warn('⚠️ PROBLEMA: Usuário coordenador sem tecnicoId!')
      }
      
      // O backend já filtra automaticamente baseado no coordenador logado
      const response = await tecnicosService.findAll()
      console.log('📦 Resposta completa da API:', response)
      setTecnicos(response.data)
      console.log('✅ Técnicos carregados:', response.data.length)
      
    } catch (err) {
      console.error('❌ Erro ao carregar técnicos:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar técnicos'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !isCoordenador) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Carregando seu sub-time...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchTecnicos}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  // Estatísticas
  const totalTecnicos = tecnicos.length
  const tecnicosAtivos = tecnicos.filter(t => t.status).length
  const mediaSkills = tecnicos.length > 0
    ? tecnicos.reduce((sum, t) => sum + (t.tecnicoSkills?.length || 0), 0) / tecnicos.length
    : 0

  const getPhotoURL = (photoPath: string | null | undefined): string | null => {
    if (!photoPath) return null
    if (photoPath.startsWith('http')) return photoPath
    const cleanPath = photoPath.replace(/^\/+/, '')
    return `${API_BASE_URL}/${cleanPath}`
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-primary">Meu Sub-Time</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os técnicos do seu sub-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Técnicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTecnicos}</div>
              <p className="text-xs text-muted-foreground">
                {tecnicosAtivos} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ativação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTecnicos > 0 ? Math.round((tecnicosAtivos / totalTecnicos) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Do total cadastrado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Skills</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaSkills.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Por técnico
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Técnicos List */}
        <Card>
          <CardHeader>
            <CardTitle>Técnicos do Sub-Time</CardTitle>
          </CardHeader>
          <CardContent>
            {tecnicos.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum técnico encontrado</h3>
                <div className="space-y-2">
                  <p className="text-red-600 font-semibold">
                    ⚠️ Seu coordenador NÃO está associado a nenhum sub-time!
                  </p>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Para resolver este problema, entre em contato com o <strong>Administrador</strong> ou <strong>Supervisor</strong> 
                    do sistema para que eles editem seu cadastro e selecionem o sub-time que você deve liderar.
                  </p>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-md mx-auto">
                    <p className="font-semibold text-blue-900 mb-2">📋 Instruções para o Admin:</p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Acesse a página <strong>Técnicos</strong></li>
                      <li>Encontre o coordenador: <strong>{user?.name}</strong></li>
                      <li>Clique em <strong>Editar</strong></li>
                      <li>Na seção "Sub-time que o Coordenador lidera", selecione um sub-time no dropdown</li>
                      <li>Salve as alterações</li>
                    </ol>
                  </div>
                </div>
                <Alert className="mt-6 text-left border-yellow-300 bg-yellow-50 max-w-md mx-auto">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <AlertDescription className="text-yellow-700 text-sm">
                    <strong>Informação Técnica (F12 → Console):</strong><br/>
                    Abra o Console do Navegador para ver logs detalhados sobre o problema. 
                    Procure por linhas que começam com ❌ ou 👨‍💼.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                {tecnicos.map((tecnico) => {
                  const initials = tecnico.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <div
                      key={tecnico.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          {tecnico.photo && (
                            <AvatarImage 
                              src={getPhotoURL(tecnico.photo) || undefined} 
                              alt={tecnico.name}
                            />
                          )}
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{tecnico.name}</h4>
                            <Badge variant={tecnico.status ? "default" : "secondary"}>
                              {tecnico.status ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tecnico.cargo || 'N/A'} • {tecnico.senioridade || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tecnico.workday || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {tecnico.tecnicoSkills?.length || 0} skills
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/tecnicos/${tecnico.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
