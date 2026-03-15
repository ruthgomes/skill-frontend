/**
 * Core Contexts - Barrel Export
 * Exporta todos os contextos centrais da aplicação
 */

export { AuthProvider, useAuth, type AuthUser, type UserRole } from './auth-context'
export { 
  NotificationProvider, 
  useNotification,
  type Toast 
} from './notification-context'
