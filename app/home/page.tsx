"use client"

import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AppLayout } from "@/shared/components/layout"
import { analyticsService } from "@/core/services"
import type { DashboardMetrics } from "@/core/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)
  
  // Estados para dados do dashboard
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasRedirected.current || authLoading) return
    if (!user) {
      hasRedirected.current = true
      router.replace("/login")
    }
  }, [user, authLoading, router])

  // Busca métricas do dashboard
  useEffect(() => {
    if (!user) return

    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('🔄 Buscando métricas do dashboard...')
        
        const data = await analyticsService.getDashboard()
        
        console.log('✅ Métricas carregadas:', data)
        setMetrics(data)
      } catch (err) {
        console.error('❌ Erro ao buscar métricas:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardMetrics()
  }, [user])

  if (!user) return null

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  // ============================================
  // DADOS REAIS DO BACKEND
  // ============================================
  const totalTecnicos = metrics?.totalTecnicos || 0
  const activeTecnicos = metrics?.activeTecnicos || 0
  const averageScore = typeof metrics?.avgQuarterlyScore === 'string' 
    ? parseFloat(metrics.avgQuarterlyScore) 
    : 0
  const totalTeams = metrics?.totalTeams || 0
  const totalMachines = metrics?.totalMachines || 0

  // Dados por gênero
  const femaleCount = metrics?.tecnicosByGender?.find(g => g.gender === 'F')?.count || 0
  const maleCount = metrics?.tecnicosByGender?.find(g => g.gender === 'M')?.count || 0

  // Dados por senioridade
  const juniorCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Junior')?.count || 0
  const plenoCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Pleno')?.count || 0
  const seniorCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Sênior')?.count || 0
  const specialistCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Especialista')?.count || 0
  const auxiliarCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Auxiliar')?.count || 0
  const coordCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Coordenador')?.count || 0
  const supervisorCount = metrics?.tecnicosBySenioridade?.find(s => s.senioridade === 'Supervisor')?.count || 0

  // Dados por turno para o gráfico
  const shiftData = {
    '1T': metrics?.tecnicosByShift?.find(s => s.shift === '1T')?.count || 0,
    '2T': metrics?.tecnicosByShift?.find(s => s.shift === '2T')?.count || 0,
    '3T': metrics?.tecnicosByShift?.find(s => s.shift === '3T')?.count || 0,
    'ADM': metrics?.tecnicosByShift?.find(s => s.shift === 'ADM')?.count || 0,
  }

  // Dados do gráfico de pontuação por turno (mockado pois backend não tem ainda)
  // Mantemos os dados mockados pois é um gráfico de tendência que pode ser implementado depois
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
          <p className="text-muted-foreground mt-2">Visão geral do desempenho dos colaboradores</p>
        </div>

        {/* Stats Grid - MANTENDO EXATAMENTE O MESMO LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Técnicos */}
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-primary">Total Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalTecnicos}</div>
              <p className="text-[10px] text-muted-foreground mt-1">colaboradores cadastrados</p>
            </CardContent>
          </Card>

          {/* Técnicos Ativos */}
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-primary">Técnicos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeTecnicos}</div>
              <p className="text-[10px] text-muted-foreground mt-1">colaboradores ativos</p>
            </CardContent>
          </Card>

          {/* Pontuação Média */}
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-primary">Pontuação Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{averageScore.toFixed(1)}</div>
              <p className="text-[10px] text-muted-foreground mt-1">score médio geral</p>
            </CardContent>
          </Card>

          {/* Total de Times */}
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-primary">Total de Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalTeams}</div>
              <p className="text-[10px] text-muted-foreground mt-1">times cadastrados</p>
            </CardContent>
          </Card>

          {/* Máquinas */}
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-primary">Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalMachines}</div>
              <p className="text-[10px] text-muted-foreground mt-1">disponíveis</p>
            </CardContent>
          </Card>

          {/* Qtd Mul. - DADOS REAIS */}
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Mul.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{femaleCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">mulheres</p>
            </CardContent>
          </Card>

          {/* Qtd Hom. - DADOS REAIS */}
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Hom.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{maleCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">homens</p>
            </CardContent>
          </Card>

          {/* Qtd Jr - DADOS REAIS */}
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Jr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{juniorCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">juniores</p>
            </CardContent>
          </Card>

          {/* Qtd Pl - DADOS REAIS */}
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Pl</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{plenoCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">plenos</p>
            </CardContent>
          </Card>

          {/* Qtd Sr - DADOS REAIS */}
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Qtd Sr</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{seniorCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1">sêniores</p>
            </CardContent>
          </Card>

          {/* Qtd Spec - DADOS REAIS */}
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

        {/* Gráfico - MANTIDO IGUAL */}
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
