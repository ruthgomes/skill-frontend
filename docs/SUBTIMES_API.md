# API de Sub-Times - SkillFix

## Visão Geral

A API de Sub-Times gerencia os sub-times dentro de times principais, permitindo estruturação hierárquica de equipes com coordenadores, funções específicas, critérios de avaliação e máquinas/skills exclusivos.

> **Importante**: Cada subtime tem suas próprias máquinas e skills. Skills são isoladas por subtime, garantindo que avaliações sejam contextualizadas.

## Estrutura do Sub-Time

- `id` (UUID) - Identificador único
- `name` (string) - Nome do sub-time
- `description` (string) - Descrição do sub-time
- `teamId` (UUID) - Time principal (chave estrangeira)
- `coordenadorId` (UUID) - Coordenador responsável (User com senioridade COORDENADOR)
- `status` (enum) - Status (ATIVO, INATIVO)
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização

### Relacionamentos
- `team` - Time principal (N:1)
- `coordenador` - Usuário coordenador (N:1)
- `members[]` - Membros do sub-time (N:N através de SubTeamMember)
- `functions[]` - Funções disponíveis no sub-time (1:N)
- `evaluationCriteria[]` - Critérios de avaliação específicos (1:N)
- `machines[]` - Máquinas do sub-time (1:N)
- `skills[]` - Habilidades específicas do sub-time (1:N)
- `tecnicos[]` - Técnicos diretamente vinculados (1:N)

## Endpoints da API

### Base URL
```
/api/sub-times
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

### 🛡️ Permissões
- **MASTER**: CRUD completo
- **TECNICO**: Apenas leitura (403 Forbidden para create/update/delete)

---

## 📝 Criar Sub-Time

**POST** `/api/sub-times`

Cria um novo sub-time dentro de um time principal.

### Request Body:
```json
{
  "name": "Linha SMT 1",
  "description": "Linha de montagem SMT número 1",
  "teamId": "team-uuid-123",
  "coordenadorId": "coord-uuid-456",
  "status": "ATIVO",
  "functions": [
    {
      "name": "Operação",
      "description": "Operação de equipamentos SMT",
      "responsibilities": [
        "Operar máquinas SMT",
        "Realizar setup",
        "Controle de qualidade"
      ]
    },
    {
      "name": "Programação",
      "description": "Programação de máquinas",
      "responsibilities": [
        "Criar programas",
        "Otimizar processos",
        "Documentação técnica"
      ]
    }
  ],
  "evaluationCriteria": [
    {
      "name": "Conhecimento Técnico",
      "description": "Domínio das técnicas de SMT",
      "weight": 0.3,
      "maxScore": 100
    },
    {
      "name": "Produtividade",
      "description": "Eficiência na produção",
      "weight": 0.4,
      "maxScore": 100
    },
    {
      "name": "Qualidade",
      "description": "Qualidade do trabalho",
      "weight": 0.3,
      "maxScore": 100
    }
  ]
}
```

### Campos Obrigatórios:
- `name`: Nome do sub-time (2-100 caracteres, único dentro do time)
- `teamId`: ID do time principal (deve existir)

### Campos Opcionais:
- `description`: Descrição detalhada (máximo 1000 caracteres)
- `coordenadorId`: ID do coordenador (User com senioridade COORDENADOR)
- `status`: Status (padrão: ATIVO)
- `functions`: Array de funções do sub-time
- `evaluationCriteria`: Array de critérios de avaliação

### Response (201 Created):
```json
{
  "id": "subteam-uuid-789",
  "name": "Linha SMT 1",
  "description": "Linha de montagem SMT número 1",
  "teamId": "team-uuid-123",
  "coordenadorId": "coord-uuid-456",
  "status": "ATIVO",
  "createdAt": "2024-12-16T10:00:00.000Z",
  "updatedAt": "2024-12-16T10:00:00.000Z",
  "team": {
    "id": "team-uuid-123",
    "name": "Manutenção SMT",
    "department": "Engenharia"
  },
  "coordenador": {
    "id": "coord-uuid-456",
    "name": "Juliana Alves",
    "workday": "OP54321"
  },
  "memberCount": 0,
  "functionsCount": 2,
  "criteriaCount": 3,
  "machinesCount": 0,
  "skillsCount": 0
}
```

---

## 📋 Listar Sub-Times

**GET** `/api/sub-times`

Lista todos os sub-times com paginação e filtros.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `teamId` (opcional): Filtrar por time principal
- `coordenadorId` (opcional): Filtrar por coordenador
- `status` (opcional): Filtrar por status (ATIVO, INATIVO)
- `search` (opcional): Busca por nome ou descrição
- `sort` (opcional): Campo para ordenação (padrão: name)
- `order` (opcional): Direção (ASC, DESC) (padrão: ASC)

### Exemplos:
```
GET /api/sub-times?teamId=team-uuid-123
GET /api/sub-times?coordenadorId=coord-uuid-456
GET /api/sub-times?search=SMT&status=ATIVO
GET /api/sub-times?sort=name&order=ASC
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "subteam-uuid-789",
      "name": "Linha SMT 1",
      "description": "Linha de montagem SMT número 1",
      "status": "ATIVO",
      "team": {
        "id": "team-uuid-123",
        "name": "Manutenção SMT"
      },
      "coordenador": {
        "id": "coord-uuid-456",
        "name": "Juliana Alves"
      },
      "memberCount": 12,
      "functionsCount": 2,
      "criteriaCount": 3,
      "machinesCount": 5,
      "skillsCount": 18
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## 🔍 Obter Sub-Time por ID

