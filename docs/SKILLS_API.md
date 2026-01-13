# API de Habilidades (Skills) - SisOp

## Visão Geral

A API de Habilidades gerencia as competências técnicas necessárias para operar as máquinas, avaliação de skills dos técnicos, progressão de capacitação e gaps de conhecimento.

## Estrutura da Habilidade

- `id` (UUID) - Identificador único
- `name` (string) - Nome da habilidade
- `category` (string) - Categoria da habilidade
- `description` (text) - Descrição detalhada
- `machineId` (UUID) - Máquina relacionada (chave estrangeira)
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização

## Estrutura TecnicoSkill (Relação Técnico-Habilidade)

- `id` (UUID) - Identificador único
- `tecnicoId` (UUID) - Técnico (chave estrangeira)
- `skillId` (UUID) - Habilidade (chave estrangeira)
- `score` (float) - Pontuação (0-100)
- `createdAt` (datetime) - Data de avaliação inicial
- `updatedAt` (datetime) - Data da última atualização

## Endpoints da API

### Base URL
```
/api/skills
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📝 Criar Habilidade

**POST** `/api/skills`

Cria uma nova habilidade no sistema.

### Request Body:
```json
{
  "name": "Operação Básica CNC",
  "category": "Técnica",
  "description": "Conhecimento básico de operação da máquina CNC, incluindo ligar/desligar, carregamento de programas e operação supervisionada",
  "machineId": "machine-uuid-123",
  "requiredLevel": 70,
  "trainingMaterial": [
    {
      "type": "video",
      "title": "Introdução ao CNC",
      "url": "https://..."
    },
    {
      "type": "document",
      "title": "Manual do Operador",
      "url": "https://..."
    }
  ]
}
```

### Campos Obrigatórios:
- `name`: Nome da habilidade (2-255 caracteres)
- `category`: Categoria (2-100 caracteres)
- `machineId`: ID da máquina relacionada

### Campos Opcionais:
- `description`: Descrição detalhada (máximo 2000 caracteres)
- `requiredLevel`: Nível mínimo requerido (0-100, padrão: 70)
- `trainingMaterial`: Material de treinamento (array JSON)

### Categorias Comuns:
- `Técnica` - Operação e conhecimento técnico
- `Técnica Avançada` - Skills avançadas
- `Programação` - Programação de equipamentos
- `Manutenção` - Manutenção básica
- `Segurança` - Procedimentos de segurança
- `Qualidade` - Controle de qualidade
- `Setup` - Preparação e configuração

### Response (201 Created):
```json
{
  "id": "skill-uuid-123",
  "name": "Operação Básica CNC",
  "category": "Técnica",
  "description": "Conhecimento básico de operação da máquina CNC...",
  "machineId": "machine-uuid-123",
  "requiredLevel": 70,
  "trainingMaterial": [...],
  "createdAt": "2024-12-15T10:00:00.000Z",
  "updatedAt": "2024-12-15T10:00:00.000Z",
  "machine": {
    "id": "machine-uuid-123",
    "name": "CNC-01",
    "code": "CNC001"
  },
  "techniciansWithSkill": 0,
  "averageScore": 0
}
```

---

## 📋 Listar Habilidades

**GET** `/api/skills`

Lista todas as habilidades com paginação e filtros.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Busca por nome ou descrição
- `category` (opcional): Filtrar por categoria
- `machineId` (opcional): Filtrar por máquina
- `minRequiredLevel` (opcional): Nível mínimo requerido
- `sort` (opcional): Campo para ordenação (padrão: name)
- `order` (opcional): Direção (ASC, DESC) (padrão: ASC)

### Exemplos:
```
GET /api/skills?page=1&limit=20
GET /api/skills?search=CNC
GET /api/skills?category=Técnica&machineId=machine-uuid-123
GET /api/skills?minRequiredLevel=80
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "skill-uuid-123",
      "name": "Operação Básica CNC",
      "category": "Técnica",
      "description": "Conhecimento básico de operação...",
      "requiredLevel": 70,
      "machine": {
        "id": "machine-uuid-123",
        "name": "CNC-01",
        "code": "CNC001"
      },
      "techniciansWithSkill": 12,
      "averageScore": 85.5,
      "createdAt": "2024-12-15T10:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

## 🔍 Buscar Habilidade por ID

**GET** `/api/skills/:id`

Busca uma habilidade específica com todos os detalhes.

