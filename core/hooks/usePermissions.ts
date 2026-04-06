/**
 * Hook para controle de permissões baseado em role do usuário
 * Baseado em COORDENADOR_FRONTEND_INTEGRATION.md
 */

import { useAuth } from '@/core/contexts'
import { UserRole } from '@/core/types'

export interface Permissions {
  // Técnicos
  canCreateTecnico: boolean
  canEditTecnico: boolean
  canDeleteTecnico: boolean
  canDesativarTecnico: boolean
  canUploadPhoto: boolean
  
  // Times e Sub-times
  canManageTeams: boolean
  canManageSubtimes: boolean
  
  // Avaliações
  canCreateEvaluation: boolean
  canEditEvaluation: boolean
  canApproveEvaluation: boolean
  canDeleteEvaluation: boolean
  
  // Notas Trimestrais
  canCreateQuarterlyNote: boolean
  canEditQuarterlyNote: boolean
  canDeleteQuarterlyNote: boolean
  
  // Skills
  canCreateSkill: boolean
  canUpdateSkillScore: boolean
  canAddSkillToTecnico: boolean
  canRemoveSkillFromTecnico: boolean
  
  // Analytics
  canViewGeneralDashboard: boolean
  canViewTeamDashboard: boolean
  canViewSubtimeDashboard: boolean
  canExportReports: boolean
  
  // Role checks
  isAdmin: boolean
  isSupervisor: boolean
  isCoordenador: boolean
}

/**
 * Hook que retorna as permissões do usuário atual baseado na sua role
 * 
 * @example
 * ```tsx
 * const { canCreateTecnico, isAdmin } = usePermissions();
 * 
 * return (
 *   <>
 *     {canCreateTecnico && (
 *       <Button onClick={handleCreate}>Criar Técnico</Button>
 *     )}
 *   </>
 * );
 * ```
 */
export function usePermissions(): Permissions {
  const { user } = useAuth()
  
  const isAdmin = user?.role === UserRole.MASTER
  const isSupervisor = user?.role === UserRole.SUPERVISOR
  const isCoordenador = user?.role === UserRole.COORDENADOR
  
  return {
    // Técnicos
    canCreateTecnico: isAdmin || isSupervisor,
    canEditTecnico: isAdmin || isSupervisor || isCoordenador,
    canDeleteTecnico: isAdmin || isSupervisor,
    canDesativarTecnico: isAdmin || isSupervisor || isCoordenador,
    canUploadPhoto: isAdmin || isSupervisor || isCoordenador,
    
    // Times e Sub-times
    canManageTeams: isAdmin || isSupervisor,
    canManageSubtimes: isAdmin || isSupervisor,
    
    // Avaliações
    canCreateEvaluation: isAdmin || isSupervisor || isCoordenador,
    canEditEvaluation: isAdmin || isSupervisor || isCoordenador,
    canApproveEvaluation: isAdmin || isSupervisor,
    canDeleteEvaluation: isAdmin || isSupervisor,
    
    // Notas Trimestrais
    canCreateQuarterlyNote: isAdmin || isSupervisor || isCoordenador,
    canEditQuarterlyNote: isAdmin || isSupervisor || isCoordenador,
    canDeleteQuarterlyNote: isAdmin || isSupervisor,
    
    // Skills
    canCreateSkill: isAdmin,
    canUpdateSkillScore: isAdmin || isSupervisor || isCoordenador,
    canAddSkillToTecnico: isAdmin || isSupervisor,
    canRemoveSkillFromTecnico: isAdmin || isSupervisor,
    
    // Analytics
    canViewGeneralDashboard: isAdmin,
    canViewTeamDashboard: isAdmin || isSupervisor,
    canViewSubtimeDashboard: isAdmin || isSupervisor || isCoordenador,
    canExportReports: isAdmin || isSupervisor || isCoordenador,
    
    // Role checks
    isAdmin,
    isSupervisor,
    isCoordenador,
  }
}
