# API Proxy - Guia de Migração

Este documento explica as mudanças realizadas na arquitetura de comunicação com o backend.

## O que mudou?

### Antes ✗
```typescript
// Chamadas diretas ao backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
})

// Tokens em localStorage
localStorage.setItem('accessToken', token)
```

### Depois ✓
```typescript
// Chamadas através de proxy Next.js
const apiClient = axios.create({
  baseURL: '/api',  // Rotas locais
})

// Tokens em cookies HTTPOnly (gerenciados automaticamente)
// Não é mais necessário manipular tokens manualmente
```

## Benefícios da Nova Arquitetura

### 🔐 Segurança Aprimorada
- **Cookies HTTPOnly**: Tokens não acessíveis via JavaScript
- **Backend oculto**: URLs e credenciais não expostas
- **CSRF Protection**: Proteção contra ataques

### 📦 Código Mais Limpo
- **Sem gerenciamento manual de tokens**
- **Menos código boilerplate**
- **Interceptors simplificados**

### 🎯 Melhor Manutenibilidade
- **Centralização**: Um ponto para todas as requisições
- **Fácil debugging**: Logs no servidor
- **Versionamento**: Controle de versão da API

## Estrutura de Pastas

```
app/api/                      # Nova pasta de proxies
├── lib/
│   └── backend-client.ts     # Helper para backend
├── auth/                     # Rotas de autenticação
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── me/route.ts
│   └── refresh/route.ts
├── tecnicos/                 # Rotas de técnicos
│   ├── route.ts
│   ├── with-photo/route.ts
│   └── [id]/
│       ├── route.ts
│       └── photo/route.ts
└── ... (outros módulos)
```

## Migrações Necessárias

### 1. Variáveis de Ambiente

Adicione ao `.env.local`:

```bash
BACKEND_URL=http://localhost:3000
BACKEND_API_PREFIX=/api/v1
```

### 2. AuthContext/Hooks

Se você tem um contexto de autenticação, atualize:

```typescript
// Antes
const login = async (credentials) => {
  const data = await authService.login(credentials)
  localStorage.setItem('accessToken', data.accessToken)
  setUser(data.user)
}

// Depois
const login = async (credentials) => {
  const data = await authService.login(credentials)
  // Tokens gerenciados automaticamente via cookies
  setUser(data.user)
}
```

### 3. Verificação de Autenticação

```typescript
// Antes
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken')
}

// Depois
const isAuthenticated = async () => {
  try {
    await authService.me()
    return true
  } catch {
    return false
  }
}
```

## Rotas Disponíveis

Todas as rotas seguem o padrão `/api/{módulo}`:

### Autenticação
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/refresh`

### Técnicos
- `GET /api/tecnicos` - Listar
- `POST /api/tecnicos` - Criar
- `GET /api/tecnicos/:id` - Buscar
- `PATCH /api/tecnicos/:id` - Atualizar
- `DELETE /api/tecnicos/:id` - Remover
- `POST /api/tecnicos/:id/photo` - Upload foto
- `DELETE /api/tecnicos/:id/photo` - Remover foto
- `POST /api/tecnicos/with-photo` - Criar com foto

### Times
- `GET /api/teams` - Listar
- `POST /api/teams` - Criar
- `GET /api/teams/:id` - Buscar
- `PATCH /api/teams/:id` - Atualizar
- `DELETE /api/teams/:id` - Remover
- `GET /api/teams/:id/subtimes` - Listar subtimes
- `GET /api/teams/:id/members` - Listar membros

### Outros Módulos
- `/api/users` - Usuários
- `/api/subtimes` - Subtimes
- `/api/evaluations` - Avaliações
- `/api/machines` - Máquinas
- `/api/skills` - Habilidades
- `/api/quarterly-notes` - Notas trimestrais
- `/api/analytics` - Analytics

## Testando

### 1. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 2. Teste uma rota de API

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha123"}' \
  -c cookies.txt

# Usar o token para acessar rota protegida
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt
```

### 3. Teste no navegador

Abra o DevTools > Network e veja as chamadas para `/api/*`

## Troubleshooting

### Erro: "BACKEND_URL is not defined"

Solução: Crie o arquivo `.env.local` com as variáveis necessárias.

### Erro: "Cookies não estão sendo enviados"

Solução: Verifique se `withCredentials: true` está configurado no axios.

### Erro: "CORS error"

Solução: Configure CORS no backend para aceitar o domínio do frontend.

### Erro: "401 Unauthorized"

Solução: 
1. Verifique se fez login corretamente
2. Veja se os cookies estão sendo enviados
3. Verifique se o backend está aceitando o token

## Compatibilidade

✅ **Compatível com:**
- Next.js 14+
- React 18+
- Axios
- Fetch API

⚠️ **Requer:**
- Node.js 18+
- Backend configurado com CORS

## Próximos Passos

1. ✅ Proxy implementado
2. ✅ Serviços atualizados
3. ⏳ Testar em desenvolvimento
4. ⏳ Atualizar AuthContext
5. ⏳ Deploy em produção

## Suporte

Para dúvidas ou problemas, consulte:
- [README da API](/app/api/README.md)
- [Documentação do Backend](/docs/BACKEND.md)
- Issues no repositório
