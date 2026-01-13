"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { mockTecnicos, SKILLS, mockTeams } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ArrowLeft, Calendar, Briefcase, Clock, TrendingUp, Camera, Trash2, Users } from "lucide-react"
import { useState, useRef } from "react"

export default function TecnicoDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const tecnicoId = params.id as string
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user || user.role !== "master") {
    router.push("/")
    return null
  }

  const tecnico = mockTecnicos.find((t) => t.id === tecnicoId)

  if (!tecnico) {
    return (
      <AppLayout>
        <div className="p-8">
          <Card className="border-primary/10">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Técnico não encontrado</p>
              <Button onClick={() => router.push("/tecnicos")} className="mt-4">
                Voltar
              </Button>
            </CardContent>
          </Card>
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

  // Prepare evolution data for line chart
  const evolutionData = tecnico.quarterlyNotes
    .slice()
    .reverse()
    .map((note) => ({
      quarter: `Q${note.quarter}/${note.year}`,
      score: note.score,
    }))

  // Prepare radar chart data for skills
  const radarData = Object.entries(tecnico.skills).map(([skillId, score]) => {
    const skill = SKILLS.find((s) => s.id === skillId)
    return {
      name: skill?.name || `Skill ${skillId}`,
      value: score,
      fullMark: 100,
    }
  })

  const lastScore = tecnico.quarterlyNotes[0]?.score || 0
  const averageScore =
    tecnico.quarterlyNotes.reduce((sum, note) => sum + note.score, 0) / tecnico.quarterlyNotes.length || 0

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoDelete = () => {
    setProfilePhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/tecnicos")} className="mb-4">
          <ArrowLeft className="mr-2" size={16} />
          Voltar para Técnicos
        </Button>

        {/* Header with Photo and Basic Info */}
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar with Photo Upload */}
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  {profilePhoto ? (
                    <AvatarImage src={profilePhoto} alt={tecnico.name} />
                  ) : (
                    <AvatarFallback className="text-4xl font-bold bg-primary text-white">{initials}</AvatarFallback>
                  )}
                </Avatar>
                
                {/* Photo Controls */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={handlePhotoClick}
                    title="Alterar foto"
                  >
                    <Camera size={16} />
                  </Button>
                  {profilePhoto && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={handlePhotoDelete}
                      title="Excluir foto"
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
                    <Badge variant={tecnico.status === "ativo" ? "default" : "secondary"} className="text-sm">
                      {tecnico.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">{tecnico.workday}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Briefcase className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Cargo</p>
                      <p className="font-semibold text-foreground">{tecnico.cargo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Clock className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Turno</p>
                      <p className="font-semibold text-foreground">{tecnico.shift}º Turno</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Users className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Área</p>
                      <p className="font-semibold text-foreground">{tecnico.area}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Users className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-semibold text-foreground">
                        {tecnico.teamId ? mockTeams.find(t => t.id === tecnico.teamId)?.name || "N/A" : "Sem time"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Calendar className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Data de Entrada</p>
                      <p className="font-semibold text-foreground">
                        {new Date(tecnico.joinDate).toLocaleDateString("pt-BR")}
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
              <div className="text-4xl font-bold text-primary">{lastScore}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {tecnico.quarterlyNotes[0]
                  ? new Date(tecnico.quarterlyNotes[0].evaluatedDate).toLocaleDateString("pt-BR")
                  : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Média Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{averageScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-2">pontos</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{tecnico.quarterlyNotes.length}</div>
              <p className="text-xs text-muted-foreground mt-2">trimestres</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{Object.keys(tecnico.skills).length}</div>
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
                  <YAxis domain={[0, 100]} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {radarData.map((skill) => {
                const skillInfo = SKILLS.find((s) => s.name === skill.name)
                return (
                  <div key={skill.name} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-foreground">{skill.name}</span>
                        <p className="text-xs text-muted-foreground mt-1">{skillInfo?.category}</p>
                      </div>
                      <span className="text-lg font-bold text-primary">{skill.value}%</span>
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
          </CardContent>
        </Card>

        {/* Historical Notes */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Histórico de Avaliações Trimestrais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tecnico.quarterlyNotes.map((note) => (
                <div key={`${note.year}-${note.quarter}`} className="p-4 border border-primary/10 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-foreground text-lg">
                          Q{note.quarter} {note.year}
                        </p>
                        <Badge className="bg-primary text-white">{note.score} pontos</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Avaliado em: {new Date(note.evaluatedDate).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-foreground">{note.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
