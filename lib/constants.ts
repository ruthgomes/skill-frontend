/**
 * Constantes da aplicação SkillFix
 * Centralize valores fixos aqui para facilitar manutenção
 */

// Cores do tema
export const THEME_COLORS = {
  primary: '#0096d6',
  primaryDark: '#005486',
  primaryHover: '#004070',
  sidebar: '#262626',
  sidebarAccent: '#005486',
} as const

// Configurações de sessão
export const SESSION_CONFIG = {
  storageKey: 'skillfix_auth_user',
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 horas em ms
} as const

// Configurações de notificações
export const NOTIFICATION_CONFIG = {
  defaultDuration: 5000, // 5 segundos
  successDuration: 4000,
  errorDuration: 6000,
  warningDuration: 5000,
} as const

// Configurações de paginação
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const

// Limites de upload
export const UPLOAD_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedImageExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
} as const

// Formatos de data
export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  displayWithTime: 'dd/MM/yyyy HH:mm',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const

// Validação de senha (para quando integrar com backend)
export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
} as const

// Trimestres do ano
export const QUARTERS = [
  { value: 1, label: '1º Trimestre (Jan-Mar)' },
  { value: 2, label: '2º Trimestre (Abr-Jun)' },
  { value: 3, label: '3º Trimestre (Jul-Set)' },
  { value: 4, label: '4º Trimestre (Out-Dez)' },
] as const

// Intervalos de avaliação (em meses)
export const EVALUATION_INTERVAL = 3 // meses

// Regex patterns úteis
export const REGEX_PATTERNS = {
  workday: /^WD[A-Z0-9]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
} as const

// Status possíveis
export const STATUS = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
} as const

// Mensagens de erro comuns
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',
  SERVER_ERROR: 'Erro no servidor. Tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso não autorizado',
  NOT_FOUND: 'Recurso não encontrado',
} as const
