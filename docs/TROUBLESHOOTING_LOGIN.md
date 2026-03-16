# 🔧 Guia de Troubleshooting - Problemas de Login

## 🚨 Erro: "Credenciais Inválidas"

Se você está recebendo erro de credenciais inválidas ao tentar fazer login, siga este guia passo a passo.

---

## ✅ CHECKLIST DE DIAGNÓSTICO

### 1️⃣ Verificar se Backend está Rodando

```bash
# Em um terminal, navegue até a pasta do backend e rode:
npm run dev
# ou
yarn dev
# ou
pnpm dev

# O backend deve estar rodando em http://localhost:3000
# Você deve ver mensagens como:
# ✅ Server running on http://localhost:3000
# ✅ Database connected
```

**Teste se o backend está acessível:**
```bash
# Em outro terminal, teste o endpoint:
curl http://localhost:3000/api/v1
# ou abra no navegador:
# http://localhost:3000/api/v1
```

Se der erro de conexão → **O backend não está rodando!**

---

### 2️⃣ Verificar Arquivo .env.local no Frontend

**✅ Agora o arquivo existe:** `.env.local` foi criado com:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Após criar/modificar o arquivo `.env.local`, você PRECISA **reiniciar o servidor Next.js**:

```bash
# Pare o servidor (Ctrl+C)
# E rode novamente:
npm run dev
```

---

### 3️⃣ Verificar se Usuário Existe no Backend

O frontend precisa de um usuário **já criado no backend**. Verifique se você tem:

**Opção A: Verificar via curl**
```bash
# Liste os usuários (precisa estar logado como Master)
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Opção B: Criar usuário via Seed do Backend**

No backend, você deve ter um arquivo de seed que cria o primeiro usuário Master. Rode:

```bash
# Na pasta do backend:
npm run seed
# ou
npx prisma db seed
```

**Opção C: Criar usuário manualmente via Prisma Studio**

```bash
# Na pasta do backend:
npx prisma studio
```

Isso abre interface web onde você pode criar usuários manualmente.

---

### 4️⃣ Verificar Credenciais Corretas

**Para conta Master:**
- Email: Conforme configurado no seed do backend
- Senha: Conforme configurado no seed do backend

**Exemplos comuns de credenciais padrão:**
```
Email: admin@skillfix.com
Senha: Admin@2024

OU

Email: master@skillfix.com  
Senha: Master@2024
```

⚠️ **Atenção:** As credenciais dependem do que foi configurado no arquivo de seed do seu backend!

---

### 5️⃣ Verificar CORS no Backend

Se o backend estiver rodando mas ainda não funciona, pode ser problema de CORS.

**No backend, verifique o arquivo de configuração do CORS** (geralmente em `src/main.ts` ou similar):

```typescript
// Deve ter algo assim:
app.enableCors({
  origin: 'http://localhost:3001', // Porta do frontend Next.js
  credentials: true,
})
```

**Qual a porta do seu frontend?**
```bash
# No terminal onde o frontend está rodando, você verá algo como:
# ✓ Ready on http://localhost:3001
```

Se o frontend estiver na porta 3001, o backend precisa liberar essa porta no CORS!

---

### 6️⃣ Verificar Console do Navegador

Abra o DevTools (F12) e vá na aba **Console** e **Network**.

Ao tentar fazer login, procure por:

**❌ Erros de CORS:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/auth/login' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```
**Solução:** Configurar CORS no backend (ver passo 5)

**❌ Erro 404:**
```
POST http://localhost:3000/api/v1/auth/login 404 (Not Found)
```
**Solução:** Endpoint não existe no backend. Verifique se a rota está criada.

**❌ Erro 401:**
```
POST http://localhost:3000/api/v1/auth/login 401 (Unauthorized)
```
**Solução:** Credenciais incorretas ou usuário não existe.

**❌ Erro de conexão:**
```
POST http://localhost:3000/api/v1/auth/login net::ERR_CONNECTION_REFUSED
```
**Solução:** Backend não está rodando!

---

## 🔄 PASSO A PASSO COMPLETO PARA TESTAR

### PASSO 1: Parar tudo
```bash
# Pare o backend (Ctrl+C)
# Pare o frontend (Ctrl+C)
```

### PASSO 2: Iniciar Backend
```bash
# Na pasta do backend:
cd ../skill-backend
npm run dev

# Aguarde ver mensagens de sucesso:
# ✅ Server running on http://localhost:3000
```

### PASSO 3: Testar Backend
```bash
# Em outro terminal:
curl http://localhost:3000/api/v1

# Deve retornar algo ou dar erro 404 (mas não erro de conexão)
```

### PASSO 4: Criar/Verificar Usuário no Backend

