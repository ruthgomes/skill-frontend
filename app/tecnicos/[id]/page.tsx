"use client"

import { useAuth, useNotification } from "@/core/contexts"
import { useRouter, useParams } from "next/navigation"
import { AppLayout } from "@/shared/components/layout"
import { tecnicosService, teamsService, skillsService } from "@/core/services"
import evaluationsService from "@/core/services/evaluations.service"
import type { Tecnico, Skill, Evaluation } from "@/core/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { ArrowLeft, Calendar, Briefcase, Clock, TrendingUp, Camera, Trash2, Users, Loader2, AlertCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"

// URL base do backend para servir arquivos estáticos
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function TecnicoDetailPage() {
  const { user } = useAuth()
  const { error: showError, success } = useNotification()
  const router = useRouter()
  const params = useParams()
  const tecnicoId = params.id as string
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoTimestamp, setPhotoTimestamp] = useState<number>(Date.now())
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Backend integration states
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [teamName, setTeamName] = useState<string>("Sem time")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    } else {
      fetchTecnicoData()
    }
  }, [user, router, tecnicoId])

  const fetchTecnicoData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Carregando dados do técnico...', tecnicoId)
      
      // Fetch tecnico
      const tecnicoData = await tecnicosService.findOne(tecnicoId)
      setTecnico(tecnicoData)
      console.log('✅ Técnico carregado:', tecnicoData.name)
      
      // Atualizar timestamp da foto para forçar re-renderização da imagem
      if (tecnicoData.photo) {
        setPhotoTimestamp(Date.now())
      }
      
      // Fetch team name if has team
      if (tecnicoData.teamId) {
        try {
          const team = await teamsService.findOne(tecnicoData.teamId)
          setTeamName(team.name)
        } catch (err) {
          console.warn('⚠️ Erro ao carregar time, usando valor padrão')
        }
      }
      
      // Fetch all skills to get names
      try {
        const allSkills = await skillsService.findAll()
        setSkills(allSkills)
      } catch (err) {
        console.warn('⚠️ Erro ao carregar skills')
      }
      
      // Fetch evaluations for this tecnico
      try {
        const evaluationsData = await evaluationsService.findByTecnico(tecnicoId)
        setEvaluations(evaluationsData || [])
        console.log('✅ Avaliações carregadas:', evaluationsData.length)
      } catch (err: any) {
        // If 404 or endpoint not found, that's ok (no evaluations yet)
        if (err.message?.includes('404') || err.message?.includes('Not Found')) {
          console.warn('⚠️ Endpoint de avaliações ainda não implementado ou sem avaliações')
          setEvaluations([])
        } else {
          console.warn('⚠️ Erro ao carregar avaliações:', err)
          setEvaluations([])
        }
      }
      
    } catch (err) {
      console.error('❌ Erro ao carregar técnico:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar técnico'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 flex justify-center items-center min-h-100">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Carregando dados do colaborador...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error || !tecnico) {
    return (
      <AppLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error || "Colaborador não encontrado"}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchTecnicoData}>
                  Tentar novamente
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/tecnicos")}>
                  Voltar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  // Get initials for avatar
  const initials = tecnico.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Prepare evolution data for line chart from real evaluations
  const evolutionData: { quarter: string; score: number }[] = evaluations
    .sort((a, b) => {
      // Sort by year then quarter
      if (a.year !== b.year) return a.year - b.year
      return a.quarter - b.quarter
    })
    .map((evaluation) => ({
      quarter: `Q${evaluation.quarter}/${evaluation.year}`,
      score: evaluation.totalScore || 0,
    }))
  
  // Prepare radar chart data for skills
  const radarData = (tecnico.tecnicoSkills || []).map((ts) => {
    const skill = skills.find((s) => s.id === ts.skillId)
    return {
      name: skill?.name || ts.skill?.name || `Skill ${ts.skillId}`,
      value: ts.score || 0,
      fullMark: 100,
    }
  })

  const lastScore = evolutionData.length > 0 
    ? Number(evolutionData[evolutionData.length - 1]?.score || 0)
    : 0
  const averageScore = evolutionData.length > 0
    ? evolutionData.reduce((sum, note) => sum + Number(note.score || 0), 0) / evolutionData.length
    : 0

  // Get the last evaluation date
  const lastEvaluation = evaluations.length > 0 ? evaluations[evaluations.length - 1] : null
  const lastEvaluationDate = lastEvaluation 
    ? new Date(lastEvaluation.evaluationDate).toLocaleDateString("pt-BR")
    : null

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validação do arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type)) {
        showError('Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF')
        return
      }
      
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        showError('Imagem muito grande. Tamanho máximo: 5MB')
        return
      }
      
      // Upload da foto
      uploadPhoto(file)
    }
  }

  const uploadPhoto = async (file: File) => {
    try {
      setUploadingPhoto(true)
      console.log('📸 Fazendo upload da foto...')
      
      await tecnicosService.uploadPhoto(tecnicoId, file)
      
      success('Foto atualizada com sucesso!')
      console.log('✅ Foto enviada')
      
      // Atualizar timestamp para forçar reload da imagem
      setPhotoTimestamp(Date.now())
      
      // Recarregar dados do técnico para obter URL da foto
      await fetchTecnicoData()
    } catch (err) {
      console.error('❌ Erro ao fazer upload da foto:', err)
      showError(err instanceof Error ? err.message : 'Erro ao fazer upload da foto')
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handlePhotoClick = () => {
    if (!uploadingPhoto) {
      fileInputRef.current?.click()
    }
  }

  const handlePhotoDelete = async () => {
    if (!tecnico?.photo) return
    
    try {
      setUploadingPhoto(true)
      console.log('🗑️ Removendo foto...')
      
      await tecnicosService.removePhoto(tecnicoId)
      
      success('Foto removida com sucesso!')
      console.log('✅ Foto removida')
      
      // Atualizar timestamp para forçar reload da imagem
      setPhotoTimestamp(Date.now())
      
      // Recarregar dados do técnico
      await fetchTecnicoData()
    } catch (err) {
      console.error('❌ Erro ao remover foto:', err)
      showError(err instanceof Error ? err.message : 'Erro ao remover foto')
    } finally {
      setUploadingPhoto(false)
    }
  }
  
  // Construir URL completa da foto com cache buster
  const getPhotoURL = (photoPath: string | null | undefined): string | null => {
  if (!photoPath) return null
  
  // Se já for uma URL completa, retorna ela
  if (photoPath.startsWith('http')) {
    return `${photoPath}?t=${photoTimestamp}`
  }
  
  // Remove barras duplicadas e garante o formato correto
  const cleanPath = photoPath.replace(/^\/+/, '')
  return `${API_BASE_URL}/${cleanPath}?t=${photoTimestamp}`
}

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/tecnicos")} className="mb-4">
          <ArrowLeft className="mr-2" size={16} />
          Voltar para Colaboradores
        </Button>

        {/* Header with Photo and Basic Info */}
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar with Photo Upload */}
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-primary/20" key={`avatar-${photoTimestamp}`}>
                  {tecnico.photo ? (
                    <AvatarImage 
                      key={`photo-${tecnico.photo}-${photoTimestamp}`}
                      src={getPhotoURL(tecnico.photo) || undefined} 
                      alt={tecnico.name}
                      onError={(e) => {
                        console.error('❌ Erro ao carregar imagem:', tecnico.photo)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="text-4xl font-bold bg-primary text-white">{initials}</AvatarFallback>
                </Avatar>
                
                {/* Photo Controls */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={handlePhotoClick}
                    title="Alterar foto"
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  </Button>
                  {tecnico.photo && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={handlePhotoDelete}
                      title="Excluir foto"
                      disabled={uploadingPhoto}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-primary">{tecnico.name}</h1>
                    <Badge variant={tecnico.status ? "default" : "secondary"} className="text-sm">
                      {tecnico.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">{tecnico.workday || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Briefcase className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Cargo</p>
                      <p className="font-semibold text-foreground">{tecnico.cargo || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <TrendingUp className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Senioridade</p>
                      <p className="font-semibold text-foreground">{tecnico.senioridade || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Clock className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Turno</p>
                      <p className="font-semibold text-foreground">{tecnico.shift || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Users className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Área</p>
                      <p className="font-semibold text-foreground">{tecnico.area || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Users className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-semibold text-foreground">{ teamName }</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Calendar className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Data de Entrada</p>
                      <p className="font-semibold text-foreground">
                        {tecnico.joinDate ? new Date(tecnico.joinDate).toLocaleDateString("pt-BR") : tecnico.admissionDate ? new Date(tecnico.admissionDate).toLocaleDateString("pt-BR") : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp size={16} />
                Última Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {lastEvaluationDate || '--'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {lastEvaluationDate ? `Nota: ${lastScore.toFixed(1)} / 5.0` : 'Sem avaliações'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Média Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {averageScore > 0 ? averageScore.toFixed(1) : '--'}
                {averageScore > 0 && <span className="text-lg text-muted-foreground"> / 5.0</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {averageScore > 0 ? `(${((averageScore / 5) * 100).toFixed(0)}%)` : 'sem dados'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{evolutionData.length}</div>
              <p className="text-xs text-muted-foreground mt-2">trimestres</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{radarData.length}</div>
              <p className="text-xs text-muted-foreground mt-2">avaliadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolution Chart */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Evolução de Desempenho (Últimos 5 Anos)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0A3D62" strokeWidth={2} dot={{ fill: "#0A3D62" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart for Skills */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Perfil de Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} angle={90} />
                  <Radar name="Pontuação" dataKey="value" stroke="#0A3D62" fill="#0A3D62" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Skills Breakdown */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Detalhamento de Habilidades por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {radarData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {radarData.map((skill, index) => {
                  const skillInfo = skills.find((s) => s.name === skill.name)
                  return (
                    <div key={`${skill.name}-${index}`} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-foreground">{skill.name}</span>
                          <p className="text-xs text-muted-foreground mt-1">{skillInfo?.category || 'N/A'}</p>
                        </div>
                        <span className="text-lg font-bold text-primary">{skill.value.toFixed(0)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all"
                          style={{ width: `${skill.value}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma habilidade avaliada ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Historical Notes */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Histórico de Avaliações Trimestrais</CardTitle>
          </CardHeader>
          <CardContent>
            {evolutionData.length > 0 ? (
              <div className="space-y-3">
                {evolutionData.map((note, index) => (
                  <div key={index} className="p-4 border border-primary/10 rounded-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-foreground text-lg">
                            {note.quarter}
                          </p>
                          <Badge className="bg-primary text-white">{note.score} pontos</Badge>
                        </div>
                        <p className="text-sm text-foreground">Avaliação trimestral</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma avaliação registrada ainda. As avaliações trimestrais aparecerão aqui.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