**GET** `/api/sub-times/:id`

Retorna detalhes completos de um sub-time específico.

### Parâmetros de Rota:
- `id` (UUID) - ID do sub-time

### Query Parameters:
- `include` (opcional): Incluir relacionamentos (members,functions,criteria,machines,skills)

### Exemplos:
```
GET /api/sub-times/subteam-uuid-789
GET /api/sub-times/subteam-uuid-789?include=members,functions,criteria
```

### Response (200 OK):
```json
{
  "id": "subteam-uuid-789",
  "name": "Linha SMT 1",
  "description": "Linha de montagem SMT número 1",
  "teamId": "team-uuid-123",
  "coordenadorId": "coord-uuid-456",
  "status": "ATIVO",
  "createdAt": "2024-12-16T10:00:00.000Z",
  "updatedAt": "2024-12-16T10:00:00.000Z",
  "team": {
    "id": "team-uuid-123",
    "name": "Manutenção SMT",
    "department": "Engenharia",
    "supervisor": {
      "id": "sup-uuid",
      "name": "Carlos Oliveira"
    }
  },
  "coordenador": {
    "id": "coord-uuid-456",
    "name": "Juliana Alves",
    "workday": "OP54321",
    "email": "juliana.alves@empresa.com"
  },
  "members": [
    {
      "id": "member-uuid-1",
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "name": "João Silva",
        "cargo": "Técnico SMT",
        "senioridade": "PLENO",
        "shift": "PRIMEIRO"
      },
      "joinedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "functions": [
    {
      "id": "func-uuid-1",
      "name": "Operação",
      "description": "Operação de equipamentos SMT",
      "responsibilities": [
        "Operar máquinas SMT",
        "Realizar setup",
        "Controle de qualidade"
      ]
    }
  ],
  "evaluationCriteria": [
    {
      "id": "criteria-uuid-1",
      "name": "Conhecimento Técnico",
      "description": "Domínio das técnicas de SMT",
      "weight": 0.3,
      "maxScore": 100
    }
  ],
  "machines": [
    {
      "id": "machine-uuid-1",
      "name": "PRINTER",
      "code": "PRT001"
    }
  ],
  "skillsCount": 18,
  "stats": {
    "totalMembers": 12,
    "membersByGender": {
      "M": 8,
      "F": 4
    },
    "membersBySenioridade": {
      "AUXILIAR": 2,
      "JUNIOR": 3,
      "PLENO": 5,
      "SENIOR": 2
    },
    "averageSkillScore": 78.5
  }
}
```

---

## ✏️ Atualizar Sub-Time

**PATCH** `/api/sub-times/:id`

Atualiza informações de um sub-time.

### Request Body:
```json
{
  "name": "Linha SMT 1 - Atualizada",
  "description": "Nova descrição",
  "coordenadorId": "novo-coord-uuid",
  "status": "ATIVO"
}
```

### Campos Atualizáveis:
- `name`: Nome do sub-time
- `description`: Descrição
- `coordenadorId`: Novo coordenador
- `status`: Status

### Response (200 OK):
```json
{
  "id": "subteam-uuid-789",
  "name": "Linha SMT 1 - Atualizada",
  "description": "Nova descrição",
  "coordenadorId": "novo-coord-uuid",
  "status": "ATIVO",
  "updatedAt": "2024-12-16T11:00:00.000Z"
}
```

---

## 🗑️ Deletar Sub-Time

**DELETE** `/api/sub-times/:id`

Deleta um sub-time (soft delete).

### Parâmetros de Rota:
- `id` (UUID) - ID do sub-time

