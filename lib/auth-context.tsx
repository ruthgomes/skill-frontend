"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { generateId } from "./id-generator"
import type { Tecnico } from "@/core/types/api.types"

export type UserRole = "master" | "tecnico"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  workday?: string
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

// Usuários mockados para demonstração
// TODO: Remover quando integrar com backend real
const mockUsers: Record<string, { 
  name: string
  role: UserRole
  workday?: string
  password: string
  tecnicoId?: string | null
  tecnico?: Tecnico | null
}> = {
  "master@example.com": { 
    name: "Maria Silva", 
    role: "master",
    password: "Demo@2024!",
    tecnicoId: null,  // Admin não tem tecnicoId
    tecnico: null
  },
  // Exemplo de Supervisor
  "supervisor@example.com": {
    name: "Carlos Supervisor",
    role: "master",
    password: "Supervisor@2024!",
    tecnicoId: "supervisor-tecnico-123",  // Supervisor tem tecnicoId
    tecnico: {
      id: "supervisor-tecnico-123",
      name: "Carlos Supervisor",
      senioridade: "Supervisor",
      area: "Produção",
      department: "Gestão de Produção",
      hasUserAccount: true,
    } as Tecnico
  }
}

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
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      const userData = mockUsers[email]
      
      if (!userData || userData.password !== password) {
        throw new Error("Credenciais inválidas")
      }

      const authenticatedUser: AuthUser = {
        id: generateId(),
        email,
        name: userData.name,
        role: userData.role,
        workday: userData.workday,
        tecnicoId: userData.tecnicoId,
        tecnico: userData.tecnico,
      }

      setUser(authenticatedUser)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
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
