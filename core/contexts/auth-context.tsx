"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { generateId } from "@/core/utils"

export type UserRole = "master" | "tecnico"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  workday?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Chave para armazenamento local
const AUTH_STORAGE_KEY = "skillfix_auth_user"

// Usuários mockados para demonstração
// TODO: Remover quando integrar com backend real
const mockUsers: Record<string, { name: string; role: UserRole; workday?: string; password: string }> = {
  "master@example.com": { 
    name: "Maria Silva", 
    role: "master",
    password: "Demo@2024!" // Senha temporária para demo
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
