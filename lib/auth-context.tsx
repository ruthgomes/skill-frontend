"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockUsers: Record<string, { name: string; role: UserRole; workday?: string }> = {
        "master@example.com": { name: "Maria Silva", role: "master" },
        "tecnico@example.com": { name: "João Santos", role: "tecnico", workday: "OP001" },
      }

      if (mockUsers[email] && password === "password") {
        const userData = mockUsers[email]
        setUser({
          id: Math.random().toString(36).slice(2),
          email,
          name: userData.name,
          role: userData.role,
          workday: userData.workday,
        })
      } else {
        throw new Error("Credenciais inválidas")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
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