### Response (200 OK):
```json
{
  "id": "skill-uuid-123",
  "name": "Operação Básica CNC",
  "category": "Técnica",
  "description": "Conhecimento básico de operação da máquina CNC...",
  "machineId": "machine-uuid-123",
  "requiredLevel": 70,
  "trainingMaterial": [
    {
      "type": "video",
      "title": "Introdução ao CNC",
      "url": "https://...",
      "duration": "45 min"
    }
  ],
  "createdAt": "2024-12-15T10:00:00.000Z",
  "updatedAt": "2024-12-15T10:00:00.000Z",
  "machine": {
    "id": "machine-uuid-123",
    "name": "CNC-01",
    "code": "CNC001",
    "manufacturer": "HAAS Automation"
  },
  "technicians": [
    {
      "id": "tecnico-skill-uuid-1",
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "user": {
          "name": "João Silva"
        },
        "cargo": "Operador de Máquina CNC"
      },
      "score": 90.0,
      "level": "Avançado",
      "lastEvaluated": "2024-12-01T10:00:00.000Z",
      "certified": true
    }
  ],
  "statistics": {
    "totalTechnicians": 12,
    "averageScore": 85.5,
    "highestScore": 95.0,
    "lowestScore": 72.0,
    "certified": 8,
    "inTraining": 4,
    "scoreDistribution": {
      "90-100": 3,
      "80-89": 5,
      "70-79": 3,
      "below-70": 1
    }
  }
}
```

---

## ✏️ Atualizar Habilidade

**PATCH** `/api/skills/:id`

Atualiza informações de uma habilidade existente.

### Request Body (todos os campos opcionais):
```json
{
  "name": "Operação Avançada CNC",
  "description": "Operação avançada incluindo programação e ajustes",
  "category": "Técnica Avançada",
  "requiredLevel": 85,
  "trainingMaterial": [...]
}
```

### Response (200 OK):
```json
{
  "id": "skill-uuid-123",
  "name": "Operação Avançada CNC",
  "description": "Operação avançada incluindo programação e ajustes",
  "category": "Técnica Avançada",
  "requiredLevel": 85,
  "updatedAt": "2024-12-15T14:30:00.000Z"
}
```

---

## 👤 Habilidades de um Técnico

### Listar Habilidades do Técnico
**GET** `/api/skills/tecnico/:tecnicoId`

```json
{
  "tecnicoId": "tecnico-uuid-1",
  "tecnico": {
    "workday": "OP12345",
    "user": {
      "name": "João Silva"
    },
    "cargo": "Operador de Máquina CNC"
  },
  "skills": [
    {
      "id": "tecnico-skill-uuid-1",
      "skill": {
        "id": "skill-uuid-123",
        "name": "Operação Básica CNC",
        "category": "Técnica",
        "machine": {
          "name": "CNC-01"
        }
      },
      "score": 90.0,
      "level": "Avançado",
      "requiredLevel": 70,
      "gap": 0,
      "certified": true,
      "lastEvaluated": "2024-12-01T10:00:00.000Z"
    }
  ],
  "summary": {
    "totalSkills": 8,
    "averageScore": 86.5,
    "certified": 6,
    "inProgress": 2,
    "byCategory": {
      "Técnica": 3,
      "Técnica Avançada": 2,
      "Programação": 2,
      "Segurança": 1
    }
  },
  "gaps": [
    {
      "skillName": "Programação CNC Avançada",
      "currentScore": 65.0,
      "requiredLevel": 80.0,
      "gap": 15.0
    }
  ]
}
```

### Avaliar/Atualizar Habilidade do Técnico
**POST** `/api/skills/tecnico/:tecnicoId/evaluate`

```json
{
  "skillId": "skill-uuid-123",
  "score": 88.0,
  "evaluatorId": "evaluator-uuid",
  "evaluationDate": "2024-12-15",
  "observations": "Demonstrou excelente evolução na operação da máquina",
  "certified": true
}
```

**Response:**
```json
{
  "id": "tecnico-skill-uuid-1",
  "tecnicoId": "tecnico-uuid-1",
  "skillId": "skill-uuid-123",
  "score": 88.0,
  "previousScore": 85.0,
  "improvement": 3.0,
  "level": "Avançado",
  "certified": true,
  "evaluatedBy": {
    "name": "Maria Supervisora"
  },
  "evaluationDate": "2024-12-15T00:00:00.000Z",
  "observations": "Demonstrou excelente evolução...",
  "updatedAt": "2024-12-15T14:00:00.000Z"
}
```

