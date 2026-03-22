"use client"

import { useAuth, useNotification } from "@/core/contexts"
import { fetchAllPaginated } from "@/core/utils/pagination.utils"
import { AppLayout } from "@/shared/components/layout"
import { useState, useMemo, useEffect } from "react"
import evaluationsService from "@/core/services/evaluations.service"
import tecnicosService from "@/core/services/tecnicos.service"
import skillsService from "@/core/services/skills.service"
import type { Tecnico, Skill, Evaluation } from "@/core/types"
import { EvaluationType } from "@/core/types"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"

interface EvaluationForm {
  operatorId: string
  skills: Record<string, number>
  notes: string
  quarter: number
  year: number
}

export default function AvaliacoesPage() {
  const { user } = useAuth()
  const { success, error: showError } = useNotification()
  
  // Data states
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // UI states
  const [expandedOperator, setExpandedOperator] = useState<string | null>(null)
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>({
    operatorId: "",
    skills: {},
    notes: "",
    quarter: 0,
    year: new Date().getFullYear(),
  })
  const [currentQuarter, setCurrentQuarter] = useState<number>(() => {
    const month = new Date().getMonth()
    return Math.floor(month / 3) + 1
  })

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 Carregando dados de avaliações...")
      try {
        setLoading(true)
        setError(null)
        
        // Fetch tecnicos and skills in parallel
        const [tecnicosData, skillsData] = await Promise.all([
          fetchAllPaginated((page, limit) => tecnicosService.findAll({ page, limit })),
          skillsService.findAll(),
        ])
        
        console.log(`✅ ${tecnicosData.length} técnicos carregados`)
        console.log(`✅ ${skillsData.length} skills carregadas`)
        
        setTecnicos(tecnicosData)
        setSkills(skillsData)
        
        // Fetch evaluations for each tecnico
        const evaluationsMap: Record<string, Evaluation[]> = {}
        await Promise.all(
          tecnicosData.map(async (tecnico) => {
            try {
              const evals = await evaluationsService.findByTecnico(tecnico.id)
              evaluationsMap[tecnico.id] = evals
            } catch (err: any) {
              // If endpoint not implemented (404) or no evaluations found, that's ok
              if (err.message?.includes('404') || err.message?.includes('Not Found')) {
                console.warn(`⚠️ Endpoint de avaliações ainda não implementado no backend`)
              }
              evaluationsMap[tecnico.id] = []
            }
          })
        )
        
        setEvaluations(evaluationsMap)
        console.log("✅ Histórico de avaliações carregado (ou endpoints não disponíveis)")
        
      } catch (err: any) {
        console.error("❌ Erro ao carregar dados:", err)
        setError(err.message || "Erro ao carregar dados")
        showError("Erro ao carregar dados. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const getLastEvaluationDate = (operatorId: string) => {
    const operatorEvals = evaluations[operatorId] || []
    if (operatorEvals.length === 0) return null
    
    // Sort by createdAt and get the most recent
    const sorted = [...operatorEvals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return new Date(sorted[0].createdAt)
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
    return tecnicos.filter((tecnico) => tecnico.status) // status = true means active
  }, [tecnicos])

  const handleSkillChange = (skillId: string, value: number) => {
    setEvaluationForm((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillId]: value,
      },
    }))
  }

  const handleSubmitEvaluation = async () => {
    if (!expandedOperator || Object.keys(evaluationForm.skills).length === 0) {
      showError("Por favor, avalie todas as habilidades")
      return
    }
    
    if (!user) {
      showError("Usuário não autenticado")
      return
    }

    try {
      setSubmitting(true)
      console.log("📝 Criando avaliação...")
      
      // Prepare criteria from evaluated skills
      const criteria = Object.entries(evaluationForm.skills).map(([skillId, score]) => {
        const skill = skills.find((s) => s.id === skillId)
        return {
          name: skill?.name || "Skill",
          description: skill?.description || undefined,
          weight: 100 / Object.keys(evaluationForm.skills).length, // Equal weight for all skills
          score: score, // Keep 0-5 scale (backend calculates totalScore)
          maxScore: 5, // Maximum score is 5
          comments: "",
        }
      })
      
      const evaluationData = {
        type: EvaluationType.QUARTERLY, // "quarterly"
        quarter: currentQuarter,
        year: evaluationForm.year,
        evaluationDate: new Date().toISOString(), // required field
        tecnicoId: expandedOperator,
        evaluatorId: user.id,
        criteria,
        generalComments: evaluationForm.notes || undefined,
      }
      
      const newEvaluation = await evaluationsService.create(evaluationData)
      console.log("✅ Avaliação criada:", newEvaluation.id)
      
      // Update local evaluations
      setEvaluations((prev) => ({
        ...prev,
        [expandedOperator]: [...(prev[expandedOperator] || []), newEvaluation],
      }))
      
      const average = (
        Object.values(evaluationForm.skills).reduce((a, b) => a + b, 0) / Object.values(evaluationForm.skills).length
      ).toFixed(1)
      
      const operatorName = tecnicos.find((t) => t.id === expandedOperator)?.name

      setExpandedOperator(null)
      setEvaluationForm({
        operatorId: "",
        skills: {},
        notes: "",
        quarter: currentQuarter,
        year: new Date().getFullYear(),
      })

      success(
        `Avaliação de ${operatorName} registrada com sucesso! Pontuação média: ${average}`,
        6000
      )
    } catch (err: any) {
      console.error("❌ Erro ao criar avaliação:", err)
      
      // Check if it's a 404 (endpoint not implemented yet)
      if (err.message?.includes('404') || err.message?.includes('Not Found') || err.message?.includes('Cannot POST')) {
        showError(
          "⚠️ Endpoint de avaliações ainda não implementado no backend. " +
          "A funcionalidade estará disponível após a implementação no servidor."
        )
      } else {
        showError(err.message || "Erro ao criar avaliação. Tente novamente.")
      }
    } finally {
      setSubmitting(false)
    }
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
          <p className="text-muted-foreground mt-2">Avalie colaboradores a cada 3 meses para acompanhar seu desenvolvimento</p>
        </div>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-destructive">
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
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
          {operatorsForEvaluation.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                📋 Nenhum técnico disponível para avaliação
              </CardContent>
            </Card>
          ) : (
            operatorsForEvaluation.map((operator) => {
              const canEval = canEvaluate(operator.id)
              const isExpanded = expandedOperator === operator.id
              // Check if has evaluation in current quarter
              const hasEvaluation = (evaluations[operator.id] || []).some(
                (e) => e.quarter === currentQuarter && e.year === evaluationForm.year
              )

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
                            {hasEvaluation && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Avaliado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{operator.workday || operator.employeeNumber}</span>
                            <span>•</span>
                            <span>{operator.senioridade || operator.cargo || "Sem cargo"}</span>
                            <span>•</span>
                            <span>Turno: {operator.shift || "Não definido"}</span>
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
                      {skills.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          Nenhuma habilidade cadastrada
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {skills.map((skill) => (
                            <Card key={skill.id} className="border-border/50">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <Label className="text-sm font-medium">
                                    {skill.name}
                                    <Badge variant="outline" className="ml-2 text-xs font-normal">
                                      {skill.category}
                                    </Badge>
                                  </Label>
                                  <span className="text-lg font-bold text-primary min-w-12 text-right">
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
                      )}
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
                      <Button 
                        onClick={handleSubmitEvaluation} 
                        size="lg"
                        disabled={submitting || Object.keys(evaluationForm.skills).length === 0}
                      >
                        {submitting ? "Enviando..." : "Confirmar Avaliação"}
                      </Button>
                      <Button 
                        onClick={() => handleCardClick(operator.id)} 
                        variant="outline" 
                        size="lg"
                        disabled={submitting}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
              )
            })
          )}
        </div>
        </>
        )}
      </div>
    </AppLayout>
  )
}
