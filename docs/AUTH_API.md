# API de Autenticação e Autorização - SisOp

## Visão Geral

A API de Autenticação gerencia login, registro, tokens JWT, refresh tokens e controle de acesso baseado em roles (RBAC - Role-Based Access Control).

## Roles do Sistema

- **MASTER**: Acesso total ao sistema, gerenciamento completo
- **SUPERVISOR**: Gerencia técnicos e times de sua área, aprova avaliações
- **TECNICO**: Acesso limitado aos próprios dados e visualizações

## Estrutura do Usuário

- `id` (UUID) - Identificador único
- `email` (string) - Email único para login
- `password` (string) - Senha hasheada (bcrypt)
- `name` (string) - Nome completo
- `role` (enum) - Role/Perfil (MASTER, SUPERVISOR, TECNICO)
- `status` (enum) - Status (ATIVO, INATIVO)
- `createdAt` (datetime) - Data de criação
- `updatedAt` (datetime) - Data de atualização
- `lastLoginAt` (datetime) - Data do último login

## Endpoints da API

### Base URL
```
/api/auth
```

---

## 🔐 Login

**POST** `/api/auth/login`

Realiza login e retorna tokens de acesso.

### Request Body:
```json
{
  "email": "joao.silva@empresa.com",
  "password": "SenhaSegura123!"
}
```

### Campos Obrigatórios:
- `email`: Email válido cadastrado no sistema
- `password`: Senha (mínimo 8 caracteres)

### Response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user-uuid-123",
    "email": "joao.silva@empresa.com",
    "name": "João Silva",
    "role": "TECNICO",
    "status": "ATIVO",
    "lastLoginAt": "2024-12-16T10:00:00.000Z",
    "tecnico": {
      "id": "tecnico-uuid-1",
      "workday": "OP12345",
      "cargo": "Operador de Máquina CNC",
      "team": {
        "id": "team-uuid-123",
        "name": "Time Alpha"
      }
    }
  },
  "permissions": {
    "tecnicos": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "avaliacoes": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "teams": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "machines": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "skills": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false
    },
    "analytics": {
      "view": true,
      "viewAll": false
    }
  }
}
```

### Erros Comuns:
- `401 Unauthorized` - Credenciais inválidas
- `403 Forbidden` - Usuário inativo
- `429 Too Many Requests` - Muitas tentativas de login

---

## 🔄 Refresh Token

**POST** `/api/auth/refresh`

Renova o access token usando o refresh token.

### Request Body:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Erros:
- `401 Unauthorized` - Refresh token inválido ou expirado

---

## 🚪 Logout

**POST** `/api/auth/logout`

Realiza logout e invalida os tokens.

### Headers:
```
Authorization: Bearer {access_token}
```

### Request Body:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200 OK):
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 📝 Registro de Usuário

**POST** `/api/auth/register`

Registra um novo usuário no sistema (apenas MASTER pode executar).

### Headers:
```
Authorization: Bearer {access_token}
```

### Request Body:
```json
{
  "email": "novo.usuario@empresa.com",
  "password": "SenhaSegura123!",
  "name": "Novo Usuário",
  "role": "TECNICO",
  "status": "ATIVO"
}
```

### Regras de Senha:
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial (!@#$%^&*)

### Response (201 Created):
```json
{
  "id": "user-uuid-456",
  "email": "novo.usuario@empresa.com",
  "name": "Novo Usuário",
  "role": "TECNICO",
  "status": "ATIVO",
  "createdAt": "2024-12-16T10:30:00.000Z"
}
```

---

## 👤 Perfil do Usuário

### Obter Perfil Atual
**GET** `/api/auth/me`

Retorna informações do usuário autenticado.

### Headers:
```
Authorization: Bearer {access_token}
```

### Response (200 OK):
```json
{
  "id": "user-uuid-123",
  "email": "joao.silva@empresa.com",
  "name": "João Silva",
  "role": "TECNICO",
  "status": "ATIVO",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "lastLoginAt": "2024-12-16T10:00:00.000Z",
  "tecnico": {
    "id": "tecnico-uuid-1",
    "workday": "OP12345",
    "cargo": "Operador de Máquina CNC",
    "area": "Produção",
    "shift": "PRIMEIRO",
    "team": {
      "id": "team-uuid-123",
      "name": "Time Alpha"
    },
    "machine": {
      "id": "machine-uuid-123",
      "name": "CNC-01"
    },
    "performanceScore": 88.5
  }
}
```

### Atualizar Perfil
**PATCH** `/api/auth/me`

Atualiza informações do perfil (nome).

### Request Body:
```json
{
  "name": "João Silva Santos"
}
```

---

## 🔑 Gerenciamento de Senha

### Alterar Senha
**POST** `/api/auth/change-password`

Altera a senha do usuário autenticado.

### Headers:
```
Authorization: Bearer {access_token}
```

### Request Body:
```json
{
  "currentPassword": "SenhaAtual123!",
  "newPassword": "NovaSenha456!",
  "confirmPassword": "NovaSenha456!"
}
```

### Response (200 OK):
```json
{
  "message": "Senha alterada com sucesso"
}
```

### Recuperar Senha (Forgot Password)
**POST** `/api/auth/forgot-password`

Envia email com link para redefinir senha.

### Request Body:
```json
{
  "email": "joao.silva@empresa.com"
}
```

### Response (200 OK):
```json
{
  "message": "Email de recuperação enviado com sucesso"
}
```

### Redefinir Senha
**POST** `/api/auth/reset-password`

Redefine a senha usando o token recebido por email.

### Request Body:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NovaSenha789!",
  "confirmPassword": "NovaSenha789!"
}
```

