# API de Times e Sub-Times - SisOp

## Visão Geral

A API de Times gerencia a organização dos técnicos em times e sub-times, permitindo estruturação hierárquica, gestão de membros e análise de performance por equipe.

## Estrutura do Time

- `id` (UUID) - Identificador único
- `name` (string) - Nome do time
- `description` (text) - Descrição do time
- `department` (string) - Departamento (ex: Produção, Manutenção)
- `color` (string) - Código de cor para identificação visual (hex)
- `managerId` (UUID) - ID do gerente do time (opcional)
- `status` (enum) - Status (ATIVO, INATIVO)
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização

## Estrutura do Sub-Time

- `id` (UUID) - Identificador único
- `teamId` (UUID) - Time principal (chave estrangeira)
- `name` (string) - Nome do sub-time
- `description` (text) - Descrição do sub-time
- `leaderId` (UUID) - ID do líder do sub-time
- `status` (enum) - Status (ATIVO, INATIVO)
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização

## Endpoints da API

### Base URL
```
/api/teams
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📝 Criar Time

**POST** `/api/teams`

Cria um novo time no sistema.

### Request Body:
```json
{
  "name": "Time Alpha",
  "description": "Time especializado em operações de CNC",
  "department": "Produção",
  "color": "#3B82F6",
  "managerId": "manager-uuid",
  "status": "ATIVO"
}
```

### Campos Obrigatórios:
- `name`: Nome do time (2-100 caracteres, deve ser único)
- `department`: Departamento (2-100 caracteres)

### Campos Opcionais:
- `description`: Descrição detalhada (máximo 1000 caracteres)
- `color`: Código de cor hex (ex: #3B82F6) (padrão: #6B7280)
- `managerId`: ID do gerente (deve ser usuário com role SUPERVISOR ou MASTER)
- `status`: Status do time (padrão: ATIVO)

### Response (201 Created):
```json
{
  "id": "team-uuid-123",
  "name": "Time Alpha",
  "description": "Time especializado em operações de CNC",
  "department": "Produção",
  "color": "#3B82F6",
  "managerId": "manager-uuid",
  "status": "ATIVO",
  "createdAt": "2024-12-15T10:00:00.000Z",
  "updatedAt": "2024-12-15T10:00:00.000Z",
  "manager": {
    "id": "manager-uuid",
    "name": "Carlos Manager",
    "email": "carlos@empresa.com",
    "role": "SUPERVISOR"
  },
  "memberCount": 0,
  "subTeamCount": 0
}
```

---

## 📋 Listar Times

**GET** `/api/teams`

Lista todos os times com paginação e filtros.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Busca por nome ou departamento
- `department` (opcional): Filtrar por departamento
- `status` (opcional): Filtrar por status (ATIVO, INATIVO)
- `managerId` (opcional): Filtrar por gerente
- `sort` (opcional): Campo para ordenação (padrão: name)
- `order` (opcional): Direção (ASC, DESC) (padrão: ASC)

### Exemplos:
```
GET /api/teams?page=1&limit=20
GET /api/teams?search=Alpha
GET /api/teams?department=Produção&status=ATIVO
GET /api/teams?managerId=manager-uuid
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "team-uuid-123",
      "name": "Time Alpha",
      "description": "Time especializado em operações de CNC",
      "department": "Produção",
      "color": "#3B82F6",
      "status": "ATIVO",
      "manager": {
        "id": "manager-uuid",
        "name": "Carlos Manager"
      },
      "memberCount": 12,
      "subTeamCount": 3,
      "averagePerformance": 87.5,
      "createdAt": "2024-12-15T10:00:00.000Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

## 🔍 Buscar Time por ID

**GET** `/api/teams/:id`

Busca um time específico com todos os detalhes.

