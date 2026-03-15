# API de Avaliações Trimestrais - SkillFix

## Visão Geral

A API de Avaliações gerencia o sistema de avaliação trimestral dos técnicos/colaboradores, baseado em avaliação individual de skills. Cada técnico recebe avaliações a cada 3 meses, com cooldown automático para evitar avaliações muito próximas.

> **Regra importante**: O período mínimo entre avaliações é de 3 meses (90 dias). Colaboradores recém-avaliados ficam bloqueados até que o período de cooldown expire.

## Estrutura da Avaliação Trimestral (QuarterlyNote)

- `id` (UUID) - Identificador único
- `tecnicoId` (UUID) - Técnico avaliado (chave estrangeira)
- `quarter` (int) - Trimestre (1, 2, 3 ou 4)
- `year` (int) - Ano da avaliação
- `score` (float) - Pontuação geral (média das skills, 0-100)
- `evaluatedDate` (datetime) - Data da avaliação
- `notes` (text) - Observações gerais do avaliador
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização

### Relacionamentos
- `tecnico` - Técnico avaliado (N:1)
- `skillScores` - Pontuações individuais por skill (implícito, armazenado em `tecnico.skills`)

## Sistema de Trimestres

| Trimestre | Meses | Período |
|-----------|-------|---------|
| Q1 | Janeiro - Março | 1º Trimestre |
| Q2 | Abril - Junho | 2º Trimestre |
| Q3 | Julho - Setembro | 3º Trimestre |
| Q4 | Outubro - Dezembro | 4º Trimestre |

## Endpoints da API

### Base URL
```
/api/avaliacoes
```

