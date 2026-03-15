import { z } from "zod"

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
})

/**
 * Schema de validação para cadastro de colaborador
 */
export const colaboradorSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  workday: z
    .string()
    .min(1, "Workday é obrigatório")
    .regex(/^WD[A-Z0-9]+$/, "Formato de Workday inválido (ex: WDC00001)"),
  cargo: z
    .string()
    .min(3, "Cargo deve ter no mínimo 3 caracteres")
    .max(100, "Cargo deve ter no máximo 100 caracteres"),
  senioridade: z.enum([
    "Auxiliar",
    "Junior",
    "Pleno",
    "Sênior",
    "Especialista",
    "Coordenador",
    "Supervisor",
  ], {
    errorMap: () => ({ message: "Selecione uma senioridade válida" }),
  }),
  area: z.enum([
    "Produção",
    "Manutenção",
    "Qualidade",
    "Engenharia",
    "Logística",
    "Administrativa",
    "Outro",
  ], {
    errorMap: () => ({ message: "Selecione uma área válida" }),
  }),
  shift: z.enum(["1T", "2T", "3T"], {
    errorMap: () => ({ message: "Selecione um turno válido" }),
  }),
  department: z
    .string()
    .min(2, "Departamento deve ter no mínimo 2 caracteres")
    .max(50, "Departamento deve ter no máximo 50 caracteres"),
  gender: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Selecione um gênero válido" }),
  }),
  teamId: z.string().optional(),
  subtimeId: z.string().optional(),
})

/**
 * Schema de validação para máquina
 */
export const machineSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  teamId: z.string().min(1, "Selecione um time"),
})

/**
 * Schema de validação para habilidade
 */
export const skillSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  teamId: z.string().min(1, "Selecione um time"),
  subtimeId: z.string().min(1, "Selecione um sub-time"),
})

/**
 * Schema de validação para sub-time
 */
export const subTeamSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  coordenadorId: z.string().optional(),
})

/**
 * Schema de validação para avaliação
 */
export const evaluationSchema = z.object({
  operatorId: z.string().min(1, "Selecione um colaborador"),
  skills: z.record(z.number().min(0).max(100)),
  notes: z.string().max(1000, "Notas devem ter no máximo 1000 caracteres").optional(),
  quarter: z.number().min(1).max(4),
  year: z.number().min(2020).max(2100),
})

// Tipos TypeScript inferidos dos schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type ColaboradorFormData = z.infer<typeof colaboradorSchema>
export type MachineFormData = z.infer<typeof machineSchema>
export type SkillFormData = z.infer<typeof skillSchema>
export type SubTeamFormData = z.infer<typeof subTeamSchema>
export type EvaluationFormData = z.infer<typeof evaluationSchema>
