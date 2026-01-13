"use client"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockOperators } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || (user.role !== "supervisor" && user.role !== "admin")) {
    router.push("/")
    return null
  }

  // Satisfação por operador
  const satisfactionData = mockOperators.map((op) => ({
    name: op.name.split(" ")[0],
    satisfaction: op.performance.satisfaction,
  }))

  // Meta atingida
  const targetData = mockOperators.map((op) => ({
    name: op.name.split(" ")[0],
    target: op.performance.targetMet,
  }))

  // Status dos operadores
  const statusData = [
    { name: "Online", value: mockOperators.filter((op) => op.status === "online").length },
    { name: "Offline", value: mockOperators.filter((op) => op.status === "offline").length },
    { name: "Paused", value: mockOperators.filter((op) => op.status === "paused").length },
  ]

  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"]

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada de performance e métricas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Satisfação */}
          <Card>
            <CardHeader>
              <CardTitle>Satisfação por Operador</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={satisfactionData}>
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
                  <Bar dataKey="satisfaction" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardHeader>
              <CardTitle>Meta Atingida (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={targetData}>
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
                  <Bar dataKey="target" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
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

          {/* Calls Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Total de Atendimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockOperators.map((op) => (
                <div key={op.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{op.name}</div>
                    <div className="text-xs text-muted-foreground">{op.performance.calls} chamadas</div>
                  </div>
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-chart-1 h-2 rounded-full"
                      style={{ width: `${(op.performance.calls / 300) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
