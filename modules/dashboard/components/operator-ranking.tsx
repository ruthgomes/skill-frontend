"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockTecnicos } from "@/shared/data"
import { Award } from "lucide-react"

export function OperatorRanking() {
  const sortedTecnicos = [...mockTecnicos].sort((a, b) => {
    const scoreA = a.quarterlyNotes[0]?.score || 0
    const scoreB = b.quarterlyNotes[0]?.score || 0
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
          {sortedTecnicos.map((tec, idx) => {
            const avgSkill = Object.values(tec.skills).length > 0 
              ? Object.values(tec.skills).reduce((sum, val) => sum + val, 0) / Object.values(tec.skills).length 
              : 0
            return (
              <div
                key={tec.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-chart-1 text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{tec.name}</div>
                    <div className="text-xs text-muted-foreground">{tec.cargo} - {tec.senioridade}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-chart-2">
                    {avgSkill.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">média skills</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
