"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/data"
import { useState } from "react"

export default function UsuariosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [newUser, setNewUser] = useState({ 
    email: "", 
    name: "", 
    role: "master" as "master" | "supervisor"
  })

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Preencha todos os campos!")
      return
    }
    console.log("Cadastrando usuário:", newUser)
    alert(`Usuário ${newUser.name} cadastrado com sucesso!`)
    setNewUser({ email: "", name: "", role: "master" })
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Controle de Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciar usuários com acesso ao sistema (Masters e Supervisores)
          </p>
        </div>

        {/* Add New User */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Adicionar Novo Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nome Completo *</label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome completo"
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email *</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@example.com"
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Função *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "master" | "supervisor" })}
                  className="w-full border border-primary/20 rounded p-2 bg-white h-10"
                >
                  <option value="master">Master</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
            </div>
            <Button 
              onClick={handleAddUser}
              className="bg-primary hover:bg-primary/90 w-full"
            >
              Adicionar Usuário
            </Button>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge className="bg-primary text-white capitalize">
                    {u.role === "master" ? "Master" : "Supervisor"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