### Response (200 OK):
```json
{
  "message": "Sub-time deletado com sucesso",
  "id": "subteam-uuid-789"
}
```

### Comportamento:
- Altera `status` para `INATIVO`
- Mantém histórico
- Remove vínculos de técnicos
- Preserva máquinas e skills (podem ser reassociados)

---

## 👥 Gerenciar Membros do Sub-Time

### Adicionar Membro

**POST** `/api/sub-times/:id/members`

Adiciona um técnico ao sub-time.

### Request Body:
```json
{
  "tecnicoId": "tecnico-uuid-123"
}
```

### Response (201 Created):
```json
{
  "id": "member-uuid-123",
  "subTeamId": "subteam-uuid-789",
  "tecnicoId": "tecnico-uuid-123",
  "joinedAt": "2024-12-16T10:00:00.000Z",
  "tecnico": {
    "id": "tecnico-uuid-123",
    "workday": "OP12345",
    "name": "João Silva"
  }
}
```

---

### Remover Membro

**DELETE** `/api/sub-times/:id/members/:tecnicoId`

Remove um técnico do sub-time.

### Response (200 OK):
```json
{
  "message": "Membro removido com sucesso"
}
```

---

### Listar Membros

**GET** `/api/sub-times/:id/members`

Lista todos os membros de um sub-time.

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "member-uuid-1",
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "name": "João Silva",
        "cargo": "Técnico SMT",
        "senioridade": "PLENO",
        "shift": "PRIMEIRO",
        "gender": "M",
        "photo": "https://...",
        "skillsCount": 15,
        "averageScore": 82.5
      },
      "joinedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "stats": {
    "total": 12,
    "byGender": {
      "M": 8,
      "F": 4
    },
    "bySenioridade": {
      "PLENO": 5,
      "SENIOR": 3,
      "JUNIOR": 4
    }
  }
}
```

---

## 📊 Estatísticas do Sub-Time

**GET** `/api/sub-times/:id/stats`

Retorna estatísticas detalhadas do sub-time.

### Response (200 OK):
```json
{
  "subTeamId": "subteam-uuid-789",
  "name": "Linha SMT 1",
  "period": "2024-Q4",
  "members": {
    "total": 12,
    "active": 11,
    "inactive": 1,
    "byGender": {
      "M": 8,
      "F": 4
    },
    "bySenioridade": {
      "AUXILIAR": 2,
      "JUNIOR": 3,
      "PLENO": 5,
      "SENIOR": 2
    },
    "byShift": {
      "PRIMEIRO": 5,
      "SEGUNDO": 4,
      "TERCEIRO": 3
    }
  },
  "performance": {
    "averageScore": 78.5,
    "highestScore": 95.0,
    "lowestScore": 62.0,
    "evaluationsCount": 48
  },
  "skills": {
    "total": 18,
    "averageCompletion": 65.5,
    "topSkills": [
      {
        "id": "skill-uuid-1",
        "name": "Programação PRINTER",
        "averageScore": 88.5
      }
    ],
    "skillGaps": [
      {
        "id": "skill-uuid-2",
        "name": "Manutenção Avançada",
        "averageScore": 45.0,
        "requiredScore": 70.0
      }
    ]
  },
  "machines": {
    "total": 5,
    "byMachine": [
      {
        "id": "machine-uuid-1",
        "name": "PRINTER",
        "operatorsCount": 8,
        "averageSkillScore": 82.0
      }
    ]
  }
}
```

---

## 🚨 Erros Comuns

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["name must be longer than 2 characters"],
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Sub-time não encontrado",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Já existe um sub-time com este nome neste time",
  "error": "Conflict"
}
```

---

## 💡 Notas Importantes

1. **Isolamento de Skills**: Cada sub-time possui suas próprias skills vinculadas a máquinas específicas
2. **Coordenadores**: Devem ser usuários com senioridade `COORDENADOR`
3. **Funções**: Definem responsabilidades e podem ser usadas em avaliações
4. **Critérios de Avaliação**: Personalizados por sub-time para avaliaçõesespecíficas
5. **Membros**: Um técnico pode pertencer a múltiplos sub-times através de SubTeamMember
6. **Estatísticas**: Calculadas em tempo real ou cacheadas para performance

---

## 📌 Regras de Negócio

- Sub-times devem pertencer a um time principal
- Nome do sub-time deve ser único dentro do time
- Coordenador deve ter senioridade `COORDENADOR`
- Máquinas e skills são isoladas por sub-time
- Avaliações são feitas por sub-time (skills específicas)
- Técnicos com senioridade `SUPERVISOR` não pertencem a sub-times
