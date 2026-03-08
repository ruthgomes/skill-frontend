"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/data"

export default function UsuariosPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Usuários do Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Visualizar Masters e Supervisores com acesso ao sistema
          </p>
        </div>

        {/* Users List */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <p className="text-sm text-muted-foreground">
              Apenas visualização - Para cadastrar novos colaboradores, acesse a tela de Cadastro
            </p>
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
