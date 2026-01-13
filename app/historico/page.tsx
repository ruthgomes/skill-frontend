"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { mockTecnicos } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HistoricoPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "tecnico") {
    router.push("/")
    return null
  }

  const currentTecnico = mockTecnicos.find((op) => op.name.toLowerCase().includes("joão"))

  if (!currentTecnico) {
    return (
      <AppLayout>
        <div>Dados não encontrados</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Histórico Completo</h1>
          <p className="text-muted-foreground mt-2">Todas as avaliações e notas</p>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Avaliações Trimestrais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTecnico.quarterlyNotes.length > 0 ? (
                currentTecnico.quarterlyNotes.map((note) => (
                  <div
                    key={`${note.year}-${note.quarter}`}
                    className="p-4 bg-secondary/30 rounded-lg border border-primary/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Avaliação Q{note.quarter} - {note.year}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(note.evaluatedDate).toLocaleDateString("pt-BR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge className="bg-primary text-white text-lg py-2 px-3">{note.score}</Badge>
                    </div>
                    <p className="text-foreground">{note.notes}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhuma avaliação registrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Admissão</p>
                <p className="font-semibold text-foreground">
                  {new Date(currentTecnico.joinDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className="bg-primary text-white">
                  {currentTecnico.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
