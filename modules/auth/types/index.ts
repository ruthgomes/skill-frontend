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

// Re-export tipos do auth-context
export type { AuthUser, UserRole } from '@/core/contexts/auth-context'
