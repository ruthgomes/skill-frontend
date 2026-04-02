# 🔧 Troubleshooting - API Routes & Cookies

## Problema: "Refresh token não encontrado"

### Sintomas:
```
POST /api/auth/login 200 ✅
POST /api/auth/refresh 401 ❌ "Refresh token não encontrado"
```

### Causas Comuns:

#### 1. **Cookies não estão sendo salvos**

**Teste:**
```bash
# Após fazer login, verifique os cookies
curl http://localhost:3001/api/debug/cookies
```

**Solução:**
- Certifique-se de que `withCredentials: true` está configurado no axios
- Verifique se `sameSite: 'lax'` está correto (use 'none' se frontend/backend em domínios diferentes)
- Em produção, use `secure: true`

#### 2. **CORS bloqueando cookies**

**Teste:**
Abra DevTools > Network > Request Headers e veja se `Cookie` está presente.

**Solução:**
```typescript
// middleware.ts já configurado com:
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: <seu-domínio>
```

#### 3. **Nomes dos campos diferentes**

O backend pode retornar `accessToken` (camelCase) ao invés de `access_token` (snake_case).

**Solução:** Código atualizado aceita ambos formatos:
```typescript
const accessToken = data.access_token || data.accessToken
const refreshToken = data.refresh_token || data.refreshToken
```

#### 4. **Path do cookie errado**

**Solução:** Adicionado `path: '/'` em todos os cookies.

### Checklist de Debug:

- [ ] **1. Verificar variáveis de ambiente**
  ```bash
  # .env.local
  BACKEND_URL=http://localhost:3000
  BACKEND_API_PREFIX=/api/v1
  ```

- [ ] **2. Testar rota de debug**
  ```bash
  # Fazer login primeiro
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"senha"}' \
    -c cookies.txt
  
  # Verificar cookies salvos
  curl http://localhost:3001/api/debug/cookies -b cookies.txt
  ```

- [ ] **3. Verificar logs do servidor**
  ```
  ✅ Tokens salvos nos cookies         <- Deve aparecer no login
  🔄 Tentando refresh token: encontrado <- Deve aparecer no refresh
  ```

- [ ] **4. Testar no navegador**
  - Abra DevTools > Application > Cookies
  - Verifique se `access_token` e `refresh_token` existem
  - Domínio deve ser `localhost` ou seu domínio
  - Path deve ser `/`
  - HttpOnly deve estar marcado

- [ ] **5. Verificar interceptor do axios**
  ```typescript
  // core/services/api-client.ts deve ter:
  withCredentials: true
  ```

### Códigos de Status:

| Status | Significado | Ação |
|--------|-------------|------|
| 200 | Login OK | Tokens salvos nos cookies ✅ |
| 401 | Não autenticado | Token inválido ou expirado |
| 401 | Refresh token não encontrado | Cookies não chegaram ao servidor |

### Teste Completo:

```bash
# 1. Fazer login e salvar cookies
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}' \
  -c cookies.txt \
  -v

# 2. Verificar cookies salvos
cat cookies.txt

# 3. Testar rota protegida
curl http://localhost:3001/api/auth/me \
  -b cookies.txt

# 4. Testar refresh
curl -X POST http://localhost:3001/api/auth/refresh \
  -b cookies.txt \
  -v

# 5. Verificar debug
curl http://localhost:3001/api/debug/cookies \
  -b cookies.txt
```

### Configurações Recomendadas:

#### Development (localhost):
```typescript
{
  httpOnly: true,
  secure: false,        // ← HTTP funciona
  sameSite: 'lax',     // ← Permite cookies em requests do mesmo site
  path: '/',
  maxAge: 60 * 60 * 24
}
```

#### Production (HTTPS):
```typescript
{
  httpOnly: true,
  secure: true,         // ← Apenas HTTPS
  sameSite: 'strict',   // ← Mais restritivo
  path: '/',
  maxAge: 60 * 60 * 24
}
```

#### Cross-Domain (diferentes portas/domínios):
```typescript
{
  httpOnly: true,
  secure: true,         // ← Necessário para sameSite: 'none'
  sameSite: 'none',     // ← Permite cross-domain
  path: '/',
  maxAge: 60 * 60 * 24
}
```

### Próximos Passos:

Se o problema persistir:

1. Execute a rota de debug: `GET /api/debug/cookies`
2. Verifique os logs do console
3. Examine os cookies no DevTools
4. Teste com cURL para isolar o problema
5. Verifique se o backend está retornando os tokens corretamente

### Comandos Úteis:

```bash
# Ver logs do Next.js em tempo real
npm run dev

# Limpar cache e node_modules (se necessário)
rm -rf .next node_modules
npm install
npm run dev

# Testar no navegador sem cache
DevTools > Network > Disable cache
```
