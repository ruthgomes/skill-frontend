"use client"

import { useAuth, useNotification } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/shared/components/layout"
import { tecnicosService } from "@/core/services"
import type { Tecnico } from "@/core/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { useState, useEffect } from "react"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { fetchAllPaginated } from "@/core/utils/pagination.utils"

export default function TecnicosPage() {
  const { user, isSupervisor, isAdmin } = useAuth()
  const { error: showError } = useNotification()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [senioridadeFilter, setSenioridadeFilter] = useState<string>("todas")
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "master") {
      router.replace("/login")
    } else {
      fetchTecnicos()
    }
  }, [user, router])

  const fetchTecnicos = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Carregando técnicos...')
      
      // ✅ Buscar todos os técnicos (múltiplas páginas automaticamente)
      const allTecnicos = await fetchAllPaginated(
        (page, limit) => tecnicosService.findAll({ page, limit })
      )
      
      setTecnicos(allTecnicos)
      console.log('✅ Técnicos carregados:', allTecnicos.length)
    } catch (err) {
      console.error('❌ Erro ao carregar técnicos:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar técnicos'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "master") {
    return null
  }

  const filteredTecnicos = tecnicos.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.workday || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSenioridade = 
      senioridadeFilter === "todas" || op.senioridade === senioridadeFilter
    
    return matchesSearch && matchesSenioridade
  })

  // Count skills if available
  const getSkillCount = (tecnico: Tecnico) => {
    return tecnico.tecnicoSkills?.length || 0
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            {isSupervisor ? "Meus Colaboradores" : "Colaboradores"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSupervisor 
              ? "Gerenciamento dos colaboradores dos seus times" 
              : "Gerenciamento de colaboradores do sistema"
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchTecnicos}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Pesquisar por nome ou workday..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-primary/20 focus:border-primary"
                  disabled={loading}
                />
              </div>
              <div className="w-full md:w-64">
                <select
                  value={senioridadeFilter}
                  onChange={(e) => setSenioridadeFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-primary/20 rounded-md bg-card text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={loading}
                >
                  <option value="todas">Todas as Senioridades</option>
                  <option value="Auxiliar">Auxiliar</option>
                  <option value="Junior">Junior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                  <option value="Especialista">Especialista</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Carregando colaboradores...</span>
          </div>
        )}

        {/* Tecnicos Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTecnicos.map((op) => (
                <Card
                  key={op.id}
                  className="border-primary/10 hover:border-primary/30 transition-colors cursor-pointer hover:shadow-lg"
                  onClick={() => router.push(`/tecnicos/${op.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{op.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{op.workday || 'N/A'}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge variant={op.status ? "default" : "secondary"}>
                          {op.status ? "Ativo" : "Inativo"}
                        </Badge>
                        {op.hasUserAccount && (
                          <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                            👤 Supervisor
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cargo</p>
                        <p className="font-semibold text-foreground">{op.cargo || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Senioridade</p>
                        <p className="font-semibold text-foreground">{op.senioridade || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Turno</p>
                        <p className="font-semibold text-foreground">{op.shift || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Área</p>
                        <p className="font-semibold text-foreground">{op.area || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-primary/10">
                      <p className="text-sm text-muted-foreground mb-2">Habilidades</p>
                      <p className="text-sm font-semibold text-foreground">{getSkillCount(op)} habilidades</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTecnicos.length === 0 && (
              <Card className="border-primary/10">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm || senioridadeFilter !== "todas" 
                      ? "Nenhum colaborador encontrado com os filtros aplicados"
                      : "Nenhum colaborador cadastrado"}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
