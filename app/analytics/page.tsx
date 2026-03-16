"use client"
import { AppLayout } from "@/shared/components/layout"
import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { mockTecnicos } from "@/shared/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "master") {
      router.replace("/login")
    }
  }, [user, router])

  if (!user || user.role !== "master") {
    return null
  }

  // Desempenho por técnico (baseado na última nota trimestral)
  const performanceData = mockTecnicos
    .filter((t) => t.quarterlyNotes.length > 0)
    .map((t) => ({
      name: t.name.split(" ")[0],
      score: t.quarterlyNotes[0].score,
    }))

  // Média de skills por técnico
  const skillsData = mockTecnicos.map((t) => {
    const skillValues = Object.values(t.skills)
    const avgSkill = skillValues.length > 0 ? skillValues.reduce((a, b) => a + b, 0) / skillValues.length : 0
    return {
      name: t.name.split(" ")[0],
      avgSkill: Math.round(avgSkill),
    }
  })

  // Status dos técnicos
  const statusData = [
    { name: "Ativo", value: mockTecnicos.filter((t) => t.status === "ativo").length },
    { name: "Inativo", value: mockTecnicos.filter((t) => t.status === "inativo").length },
  ]

  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"]

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada de performance e métricas dos técnicos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Desempenho Trimestral */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Trimestral (Última Avaliação)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="score" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Média de Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Média de Skills por Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avgSkill" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo de Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Total de Skills por Técnico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTecnicos.slice(0, 5).map((t) => {
                const skillCount = Object.keys(t.skills).length
                const maxSkills = 10
                return (
                  <div key={t.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{skillCount} skills</div>
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-chart-1 h-2 rounded-full"
                        style={{ width: `${(skillCount / maxSkills) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
