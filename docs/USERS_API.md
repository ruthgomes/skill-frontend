# API de Usuários - SisOp

## Visão Geral

A API de Usuários gerencia o cadastro e controle de todos os usuários do sistema, incluindo administradores (MASTER), supervisores (SUPERVISOR) e técnicos (TECNICO).

## Estrutura do Usuário

- `id` (UUID) - Identificador único
- `email` (string) - Email único para login
- `password` (string) - Senha hasheada (bcrypt)
- `name` (string) - Nome completo do usuário
- `role` (enum) - Role/Perfil (MASTER, SUPERVISOR, TECNICO)
- `status` (enum) - Status (ATIVO, INATIVO)
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização
- `lastLoginAt` (datetime) - Data do último login
- `tecnico` (objeto) - Dados do técnico (se role = TECNICO)

## Endpoints da API

### Base URL
```
/api/users
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

### 🛡️ Permissões
- **MASTER**: Acesso total a todos os endpoints
- **SUPERVISOR**: Apenas visualização de usuários
- **TECNICO**: Sem acesso (403 Forbidden)

---

## 📝 Criar Usuário

**POST** `/api/users`

Cria um novo usuário no sistema (apenas MASTER).

### Request Body:
```json
{
  "email": "novo.usuario@empresa.com",
  "password": "SenhaSegura123!",
  "name": "Carlos Manager",
  "role": "SUPERVISOR",
  "status": "ATIVO"
}
```

### Campos Obrigatórios:
- `email`: Email único e válido
- `password`: Senha forte (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
- `name`: Nome completo (2-255 caracteres)
- `role`: Role do usuário (MASTER, SUPERVISOR, TECNICO)

### Campos Opcionais:
- `status`: Status (padrão: ATIVO)

### Roles Disponíveis:
- `MASTER` - Acesso total ao sistema
- `SUPERVISOR` - Gerencia técnicos e times de sua área
- `TECNICO` - Operador técnico (requer criação de Técnico associado)

### Response (201 Created):
```json
{
  "id": "user-uuid-456",
  "email": "novo.usuario@empresa.com",
  "name": "Carlos Manager",
  "role": "SUPERVISOR",
  "status": "ATIVO",
  "createdAt": "2024-12-16T10:30:00.000Z",
  "updatedAt": "2024-12-16T10:30:00.000Z",
  "lastLoginAt": null
}
```

### Observações:
- Se `role = TECNICO`, será necessário criar um Técnico associado posteriormente via `/api/tecnicos`
- Email deve ser único no sistema
- Senha é automaticamente hasheada com bcrypt

---

## 📋 Listar Usuários

**GET** `/api/users`

Lista todos os usuários com paginação e filtros.

### Query Parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Busca por nome ou email
- `role` (opcional): Filtrar por role (MASTER, SUPERVISOR, TECNICO)
- `status` (opcional): Filtrar por status (ATIVO, INATIVO)
- `hasLogin` (opcional): true/false - Usuários que já fizeram login
- `sort` (opcional): Campo para ordenação (padrão: name)
- `order` (opcional): Direção (ASC, DESC) (padrão: ASC)

### Exemplos:
```
GET /api/users?page=1&limit=20
GET /api/users?search=carlos
GET /api/users?role=SUPERVISOR&status=ATIVO
GET /api/users?hasLogin=false
```

### Response (200 OK):
```json
{
  "data": [
    {
      "id": "user-uuid-456",
      "email": "carlos.manager@empresa.com",
      "name": "Carlos Manager",
      "role": "SUPERVISOR",
      "status": "ATIVO",
      "lastLoginAt": "2024-12-15T18:30:00.000Z",
      "createdAt": "2024-01-10T10:00:00.000Z",
      "tecnico": null
    },
    {
      "id": "user-uuid-123",
      "email": "joao.silva@empresa.com",
      "name": "João Silva",
      "role": "TECNICO",
      "status": "ATIVO",
      "lastLoginAt": "2024-12-16T08:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "cargo": "Operador de Máquina CNC",
        "team": {
          "name": "Time Alpha"
        }
      }
    }
  ],
  "total": 52,
  "page": 1,
  "limit": 10,
  "totalPages": 6,
  "summary": {
    "totalActive": 48,
    "totalInactive": 4,
    "byRole": {
      "MASTER": 2,
      "SUPERVISOR": 10,
      "TECNICO": 40
    }
  }
}
```

---

## 🔍 Buscar Usuário por ID

**GET** `/api/users/:id`

Busca um usuário específico com todos os detalhes.

### Response (200 OK):
```json
{
  "id": "user-uuid-123",
  "email": "joao.silva@empresa.com",
  "name": "João Silva",
  "role": "TECNICO",
  "status": "ATIVO",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-12-16T08:00:00.000Z",
  "lastLoginAt": "2024-12-16T08:00:00.000Z",
  "tecnico": {
    "id": "tecnico-uuid-1",
    "workday": "OP12345",
    "cargo": "Operador de Máquina CNC",
    "area": "Produção",
    "shift": "PRIMEIRO",
    "status": "ATIVO",
    "team": {
      "id": "team-uuid-123",
      "name": "Time Alpha"
    },
    "machine": {
      "id": "machine-uuid-123",
      "name": "CNC-01",
      "code": "CNC001"
    },
    "performanceScore": 88.5
  },
  "loginHistory": [
    {
      "timestamp": "2024-12-16T08:00:00.000Z",
      "ipAddress": "192.168.1.100",
      "device": "Chrome 120 on Windows 10"
    },
    {
      "timestamp": "2024-12-15T08:00:00.000Z",
      "ipAddress": "192.168.1.100",
      "device": "Chrome 120 on Windows 10"
    }
  ]
}
```

---

## 🔍 Buscar Usuário por Email

**GET** `/api/users/email/:email`

Busca um usuário pelo email.

**Exemplo:** `GET /api/users/email/joao.silva@empresa.com`

---

## ✏️ Atualizar Usuário

**PATCH** `/api/users/:id`

Atualiza informações de um usuário existente (apenas MASTER).

### Request Body (todos os campos opcionais):
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@empresa.com",
  "role": "SUPERVISOR",
  "status": "ATIVO"
}
```