**Opção A - Via Seed:**
```bash
# Na pasta do backend:
npm run seed
```

**Opção B - Via Prisma Studio:**
```bash
# Na pasta do backend:
npx prisma studio

# Acesse: http://localhost:5555
# Vá em "User" e crie um usuário:
# - email: admin@skillfix.com
# - password: (hash bcrypt de "Admin@2024")
# - name: Administrador
# - role: MASTER
# - isActive: true
```

**Opção C - Via curl:**
```bash
# Primeiro, faça login com um usuário existente
# Depois crie novo usuário:
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supervisor@skillfix.com",
    "name": "João Supervisor",
    "role": "SUPERVISOR"
  }'
```

### PASSO 5: Verificar .env.local no Frontend
```bash
# Na pasta do frontend:
cat .env.local

# Deve mostrar:
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### PASSO 6: Reiniciar Frontend
```bash
# Na pasta do frontend:
npm run dev

# Aguarde ver:
# ✓ Ready on http://localhost:3001
```

### PASSO 7: Abrir DevTools no Navegador
```
1. Abra o navegador em http://localhost:3001/login
2. Pressione F12 para abrir DevTools
3. Vá na aba "Network"
4. Tente fazer login
5. Veja o que aparece na aba Network
```

### PASSO 8: Tentar Login

Use as credenciais que você configurou no backend:

```
Email: admin@skillfix.com
Senha: Admin@2024
```

---

## 📋 CHECKLIST RÁPIDO

- [ ] Backend está rodando em `http://localhost:3000`
- [ ] Frontend está rodando (geralmente `http://localhost:3001`)
- [ ] Arquivo `.env.local` existe e tem `NEXT_PUBLIC_API_URL=http://localhost:3000`
- [ ] Frontend foi **reiniciado** após criar/modificar `.env.local`
- [ ] Existe pelo menos 1 usuário no banco de dados do backend
- [ ] Você sabe o email e senha corretos do usuário
- [ ] CORS está configurado no backend
- [ ] Não há erros no console do navegador (F12)
- [ ] Endpoint `/api/v1/auth/login` existe no backend

---

## 🆘 AINDA NÃO FUNCIONA?

### Teste Manual com curl

```bash
# Tente fazer login via curl para isolar o problema:
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@skillfix.com",
    "password": "Admin@2024"
  }'

# Se funcionar, vai retornar:
# {
#   "accessToken": "eyJhbGc...",
#   "refreshToken": "eyJhbGc..."
# }

# Se não funcionar, vai mostrar o erro exato
```

**Se funcionar via curl mas não no frontend:**
- Problema de CORS
- Problema de URL incorreta no frontend
- Cache do navegador (tente Ctrl+Shift+R)

**Se não funcionar via curl:**
- Problema no backend
- Credenciais incorretas
- Usuário não existe
- Endpoint não implementado

---

## 🔍 LOGS ÚTEIS

### Ver logs do Backend
No terminal onde o backend está rodando, você verá logs de todas as requisições:
```
POST /api/v1/auth/login 200 - 123ms
```

Se aparecer erro 401, o problema é credenciais incorretas.

### Ver logs do Frontend
No console do navegador (F12), você verá logs do código:
```javascript
console.log('✅ Login realizado com sucesso!')
// ou
console.error('❌ Erro no login:', err)
```

---

## 💡 DICAS FINAIS

1. **Sempre reinicie o frontend após modificar .env.local**
2. **Use o console do navegador (F12) para ver erros detalhados**
3. **Teste o backend isoladamente com curl primeiro**
4. **Verifique se as portas não estão em conflito**
5. **Limpe o cache do navegador se necessário** (Ctrl+Shift+Del)

---

## 📞 Informações de Debug Úteis

Quando reportar o problema, forneça:

1. **URL que está aparecendo no erro** (veja na aba Network do DevTools)
2. **Status code** (401, 404, 500, etc)
3. **Mensagem de erro exata** (do console)
4. **Em qual porta está rodando:**
   - Backend: `http://localhost:????`
   - Frontend: `http://localhost:????`
5. **Conteúdo do arquivo `.env.local`**
6. **Se o curl funciona**: Sim/Não

---

## ✅ Resolução Mais Comum

**90% dos casos o problema é:**

1. ❌ Backend não está rodando → **Inicie com `npm run dev`**
2. ❌ Arquivo `.env.local` não existe → **Já criado! Reinicie o frontend**
3. ❌ Usuário não existe no banco → **Execute o seed do backend**
4. ❌ Frontend não foi reiniciado → **Pare (Ctrl+C) e rode `npm run dev` novamente**

---

Siga estes passos e me avise qual erro específico você está vendo! 🚀
