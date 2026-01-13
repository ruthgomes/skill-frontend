"use client"

import { useAuth } from "@/lib/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import { mockTecnicos, SKILLS } from "@/lib/data"
import { useState, useMemo } from "react"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface EvaluationForm {
  operatorId: string
  skills: Record<string, number>
  notes: string
  quarter: number
  year: number
}

export default function AvaliacoesPage() {
  const { user } = useAuth()
  const [expandedOperator, setExpandedOperator] = useState<string | null>(null)
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>({
    operatorId: "",
    skills: {},
    notes: "",
    quarter: 0,
    year: new Date().getFullYear(),
  })
  const [submittedEvaluations, setSubmittedEvaluations] = useState<string[]>([])
  const [currentQuarter, setCurrentQuarter] = useState<number>(() => {
    const month = new Date().getMonth()
    return Math.floor(month / 3) + 1
  })

  const getLastEvaluationDate = (operatorId: string) => {
    const operator = mockTecnicos.find((op) => op.id === operatorId)
    if (!operator || operator.quarterlyNotes.length === 0) return null
    return new Date(operator.quarterlyNotes[operator.quarterlyNotes.length - 1].evaluatedDate)
  }

  const canEvaluate = (operatorId: string): boolean => {
    const lastEval = getLastEvaluationDate(operatorId)
    if (!lastEval) return true
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return lastEval <= threeMonthsAgo
  }

  const getNextEvaluationDate = (operatorId: string): string => {
    const lastEval = getLastEvaluationDate(operatorId)
    if (!lastEval) return "Disponível agora"
    const nextDate = new Date(lastEval)
    nextDate.setMonth(nextDate.getMonth() + 3)
    return nextDate.toLocaleDateString("pt-BR")
  }

  const operatorsForEvaluation = useMemo(() => {
    return mockTecnicos.filter((op) => op.status === "ativo")
  }, [])

  const handleSkillChange = (skillId: string, value: number) => {
    setEvaluationForm((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillId]: value,
      },
    }))
  }

  const handleSubmitEvaluation = () => {
    if (!expandedOperator || Object.keys(evaluationForm.skills).length === 0) {
      alert("Por favor, avalie todas as habilidades")
      return
    }

    const average = (
      Object.values(evaluationForm.skills).reduce((a, b) => a + b, 0) / Object.values(evaluationForm.skills).length
    ).toFixed(1)

    setSubmittedEvaluations((prev) => [...prev, expandedOperator])

    setExpandedOperator(null)
    setEvaluationForm({
      operatorId: "",
      skills: {},
      notes: "",
      quarter: currentQuarter,
      year: new Date().getFullYear(),
    })

    alert(
      `Avaliação de ${mockTecnicos.find((op) => op.id === expandedOperator)?.name} registrada com sucesso!\nPontuação média: ${average}`,
    )
  }

  const handleCardClick = (operatorId: string) => {
    if (!canEvaluate(operatorId)) return

    if (expandedOperator === operatorId) {
      setExpandedOperator(null)
      setEvaluationForm({
        operatorId: "",
        skills: {},
        notes: "",
        quarter: currentQuarter,
        year: new Date().getFullYear(),
      })
    } else {
      setExpandedOperator(operatorId)
      setEvaluationForm({
        operatorId,
        skills: {},
        notes: "",
        quarter: currentQuarter,
        year: new Date().getFullYear(),
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Avaliações Trimestrais</h1>
          <p className="text-muted-foreground mt-2">Avalie técnicos a cada 3 meses para acompanhar seu desenvolvimento</p>
        </div>

        {/* Quarter Selector */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">Período de Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Trimestre:</label>
                <select
                  value={currentQuarter}
                  onChange={(e) => setCurrentQuarter(Number(e.target.value))}
                  className="px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={1}>1º Trimestre (Jan-Mar)</option>
                  <option value={2}>2º Trimestre (Abr-Jun)</option>
                  <option value={3}>3º Trimestre (Jul-Set)</option>
                  <option value={4}>4º Trimestre (Out-Dez)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Ano:</label>
                <select
                  value={evaluationForm.year}
                  onChange={(e) => setEvaluationForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
                  className="px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operators List */}
        <div className="space-y-4">
          {operatorsForEvaluation.map((operator) => {
            const canEval = canEvaluate(operator.id)
            const isExpanded = expandedOperator === operator.id
            const isEvaluated = submittedEvaluations.includes(operator.id)

            return (
              <Card
                key={operator.id}
                className={`transition-all ${
                  isExpanded
                    ? "border-primary shadow-lg"
                    : canEval
                      ? "hover:border-primary/50 hover:shadow-md"
                      : "opacity-60"
                } ${!canEval ? "cursor-not-allowed" : ""}`}
              >
                {/* Card Header - Clickable */}
                <CardHeader
                  onClick={() => handleCardClick(operator.id)}
                  className={`${canEval ? "cursor-pointer" : "cursor-not-allowed"} p-6`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{operator.name}</CardTitle>
                          {isEvaluated && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Avaliado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{operator.workday}</span>
                          <span>•</span>
                          <span>Máquina: {operator.machine}</span>
                          <span>•</span>
                          <span>Turno: {operator.shift}º</span>
                        </div>
                        {!canEval && (
                          <p className="text-xs text-destructive mt-2">
                            Próxima avaliação disponível em: {getNextEvaluationDate(operator.id)}
                          </p>
                        )}
                      </div>
                    </div>
                    {canEval && (
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-primary" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-6">Avaliação de Desempenho</h3>

                    {/* Skills Evaluation */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-4">Avalie as Habilidades (0 a 5)</h4>
                      <div className="space-y-6">
                        {SKILLS.map((skill) => (
                          <Card key={skill.id} className="border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-medium">
                                  {skill.name}
                                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                                    {skill.category}
                                  </Badge>
                                </Label>
                                <span className="text-lg font-bold text-primary min-w-[3rem] text-right">
                                  {(evaluationForm.skills[skill.id] ?? 0).toFixed(1)}
                                </span>
                              </div>
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="5"
                                  step="0.5"
                                  value={evaluationForm.skills[skill.id] ?? 0}
                                  onChange={(e) => handleSkillChange(skill.id, Number(e.target.value))}
                                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                {/* Scale markers */}
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>0</span>
                                  <span>1</span>
                                  <span>2</span>
                                  <span>3</span>
                                  <span>4</span>
                                  <span>5</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                      <Label htmlFor="notes" className="text-sm font-medium mb-2">
                        Observações e Feedback
                      </Label>
                      <Textarea
                        id="notes"
                        value={evaluationForm.notes}
                        onChange={(e) => setEvaluationForm((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Adicione feedback, pontos fortes e áreas de melhoria..."
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    {/* Score Preview */}
                    <Card className="bg-primary/5 border-primary/20 mb-6">
                      <CardContent className="p-4">
                        <p className="text-sm">
                          <span className="font-semibold">Pontuação Média:</span>{" "}
                          <span className="text-2xl font-bold text-primary ml-2">
                            {evaluationForm.skills && Object.keys(evaluationForm.skills).length > 0
                              ? (
                                  Object.values(evaluationForm.skills).reduce((a, b) => a + b, 0) /
                                  Object.values(evaluationForm.skills).length
                                ).toFixed(1)
                              : "0.0"}
                          </span>
                          <span className="text-muted-foreground ml-1">/ 5.0</span>
                        </p>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button onClick={handleSubmitEvaluation} size="lg">
                        Confirmar Avaliação
                      </Button>
                      <Button onClick={() => handleCardClick(operator.id)} variant="outline" size="lg">
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
