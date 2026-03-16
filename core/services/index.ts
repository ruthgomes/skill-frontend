/**
 * Services - Barrel Export
 * Exporta todos os serviços da aplicação
 */

export { default as authService } from './auth.service'
export { default as usersService } from './users.service'
export { default as tecnicosService } from './tecnicos.service'
export { default as teamsService } from './teams.service'
export { default as subtimesService} from './subtimes.service'
export { default as machinesService } from './machines.service'
export { default as skillsService } from './skills.service'
export { default as evaluationsService } from './evaluations.service'
export { default as quarterlyNotesService } from './quarterly-notes.service'
export { default as analyticsService } from './analytics.service'

// Re-export do api client para uso direto se necessário
export { default as apiClient } from './api-client'
export * from './api-client'