### Response (200 OK):
```json
{
  "message": "Senha redefinida com sucesso"
}
```

---

## 🛡️ Controle de Acesso (Permissões)

### Matriz de Permissões por Role

#### MASTER
- **Usuários**: Criar, visualizar, editar, excluir
- **Técnicos**: Acesso total
- **Avaliações**: Criar, visualizar, editar, aprovar, rejeitar, excluir
- **Times**: Acesso total
- **Máquinas**: Acesso total
- **Habilidades**: Acesso total
- **Analytics**: Acesso total (todos os dados)

#### SUPERVISOR
- **Usuários**: Apenas visualizar de sua área
- **Técnicos**: Criar, visualizar, editar técnicos de sua área
- **Avaliações**: Criar, visualizar, editar avaliações de sua área
- **Times**: Visualizar todos, editar apenas seus times
- **Máquinas**: Visualizar todas, editar de sua área
- **Habilidades**: Avaliar técnicos de sua área
- **Analytics**: Visualizar dados de sua área/time

#### TECNICO
- **Usuários**: Apenas seu próprio perfil
- **Técnicos**: Apenas seus próprios dados
- **Avaliações**: Apenas suas próprias avaliações (read-only)
- **Times**: Visualizar seus times
- **Máquinas**: Visualizar máquinas atribuídas
- **Habilidades**: Visualizar suas próprias habilidades
- **Analytics**: Apenas suas próprias estatísticas

---

## 🔐 Verificação de Permissões

### Verificar Permissão
**POST** `/api/auth/check-permission`

Verifica se o usuário tem permissão específica.

### Headers:
```
Authorization: Bearer {access_token}
```

### Request Body:
```json
{
  "resource": "avaliacoes",
  "action": "create"
}
```

### Response (200 OK):
```json
{
  "hasPermission": true,
  "resource": "avaliacoes",
  "action": "create",
  "role": "SUPERVISOR"
}
```

### Recursos e Ações:
- **Recursos**: users, tecnicos, avaliacoes, teams, machines, skills, analytics
- **Ações**: view, create, update, delete, approve, reject

---

## 📊 Sessões Ativas

### Listar Sessões Ativas
**GET** `/api/auth/sessions`

