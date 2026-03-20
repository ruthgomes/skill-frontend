"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { authService } from "@/core/services"
import type { Tecnico } from "@/core/types/api.types"

export type UserRole = "master" | "supervisor"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  workday?: string
  isActive: boolean
  // Sistema Multi-Supervisor: vincula User a Tecnico (se for supervisor)
  tecnicoId?: string | null
  tecnico?: Tecnico | null
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isSupervisor: boolean  // True se user.tecnicoId existe
  isAdmin: boolean       // True se user.tecnicoId === null (admin vê tudo)
  supervisorId: string | null  // ID do técnico vinculado (se supervisor)
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Chave para armazenamento local
const AUTH_STORAGE_KEY = "skillfix_auth_user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Calcular flags baseadas no user
  const isSupervisor = !!user?.tecnicoId
  const isAdmin = !user?.tecnicoId && !!user  // Logado mas sem tecnicoId = Admin
  const supervisorId = user?.tecnicoId || null

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Erro ao carregar sessão:", error)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar usuário no localStorage quando mudar
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } catch (error) {
        console.error("Erro ao salvar sessão:", error)
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('🔐 Tentando fazer login...')
      console.log('📧 Email:', email)
      
      // Chama o backend real
      const loginResponse = await authService.login({ email, password })
      
      console.log('✅ Login realizado com sucesso!')
      console.log('🔑 Access Token recebido:', loginResponse.accessToken.substring(0, 20) + '...')
      
      // WORKAROUND: Como /auth/me não existe, usamos /auth/refresh para obter dados do usuário
      // O endpoint refresh retorna: { accessToken, refreshToken, user }
      console.log('🔄 Buscando dados do usuário via refresh...')
      const refreshResponse = await authService.refreshToken({ 
        refreshToken: loginResponse.refreshToken 
      })
      
      console.log('👤 Dados do usuário:', refreshResponse.user)
      
      const authenticatedUser: AuthUser = {
        id: refreshResponse.user.id,
        email: refreshResponse.user.email,
        name: refreshResponse.user.name,
        role: refreshResponse.user.role as UserRole,
        workday: refreshResponse.user.workday || undefined,
        isActive: refreshResponse.user.isActive,
        tecnicoId: refreshResponse.user.tecnicoId || null,
        tecnico: refreshResponse.user.tecnico || null,
      }

      setUser(authenticatedUser)
      
      console.log('✅ Usuário autenticado e salvo no contexto!')
      
    } catch (error) {
      console.error('❌ Erro no login:', error)
      setUser(null)
      
      // Lança erro mais amigável
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erro ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      console.log('🚪 Fazendo logout...')
      
      // Chama o backend para fazer logout
      await authService.logout()
      
      console.log('✅ Logout realizado!')
    } catch (error) {
      console.error('⚠️ Erro no logout:', error)
      // Continua mesmo se der erro no backend
    } finally {
      // Sempre limpa o estado local
      setUser(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isSupervisor, 
        isAdmin, 
        supervisorId,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
