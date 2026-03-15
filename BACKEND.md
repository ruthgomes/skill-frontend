# Especificação Técnica - Back-End SkillFix

## 📋 Sumário Executivo

Este documento define a especificação técnica completa para o desenvolvimento do back-end do **SkillFix** (Sistema de Gestão de Competências e Desempenho) utilizando **NestJS**, **Prisma**, **PostgreSQL**, **Docker** e **Swagger** para documentação da API.

### Objetivo
Criar uma API REST robusta, escalável e segura para gerenciar colaboradores, avaliações trimestrais de desempenho, times hierárquicos (times e sub-times), máquinas, habilidades e análises de performance em ambiente industrial/telecom.

### Última Atualização
**Data**: 10 de março de 2026
**Versão**: 2.0

## 📚 Documentação das APIs

Para facilitar o desenvolvimento, cada módulo do sistema possui sua documentação detalhada:

- **[AUTH_API.md](docs/AUTH_API.md)** - Autenticação, autorização, JWT, controle de acesso por roles (MASTER, TECNICO)
- **[USERS_API.md](docs/USERS_API.md)** - CRUD de usuários, gestão de usuários master, permissões
- **[TECNICOS_API.md](docs/TECNICOS_API.md)** - CRUD de técnicos/colaboradores, upload de fotos, estatísticas, busca e filtros
- **[AVALIACOES_API.md](docs/AVALIACOES_API.md)** - Sistema de avaliações trimestrais, notas por skill, cooldown de 3 meses
- **[TEAMS_API.md](docs/TEAMS_API.md)** - Gestão de times principais, coordenadores, departamentos
- **[SUBTIMES_API.md](docs/SUBTIMES_API.md)** - Gestão de sub-times, funções, critérios de avaliação, membros
- **[MACHINES_API.md](docs/MACHINES_API.md)** - Cadastro de máquinas por time/sub-time
- **[SKILLS_API.md](docs/SKILLS_API.md)** - Habilidades por máquina, sub-time e time, avaliações de competências
- **[ANALYTICS_API.md](docs/ANALYTICS_API.md)** - Dashboards, rankings por senioridade, análises por turno e time

### Stack Tecnológica
- **Runtime**: Node.js 20+ LTS
- **Framework**: NestJS 10+
- **ORM**: Prisma 5+
- **Banco de Dados**: PostgreSQL 16+
- **Documentação**: Swagger/OpenAPI 3.0
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: class-validator + class-transformer
- **Container**: Docker + Docker Compose
- **Cache**: Redis (opcional para otimização)

---

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas Proposta

```
backend/
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   ├── seed.ts                    # Dados iniciais (seed)
│   └── migrations/                # Migrações do banco
│
├── src/
│   ├── main.ts                    # Ponto de entrada da aplicação
│   ├── app.module.ts              # Módulo raiz
│   │
│   ├── auth/                      # Módulo de autenticação
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── users/                     # Módulo de usuários
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── tecnicos/                  # Módulo de técnicos/operadores
│   │   ├── tecnicos.module.ts
│   │   ├── tecnicos.controller.ts
│   │   ├── tecnicos.service.ts
│   │   ├── dto/
│   │   │   ├── create-tecnico.dto.ts
│   │   │   ├── update-tecnico.dto.ts
│   │   │   ├── tecnico-response.dto.ts
│   │   │   └── tecnico-filter.dto.ts
│   │   └── entities/
│   │       └── tecnico.entity.ts
│   │
│   ├── machines/                  # Módulo de máquinas
│   │   ├── machines.module.ts
│   │   ├── machines.controller.ts
│   │   ├── machines.service.ts
│   │   ├── dto/
│   │   │   ├── create-machine.dto.ts
│   │   │   ├── update-machine.dto.ts
│   │   │   └── machine-response.dto.ts
│   │   └── entities/
│   │       └── machine.entity.ts
│   │
│   ├── skills/                    # Módulo de habilidades
│   │   ├── skills.module.ts
│   │   ├── skills.controller.ts
│   │   ├── skills.service.ts
│   │   ├── dto/
│   │   │   ├── create-skill.dto.ts
│   │   │   ├── update-skill.dto.ts
│   │   │   └── skill-response.dto.ts
│   │   └── entities/
│   │       └── skill.entity.ts
│   │
│   ├── teams/                     # Módulo de times
│   │   ├── teams.module.ts
│   │   ├── teams.controller.ts
│   │   ├── teams.service.ts
│   │   ├── dto/
│   │   │   ├── create-team.dto.ts
│   │   │   ├── update-team.dto.ts
│   │   │   └── team-response.dto.ts
│   │   └── entities/
│   │       └── team.entity.ts
│   │
│   ├── sub-teams/                 # Módulo de sub-times
│   │   ├── sub-teams.module.ts
│   │   ├── sub-teams.controller.ts
│   │   ├── sub-teams.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── evaluations/               # Módulo de avaliações
│   │   ├── evaluations.module.ts
│   │   ├── evaluations.controller.ts
│   │   ├── evaluations.service.ts
│   │   ├── dto/
│   │   │   ├── create-evaluation.dto.ts
│   │   │   ├── update-evaluation.dto.ts
│   │   │   ├── evaluation-response.dto.ts
│   │   │   └── quarterly-note.dto.ts
│   │   └── entities/
│   │       └── evaluation.entity.ts
│   │
│   ├── analytics/                 # Módulo de análises/dashboard
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── dto/
│   │       ├── dashboard-stats.dto.ts
│   │       ├── performance-by-shift.dto.ts
│   │       ├── performance-by-machine.dto.ts
│   │       └── ranking.dto.ts
│   │
│   ├── notifications/             # Módulo de notificações
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── dto/
│   │
│   ├── common/                    # Recursos compartilhados
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── interfaces/
│   │       └── pagination.interface.ts
│   │
│   ├── prisma/                    # Módulo Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── config/                    # Configurações
│       ├── database.config.ts
│       ├── jwt.config.ts
│       └── swagger.config.ts
│
├── test/                          # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                   # Exemplo de variáveis de ambiente
├── .env                          # Variáveis de ambiente (não commitar)
├── .dockerignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── docker-compose.yml            # Configuração Docker
├── Dockerfile                    # Imagem Docker da aplicação
├── nest-cli.json                 # Configuração NestJS CLI
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json

```

