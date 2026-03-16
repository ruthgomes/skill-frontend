# 🔒 Configurar CORS no Backend

## ❌ Problema

```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/auth/login' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

## ✅ Solução

O backend precisa permitir requisições do frontend que está em `http://localhost:4200`.

### 1. Vá para o projeto do Backend

```bash
cd ../skill-backend
```

### 2. Localize o arquivo de configuração CORS

Geralmente está em:
- `src/index.ts` ou `src/app.ts` ou `src/server.ts`
- Procure por: `app.use(cors(...))`

### 3. Configure CORS para permitir o frontend

**Código que você deve adicionar/modificar no backend:**

```typescript
import cors from 'cors';

// Configuração CORS
app.use(cors({
  origin: [
    'http://localhost:4200',  // Frontend em desenvolvimento (Next.js)
    'http://localhost:3001',  // Alternativa se mudar porta
  ],
  credentials: true,           // Permite enviar cookies/credenciais
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 4. Se o backend usa Express

**Arquivo: `src/index.ts` ou `src/app.ts`**

```typescript
import express from 'express';
import cors from 'cors';

const app = express();

// CORS - DEVE VIR ANTES DAS ROTAS!
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// Rotas
app.use('/api/v1', routes);

// Start server
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
```

### 5. Se o backend usa NestJS

**Arquivo: `src/main.ts`**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
  console.log('✅ Server running on http://localhost:3000');
}
bootstrap();
```

### 6. Reinicie o Backend

```bash
# Pare o backend (Ctrl+C)
# Rode novamente:
npm run dev
```

### 7. Teste novamente no Frontend

- Abra http://localhost:4200/login
- Tente fazer login
- **Agora deve funcionar!** ✅

---

## 🧪 Como Verificar se CORS está Configurado

### Opção 1: Teste no Browser Console

```javascript
fetch('http://localhost:3000/api/v1/auth/me', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => console.log('✅ CORS OK:', data))
.catch(err => console.error('❌ CORS Error:', err));
```

### Opção 2: Teste com curl

```bash
curl -X OPTIONS http://localhost:3000/api/v1/auth/login \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Resposta esperada:**
```
< HTTP/1.1 204 No Content
< Access-Control-Allow-Origin: http://localhost:4200
< Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
< Access-Control-Allow-Headers: Content-Type,Authorization
```

---

## 🚨 Erros Comuns

### ❌ Erro: "CORS ainda bloqueado"
**Causa:** CORS configurado DEPOIS das rotas
**Solução:** Mova `app.use(cors(...))` para ANTES de `app.use('/api/v1', routes)`

### ❌ Erro: "No 'Access-Control-Allow-Origin' header"
**Causa:** Origin não incluída na lista
**Solução:** Adicione `http://localhost:4200` no array `origin`

### ❌ Erro: "The 'Access-Control-Allow-Credentials' header is 'false'"
**Causa:** `credentials: false` ou não configurado
**Solução:** Configure `credentials: true`

### ❌ Erro: Backend mostra "Unknown error"
**Causa:** Pacote `cors` não instalado
**Solução:** 
```bash
npm install cors
npm install -D @types/cors  # Se usar TypeScript
```

---

## 📝 Exemplo Completo (Express + TypeScript)

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 1. CORS - PRIMEIRA COISA!
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 4. Rotas
app.use('/api/v1', routes);

// 5. Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 6. Start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## 🎯 Checklist Final

Depois de configurar CORS no backend:

- [ ] Código CORS adicionado ANTES das rotas
- [ ] `http://localhost:4200` na lista de origins
- [ ] `credentials: true` configurado
- [ ] Backend reiniciado (Ctrl+C + npm run dev)
- [ ] Frontend testado (http://localhost:4200/login)
- [ ] Login funciona sem erro de CORS
- [ ] Tokens salvos no localStorage
- [ ] Redirecionado para /home após login

---

## 🎉 Sucesso!

Se seguir esses passos, o erro de CORS será resolvido e o login funcionará perfeitamente! 🚀

**Lembre-se:** Em produção, substitua `http://localhost:4200` pelo domínio real do frontend!
