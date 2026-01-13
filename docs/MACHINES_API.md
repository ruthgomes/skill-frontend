# API de Máquinas - SisOp

## Visão Geral

A API de Máquinas gerencia o cadastro e controle das máquinas/equipamentos do sistema, suas relações com técnicos, habilidades específicas e histórico de operação.

## Estrutura da Máquina

- `id` (UUID) - Identificador único
- `name` (string) - Nome da máquina
- `code` (string) - Código único da máquina
- `description` (text) - Descrição e especificações
- `status` (enum) - Status (ATIVO, INATIVO, MANUTENCAO)
- `createdAt` (datetime) - Data de cadastro
- `updatedAt` (datetime) - Data de atualização

## Endpoints da API

### Base URL
```
/api/machines
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📝 Criar Máquina

**POST** `/api/machines`

Cria uma nova máquina no sistema.

### Request Body:
```json
{
  "name": "CNC-01",
  "code": "CNC001",
  "description": "Máquina CNC de Alta Precisão - Modelo XYZ-3000",
  "manufacturer": "HAAS Automation",
  "model": "VF-3",
  "serialNumber": "12345ABC",
  "acquisitionDate": "2023-01-15",
  "specifications": {
    "power": "15kW",
    "workArea": "762 x 406 x 508 mm",
    "spindleSpeed": "8,100 RPM",
    "toolCapacity": "24"
  },
  "location": "Setor A - Linha 1",
  "status": "ATIVO"
}
```

### Campos Obrigatórios:
- `name`: Nome da máquina (2-100 caracteres)
- `code`: Código único da máquina (2-50 caracteres)

### Campos Opcionais:
- `description`: Descrição detalhada (máximo 2000 caracteres)
- `manufacturer`: Fabricante
- `model`: Modelo
- `serialNumber`: Número de série
- `acquisitionDate`: Data de aquisição
- `specifications`: Especificações técnicas (JSON)
- `location`: Localização física
- `status`: Status (padrão: ATIVO)

### Status Válidos:
- `ATIVO` - Em operação normal
- `INATIVO` - Fora de operação
- `MANUTENCAO` - Em manutenção

### Response (201 Created):
```json
{
  "id": "machine-uuid-123",
  "name": "CNC-01",
  "code": "CNC001",
  "description": "Máquina CNC de Alta Precisão - Modelo XYZ-3000",
  "manufacturer": "HAAS Automation",
  "model": "VF-3",
  "serialNumber": "12345ABC",
  "acquisitionDate": "2023-01-15T00:00:00.000Z",
  "specifications": {
    "power": "15kW",
    "workArea": "762 x 406 x 508 mm",
    "spindleSpeed": "8,100 RPM",
    "toolCapacity": "24"
  },
  "location": "Setor A - Linha 1",
  "status": "ATIVO",
  "createdAt": "2024-12-15T10:00:00.000Z",
  "updatedAt": "2024-12-15T10:00:00.000Z",
  "operatorCount": 0,
  "skillCount": 0
}
```

---

## 📋 Listar Máquinas

**GET** `/api/machines`

Lista todas as máquinas com paginação e filtros.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Busca por nome, código ou fabricante
- `status` (opcional): Filtrar por status (ATIVO, INATIVO, MANUTENCAO)
- `manufacturer` (opcional): Filtrar por fabricante
- `location` (opcional): Filtrar por localização
- `hasOperator` (opcional): true/false - Com ou sem operador atribuído
- `sort` (opcional): Campo para ordenação (padrão: code)
- `order` (opcional): Direção (ASC, DESC) (padrão: ASC)

### Exemplos:
```
GET /api/machines?page=1&limit=20
GET /api/machines?search=CNC
GET /api/machines?status=ATIVO&manufacturer=HAAS
GET /api/machines?hasOperator=false
GET /api/machines?location=Setor A
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "machine-uuid-123",
      "name": "CNC-01",
      "code": "CNC001",
      "description": "Máquina CNC de Alta Precisão",
      "manufacturer": "HAAS Automation",
      "model": "VF-3",
      "status": "ATIVO",
      "location": "Setor A - Linha 1",
      "operatorCount": 2,
      "skillCount": 5,
      "currentOperator": {
        "workday": "OP12345",
        "name": "João Silva"
      },
      "utilizationRate": 87.5,
      "lastMaintenanceDate": "2024-11-15T00:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

## 🔍 Buscar Máquina por ID

**GET** `/api/machines/:id`

Busca uma máquina específica com todos os detalhes.