Lista todas as sessões ativas do usuário.

### Headers:
```
Authorization: Bearer {access_token}
```

### Response (200 OK):
```json
{
  "sessions": [
    {
      "id": "session-uuid-1",
      "deviceInfo": "Chrome 120 on Windows 10",
      "ipAddress": "192.168.1.100",
      "lastActivity": "2024-12-16T10:00:00.000Z",
      "current": true
    },
    {
      "id": "session-uuid-2",
      "deviceInfo": "Safari on iPhone",
      "ipAddress": "192.168.1.101",
      "lastActivity": "2024-12-15T18:30:00.000Z",
      "current": false
    }
  ],
  "total": 2
}
```

### Revogar Sessão
**DELETE** `/api/auth/sessions/:id`

Revoga uma sessão específica.

### Response (200 OK):
```json
{
  "message": "Sessão revogada com sucesso"
}
```

### Revogar Todas as Sessões (exceto a atual)
**DELETE** `/api/auth/sessions/all`

```json
{
  "message": "Todas as sessões foram revogadas",
  "count": 3
}
```

---

## 🔒 Segurança

### Configurações JWT
- **Access Token**: Expira em 1 hora (3600 segundos)
- **Refresh Token**: Expira em 7 dias
- **Algoritmo**: HS256 (HMAC SHA-256)
- **Secret**: Armazenado em variável de ambiente

### Rate Limiting
- **Login**: Máximo 5 tentativas a cada 15 minutos
- **API Requests**: 100 requests por minuto por usuário
- **Password Reset**: Máximo 3 emails por hora

### Auditoria
Todas as ações de autenticação são registradas:
- Login (sucesso/falha)
- Logout
- Alteração de senha
- Acesso negado
- Tokens revogados

### Headers de Segurança
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 📱 Integração com Frontend

### Fluxo de Autenticação

1. **Login**
   ```javascript
   POST /api/auth/login
   → Recebe access_token e refresh_token
   → Armazena tokens (localStorage/sessionStorage)
   → Redireciona para dashboard
   ```

2. **Requisições Autenticadas**
   ```javascript
   GET /api/tecnicos
   Header: Authorization: Bearer {access_token}
   ```

3. **Token Expirado**
   ```javascript
   Response: 401 Unauthorized
   → Tenta renovar com refresh_token
   POST /api/auth/refresh
   → Se sucesso: continua
   → Se falha: redireciona para login
   ```

4. **Logout**
   ```javascript
   POST /api/auth/logout
   → Remove tokens do storage
   → Redireciona para login
   ```

### Exemplo de Implementação (JavaScript)

```javascript
// Login
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data.user;
  }
  throw new Error('Login failed');
}

// Fazer requisição autenticada
async function authenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expirado, tenta renovar
    const newToken = await refreshToken();
    if (newToken) {
      // Tenta novamente com novo token
      return authenticatedRequest(url, options);
    }
    // Falhou, redireciona para login
    window.location.href = '/login';
  }
  
  return response;
}

// Renovar token
async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token');
  
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data.access_token;
  }
  
  return null;
}

// Logout
async function logout() {
  const token = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');
  
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refresh })
  });
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Dados inválidos ou campos obrigatórios ausentes
- `401 Unauthorized` - Token inválido, expirado ou credenciais incorretas
- `403 Forbidden` - Sem permissão para acessar o recurso
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Tokens**: Sempre armazene tokens de forma segura (httpOnly cookies em produção)
2. **HTTPS**: Use sempre HTTPS em produção
3. **Refresh Token**: Rotação automática de refresh tokens para maior segurança
4. **Session Management**: Múltiplas sessões simultâneas são permitidas
5. **Password Policy**: Senhas fortes são obrigatórias
6. **Rate Limiting**: Implementado para prevenir ataques de força bruta
7. **Auditoria**: Todos os eventos de autenticação são registrados
8. **Roles**: Sistema baseado em roles (RBAC) para controle de acesso granular
