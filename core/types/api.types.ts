/**
 * API Types - Tipos para integração com backend
 * Baseado na documentação em docs/integration/
 */

// ============================================
// AUTENTICAÇÃO
// ============================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ============================================
// USUÁRIOS
// ============================================

export enum UserRole {
  MASTER = 'master',
  SUPERVISOR = 'supervisor',
}

export enum Workday {
  DIURNO = 'diurno',
  NOTURNO = 'noturno',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  workday?: Workday | null
  isActive: boolean
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
  // Senha temporária retornada apenas na criação (se não fornecida)
  temporaryPassword?: string
  // Sistema Multi-Supervisor: vincula User a Tecnico (se for supervisor)
  tecnicoId?: string | null
  tecnico?: Tecnico | null
}

export interface CreateUserRequest {
  email: string
  password?: string  // Opcional: se não fornecida, backend gera automaticamente
  name: string
  role?: UserRole
  workday?: Workday
}

export interface UpdateUserRequest {
  email?: string
  name?: string
  role?: UserRole
  workday?: Workday
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordRequest {
  userId: string  // ID do usuário que terá a senha resetada
}

export interface ResetPasswordResponse {
  message: string
  temporaryPassword: string  // Nova senha temporária gerada
}

// ============================================
// TÉCNICOS
// ============================================

export interface Tecnico {
  id: string
  name: string
  employeeNumber: string
  position: string
  teamId: string
  subtimeId: string
  email?: string | null
  phone?: string | null
  photoUrl?: string | null
  photo?: string | null // Caminho da foto no backend (ex: "uploads/photos/uuid.jpg")
  admissionDate: string
  birthDate?: string | null
  notes?: string | null
  status: boolean
  // Campos do backend
  workday?: string // Jornada de trabalho
  cargo?: string // Cargo específico
  senioridade?: 'Auxiliar' | 'Junior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenador' | 'Supervisor'
  area?: string // Área de atuação
  shift?: string // Turno
  department?: string // Departamento
  gender?: 'M' | 'F' | 'O' // Gênero
  joinDate?: string // Data de admissão (alternativa a admissionDate)
  createdAt: string
  updatedAt: string
  team?: Team
  subtime?: SubTeam
  tecnicoSkills?: TecnicoSkill[]
  // Sistema Multi-Supervisor: indica se técnico tem conta de usuário
  hasUserAccount?: boolean
  user?: User
}

export interface CreateTecnicoRequest {
  name: string
  teamId?: string
  subtimeId?: string
  email?: string
  phone?: string
  joinDate: string // Data de admissão (formato ISO 8601)
  birthDate?: string
  notes?: string
  // Campos do backend
  workday: string // Matrícula do colaborador (ex: "WDC00001", "MAT12345")
  cargo?: string
  senioridade?: 'Auxiliar' | 'Junior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenador' | 'Supervisor'
  area?: string
  shift?: '1T' | '2T' | '3T' | 'ADM'
  department?: string
  gender?: 'M' | 'F' | 'O'
  // Sistema Multi-Supervisor: credenciais obrigatórias se senioridade = Supervisor
  password?: string
}

export interface UpdateTecnicoRequest {
  name?: string
  position?: string
  teamId?: string
  subtimeId?: string
  email?: string
  phone?: string
  birthDate?: string
  notes?: string
}

export interface TecnicoSkill {
  id: string
  tecnicoId: string
  skillId: string
  score: number
  notes?: string | null
  createdAt: string
  updatedAt: string
  skill?: Skill
}

// ============================================
// TEAMS (TIMES)
// ============================================

export interface Team {
  id: string
  name: string
  description?: string | null
  department?: string | null
  supervisorId?: string | null
  managerId?: string | null
  status: boolean
  color?: string | null
  createdAt: string
  updatedAt: string
  supervisor?: User
  manager?: User
  subtimes?: SubTeam[]
  tecnicos?: Tecnico[]
}

export interface CreateTeamRequest {
  name: string
  description?: string
  department?: string
  supervisorId?: string
  managerId?: string
  color?: string
}

export interface UpdateTeamRequest {
  name?: string
  description?: string
  department?: string
  supervisorId?: string
  managerId?: string
  color?: string
  status?: boolean
}

// ============================================
// SUBTIMES (SUB-TIMES)
// ============================================

export interface TeamFunction {
  id: string
  name: string
  description: string
  responsibilities: string
}

export interface EvaluationCriteria {
  id: string
  name: string
  description: string
  weight: number
  maxScore: number
}

export interface SubTeam {
  id: string
  name: string
  description?: string | null
  parentTeamId: string
  coordenadorId?: string | null
  functions: TeamFunction[]
  evaluationCriteria: EvaluationCriteria[]
  status: boolean
  createdAt: string
  updatedAt: string
  parentTeam?: Team
  coordenador?: Tecnico
  tecnicos?: Tecnico[]
}

export interface CreateSubTeamRequest {
  name: string
  description?: string
  parentTeamId: string
  coordenadorId?: string
  functions: TeamFunction[]
  evaluationCriteria: EvaluationCriteria[]
}

export interface UpdateSubTeamRequest {
  name?: string
  description?: string
  coordenadorId?: string
  functions?: TeamFunction[]
  evaluationCriteria?: EvaluationCriteria[]
  status?: boolean
}

// ============================================
// MÁQUINAS
// ============================================

export interface Machine {
  id: string
  name: string
  code: string
  description?: string | null
  teamId?: string | null
  manufacturer?: string | null
  model?: string | null
  installationDate?: string | null
  status: boolean
  createdAt: string
  updatedAt: string
  team?: Team
  skills?: Skill[]
}

export interface CreateMachineRequest {
  name: string
  code: string
  description?: string
  teamId?: string
  manufacturer?: string
  model?: string
  installationDate?: string
}

export interface UpdateMachineRequest {
  name?: string
  code?: string
  description?: string
  teamId?: string
  manufacturer?: string
  model?: string
  installationDate?: string
  status?: boolean
}

// ============================================
// SKILLS (COMPETÊNCIAS)
// ============================================

export enum SkillLevel {
  BASICO = 'Básico',
  INTERMEDIARIO = 'Intermediário',
  AVANCADO = 'Avançado',
  ESPECIALISTA = 'Especialista',
}

export interface Skill {
  id: string
  name: string
  category: string
  description?: string | null
  machineId?: string | null
  teamId?: string | null
  subtimeId?: string | null
  level: SkillLevel
  requirements?: Record<string, any> | null
  status: boolean
  createdAt: string
  updatedAt: string
  machine?: Machine
  team?: Team
  subtime?: SubTeam
}

export interface CreateSkillRequest {
  name: string
  category: string
  description?: string
  machineId?: string
  teamId?: string
  subtimeId?: string
  level: SkillLevel
  requirements?: Record<string, any>
}

export interface UpdateSkillRequest {
  name?: string
  category?: string
  description?: string
  machineId?: string
  teamId?: string
  subtimeId?: string
  level?: SkillLevel
  requirements?: Record<string, any>
  status?: boolean
}

// ============================================
// AVALIAÇÕES
// ============================================

export enum EvaluationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum EvaluationType {
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  PROBATIONARY = 'probationary',
  PERFORMANCE = 'performance',
}

export interface EvaluationCriterion {
  id: string
  evaluationId: string
  name: string
  description?: string | null
  weight: number
  score: number
  maxScore: number
  comments?: string | null
}

export interface Evaluation {
  id: string
  type: EvaluationType
  quarter: number
  year: number
  evaluationDate: string // ISO 8601 date string
  tecnicoId: string
  evaluatorId: string
  approverId?: string | null
  status: EvaluationStatus
  totalScore: number
  generalComments?: string | null
  strengths?: string | null
  improvements?: string | null
  goals?: string | null
  submittedAt?: string | null
  approvedAt?: string | null
  createdAt: string
  updatedAt: string
  tecnico?: Tecnico
  evaluator?: User
  approver?: User
  criteria?: EvaluationCriterion[]
}

export interface CriterionInput {
  name: string
  description?: string
  weight: number
  score: number
  maxScore: number
  comments?: string
}

export interface CreateEvaluationRequest {
  type: EvaluationType
  quarter: number
  year: number
  evaluationDate: string // ISO 8601 date string
  tecnicoId: string
  evaluatorId: string
  criteria: CriterionInput[]
  generalComments?: string
  strengths?: string
  improvements?: string
  goals?: string
}

export interface UpdateEvaluationRequest {
  type?: EvaluationType
  quarter?: number
  year?: number
  criteria?: CriterionInput[]
  generalComments?: string
  strengths?: string
  improvements?: string
  goals?: string
}

export interface SubmitEvaluationRequest {
  finalComments: string
}

export interface ApproveEvaluationRequest {
  approved: boolean
  comments?: string
}

// ============================================
// QUARTERLY NOTES (NOTAS TRIMESTRAIS)
// ============================================

export interface QuarterlyNote {
  id: string
  quarter: number
  year: number
  score: number
  evaluatedDate: string
  notes: string
  tecnicoId: string
  evaluatorId?: string | null
  breakdown?: Record<string, number> | null
  createdAt: string
  updatedAt: string
  tecnico?: Tecnico
  evaluator?: User
}

export interface CreateQuarterlyNoteRequest {
  quarter: number
  year: number
  score: number
  evaluatedDate: string
  notes: string
  tecnicoId: string
  evaluatorId?: string
  breakdown?: Record<string, number>
}

export interface UpdateQuarterlyNoteRequest {
  quarter?: number
  year?: number
  score?: number
  evaluatedDate?: string
  notes?: string
  breakdown?: Record<string, number>
}

// ============================================
// ANALYTICS
// ============================================

export interface DashboardMetrics {
  totalTecnicos: number
  averageScore: string
  averageSkillLevel: string
  period: string
}

export interface PerformanceTrend {
  quarter: string
  score: number
  tecnicoName: string
  evaluatedDate: string
}

export interface SkillsMatrix {
  [tecnicoName: string]: {
    [skillName: string]: number
  }
}

export interface TopPerformer {
  rank: number
  name: string
  score: number
  area: string
  team: string
}

export interface SkillsCoverage {
  [skillName: string]: {
    totalTecnicos: number
    avgScore: number
  }
}

export interface TeamComparison {
  teamName: string
  totalTecnicos: number
  averageScore: string
  averageSkillLevel: string
}

export interface QuarterlyReport {
  quarter: number
  year: number
  totalEvaluations: number
  averageScore: string
  byArea: {
    [area: string]: {
      count: number
      avgScore: number
    }
  }
  topPerformers: {
    name: string
    score: number
    area: string
  }[]
}

export interface SkillGap {
  tecnicoName: string
  skillName: string
  currentScore: number
  gap: number
  priority: 'Alta' | 'Média'
}

export interface SkillGapsResponse {
  totalGaps: number
  gaps: SkillGap[]
}

// ============================================
// DASHBOARDS ANALÍTICOS
// ============================================

export interface ShiftSkillComparison {
  skillId: string
  skillName: string
  skillCategory: string
  shifts: {
    '1T': number
    '2T': number
    '3T': number
    'ADM': number
  }
  overallAverage: number
  totalTecnicos: number
}

export interface ShiftMachineComparison {
  machineId: string
  machineCode: string
  machineName: string
  shifts: {
    '1T': number
    '2T': number
    '3T': number
    'ADM': number
  }
  overallAverage: number
  totalSkills: number
  totalTecnicos: number
  bestShift: '1T' | '2T' | '3T' | 'ADM'
}

// ============================================
// PAGINAÇÃO
// ============================================

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ============================================
// QUERY PARAMS
// ============================================

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams {
  search?: string
}

export interface TecnicoQueryParams extends PaginationParams, SearchParams {
  teamId?: string
  subtimeId?: string
  status?: boolean
}

export interface UserQueryParams extends PaginationParams, SearchParams {
  role?: UserRole
  isActive?: boolean
}

export interface TeamQueryParams extends SearchParams {
  status?: boolean
}

export interface MachineQueryParams extends SearchParams {
  teamId?: string
}

export interface SkillQueryParams extends SearchParams {
  machineId?: string
  teamId?: string
  subtimeId?: string
  level?: SkillLevel
}

export interface EvaluationQueryParams {
  tecnicoId?: string
  evaluatorId?: string
  status?: EvaluationStatus
  type?: EvaluationType
  quarter?: number
  year?: number
}

export interface QuarterlyNoteQueryParams {
  tecnicoId?: string
  quarter?: number
  year?: number
  evaluatorId?: string
}

// ============================================
// ERROS DA API
// ============================================

export interface ApiError {
  message: string | string[]
  error?: string
  statusCode: number
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export type ApiResponse<T> = T
export type ApiErrorResponse = ApiError