### Response (200 OK):
```json
{
  "id": "machine-uuid-123",
  "name": "CNC-01",
  "code": "CNC001",
  "description": "Máquina CNC de Alta Precisão - Modelo XYZ-3000",
  "manufacturer": "HAAS Automation",
  "model": "VF-3",
  "serialNumber": "12345ABC",
  "acquisitionDate": "2023-01-15T00:00:00.000Z",
  "specifications": {
    "power": "15kW",
    "workArea": "762 x 406 x 508 mm",
    "spindleSpeed": "8,100 RPM",
    "toolCapacity": "24"
  },
  "location": "Setor A - Linha 1",
  "status": "ATIVO",
  "createdAt": "2024-12-15T10:00:00.000Z",
  "updatedAt": "2024-12-15T10:00:00.000Z",
  "operators": [
    {
      "id": "tecnico-uuid-1",
      "workday": "OP12345",
      "user": {
        "name": "João Silva",
        "email": "joao@empresa.com"
      },
      "cargo": "Operador de Máquina CNC",
      "shift": "PRIMEIRO",
      "status": "ATIVO",
      "performanceScore": 88.5
    }
  ],
  "skills": [
    {
      "id": "skill-uuid-1",
      "name": "Operação Básica CNC",
      "category": "Técnica",
      "description": "Conhecimento básico de operação da máquina CNC"
    },
    {
      "id": "skill-uuid-2",
      "name": "Setup e Calibração",
      "category": "Técnica Avançada",
      "description": "Configuração e calibração da máquina"
    }
  ],
  "maintenanceHistory": [
    {
      "date": "2024-11-15T00:00:00.000Z",
      "type": "Preventiva",
      "description": "Manutenção preventiva trimestral",
      "technician": "Carlos Manutenção"
    }
  ],
  "statistics": {
    "totalOperators": 2,
    "averagePerformance": 86.5,
    "utilizationRate": 87.5,
    "totalOperatingHours": 2340,
    "lastOperationDate": "2024-12-15T18:30:00.000Z"
  }
}
```

---

## 🔍 Buscar por Código

**GET** `/api/machines/code/:code`

Busca uma máquina pelo código único.

**Exemplo:** `GET /api/machines/code/CNC001`

---

## ✏️ Atualizar Máquina

**PATCH** `/api/machines/:id`

Atualiza informações de uma máquina existente.

### Request Body (todos os campos opcionais):
```json
{
  "name": "CNC-01 (Reformada)",
  "description": "Máquina CNC de Alta Precisão - Reformada em 2024",
  "location": "Setor A - Linha 2",
  "status": "ATIVO",
  "specifications": {
    "power": "18kW",
    "workArea": "762 x 406 x 508 mm",
    "spindleSpeed": "10,000 RPM",
    "toolCapacity": "32"
  }
}
```

### Response (200 OK):
```json
{
  "id": "machine-uuid-123",
  "name": "CNC-01 (Reformada)",
  "description": "Máquina CNC de Alta Precisão - Reformada em 2024",
  "location": "Setor A - Linha 2",
  "status": "ATIVO",
  "specifications": {
    "power": "18kW",
    "workArea": "762 x 406 x 508 mm",
    "spindleSpeed": "10,000 RPM",
    "toolCapacity": "32"
  },
  "updatedAt": "2024-12-15T14:30:00.000Z"
}
```

---

## 🔄 Alterar Status da Máquina

**PATCH** `/api/machines/:id/status`

Altera o status da máquina.

### Request Body:
```json
{
  "status": "MANUTENCAO",
  "reason": "Manutenção preventiva agendada",
  "expectedReturnDate": "2024-12-20"
}
```

### Response (200 OK):
```json
{
  "id": "machine-uuid-123",
  "code": "CNC001",
  "status": "MANUTENCAO",
  "statusChangedAt": "2024-12-15T15:00:00.000Z",
  "statusReason": "Manutenção preventiva agendada",
  "expectedReturnDate": "2024-12-20T00:00:00.000Z"
}
```

---

## 👤 Gerenciar Operadores da Máquina

### Listar Operadores
**GET** `/api/machines/:id/operators`

```json
{
  "machineId": "machine-uuid-123",
  "machineName": "CNC-01",
  "machineCode": "CNC001",
  "operators": [
    {
      "id": "tecnico-uuid-1",
      "workday": "OP12345",
      "user": {
        "name": "João Silva",
        "email": "joao@empresa.com"
      },
      "cargo": "Operador de Máquina CNC",
      "shift": "PRIMEIRO",
      "status": "ATIVO",
      "assignedDate": "2024-01-15T00:00:00.000Z",
      "performanceScore": 88.5,
      "totalOperatingHours": 1200,
      "skills": [
        {
          "name": "Operação Básica CNC",
          "score": 90.0
        }
      ]
    }
  ],
  "total": 2,
  "byShift": {
    "PRIMEIRO": 1,
    "SEGUNDO": 1,
    "TERCEIRO": 0
  }
}
```

