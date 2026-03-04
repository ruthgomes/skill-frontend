export type Shift = "1" | "2" | "3"
export type UserRole = "master" | "tecnico"

export type Senioridade = "Auxiliar" | "Junior" | "Pleno" | "Sênior" | "Especialista" | "Coordenador" | "Supervisor"

export interface Machine {
  id: string
  name: string
  code: string
  subtimeId: string // Máquina pertence a um subtime específico
  description?: string
}

export interface Skill {
  id: string
  name: string
  category: string // Categoria/Nome da máquina
  machineId: string // Habilidade vinculada a uma máquina específica
  subtimeId: string // Habilidade específica de um subtime
  description?: string
}

export interface EvaluationCriteria {
  id: string
  name: string
  description: string
  weight: number
  maxScore: number
}

export interface TeamFunction {
  id: string
  name: string
  description: string
  responsibilities: string[]
}

export interface SubTeam {
  id: string
  name: string
  description: string
  parentTeamId: string // Time principal ao qual pertence
  coordenadorId: string // Coordenador responsável pelo subtime
  functions: TeamFunction[]
  evaluationCriteria: EvaluationCriteria[]
  members: string[] // Array de IDs de técnicos
  leaderId?: string // ID do líder do sub-time (se diferente do coordenador)
  createdAt: string
  updatedAt: string
  status: "ativo" | "inativo"
}

export interface Team {
  id: string
  name: string
  description: string
  department: string // Ex: "Engenharia", "Manutenção"
  supervisorId: string // ID do supervisor responsável pelo time
  managerId?: string // ID do gerente do time (opcional)
  createdAt: string
  updatedAt: string
  status: "ativo" | "inativo"
  color?: string // Cor para identificação visual
}

export interface QuarterlyNote {
  quarter: number
  year: number
  score: number
  evaluatedDate: string
  notes: string
}

export interface Tecnico {
  id: string
  name: string
  workday: string
  cargo: string // Cargo do técnico
  senioridade: Senioridade // Nível de senioridade
  area: string // Área de atuação
  shift: Shift
  subtimeId?: string // ID do subtime ao qual o técnico pertence
  skills: Record<string, number> // Skills por máquina (skillId: pontuação)
  quarterlyNotes: QuarterlyNote[]
  status: "ativo" | "inativo"
  joinDate: string
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
}

export const MACHINES: Machine[] = [
  { id: "1", name: "LASER", code: "LASER", subtimeId: "subteam1", description: "Máquina de marcação a laser" },
  { id: "2", name: "PRINTER", code: "PRINTER", subtimeId: "subteam1", description: "Impressora de pasta de solda" },
  { id: "3", name: "SPI", code: "SPI", subtimeId: "subteam1", description: "Inspeção de pasta de solda" },
  { id: "4", name: "NXT", code: "NXT", subtimeId: "subteam1", description: "Máquina de pick and place" },
  { id: "5", name: "AOI", code: "AOI", subtimeId: "subteam1", description: "Inspeção óptica automática" },
  { id: "6", name: "FORNO", code: "FORNO", subtimeId: "subteam1", description: "Forno de refluxo" },
  { id: "7", name: "ROUTER", code: "ROUTER", subtimeId: "subteam1", description: "Roteador de placas" },
  { id: "8", name: "ANDA", code: "ANDA", subtimeId: "subteam1", description: "Dispensadora de adesivo" },
  { id: "9", name: "PERIFÉRICOS", code: "PERIFERICOS", subtimeId: "subteam1", description: "Equipamentos periféricos" },
]

