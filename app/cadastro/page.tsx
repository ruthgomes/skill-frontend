"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { MACHINES, SKILLS, mockTeams } from "@/lib/data"
import { Settings, Plus, Edit, Trash2 } from "lucide-react"

export default function CadastroPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [machineForm, setMachineForm] = useState({ name: "", code: "" })
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [newSkillName, setNewSkillName] = useState("")
  const [skillForm, setSkillForm] = useState({ name: "", category: "" })
  const [machines, setMachines] = useState(MACHINES)

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
    if (!machineForm.name || !machineForm.code) {
      alert("Preencha todos os campos!")
      return
    }

    const newMachine = {
      id: `${machines.length + 1}`,
      name: machineForm.name,
      code: machineForm.code,
    }

    setMachines([...machines, newMachine])
    setMachineForm({ name: "", code: "" })
    alert(`Máquina ${newMachine.name} cadastrada com sucesso!`)
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-primary">Cadastro</h1>
          <p className="text-muted-foreground mt-2">Gerenciar máquinas, habilidades e técnicos</p>
        </div>

        <Tabs defaultValue="machines" className="space-y-4 w-full">
          <TabsList className="bg-secondary">
            <TabsTrigger value="machines">Máquinas</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="new-operator">Novo Técnico</TabsTrigger>
          </TabsList>

          {/* Machines Tab */}
          <TabsContent value="machines" className="space-y-4">
            {/* Add New Machine Form */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Cadastrar Nova Máquina</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome da Máquina</label>
                    <Input
                      value={machineForm.name}
                      onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                      placeholder="Ex: LASER"
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Código</label>
                    <Input
                      value={machineForm.code}
                      onChange={(e) => setMachineForm({ ...machineForm, code: e.target.value })}
                      placeholder="Ex: LASER"
                      className="border-primary/20"
                    />
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
                          <p className="text-xs text-muted-foreground mb-3">{machine.code}</p>
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
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome da Habilidade</label>
                    <Input
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="Ex: Manutenção Preventiva"
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Máquina/Categoria</label>
                    <select 
                      className="w-full border border-primary/20 rounded p-2 bg-white"
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    >
                      <option value="">Selecione uma máquina</option>
                      {machines.map((m) => (
                        <option key={m.id} value={m.code}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Habilidade
                </Button>

                <div className="pt-4 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground mb-4">
                    Para visualizar as habilidades de cada máquina, acesse a aba "Máquinas" e clique na máquina desejada.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Operator Tab */}
          <TabsContent value="new-operator" className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Cadastrar Novo Técnico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nome</label>
                    <Input placeholder="Nome completo" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Workday</label>
                    <Input placeholder="Ex: WDC00001" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Cargo</label>
                    <Input placeholder="Ex: Técnico de Manutenção" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Área</label>
                    <Input placeholder="Ex: Produção" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Turno</label>
                    <select className="w-full border border-primary/20 rounded p-2 bg-white">
                      <option>1º Turno</option>
                      <option>2º Turno</option>
                      <option>3º Turno</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Time <span className="text-red-500">*</span></label>
                    <select className="w-full border border-primary/20 rounded p-2 bg-white" required>
                      <option value="">Selecione um time</option>
                      {mockTeams.filter(t => t.status === "ativo").map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  * Os técnicos trabalham com todas as máquinas do sistema
                </p>
                <Button className="bg-primary hover:bg-primary/90 w-full">Cadastrar Técnico</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Machine Skills Modal */}
      <Dialog open={selectedMachine !== null} onOpenChange={() => setSelectedMachine(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{selectedMachineData?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  Código: {selectedMachineData?.code}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Gerencie as habilidades específicas desta máquina
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Add New Skill */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">Adicionar Nova Habilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da habilidade..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills List */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center justify-between">
                <span>Habilidades Cadastradas</span>
                <Badge variant="secondary">{selectedMachineSkills.length} total</Badge>
              </h3>
              
              {selectedMachineSkills.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>Nenhuma habilidade cadastrada para esta máquina</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {selectedMachineSkills.map((skill, index) => (
                    <Card key={skill.id} className="border-border/50 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {skill.id}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