### Endpoint Alternativo (Quarterly Notes)
```
/api/quarterly-notes
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

### 🛡️ Permissões
- **MASTER**: Criar, visualizar, editar e deletar avaliações
- **TECNICO**: Apenas visualizar suas próprias avaliações (403 Forbidden para outras operações)

---

## 📝 Criar Avaliação Trimestral

**POST** `/api/avaliacoes`

Cria uma nova avaliação trimestral para um técnico baseada em suas skills.

### Validações:
- ✅ Técnico deve existir e estar ativo
- ✅ Última avaliação deve ter sido há pelo menos 3 meses (90 dias)
- ✅ Todas as skills do técnico devem ser avaliadas (score 0-100)
- ✅ Trimestre e ano devem ser válidos

### Request Body:
```json
{
  "tecnicoId": "abc12345-e89b-12d3-a456-426614174003",
  "quarter": 4,
  "year": 2024,
  "notes": "Excelente desempenho no trimestre. Demonstrou grande evolução em programação de máquinas PRINTER e habilidades de troubleshooting.",
  "skillScores": {
    "skill-uuid-1": 85.0,
    "skill-uuid-2": 90.0,
    "skill-uuid-3": 78.0,
    "skill-uuid-4": 92.0,
    "skill-uuid-5": 88.0
  }
}
```

### Campos Obrigatórios:
- `tecnicoId`: ID do técnico a ser avaliado
- `quarter`: Trimestre (1, 2, 3 ou 4)
- `year`: Ano da avaliação (ex: 2024)
- `skillScores`: Objeto com ID da skill e pontuação (0-100) para TODAS as skills do técnico

### Campos Opcionais:
- `notes`: Observações gerais (máximo 2000 caracteres)

### Cálculo do Score Geral:
O `score` é calculado automaticamente como a média aritmética de todas as skills avaliadas:
```
score = sum(skillScores.values()) / count(skillScores)
```

### Response (201 Created):
```json
{
  "id": "quarterly-note-uuid-123",
  "tecnicoId": "abc12345-e89b-12d3-a456-426614174003",
  "quarter": 4,
  "year": 2024,
  "score": 86.6,
  "evaluatedDate": "2024-12-15T14:30:00.000Z",
  "notes": "Excelente desempenho no trimestre...",
  "createdAt": "2024-12-15T14:30:00.000Z",
  "updatedAt": "2024-12-15T14:30:00.000Z",
  "tecnico": {
    "id": "abc12345-e89b-12d3-a456-426614174003",
    "workday": "OP12345",
    "name": "João Silva",
    "cargo": "Técnico de Manutenção",
    "senioridade": "PLENO",
    "team": {
      "id": "team-uuid",
      "name": "Manutenção SMT"
    },
    "subTeam": {
      "id": "subteam-uuid",
      "name": "Linha SMT 1"
    }
  },
  "skillScores": [
    {
      "skillId": "skill-uuid-1",
      "skillName": "Programação PRINTER",
      "score": 85.0,
      "previousScore": 78.0,
      "improvement": 7.0
    },
    {
      "skillId": "skill-uuid-2",
      "skillName": "Manutenção Preventiva",
      "score": 90.0,
      "previousScore": 85.0,
      "improvement": 5.0
    }
  ],
  "nextEvaluationDate": "2025-03-15T14:30:00.000Z"
}
```

### Erros Comuns:
- `400 Bad Request` - Skills ausentes ou período de cooldown não expirado
  ```json
  {
    "statusCode": 400,
    "message": "Técnico só pode ser avaliado novamente em 2025-03-15. Última avaliação: 2024-12-15",
    "error": "Bad Request",
    "cooldownDays": 90,
    "daysRemaining": 75
  }
  ```
- `400 Bad Request` - Skills não avaliadas
  ```json
  {
    "statusCode": 400,
    "message": "Todas as skills do técnico devem ser avaliadas",
    "error": "Bad Request",
    "missingSkills": [
      {
        "id": "skill-uuid-6",
        "name": "Calibração AOI"
      }
    ]
  }
  ```
  "createdAt": "2024-12-15T14:30:00.000Z",
  "updatedAt": "2024-12-15T14:30:00.000Z",
  "tecnico": {
    "id": "abc12345-e89b-12d3-a456-426614174003",
    "workday": "OP12345",
    "user": {
      "name": "João Silva",
      "email": "joao.silva@empresa.com"
    },
    "cargo": "Operador de Máquina CNC",
    "area": "Produção"
  },
  "evaluator": {
    "id": "eval-uuid",
    "name": "Maria Santos",
    "email": "maria.santos@empresa.com",
    "role": "SUPERVISOR"
  }
}
```

---

## 📋 Listar Avaliações

**GET** `/api/avaliacoes`

Lista todas as avaliações com paginação e filtros.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `tecnicoId` (opcional): Filtrar por técnico específico
- `evaluatorId` (opcional): Filtrar por avaliador específico
- `period` (opcional): Filtrar por período (ex: 2024-Q4)
- `status` (opcional): Filtrar por status (DRAFT, SUBMITTED, APPROVED, REJECTED)
- `startDate` (opcional): Data inicial (formato: YYYY-MM-DD)
- `endDate` (opcional): Data final (formato: YYYY-MM-DD)
- `minScore` (opcional): Score mínimo (0-100)
- `maxScore` (opcional): Score máximo (0-100)
- `sort` (opcional): Campo para ordenação (padrão: evaluatedAt)
- `order` (opcional): Direção (ASC, DESC) (padrão: DESC)

### Exemplos:
```
GET /api/avaliacoes?page=1&limit=20
GET /api/avaliacoes?tecnicoId=abc12345-e89b-12d3-a456-426614174003
GET /api/avaliacoes?period=2024-Q4&status=APPROVED
GET /api/avaliacoes?startDate=2024-10-01&endDate=2024-12-31
GET /api/avaliacoes?minScore=80&sort=score&order=DESC
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "eval-uuid-123",
      "tecnicoId": "abc12345-e89b-12d3-a456-426614174003",
      "period": "2024-Q4",
      "score": 88.65,
      "status": "APPROVED",
      "evaluatedAt": "2024-12-15T14:30:00.000Z",
      "tecnico": {
        "workday": "OP12345",
        "user": {
          "name": "João Silva"
        },
        "cargo": "Operador de Máquina CNC"
      },
      "evaluator": {
        "name": "Maria Santos",
        "role": "SUPERVISOR"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15,
  "statistics": {
    "averageScore": 85.3,
    "highestScore": 95.5,
    "lowestScore": 65.2
  }
}
```

