export type Shift = "1" | "2" | "3"
export type UserRole = "master" | "tecnico"

export interface Machine {
  id: string
  name: string
  code: string
}

export interface Skill {
  id: string
  name: string
  category: string
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
  parentTeamId: string
  functions: TeamFunction[]
  evaluationCriteria: EvaluationCriteria[]
  members: string[] // Array de IDs de técnicos
  leaderId?: string // ID do líder do sub-time
  createdAt: string
  updatedAt: string
  status: "ativo" | "inativo"
}

export interface Team {
  id: string
  name: string
  description: string
  department: string // Ex: "Engenharia", "Manutenção"
  managerId?: string // ID do gerente do time
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
  area: string // Área de atuação
  shift: Shift
  teamId?: string // ID do time que o técnico faz parte
  skills: Record<string, number> // Skills por máquina
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
  { id: "1", name: "LASER", code: "LASER" },
  { id: "2", name: "PRINTER", code: "PRINTER" },
  { id: "3", name: "SPI", code: "SPI" },
  { id: "4", name: "NXT", code: "NXT" },
  { id: "5", name: "AOI", code: "AOI" },
  { id: "6", name: "FORNO", code: "FORNO" },
  { id: "7", name: "ROUTER", code: "ROUTER" },
  { id: "8", name: "ANDA", code: "ANDA" },
  { id: "9", name: "PERIFÉRICOS", code: "PERIFERICOS" },
]

export const SKILLS: Skill[] = [
  // LASER
  { id: "laser-1", name: "Manutenção Preventiva", category: "LASER" },
  { id: "laser-2", name: "Modo CONVEYOR (BYPASS)", category: "LASER" },
  { id: "laser-3", name: "Ajustar sensores das portas", category: "LASER" },
  { id: "laser-4", name: "Fazer o programa", category: "LASER" },
  { id: "laser-5", name: "Ajuste da posição de marcação", category: "LASER" },
  
  // PRINTER
  { id: "printer-1", name: "Raciocínio lógico", category: "PRINTER" },
  { id: "printer-2", name: "Manutenção preventiva", category: "PRINTER" },
  { id: "printer-3", name: "Vision Offset", category: "PRINTER" },
  { id: "printer-4", name: "Go/No Go", category: "PRINTER" },
  { id: "printer-5", name: "Calibração Rising table", category: "PRINTER" },
  { id: "printer-6", name: "Atuadores X/Y", category: "PRINTER" },
  { id: "printer-7", name: "CPK", category: "PRINTER" },
  { id: "printer-8", name: "Calibração de squeegee", category: "PRINTER" },
  { id: "printer-9", name: "Fazer o programa", category: "PRINTER" },
  { id: "printer-10", name: "Offset", category: "PRINTER" },
  { id: "printer-11", name: "Fiduciais", category: "PRINTER" },
  
  // SPI
  { id: "spi-1", name: "Manutenção Preventiva", category: "SPI" },
  { id: "spi-2", name: "Bare board training", category: "SPI" },
  { id: "spi-3", name: "Fazer programa", category: "SPI" },
  { id: "spi-4", name: "Carregar imagem backup", category: "SPI" },
  { id: "spi-5", name: "Ajuste de fiducial", category: "SPI" },
  { id: "spi-6", name: "Ajuste de parâmetros", category: "SPI" },
  { id: "spi-7", name: "Conhecimento IPC 610", category: "SPI" },
  { id: "spi-8", name: "Modo seletor TOP/BOT", category: "SPI" },
  
  // NXT
  { id: "nxt-1", name: "Raciocínio lógico", category: "NXT" },
  { id: "nxt-2", name: "Manutenção Preventiva", category: "NXT" },
  { id: "nxt-3", name: "Manutenção HEAD", category: "NXT" },
  { id: "nxt-4", name: "Manutenção feeder", category: "NXT" },
  { id: "nxt-5", name: "Calibração feeder", category: "NXT" },
  { id: "nxt-6", name: "Bomba de vácuo", category: "NXT" },
  { id: "nxt-7", name: "Troca de baterias (head, CPU, eixos)", category: "NXT" },
  { id: "nxt-8", name: "MT Reset", category: "NXT" },
  { id: "nxt-9", name: "Emergency install", category: "NXT" },
  { id: "nxt-10", name: "Version UP", category: "NXT" },
  { id: "nxt-11", name: "Calibração HEAD", category: "NXT" },
  { id: "nxt-12", name: "Fazer programa", category: "NXT" },
  { id: "nxt-13", name: "Ajuste de shape", category: "NXT" },
  { id: "nxt-14", name: "Package data", category: "NXT" },
  { id: "nxt-15", name: "Nozzles", category: "NXT" },
  { id: "nxt-16", name: "Direção", category: "NXT" },
  
  // AOI
  { id: "aoi-1", name: "Raciocínio lógico", category: "AOI" },
  { id: "aoi-2", name: "Manutenção Preventiva", category: "AOI" },
  { id: "aoi-3", name: "Calibração", category: "AOI" },
  { id: "aoi-4", name: "Debug programa", category: "AOI" },
  { id: "aoi-5", name: "Debug fiducial", category: "AOI" },
  { id: "aoi-6", name: "Fazer programa", category: "AOI" },
  { id: "aoi-7", name: "Backup", category: "AOI" },
  { id: "aoi-8", name: "Ajuste fiducial", category: "AOI" },
  { id: "aoi-9", name: "Algoritmos de detecção", category: "AOI" },
  { id: "aoi-10", name: "IPC 610", category: "AOI" },
  { id: "aoi-11", name: "Modo seletor TOP/BOT", category: "AOI" },
  { id: "aoi-12", name: "SLA", category: "AOI" },
  { id: "aoi-13", name: "Good image", category: "AOI" },
  
  // FORNO
  { id: "forno-1", name: "Raciocínio lógico", category: "FORNO" },
  { id: "forno-2", name: "Manutenção Preventiva", category: "FORNO" },
  { id: "forno-3", name: "Fazer programa", category: "FORNO" },
  { id: "forno-4", name: "Troca resistência", category: "FORNO" },
  { id: "forno-5", name: "Troca blower", category: "FORNO" },
  { id: "forno-6", name: "Troca relé estado sólido", category: "FORNO" },
  { id: "forno-7", name: "Troca correntes", category: "FORNO" },
  
  // ROUTER
  { id: "router-1", name: "Raciocínio lógico", category: "ROUTER" },
  { id: "router-2", name: "Manutenção Preventiva", category: "ROUTER" },
  { id: "router-3", name: "Fazer programa", category: "ROUTER" },
  { id: "router-4", name: "Troca fresa", category: "ROUTER" },
  { id: "router-5", name: "Calibração CCD", category: "ROUTER" },
  { id: "router-6", name: "Carregar imagem CPU", category: "ROUTER" },
  
  // ANDA
  { id: "anda-1", name: "Raciocínio lógico", category: "ANDA" },
  { id: "anda-2", name: "Manutenção Preventiva", category: "ANDA" },
  { id: "anda-3", name: "Fazer programa", category: "ANDA" },
  { id: "anda-4", name: "Manutenção HEAD", category: "ANDA" },
  { id: "anda-5", name: "Calibração peso da gota", category: "ANDA" },
  
  // PERIFÉRICOS
  { id: "perifericos-1", name: "Manutenção preventiva", category: "PERIFÉRICOS" },
  { id: "perifericos-2", name: "Instalação sensor seletor", category: "PERIFÉRICOS" },
  { id: "perifericos-3", name: "Sistema de segurança", category: "PERIFÉRICOS" },
  { id: "perifericos-4", name: "Alteração programa CLP", category: "PERIFÉRICOS" },
]

