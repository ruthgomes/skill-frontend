"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { mockTecnicos } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function MeuDesempenhoPage() {
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
        <div>Técnico não encontrado</div>
      </AppLayout>
    )
  }

  const evolutionData = currentTecnico.quarterlyNotes.map((note) => ({
    quarter: `Q${note.quarter}`,
    score: note.score,
  }))

  const radarData = [
    { name: "Atendimento", value: currentTecnico.skills["1"] || 0 },
    { name: "Técnica", value: currentTecnico.skills["2"] || 0 },
    { name: "Conhecimento", value: currentTecnico.skills["3"] || 0 },
    { name: "Atitude", value: currentTecnico.skills["4"] || 0 },
    { name: "Produtividade", value: currentTecnico.skills["5"] || 0 },
    { name: "Qualidade", value: currentTecnico.skills["6"] || 0 },
  ]

  const lastScore = currentTecnico.quarterlyNotes[0]?.score || 0

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Meu Desempenho</h1>
          <p className="text-muted-foreground mt-2">Acompanhe sua evolução e avaliações</p>
        </div>

        {/* Personal Info */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold text-foreground">{currentTecnico.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workday</p>
                <p className="font-semibold text-foreground">{currentTecnico.workday}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Máquina</p>
                <p className="font-semibold text-foreground">{currentTecnico.machine}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Turno</p>
                <p className="font-semibold text-foreground">{currentTecnico.shift}º Turno</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Última Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{lastScore}</div>
              <p className="text-xs text-muted-foreground mt-2">pontos</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-primary text-white capitalize">{currentTecnico.status}</Badge>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{currentTecnico.quarterlyNotes.length}</div>
              <p className="text-xs text-muted-foreground mt-2">trimestres avaliados</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Evolução de Pontuação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0A3D62" strokeWidth={2} dot={{ fill: "#0A3D62" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Perfil de Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Pontuação" dataKey="value" stroke="#0A3D62" fill="#0A3D62" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Skills */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Detalhamento de Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {radarData.map((skill) => (
                <div key={skill.name} className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">{skill.name}</span>
                    <span className="text-sm font-bold text-primary">{skill.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${skill.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historical Notes */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Histórico de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentTecnico.quarterlyNotes.map((note) => (
                <div key={`${note.year}-${note.quarter}`} className="p-4 border border-primary/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        Q{note.quarter} {note.year}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.evaluatedDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge className="bg-primary text-white">{note.score} pts</Badge>
                  </div>
                  <p className="text-sm text-foreground">{note.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
