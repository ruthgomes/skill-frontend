# API Routes (Proxy Layer)

Esta pasta contém os **API Route Handlers** do Next.js que atuam como **proxy** entre o frontend e o backend real.

## 📁 Estrutura

```
app/api/
├── lib/
│   └── backend-client.ts    # Helper para chamadas ao backend
├── auth/
│   ├── login/route.ts       # POST /api/auth/login
│   ├── logout/route.ts      # POST /api/auth/logout
│   ├── me/route.ts          # GET /api/auth/me
│   └── refresh/route.ts     # POST /api/auth/refresh
├── tecnicos/
│   ├── route.ts             # GET /api/tecnicos | POST /api/tecnicos
│   ├── with-photo/          # POST /api/tecnicos/with-photo
│   └── [id]/
│       ├── route.ts         # GET | PATCH | DELETE /api/tecnicos/:id
│       └── photo/
│           └── route.ts     # POST | DELETE /api/tecnicos/:id/photo
├── teams/
│   ├── route.ts             # GET /api/teams | POST /api/teams
│   └── [id]/
│       ├── route.ts         # GET | PATCH | DELETE /api/teams/:id
│       ├── subtimes/        # GET /api/teams/:id/subtimes
│       └── members/         # GET /api/teams/:id/members
├── users/
│   ├── route.ts             # GET /api/users | POST /api/users
│   └── [id]/route.ts        # GET | PATCH | DELETE /api/users/:id
├── subtimes/
│   ├── route.ts             # GET /api/subtimes | POST /api/subtimes
│   └── [id]/route.ts        # GET | PATCH | DELETE /api/subtimes/:id
├── evaluations/
│   ├── route.ts             # GET /api/evaluations | POST /api/evaluations
│   └── [id]/route.ts        # GET | PATCH | DELETE /api/evaluations/:id
├── machines/
│   ├── route.ts             # GET /api/machines | POST /api/machines
│   └── [id]/route.ts        # GET | PATCH | DELETE /api/machines/:id
├── skills/
│   ├── route.ts             # GET /api/skills | POST /api/skills
│   └── [id]/route.ts        # GET | PATCH | DELETE /api/skills/:id
├── quarterly-notes/
│   ├── route.ts             # GET /api/quarterly-notes | POST /api/quarterly-notes
│   └── [id]/route.ts        # GET | PATCH | DELETE /api/quarterly-notes/:id
└── analytics/
    └── route.ts             # GET /api/analytics
```

## 🎯 Benefícios

### 1. **Segurança**
- Oculta URLs e credenciais do backend
- Tokens gerenciados via **cookies HTTPOnly**
- Backend não exposto diretamente ao cliente

### 2. **Centralização**
- Ponto único para autenticação e headers
- Facilita logging e monitoramento
- Tratamento de erros padronizado

### 3. **Flexibilidade**
- Fácil troca de backend sem alterar frontend
- Possibilidade de cache e transformações
- Versão da API controlada

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# URL do backend real
BACKEND_URL=http://localhost:3000

# Prefixo da API do backend
BACKEND_API_PREFIX=/api/v1
```

## 🔐 Autenticação

Os tokens são gerenciados automaticamente via **cookies HTTPOnly**:

```typescript
// No login, os tokens são armazenados em cookies
cookieStore.set('access_token', data.access_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24 horas
})
```

### Fluxo de Autenticação

1. **Login**: POST `/api/auth/login`
   - Recebe credenciais
   - Chama backend
   - Armazena tokens em cookies

2. **Requisições Autenticadas**
   - Token extraído automaticamente do cookie
   - Enviado ao backend via header Authorization

3. **Refresh Token**: POST `/api/auth/refresh`
   - Renovação automática pelo interceptor do axios
   - Atualiza cookies com novos tokens

4. **Logout**: POST `/api/auth/logout`
   - Remove cookies
   - Invalida sessão

## 📝 Como Usar nos Serviços

Os serviços já foram atualizados para usar as rotas proxy:

```typescript
// core/services/api-client.ts
const apiClient = axios.create({
  baseURL: '/api',  // Aponta para as rotas locais
  withCredentials: true,  // Envia cookies automaticamente
})

// core/services/tecnicos.service.ts
async findAll(params?: TecnicoQueryParams) {
  const response = await apiClient.get('/tecnicos', { params })
  return response.data
}
```

## 🔄 Fluxo de Requisição

```
Frontend Service
    ↓
Axios Client (baseURL: /api)
    ↓
Next.js API Route (/app/api/tecnicos/route.ts)
    ↓
Backend Client Helper (backend-client.ts)
    ↓
Backend Real (http://localhost:3000/api/v1/tecnicos)
    ↓
Resposta processada
    ↓
Retorna ao Frontend
```

## 📦 Exemplo de Route Handler

```typescript
// app/api/tecnicos/route.ts
import { NextRequest } from 'next/server'
import { backendFetch, createErrorResponse, extractSearchParams } from '@/app/api/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request)
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/tecnicos?${queryString}` : '/tecnicos'

    const data = await backendFetch(endpoint, { method: 'GET' })
    return Response.json(data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
```

## 🛠️ Helper: backend-client.ts

Funções utilitárias para facilitar desenvolvimento:

- **backendFetch**: Faz requisição ao backend com autenticação automática
- **createErrorResponse**: Cria resposta de erro padronizada
- **parseRequestBody**: Valida e parseia body da requisição
- **extractSearchParams**: Extrai query params da URL

## 🚀 Deploy

Em produção, configure:

```bash
# .env.production
BACKEND_URL=https://api.skillfix.com
BACKEND_API_PREFIX=/api/v1
NODE_ENV=production
```

## 📚 Documentação Adicional

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Cookies no Next.js](https://nextjs.org/docs/app/api-reference/functions/cookies)
- Documentação das APIs: `/docs/*.md`