### Response (200 OK):
```json
{
  "id": "team-uuid-123",
  "name": "Time Alpha",
  "description": "Time especializado em operações de CNC",
  "department": "Produção",
  "color": "#3B82F6",
  "managerId": "manager-uuid",
  "status": "ATIVO",
  "createdAt": "2024-12-15T10:00:00.000Z",
  "updatedAt": "2024-12-15T10:00:00.000Z",
  "manager": {
    "id": "manager-uuid",
    "name": "Carlos Manager",
    "email": "carlos@empresa.com",
    "role": "SUPERVISOR",
    "phone": "(11) 98888-7777"
  },
  "members": [
    {
      "id": "tecnico-uuid-1",
      "workday": "OP12345",
      "user": {
        "name": "João Silva"
      },
      "cargo": "Operador de Máquina CNC",
      "shift": "PRIMEIRO",
      "status": "ATIVO",
      "performanceScore": 88.5
    }
  ],
  "subTeams": [
    {
      "id": "subteam-uuid-1",
      "name": "Sub-time A1",
      "memberCount": 4,
      "leader": {
        "name": "Pedro Líder"
      }
    }
  ],
  "statistics": {
    "totalMembers": 12,
    "activeMembers": 11,
    "averagePerformance": 87.5,
    "totalEvaluations": 48,
    "byShift": {
      "PRIMEIRO": 5,
      "SEGUNDO": 4,
      "TERCEIRO": 3
    }
  }
}
```

---

## ✏️ Atualizar Time

**PATCH** `/api/teams/:id`

Atualiza informações de um time existente.

### Request Body (todos os campos opcionais):
```json
{
  "name": "Time Alpha - CNC Avançado",
  "description": "Time especializado em operações avançadas de CNC",
  "department": "Produção Especial",
  "color": "#8B5CF6",
  "managerId": "new-manager-uuid",
  "status": "ATIVO"
}
```

### Response (200 OK):
```json
{
  "id": "team-uuid-123",
  "name": "Time Alpha - CNC Avançado",
  "description": "Time especializado em operações avançadas de CNC",
  "department": "Produção Especial",
  "color": "#8B5CF6",
  "managerId": "new-manager-uuid",
  "status": "ATIVO",
  "updatedAt": "2024-12-15T14:30:00.000Z"
}
```

---

## 🔄 Alternar Status do Time

**PATCH** `/api/teams/:id/status`

Ativa ou desativa um time.

### Response (200 OK):
```json
{
  "id": "team-uuid-123",
  "name": "Time Alpha",
  "status": "INATIVO",
  "updatedAt": "2024-12-15T15:00:00.000Z"
}
```

---

## 👥 Gerenciar Membros do Time

### Listar Membros
**GET** `/api/teams/:id/members`

```json
{
  "teamId": "team-uuid-123",
  "teamName": "Time Alpha",
  "members": [
    {
      "id": "tecnico-uuid-1",
      "workday": "OP12345",
      "user": {
        "name": "João Silva",
        "email": "joao@empresa.com"
      },
      "cargo": "Operador de Máquina CNC",
      "area": "Produção",
      "shift": "PRIMEIRO",
      "status": "ATIVO",
      "joinDate": "2024-01-15T00:00:00.000Z",
      "performanceScore": 88.5,
      "machine": {
        "name": "CNC-01"
      }
    }
  ],
  "total": 12,
  "byShift": {
    "PRIMEIRO": 5,
    "SEGUNDO": 4,
    "TERCEIRO": 3
  },
  "byStatus": {
    "ATIVO": 11,
    "INATIVO": 1
  }
}
```

### Adicionar Membro
**POST** `/api/teams/:id/members`

```json
{
  "tecnicoId": "tecnico-uuid-1"
}
```

**Response:**
```json
{
  "message": "Técnico adicionado ao time com sucesso",
  "teamId": "team-uuid-123",
  "tecnicoId": "tecnico-uuid-1"
}
```

### Remover Membro
**DELETE** `/api/teams/:id/members/:tecnicoId`

```json
{
  "message": "Técnico removido do time com sucesso",
  "teamId": "team-uuid-123",
  "tecnicoId": "tecnico-uuid-1"
}
```

---

## 📂 Sub-Times

### Criar Sub-Time
**POST** `/api/teams/:id/subteams`

```json
{
  "name": "Sub-time A1",
  "description": "Especialistas em CNC de alta precisão",
  "leaderId": "tecnico-leader-uuid",
  "status": "ATIVO"
}
```

