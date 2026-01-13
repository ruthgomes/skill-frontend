"use client"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockOperators } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, BookOpen, Users } from "lucide-react"

export default function SkillsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "tecnico") {
    router.push("/")
    return null
  }

  const currentUser = mockOperators[0]

  const skillsData = Object.entries(currentUser.skills).map(([name, value]) => ({
    name,
    value,
    target: 95,
  }))

  const skillCategories = [
    {
      name: "Atendimento",
      description: "Qualidade na comunicação com clientes",
      icon: Users,
      skills: ["Empatia", "Clareza", "Escuta Ativa"],
    },
    {
      name: "Técnica",
      description: "Conhecimento técnico de produtos e sistemas",
      icon: Zap,
      skills: ["Sistemas", "Troubleshooting", "Documentação"],
    },
    {
      name: "Conhecimento",
      description: "Domínio de conteúdo e processos",
      icon: BookOpen,
      skills: ["Produtos", "Procedimentos", "Políticas"],
    },
  ]

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Minhas Skills</h1>
          <p className="text-muted-foreground mt-1">Acompanhe e desenvolva suas competências</p>
        </div>

        {/* Skills Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral de Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="var(--color-muted)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Skills */}
        <div className="space-y-4">
          {Object.entries(currentUser.skills).map(([skillName, value]) => (
            <Card key={skillName}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{skillName}</h3>
                      <p className="text-sm text-muted-foreground">Seu nível atual</p>
                    </div>
                    <Badge className={value >= 90 ? "bg-chart-1" : value >= 80 ? "bg-chart-3" : "bg-chart-2"}>
                      {value}%
                    </Badge>
                  </div>
                  <Progress value={value} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{value}% concluído</span>
                    <span>{100 - value}% para meta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skill Categories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Categorias de Desenvolvimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 p-2 rounded bg-muted">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Improvement Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendações de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { skill: "Técnica", recommendation: "Complete o treinamento avançado de sistemas", status: "pending" },
              { skill: "Atitude", recommendation: "Excelente desempenho! Mantenha o ritmo", status: "completed" },
              {
                skill: "Conhecimento",
                recommendation: "Participe da sessão de atualização de produtos",
                status: "pending",
              },
            ].map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  rec.status === "completed" ? "bg-chart-1/5 border-chart-1/20" : "bg-muted border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">{rec.skill}</div>
                    <div className="text-sm text-muted-foreground mt-1">{rec.recommendation}</div>
                  </div>
                  {rec.status === "completed" && <Badge className="bg-chart-1 ml-2">Concluído</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
