"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { mockOperators } from "@/lib/data"

export function PerformanceChart() {
  const topOperators = mockOperators.slice(0, 2)

  // Merge evolution data
  const allDates = new Set<string>()
  topOperators.forEach((op) => {
    op.evolution.forEach((e) => allDates.add(e.date))
  })

  const chartData = Array.from(allDates)
    .sort()
    .map((date) => {
      const point: Record<string, any> = { date }
      topOperators.forEach((op) => {
        const evo = op.evolution.find((e) => e.date === date)
        point[op.name] = evo?.score || 0
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
              dataKey={topOperators[0].name}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey={topOperators[1].name}
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
