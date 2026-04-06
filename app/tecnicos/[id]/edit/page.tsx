"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth, useNotification } from "@/core/contexts"
import { AppLayout } from "@/shared/components/layout"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Textarea } from "@/shared/components/ui/textarea"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Loader2, ArrowLeft, AlertCircle, Save, Upload, User, Briefcase, Users, Calendar, Shield } from "lucide-react"
import { tecnicosService, teamsService, subtimesService } from "@/core/services"
import type { Tecnico, Team, SubTeam } from "@/core/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

type Senioridade = "Auxiliar" | "Junior" | "Pleno" | "Sênior" | "Especialista" | "Coordenador" | "Supervisor"
type Area = "Produção" | "Manutenção" | "Qualidade" | "Engenharia" | "Logística" | "Administrativa" | "Outro"

type FormData = {
  name: string
  workday: string
  cargo: string
  senioridade: Senioridade | ""
  area: Area | ""
  shift: "1T" | "2T" | "3T" | "ADM" | ""
  department: string
  teamId: string
  subtimeId: string
  ledSubtimeId?: string
  gender: "M" | "F" | ""
  joinDate: string
  email: string
  password: string
  status: boolean
}

export default function EditTecnicoPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useNotification()
  const tecnicoId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [subtimes, setSubtimes] = useState<SubTeam[]>([])
  const [availableSubtimes, setAvailableSubtimes] = useState<SubTeam[]>([])
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hasEvaluations, setHasEvaluations] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    workday: "",
    cargo: "",
    senioridade: "",
    area: "",
    shift: "",
    department: "",
    teamId: "",
    subtimeId: "",
    gender: "",
    joinDate: "",
    email: "",
    password: "",
    status: true,
  })

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [tecnicoId])

  // Atualizar subtimes disponíveis quando team mudar
  useEffect(() => {
    if (formData.teamId) {
      const filtered = subtimes.filter(st => st.parentTeamId === formData.teamId)
      setAvailableSubtimes(filtered)
      
      // Limpar subtime se não pertencer ao novo time
      if (formData.subtimeId) {
        const isValid = filtered.some(st => st.id === formData.subtimeId)
        if (!isValid) {
          setFormData(prev => ({ ...prev, subtimeId: "" }))
        }
      }
    } else {
      setAvailableSubtimes([])
    }
  }, [formData.teamId, subtimes])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [tecnicoData, teamsData, subtimesData] = await Promise.all([
        tecnicosService.findOne(tecnicoId),
        teamsService.findAll(),
        subtimesService.findAll(),
      ])

      setTecnico(tecnicoData)
      setTeams(teamsData)
      setSubtimes(subtimesData)

      // Verificar se tem avaliações (se o campo existir)
      setHasEvaluations((tecnicoData as any).evaluations?.length > 0 || false)

      // Carregar foto se existir
      if (tecnicoData.photoUrl) {
        setProfilePhoto(`${API_BASE_URL}${tecnicoData.photoUrl}`)
      }

      // Preencher formulário
      setFormData({
        name: tecnicoData.name || "",
        workday: tecnicoData.workday || "",
        cargo: tecnicoData.cargo || "",
        senioridade: (tecnicoData.senioridade as Senioridade) || "",
        area: (tecnicoData.area as Area) || "",
        shift: (tecnicoData.shift as "1T" | "2T" | "3T" | "ADM") || "",
        department: tecnicoData.department || "",
        teamId: tecnicoData.teamId || "",
        subtimeId: tecnicoData.subtimeId || "",
        ledSubtimeId: tecnicoData.ledSubtimeId || "",
        gender: (tecnicoData.gender === "O" ? "" : tecnicoData.gender) || "",
        joinDate: tecnicoData.joinDate ? new Date(tecnicoData.joinDate).toISOString().split('T')[0] : "",
        email: tecnicoData.email || "",
        password: "",
        status: tecnicoData.status !== false,
      })
    } catch (err) {
      console.error("❌ Erro ao carregar dados:", err)
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar técnico"
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError('Por favor, selecione uma imagem válida')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showError('A imagem deve ter no máximo 5MB')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setProfilePhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!formData.name || !formData.workday) {
      showError("Nome e matrícula são obrigatórios")
      return
    }

    // Validação para Supervisores e Coordenadores
    if (formData.senioridade === "Supervisor" || formData.senioridade === "Coordenador") {
      if (!formData.email) {
        showError(`E-mail é obrigatório para ${formData.senioridade === "Supervisor" ? "supervisores" : "coordenadores"}`)
        return
      }
      
      // Se não tem conta ainda, precisa de senha
      if (!(tecnico as any).hasUserAccount && !formData.password) {
        showError("Senha é obrigatória para criar a conta de acesso")
        return
      }

      // Validar tamanho mínimo da senha se informada
      if (formData.password && formData.password.length < 8) {
        showError("A senha deve ter no mínimo 8 caracteres")
        return
      }

      // Coordenadores precisam de ledSubtimeId
      if (formData.senioridade === "Coordenador" && !formData.ledSubtimeId) {
        showError("Coordenadores precisam ter um sub-time atribuído")
        return
      }
    }

    try {
      setSubmitting(true)

      // Preparar dados para envio (remover campos vazios)
      const dataToSend: any = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && !(key === "password" && value === "")) {
          dataToSend[key] = value
        }
      })

      // Remover password se estiver vazio (não vai alterar)
      if (!dataToSend.password) {
        delete dataToSend.password
      }

      await tecnicosService.update(tecnicoId, dataToSend)

      // Upload de foto se houver
      if (photoFile) {
        try {
          setUploadingPhoto(true)
          await tecnicosService.uploadPhoto(tecnicoId, photoFile)
        } catch (photoErr) {
          console.warn('⚠️ Erro ao fazer upload da foto:', photoErr)
          // Não bloqueia o sucesso da atualização
        } finally {
          setUploadingPhoto(false)
        }
      }

      success("Colaborador atualizado com sucesso!")
      router.push(`/tecnicos/${tecnicoId}`)
    } catch (err: any) {
      console.error("❌ Erro ao atualizar técnico:", err)
      showError(err.message || "Erro ao atualizar colaborador")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando dados do colaborador...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error || !tecnico) {
    return (
      <AppLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error || "Colaborador não encontrado"}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadData}>
                  Tentar novamente
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/tecnicos")}>
                  Voltar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push(`/tecnicos/${tecnicoId}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar Colaborador</h1>
          <p className="text-muted-foreground mt-1">
            Atualize as informações do colaborador {tecnico.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Foto de Perfil
              </CardTitle>
              <CardDescription>
                Atualize a foto do colaborador (JPEG, PNG, WEBP ou GIF - máx. 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePhoto || undefined} alt={formData.name} />
                  <AvatarFallback className="text-2xl">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "??"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Foto
                    </Button>
                    {profilePhoto && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemovePhoto}
                        disabled={uploadingPhoto}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {photoFile ? `Arquivo selecionado: ${photoFile.name}` : "JPEG, PNG, WEBP ou GIF (máx. 5MB)"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Nome do colaborador"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workday">
                    Matrícula (Workday) *
                    {hasEvaluations && (
                      <span className="text-xs text-yellow-600 ml-2">
                        (Bloqueada - possui avaliações)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="workday"
                    value={formData.workday}
                    onChange={(e) => setFormData({ ...formData, workday: e.target.value })}
                    required
                    disabled={hasEvaluations}
                    placeholder="Matrícula única"
                  />
                  {hasEvaluations && (
                    <p className="text-xs text-muted-foreground">
                      A matrícula não pode ser alterada pois o técnico possui avaliações vinculadas
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <select
                    id="gender"
                    className="w-full border border-input rounded-md p-2 bg-background h-10"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "M" | "F" })}
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinDate">Data de Admissão</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo e Hierarquia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Cargo e Hierarquia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    required
                    placeholder="Ex: Técnico de Manutenção"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senioridade">Senioridade *</Label>
                  <select
                    id="senioridade"
                    className="w-full border border-input rounded-md p-2 bg-background h-10"
                    value={formData.senioridade}
                    onChange={(e) =>
                      setFormData({ ...formData, senioridade: e.target.value as Senioridade })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Auxiliar">Auxiliar</option>
                    <option value="Junior">Junior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                    <option value="Especialista">Especialista</option>
                    <option value="Coordenador">Coordenador</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Área *</Label>
                  <select
                    id="area"
                    className="w-full border border-input rounded-md p-2 bg-background h-10"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value as Area })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Produção">Produção</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Qualidade">Qualidade</option>
                    <option value="Engenharia">Engenharia</option>
                    <option value="Logística">Logística</option>
                    <option value="Administrativa">Administrativa</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shift">Turno *</Label>
                  <select
                    id="shift"
                    className="w-full border border-input rounded-md p-2 bg-background h-10"
                    value={formData.shift}
                    onChange={(e) =>
                      setFormData({ ...formData, shift: e.target.value as "1T" | "2T" | "3T" | "ADM" })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="1T">1º Turno</option>
                    <option value="2T">2º Turno</option>
                    <option value="3T">3º Turno</option>
                    <option value="ADM">Administrativo</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Ex: Manutenção Industrial"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time e Estrutura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Time e Estrutura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamId">Time</Label>
                  <select
                    id="teamId"
                    className="w-full border border-input rounded-md p-2 bg-background h-10"
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                  >
                    <option value="">Sem time</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtimeId">Sub-time</Label>
                  <select
                    id="subtimeId"
                    className="w-full border border-input rounded-md p-2 bg-background h-10"
                    value={formData.subtimeId}
                    onChange={(e) => setFormData({ ...formData, subtimeId: e.target.value })}
                    disabled={!formData.teamId}
                  >
                    <option value="">Sem sub-time</option>
                    {availableSubtimes.map((subtime) => (
                      <option key={subtime.id} value={subtime.id}>
                        {subtime.name}
                      </option>
                    ))}
                  </select>
                  {!formData.teamId && (
                    <p className="text-xs text-muted-foreground">
                      Selecione um time primeiro
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credenciais de Supervisor/Coordenador */}
          {(formData.senioridade === "Supervisor" || formData.senioridade === "Coordenador") && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Shield className="h-5 w-5" />
                  Credenciais de Acesso
                </CardTitle>
                <CardDescription>
                  {formData.senioridade === "Supervisor" 
                    ? "Supervisores precisam de um e-mail para acessar o sistema"
                    : "Coordenadores precisam de um e-mail e sub-time para acessar o sistema"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-300 bg-blue-100">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <AlertDescription className="text-blue-700">
                    {!(tecnico as any).hasUserAccount 
                      ? "Uma conta de usuário será criada automaticamente ao salvar"
                      : `Este ${formData.senioridade.toLowerCase()} já possui uma conta de acesso no sistema`}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="email@empresa.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {!(tecnico as any).hasUserAccount 
                        ? "Senha * (necessária para criar conta)" 
                        : "Nova Senha (deixe em branco para não alterar)"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={!(tecnico as any).hasUserAccount ? "Mínimo 8 caracteres" : "Deixe vazio para não alterar"}
                      minLength={8}
                      required={!(tecnico as any).hasUserAccount}
                    />
                    <p className="text-xs text-muted-foreground">
                      {!(tecnico as any).hasUserAccount 
                        ? `Será criada uma conta de acesso para este ${formData.senioridade.toLowerCase()}`
                        : "Preencha apenas se desejar alterar a senha atual"}
                    </p>
                  </div>

                  {formData.senioridade === "Coordenador" && (
                    <div className="space-y-2">
                      <Label htmlFor="ledSubtimeId">Sub-time que o Coordenador lidera *</Label>
                      <select
                        id="ledSubtimeId"
                        className="w-full border border-input rounded-md p-2 bg-background h-10"
                        value={formData.ledSubtimeId || ""}
                        onChange={(e) => setFormData({ ...formData, ledSubtimeId: e.target.value })}
                        required
                      >
                        <option value="">Selecione...</option>
                        {subtimes.map((subtime) => (
                          <option key={subtime.id} value={subtime.id}>
                            {subtime.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">
                        O coordenador terá acesso aos técnicos deste sub-time
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, status: checked as boolean })
                  }
                />
                <Label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Colaborador ativo
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-6">
                Desmarque para inativar o colaborador no sistema
              </p>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tecnicos/${tecnicoId}`)}
              disabled={submitting || uploadingPhoto}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || uploadingPhoto} size="lg">
              {submitting || uploadingPhoto ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadingPhoto ? "Enviando foto..." : "Salvando..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
