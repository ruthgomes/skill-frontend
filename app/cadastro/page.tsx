"use client"

import { useAuth, useNotification } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/shared/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useState, useEffect } from "react"
import { MACHINES, SKILLS, mockTeams, mockSubTeams, type Senioridade, type Area } from "@/shared/data"
import { Settings, Plus, Edit, Trash2, Upload, X } from "lucide-react"

type ColaboradorForm = {
  name: string
  workday: string
  cargo: string
  senioridade: Senioridade | ""
  area: Area | ""
  shift: "1T" | "2T" | "3T" | ""
  department: string
  teamId: string
  subtimeId: string
  gender: "M" | "F" | ""
}

type MachineForm = {
  name: string
  teamId: string
}

type SkillForm = {
  name: string
  teamId: string
  subtimeId: string
}

export default function CadastroPage() {
  const { user } = useAuth()
  const { success, error: showError, warning } = useNotification()
  const router = useRouter()
  const [machines, setMachines] = useState(MACHINES)
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
    gender: ""
  })

  const [machineForm, setMachineForm] = useState<MachineForm>({
    name: "",
    teamId: ""
  })

  const [skillForm, setSkillForm] = useState<SkillForm>({
    name: "",
    teamId: "",
    subtimeId: ""
  })

  const [availableSubtimes, setAvailableSubtimes] = useState<any[]>([])

  useEffect(() => {
    if (colaboradorForm.teamId) {
      const subtimes = mockSubTeams.filter(st => st.parentTeamId === colaboradorForm.teamId)
      setAvailableSubtimes(subtimes)
    } else {
      setAvailableSubtimes([])
      setColaboradorForm(prev => ({ ...prev, subtimeId: "" }))
    }
  }, [colaboradorForm.teamId])

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  const machineSkills = (machineCode: string) => {
    return SKILLS.filter(skill => skill.category === machineCode)
  }

  const selectedMachineData = machines.find(m => m.id === selectedMachine)
  const selectedMachineSkills = selectedMachine ? machineSkills(selectedMachineData?.code || "") : []

  const handleAddMachine = () => {
    if (!machineForm.name || !machineForm.teamId) {
      showError("Preencha todos os campos!")
      return
    }

    // TODO: Integrar com backend
    success(`Máquina ${machineForm.name} cadastrada com sucesso para o time!`)
    setMachineForm({ name: "", teamId: "" })
  }

  const handleAddSkill = () => {
    if (!skillForm.name || !skillForm.teamId || !skillForm.subtimeId) {
      showError("Preencha todos os campos!")
      return
    }

    // TODO: Integrar com backend
    success(`Habilidade ${skillForm.name} cadastrada com sucesso!`)
    setSkillForm({ name: "", teamId: "", subtimeId: "" })
  }

  const handleAddColaborador = () => {
    if (!colaboradorForm.name || !colaboradorForm.workday || !colaboradorForm.cargo || 
        !colaboradorForm.senioridade || !colaboradorForm.area || !colaboradorForm.shift || 
        !colaboradorForm.department || !colaboradorForm.gender) {
      showError("Preencha todos os campos obrigatórios!")
      return
    }

    // Se não for Supervisor, precisa ter time e sub-time
    if (colaboradorForm.senioridade !== "Supervisor") {
      if (!colaboradorForm.teamId || !colaboradorForm.subtimeId) {
        warning("Colaboradores não-supervisores precisam ter Time e Sub-time definidos!")
        return
      }
    }

    // TODO: Integrar com backend
    success(`Colaborador ${colaboradorForm.name} cadastrado com sucesso!`)
    
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
      gender: ""
    })
    setProfilePhoto(null)
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
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Workday <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="Ex: WDC00001" 
                      className="border-primary/20"
                      value={colaboradorForm.workday}
                      onChange={(e) => setColaboradorForm({ ...colaboradorForm, workday: e.target.value })}
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
                      <option value="1T">1T</option>
                      <option value="2T">2T</option>
                      <option value="3T">3T</option>
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
                          {mockTeams.filter(t => t.status === "ativo").map((team) => (
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
                >
                  Cadastrar Colaborador
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome da Máquina <span className="text-red-500">*</span></label>
                    <Input
                      value={machineForm.name}
                      onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                      placeholder="Ex: LASER"
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Time <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={machineForm.teamId}
                      onChange={(e) => setMachineForm({ ...machineForm, teamId: e.target.value })}
                    >
                      <option value="">Selecione um time</option>
                      {mockTeams.filter(t => t.status === "ativo").map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full" onClick={handleAddMachine}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Máquina
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
                    const skillCount = machineSkills(machine.code).length
                    const team = mockTeams.find(t => t.id === machine.teamId)
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
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Time <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-card text-card-foreground h-10"
                      value={skillForm.teamId}
                      onChange={(e) => {
                        setSkillForm({ ...skillForm, teamId: e.target.value, subtimeId: "" })
                      }}
                    >
                      <option value="">Selecione um time</option>
                      {mockTeams.filter(t => t.status === "ativo").map((team) => (
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
                      disabled={!skillForm.teamId}
                    >
                      <option value="">Selecione um sub-time</option>
                      {mockSubTeams
                        .filter(st => st.parentTeamId === skillForm.teamId)
                        .map((subtime) => (
                          <option key={subtime.id} value={subtime.id}>
                            {subtime.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full" onClick={handleAddSkill}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Habilidade
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
