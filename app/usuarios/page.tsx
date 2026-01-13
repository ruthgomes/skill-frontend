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
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "tecnico" })

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Controle de Usuários</h1>
          <p className="text-muted-foreground mt-2">Gerenciar acessos do sistema</p>
        </div>

        {/* Add New User */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Adicionar Novo Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@example.com"
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nome</label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome completo"
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Função</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border border-primary/20 rounded p-2 bg-white"
                >
                  <option value="tecnico">Técnico</option>
                  <option value="master">Master</option>
                </select>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 w-full">Adicionar Usuário</Button>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
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
                  <div className="flex items-center gap-3">
                    <Badge className={u.role === "master" ? "bg-primary text-white" : "bg-secondary"}>
                      {u.role === "master" ? "Master" : "Técnico"}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-primary/20 bg-transparent">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
