"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  Target,
  UserCircle,
  User2,
} from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  mockTeams,
  mockSubTeams,
  mockTecnicos,
  type SubTeam,
} from "@/lib/data"
import Link from "next/link"

type FormData = {
  name: string
  description: string
  coordenadorId: string
}

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string

  const team = mockTeams.find((t) => t.id === teamId)
  const [subTeams, setSubTeams] = useState<SubTeam[]>(
    mockSubTeams.filter((st) => st.parentTeamId === teamId)
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubTeam, setEditingSubTeam] = useState<SubTeam | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    coordenadorId: "",
  })

  // Buscar coordenadores disponíveis
  const availableCoordinators = useMemo(() => {
    return mockTecnicos.filter((t) => t.senioridade === "Coordenador")
  }, [])

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Time não encontrado</h2>
          <Button onClick={() => router.push("/times")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Times
          </Button>
        </Card>
      </div>
    )
  }

  const handleCreateOrUpdate = () => {
    if (!formData.name || !formData.description) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    if (editingSubTeam) {
      setSubTeams(
        subTeams.map((st) =>
          st.id === editingSubTeam.id
            ? {
                ...st,
                name: formData.name,
                description: formData.description,
                coordenadorId: formData.coordenadorId || undefined,
                updatedAt: new Date().toISOString(),
              }
            : st
        )
      )
    } else {
      const newSubTeam: SubTeam = {
        id: `subteam${Date.now()}`,
        name: formData.name,
        description: formData.description,
        parentTeamId: teamId,
        coordenadorId: formData.coordenadorId || undefined,
        functions: [],
        evaluationCriteria: [],
        members: [],
        status: "ativo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setSubTeams([...subTeams, newSubTeam])
    }
    handleCloseDialog()
  }

  const handleEdit = (subTeam: SubTeam) => {
    setEditingSubTeam(subTeam)
    setFormData({
      name: subTeam.name,
      description: subTeam.description,
      coordenadorId: subTeam.coordenadorId || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = (subTeamId: string) => {
    if (confirm("Tem certeza que deseja excluir este sub-time?")) {
      setSubTeams(subTeams.filter((st) => st.id !== subTeamId))
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingSubTeam(null)
    setFormData({
      name: "",
      description: "",
      coordenadorId: "",
    })
  }

  const getCoordenadorName = (coordenadorId?: string) => {
    if (!coordenadorId) return "Não definido"
    const coordenador = mockTecnicos.find((t) => t.id === coordenadorId)
    return coordenador ? coordenador.name : "Não definido"
  }

  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map((id) => {
        const member = mockTecnicos.find((t) => t.id === id)
        return member ? member.name : null
      })
      .filter(Boolean)
  }

  const getGenderCount = (subTeam: SubTeam, gender: "M" | "F") => {
    return subTeam.members.filter((memberId) => {
      const member = mockTecnicos.find((t) => t.id === memberId)
      return member?.gender === gender
    }).length
  }

  const getSenioridadeCount = (subTeam: SubTeam) => {
    const counts = {
      Auxiliar: 0,
      Junior: 0,
      Pleno: 0,
      Sênior: 0,
      Especialista: 0,
    }

    subTeam.members.forEach((memberId) => {
      const member = mockTecnicos.find((t) => t.id === memberId)
      if (member && member.senioridade in counts) {
        counts[member.senioridade as keyof typeof counts]++
      }
    })

    return counts
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div className="flex items-center space-x-4">
          <Link href="/times">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: team.color }}
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
              <p className="text-muted-foreground mt-1">{team.description}</p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Novo Sub-time
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total de Sub-times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subTeams.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subTeams.reduce((acc, st) => acc + st.members.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{team.department}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Sub-times</h2>
          {subTeams.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum sub-time cadastrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando o primeiro sub-time deste time
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Sub-time
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {subTeams.map((subTeam) => {
                const senioridadeCounts = getSenioridadeCount(subTeam)
                const maleCount = getGenderCount(subTeam, "M")
                const femaleCount = getGenderCount(subTeam, "F")

                return (
                  <Card key={subTeam.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {subTeam.name}
                            <Badge
                              variant={
                                subTeam.status === "ativo" ? "default" : "secondary"
                              }
                            >
                              {subTeam.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {subTeam.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(subTeam)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(subTeam.id)}
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
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                          <TabsTrigger value="functions">Funções</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4 mt-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <UserCircle className="mr-2 h-4 w-4 text-primary" />
                                <span className="font-medium">Líder:</span>
                                <span className="ml-2 text-primary font-semibold">
                                  {getCoordenadorName(subTeam.coordenadorId)}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Membros:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {subTeam.members.length}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <User2 className="mr-2 h-4 w-4 text-blue-500" />
                                <span className="font-medium">Homens:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {maleCount}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <User2 className="mr-2 h-4 w-4 text-pink-500" />
                                <span className="font-medium">Mulheres:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {femaleCount}
                                </span>
                              </div>
                            </div>
                          </div>
                          {subTeam.members.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-sm mb-2">
                                Membros do Sub-time:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {getMemberNames(subTeam.members).map((name) => (
                                  <Badge key={name} variant="outline">
                                    {name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="functions" className="space-y-4 mt-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <Target className="mr-2 h-4 w-4 text-yellow-500" />
                                <span className="font-medium">Auxiliar:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {senioridadeCounts.Auxiliar}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Target className="mr-2 h-4 w-4 text-green-500" />
                                <span className="font-medium">Júnior:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {senioridadeCounts.Junior}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Target className="mr-2 h-4 w-4 text-blue-500" />
                                <span className="font-medium">Pleno:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {senioridadeCounts.Pleno}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <Target className="mr-2 h-4 w-4 text-purple-500" />
                                <span className="font-medium">Sênior:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {senioridadeCounts.Sênior}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Target className="mr-2 h-4 w-4 text-orange-500" />
                                <span className="font-medium">Especialista:</span>
                                <span className="ml-2 text-muted-foreground">
                                  {senioridadeCounts.Especialista}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubTeam ? "Editar Sub-time" : "Criar Novo Sub-time"}
              </DialogTitle>
              <DialogDescription>
                {editingSubTeam
                  ? "Atualize as informações do sub-time"
                  : "Adicione um novo sub-time ao time"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Sub-time *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Linha SMT 1"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coordenador">Coordenador (Líder)</Label>
                <select
                  id="coordenador"
                  className="w-full border border-input rounded p-2 bg-white h-10"
                  value={formData.coordenadorId}
                  onChange={(e) =>
                    setFormData({ ...formData, coordenadorId: e.target.value })
                  }
                >
                  <option value="">Selecione um coordenador (opcional)</option>
                  {availableCoordinators.map((coord) => (
                    <option key={coord.id} value={coord.id}>
                      {coord.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Somente coordenadores cadastrados no sistema podem ser selecionados
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva as responsabilidades do sub-time..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleCreateOrUpdate}>
                {editingSubTeam ? "Salvar Alterações" : "Criar Sub-time"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