**Response (201 Created):**
```json
{
  "id": "subteam-uuid-1",
  "teamId": "team-uuid-123",
  "name": "Sub-time A1",
  "description": "Especialistas em CNC de alta precisão",
  "leaderId": "tecnico-leader-uuid",
  "status": "ATIVO",
  "createdAt": "2024-12-15T11:00:00.000Z",
  "updatedAt": "2024-12-15T11:00:00.000Z",
  "team": {
    "name": "Time Alpha"
  },
  "leader": {
    "id": "tecnico-leader-uuid",
    "workday": "OP11111",
    "user": {
      "name": "Pedro Líder"
    }
  },
  "memberCount": 0
}
```

### Listar Sub-Times de um Time
**GET** `/api/teams/:id/subteams`

```json
{
  "teamId": "team-uuid-123",
  "teamName": "Time Alpha",
  "subTeams": [
    {
      "id": "subteam-uuid-1",
      "name": "Sub-time A1",
      "description": "Especialistas em CNC de alta precisão",
      "leader": {
        "workday": "OP11111",
        "name": "Pedro Líder"
      },
      "memberCount": 4,
      "status": "ATIVO",
      "averagePerformance": 89.2
    }
  ],
  "total": 3
}
```

### Buscar Sub-Time por ID
**GET** `/api/teams/:teamId/subteams/:id`

```json
{
  "id": "subteam-uuid-1",
  "teamId": "team-uuid-123",
  "name": "Sub-time A1",
  "description": "Especialistas em CNC de alta precisão",
  "leaderId": "tecnico-leader-uuid",
  "status": "ATIVO",
  "createdAt": "2024-12-15T11:00:00.000Z",
  "updatedAt": "2024-12-15T11:00:00.000Z",
  "team": {
    "name": "Time Alpha",
    "department": "Produção"
  },
  "leader": {
    "id": "tecnico-leader-uuid",
    "workday": "OP11111",
    "user": {
      "name": "Pedro Líder",
      "email": "pedro@empresa.com"
    },
    "cargo": "Operador Sênior"
  },
  "members": [
    {
      "id": "tecnico-uuid-1",
      "workday": "OP12345",
      "user": {
        "name": "João Silva"
      },
      "cargo": "Operador de Máquina CNC",
      "shift": "PRIMEIRO",
      "performanceScore": 88.5
    }
  ],
  "statistics": {
    "totalMembers": 4,
    "averagePerformance": 89.2,
    "totalEvaluations": 16
  }
}
```

### Atualizar Sub-Time
**PATCH** `/api/teams/:teamId/subteams/:id`

```json
{
  "name": "Sub-time A1 - CNC Expert",
  "description": "Especialistas em CNC de altíssima precisão",
  "leaderId": "new-leader-uuid",
  "status": "ATIVO"
}
```

### Adicionar Membro ao Sub-Time
**POST** `/api/teams/:teamId/subteams/:id/members`

```json
{
  "tecnicoId": "tecnico-uuid-1",
  "role": "MEMBER"
}
```

**Roles Disponíveis:**
- `MEMBER` - Membro regular
- `LEADER` - Líder do sub-time

### Remover Membro do Sub-Time
**DELETE** `/api/teams/:teamId/subteams/:id/members/:tecnicoId`

### Excluir Sub-Time
**DELETE** `/api/teams/:teamId/subteams/:id`

---

## 📊 Estatísticas e Performance do Time

### Estatísticas Gerais
**GET** `/api/teams/:id/statistics`

```json
{
  "teamId": "team-uuid-123",
  "teamName": "Time Alpha",
  "period": "2024-Q4",
  "overall": {
    "totalMembers": 12,
    "activeMembers": 11,
    "totalSubTeams": 3,
    "averagePerformance": 87.5,
    "totalEvaluations": 48
  },
  "performance": {
    "current": 87.5,
    "previous": 85.2,
    "trend": "UP",
    "improvement": 2.3
  },
  "byShift": {
    "PRIMEIRO": {
      "members": 5,
      "averageScore": 88.2
    },
    "SEGUNDO": {
      "members": 4,
      "averageScore": 86.5
    },
    "TERCEIRO": {
      "members": 3,
      "averageScore": 87.8
    }
  },
  "bySkillCategory": {
    "Técnica": 86.5,
    "Segurança": 90.2,
    "Qualidade": 85.8,
    "Produtividade": 87.5
  },
  "topPerformers": [
    {
      "rank": 1,
      "workday": "OP12345",
      "name": "João Silva",
      "score": 95.5
    },
    {
      "rank": 2,
      "workday": "OP67890",
      "name": "Maria Oliveira",
      "score": 94.2
    }
  ],
  "needsAttention": [
    {
      "workday": "OP99999",
      "name": "Carlos Santos",
      "score": 72.5,
      "reason": "Performance abaixo da média"
    }
  ]
}
```

