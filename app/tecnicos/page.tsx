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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { Search, Loader2, AlertCircle, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { fetchAllPaginated } from "@/core/utils/pagination.utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { usePermissions } from "@/core/hooks"

export default function TecnicosPage() {
  const { user } = useAuth()
  const { success, error: showError } = useNotification()
  const { canDeleteTecnico, canEditTecnico, isAdmin, isSupervisor, isCoordenador } = usePermissions()

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [senioridadeFilter, setSenioridadeFilter] = useState<string>("todas")
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tecnicoToDelete, setTecnicoToDelete] = useState<Tecnico | null>(null)

  useEffect(() => {
    if (!user) {
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
      
      const allTecnicos = await fetchAllPaginated(
        (page, limit) => tecnicosService.findAll({ page, limit })
      )
      
      setTecnicos(allTecnicos)
    } catch (err) {
      console.error('❌ Erro ao carregar técnicos:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar técnicos'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!tecnicoToDelete) return

    try {
      setSubmitting(true)
      await tecnicosService.remove(tecnicoToDelete.id)
      success('Técnico excluído com sucesso!')
      await fetchTecnicos()
      handleCloseDeleteDialog()
    } catch (err) {
      console.error('Erro ao deletar técnico:', err)
      showError(err instanceof Error ? err.message : 'Erro ao deletar técnico')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenDeleteDialog = (tecnico: Tecnico) => {
    if (!canDeleteTecnico) {
      showError("Você não tem permissão para excluir este colaborador")
      return
    }
    setTecnicoToDelete(tecnico)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setTecnicoToDelete(null)
  }

  const handleView = (id: string) => {
    router.push(`/tecnicos/${id}`)
  }

  if (!user) {
    return null
  }

  const filteredTecnicos = tecnicos.filter((tecnico) => {
    const matchesSearch =
      tecnico.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tecnico.workday || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSenioridade = 
      senioridadeFilter === "todas" || tecnico.senioridade === senioridadeFilter
    
    return matchesSearch && matchesSenioridade
  })

  const getSkillCount = (tecnico: Tecnico) => {
    return tecnico.tecnicoSkills?.length || 0
  }

  // Backend já filtra automaticamente baseado na role do usuário
  // Admin: vê todos os técnicos
  // Supervisor: vê apenas técnicos que criou
  // Coordenador: vê apenas técnicos do sub-time que lidera
  const visibleTecnicos = tecnicos

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
  
  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            {isAdmin ? "Colaboradores" : "Meus Colaboradores"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin 
              ? "Gerenciamento de colaboradores do sistema"
              : "Gerenciamento dos colaboradores dos seus times" 
            }
          </p>
        </div>

        {/* Alerta de Coordenadores sem Conta */}
        {isAdmin && (() => {
          const coordenadoresSemConta = tecnicos.filter(
            (t) => t.senioridade === "Coordenador" && !t.hasUserAccount
          )
          
          if (coordenadoresSemConta.length > 0) {
            return (
              <Alert className="border-orange-300 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-700" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-orange-700">
                    ⚠️ <strong>{coordenadoresSemConta.length} coordenador{coordenadoresSemConta.length > 1 ? 'es' : ''}</strong> sem credenciais de acesso.
                    {' '}Adicione email e senha para que possam fazer login no sistema.
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push('/migrar-coordenadores')}
                    className="ml-4 border-orange-600 text-orange-700 hover:bg-orange-100"
                  >
                    Migrar Agora
                  </Button>
                </AlertDescription>
              </Alert>
            )
          }
          return null
        })()}

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
              {visibleTecnicos.map((tecnico: Tecnico) => {
                // Para coordenador: backend já filtra apenas técnicos do sub-time
                // Para supervisor/master: pode ver/editar conforme permissões
                const canEditThisTecnico = canEditTecnico
                const canDeleteThisTecnico = canDeleteTecnico
                return (
                  <Card
                    key={tecnico.id}
                    className="border-primary/10 hover:border-primary/30 transition-colors hover:shadow-lg group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        {/* Nome e Workday - Layout original sem Avatar */}
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/tecnicos/${tecnico.id}`)}
                        >
                          <CardTitle className="text-lg">{tecnico.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{tecnico.workday || 'N/A'}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant={tecnico.status ? "default" : "secondary"}>
                              {tecnico.status ? "Ativo" : "Inativo"}
                            </Badge>
                            
                            {/* Badge para Supervisores com conta */}
                            {tecnico.senioridade === "Supervisor" && tecnico.hasUserAccount && (
                              <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                                👤 Supervisor
                              </Badge>
                            )}
                            
                            {/* Badge para Coordenadores com conta */}
                            {tecnico.senioridade === "Coordenador" && tecnico.hasUserAccount && (
                              <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                                👤 Coordenador
                              </Badge>
                            )}
                            
                            {/* Alerta para Supervisores/Coordenadores SEM conta */}
                            {(tecnico.senioridade === "Supervisor" || tecnico.senioridade === "Coordenador") && !tecnico.hasUserAccount && (
                              <Badge variant="destructive" className="bg-orange-600 hover:bg-orange-700">
                                ⚠️ Sem acesso
                              </Badge>
                            )}
                          </div>

                          {(canEditThisTecnico || canDeleteThisTecnico) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(tecnico.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                {canEditThisTecnico && (
                                  <DropdownMenuItem onClick={() => router.push(`/tecnicos/${tecnico.id}/edit`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                )}
                                {canDeleteThisTecnico && (
                                  <DropdownMenuItem 
                                    onClick={() => handleOpenDeleteDialog(tecnico)} 
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent 
                      className="space-y-4 cursor-pointer"
                      onClick={() => router.push(`/tecnicos/${tecnico.id}`)}
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Cargo</p>
                          <p className="font-semibold text-foreground">{tecnico.cargo || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Senioridade</p>
                          <p className="font-semibold text-foreground">{tecnico.senioridade || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Turno</p>
                          <p className="font-semibold text-foreground">{tecnico.shift || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Área</p>
                          <p className="font-semibold text-foreground">{tecnico.area || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-primary/10">
                        <p className="text-sm text-muted-foreground mb-2">Habilidades</p>
                        <p className="text-sm font-semibold text-foreground">{getSkillCount(tecnico)} habilidades</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {visibleTecnicos.length === 0 && (
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o colaborador "{tecnicoToDelete?.name}"?
              {tecnicoToDelete?.hasUserAccount && (
                <span className="block mt-2 text-red-600 font-medium">
                  Atenção: Este colaborador possui uma conta de supervisor. A exclusão também removerá o acesso à conta.
                </span>
              )}
              Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteDialog} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
