"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

export default function DashboardsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  const shiftRadarData = [
    {
      skill: "LASER",
      "1º Turno": 88,
      "2º Turno": 85,
      "3º Turno": 80,
      "Comercial": 87,
      "Especial": 84,
    },
    {
      skill: "PRINTER",
      "1º Turno": 85,
      "2º Turno": 88,
      "3º Turno": 78,
      "Comercial": 86,
      "Especial": 82,
    },
    {
      skill: "SPINX",
      "1º Turno": 90,
      "2º Turno": 86,
      "3º Turno": 82,
      "Comercial": 89,
      "Especial": 85,
    },
    {
      skill: "TAO",
      "1º Turno": 92,
      "2º Turno": 89,
      "3º Turno": 85,
      "Comercial": 91,
      "Especial": 88,
    },
    {
      skill: "Atendimento",
      "1º Turno": 88,
      "2º Turno": 86,
      "3º Turno": 80,
      "Comercial": 87,
      "Especial": 83,
    },
    {
      skill: "Técnica",
      "1º Turno": 85,
      "2º Turno": 88,
      "3º Turno": 78,
      "Comercial": 86,
      "Especial": 81,
    },
  ]

  const machines = ["LASER", "PRINTER", "SPINX", "TAO", "USINAGEM", "DOBRA", "CORTE", "SOLDA"]
  const machineShiftRadarData = machines.map((machine) => ({
    machine,
    "1º Turno": Math.floor(Math.random() * 20) + 80,
    "2º Turno": Math.floor(Math.random() * 20) + 75,
    "3º Turno": Math.floor(Math.random() * 20) + 70,
    "Comercial": Math.floor(Math.random() * 20) + 77,
    "Especial": Math.floor(Math.random() * 20) + 73,
  }))

  // Dados do Ranking Geral da Engenharia
  const rankingAuxiliares = [
    { name: "André Silva", score: 88, team: "Time A" },
    { name: "Carla Mendes", score: 86, team: "Time B" },
    { name: "Thiago Alves", score: 84, team: "Time C" },
    { name: "Larissa Rocha", score: 82, team: "Time D" },
    { name: "Fernando Nunes", score: 80, team: "Time A" },
  ]

  const rankingJuniores = [
    { name: "Lucas Ferreira", score: 94, team: "Time A" },
    { name: "Julia Mendes", score: 91, team: "Time B" },
    { name: "Rafael Alves", score: 89, team: "Time C" },
    { name: "Beatriz Rocha", score: 87, team: "Time A" },
    { name: "Gabriel Nunes", score: 85, team: "Time D" },
  ]

  const rankingPlenos = [
    { name: "Marcos Oliveira", score: 96, team: "Time B" },
    { name: "Fernanda Costa", score: 94, team: "Time A" },
    { name: "Ricardo Martins", score: 92, team: "Time C" },
    { name: "Camila Souza", score: 90, team: "Time D" },
    { name: "Bruno Pereira", score: 88, team: "Time B" },
  ]

  const rankingSeniores = [
    { name: "Roberto Santos", score: 98, team: "Time A" },
    { name: "Patricia Lima", score: 97, team: "Time B" },
    { name: "Felipe Cardoso", score: 95, team: "Time C" },
    { name: "Amanda Silva", score: 93, team: "Time A" },
    { name: "Daniel Azevedo", score: 91, team: "Time D" },
  ]

  const rankingEspecialistas = [
    { name: "Dr. Carlos Silva", score: 99, team: "Time A" },
    { name: "Dra. Mariana Oliveira", score: 98, team: "Time B" },
    { name: "Dr. Paulo Costa", score: 97, team: "Time C" },
    { name: "Dra. Ana Santos", score: 96, team: "Time A" },
    { name: "Dr. Eduardo Lima", score: 95, team: "Time D" },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dashboards Analíticos</h1>
          <p className="text-muted-foreground mt-2">Visualizações detalhadas de desempenho</p>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Radar por Turno (Máquinas e Skills)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={shiftRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="1º Turno"
                  dataKey="1º Turno"
                  stroke="#0A3D62"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#0A3D62", r: 4 }}
                />
                <Radar
                  name="2º Turno"
                  dataKey="2º Turno"
                  stroke="#10b981"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
                <Radar
                  name="3º Turno"
                  dataKey="3º Turno"
                  stroke="#fbbf24"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#fbbf24", r: 4 }}
                />
                <Radar
                  name="Comercial"
                  dataKey="Comercial"
                  stroke="#8b5cf6"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
                <Radar
                  name="Especial"
                  dataKey="Especial"
                  stroke="#ec4899"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#ec4899", r: 4 }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Radar por Máquina/Turno (Qual turno é melhor em cada máquina)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={machineShiftRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="machine" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="1º Turno"
                  dataKey="1º Turno"
                  stroke="#0A3D62"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#0A3D62", r: 4 }}
                />
                <Radar
                  name="2º Turno"
                  dataKey="2º Turno"
                  stroke="#10b981"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
                <Radar
                  name="3º Turno"
                  dataKey="3º Turno"
                  stroke="#fbbf24"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#fbbf24", r: 4 }}
                />
                <Radar
                  name="Comercial"
                  dataKey="Comercial"
                  stroke="#8b5cf6"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
                <Radar
                  name="Especial"
                  dataKey="Especial"
                  stroke="#ec4899"
                  fill="none"
                  strokeWidth={2}
                  dot={{ fill: "#ec4899", r: 4 }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ranking Geral da Engenharia */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Ranking Geral da Engenharia - Top 5</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ranking Auxiliares */}
            <Card className="border-orange-500/30">
              <CardHeader className="bg-orange-50/50 dark:bg-orange-950/20">
                <CardTitle className="text-orange-600 dark:text-orange-400">🔧 Melhores Auxiliares</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {rankingAuxiliares.map((person, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-orange-50/30 dark:bg-orange-950/10 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 dark:bg-orange-500 text-white font-bold text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.team}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{person.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking Juniores */}
            <Card className="border-blue-500/30">
              <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20">
                <CardTitle className="text-blue-600 dark:text-blue-400">🌟 Melhores Juniores</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {rankingJuniores.map((person, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-blue-50/30 dark:bg-blue-950/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.team}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{person.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking Plenos */}
            <Card className="border-green-500/30">
              <CardHeader className="bg-green-50/50 dark:bg-green-950/20">
                <CardTitle className="text-green-600 dark:text-green-400">💼 Melhores Plenos</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {rankingPlenos.map((person, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-50/30 dark:bg-green-950/10 hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 text-white font-bold text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.team}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{person.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking Sêniores */}
            <Card className="border-purple-500/30">
              <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20">
                <CardTitle className="text-purple-600 dark:text-purple-400">⭐ Melhores Sêniores</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {rankingSeniores.map((person, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 text-white font-bold text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.team}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{person.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking Especialistas */}
            <Card className="border-amber-500/30">
              <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20">
                <CardTitle className="text-amber-600 dark:text-amber-400">👑 Melhores Especialistas</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {rankingEspecialistas.map((person, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 dark:bg-amber-500 text-white font-bold text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.team}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{person.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