### Performance por Período
**GET** `/api/teams/:id/performance`

Query Parameters:
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `groupBy`: Agrupar por (month, quarter, year)

```json
{
  "teamId": "team-uuid-123",
  "teamName": "Time Alpha",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "data": [
    {
      "period": "2024-Q1",
      "averageScore": 85.2,
      "totalEvaluations": 42,
      "memberCount": 10
    },
    {
      "period": "2024-Q2",
      "averageScore": 86.1,
      "totalEvaluations": 43,
      "memberCount": 11
    },
    {
      "period": "2024-Q3",
      "averageScore": 85.8,
      "totalEvaluations": 44,
      "memberCount": 11
    },
    {
      "period": "2024-Q4",
      "averageScore": 87.5,
      "totalEvaluations": 48,
      "memberCount": 12
    }
  ],
  "trend": "UP",
  "overallImprovement": 2.3
}
```

### Comparar Times
**GET** `/api/teams/compare`

Query Parameters:
- `teamIds`: IDs dos times separados por vírgula
- `period`: Período para comparação (ex: 2024-Q4)

```json
{
  "period": "2024-Q4",
  "comparison": [
    {
      "teamId": "team-uuid-123",
      "teamName": "Time Alpha",
      "department": "Produção",
      "memberCount": 12,
      "averagePerformance": 87.5,
      "rank": 1
    },
    {
      "teamId": "team-uuid-456",
      "teamName": "Time Beta",
      "department": "Manutenção",
      "memberCount": 10,
      "averagePerformance": 85.3,
      "rank": 2
    }
  ]
}
```

---

## 🏆 Rankings de Times

**GET** `/api/teams/rankings`

Query Parameters:
- `period`: Período (ex: 2024-Q4)
- `department`: Filtrar por departamento
- `limit`: Número de times (padrão: 10)

```json
{
  "period": "2024-Q4",
  "rankings": [
    {
      "rank": 1,
      "teamId": "team-uuid-123",
      "teamName": "Time Alpha",
      "department": "Produção",
      "averageScore": 87.5,
      "memberCount": 12,
      "manager": {
        "name": "Carlos Manager"
      }
    }
  ],
  "totalTeams": 8
}
```

---

## ❌ Excluir Time

**DELETE** `/api/teams/:id`

Remove um time do sistema.

### Regras:
- Apenas times sem membros podem ser excluídos
- Times com histórico são apenas desativados (soft delete)
- Sub-times são automaticamente removidos

### Response (200 OK):
```json
{
  "message": "Time removido com sucesso",
  "id": "team-uuid-123"
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou campos obrigatórios ausentes
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão para gerenciar times
- `404 Not Found` - Time ou sub-time não encontrado
- `409 Conflict` - Nome do time já existe ou time possui membros ativos
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Nome Único**: Cada time deve ter um nome único no sistema
2. **Hierarquia**: Times → Sub-Times → Membros
3. **Manager**: Apenas usuários com role SUPERVISOR ou MASTER podem ser gerentes
4. **Sub-Times**: Um técnico pode pertencer a múltiplos sub-times
5. **Performance**: Calculada com base nas avaliações dos membros
6. **Permissões**:
   - `MASTER`: Acesso total a todos os times
   - `SUPERVISOR`: Pode gerenciar times que coordena
   - `TECNICO`: Apenas visualização dos próprios times
7. **Cores**: Ajudam na identificação visual no dashboard
8. **Departamentos**: Organizam times por área funcional
