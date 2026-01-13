# API de Técnicos/Operadores - SisOp

## Visão Geral

A API de Técnicos gerencia o cadastro completo dos operadores do sistema, incluindo informações pessoais, máquinas atribuídas, times, turnos, habilidades e histórico de avaliações.

## Estrutura do Técnico

- `id` (UUID) - Identificador único
- `userId` (UUID) - Referência ao usuário (chave estrangeira)
- `workday` (string) - ID único do operador/técnico
- `cargo` (string) - Cargo/função do técnico
- `area` (string) - Área de atuação
- `shift` (enum) - Turno de trabalho (PRIMEIRO, SEGUNDO, TERCEIRO)
- `machineId` (UUID) - Máquina atribuída (opcional)
- `teamId` (UUID) - Time principal (opcional)
- `status` (enum) - Status (ATIVO, INATIVO)
- `joinDate` (datetime) - Data de entrada
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização

## Endpoints da API

### Base URL
```
/api/tecnicos
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📝 Criar Técnico

**POST** `/api/tecnicos`

Cria um novo técnico/operador no sistema.

### Request Body:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "workday": "OP12345",
  "cargo": "Operador de Máquina CNC",
  "area": "Produção",
  "shift": "PRIMEIRO",
  "machineId": "456e7890-e89b-12d3-a456-426614174001",
  "teamId": "789e0123-e89b-12d3-a456-426614174002",
  "status": "ATIVO",
  "joinDate": "2024-01-15"
}
```

### Campos Obrigatórios:
- `userId`: ID do usuário associado (deve existir na tabela de usuários)
- `workday`: ID único do operador (ex: OP12345)
- `cargo`: Cargo/função (2-255 caracteres)
- `area`: Área de atuação (2-100 caracteres)
- `shift`: Turno (PRIMEIRO, SEGUNDO, TERCEIRO)

### Campos Opcionais:
- `machineId`: ID da máquina atribuída
- `teamId`: ID do time principal
- `status`: Status (padrão: ATIVO)
- `joinDate`: Data de entrada (padrão: data atual)

### Turnos Válidos:
- `PRIMEIRO` - Primeiro turno (manhã)
- `SEGUNDO` - Segundo turno (tarde)
- `TERCEIRO` - Terceiro turno (noite)

### Response (201 Created):
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "workday": "OP12345",
  "cargo": "Operador de Máquina CNC",
  "area": "Produção",
  "shift": "PRIMEIRO",
  "machineId": "456e7890-e89b-12d3-a456-426614174001",
  "teamId": "789e0123-e89b-12d3-a456-426614174002",
  "status": "ATIVO",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "createdAt": "2024-12-12T10:30:00.000Z",
  "updatedAt": "2024-12-12T10:30:00.000Z",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "TECNICO"
  },
  "machine": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "CNC-01",
    "code": "CNC001"
  },
  "team": {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "name": "Time Alpha",
    "department": "Produção"
  }
}
```

---

## 📋 Listar Técnicos

**GET** `/api/tecnicos`

Lista todos os técnicos com paginação e filtros opcionais.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Busca por nome, workday, cargo ou área
- `status` (opcional): Filtrar por status (ATIVO, INATIVO)
- `shift` (opcional): Filtrar por turno (PRIMEIRO, SEGUNDO, TERCEIRO)
- `machineId` (opcional): Filtrar por máquina atribuída
- `teamId` (opcional): Filtrar por time
- `area` (opcional): Filtrar por área
- `sort` (opcional): Campo para ordenação (padrão: workday)
- `order` (opcional): Direção (ASC, DESC) (padrão: ASC)

### Exemplos:
```
GET /api/tecnicos?page=1&limit=20
GET /api/tecnicos?search=João
GET /api/tecnicos?shift=PRIMEIRO&status=ATIVO
GET /api/tecnicos?teamId=789e0123-e89b-12d3-a456-426614174002
GET /api/tecnicos?area=Produção&sort=cargo&order=DESC
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "abc12345-e89b-12d3-a456-426614174003",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "workday": "OP12345",
      "cargo": "Operador de Máquina CNC",
      "area": "Produção",
      "shift": "PRIMEIRO",
      "status": "ATIVO",
      "joinDate": "2024-01-15T00:00:00.000Z",
      "user": {
        "name": "João Silva",
        "email": "joao.silva@empresa.com"
      },
      "machine": {
        "name": "CNC-01",
        "code": "CNC001"
      },
      "team": {
        "name": "Time Alpha",
        "department": "Produção"
      },
      "performanceScore": 85.5,
      "totalEvaluations": 12
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

