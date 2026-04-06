/**
 * Core Contexts - Barrel Export
 * Exporta todos os contextos centrais da aplicação
 */

export { AuthProvider, useAuth, type AuthUser } from './auth-context'
export { UserRole } from '@/core/types/api.types'
export { 
  NotificationProvider, 
  useNotification,
  type Toast 
} from './notification-context'