### Atribuir Operador
**POST** `/api/machines/:id/operators`

```json
{
  "tecnicoId": "tecnico-uuid-1"
}
```

**Response:**
```json
{
  "message": "Operador atribuído à máquina com sucesso",
  "machineId": "machine-uuid-123",
  "tecnicoId": "tecnico-uuid-1"
}
```

### Remover Operador
**DELETE** `/api/machines/:id/operators/:tecnicoId`

```json
{
  "message": "Operador removido da máquina com sucesso",
  "machineId": "machine-uuid-123",
  "tecnicoId": "tecnico-uuid-1"
}
```

---

## 🎓 Gerenciar Habilidades da Máquina

### Listar Habilidades
**GET** `/api/machines/:id/skills`

```json
{
  "machineId": "machine-uuid-123",
  "machineName": "CNC-01",
  "skills": [
    {
      "id": "skill-uuid-1",
      "name": "Operação Básica CNC",
      "category": "Técnica",
      "description": "Conhecimento básico de operação da máquina CNC",
      "techniciansWithSkill": 5,
      "averageScore": 85.0
    },
    {
      "id": "skill-uuid-2",
      "name": "Setup e Calibração",
      "category": "Técnica Avançada",
      "description": "Configuração e calibração da máquina",
      "techniciansWithSkill": 2,
      "averageScore": 82.0
    }
  ],
  "total": 5
}
```

### Adicionar Habilidade
**POST** `/api/machines/:id/skills`

```json
{
  "name": "Programação CNC Avançada",
  "category": "Programação",
  "description": "Programação de operações complexas na máquina CNC"
}
```

**Response (201 Created):**
```json
{
  "id": "skill-uuid-3",
  "name": "Programação CNC Avançada",
  "category": "Programação",
  "description": "Programação de operações complexas na máquina CNC",
  "machineId": "machine-uuid-123",
  "createdAt": "2024-12-15T11:00:00.000Z"
}
```

### Atualizar Habilidade
**PATCH** `/api/machines/:id/skills/:skillId`

```json
{
  "name": "Programação CNC Master",
  "description": "Nível expert em programação CNC"
}
```

### Remover Habilidade
**DELETE** `/api/machines/:id/skills/:skillId`

---

## 🔧 Histórico de Manutenção

### Listar Manutenções
**GET** `/api/machines/:id/maintenance`

```json
{
  "machineId": "machine-uuid-123",
  "machineName": "CNC-01",
  "maintenanceHistory": [
    {
      "id": "maint-uuid-1",
      "date": "2024-11-15T00:00:00.000Z",
      "type": "Preventiva",
      "description": "Manutenção preventiva trimestral",
      "technician": "Carlos Manutenção",
      "duration": 4,
      "cost": 1500.00,
      "status": "Concluída"
    },
    {
      "id": "maint-uuid-2",
      "date": "2024-08-10T00:00:00.000Z",
      "type": "Corretiva",
      "description": "Substituição de rolamento",
      "technician": "Pedro Técnico",
      "duration": 6,
      "cost": 2800.00,
      "status": "Concluída"
    }
  ],
  "total": 12,
  "statistics": {
    "totalMaintenances": 12,
    "preventiveCount": 8,
    "correctiveCount": 4,
    "totalCost": 18500.00,
    "totalDowntime": 48,
    "nextScheduledMaintenance": "2025-02-15T00:00:00.000Z"
  }
}
```

### Registrar Manutenção
**POST** `/api/machines/:id/maintenance`

```json
{
  "date": "2024-12-15",
  "type": "Preventiva",
  "description": "Troca de óleo e lubrificação geral",
  "technician": "Carlos Manutenção",
  "duration": 3,
  "cost": 800.00,
  "parts": [
    {
      "name": "Óleo hidráulico",
      "quantity": 5,
      "cost": 150.00
    }
  ]
}
```

**Tipos de Manutenção:**
- `Preventiva` - Manutenção programada
- `Corretiva` - Reparo de falha
- `Preditiva` - Baseada em análise de dados
- `Emergencial` - Urgente

---

## 📊 Estatísticas da Máquina

### Estatísticas Gerais
**GET** `/api/machines/:id/statistics`

