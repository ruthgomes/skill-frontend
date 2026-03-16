"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/shared/components/layout"
import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { mockTecnicos } from "@/shared/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Search, User } from "lucide-react"

export default function OperatorsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOperator, setSelectedOperator] = useState(mockTecnicos[0])

  useEffect(() => {
    if (!user || user.role !== "master") {
      router.replace("/login")
    }
  }, [user, router])

  if (!user || user.role !== "master") {
    return null
  }

  const filteredOperators = mockTecnicos.filter(
    (op) =>
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.workday.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const skillsData = Object.entries(selectedOperator.skills).map(([key, value]) => ({
    name: key,
    value,
  }))

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Técnicos</h1>
          <p className="text-muted-foreground mt-1">Visualize e gerencie técnicos e suas métricas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Operator List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Operadores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  placeholder="Pesquisar operador..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredOperators.map((op) => {
                  const skillCount = Object.keys(op.skills).length
                  return (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOperator(op)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedOperator.id === op.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium text-sm">{op.name}</div>
                      <div
                        className={`text-xs ${
                          selectedOperator.id === op.id ? "opacity-90" : "text-muted-foreground"
                        }`}
                      >
                        {skillCount} skills
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Operator Details */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      {selectedOperator.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedOperator.workday}</p>
                  </div>
                  <Badge className={selectedOperator.status === "ativo" ? "bg-chart-1" : "bg-muted"}>
                    {selectedOperator.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Total de Skills</div>
                    <div className="text-2xl font-bold">{Object.keys(selectedOperator.skills).length}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Média de Skills</div>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        Object.values(selectedOperator.skills).reduce((a, b) => a + b, 0) /
                          Object.values(selectedOperator.skills).length,
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Cargo</div>
                    <div className="text-sm font-bold">{selectedOperator.cargo}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Senioridade</div>
                    <div className="text-sm font-bold">{selectedOperator.senioridade}</div>
                  </div>
                </div>

                {/* Skills Chart */}
                <div>
                  <h3 className="font-semibold mb-4">Avaliação de Skills</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={skillsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                      <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
