"use client"

import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppLayout } from "@/shared/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Loader2 } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"
import analyticsService from "@/core/services/analytics.service"
import type { TopPerformer, ShiftSkillComparison, ShiftMachineComparison } from "@/core/types"

export default function DashboardsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Estados
  const [skillsData, setSkillsData] = useState<ShiftSkillComparison[]>([])
  const [machinesData, setMachinesData] = useState<ShiftMachineComparison[]>([])
  const [rankingAuxiliares, setRankingAuxiliares] = useState<TopPerformer[]>([])
  const [rankingJuniores, setRankingJuniores] = useState<TopPerformer[]>([])
  const [rankingPlenos, setRankingPlenos] = useState<TopPerformer[]>([])
  const [rankingSeniores, setRankingSeniores] = useState<TopPerformer[]>([])
  const [rankingEspecialistas, setRankingEspecialistas] = useState<TopPerformer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "master") {
      router.replace("/login")
      return
    }
    fetchDashboardData()
  }, [user, router])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Carregando dados do dashboard...')
      
      const currentYear = new Date().getFullYear()
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
      
      console.log(`📊 Buscando dados - Q${currentQuarter}/${currentYear}`)
      
      // Buscar radars (crítico)
      const [skills, machines] = await Promise.all([
        analyticsService.getSkillsByShift(undefined, currentQuarter, currentYear).catch(() => []),
        analyticsService.getMachinesByShift(undefined, currentQuarter, currentYear).catch(() => []),
      ])
      
      setSkillsData(Array.isArray(skills) ? skills : [])
      setMachinesData(Array.isArray(machines) ? machines : [])
      
      // Buscar rankings individualmente (não crítico - pode falhar)
      const fetchRanking = async (senioridade: string) => {
        try {
          const data = await analyticsService.getTopPerformers(5, currentQuarter, currentYear, senioridade)
          return Array.isArray(data) ? data : []
        } catch (err: any) {
          console.warn(`⚠️ Ranking ${senioridade}: sem dados (provavelmente sem avaliações)`)
          return []
        }
      }
      
      const [auxiliares, juniores, plenos, seniores, especialistas] = await Promise.all([
        fetchRanking('AUXILIAR'),
        fetchRanking('JUNIOR'),
        fetchRanking('PLENO'),
        fetchRanking('SENIOR'),
        fetchRanking('ESPECIALISTA'),
      ])
      
      setRankingAuxiliares(auxiliares)
      setRankingJuniores(juniores)
      setRankingPlenos(plenos)
      setRankingSeniores(seniores)
      setRankingEspecialistas(especialistas)
      
      console.log('✅ Dados carregados:', {
        skills: skills?.length || 0,
        machines: machines?.length || 0,
        rankings: {
          auxiliares: auxiliares.length,
          juniores: juniores.length,
          plenos: plenos.length,
          seniores: seniores.length,
          especialistas: especialistas.length,
        }
      })
      
      setLoading(false)
    } catch (err: any) {
      console.error('❌ Erro ao carregar dashboard:', err)
      setError(err.message || 'Erro ao carregar dados do dashboard')
      setLoading(false)
    }
  }

  if (!user || user.role !== "master") {
    return null
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Carregando dashboards analíticos...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                Tentar Novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  // Transformar dados para os Radar Charts
  const radarSkillsData = skillsData.map(skill => ({
    skill: skill.skillName,
    '1º Turno': skill.shifts['1T'] || 0,
    '2º Turno': skill.shifts['2T'] || 0,
    '3º Turno': skill.shifts['3T'] || 0,
    'Comercial': skill.shifts['ADM'] || 0,
  }))

  const radarMachinesData = machinesData.map(machine => ({
    machine: machine.machineCode,
    '1º Turno': machine.shifts['1T'] || 0,
    '2º Turno': machine.shifts['2T'] || 0,
    '3º Turno': machine.shifts['3T'] || 0,
    'Comercial': machine.shifts['ADM'] || 0,
  }))

  // Componente de Ranking
  const RankingCard = ({ 
    title, 
    data, 
    color, 
    icon 
  }: { 
    title: string
    data: TopPerformer[]
    color: string
    icon: string
  }) => (
    <Card className={`border-${color}-500/30`}>
      <CardHeader className={`bg-${color}-50/50 dark:bg-${color}-950/20`}>
        <CardTitle className={`text-${color}-600 dark:text-${color}-400`}>
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <p className="text-sm">Nenhuma avaliação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((person, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg bg-${color}-50/30 dark:bg-${color}-950/10 hover:bg-${color}-100/50 dark:hover:bg-${color}-900/20 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-${color}-600 dark:bg-${color}-500 text-white font-bold text-sm`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.area || 'N/A'}</p>
                  </div>
                </div>
                <span className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
                  {person.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dashboards Analíticos</h1>
          <p className="text-muted-foreground mt-2">Visualizações detalhadas de desempenho</p>
        </div>

        {/* Radar por Turno - Skills */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Radar por Turno (Máquinas e Skills)</CardTitle>
          </CardHeader>
          <CardContent>
            {radarSkillsData.length === 0 ? (
              <div className="flex items-center justify-center h-100 bg-muted/20 rounded-lg">
                <div className="text-center space-y-2 px-8">
                  <p className="text-lg font-semibold text-muted-foreground">📊 Nenhuma Skill Cadastrada</p>
                  <p className="text-sm text-muted-foreground">
                    Cadastre skills e avalie técnicos para visualizar a comparação por turno.
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarSkillsData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="1º Turno"
                    dataKey="1º Turno"
                    stroke="#0A3D62"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#0A3D62", r: 4 }}
                  />
                  <Radar
                    name="2º Turno"
                    dataKey="2º Turno"
                    stroke="#10b981"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                  <Radar
                    name="3º Turno"
                    dataKey="3º Turno"
                    stroke="#fbbf24"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#fbbf24", r: 4 }}
                  />
                  <Radar
                    name="Comercial"
                    dataKey="Comercial"
                    stroke="#8b5cf6"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Radar por Máquina/Turno */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Radar por Máquina/Turno (Qual turno é melhor em cada máquina)</CardTitle>
          </CardHeader>
          <CardContent>
            {radarMachinesData.length === 0 ? (
              <div className="flex items-center justify-center h-100 bg-muted/20 rounded-lg">
                <div className="text-center space-y-2 px-8">
                  <p className="text-lg font-semibold text-muted-foreground">🏭 Nenhuma Máquina Cadastrada</p>
                  <p className="text-sm text-muted-foreground">
                    Cadastre máquinas e suas skills para visualizar a comparação por turno.
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarMachinesData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="machine" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="1º Turno"
                    dataKey="1º Turno"
                    stroke="#0A3D62"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#0A3D62", r: 4 }}
                  />
                  <Radar
                    name="2º Turno"
                    dataKey="2º Turno"
                    stroke="#10b981"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                  <Radar
                    name="3º Turno"
                    dataKey="3º Turno"
                    stroke="#fbbf24"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#fbbf24", r: 4 }}
                  />
                  <Radar
                    name="Comercial"
                    dataKey="Comercial"
                    stroke="#8b5cf6"
                    fill="none"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Rankings Geral da Engenharia */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Ranking Geral da Engenharia - Top 5 por Senioridade</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RankingCard
              title="Melhores Auxiliares"
              data={rankingAuxiliares}
              color="orange"
              icon="🔧"
            />
            <RankingCard
              title="Melhores Juniores"
              data={rankingJuniores}
              color="blue"
              icon="🌟"
            />
            <RankingCard
              title="Melhores Plenos"
              data={rankingPlenos}
              color="green"
              icon="💼"
            />
            <RankingCard
              title="Melhores Sêniores"
              data={rankingSeniores}
              color="purple"
              icon="⭐"
            />
            <RankingCard
              title="Melhores Especialistas"
              data={rankingEspecialistas}
              color="amber"
              icon="👑"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