---

## 🗄️ Modelo de Dados (Prisma Schema)

### Schema Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS
// ==========================================

enum UserRole {
  MASTER      // Acesso completo: cadastros, gerenciamento, dashboards, avaliações
  TECNICO     // Acesso limitado: visualizar histórico e performance pessoal
}

enum Shift {
  PRIMEIRO    // 1T - Primeiro Turno
  SEGUNDO     // 2T - Segundo Turno  
  TERCEIRO    // 3T - Terceiro Turno
}

enum Status {
  ATIVO
  INATIVO
}

enum Senioridade {
  AUXILIAR
  JUNIOR
  PLENO
  SENIOR
  ESPECIALISTA
  COORDENADOR // Lidera sub-times
  SUPERVISOR  // Lidera times principais
}

enum Area {
  PRODUCAO
  MANUTENCAO
  QUALIDADE
  ENGENHARIA
  LOGISTICA
  ADMINISTRATIVA
  OUTRO
}

enum Gender {
  M  // Masculino
  F  // Feminino
}

enum NotificationType {
  EVALUATION_CREATED
  EVALUATION_UPDATED
  PERFORMANCE_ALERT
  TEAM_ASSIGNMENT
  SYSTEM
}

// ==========================================
// USUÁRIOS E AUTENTICAÇÃO
// ==========================================

model User {
  id            String       @id @default(uuid())
  email         String       @unique
  password      String       // Hash bcrypt
  name          String
  role          UserRole     @default(TECNICO)
  status        Status       @default(ATIVO)
  
  // Relacionamentos
  tecnico       Tecnico?     // Se role = TECNICO, possui dados de técnico
  supervisedTeams Team[]     @relation("SupervisorTeams") // Se role = MASTER (supervisor)
  coordinatedSubTeams SubTeam[] @relation("CoordinatorSubTeams") // Se coordenador
  
  // Timestamps
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  lastLoginAt   DateTime?
  
  // Tokens de refresh
  refreshTokens RefreshToken[]
  
  // Notificações
  notifications Notification[]
  
  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@map("refresh_tokens")
}

// ==========================================
// MÁQUINAS
// ==========================================

model Machine {
  id          String   @id @default(uuid())
  name        String   // Ex: LASER, PRINTER, SPI, NXT, AOI, FORNO, ROUTER, ANDA
  code        String   @unique // Código único da máquina
  description String?
  status      Status   @default(ATIVO)
  
  // Relacionamento com time/subtime
  teamId      String?
  team        Team?    @relation(fields: [teamId], references: [id], onDelete: SetNull)
  
  subTeamId   String?
  subTeam     SubTeam? @relation(fields: [subTeamId], references: [id], onDelete: SetNull)
  
  // Relacionamentos
  skills      Skill[]  // Skills específicas dessa máquina
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("machines")
}

// ==========================================
// HABILIDADES
// ==========================================