---

## 🔍 Buscar Técnico por ID

**GET** `/api/tecnicos/:id`

Busca um técnico específico pelo ID com todas as informações relacionadas.

### Response (200 OK):
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "workday": "OP12345",
  "cargo": "Operador de Máquina CNC",
  "area": "Produção",
  "shift": "PRIMEIRO",
  "machineId": "456e7890-e89b-12d3-a456-426614174001",
  "teamId": "789e0123-e89b-12d3-a456-426614174002",
  "status": "ATIVO",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "createdAt": "2024-12-12T10:30:00.000Z",
  "updatedAt": "2024-12-12T10:30:00.000Z",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "TECNICO",
    "status": "ATIVO"
  },
  "machine": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "CNC-01",
    "code": "CNC001",
    "description": "Máquina CNC de Alta Precisão",
    "status": "ATIVO"
  },
  "team": {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "name": "Time Alpha",
    "department": "Produção",
    "managerId": "manager-uuid"
  },
  "subTeams": [
    {
      "id": "subteam-uuid",
      "name": "Sub-time A1",
      "description": "Especialistas em CNC"
    }
  ],
  "skills": [
    {
      "id": "skill-uuid",
      "skillId": "skill-abc",
      "name": "Operação CNC",
      "category": "Técnica",
      "score": 85.0,
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "recentEvaluations": [
    {
      "id": "eval-uuid",
      "period": "2024-Q4",
      "score": 88.5,
      "evaluatedAt": "2024-12-10T14:30:00.000Z",
      "evaluatorName": "Maria Santos"
    }
  ],
  "statistics": {
    "performanceScore": 85.5,
    "totalEvaluations": 12,
    "averageSkillScore": 82.3,
    "daysWorked": 320
  }
}
```

---

## ✏️ Atualizar Técnico

**PATCH** `/api/tecnicos/:id`

Atualiza informações de um técnico existente.

### Request Body (todos os campos opcionais):
```json
{
  "cargo": "Operador Sênior de Máquina CNC",
  "area": "Manutenção",
  "shift": "SEGUNDO",
  "machineId": "nova-maquina-uuid",
  "teamId": "novo-time-uuid",
  "status": "ATIVO"
}
```

### Response (200 OK):
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "workday": "OP12345",
  "cargo": "Operador Sênior de Máquina CNC",
  "area": "Manutenção",
  "shift": "SEGUNDO",
  "status": "ATIVO",
  "updatedAt": "2024-12-12T15:45:00.000Z"
  // ... outros campos
}
```

---

## 🔄 Alternar Status do Técnico

**PATCH** `/api/tecnicos/:id/status`

Ativa ou desativa um técnico no sistema.

### Response (200 OK):
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "workday": "OP12345",
  "status": "INATIVO",
  "updatedAt": "2024-12-12T16:00:00.000Z"
}
```

---

## 🎯 Atribuir Máquina

**PATCH** `/api/tecnicos/:id/machine`

Atribui ou remove uma máquina de um técnico.

### Request Body:
```json
{
  "machineId": "456e7890-e89b-12d3-a456-426614174001"
}
```

Para remover a máquina:
```json
{
  "machineId": null
}
```

### Response (200 OK):
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "machineId": "456e7890-e89b-12d3-a456-426614174001",
  "machine": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "CNC-01",
    "code": "CNC001"
  }
}
```

---

## 👥 Atribuir Time

**PATCH** `/api/tecnicos/:id/team`

Atribui ou remove um técnico de um time.

### Request Body:
```json
{
  "teamId": "789e0123-e89b-12d3-a456-426614174002"
}
```

Para remover do time:
```json
{
  "teamId": null
}
```

---

## 🎓 Gerenciar Habilidades do Técnico

