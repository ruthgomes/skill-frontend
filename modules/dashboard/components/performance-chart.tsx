"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { mockTecnicos } from "@/shared/data"

export function PerformanceChart() {
  const topTecnicos = mockTecnicos.slice(0, 2)

  // Merge quarterlyNotes data
  const allDates = new Set<number>()
  topTecnicos.forEach((tec) => {
    tec.quarterlyNotes.forEach((note) => allDates.add(note.quarter))
  })

  const chartData = Array.from(allDates)
    .sort()
    .map((quarter) => {
      const point: Record<string, any> = { date: `Q${quarter}` }
      topTecnicos.forEach((tec) => {
        const note = tec.quarterlyNotes.find((n) => n.quarter === quarter)
        point[tec.name] = note?.score || 0
      })
      return point
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Desempenho (Top Operadores)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
            <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={topTecnicos[0].name}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey={topTecnicos[1].name}
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
