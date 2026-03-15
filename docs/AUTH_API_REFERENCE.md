# API de Autenticação - SkillFix

## 📌 Informações Gerais

- **Base URL**: `http://localhost:3001/api`
- **Prefix**: `/auth`
- **Autenticação**: Bearer Token (JWT)
- **Formato**: JSON

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer {access_token}
```

## 📋 Endpoints

### 1. Registrar Novo Usuário

```http
POST /api/auth/register
```

**Descrição**: Cria uma nova conta de usuário no sistema.

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao.silva@skillfix.com",
  "password": "SenhaSegura123!",
  "role": "TECNICO"
}
```

**Validações**:
- `name`: mínimo 2 caracteres
- `email`: formato válido de email
- `password`: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial (@$!%*?&#)
- `role`: "MASTER" ou "TECNICO"

**Response Success (201)**:
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "9b0c37e7-1af3-43ce-a6c0-9d8d90f004f8",
    "email": "joao.silva@skillfix.com",
    "name": "João Silva",
    "role": "TECNICO",
    "status": "ATIVO",
    "createdAt": "2026-03-10T23:55:11.909Z",
    "updatedAt": "2026-03-10T23:55:11.909Z",
    "lastLogin": null
  }
}
```

**Response Error (400)**:
```json
{
  "statusCode": 400,
  "message": [
    "Email inválido",
    "Senha deve ter no mínimo 8 caracteres",
    "Senha deve conter: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial"
  ],
  "error": "Bad Request"
}
```

**Response Error (409)**:
```json
{
  "statusCode": 409,
  "message": "Email já cadastrado",
  "error": "Conflict"
}
```

---

### 2. Login

```http
POST /api/auth/login
```

**Descrição**: Autentica usuário e retorna tokens de acesso.

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "email": "joao.silva@skillfix.com",
  "password": "SenhaSegura123!"
}
```

**Response Success (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "9b0c37e7-1af3-43ce-a6c0-9d8d90f004f8",
    "email": "joao.silva@skillfix.com",
    "name": "João Silva",
    "role": "TECNICO",
    "status": "ATIVO",
    "createdAt": "2026-03-10T23:55:11.909Z",
    "updatedAt": "2026-03-10T23:55:11.909Z",
    "lastLogin": "2026-03-10T23:58:20.450Z"
  }
}
```

**Response Error (401)**:
```json
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "error": "Unauthorized"
}
```

**Response Error (403)**:
```json
{
  "statusCode": 403,
  "message": "Usuário inativo",
  "error": "Forbidden"
}
```

---

### 3. Renovar Token (Refresh)

```http
POST /api/auth/refresh
```

**Descrição**: Gera novos tokens de acesso usando o refresh token.

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Success (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Response Error (401)**:
```json
{
  "statusCode": 401,
  "message": "Token inválido",
  "error": "Unauthorized"
}
```

---

### 4. Obter Perfil do Usuário

```http
GET /api/auth/me
```

**Descrição**: Retorna os dados do usuário autenticado.

**Headers**:
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response Success (200)**:
```json
{
  "id": "9b0c37e7-1af3-43ce-a6c0-9d8d90f004f8",
  "email": "joao.silva@skillfix.com",
  "name": "João Silva",
  "role": "TECNICO",
  "status": "ATIVO",
  "createdAt": "2026-03-10T23:55:11.909Z",
  "updatedAt": "2026-03-10T23:55:11.909Z",
  "lastLogin": "2026-03-10T23:58:20.450Z"
}
```

**Response Error (401)**:
```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

---

### 5. Alterar Senha

```http
POST /api/auth/change-password
```

**Descrição**: Permite ao usuário alterar sua senha.

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Body**:
```json
{
  "currentPassword": "SenhaSegura123!",
  "newPassword": "NovaSenhaSegura456!",
  "confirmPassword": "NovaSenhaSegura456!"
}
```

**Validações**:
- `newPassword`: deve atender aos mesmos critérios do registro
- `confirmPassword`: deve ser igual a `newPassword`

**Response Success (200)**:
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Response Error (400)**:
```json
{
  "statusCode": 400,
  "message": "As senhas não coincidem",
  "error": "Bad Request"
}
```

**Response Error (401)**:
```json
{
  "statusCode": 401,
  "message": "Senha atual incorreta",
  "error": "Unauthorized"
}
```

---

### 6. Logout

```http
POST /api/auth/logout
```

**Descrição**: Realiza o logout do usuário (atualiza lastLogin).

**Headers**:
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response Success (200)**:
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🔑 Estrutura dos Tokens JWT

### Access Token
- **Validade**: 1 hora
- **Payload**:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "TECNICO",
  "iat": 1773186920,
  "exp": 1773190520
}
```

### Refresh Token
- **Validade**: 7 dias
- **Payload**: (mesmo formato do access token)

---

## 🛡️ Roles (Permissões)

- **MASTER**: Administrador com acesso total
- **TECNICO**: Técnico com acesso limitado

---

## 🚨 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: email duplicado) |
| 500 | Internal Server Error - Erro no servidor |

---

## 📝 Exemplos de Integração

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Configurar cliente axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Registro
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 2. Login
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { access_token, refresh_token, user } = response.data;
  
  // Armazenar tokens
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  
  return { user };
};

// 3. Obter perfil
export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 4. Renovar token
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  const response = await api.post('/auth/refresh', { refreshToken: refresh_token });
  
  const { access_token, refresh_token: newRefreshToken } = response.data;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', newRefreshToken);
  
  return response.data;
};

// 5. Alterar senha
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.post('/auth/change-password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

// 6. Logout
export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
```

### React Hook Exemplo

```typescript
import { useState, useEffect } from 'react';
import { getProfile } from './api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await getProfile();
          setUser(userData);
        }
      } catch (err) {
        setError(err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, error };
};
```

### Tratamento de Erros 401 (Token Expirado)

```typescript
// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { access_token } = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirecionar para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🧪 Testando com cURL

```bash
# 1. Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@skillfix.com","password":"Senha@123","role":"TECNICO"}'

# 2. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@skillfix.com","password":"Senha@123"}'

# 3. Obter perfil (substitua TOKEN)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# 4. Renovar token
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"REFRESH_TOKEN"}'

# 5. Alterar senha
curl -X POST http://localhost:3001/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"currentPassword":"Senha@123","newPassword":"NovaSenha@456","confirmPassword":"NovaSenha@456"}'

# 6. Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Documentação Swagger

Acesse a documentação interativa completa em:
```
http://localhost:3001/api/docs
```

---

## 🔒 Boas Práticas de Segurança

1. **Armazenamento de Tokens**:
   - Use `localStorage` ou `sessionStorage` para SPAs
   - Para maior segurança, considere cookies HttpOnly

2. **Renovação Automática**:
   - Implemente interceptors para renovar tokens automaticamente
   - Redirecione para login quando refresh token expirar

3. **Validação de Senha**:
   - Sempre valide no front-end antes de enviar
   - Backend já valida, mas UX é melhor com validação prévia

4. **Tratamento de Erros**:
   - Exiba mensagens amigáveis ao usuário
   - Não exponha detalhes técnicos de erros

5. **Logout**:
   - Sempre limpe tokens do storage no logout
   - Redirecione para página de login

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Swagger: http://localhost:3001/api/docs
- Código fonte: `src/auth/`
