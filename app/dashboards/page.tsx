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
    },
    {
      skill: "PRINTER",
      "1º Turno": 85,
      "2º Turno": 88,
      "3º Turno": 78,
    },
    {
      skill: "SPINX",
      "1º Turno": 90,
      "2º Turno": 86,
      "3º Turno": 82,
    },
    {
      skill: "TAO",
      "1º Turno": 92,
      "2º Turno": 89,
      "3º Turno": 85,
    },
    {
      skill: "Atendimento",
      "1º Turno": 88,
      "2º Turno": 86,
      "3º Turno": 80,
    },
    {
      skill: "Técnica",
      "1º Turno": 85,
      "2º Turno": 88,
      "3º Turno": 78,
    },
  ]

  const machines = ["LASER", "PRINTER", "SPINX", "TAO", "USINAGEM", "DOBRA", "CORTE", "SOLDA"]
  const machineShiftRadarData = machines.map((machine) => ({
    machine,
    "1º Turno": Math.floor(Math.random() * 20) + 80,
    "2º Turno": Math.floor(Math.random() * 20) + 75,
    "3º Turno": Math.floor(Math.random() * 20) + 70,
  }))

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
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