---

## 🔍 Buscar Avaliação por ID

**GET** `/api/avaliacoes/:id`

Busca uma avaliação específica pelo ID com todos os detalhes.

### Response (200 OK):
```json
{
  "id": "eval-uuid-123",
  "tecnicoId": "abc12345-e89b-12d3-a456-426614174003",
  "evaluatorId": "eval-uuid",
  "period": "2024-Q4",
  "score": 88.65,
  "productionScore": 90.0,
  "qualityScore": 85.0,
  "safetyScore": 92.0,
  "teamworkScore": 87.0,
  "observations": "Excelente desempenho no trimestre. Demonstrou grande capacidade técnica e liderança.",
  "status": "APPROVED",
  "evaluatedAt": "2024-12-15T14:30:00.000Z",
  "createdAt": "2024-12-15T14:30:00.000Z",
  "updatedAt": "2024-12-15T14:30:00.000Z",
  "tecnico": {
    "id": "abc12345-e89b-12d3-a456-426614174003",
    "workday": "OP12345",
    "user": {
      "id": "user-uuid",
      "name": "João Silva",
      "email": "joao.silva@empresa.com"
    },
    "cargo": "Operador de Máquina CNC",
    "area": "Produção",
    "shift": "PRIMEIRO",
    "team": {
      "name": "Time Alpha"
    }
  },
  "evaluator": {
    "id": "eval-uuid",
    "name": "Maria Santos",
    "email": "maria.santos@empresa.com",
    "role": "SUPERVISOR"
  },
  "history": [
    {
      "action": "CREATED",
      "timestamp": "2024-12-15T14:30:00.000Z",
      "userId": "eval-uuid"
    },
    {
      "action": "STATUS_CHANGED",
      "from": "DRAFT",
      "to": "SUBMITTED",
      "timestamp": "2024-12-15T14:35:00.000Z"
    },
    {
      "action": "APPROVED",
      "timestamp": "2024-12-15T15:00:00.000Z",
      "userId": "master-uuid"
    }
  ]
}
```

---

## ✏️ Atualizar Avaliação

**PATCH** `/api/avaliacoes/:id`

Atualiza uma avaliação existente (apenas se status for DRAFT ou REJECTED).

### Request Body (todos os campos opcionais):
```json
{
  "productionScore": 92.0,
  "qualityScore": 88.0,
  "safetyScore": 95.0,
  "teamworkScore": 89.0,
  "observations": "Atualização: Desempenho ainda melhor após revisão...",
  "status": "SUBMITTED"
}
```

### Regras:
- Apenas avaliações com status `DRAFT` ou `REJECTED` podem ser editadas
- O `score` geral é recalculado automaticamente
- Alterações são registradas no histórico

### Response (200 OK):
```json
{
  "id": "eval-uuid-123",
  "score": 91.15,
  "productionScore": 92.0,
  "qualityScore": 88.0,
  "safetyScore": 95.0,
  "teamworkScore": 89.0,
  "observations": "Atualização: Desempenho ainda melhor...",
  "status": "SUBMITTED",
  "updatedAt": "2024-12-15T16:00:00.000Z"
}
```

---

## 🔄 Alterar Status da Avaliação

**PATCH** `/api/avaliacoes/:id/status`

Altera o status de uma avaliação.

### Request Body:
```json
{
  "status": "APPROVED",
  "reason": "Aprovada após análise detalhada"
}
```

