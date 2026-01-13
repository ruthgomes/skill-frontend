"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockOperators } from "@/lib/data"
import { Award } from "lucide-react"

export function OperatorRanking() {
  const sortedOperators = [...mockOperators].sort((a, b) => {
    const scoreA = a.performance.targetMet + a.performance.satisfaction * 20
    const scoreB = b.performance.targetMet + b.performance.satisfaction * 20
    return scoreB - scoreA
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award size={20} className="text-chart-1" />
          Rankings de Operadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedOperators.map((op, idx) => (
            <div
              key={op.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-chart-1 text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-semibold text-sm">{op.name}</div>
                  <div className="text-xs text-muted-foreground">{op.performance.calls} atendimentos</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-chart-2">
                  {(op.performance.targetMet + op.performance.satisfaction * 20).toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">pontos</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
