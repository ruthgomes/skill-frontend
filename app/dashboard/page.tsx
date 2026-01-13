"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { mockTecnicos } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  const onlineCount = mockTecnicos.filter((op) => op.status === "ativo").length
  const avgSkillScore =
    mockTecnicos.reduce(
      (sum, op) => sum + Object.values(op.skills).reduce((a, b) => a + b, 0) / Object.keys(op.skills).length,
      0,
    ) / mockTecnicos.length

  const shiftScoreData = [
    {
      shift: "1º Turno",
      jan: 85,
      fev: 87,
      mar: 88,
      abr: 90,
      mai: 89,
      jun: 91,
      jul: 92,
      ago: 90,
      set: 93,
      out: 94,
      nov: 92,
      dez: 95,
    },
    {
      shift: "2º Turno",
      jan: 82,
      fev: 84,
      mar: 86,
      abr: 85,
      mai: 87,
      jun: 88,
      jul: 89,
      ago: 87,
      set: 90,
      out: 91,
      nov: 89,
      dez: 92,
    },
    {
      shift: "3º Turno",
      jan: 78,
      fev: 80,
      mar: 81,
      abr: 79,
      mai: 82,
      jun: 83,
      jul: 84,
      ago: 82,
      set: 85,
      out: 86,
      nov: 84,
      dez: 87,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Visão geral do desempenho dos técnicos</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground">Técnicos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{onlineCount}</div>
              <p className="text-xs text-muted-foreground mt-2">de {mockTecnicos.length} total</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground">Pontuação Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{avgSkillScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-2">desempenho geral</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground">Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">8</div>
              <p className="text-xs text-muted-foreground mt-2">disponíveis no sistema</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pontuação Anual por Turno</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={
                  shiftScoreData[0].jan
                    ? Object.keys(shiftScoreData[0])
                        .filter((k) => k !== "shift")
                        .map((month, idx) => ({
                          month: month.charAt(0).toUpperCase() + month.slice(1),
                          "1º Turno": shiftScoreData[0][month as keyof (typeof shiftScoreData)[0]],
                          "2º Turno": shiftScoreData[1][month as keyof (typeof shiftScoreData)[1]],
                          "3º Turno": shiftScoreData[2][month as keyof (typeof shiftScoreData)[2]],
                        }))
                    : []
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="1º Turno" stroke="#0A3D62" strokeWidth={2} dot={{ fill: "#0A3D62" }} />
                <Line type="monotone" dataKey="2º Turno" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                <Line type="monotone" dataKey="3º Turno" stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