### Histórico de Avaliações de uma Habilidade
**GET** `/api/skills/tecnico/:tecnicoId/skill/:skillId/history`

```json
{
  "tecnicoId": "tecnico-uuid-1",
  "skillId": "skill-uuid-123",
  "skillName": "Operação Básica CNC",
  "history": [
    {
      "date": "2024-12-15T00:00:00.000Z",
      "score": 88.0,
      "evaluator": "Maria Supervisora",
      "observations": "Demonstrou excelente evolução..."
    },
    {
      "date": "2024-09-10T00:00:00.000Z",
      "score": 85.0,
      "evaluator": "Carlos Manager",
      "observations": "Bom progresso"
    },
    {
      "date": "2024-06-05T00:00:00.000Z",
      "score": 78.0,
      "evaluator": "Maria Supervisora",
      "observations": "Avaliação inicial positiva"
    }
  ],
  "progression": {
    "initialScore": 78.0,
    "currentScore": 88.0,
    "totalImprovement": 10.0,
    "improvementRate": 12.8,
    "evaluationCount": 3
  }
}
```

---

## 📊 Análise de Gaps de Habilidades

### Gaps por Técnico
**GET** `/api/skills/gaps/tecnico/:tecnicoId`

```json
{
  "tecnicoId": "tecnico-uuid-1",
  "tecnico": {
    "workday": "OP12345",
    "name": "João Silva"
  },
  "gaps": [
    {
      "skillId": "skill-uuid-456",
      "skillName": "Programação CNC Avançada",
      "category": "Programação",
      "currentScore": 65.0,
      "requiredLevel": 80.0,
      "gap": 15.0,
      "priority": "HIGH",
      "trainingRecommended": true,
      "estimatedTrainingTime": "40 horas"
    }
  ],
  "summary": {
    "totalGaps": 3,
    "criticalGaps": 1,
    "highPriorityGaps": 2,
    "averageGap": 12.5
  }
}
```

### Gaps por Máquina
**GET** `/api/skills/gaps/machine/:machineId`

```json
{
  "machineId": "machine-uuid-123",
  "machineName": "CNC-01",
  "gaps": [
    {
      "tecnico": {
        "workday": "OP12345",
        "name": "João Silva"
      },
      "skill": "Programação CNC Avançada",
      "currentScore": 65.0,
      "requiredLevel": 80.0,
      "gap": 15.0
    }
  ],
  "summary": {
    "totalOperators": 5,
    "fullyQualified": 2,
    "needsTraining": 3,
    "criticalGaps": 1
  }
}
```

### Gaps por Time
**GET** `/api/skills/gaps/team/:teamId`

```json
{
  "teamId": "team-uuid-123",
  "teamName": "Time Alpha",
  "gaps": [
    {
      "tecnico": {
        "workday": "OP12345",
        "name": "João Silva"
      },
      "skill": "Programação CNC Avançada",
      "machine": "CNC-01",
      "gap": 15.0,
      "priority": "HIGH"
    }
  ],
  "summary": {
    "totalMembers": 12,
    "averageSkillScore": 84.5,
    "criticalGaps": 3,
    "totalGaps": 18,
    "skillsCoverage": 85.5
  },
  "recommendations": [
    {
      "skill": "Programação CNC Avançada",
      "affectedTechnicians": 3,
      "priority": "HIGH",
      "action": "Agendar treinamento em grupo"
    }
  ]
}
```

---

## 📈 Estatísticas e Analytics

### Estatísticas Gerais
**GET** `/api/skills/statistics`

```json
{
  "overall": {
    "totalSkills": 45,
    "totalTechnicians": 50,
    "averageSkillsPerTechnician": 6.8,
    "averageScore": 82.5,
    "totalCertified": 220
  },
  "byCategory": {
    "Técnica": {
      "count": 15,
      "averageScore": 85.2
    },
    "Técnica Avançada": {
      "count": 10,
      "averageScore": 78.5
    },
    "Programação": {
      "count": 8,
      "averageScore": 80.1
    },
    "Segurança": {
      "count": 12,
      "averageScore": 90.5
    }
  },
  "byMachine": {
    "CNC-01": {
      "skillCount": 8,
      "qualifiedTechnicians": 12,
      "averageScore": 86.5
    }
  },
  "trends": {
    "improvingSkills": 30,
    "decliningSkills": 5,
    "stableSkills": 10
  }
}
```

### Top Habilidades Dominadas
**GET** `/api/skills/top-performers`