### Regras:
- Não é possível alterar a senha por este endpoint (use `/api/auth/change-password`)
- Alterar role de TECNICO para SUPERVISOR/MASTER remove vínculo com Técnico
- Email deve permanecer único
- Apenas MASTER pode executar

### Response (200 OK):
```json
{
  "id": "user-uuid-123",
  "email": "joao.santos@empresa.com",
  "name": "João Silva Santos",
  "role": "SUPERVISOR",
  "status": "ATIVO",
  "updatedAt": "2024-12-16T14:30:00.000Z"
}
```

---

## 🔄 Alternar Status do Usuário

**PATCH** `/api/users/:id/status`

Ativa ou desativa um usuário (apenas MASTER).

### Request Body (opcional):
```json
{
  "status": "INATIVO",
  "reason": "Saída da empresa"
}
```

### Response (200 OK):
```json
{
  "id": "user-uuid-123",
  "email": "joao.silva@empresa.com",
  "name": "João Silva",
  "status": "INATIVO",
  "updatedAt": "2024-12-16T15:00:00.000Z",
  "statusChangedBy": "admin-uuid",
  "statusReason": "Saída da empresa"
}
```

### Efeitos Colaterais:
- Usuário INATIVO não pode fazer login
- Tokens ativos são invalidados
- Se for TECNICO, o técnico associado também é desativado

---

## 🔑 Redefinir Senha (Admin)

**POST** `/api/users/:id/reset-password`

Redefine a senha de um usuário (apenas MASTER).

### Request Body:
```json
{
  "newPassword": "NovaSenha456!",
  "sendEmail": true
}
```