### Listar Habilidades
**GET** `/api/tecnicos/:id/skills`

```json
{
  "data": [
    {
      "id": "tecnico-skill-uuid",
      "skillId": "skill-uuid",
      "name": "Operação CNC",
      "category": "Técnica",
      "score": 85.0,
      "machine": "CNC-01",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "averageScore": 82.5
}
```

### Adicionar Habilidade
**POST** `/api/tecnicos/:id/skills`

```json
{
  "skillId": "skill-uuid",
  "score": 75.0
}
```

### Atualizar Score da Habilidade
**PATCH** `/api/tecnicos/:id/skills/:skillId`

```json
{
  "score": 88.0
}
```

### Remover Habilidade
**DELETE** `/api/tecnicos/:id/skills/:skillId`

---

## 📊 Estatísticas e Performance

### Obter Estatísticas do Técnico
**GET** `/api/tecnicos/:id/statistics`

```json
{
  "performanceScore": 85.5,
  "totalEvaluations": 12,
  "averageSkillScore": 82.3,
  "daysWorked": 320,
  "evaluationsByPeriod": {
    "2024-Q1": 88.0,
    "2024-Q2": 85.5,
    "2024-Q3": 84.2,
    "2024-Q4": 86.5
  },
  "skillsByCategory": {
    "Técnica": 85.0,
    "Segurança": 90.0,
    "Qualidade": 80.5
  },
  "ranking": {
    "overall": 3,
    "inTeam": 1,
    "inShift": 2
  }
}
```

---

## 📈 Histórico de Avaliações

**GET** `/api/tecnicos/:id/evaluations`

Lista todas as avaliações do técnico com paginação.

### Query Parameters:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `period`: Filtrar por período (ex: 2024-Q4)
- `startDate`: Data inicial
- `endDate`: Data final

```json
{
  "data": [
    {
      "id": "eval-uuid",
      "period": "2024-Q4",
      "score": 88.5,
      "productionScore": 90.0,
      "qualityScore": 85.0,
      "safetyScore": 92.0,
      "teamworkScore": 87.0,
      "observations": "Excelente desempenho no trimestre",
      "evaluatedAt": "2024-12-10T14:30:00.000Z",
      "evaluatorId": "evaluator-uuid",
      "evaluator": {
        "name": "Maria Santos",
        "role": "SUPERVISOR"
      }
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 10,
  "totalPages": 2,
  "averageScore": 86.3
}
```

---

## ❌ Excluir Técnico

**DELETE** `/api/tecnicos/:id`

Remove um técnico do sistema (soft delete - mantém registros históricos).

### Response (200 OK):
```json
{
  "message": "Técnico removido com sucesso",
  "id": "abc12345-e89b-12d3-a456-426614174003"
}
```

---

## 🔍 Buscar por Workday

**GET** `/api/tecnicos/workday/:workday`

Busca um técnico pelo ID único (workday).

**Exemplo:** `GET /api/tecnicos/workday/OP12345`

---

## 📊 Rankings e Comparações

### Top Técnicos
**GET** `/api/tecnicos/rankings/top`

```json
{
  "overall": [
    {
      "tecnicoId": "uuid",
      "workday": "OP12345",
      "name": "João Silva",
      "score": 92.5,
      "rank": 1
    }
  ],
  "byShift": {
    "PRIMEIRO": [...],
    "SEGUNDO": [...],
    "TERCEIRO": [...]
  },
  "byTeam": {
    "team-uuid": [...]
  }
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou faltando campos obrigatórios
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão para acessar o recurso
- `404 Not Found` - Técnico não encontrado
- `409 Conflict` - Workday já existe no sistema
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Workday único**: Cada técnico deve ter um workday único no sistema
2. **Relacionamento com User**: Todo técnico deve estar associado a um usuário existente
3. **Soft Delete**: A exclusão não remove fisicamente os dados, apenas muda o status
4. **Histórico**: Todas as avaliações e alterações são mantidas no histórico
5. **Permissões**: 
   - `MASTER`: Acesso total
   - `SUPERVISOR`: Pode gerenciar técnicos de sua área
   - `TECNICO`: Apenas visualização de seus próprios dados