export const mockTecnicos: Tecnico[] = [
  {
    id: "op1",
    name: "João Santos",
    workday: "WDC00001",
    cargo: "Técnico de Manutenção",
    area: "Produção",
    shift: "1",
    teamId: "team1",
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
    area: "Qualidade",
    shift: "2",
    teamId: "team1",
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
    area: "Montagem",
    shift: "3",
    teamId: "team2",
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
    area: "Engenharia",
    shift: "1",
    teamId: "team3",
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
    email: "tecnico@example.com",
    password: "password",
    name: "João Santos",
    role: "tecnico",
  },
]

export const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Manutenção",
    description: "Time responsável pela manutenção preventiva e corretiva de equipamentos",
    department: "Engenharia",
    managerId: "user1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ativo",
    color: "#3b82f6",
  },
  {
    id: "team2",
    name: "Produção",
    description: "Time responsável pela linha de produção e fabricação",
    department: "Engenharia",
    managerId: "user1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ativo",
    color: "#10b981",
  },
  {
    id: "team3",
    name: "Qualidade",
    description: "Time responsável pelo controle de qualidade e inspeções",
    department: "Engenharia",
    managerId: "user1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ativo",
    color: "#f59e0b",
  },
]

export const mockSubTeams: SubTeam[] = [
  {
    id: "subteam1",
    name: "Spare Parts",
    description: "Sub-time responsável pela gestão e manutenção de peças de reposição",
    parentTeamId: "team1",
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
