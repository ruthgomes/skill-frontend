"use client"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockOperators } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TrendingUp, Award, Target, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MyPerformancePage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "tecnico") {
    router.push("/")
    return null
  }

  // Get current user's mock data (first operator as current user)
  const currentUser = mockOperators[0]

  // Evolution chart data
  const evolutionData = currentUser.evolution.map((e) => ({
    date: new Date(e.date).toLocaleDateString("pt-BR", { month: "short", day: "numeric" }),
    score: e.score,
  }))

  // Skills data for radar chart
  const skillsData = Object.entries(currentUser.skills).map(([name, value]) => ({
    name: name.split(" ")[0],
    value,
    fullMark: 100,
  }))

  // Top performers for comparison
  const topPerformers = mockOperators
    .filter((op) => op.id !== currentUser.id)
    .sort((a, b) => {
      const scoreA = a.performance.targetMet + a.performance.satisfaction * 20
      const scoreB = b.performance.targetMet + b.performance.satisfaction * 20
      return scoreB - scoreA
    })
    .slice(0, 3)

  const currentScore = currentUser.performance.targetMet + currentUser.performance.satisfaction * 20

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Desempenho</h1>
          <p className="text-muted-foreground mt-1">Acompanhe sua evolução e métricas de performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target size={16} />
                Meta Atingida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentUser.performance.targetMet}%</div>
              <p className="text-xs text-chart-1 mt-2">+2% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award size={16} />
                Satisfação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentUser.performance.satisfaction.toFixed(1)}</div>
              <p className="text-xs text-chart-1 mt-2">Excelente rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap size={16} />
                Atendimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentUser.performance.calls}</div>
              <p className="text-xs text-chart-1 mt-2">Últimas 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp size={16} />
                Score Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">{currentScore.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-2">Desempenho total</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Score</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} domain={[70, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Avaliação de Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <PolarRadiusAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics and Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas Detalhadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Atendimentos", value: currentUser.performance.calls, icon: "📞" },
                { label: "Duração Média", value: `${currentUser.performance.avgDuration}m`, icon: "⏱️" },
                {
                  label: "Satisfação do Cliente",
                  value: `${(currentUser.performance.satisfaction * 20).toFixed(1)}%`,
                  icon: "😊",
                },
                { label: "Meta Atingida", value: `${currentUser.performance.targetMet}%`, icon: "🎯" },
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <div className="text-sm font-medium">{metric.label}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{metric.value}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performers Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação com Top Performers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-chart-1">Você</div>
                    <div className="text-sm text-muted-foreground">{currentUser.name}</div>
                  </div>
                  <div className="text-2xl font-bold text-chart-1">{currentScore.toFixed(0)}</div>
                </div>
              </div>

              {topPerformers.map((performer, idx) => {
                const performerScore = performer.performance.targetMet + performer.performance.satisfaction * 20
                const diff = (performerScore - currentScore).toFixed(0)
                return (
                  <div key={performer.id} className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{performer.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {performer.performance.calls} atendimentos
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{performerScore.toFixed(0)}</div>
                        <div className={`text-xs ${diff > 0 ? "text-destructive" : "text-chart-1"}`}>
                          {diff > 0 ? "+" : ""}
                          {diff}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Goals Section */}
        <Card>
          <CardHeader>
            <CardTitle>Metas e Objetivos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Meta Semanal de Atendimentos</div>
                <Badge className="bg-chart-1">200/250</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-1 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">80% concluído</div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Meta de Satisfação</div>
                <Badge className="bg-chart-2">4.8/5.0</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-2 h-2 rounded-full" style={{ width: "96%" }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">96% da meta</div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Meta de Duração</div>
                <Badge className="bg-chart-3">4.5/5.0 min</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-3 h-2 rounded-full" style={{ width: "90%" }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">90% da meta</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