### Fluxo de Status Permitidos:
- `DRAFT` → `SUBMITTED`
- `SUBMITTED` → `APPROVED` ou `REJECTED`
- `REJECTED` → `DRAFT`

### Permissões:
- **SUPERVISOR**: Pode criar e submeter avaliações
- **MASTER**: Pode aprovar ou rejeitar avaliações

### Response (200 OK):
```json
{
  "id": "eval-uuid-123",
  "status": "APPROVED",
  "updatedAt": "2024-12-15T17:00:00.000Z",
  "statusHistory": [
    {
      "status": "APPROVED",
      "changedBy": "master-uuid",
      "reason": "Aprovada após análise detalhada",
      "timestamp": "2024-12-15T17:00:00.000Z"
    }
  ]
}
```

---

## 📊 Avaliações por Período

### Listar por Período Específico
**GET** `/api/avaliacoes/period/:period`

Exemplo: `GET /api/avaliacoes/period/2024-Q4`

```json
{
  "period": "2024-Q4",
  "totalEvaluations": 45,
  "averageScore": 85.3,
  "data": [
    {
      "id": "eval-uuid-123",
      "tecnico": {
        "workday": "OP12345",
        "name": "João Silva"
      },
      "score": 88.65,
      "status": "APPROVED"
    }
  ],
  "scoreDistribution": {
    "90-100": 12,
    "80-89": 20,
    "70-79": 10,
    "60-69": 3,
    "below-60": 0
  }
}
```

### Comparar Períodos
**GET** `/api/avaliacoes/compare-periods`

```json
{
  "comparison": [
    {
      "period": "2024-Q1",
      "averageScore": 82.5,
      "totalEvaluations": 42
    },
    {
      "period": "2024-Q2",
      "averageScore": 84.1,
      "totalEvaluations": 43
    },
    {
      "period": "2024-Q3",
      "averageScore": 83.8,
      "totalEvaluations": 44
    },
    {
      "period": "2024-Q4",
      "averageScore": 85.3,
      "totalEvaluations": 45
    }
  ],
  "trend": "UP",
  "improvement": 2.8
}
```

---

## 👤 Avaliações de um Técnico

### Histórico Completo
**GET** `/api/avaliacoes/tecnico/:tecnicoId`

Lista todas as avaliações de um técnico específico.

### Query Parameters:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `status`: Filtrar por status
- `startDate`: Data inicial
- `endDate`: Data final

```json
{
  "tecnicoId": "abc12345-e89b-12d3-a456-426614174003",
  "tecnico": {
    "workday": "OP12345",
    "name": "João Silva",
    "cargo": "Operador de Máquina CNC"
  },
  "data": [
    {
      "id": "eval-uuid-123",
      "period": "2024-Q4",
      "score": 88.65,
      "productionScore": 90.0,
      "qualityScore": 85.0,
      "safetyScore": 92.0,
      "teamworkScore": 87.0,
      "status": "APPROVED",
      "evaluatedAt": "2024-12-15T14:30:00.000Z",
      "evaluator": {
        "name": "Maria Santos"
      }
    }
  ],
  "total": 12,
  "statistics": {
    "averageScore": 86.3,
    "highestScore": 92.5,
    "lowestScore": 78.0,
    "trend": "UP",
    "lastPeriodImprovement": 2.35
  },
  "scoresByCategory": {
    "production": 87.5,
    "quality": 84.2,
    "safety": 90.1,
    "teamwork": 85.8
  }
}
```

### Última Avaliação
**GET** `/api/avaliacoes/tecnico/:tecnicoId/latest`

Retorna a avaliação mais recente aprovada do técnico.

---

## 📈 Estatísticas e Analytics

### Estatísticas Gerais
**GET** `/api/avaliacoes/statistics`

