"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { mockTecnicos } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Search } from "lucide-react"

export default function TecnicosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  const filteredTecnicos = mockTecnicos.filter(
    (op) =>
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.workday.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Técnicos</h1>
          <p className="text-muted-foreground mt-2">Gerenciamento de técnicos do sistema</p>
        </div>

        {/* Search Bar */}
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <Input
                placeholder="Pesquisar por nome ou workday..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary/20 focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tecnicos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTecnicos.map((op) => (
            <Card
              key={op.id}
              className="border-primary/10 hover:border-primary/30 transition-colors cursor-pointer hover:shadow-lg"
              onClick={() => router.push(`/tecnicos/${op.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{op.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{op.workday}</p>
                  </div>
                  <Badge variant={op.status === "ativo" ? "default" : "secondary"}>
                    {op.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cargo</p>
                    <p className="font-semibold text-foreground">{op.cargo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Turno</p>
                    <p className="font-semibold text-foreground">{op.shift}º Turno</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Área</p>
                    <p className="font-semibold text-foreground">{op.area}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Habilidades</p>
                    <p className="font-semibold text-foreground">{Object.keys(op.skills).length}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground mb-2">Última Avaliação</p>
                  <p className="text-sm font-semibold text-foreground">{op.quarterlyNotes[0]?.score || "N/A"} pontos</p>
                  <p className="text-xs text-muted-foreground">
                    {op.quarterlyNotes[0]
                      ? new Date(op.quarterlyNotes[0].evaluatedDate).toLocaleDateString("pt-BR")
                      : "Sem avaliações"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTecnicos.length === 0 && (
          <Card className="border-primary/10">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Nenhum técnico encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
