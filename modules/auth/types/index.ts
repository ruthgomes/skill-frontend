/**
 * Auth Module - Types
 */

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Re-export tipos do auth-context e core types
export type { AuthUser } from '@/core/contexts/auth-context'
export type { UserRole } from '@/core/types/api.types'
