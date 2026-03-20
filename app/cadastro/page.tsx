"use client"

import { useAuth, useNotification } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/shared/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useState, useEffect } from "react"
import { Settings, Plus, Upload, X, Loader2, AlertCircle } from "lucide-react"
import { 
  tecnicosService, 
  teamsService, 
  subtimesService, 
  machinesService, 
  skillsService 
} from "@/core/services"
import { SkillLevel } from "@/core/types"
import type { Team, SubTeam, Machine, Skill } from "@/core/types"

type Senioridade = 'Auxiliar' | 'Junior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenador' | 'Supervisor'
type Area = 'Produção' | 'Manutenção' | 'Qualidade' | 'Engenharia' | 'Logística' | 'Administrativa' | 'Outro'

type ColaboradorForm = {
  name: string
  workday: string // Matrícula do colaborador
  cargo: string
  senioridade: Senioridade | ""
  area: Area | ""
  shift: "1T" | "2T" | "3T" | "ADM" | ""
  department: string
  teamId: string
  subtimeId: string
  gender: "M" | "F" | ""
  joinDate: string
  // Sistema Multi-Supervisor: credenciais obrigatórias se senioridade = Supervisor
  email: string
  password: string
}

type MachineForm = {
  name: string
  code: string
  teamId: string
}

type SkillForm = {
  name: string
  category: string
  teamId: string
  subtimeId: string
  machineId: string
}

