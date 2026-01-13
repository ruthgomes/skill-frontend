"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  Target,
  ClipboardList,
  UserCircle,
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
import { Progress } from "@/components/ui/progress"
import {
  mockTeams,
  mockSubTeams,
  mockTecnicos,
  type SubTeam,
  type EvaluationCriteria,
  type TeamFunction,
} from "@/lib/data"
import Link from "next/link"

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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

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
    if (editingSubTeam) {
      setSubTeams(
        subTeams.map((st) =>
          st.id === editingSubTeam.id
            ? {
                ...st,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : st
        )
      )
    } else {
      const newSubTeam: SubTeam = {
        id: `subteam${subTeams.length + 1}`,
        ...formData,
        parentTeamId: teamId,
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
    })
  }

  const getLeaderName = (leaderId?: string) => {
    if (!leaderId) return "Não definido"
    const leader = mockTecnicos.find((t) => t.id === leaderId)
    return leader ? leader.name : "Não definido"
  }

  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map((id) => {
        const member = mockTecnicos.find((t) => t.id === id)
        return member ? member.name : null
      })
      .filter(Boolean)
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
              {subTeams.map((subTeam) => (
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
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
                        <TabsTrigger value="functions">Funções</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Líder:</span>
                              <span className="ml-2 text-muted-foreground">
                                {getLeaderName(subTeam.leaderId)}
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
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Critérios:</span>
                              <span className="ml-2 text-muted-foreground">
                                {subTeam.evaluationCriteria.length}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Funções:</span>
                              <span className="ml-2 text-muted-foreground">
                                {subTeam.functions.length}
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

                      <TabsContent value="evaluations" className="space-y-4 mt-4">
                        {subTeam.evaluationCriteria.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Nenhum critério de avaliação definido
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {subTeam.evaluationCriteria.map((criteria) => (
                              <div
                                key={criteria.id}
                                className="p-4 border rounded-lg space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">
                                    {criteria.name}
                                  </h4>
                                  <Badge variant="secondary">
                                    Peso: {criteria.weight}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {criteria.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Progress value={criteria.weight} className="flex-1" />
                                  <span className="text-xs text-muted-foreground">
                                    Max: {criteria.maxScore}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="functions" className="space-y-4 mt-4">
                        {subTeam.functions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Nenhuma função definida
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {subTeam.functions.map((func) => (
                              <div
                                key={func.id}
                                className="p-4 border rounded-lg space-y-2"
                              >
                                <h4 className="font-semibold text-sm">{func.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {func.description}
                                </p>
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    Responsabilidades:
                                  </p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {func.responsibilities.map((resp, idx) => (
                                      <li key={idx} className="text-sm">
                                        {resp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
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
                : `Adicione um novo sub-time ao time ${team.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Sub-time</Label>
              <Input
                id="name"
                placeholder="Ex: Spare Parts"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
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
              {editingSubTeam ? "Atualizar" : "Criar Sub-time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AppLayout>
  )
}
