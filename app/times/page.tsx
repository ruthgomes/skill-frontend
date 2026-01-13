"use client"

import { useState } from "react"
import { Plus, Users, Edit, Trash2, MoreVertical, ChevronRight } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockTeams, mockSubTeams, type Team } from "@/lib/data"
import Link from "next/link"

export default function TimesPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    color: "#3b82f6",
  })

  const handleCreateOrUpdate = () => {
    if (editingTeam) {
      setTeams(
        teams.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
    } else {
      const newTeam: Team = {
        id: `team${teams.length + 1}`,
        ...formData,
        managerId: "user1",
        status: "ativo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTeams([...teams, newTeam])
    }
    handleCloseDialog()
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      description: team.description,
      department: team.department,
      color: team.color || "#3b82f6",
    })
    setDialogOpen(true)
  }

  const handleDelete = (teamId: string) => {
    if (confirm("Tem certeza que deseja excluir este time?")) {
      setTeams(teams.filter((t) => t.id !== teamId))
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
    return mockSubTeams.filter((st) => st.parentTeamId === teamId).length
  }

  const getMembersCount = (teamId: string) => {
    const subTeams = mockSubTeams.filter((st) => st.parentTeamId === teamId)
    return subTeams.reduce((acc, st) => acc + st.members.length, 0)
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
                      style={{ backgroundColor: team.color }}
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{getMembersCount(team.id)}</span>
                      <span className="text-muted-foreground ml-1">membros</span>
                    </div>
                    <Badge variant="secondary">
                      {getSubTeamsCount(team.id)} sub-times
                    </Badge>
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
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleCreateOrUpdate}>
              {editingTeam ? "Atualizar" : "Criar Time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AppLayout>
  )
}