```json
{
  "overall": {
    "totalEvaluations": 180,
    "averageScore": 84.5,
    "totalTecnicos": 45,
    "approvedEvaluations": 165,
    "pendingEvaluations": 15
  },
  "byPeriod": {
    "2024-Q1": { "count": 42, "average": 82.5 },
    "2024-Q2": { "count": 43, "average": 84.1 },
    "2024-Q3": { "count": 44, "average": 83.8 },
    "2024-Q4": { "count": 45, "average": 85.3 }
  },
  "byCategory": {
    "production": 85.2,
    "quality": 83.5,
    "safety": 88.9,
    "teamwork": 84.1
  },
  "scoreDistribution": {
    "90-100": 25,
    "80-89": 95,
    "70-79": 50,
    "60-69": 10,
    "below-60": 0
  }
}
```

### Top Performers
**GET** `/api/avaliacoes/top-performers`

```json
{
  "period": "2024-Q4",
  "topPerformers": [
    {
      "rank": 1,
      "tecnicoId": "uuid-1",
      "workday": "OP12345",
      "name": "João Silva",
      "score": 95.5,
      "evaluationId": "eval-uuid"
    },
    {
      "rank": 2,
      "tecnicoId": "uuid-2",
      "workday": "OP67890",
      "name": "Maria Oliveira",
      "score": 94.2,
      "evaluationId": "eval-uuid-2"
    }
  ]
}
```

---

## 📝 Notas Trimestrais (Quarterly Notes)

### Criar Nota Trimestral
**POST** `/api/avaliacoes/:id/quarterly-note`

Adiciona uma nota detalhada a uma avaliação aprovada.

```json
{
  "quarter": "Q4",
  "year": 2024,
  "note": "Técnico demonstrou excelente evolução...",
  "highlights": [
    "Reduziu tempo de setup em 15%",
    "Zero acidentes no período",
    "Mentor de 2 novos operadores"
  ],
  "areasForImprovement": [
    "Melhorar documentação de processos",
    "Desenvolver habilidades de liderança"
  ]
}
```

---

## ❌ Excluir Avaliação

**DELETE** `/api/avaliacoes/:id`

Remove uma avaliação (apenas DRAFT ou REJECTED).

### Regras:
- Apenas avaliações com status `DRAFT` ou `REJECTED` podem ser excluídas
- Avaliações `APPROVED` não podem ser excluídas (apenas arquivadas)

### Response (200 OK):
```json
{
  "message": "Avaliação removida com sucesso",
  "id": "eval-uuid-123"
}
```

---

## 📤 Exportar Avaliações

### Exportar para Excel
**GET** `/api/avaliacoes/export/excel`

### Exportar para PDF
**GET** `/api/avaliacoes/export/pdf/:id`

Exporta uma avaliação específica em formato PDF.

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou campos obrigatórios ausentes
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão para acessar/modificar avaliação
- `404 Not Found` - Avaliação não encontrada
- `409 Conflict` - Já existe avaliação para este técnico neste período
- `422 Unprocessable Entity` - Status transition inválida
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Período Único**: Cada técnico pode ter apenas uma avaliação aprovada por período
2. **Cálculo Automático**: O score geral é calculado automaticamente com pesos predefinidos
3. **Auditoria**: Todas as alterações são registradas no histórico
4. **Permissões**: 
   - `TECNICO`: Pode apenas visualizar suas próprias avaliações
   - `SUPERVISOR`: Pode criar e submeter avaliações
   - `MASTER`: Pode aprovar, rejeitar e visualizar todas as avaliações
5. **Workflow**: 
   - Criação → DRAFT
   - Submissão → SUBMITTED (aguardando aprovação)
   - Aprovação → APPROVED (final)
   - Rejeição → REJECTED (permite reedição)
6. **Scores**: Todos os scores devem estar entre 0 e 100
7. **Pesos dos Critérios**:
   - Produção: 35%
   - Qualidade: 30%
   - Segurança: 20%
   - Trabalho em Equipe: 15%