### Campos:
- `newPassword`: Nova senha (deve atender critérios de segurança)
- `sendEmail`: Enviar email ao usuário com nova senha (padrão: true)

### Response (200 OK):
```json
{
  "message": "Senha redefinida com sucesso",
  "emailSent": true
}
```

---

## 🔐 Alterar Role do Usuário

**PATCH** `/api/users/:id/role`

Altera o role/perfil de um usuário (apenas MASTER).

### Request Body:
```json
{
  "role": "SUPERVISOR",
  "reason": "Promoção a supervisor"
}
```

### Response (200 OK):
```json
{
  "id": "user-uuid-123",
  "email": "joao.silva@empresa.com",
  "name": "João Silva",
  "role": "SUPERVISOR",
  "previousRole": "TECNICO",
  "updatedAt": "2024-12-16T16:00:00.000Z",
  "changedBy": "admin-uuid",
  "reason": "Promoção a supervisor"
}
```

### Observações:
- Alterar de TECNICO para outro role remove vínculo com Técnico
- Alterar para TECNICO requer criação de registro em Técnicos
- Permissões são atualizadas automaticamente

---

## 📊 Estatísticas de Usuários

**GET** `/api/users/statistics`

Retorna estatísticas gerais sobre usuários do sistema.

### Response (200 OK):
```json
{
  "total": 52,
  "active": 48,
  "inactive": 4,
  "byRole": {
    "MASTER": 2,
    "SUPERVISOR": 10,
    "TECNICO": 40
  },
  "withLogin": 45,
  "neverLoggedIn": 7,
  "recentLogins": {
    "last24h": 35,
    "last7days": 48,
    "last30days": 50
  },
  "createdRecently": {
    "last7days": 2,
    "last30days": 5
  }
}
```

---

## 📜 Histórico de Login

**GET** `/api/users/:id/login-history`

Retorna histórico de logins de um usuário.

### Query Parameters:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)

### Response (200 OK):
```json
{
  "userId": "user-uuid-123",
  "userName": "João Silva",
  "logins": [
    {
      "timestamp": "2024-12-16T08:00:00.000Z",
      "ipAddress": "192.168.1.100",
      "device": "Chrome 120 on Windows 10",
      "location": "São Paulo, BR",
      "success": true
    },
    {
      "timestamp": "2024-12-15T18:30:00.000Z",
      "ipAddress": "192.168.1.101",
      "device": "Safari on iPhone",
      "location": "São Paulo, BR",
      "success": true
    },
    {
      "timestamp": "2024-12-15T08:05:00.000Z",
      "ipAddress": "192.168.1.100",
      "device": "Chrome 120 on Windows 10",
      "location": "São Paulo, BR",
      "success": false,
      "reason": "Senha incorreta"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20,
  "summary": {
    "totalLogins": 154,
    "failedAttempts": 2,
    "successRate": 98.7,
    "lastSuccessfulLogin": "2024-12-16T08:00:00.000Z"
  }
}
```

---

## 🔔 Atividades do Usuário

**GET** `/api/users/:id/activities`

Retorna log de atividades/ações do usuário no sistema.

### Query Parameters:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `action`: Filtrar por tipo de ação
- `startDate`: Data inicial
- `endDate`: Data final

### Response (200 OK):
```json
{
  "userId": "user-uuid-123",
  "userName": "João Silva",
  "activities": [
    {
      "id": "activity-uuid-1",
      "action": "EVALUATION_VIEWED",
      "description": "Visualizou avaliação 2024-Q4",
      "timestamp": "2024-12-16T10:30:00.000Z",
      "metadata": {
        "evaluationId": "eval-uuid",
        "period": "2024-Q4"
      }
    },
    {
      "id": "activity-uuid-2",
      "action": "PROFILE_UPDATED",
      "description": "Atualizou informações do perfil",
      "timestamp": "2024-12-15T14:20:00.000Z",
      "metadata": {
        "changedFields": ["name"]
      }
    }
  ],
  "total": 523,
  "page": 1,
  "limit": 20
}
```

