"use client"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockOperators } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RankingsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "tecnico") {
    router.push("/")
    return null
  }

  const currentUser = mockOperators[0]

  // Sort operators by different metrics
  const byScore = [...mockOperators].sort((a, b) => {
    const scoreA = a.performance.targetMet + a.performance.satisfaction * 20
    const scoreB = b.performance.targetMet + b.performance.satisfaction * 20
    return scoreB - scoreA
  })

  const bySatisfaction = [...mockOperators].sort((a, b) => b.performance.satisfaction - a.performance.satisfaction)

  const byTarget = [...mockOperators].sort((a, b) => b.performance.targetMet - a.performance.targetMet)

  const renderRanking = (data: typeof mockOperators, key: "id") => {
    return data.map((op, idx) => {
      const value = op.performance.targetMet + op.performance.satisfaction * 20
      const isCurrentUser = op.id === currentUser.id
      return (
        <div
          key={op.id}
          className={`p-4 rounded-lg border transition-all ${
            isCurrentUser ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20" : "border-border hover:bg-muted"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {idx === 0 ? (
                <Trophy className="w-8 h-8 text-yellow-500" />
              ) : idx === 1 ? (
                <Medal className="w-8 h-8 text-gray-400" />
              ) : idx === 2 ? (
                <Medal className="w-8 h-8 text-yellow-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">
                {op.name}
                {isCurrentUser && <Badge className="text-xs">Você</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">{op.performance.calls} atendimentos</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-chart-1">{value.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">pontos</div>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rankings</h1>
          <p className="text-muted-foreground mt-1">Veja como você se posiciona comparado aos outros operadores</p>
        </div>

        <Tabs defaultValue="overall" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overall">Geral</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
            <TabsTrigger value="target">Meta</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Operadores - Score Geral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">{renderRanking(byScore, "id")}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Operadores - Satisfação do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bySatisfaction.map((op, idx) => {
                  const isCurrentUser = op.id === currentUser.id
                  return (
                    <div
                      key={op.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isCurrentUser
                          ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {op.name}
                            {isCurrentUser && <Badge className="text-xs">Você</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">{op.performance.calls} atendimentos</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-chart-2">
                            {op.performance.satisfaction.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">satisfação</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="target" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Operadores - Meta Atingida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byTarget.map((op, idx) => {
                  const isCurrentUser = op.id === currentUser.id
                  return (
                    <div
                      key={op.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isCurrentUser
                          ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {op.name}
                            {isCurrentUser && <Badge className="text-xs">Você</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">{op.performance.calls} atendimentos</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-chart-3">{op.performance.targetMet}%</div>
                          <div className="text-xs text-muted-foreground">meta</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Your Position Card */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Sua Posição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Score Geral</div>
                <div className="text-3xl font-bold text-chart-1">
                  #{byScore.findIndex((op) => op.id === currentUser.id) + 1}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Satisfação</div>
                <div className="text-3xl font-bold text-chart-2">
                  #{bySatisfaction.findIndex((op) => op.id === currentUser.id) + 1}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Meta</div>
                <div className="text-3xl font-bold text-chart-3">
                  #{byTarget.findIndex((op) => op.id === currentUser.id) + 1}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
