"use client"

import { useAuth, useNotification } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppLayout } from "@/shared/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import usersService from "@/core/services/users.service"
import type { User } from "@/core/types"
import { UserCheck, UserX, Clock } from "lucide-react"

export default function UsuariosPage() {
  const { user } = useAuth()
  const { error: showError } = useNotification()
  const router = useRouter()
  
  // States
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authorization
  useEffect(() => {
    if (!user || user.role !== "master") {
      router.replace("/login")
    }
  }, [user, router])
  
  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return
      
      console.log("🔄 Carregando usuários...")
      try {
        setLoading(true)
        setError(null)
        
        const response = await usersService.findAll({ limit: 100 })
        const usersData = response.data || []
        
        console.log(`✅ ${usersData.length} usuários carregados`)
        setUsers(usersData)
        
      } catch (err: any) {
        console.error("❌ Erro ao carregar usuários:", err)
        setError(err.message || "Erro ao carregar usuários")
        showError("Erro ao carregar usuários. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [user, showError])

  if (!user || user.role !== "master") {
    return null
  }

  const formatLastLogin = (lastLogin?: string | null) => {
    if (!lastLogin) return "Nunca"
    const date = new Date(lastLogin)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Usuários do Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciar Masters e Supervisores com acesso ao sistema
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Carregando usuários...</p>
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

        {/* Users List */}
        {!loading && !error && (
          <Card className="border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usuários Cadastrados ({users.length})</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Masters e Supervisores do sistema
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  👥 Nenhum usuário encontrado
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        u.isActive
                          ? "border-primary/10 hover:border-primary/30"
                          : "border-destructive/20 bg-destructive/5"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{u.name}</p>
                          {!u.isActive && (
                            <Badge variant="destructive" className="text-xs">
                              <UserX className="w-3 h-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        {u.workday && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Jornada: {u.workday === "diurno" ? "Diurno" : "Noturno"}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          Último login: {formatLastLogin(u.lastLogin)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            u.role === "master"
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-white capitalize`}
                        >
                          {u.role === "master" ? "Master" : "Supervisor"}
                        </Badge>
                        {u.isActive && (
                          <UserCheck className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
