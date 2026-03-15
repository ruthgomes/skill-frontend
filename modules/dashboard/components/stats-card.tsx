import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon?: React.ReactNode
}

export function StatsCard({ title, value, subtitle, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              trend >= 0 ? "text-chart-1" : "text-destructive"
            }`}
          >
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}% vs última semana
          </div>
        )}
      </CardContent>
    </Card>
  )
}
