"use client"

import { useState, useEffect } from "react"
import { Plus, Users, Edit, Trash2, MoreVertical, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { AppLayout } from "@/shared/components/layout"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { teamsService, subtimesService, usersService } from "@/core/services"
import type { Team, SubTeam, User } from "@/core/types"
import Link from "next/link"
import { useNotification } from "@/core/contexts"

export default function TimesPage() {
  const { success, error: showError } = useNotification()
  
  // Estados para dados do backend
  const [teams, setTeams] = useState<Team[]>([])
  const [subtimes, setSubtimes] = useState<SubTeam[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Estados do formulário
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    color: "#3b82f6",
  })

  // Busca inicial de dados
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Buscando times, subtimes e usuários...')
      
      const [teamsData, subtimesData, usersResponse] = await Promise.all([
        teamsService.findAll(),
        subtimesService.findAll(),
        usersService.findAll(),
      ])
      
      // usersService.findAll() retorna paginado
      const usersData = usersResponse.data || []
      
      console.log('✅ Dados carregados:', {
        teams: teamsData.length,
        subtimes: subtimesData.length,
        users: usersData.length,
      })
      
      setTeams(teamsData)
      setSubtimes(subtimesData)
      setUsers(usersData)
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const getSupervisorName = (supervisorId: string) => {
    const supervisor = users.find((u) => u.id === supervisorId)
    return supervisor ? supervisor.name : "Não definido"
  }

  const handleCreateOrUpdate = async () => {
    try {
      setSubmitting(true)
      
      if (editingTeam) {
        // Atualizar time existente
        console.log('🔄 Atualizando time...')
        await teamsService.update(editingTeam.id, formData)
        success('Time atualizado com sucesso!')
        console.log('✅ Time atualizado')
      } else {
        // Criar novo time
        console.log('🔄 Criando novo time...')
        await teamsService.create(formData)
        success('Time criado com sucesso!')
        console.log('✅ Time criado')
      }
      
      // Recarrega dados
      await fetchAllData()
      handleCloseDialog()
    } catch (err) {
      console.error('❌ Erro ao salvar time:', err)
      showError(err instanceof Error ? err.message : 'Erro ao salvar time')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      description: team.description || "",
      department: team.department || "",
      color: team.color || "#3b82f6",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (teamId: string) => {
    if (!confirm("Tem certeza que deseja excluir este time?")) return
    
    try {
      setSubmitting(true)
      console.log('🔄 Deletando time...')
      await teamsService.remove(teamId)
      success('Time excluído com sucesso!')
      console.log('✅ Time deletado')
      
      // Recarrega dados
      await fetchAllData()
    } catch (err) {
      console.error('❌ Erro ao deletar time:', err)
      showError(err instanceof Error ? err.message : 'Erro ao deletar time')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTeam(null)
    setFormData({
      name: "",
      description: "",
      department: "",
      color: "#3b82f6",
    })
  }

  const getSubTeamsCount = (teamId: string) => {
    return subtimes.filter((st) => st.parentTeamId === teamId).length
  }

  const getMembersCount = (teamId: string) => {
    const teamSubtimes = subtimes.filter((st) => st.parentTeamId === teamId)
    return teamSubtimes.reduce((acc, st) => acc + (st.tecnicos?.length || 0), 0)
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando times...</p>
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
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchAllData} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Times</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os times e sub-times da engenharia
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Novo Time
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: team.color || "#3b82f6" }}
                    />
                    <div>
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {team.department}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(team)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(team.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {team.description}
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{getMembersCount(team.id)}</span>
                      <span className="text-muted-foreground ml-1">membros</span>
                    </div>
                    <Badge variant="secondary">
                      {getSubTeamsCount(team.id)} sub-times
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Supervisor: </span>
                    <span className="font-semibold text-primary">{getSupervisorName(team.supervisorId || "")}</span>
                  </div>
                </div>
                <Link href={`/times/${team.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Detalhes
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {teams.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum time cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro time de engenharia
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Time
            </Button>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
            <DialogTitle>
              {editingTeam ? "Editar Time" : "Criar Novo Time"}
            </DialogTitle>
            <DialogDescription>
              {editingTeam
                ? "Atualize as informações do time"
                : "Adicione um novo time à sua estrutura de engenharia"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Time</Label>
              <Input
                id="name"
                placeholder="Ex: Manutenção"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                placeholder="Ex: Engenharia"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva as responsabilidades do time..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Cor de Identificação</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  {formData.color}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleCreateOrUpdate} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingTeam ? "Atualizando..." : "Criando..."}
                </>
              ) : (
                editingTeam ? "Atualizar" : "Criar Time"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AppLayout>
  )
}
