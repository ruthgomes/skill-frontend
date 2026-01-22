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
  const coordCount = 5 // Quantidade de coordenadores (mock)
  const machinesCount = 8
  const auxiliaresCount = 10 // Quantidade de auxiliares (mock)
  const femaleCount = 12 // Quantidade de mulheres (mock)
  const maleCount = 18 // Quantidade de homens (mock)
  const juniorCount = 8 // Quantidade de juniores (mock)
  const plenoCount = 12 // Quantidade de plenos (mock)
  const seniorCount = 7 // Quantidade de sêniores (mock)
  const specialistCount = 3 // Quantidade de especialistas (mock)

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
    {
      shift: "Comercial",
      jan: 86,
      fev: 88,
      mar: 87,
      abr: 89,
      mai: 90,
      jun: 91,
      jul: 90,
      ago: 92,
      set: 91,
      out: 93,
      nov: 92,
      dez: 94,
    },
    {
      shift: "Especial",
      jan: 84,
      fev: 85,
      mar: 86,
      abr: 87,
      mai: 88,
      jun: 89,
      jul: 88,
      ago: 90,
      set: 89,
      out: 91,
      nov: 90,
      dez: 92,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Home</h1>
          <p className="text-muted-foreground mt-2">Visão geral do desempenho dos técnicos</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Tec</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{onlineCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">técnicos ativos</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Coord</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{coordCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">coordenadores</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{machinesCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">disponíveis</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Aux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{auxiliaresCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">auxiliares</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Mul.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{femaleCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">mulheres</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Hom.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{maleCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">homens</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Jr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{juniorCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">juniores</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Pl</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{plenoCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">plenos</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Sr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{seniorCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">sêniores</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Spec</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{specialistCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">especialistas</p>
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
                          "Comercial": shiftScoreData[3][month as keyof (typeof shiftScoreData)[3]],
                          "Especial": shiftScoreData[4][month as keyof (typeof shiftScoreData)[4]],
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
                <Line type="monotone" dataKey="Comercial" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                <Line type="monotone" dataKey="Especial" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