```json
{
  "machineId": "machine-uuid-123",
  "machineName": "CNC-01",
  "period": "2024-Q4",
  "operational": {
    "totalOperatingHours": 2340,
    "utilizationRate": 87.5,
    "downtime": 156,
    "availability": 93.8
  },
  "operators": {
    "total": 2,
    "averagePerformance": 86.5,
    "averageSkillScore": 84.2
  },
  "maintenance": {
    "totalMaintenances": 12,
    "preventiveCount": 8,
    "correctiveCount": 4,
    "totalCost": 18500.00,
    "mtbf": 195,
    "mttr": 4.5
  },
  "performance": {
    "productivity": 92.3,
    "quality": 96.5,
    "efficiency": 88.7
  }
}
```

**Métricas:**
- `utilizationRate`: Taxa de utilização (%)
- `availability`: Disponibilidade (%)
- `mtbf`: Tempo médio entre falhas (horas)
- `mttr`: Tempo médio de reparo (horas)

### Performance por Período
**GET** `/api/machines/:id/performance`

Query Parameters:
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `groupBy`: Agrupar por (day, week, month, quarter)

```json
{
  "machineId": "machine-uuid-123",
  "startDate": "2024-10-01",
  "endDate": "2024-12-31",
  "data": [
    {
      "period": "2024-10",
      "operatingHours": 720,
      "utilizationRate": 85.5,
      "downtime": 52,
      "maintenanceCount": 1
    },
    {
      "period": "2024-11",
      "operatingHours": 780,
      "utilizationRate": 89.2,
      "downtime": 48,
      "maintenanceCount": 2
    },
    {
      "period": "2024-12",
      "operatingHours": 840,
      "utilizationRate": 87.8,
      "downtime": 56,
      "maintenanceCount": 1
    }
  ],
  "averages": {
    "utilizationRate": 87.5,
    "downtime": 52
  }
}
```

---

## 📈 Comparar Máquinas

**GET** `/api/machines/compare`

Query Parameters:
- `machineIds`: IDs das máquinas separados por vírgula
- `period`: Período para comparação (ex: 2024-Q4)

```json
{
  "period": "2024-Q4",
  "comparison": [
    {
      "machineId": "machine-uuid-123",
      "machineName": "CNC-01",
      "code": "CNC001",
      "utilizationRate": 87.5,
      "operatingHours": 2340,
      "downtime": 156,
      "maintenanceCost": 4500.00,
      "operatorCount": 2,
      "averagePerformance": 86.5
    },
    {
      "machineId": "machine-uuid-456",
      "machineName": "CNC-02",
      "code": "CNC002",
      "utilizationRate": 84.2,
      "operatingHours": 2250,
      "downtime": 182,
      "maintenanceCost": 5200.00,
      "operatorCount": 2,
      "averagePerformance": 84.1
    }
  ]
}
```

---

## 🏆 Rankings de Máquinas

**GET** `/api/machines/rankings`

Query Parameters:
- `period`: Período (ex: 2024-Q4)
- `metric`: Métrica (utilization, performance, efficiency)
- `limit`: Número de máquinas (padrão: 10)

```json
{
  "period": "2024-Q4",
  "metric": "utilization",
  "rankings": [
    {
      "rank": 1,
      "machineId": "machine-uuid-123",
      "machineName": "CNC-01",
      "code": "CNC001",
      "value": 87.5,
      "operatingHours": 2340
    }
  ],
  "totalMachines": 25
}
```

---

## ❌ Excluir Máquina

**DELETE** `/api/machines/:id`

Remove uma máquina do sistema.

### Regras:
- Apenas máquinas sem operadores atribuídos podem ser excluídas
- Máquinas com histórico são apenas desativadas (soft delete)
- Habilidades associadas são removidas

### Response (200 OK):
```json
{
  "message": "Máquina removida com sucesso",
  "id": "machine-uuid-123"
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou campos obrigatórios ausentes
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão para gerenciar máquinas
- `404 Not Found` - Máquina não encontrada
- `409 Conflict` - Código da máquina já existe ou possui operadores atribuídos
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Código Único**: Cada máquina deve ter um código único no sistema
2. **Status**: Controla disponibilidade e permite rastreamento de manutenção
3. **Operadores**: Múltiplos operadores podem ser atribuídos (por turno)
4. **Habilidades**: Definem competências necessárias para operar a máquina
5. **Manutenção**: Histórico completo de manutenções preventivas e corretivas
6. **Métricas**: MTBF, MTTR, utilização e disponibilidade são calculadas automaticamente
7. **Permissões**:
   - `MASTER`: Acesso total a todas as máquinas
   - `SUPERVISOR`: Pode gerenciar máquinas de sua área
   - `TECNICO`: Visualiza apenas máquinas atribuídas
8. **Especificações**: Armazenadas como JSON para flexibilidade