export default function CadastroPage() {
  const { user } = useAuth()
  const { success, error: showError, warning } = useNotification()
  const router = useRouter()
  
  // Estados de dados do backend
  const [teams, setTeams] = useState<Team[]>([])
  const [subtimes, setSubtimes] = useState<SubTeam[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  
  const [colaboradorForm, setColaboradorForm] = useState<ColaboradorForm>({
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
  })

  const [machineForm, setMachineForm] = useState<MachineForm>({
    name: "",
    code: "",
    teamId: ""
  })

  const [skillForm, setSkillForm] = useState<SkillForm>({
    name: "",
    category: "",
    teamId: "",
    subtimeId: "",
    machineId: "",
  })

  const [availableSubtimes, setAvailableSubtimes] = useState<SubTeam[]>([])

  // Buscar dados do backend
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Buscando dados de cadastro...')
      
      const [teamsData, subtimesData, machinesData, skillsData] = await Promise.all([
        teamsService.findAll(),
        subtimesService.findAll(),
        machinesService.findAll(),
        skillsService.findAll(),
      ])
      
      console.log('✅ Dados carregados:', {
        teams: teamsData.length,
        subtimes: subtimesData.length,
        machines: machinesData.length,
        skills: skillsData.length,
      })
      
      setTeams(teamsData)
      setSubtimes(subtimesData)
      setMachines(machinesData)
      setSkills(skillsData)
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (colaboradorForm.teamId) {
      const filteredSubtimes = subtimes.filter(st => st.parentTeamId === colaboradorForm.teamId)
      setAvailableSubtimes(filteredSubtimes)
    } else {
      setAvailableSubtimes([])
      setColaboradorForm(prev => ({ ...prev, subtimeId: "" }))
    }
  }, [colaboradorForm.teamId, subtimes])

  if (!user || user.role !== "master") {
    router.replace("/login")
    return null
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando dados de cadastro...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={fetchAllData} variant="outline" className="w-full">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const machineSkills = (machineId: string) => {
    return skills.filter(skill => skill.machineId === machineId)
  }

  const selectedMachineData = machines.find(m => m.id === selectedMachine)
  const selectedMachineSkills = selectedMachine ? machineSkills(selectedMachine) : []

  const handleAddMachine = async () => {
    if (!machineForm.name || !machineForm.code || !machineForm.teamId) {
      showError("Preencha todos os campos!")
      return
    }

    try {
      setSubmitting(true)
      console.log('🔄 Criando máquina...', machineForm)
      
      await machinesService.create({
        ...machineForm,
        code: machineForm.code.toUpperCase(),
      })
      
      success(`Máquina ${machineForm.name} cadastrada com sucesso!`)
      console.log('✅ Máquina criada')
      
      await fetchAllData()
      setMachineForm({ name: "", code: "", teamId: "" })
    } catch (err) {
      console.error('❌ Erro ao criar máquina:', err)
      showError(err instanceof Error ? err.message : 'Erro ao cadastrar máquina')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddSkill = async () => {
    if (!skillForm.name || !skillForm.category || !skillForm.teamId || !skillForm.subtimeId || !skillForm.machineId) {
      showError("Preencha todos os campos obrigatórios!")
      return
    }

    try {
      setSubmitting(true)
      console.log('🔄 Criando habilidade...', skillForm)
      
      await skillsService.create({
        name: skillForm.name,
        category: skillForm.category,
        teamId: skillForm.teamId,
        subtimeId: skillForm.subtimeId,
        machineId: skillForm.machineId,
        level: SkillLevel.INTERMEDIARIO, // Valor padrão do enum SkillLevel
      })
      
      success(`Habilidade ${skillForm.name} cadastrada com sucesso!`)
      console.log('✅ Habilidade criada')
      
      await fetchAllData()
      setSkillForm({ name: "", category: "", teamId: "", subtimeId: "", machineId: "" })
    } catch (err) {
      console.error('❌ Erro ao criar habilidade:', err)
      showError(err instanceof Error ? err.message : 'Erro ao cadastrar habilidade')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddColaborador = async () => {
    if (!colaboradorForm.name || !colaboradorForm.workday || !colaboradorForm.cargo || 
        !colaboradorForm.senioridade || !colaboradorForm.area || !colaboradorForm.shift || 
        !colaboradorForm.department || !colaboradorForm.gender || !colaboradorForm.joinDate) {
      showError("Preencha todos os campos obrigatórios!")
      return
    }

    // Se for Supervisor, email e password são obrigatórios
    if (colaboradorForm.senioridade === "Supervisor") {
      if (!colaboradorForm.email || !colaboradorForm.password) {
        showError("E-mail e senha são obrigatórios para Supervisores!")
        return
      }
      if (colaboradorForm.password.length < 8) {
        showError("Senha deve ter no mínimo 8 caracteres!")
        return
      }
    }

    // Se não for Supervisor, precisa ter time e sub-time
    if (colaboradorForm.senioridade !== "Supervisor") {
      if (!colaboradorForm.teamId || !colaboradorForm.subtimeId) {
        warning("Colaboradores não-supervisores precisam ter Time e Sub-time definidos!")
        return
      }
    }

    try {
      setSubmitting(true)
      console.log('🔄 Criando técnico...', colaboradorForm)
      
      // Mapear dados do formulário para a estrutura esperada pelo backend
      const tecnicoData: any = {
        name: colaboradorForm.name,
        teamId: colaboradorForm.teamId || undefined,
        subtimeId: colaboradorForm.subtimeId || undefined,
        joinDate: colaboradorForm.joinDate, // Data de admissão no formato ISO 8601
        // Campos adicionais do backend
        workday: colaboradorForm.workday,
        cargo: colaboradorForm.cargo,
        senioridade: colaboradorForm.senioridade as string,
        area: colaboradorForm.area as string,
        shift: colaboradorForm.shift,
        department: colaboradorForm.department,
        gender: colaboradorForm.gender,
      }

      // Adicionar credenciais se for Supervisor
      if (colaboradorForm.senioridade === "Supervisor") {
        tecnicoData.email = colaboradorForm.email
        tecnicoData.password = colaboradorForm.password
      }
      
      await tecnicosService.create(tecnicoData)
      
      success(`Colaborador ${colaboradorForm.name} cadastrado com sucesso!`)
      console.log('✅ Técnico criado')
      
      // Reset form
      setColaboradorForm({
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
      })
      setProfilePhoto(null)
    } catch (err) {
      console.error('❌ Erro ao criar técnico:', err)
      showError(err instanceof Error ? err.message : 'Erro ao cadastrar colaborador')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setProfilePhoto(null)
  }

  const isSupervisor = colaboradorForm.senioridade === "Supervisor"

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-primary">Cadastro</h1>
          <p className="text-muted-foreground mt-2">Gerenciar colaboradores, máquinas e habilidades</p>
        </div>

        <Tabs defaultValue="colaborador" className="space-y-4 w-full">
          <TabsList className="bg-secondary">
            <TabsTrigger value="colaborador">Novo Colaborador</TabsTrigger>
            <TabsTrigger value="machines">Máquinas</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
          </TabsList>

          {/* Novo Colaborador Tab */}
          <TabsContent value="colaborador" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Cadastrar Novo Colaborador</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cadastre colaboradores de todos os níveis neste formulário
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Photo Upload */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {profilePhoto ? (
                      <div className="relative">
                        <img 
                          src={profilePhoto} 
                          alt="Foto do Colaborador" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                        />
                        <button
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex flex-col items-center justify-center border-2 border-dashed border-primary hover:bg-gray-300 transition">
                          <Upload size={32} className="text-primary mb-2" />
                          <span className="text-xs text-gray-600">Adicionar Foto</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome Completo <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="Nome completo" 
                      className="border-primary/20"
                      value={colaboradorForm.name}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, name: e.target.value })}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Data de Admissão <span className="text-red-500">*</span></label>
                    <Input 
                      type="date"
                      className="border-primary/20"
                      value={colaboradorForm.joinDate}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, joinDate: e.target.value })}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Matrícula (Workday) <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="Ex: WDC00123, MAT12345" 
                      className="border-primary/20"
                      value={colaboradorForm.workday}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, workday: e.target.value.toUpperCase() })}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Cargo <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="Ex: Engenheiro de Produção" 
                      className="border-primary/20"
                      value={colaboradorForm.cargo}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, cargo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Senioridade <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={colaboradorForm.senioridade}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, senioridade: e.target.value as Senioridade })}
                    >
                      <option value="">Selecione a senioridade</option>
                      <option value="Auxiliar">Auxiliar</option>
                      <option value="Junior">Júnior</option>
                      <option value="Pleno">Pleno</option>
                      <option value="Sênior">Sênior</option>
                      <option value="Especialista">Especialista</option>
                      <option value="Coordenador">Coordenador</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Área <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={colaboradorForm.area}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, area: e.target.value as Area })}
                    >
                      <option value="">Selecione a área</option>
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
                    <label className="text-sm font-semibold">Turno <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={colaboradorForm.shift}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, shift: e.target.value as "1T" | "2T" | "3T" })}
                    >
                      <option value="">Selecione o turno</option>
                      <option value="1T">1T - Primeiro Turno</option>
                      <option value="2T">2T - Segundo Turno</option>
                      <option value="3T">3T - Terceiro Turno</option>
                      <option value="ADM">ADM - Administrativo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Departamento <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="Ex: Engenharia" 
                      className="border-primary/20"
                      value={colaboradorForm.department}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Gênero <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={colaboradorForm.gender}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, gender: e.target.value as "M" | "F" })}
                    >
                      <option value="">Selecione o gênero</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                  
                  {/* Campos condicionais para Supervisor */}
                  {isSupervisor && (
                    <>
                      <div className="col-span-2">
                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            🔑 Ao cadastrar um Supervisor, uma conta de usuário será criada automaticamente com as credenciais informadas abaixo.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">
                          E-mail do Supervisor <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          type="email"
                          placeholder="supervisor@empresa.com" 
                          className="border-primary/20"
                          value={colaboradorForm.email}
                          onChange={(e) => setColaboradorForm({ ...colaboradorForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">
                          Senha <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          type="password"
                          placeholder="Mínimo 8 caracteres" 
                          className="border-primary/20"
                          value={colaboradorForm.password}
                          onChange={(e) => setColaboradorForm({ ...colaboradorForm, password: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Senha deve ter no mínimo 8 caracteres
                        </p>
                      </div>
                    </>
                  )}
                  
                  {!isSupervisor && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className="w-full border border-primary/20 rounded p-2 bg-white h-10"
                          value={colaboradorForm.teamId}
                          onChange={(e) => setColaboradorForm({ ...colaboradorForm, teamId: e.target.value })}
                        >
                          <option value="">Selecione um time</option>
                          {teams.filter(t => t.status).map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">
                          Sub-time <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                          value={colaboradorForm.subtimeId}
                          onChange={(e) => setColaboradorForm({ ...colaboradorForm, subtimeId: e.target.value })}
                          disabled={!colaboradorForm.teamId}
                        >
                          <option value="">Selecione um sub-time</option>
                          {availableSubtimes.map((subtime) => (
                            <option key={subtime.id} value={subtime.id}>
                              {subtime.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {isSupervisor && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Supervisores não são alocados a times específicos. 
                      Eles criarão seus próprios times após o cadastro.
                    </p>
                  </div>
                )}

                <Button 
                  className="bg-primary hover:bg-primary/90 w-full" 
                  onClick={handleAddColaborador}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar Colaborador"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Machines Tab */}
          <TabsContent value="machines" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Cadastrar Nova Máquina</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cada máquina deve ser vinculada a um time específico
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome da Máquina <span className="text-red-500">*</span></label>
                    <Input
                      value={machineForm.name}
                      onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                      placeholder="Ex: LASER"
                      className="border-primary/20"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Código <span className="text-red-500">*</span></label>
                    <Input
                      value={machineForm.code}
                      onChange={(e) => setMachineForm({ ...machineForm, code: e.target.value })}
                      placeholder="Ex: LSR-01"
                      className="border-primary/20"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Time <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={machineForm.teamId}
                      onChange={(e) => setMachineForm({ ...machineForm, teamId: e.target.value })}
                      disabled={submitting}
                    >
                      <option value="">Selecione um time</option>
                      {teams.filter(t => t.status).map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full" onClick={handleAddMachine} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Máquina
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Machine Cards */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Máquinas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Clique em uma máquina para ver e gerenciar suas habilidades específicas
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {machines.map((machine) => {
                    const skillCount = machineSkills(machine.id).length
                    const team = teams.find(t => t.id === machine.teamId)
                    return (
                      <Card
                        key={machine.id}
                        className="border-primary/20 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => setSelectedMachine(machine.id)}
                      >
                        <CardContent className="pt-6 text-center">
                          <div className="mb-3 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Settings className="w-8 h-8 text-primary" />
                            </div>
                          </div>
                          <h3 className="font-bold text-lg text-primary mb-1">{machine.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{team?.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {skillCount} habilidades
                          </Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Cadastrar Nova Habilidade</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cada habilidade deve ser vinculada a um time e sub-time específico
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome da Habilidade <span className="text-red-500">*</span></label>
                    <Input
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="Ex: Manutenção Preventiva"
                      className="border-primary/20"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Categoria <span className="text-red-500">*</span></label>
                    <Input
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      placeholder="Ex: Técnica"
                      className="border-primary/20"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Máquina <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={skillForm.machineId}
                      onChange={(e) => setSkillForm({ ...skillForm, machineId: e.target.value })}
                      disabled={submitting}
                    >
                      <option value="">Selecione uma máquina</option>
                      {machines.filter(m => m.status).map((machine) => (
                        <option key={machine.id} value={machine.id}>
                          {machine.name} ({machine.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Time <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={skillForm.teamId}
                      onChange={(e) => {
                        setSkillForm({ ...skillForm, teamId: e.target.value, subtimeId: "" })
                      }}
                      disabled={submitting}
                    >
                      <option value="">Selecione um time</option>
                      {teams.filter(t => t.status).map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Sub-time <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={skillForm.subtimeId}
                      onChange={(e) => setSkillForm({ ...skillForm, subtimeId: e.target.value })}
                      disabled={!skillForm.teamId || submitting}
                    >
                      <option value="">Selecione um sub-time</option>
                      {subtimes
                        .filter(st => st.parentTeamId === skillForm.teamId)
                        .map((subtime) => (
                          <option key={subtime.id} value={subtime.id}>
                            {subtime.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full" onClick={handleAddSkill} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Habilidade
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Machine Skills Modal */}
      <Dialog open={selectedMachine !== null} onOpenChange={() => setSelectedMachine(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">
              {selectedMachineData?.name}
            </DialogTitle>
            <DialogDescription>
              Habilidades específicas desta máquina
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {selectedMachineSkills.length > 0 ? (
              selectedMachineSkills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-primary">{skill.name}</h4>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma habilidade cadastrada para esta máquina ainda.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