---

## 🔍 Buscar Usuários sem Técnico Associado

**GET** `/api/users/without-tecnico`

Lista usuários com role TECNICO mas sem registro em Técnicos associado.

### Response (200 OK):
```json
{
  "users": [
    {
      "id": "user-uuid-789",
      "email": "novo.tecnico@empresa.com",
      "name": "Pedro Novo",
      "role": "TECNICO",
      "status": "ATIVO",
      "createdAt": "2024-12-14T10:00:00.000Z"
    }
  ],
  "total": 3
}
```

---

## 🚮 Excluir Usuário

**DELETE** `/api/users/:id`

Remove um usuário do sistema (apenas MASTER, soft delete).

### Query Parameters:
- `force`: true para exclusão definitiva (padrão: false)

### Regras:
- Por padrão, faz soft delete (marca como INATIVO)
- Se `force=true`, remove definitivamente do banco
- Não é possível excluir o próprio usuário
- Não é possível excluir o último MASTER do sistema
- Se for TECNICO, remove também registro de Técnico associado

### Response (200 OK):
```json
{
  "message": "Usuário removido com sucesso",
  "id": "user-uuid-123",
  "deletedAt": "2024-12-16T17:00:00.000Z"
}
```

---

## 📤 Exportar Lista de Usuários

**GET** `/api/users/export`

Exporta lista de usuários em formato Excel ou CSV.

### Query Parameters:
- `format`: Formato (excel, csv) (padrão: excel)
- `role`: Filtrar por role
- `status`: Filtrar por status
- `includeInactive`: Incluir inativos (true/false)

### Response:
Arquivo para download (.xlsx ou .csv)

---

## 📧 Enviar Notificação para Usuários

**POST** `/api/users/notify`

Envia notificação por email para usuários selecionados (apenas MASTER).

### Request Body:
```json
{
  "userIds": ["user-uuid-1", "user-uuid-2"],
  "subject": "Aviso Importante",
  "message": "Mensagem da notificação...",
  "priority": "NORMAL"
}
```

### Prioridades:
- `LOW` - Baixa prioridade
- `NORMAL` - Normal
- `HIGH` - Alta prioridade
- `URGENT` - Urgente

### Response (200 OK):
```json
{
  "message": "Notificações enviadas com sucesso",
  "sent": 2,
  "failed": 0
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou campos obrigatórios ausentes
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão (apenas MASTER pode gerenciar usuários)
- `404 Not Found` - Usuário não encontrado
- `409 Conflict` - Email já existe no sistema
- `422 Unprocessable Entity` - Senha não atende critérios de segurança
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Relacionamento User-Tecnico**:
   - Todo TECNICO deve ter um User associado
   - User pode existir sem Técnico (MASTER, SUPERVISOR)
   - Relação 1:1 entre User e Tecnico

2. **Hierarquia de Roles**:
   - MASTER: Acesso total
   - SUPERVISOR: Gerencia sua área
   - TECNICO: Operacional

3. **Segurança**:
   - Apenas MASTER pode criar/editar/excluir usuários
   - Senhas sempre hasheadas com bcrypt
   - Tokens invalidados ao desativar usuário

4. **Senha Forte Obrigatória**:
   - Mínimo 8 caracteres
   - Pelo menos 1 maiúscula, 1 minúscula, 1 número, 1 especial

5. **Email Único**: Cada email só pode estar cadastrado uma vez

6. **Auditoria**: Todas as ações administrativas são registradas

7. **Status INATIVO**:
   - Usuário não pode fazer login
   - Tokens são invalidados
   - Dados mantidos no sistema

8. **Não pode excluir**:
   - Próprio usuário logado
   - Último MASTER do sistema
   - Usuário com dados críticos vinculados (avaliações, etc)