Query Parameters:
- `skillId`: ID da habilidade
- `limit`: Número de técnicos (padrão: 10)

```json
{
  "skillId": "skill-uuid-123",
  "skillName": "Operação Básica CNC",
  "topPerformers": [
    {
      "rank": 1,
      "tecnico": {
        "workday": "OP12345",
        "name": "João Silva"
      },
      "score": 95.0,
      "certified": true,
      "lastEvaluated": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

### Habilidades Mais Requisitadas
**GET** `/api/skills/most-required`

```json
{
  "skills": [
    {
      "id": "skill-uuid-123",
      "name": "Operação Básica CNC",
      "category": "Técnica",
      "machinesCount": 5,
      "techniciansWithSkill": 12,
      "averageScore": 85.5,
      "demand": "HIGH"
    }
  ]
}
```

---

## 🎓 Certificações

### Listar Certificações do Técnico
**GET** `/api/skills/tecnico/:tecnicoId/certifications`

```json
{
  "tecnicoId": "tecnico-uuid-1",
  "certifications": [
    {
      "skill": "Operação Básica CNC",
      "score": 90.0,
      "certifiedDate": "2024-12-01T00:00:00.000Z",
      "expiresAt": "2025-12-01T00:00:00.000Z",
      "certifiedBy": "Maria Supervisora",
      "status": "ACTIVE"
    }
  ],
  "summary": {
    "total": 6,
    "active": 5,
    "expired": 1,
    "expiringSoon": 2
  }
}
```

### Certificar Técnico
**POST** `/api/skills/tecnico/:tecnicoId/certify`

```json
{
  "skillId": "skill-uuid-123",
  "certifiedById": "evaluator-uuid",
  "expiresAt": "2025-12-15",
  "notes": "Aprovado após avaliação prática"
}
```

### Renovar Certificação
**PATCH** `/api/skills/certifications/:id/renew`

```json
{
  "expiresAt": "2026-12-15"
}
```

---

## 📚 Material de Treinamento

### Listar Material de uma Habilidade
**GET** `/api/skills/:id/training-material`

```json
{
  "skillId": "skill-uuid-123",
  "skillName": "Operação Básica CNC",
  "materials": [
    {
      "id": "material-uuid-1",
      "type": "video",
      "title": "Introdução ao CNC",
      "url": "https://...",
      "duration": "45 min",
      "language": "pt-BR",
      "completions": 35
    },
    {
      "id": "material-uuid-2",
      "type": "document",
      "title": "Manual do Operador",
      "url": "https://...",
      "pages": 120,
      "downloads": 50
    }
  ]
}
```

### Adicionar Material
**POST** `/api/skills/:id/training-material`

```json
{
  "type": "video",
  "title": "Setup Avançado",
  "url": "https://...",
  "duration": "60 min",
  "language": "pt-BR"
}
```

---

## ❌ Excluir Habilidade

**DELETE** `/api/skills/:id`

Remove uma habilidade do sistema.

### Regras:
- Apenas habilidades sem técnicos avaliados podem ser excluídas
- Habilidades com histórico são apenas desativadas

### Response (200 OK):
```json
{
  "message": "Habilidade removida com sucesso",
  "id": "skill-uuid-123"
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou campos obrigatórios ausentes
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão para gerenciar habilidades
- `404 Not Found` - Habilidade não encontrada
- `409 Conflict` - Habilidade já existe para esta máquina ou possui avaliações
- `422 Unprocessable Entity` - Score inválido (fora do range 0-100)
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Score Range**: Todos os scores devem estar entre 0 e 100
2. **Níveis de Proficiência**:
   - 0-49: Iniciante
   - 50-69: Básico
   - 70-84: Intermediário
   - 85-94: Avançado
   - 95-100: Expert
3. **Certificação**: Geralmente requer score ≥ 85
4. **Gap Analysis**: Diferença entre score atual e nível requerido
5. **Prioridades de Gap**:
   - CRITICAL: gap > 30 pontos
   - HIGH: gap 15-30 pontos
   - MEDIUM: gap 5-15 pontos
   - LOW: gap < 5 pontos
6. **Progressão**: Histórico completo de avaliações é mantido
7. **Permissões**:
   - `MASTER`: Acesso total e pode certificar
   - `SUPERVISOR`: Pode avaliar técnicos de sua área
   - `TECNICO`: Visualiza apenas suas próprias habilidades
8. **Renovação**: Certificações podem ter data de expiração