model Skill {
  id          String   @id @default(uuid())
  name        String   // Ex: "Manutenção Preventiva", "Programação CNC"
  category    String   // Categoria/nome da máquina
  description String?
  
  // Relacionamento com máquina
  machineId   String
  machine     Machine  @relation(fields: [machineId], references: [id], onDelete: Cascade)
  
  // Relacionamento com time/subtime - IMPORTANTE: Skills são específicas por subtime
  teamId      String
  team        Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  subTeamId   String
  subTeam     SubTeam  @relation(fields: [subTeamId], references: [id], onDelete: Cascade)
  
  // Relacionamentos
  tecnicoSkills TecnicoSkill[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([name, machineId, subTeamId]) // Skill única por máquina e subtime
  @@map("skills")
}

// ==========================================
// TÉCNICOS/COLABORADORES
// ==========================================

model Tecnico {
  id          String      @id @default(uuid())
  userId      String      @unique
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Informações básicas
  workday     String      @unique // ID único do colaborador (ex: OP12345)
  cargo       String      // Cargo/função (ex: "Técnico de Manutenção")
  senioridade Senioridade // Nível hierárquico
  area        Area        // Área de atuação
  department  String      // Departamento (ex: "Engenharia")
  shift       Shift       // Turno de trabalho
  gender      Gender      // Gênero
  
  // Foto de perfil
  photo       String?     // URL ou base64 da foto
  
  // Time e Sub-time
  // IMPORTANTE: Supervisores não têm teamId nem subteamId
  teamId      String?
  team        Team?       @relation(fields: [teamId], references: [id], onDelete: SetNull)
  
  subTeamId   String?
  subTeam     SubTeam?    @relation("TecnicoSubTeam", fields: [subTeamId], references: [id], onDelete: SetNull)
  
  // Múltiplos sub-times (um técnico pode pertencer a vários sub-times)
  subTeamMembers SubTeamMember[]
  
  // Habilidades do técnico
  skills      TecnicoSkill[]
  
  // Avaliações trimestrais
  quarterlyNotes QuarterlyNote[]
  
  status      Status      @default(ATIVO)
  joinDate    DateTime    @default(now()) // Data de entrada
  
  // Timestamps
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@map("tecnicos")
}

// ==========================================
// RELAÇÃO TÉCNICO-HABILIDADE
// ==========================================

model TecnicoSkill {
  id         String   @id @default(uuid())
  tecnicoId  String
  tecnico    Tecnico  @relation(fields: [tecnicoId], references: [id], onDelete: Cascade)
  skillId    String
  skill      Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  score      Float    @default(0) // Pontuação de 0 a 100
  
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@unique([tecnicoId, skillId])
  @@map("tecnico_skills")
}

// ==========================================
// TIMES PRINCIPAIS
// ==========================================

model Team {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  department  String   // Ex: "Engenharia", "Manutenção", "Produção", "Logística"
  color       String?  @default("#6B7280") // Código de cor hex para identificação visual
  
  // Supervisor do time (User com role MASTER e senioridade SUPERVISOR)
  supervisorId String?
  supervisor   User?    @relation("SupervisorTeams", fields: [supervisorId], references: [id], onDelete: SetNull)
  
  // Relacionamentos
  tecnicos    Tecnico[]
  subTeams    SubTeam[]
  machines    Machine[]
  skills      Skill[]
  
  status      Status   @default(ATIVO)
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("teams")
}

// ==========================================
// SUB-TIMES
// ==========================================

model SubTeam {
  id            String   @id @default(uuid())
  name          String
  description   String?
  
  // Time pai/principal
  teamId        String
  team          Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  // Coordenador do sub-time (User com senioridade COORDENADOR)
  coordenadorId String?
  coordenador   User?    @relation("CoordinatorSubTeams", fields: [coordenadorId], references: [id], onDelete: SetNull)
  
  // Relacionamentos
  members       SubTeamMember[]
  functions     TeamFunction[]
  evaluationCriteria EvaluationCriteria[]
  machines      Machine[]
  skills        Skill[]
  tecnicos      Tecnico[] @relation("TecnicoSubTeam")
  
  status        Status   @default(ATIVO)
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([name, teamId]) // Nome único dentro do time
  @@map("sub_teams")
}

// ==========================================
// MEMBROS DE SUB-TIME
// ==========================================

model SubTeamMember {
  id        String   @id @default(uuid())
  subTeamId String
  subTeam   SubTeam  @relation(fields: [subTeamId], references: [id], onDelete: Cascade)
  tecnicoId String
  tecnico   Tecnico  @relation(fields: [tecnicoId], references: [id], onDelete: Cascade)
  
  joinedAt  DateTime @default(now())
  
  @@unique([subTeamId, tecnicoId])
  @@map("sub_team_members")
}

// ==========================================
// FUNÇÕES DE TIME
// ==========================================

model TeamFunction {
  id               String   @id @default(uuid())
  name             String
  description      String?
  responsibilities String[] // Array de responsabilidades
  
  subTeamId        String
  subTeam          SubTeam  @relation(fields: [subTeamId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@map("team_functions")
}

// ==========================================
// CRITÉRIOS DE AVALIAÇÃO
// ==========================================

model EvaluationCriteria {
  id          String   @id @default(uuid())
  name        String
  description String?
  weight      Float    @default(1.0) // Peso do critério na avaliação
  maxScore    Float    @default(100) // Pontuação máxima
  
  subTeamId   String
  subTeam     SubTeam  @relation(fields: [subTeamId], references: [id], onDelete: Cascade)
  
  // Relacionamentos
  evaluations EvaluationScore[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("evaluation_criteria")
}

// ==========================================
// AVALIAÇÕES
// ==========================================

model Evaluation {
  id            String   @id @default(uuid())
  tecnicoId     String
  tecnico       Tecnico  @relation(fields: [tecnicoId], references: [id], onDelete: Cascade)
  
  evaluatorId   String   // ID do avaliador (Master/Supervisor)
  evaluationDate DateTime @default(now())
  
  // Período da avaliação
  periodStart   DateTime
  periodEnd     DateTime
  
  // Pontuação geral calculada
  totalScore    Float    @default(0)
  
  // Observações gerais
  observations  String?
  
  // Relacionamentos
  scores        EvaluationScore[]
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("evaluations")
}

// ==========================================
// PONTUAÇÕES POR CRITÉRIO
// ==========================================

model EvaluationScore {
  id          String   @id @default(uuid())
  evaluationId String
  evaluation  Evaluation @relation(fields: [evaluationId], references: [id], onDelete: Cascade)
  
  criteriaId  String
  criteria    EvaluationCriteria @relation(fields: [criteriaId], references: [id], onDelete: Cascade)
  
  score       Float    // Pontuação obtida
  notes       String?  // Observações específicas do critério
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([evaluationId, criteriaId])
  @@map("evaluation_scores")
}

// ==========================================
// NOTAS TRIMESTRAIS
// ==========================================

model QuarterlyNote {
  id            String   @id @default(uuid())
  tecnicoId     String
  tecnico       Tecnico  @relation(fields: [tecnicoId], references: [id], onDelete: Cascade)
  
  quarter       Int      // 1, 2, 3 ou 4
  year          Int
  score         Float
  evaluatedDate DateTime
  notes         String?
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([tecnicoId, quarter, year])
  @@map("quarterly_notes")
}

// ==========================================
// NOTIFICAÇÕES
// ==========================================

model Notification {
  id        String           @id @default(uuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  message   String
  read      Boolean          @default(false)
  
  // Dados adicionais (JSON)
  metadata  Json?
  
  // Timestamps
  createdAt DateTime         @default(now())
  readAt    DateTime?
  
  @@map("notifications")
}

```

---

## 🔌 Endpoints da API

### 1. Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Registrar novo usuário | Não |
| POST | `/auth/login` | Login | Não |
| POST | `/auth/refresh` | Renovar token | Não |
| POST | `/auth/logout` | Logout | Sim |
| GET | `/auth/me` | Obter dados do usuário logado | Sim |

**Exemplo - POST `/auth/login`**
```json
// Request
{
  "email": "master@example.com",
  "password": "password123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "master@example.com",
    "name": "Maria Silva",
    "role": "MASTER"
  }
}
```

### 2. Usuários (`/api/users`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/users` | Listar todos os usuários | Sim | Master |
| GET | `/users/:id` | Obter usuário por ID | Sim | Master |
| POST | `/users` | Criar novo usuário | Sim | Master |
| PATCH | `/users/:id` | Atualizar usuário | Sim | Master |
| DELETE | `/users/:id` | Deletar usuário | Sim | Master |
| PATCH | `/users/:id/status` | Alterar status (ativo/inativo) | Sim | Master |

**Exemplo - POST `/users`**
```json
// Request
{
  "email": "novo.usuario@example.com",
  "password": "senha123",
  "name": "Novo Usuário",
  "role": "TECNICO"
}

// Response
{
  "id": "uuid",
  "email": "novo.usuario@example.com",
  "name": "Novo Usuário",
  "role": "TECNICO",
  "status": "ATIVO",
  "createdAt": "2026-01-07T10:00:00.000Z"
}
```

### 3. Técnicos (`/api/tecnicos`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/tecnicos` | Listar técnicos (com filtros e paginação) | Sim | Master |
| GET | `/tecnicos/:id` | Obter técnico por ID | Sim | Master |
| POST | `/tecnicos` | Criar novo técnico | Sim | Master |
| PATCH | `/tecnicos/:id` | Atualizar técnico | Sim | Master |
| DELETE | `/tecnicos/:id` | Deletar técnico | Sim | Master |
| GET | `/tecnicos/:id/skills` | Obter habilidades do técnico | Sim | Master |
| PATCH | `/tecnicos/:id/skills` | Atualizar habilidades | Sim | Master |
| GET | `/tecnicos/:id/evaluations` | Obter avaliações do técnico | Sim | Master/Próprio Técnico |
| GET | `/tecnicos/:id/quarterly-notes` | Obter notas trimestrais | Sim | Master/Próprio Técnico |

**Exemplo - GET `/tecnicos?search=joao&shift=PRIMEIRO&page=1&limit=10`**
```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "workday": "OP001",
      "cargo": "Operador Júnior",
      "area": "Produção",
      "shift": "PRIMEIRO",
      "machine": {
        "id": "uuid",
        "name": "LASER",
        "code": "LASER"
      },
      "team": {
        "id": "uuid",
        "name": "Time A"
      },
      "user": {
        "id": "uuid",
        "name": "João Santos",
        "email": "joao@example.com"
      },
      "status": "ATIVO",
      "averageScore": 85.5
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 4. Máquinas (`/api/machines`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/machines` | Listar todas as máquinas | Sim | Todos |
| GET | `/machines/:id` | Obter máquina por ID | Sim | Todos |
| POST | `/machines` | Criar nova máquina | Sim | Master |
| PATCH | `/machines/:id` | Atualizar máquina | Sim | Master |
| DELETE | `/machines/:id` | Deletar máquina | Sim | Master |

**Exemplo - POST `/machines`**
```json
// Request
{
  "name": "LASER",
  "code": "LASER",
  "description": "Máquina de corte a laser"
}

// Response
{
  "id": "uuid",
  "name": "LASER",
  "code": "LASER",
  "description": "Máquina de corte a laser",
  "status": "ATIVO",
  "createdAt": "2026-01-07T10:00:00.000Z"
}
```

### 5. Habilidades (`/api/skills`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/skills` | Listar habilidades (com filtro por máquina) | Sim | Todos |
| GET | `/skills/:id` | Obter habilidade por ID | Sim | Todos |
| POST | `/skills` | Criar nova habilidade | Sim | Master |
| PATCH | `/skills/:id` | Atualizar habilidade | Sim | Master |
| DELETE | `/skills/:id` | Deletar habilidade | Sim | Master |

**Exemplo - GET `/skills?machineId=uuid`**
```json
// Response
[
  {
    "id": "uuid",
    "name": "Operação Básica",
    "category": "Técnica",
    "description": "Operação básica da máquina LASER",
    "machineId": "uuid",
    "machine": {
      "name": "LASER",
      "code": "LASER"
    }
  }
]
```

### 6. Times (`/api/teams`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/teams` | Listar times | Sim | Master |
| GET | `/teams/:id` | Obter time por ID | Sim | Master |
| POST | `/teams` | Criar novo time | Sim | Master |
| PATCH | `/teams/:id` | Atualizar time | Sim | Master |
| DELETE | `/teams/:id` | Deletar time | Sim | Master |
| GET | `/teams/:id/members` | Listar membros do time | Sim | Master |
| POST | `/teams/:id/members` | Adicionar membro ao time | Sim | Master |

### 7. Sub-Times (`/api/sub-teams`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/sub-teams` | Listar sub-times (filtrar por teamId) | Sim | Master |
| GET | `/sub-teams/:id` | Obter sub-time por ID | Sim | Master |
| POST | `/sub-teams` | Criar novo sub-time | Sim | Master |
| PATCH | `/sub-teams/:id` | Atualizar sub-time | Sim | Master |
| DELETE | `/sub-teams/:id` | Deletar sub-time | Sim | Master |
| GET | `/sub-teams/:id/members` | Listar membros | Sim | Master |
| POST | `/sub-teams/:id/members` | Adicionar membro | Sim | Master |
| DELETE | `/sub-teams/:id/members/:tecnicoId` | Remover membro | Sim | Master |

### 8. Avaliações (`/api/evaluations`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/evaluations` | Listar avaliações (com filtros) | Sim | Master |
| GET | `/evaluations/:id` | Obter avaliação por ID | Sim | Master/Próprio Técnico |
| POST | `/evaluations` | Criar nova avaliação | Sim | Master |
| PATCH | `/evaluations/:id` | Atualizar avaliação | Sim | Master |
| DELETE | `/evaluations/:id` | Deletar avaliação | Sim | Master |
| GET | `/evaluations/tecnico/:tecnicoId` | Avaliações de um técnico | Sim | Master/Próprio Técnico |

**Exemplo - POST `/evaluations`**
```json
// Request
{
  "tecnicoId": "uuid",
  "periodStart": "2026-01-01",
  "periodEnd": "2026-03-31",
  "observations": "Desempenho excelente no trimestre",
  "scores": [
    {
      "criteriaId": "uuid",
      "score": 85,
      "notes": "Bom desempenho"
    },
    {
      "criteriaId": "uuid",
      "score": 90,
      "notes": "Excelente"
    }
  ]
}

// Response
{
  "id": "uuid",
  "tecnicoId": "uuid",
  "evaluatorId": "uuid",
  "evaluationDate": "2026-01-07T10:00:00.000Z",
  "periodStart": "2026-01-01T00:00:00.000Z",
  "periodEnd": "2026-03-31T23:59:59.000Z",
  "totalScore": 87.5,
  "observations": "Desempenho excelente no trimestre",
  "scores": [...]
}
```

### 9. Notas Trimestrais (`/api/quarterly-notes`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/quarterly-notes` | Listar notas trimestrais | Sim | Master |
| GET | `/quarterly-notes/:id` | Obter nota por ID | Sim | Master/Próprio Técnico |
| POST | `/quarterly-notes` | Criar nova nota trimestral | Sim | Master |
| PATCH | `/quarterly-notes/:id` | Atualizar nota | Sim | Master |
| DELETE | `/quarterly-notes/:id` | Deletar nota | Sim | Master |
| GET | `/quarterly-notes/tecnico/:tecnicoId` | Notas de um técnico | Sim | Master/Próprio Técnico |

### 10. Analytics/Dashboard (`/api/analytics`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/analytics/dashboard` | Estatísticas gerais do dashboard | Sim | Master |
| GET | `/analytics/performance-by-shift` | Desempenho por turno | Sim | Master |
| GET | `/analytics/performance-by-machine` | Desempenho por máquina | Sim | Master |
| GET | `/analytics/ranking` | Ranking de operadores | Sim | Master |
| GET | `/analytics/evolution` | Evolução de desempenho mensal | Sim | Master |
| GET | `/analytics/tecnico/:id/performance` | Performance individual | Sim | Master/Próprio Técnico |

**Exemplo - GET `/analytics/dashboard`**
```json
// Response
{
  "totalOperators": 50,
  "activeOperators": 45,
  "averageScore": 78.5,
  "totalMachines": 9,
  "performanceByMonth": [
    { "month": "Jan", "score": 75 },
    { "month": "Fev", "score": 78 },
    { "month": "Mar", "score": 80 }
  ],
  "topPerformers": [
    {
      "tecnicoId": "uuid",
      "name": "João Santos",
      "score": 92.5
    }
  ]
}
```

### 11. Notificações (`/api/notifications`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/notifications` | Listar notificações do usuário | Sim | Todos |
| GET | `/notifications/:id` | Obter notificação por ID | Sim | Todos |
| PATCH | `/notifications/:id/read` | Marcar como lida | Sim | Todos |
| PATCH | `/notifications/read-all` | Marcar todas como lidas | Sim | Todos |
| DELETE | `/notifications/:id` | Deletar notificação | Sim | Todos |

---

## 🔐 Autenticação e Autorização

### JWT (JSON Web Tokens)

#### Estrutura do Token
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "MASTER",
  "iat": 1704628800,
  "exp": 1704715200
}
```

#### Configuração
- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- **Algorithm**: HS256
- **Secret**: Armazenado em variável de ambiente

#### Guards e Decorators

**JwtAuthGuard**
```typescript
// Protege rotas que requerem autenticação
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

**RolesGuard**
```typescript
// Protege rotas por role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MASTER')
@Get('admin')
getAdminData() {
  return 'Admin only';
}
```

---

## 🐳 Docker Setup

### docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: sisop-postgres
    restart: always
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: sisop
      POSTGRES_PASSWORD: sisop123
      POSTGRES_DB: sisop_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sisop-network

  # Redis Cache (opcional)
  redis:
    image: redis:7-alpine
    container_name: sisop-redis
    restart: always
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - sisop-network

  # NestJS Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: sisop-api
    restart: always
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://sisop:sisop123@postgres:5432/sisop_db?schema=public
      JWT_SECRET: your-super-secret-jwt-key-change-in-production
      JWT_EXPIRATION: 15m
      JWT_REFRESH_EXPIRATION: 7d
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - postgres
      - redis
    networks:
      - sisop-network
    volumes:
      - ./uploads:/app/uploads

volumes:
  postgres_data:
  redis_data:

networks:
  sisop-network:
    driver: bridge
```

### Dockerfile

```dockerfile
# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3001

# Start application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

---

## ⚙️ Variáveis de Ambiente

### .env.example

```env
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://sisop:sisop123@localhost:5432/sisop_db?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRATION=7d

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS
CORS_ORIGIN=http://localhost:3000

# Swagger
SWAGGER_TITLE=SisOp API
SWAGGER_DESCRIPTION=Sistema de Desempenho de Operadores - API Documentation
SWAGGER_VERSION=1.0

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DESTINATION=./uploads

# Email (para notificações - opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@sisop.com
```

---

## 📝 Configuração do Swagger

### swagger.config.ts

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SisOp API')
    .setDescription('Sistema de Desempenho de Operadores - API Documentation')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação')
    .addTag('users', 'Usuários')
    .addTag('tecnicos', 'Técnicos/Operadores')
    .addTag('machines', 'Máquinas')
    .addTag('skills', 'Habilidades')
    .addTag('teams', 'Times')
    .addTag('sub-teams', 'Sub-Times')
    .addTag('evaluations', 'Avaliações')
    .addTag('quarterly-notes', 'Notas Trimestrais')
    .addTag('analytics', 'Analytics/Dashboard')
    .addTag('notifications', 'Notificações')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
```

### Acesso ao Swagger
Após iniciar a aplicação, acesse: `http://localhost:3001/api/docs`

---

## 🧪 Testes

### Estrutura de Testes

```typescript
// users.service.spec.ts (Unit Test)
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const userId = 'uuid';
      const mockUser = { id: userId, email: 'test@example.com' };
      
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      
      const result = await service.findOne(userId);
      expect(result).toEqual(mockUser);
    });
  });
});
```

### Comandos de Teste

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

---

## 📦 Seed Data (Dados Iniciais)

### prisma/seed.ts

```typescript
import { PrismaClient, UserRole, Shift, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar dados existentes
  await prisma.notification.deleteMany();
  await prisma.evaluationScore.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.quarterlyNote.deleteMany();
  await prisma.tecnicoSkill.deleteMany();
  await prisma.subTeamMember.deleteMany();
  await prisma.teamFunction.deleteMany();
  await prisma.evaluationCriteria.deleteMany();
  await prisma.subTeam.deleteMany();
  await prisma.tecnico.deleteMany();
  await prisma.team.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Hash de senha padrão
  const hashedPassword = await bcrypt.hash('password', 10);

  // 1. Criar usuários
  const masterUser = await prisma.user.create({
    data: {
      email: 'master@example.com',
      password: hashedPassword,
      name: 'Maria Silva',
      role: UserRole.MASTER,
    },
  });

  const tecnicoUser = await prisma.user.create({
    data: {
      email: 'tecnico@example.com',
      password: hashedPassword,
      name: 'João Santos',
      role: UserRole.TECNICO,
    },
  });

  console.log('✅ Usuários criados');

  // 2. Criar máquinas
  const machines = await Promise.all([
    prisma.machine.create({ data: { name: 'LASER', code: 'LASER' } }),
    prisma.machine.create({ data: { name: 'PRINTER', code: 'PRINTER' } }),
    prisma.machine.create({ data: { name: 'SPI', code: 'SPI' } }),
    prisma.machine.create({ data: { name: 'NXT', code: 'NXT' } }),
    prisma.machine.create({ data: { name: 'AOI', code: 'AOI' } }),
    prisma.machine.create({ data: { name: 'FORNO', code: 'FORNO' } }),
    prisma.machine.create({ data: { name: 'ROUTER', code: 'ROUTER' } }),
    prisma.machine.create({ data: { name: 'ANDA', code: 'ANDA' } }),
    prisma.machine.create({ data: { name: 'PERIFÉRICOS', code: 'PERIFERICOS' } }),
  ]);

  console.log('✅ Máquinas criadas');

  // 3. Criar habilidades para cada máquina
  const skillCategories = ['Técnica', 'Conhecimento', 'Atitude', 'Produtividade'];
  const skills = [];

  for (const machine of machines) {
    for (const category of skillCategories) {
      const skill = await prisma.skill.create({
        data: {
          name: `${category} - ${machine.name}`,
          category,
          machineId: machine.id,
        },
      });
      skills.push(skill);
    }
  }

  console.log('✅ Habilidades criadas');

  // 4. Criar time
  const team = await prisma.team.create({
    data: {
      name: 'Time Alpha',
      description: 'Time de produção principal',
      department: 'Produção',
      color: '#0A3D62',
    },
  });

  console.log('✅ Time criado');

  // 5. Criar técnico
  const tecnico = await prisma.tecnico.create({
    data: {
      userId: tecnicoUser.id,
      workday: 'OP001',
      cargo: 'Operador Júnior',
      area: 'Produção',
      shift: Shift.PRIMEIRO,
      machineId: machines[0].id,
      teamId: team.id,
    },
  });

  console.log('✅ Técnico criado');

  // 6. Atribuir habilidades ao técnico
  const laserSkills = skills.filter((s) => s.machineId === machines[0].id);
  for (const skill of laserSkills) {
    await prisma.tecnicoSkill.create({
      data: {
        tecnicoId: tecnico.id,
        skillId: skill.id,
        score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
      },
    });
  }

  console.log('✅ Habilidades atribuídas ao técnico');

  // 7. Criar notas trimestrais
  for (let quarter = 1; quarter <= 4; quarter++) {
    await prisma.quarterlyNote.create({
      data: {
        tecnicoId: tecnico.id,
        quarter,
        year: 2025,
        score: Math.floor(Math.random() * 20) + 75, // Score entre 75-95
        evaluatedDate: new Date(`2025-${quarter * 3}-15`),
        notes: `Avaliação do Q${quarter}/2025`,
      },
    });
  }

  console.log('✅ Notas trimestrais criadas');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Executar Seed

```bash
# Executar seed
npx prisma db seed

# Adicione ao package.json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 🚀 Comandos de Inicialização

### Setup Completo do Projeto

```bash
# 1. Criar projeto NestJS
npx @nestjs/cli new sisop-backend
cd sisop-backend

# 2. Instalar dependências
pnpm add @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/swagger
pnpm add @prisma/client passport passport-jwt bcrypt class-validator class-transformer
pnpm add -D prisma @types/passport-jwt @types/bcrypt ts-node

# 3. Inicializar Prisma
npx prisma init

# 4. Configurar schema.prisma (copiar schema deste documento)

# 5. Criar migration inicial
npx prisma migrate dev --name init

# 6. Gerar Prisma Client
npx prisma generate

# 7. Executar seed
npx prisma db seed

# 8. Iniciar aplicação
pnpm start:dev
```

### Docker

```bash
# Build e iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Executar migrations
docker-compose exec app npx prisma migrate deploy

# Executar seed
docker-compose exec app npx prisma db seed

# Parar containers
docker-compose down

# Parar e remover volumes (limpa dados)
docker-compose down -v
```

---

## 📊 Paginação e Filtros

### Padrão de Paginação

```typescript
// Query Parameters
interface PaginationQuery {
  page?: number;      // default: 1
  limit?: number;     // default: 10
  sortBy?: string;    // ex: 'name', 'createdAt'
  sortOrder?: 'asc' | 'desc'; // default: 'asc'
  search?: string;    // busca geral
}

// Response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### Exemplo de Implementação

```typescript
// tecnicos.service.ts
async findAll(query: TecnicoFilterDto): Promise<PaginatedResponse<Tecnico>> {
  const { page = 1, limit = 10, search, shift, status } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TecnicoWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { workday: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      shift ? { shift } : {},
      status ? { status } : {},
    ],
  };

  const [data, total] = await Promise.all([
    this.prisma.tecnico.findMany({
      where,
      skip,
      take: limit,
      include: { user: true, machine: true, team: true },
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.tecnico.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
```

---

## 🔔 Sistema de Notificações

### Tipos de Notificações

1. **EVALUATION_CREATED**: Nova avaliação registrada
2. **EVALUATION_UPDATED**: Avaliação atualizada
3. **PERFORMANCE_ALERT**: Alerta de baixo desempenho
4. **TEAM_ASSIGNMENT**: Atribuição a novo time
5. **SYSTEM**: Notificação do sistema

### Service de Notificações

```typescript
// notifications.service.ts
async create(data: CreateNotificationDto): Promise<Notification> {
  const notification = await this.prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata,
    },
  });

  // TODO: Implementar WebSocket para notificações em tempo real
  // this.socketGateway.sendNotification(data.userId, notification);

  return notification;
}
```

---

## 🎯 Próximos Passos

### Fase 1: Configuração Básica (Semana 1)
- [ ] Criar projeto NestJS
- [ ] Configurar Prisma e PostgreSQL
- [ ] Definir schema completo
- [ ] Configurar Docker e Docker Compose
- [ ] Implementar autenticação JWT
- [ ] Configurar Swagger

### Fase 2: CRUD Básico (Semana 2)
- [ ] Módulo de Usuários
- [ ] Módulo de Técnicos
- [ ] Módulo de Máquinas
- [ ] Módulo de Habilidades
- [ ] Validação de dados
- [ ] Tratamento de erros

### Fase 3: Funcionalidades Avançadas (Semana 3)
- [ ] Módulo de Times e Sub-Times
- [ ] Sistema de Avaliações
- [ ] Notas Trimestrais
- [ ] Analytics e Dashboard
- [ ] Filtros e paginação

### Fase 4: Otimização e Extras (Semana 4)
- [ ] Sistema de Notificações
- [ ] Cache com Redis
- [ ] Upload de arquivos
- [ ] WebSockets para tempo real
- [ ] Testes unitários e E2E
- [ ] Documentação completa

### Fase 5: Deploy (Semana 5)
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em ambiente de produção
- [ ] Monitoramento e logs
- [ ] Backup automático
- [ ] Otimização de performance

---

## 📚 Referências e Recursos

### Documentação Oficial
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger/OpenAPI](https://swagger.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Melhores Práticas
- [NestJS Best Practices](https://github.com/nestjs/nest/blob/master/sample)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [API Design Best Practices](https://restfulapi.net/)
- [Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

### Bibliotecas Úteis
- **Validação**: class-validator, class-transformer
- **Segurança**: helmet, express-rate-limit
- **Logs**: winston, morgan
- **Testes**: jest, supertest
- **Email**: nodemailer
- **PDF**: pdfkit, puppeteer
- **Excel**: exceljs

---

## 📝 Notas Finais

Este documento serve como guia completo para o desenvolvimento do back-end do SisOp. Ele deve ser atualizado conforme o projeto evolui.

### Considerações de Segurança
- Sempre use HTTPS em produção
- Implemente rate limiting
- Use variáveis de ambiente para informações sensíveis
- Faça hash de senhas com bcrypt (salt rounds >= 10)
- Valide e sanitize todos os inputs
- Implemente CORS adequadamente
- Mantenha dependências atualizadas

### Performance
- Use índices no banco de dados
- Implemente cache com Redis
- Use paginação em listagens
- Otimize queries com Prisma
- Monitore tempo de resposta

### Escalabilidade
- Use Docker para containerização
- Implemente load balancing
- Considere microserviços para funcionalidades críticas
- Use filas para processos pesados
- Implemente logging centralizado

---

**Versão**: 1.0.0  
**Data**: 07/01/2026  
**Autor**: Equipe SisOp  
**Status**: Especificação Completa - Pronto para Desenvolvimento