export const SKILLS: Skill[] = [
  // LASER
  { id: "laser-1", name: "Manutenção Preventiva", category: "LASER", machineId: "machine1", subtimeId: "subteam1" },
  { id: "laser-2", name: "Modo CONVEYOR (BYPASS)", category: "LASER", machineId: "machine1", subtimeId: "subteam1" },
  { id: "laser-3", name: "Ajustar sensores das portas", category: "LASER", machineId: "machine1", subtimeId: "subteam1" },
  { id: "laser-4", name: "Fazer o programa", category: "LASER", machineId: "machine1", subtimeId: "subteam1" },
  { id: "laser-5", name: "Ajuste da posição de marcação", category: "LASER", machineId: "machine1", subtimeId: "subteam1" },
  
  // PRINTER
  { id: "printer-1", name: "Raciocínio lógico", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-2", name: "Manutenção preventiva", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-3", name: "Vision Offset", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-4", name: "Go/No Go", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-5", name: "Calibração Rising table", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-6", name: "Atuadores X/Y", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-7", name: "CPK", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-8", name: "Calibração de squeegee", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-9", name: "Fazer o programa", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-10", name: "Offset", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  { id: "printer-11", name: "Fiduciais", category: "PRINTER", machineId: "machine2", subtimeId: "subteam1" },
  
  // SPI
  { id: "spi-1", name: "Manutenção Preventiva", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-2", name: "Bare board training", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-3", name: "Fazer programa", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-4", name: "Carregar imagem backup", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-5", name: "Ajuste de fiducial", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-6", name: "Ajuste de parâmetros", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-7", name: "Conhecimento IPC 610", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  { id: "spi-8", name: "Modo seletor TOP/BOT", category: "SPI", machineId: "machine3", subtimeId: "subteam1" },
  
  // NXT
  { id: "nxt-1", name: "Raciocínio lógico", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-2", name: "Manutenção Preventiva", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-3", name: "Manutenção HEAD", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-4", name: "Manutenção feeder", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-5", name: "Calibração feeder", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-6", name: "Bomba de vácuo", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-7", name: "Troca de baterias (head, CPU, eixos)", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-8", name: "MT Reset", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-9", name: "Emergency install", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-10", name: "Version UP", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-11", name: "Calibração HEAD", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-12", name: "Fazer programa", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-13", name: "Ajuste de shape", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-14", name: "Package data", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-15", name: "Nozzles", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  { id: "nxt-16", name: "Direção", category: "NXT", machineId: "machine4", subtimeId: "subteam1" },
  
  // AOI
  { id: "aoi-1", name: "Raciocínio lógico", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-2", name: "Manutenção Preventiva", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-3", name: "Calibração", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-4", name: "Debug programa", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-5", name: "Debug fiducial", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-6", name: "Fazer programa", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-7", name: "Backup", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-8", name: "Ajuste fiducial", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-9", name: "Algoritmos de detecção", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-10", name: "IPC 610", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-11", name: "Modo seletor TOP/BOT", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-12", name: "SLA", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  { id: "aoi-13", name: "Good image", category: "AOI", machineId: "machine5", subtimeId: "subteam1" },
  
  // FORNO
  { id: "forno-1", name: "Raciocínio lógico", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  { id: "forno-2", name: "Manutenção Preventiva", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  { id: "forno-3", name: "Fazer programa", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  { id: "forno-4", name: "Troca resistência", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  { id: "forno-5", name: "Troca blower", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  { id: "forno-6", name: "Troca relé estado sólido", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  { id: "forno-7", name: "Troca correntes", category: "FORNO", machineId: "machine6", subtimeId: "subteam1" },
  
  // ROUTER
  { id: "router-1", name: "Raciocínio lógico", category: "ROUTER", machineId: "machine7", subtimeId: "subteam1" },
  { id: "router-2", name: "Manutenção Preventiva", category: "ROUTER", machineId: "machine7", subtimeId: "subteam1" },
  { id: "router-3", name: "Fazer programa", category: "ROUTER", machineId: "machine7", subtimeId: "subteam1" },
  { id: "router-4", name: "Troca fresa", category: "ROUTER", machineId: "machine7", subtimeId: "subteam1" },
  { id: "router-5", name: "Calibração CCD", category: "ROUTER", machineId: "machine7", subtimeId: "subteam1" },
  { id: "router-6", name: "Carregar imagem CPU", category: "ROUTER", machineId: "machine7", subtimeId: "subteam1" },
  
  // ANDA
  { id: "anda-1", name: "Raciocínio lógico", category: "ANDA", machineId: "machine8", subtimeId: "subteam1" },
  { id: "anda-2", name: "Manutenção Preventiva", category: "ANDA", machineId: "machine8", subtimeId: "subteam1" },
  { id: "anda-3", name: "Fazer programa", category: "ANDA", machineId: "machine8", subtimeId: "subteam1" },
  { id: "anda-4", name: "Manutenção HEAD", category: "ANDA", machineId: "machine8", subtimeId: "subteam1" },
  { id: "anda-5", name: "Calibração peso da gota", category: "ANDA", machineId: "machine8", subtimeId: "subteam1" },
  
  // PERIFÉRICOS
  { id: "perifericos-1", name: "Manutenção preventiva", category: "PERIFÉRICOS", machineId: "machine9", subtimeId: "subteam1" },
  { id: "perifericos-2", name: "Instalação sensor seletor", category: "PERIFÉRICOS", machineId: "machine9", subtimeId: "subteam1" },
  { id: "perifericos-3", name: "Sistema de segurança", category: "PERIFÉRICOS", machineId: "machine9", subtimeId: "subteam1" },
  { id: "perifericos-4", name: "Alteração programa CLP", category: "PERIFÉRICOS", machineId: "machine9", subtimeId: "subteam1" },
]

export const mockTecnicos: Tecnico[] = [
  {
    id: "op1",
    name: "João Santos",
    workday: "WDC00001",
    cargo: "Técnico de Manutenção",
    senioridade: "Pleno",
    area: "Produção",
    shift: "1",
    subtimeId: "subteam1", // Linha SMT 1
    skills: {
      "laser-1": 92,
      "laser-2": 85,
      "printer-1": 88,
      "printer-2": 95,
      "spi-1": 90,
      "nxt-1": 88,
    },
    quarterlyNotes: [
      {
        quarter: 4,
        year: 2024,
        score: 89,
        evaluatedDate: "2024-12-01",
        notes: "Excelente desempenho",
      },
      {
        quarter: 3,
        year: 2024,
        score: 87,
        evaluatedDate: "2024-09-01",
        notes: "Bom desempenho",
      },
    ],
    status: "ativo",
    joinDate: "2023-01-15",
  },
  {
    id: "op2",
    name: "Maria Silva",
    workday: "WDC00002",
    cargo: "Técnica Especialista",
    senioridade: "Especialista",
    area: "Qualidade",
    shift: "2",
    subtimeId: "subteam1", // Linha SMT 1
    skills: {
      "aoi-1": 88,
      "aoi-2": 92,
      "spi-1": 91,
      "spi-2": 87,
      "printer-1": 85,
      "printer-2": 90,
    },
    quarterlyNotes: [
      {
        quarter: 4,
        year: 2024,
        score: 88,
        evaluatedDate: "2024-12-01",
        notes: "Desempenho constante",
      },
    ],
    status: "ativo",
    joinDate: "2023-03-20",
  },
  {
    id: "op3",
    name: "Pedro Oliveira",
    workday: "WDC00003",
    cargo: "Técnico Júnior",
    senioridade: "Junior",
    area: "Montagem",
    shift: "3",
    subtimeId: "subteam1", // Linha SMT 1
    skills: {
      "nxt-1": 80,
      "nxt-2": 78,
      "forno-1": 82,
      "forno-2": 83,
      "router-1": 75,
      "router-2": 80,
    },
    quarterlyNotes: [
      {
        quarter: 4,
        year: 2024,
        score: 80,
        evaluatedDate: "2024-12-01",
        notes: "Necessita melhorias",
      },
    ],
    status: "ativo",
    joinDate: "2023-06-10",
  },
  {
    id: "op4",
    name: "Ana Costa",
    workday: "WDC00004",
    cargo: "Técnica Sênior",
    senioridade: "Sênior",
    area: "Engenharia",
    shift: "1",
    subtimeId: "subteam1", // Linha SMT 1
    skills: {
      "laser-1": 94,
      "printer-1": 89,
      "aoi-1": 90,
      "nxt-1": 96,
      "perifericos-1": 93,
      "perifericos-2": 92,
    },
    quarterlyNotes: [
      {
        quarter: 4,
        year: 2024,
        score: 92,
        evaluatedDate: "2024-12-01",
        notes: "Melhor do turno",
      },
    ],
    status: "ativo",
    joinDate: "2022-11-01",
  },
  {
    id: "op5",
    name: "Ricardo Ferreira",
    workday: "WDC00005",
    cargo: "Técnico Auxiliar",
    senioridade: "Auxiliar",
    area: "Produção",
    shift: "2",
    subtimeId: "subteam2", // Gestão de Estoque
    skills: {
      "laser-1": 65,
      "printer-1": 60,
    },
    quarterlyNotes: [
      {
        quarter: 4,
        year: 2024,
        score: 63,
        evaluatedDate: "2024-12-01",
        notes: "Em treinamento",
      },
    ],
    status: "ativo",
    joinDate: "2024-10-01",
  },
  {
    id: "op6",
    name: "Juliana Alves",
    workday: "WDC00006",
    cargo: "Coordenadora de Processos",
    senioridade: "Coordenador",
    area: "Processos",
    shift: "1",
    subtimeId: "subteam1", // Coordenadora da Linha SMT 1
    skills: {
      "aoi-1": 95,
      "spi-1": 94,
      "printer-1": 96,
      "nxt-1": 93,
    },
    quarterlyNotes: [
      {
        quarter: 4,
        year: 2024,
        score: 95,
        evaluatedDate: "2024-12-01",
        notes: "Excelente liderança",
      },
    ],
    status: "ativo",
    joinDate: "2021-05-10",
  },
  // Supervisores (Masters cadastrados no sistema)
  {
    id: "sup1",
    name: "Carlos Oliveira",
    workday: "WDC00101",
    cargo: "Supervisor",
    senioridade: "Supervisor",
    area: "Gestão",
    shift: "1",
    skills: {},
    quarterlyNotes: [],
    status: "ativo",
    joinDate: "2020-01-15",
  },
]

export const mockOperators = mockTecnicos

export const mockUsers: User[] = [
  {
    id: "user1",
    email: "master@example.com",
    password: "password",
    name: "Maria Silva",
    role: "master",
  },
  {
    id: "user2",
    email: "supervisor@example.com",
    password: "password",
    name: "Carlos Oliveira",
    role: "master",
  },
  {
    id: "user3",
    email: "admin@example.com",
    password: "password",
    name: "Ana Costa",
    role: "master",
  },
]

export const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Manutenção SMT",
    description: "Time responsável pela manutenção preventiva e corretiva de equipamentos SMT",
    department: "Engenharia",
    supervisorId: "sup1", // Carlos Oliveira
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ativo",
    color: "#3b82f6",
  },
  {
    id: "team2",
    name: "Spare & Parts",
    description: "Time responsável pela gestão de peças e componentes",
    department: "Logística",
    supervisorId: "sup1", // Carlos Oliveira
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ativo",
    color: "#10b981",
  },
  {
    id: "team3",
    name: "Desenvolvimento",
    description: "Time de desenvolvimento de software",
    department: "TI",
    supervisorId: "user2", // Ana Costa (supervisor2)
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ativo",
    color: "#f59e0b",
  },
]

export const mockSubTeams: SubTeam[] = [
  {
    id: "subteam1",
    name: "Linha SMT 1",
    description: "Sub-time responsável pela linha de montagem SMT 1",
    parentTeamId: "team1",
    coordenadorId: "op6", // Juliana Alves
    functions: [
      {
        id: "func1",
        name: "Gestão de Estoque",
        description: "Controlar inventário de peças",
        responsibilities: [
          "Monitorar níveis de estoque",
          "Realizar pedidos de reposição",
          "Organizar almoxarifado",
        ],
      },
      {
        id: "func2",
        name: "Análise de Falhas",
        description: "Identificar causas de falhas em peças",
        responsibilities: [
          "Inspecionar peças defeituosas",
          "Documentar falhas",
          "Sugerir melhorias",
        ],
      },
    ],
    evaluationCriteria: [
      {
        id: "eval1",
        name: "Disponibilidade de Peças",
        description: "Percentual de peças disponíveis quando necessário",
        weight: 30,
        maxScore: 100,
      },
      {
        id: "eval2",
        name: "Tempo de Resposta",
        description: "Tempo médio para fornecimento de peças",
        weight: 25,
        maxScore: 100,
      },
      {
        id: "eval3",
        name: "Organização",
        description: "Nível de organização do almoxarifado",
        weight: 20,
        maxScore: 100,
      },
      {
        id: "eval4",
        name: "Qualidade das Peças",
        description: "Taxa de peças sem defeitos",
        weight: 25,
        maxScore: 100,
      },
    ],
    members: ["op1", "op2"],
    leaderId: "op1",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    status: "ativo",
  },
  {
    id: "subteam2",
    name: "Parts Maintenance",
    description: "Sub-time responsável pela manutenção e reparo de componentes",
    parentTeamId: "team1",
    coordenadorId: "coord2",
    functions: [
      {
        id: "func3",
        name: "Manutenção Preventiva",
        description: "Realizar manutenções programadas",
        responsibilities: [
          "Seguir cronograma de manutenção",
          "Substituir componentes desgastados",
          "Registrar intervenções",
        ],
      },
      {
        id: "func4",
        name: "Reparo de Componentes",
        description: "Consertar peças danificadas",
        responsibilities: [
          "Diagnosticar problemas",
          "Executar reparos",
          "Testar funcionamento",
        ],
      },
    ],
    evaluationCriteria: [
      {
        id: "eval5",
        name: "Taxa de Sucesso em Reparos",
        description: "Percentual de reparos bem-sucedidos",
        weight: 35,
        maxScore: 100,
      },
      {
        id: "eval6",
        name: "Tempo Médio de Reparo",
        description: "Tempo médio para concluir reparos",
        weight: 25,
        maxScore: 100,
      },
      {
        id: "eval7",
        name: "Cumprimento de Prazos",
        description: "Aderência aos prazos estabelecidos",
        weight: 20,
        maxScore: 100,
      },
      {
        id: "eval8",
        name: "Qualidade Técnica",
        description: "Nível técnico dos reparos executados",
        weight: 20,
        maxScore: 100,
      },
    ],
    members: ["op3", "op4"],
    leaderId: "op4",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    status: "ativo",
  },
  {
    id: "subteam3",
    name: "Electrical Maintenance",
    description: "Sub-time responsável pela manutenção elétrica",
    parentTeamId: "team1",
    coordenadorId: "coord3",
    functions: [
      {
        id: "func5",
        name: "Instalações Elétricas",
        description: "Realizar instalações e adequações elétricas",
        responsibilities: [
          "Instalar novos equipamentos",
          "Adequar instalações",
          "Garantir conformidade com normas",
        ],
      },
    ],
    evaluationCriteria: [
      {
        id: "eval9",
        name: "Segurança",
        description: "Aderência às normas de segurança",
        weight: 40,
        maxScore: 100,
      },
      {
        id: "eval10",
        name: "Eficiência Energética",
        description: "Otimização do consumo de energia",
        weight: 30,
        maxScore: 100,
      },
      {
        id: "eval11",
        name: "Disponibilidade de Sistemas",
        description: "Tempo de uptime dos sistemas elétricos",
        weight: 30,
        maxScore: 100,
      },
    ],
    members: [],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    status: "ativo",
  },
]
