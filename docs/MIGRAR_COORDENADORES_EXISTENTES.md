# 🔄 Migração de Coordenadores Existentes

## 📋 Problema

Você possui **coordenadores cadastrados antes das alterações** no sistema. Esses coordenadores:
- ✅ Têm senioridade = "Coordenador"
- ❌ NÃO têm email
- ❌ NÃO têm senha
- ❌ NÃO têm conta de usuário
- ❌ NÃO têm sub-times associados para liderar

**⭐ Importante:** A partir de agora, coordenadores podem liderar **múltiplos sub-times** (mesmo de times diferentes).

**Resultado:** Eles não conseguem fazer login no sistema.

---

## ✅ Solução: Atualizar via API

### Método 1: Atualizar via API REST (RECOMENDADO)

Você pode usar a rota `PATCH /api/v1/tecnicos/:id` para adicionar email, senha e sub-times aos coordenadores existentes.

#### Passo 1: Listar Coordenadores sem Conta

Faça login como Admin e liste todos os técnicos:

```bash
GET http://localhost:3000/api/v1/tecnicos?senioridade=Coordenador
Authorization: Bearer {seu-token-admin}
```

**Identifique coordenadores com:**
- `hasUserAccount: false`
- `email: null`
- `ledSubtimes: []` ou `null`

#### Passo 2: Atualizar Coordenador

Para cada coordenador encontrado, faça uma requisição PATCH:

```bash
PATCH http://localhost:3000/api/v1/tecnicos/{id-do-coordenador}
Authorization: Bearer {seu-token-admin}
Content-Type: application/json

{
  "email": "coordenador1@empresa.com",
  "password": "SenhaSegura@123",
  "ledSubtimeIds": [
    "uuid-subtime-a",
    "uuid-subtime-b",
    "uuid-subtime-c"
  ]
}
```

**Exemplo Completo:**

```javascript
// JavaScript/Fetch
async function migrarCoordenador(coordenadorId, email, senha, ledSubtimeIds) {
  const response = await fetch(
    `http://localhost:3000/api/v1/tecnicos/${coordenadorId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenAdmin}`,
      },
      body: JSON.stringify({
        email: email,
        password: senha,
        ledSubtimeIds: ledSubtimeIds, // Array de IDs
      }),
    }
  );

  if (response.ok) {
    const coordenador = await response.json();
    console.log('✅ Coordenador atualizado:', coordenador.name);
    console.log('   Email:', coordenador.email);
    console.log('   Tem conta:', coordenador.hasUserAccount);
    console.log('   Lidera sub-times:', coordenador.ledSubtimes.map(st => st.name).join(', '));
  } else {
    const error = await response.json();
    console.error('❌ Erro:', error.message);
  }
}

// Uso:
await migrarCoordenador(
  'uuid-coordenador-1',
  'maria.coordenadora@empresa.com',
  'Senha@123',
  ['uuid-subtime-a', 'uuid-subtime-b'] // Lidera 2 sub-times
);
```

#### Passo 3: Validar

Após atualizar, tente fazer login com o coordenador:

```bash
POST http://localhost:3000/api/v1/auth/login

{
  "email": "coordenador1@empresa.com",
  "password": "SenhaSegura@123"
}
```

Se retornar token com `role: "coordenador"`, está funcionando! ✅

---

## 🔍 Como Encontrar os Sub-times

### Opção 1: Listar Sub-times via API

```bash
GET http://localhost:3000/api/v1/subtimes
Authorization: Bearer {token-admin}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-subtime-a",
      "name": "Sub-time Manutenção A",
      "teamId": "uuid-time-1",
      "parentTeam": {
        "name": "Time Manutenção"
      }
    },
    {
      "id": "uuid-subtime-b",
      "name": "Sub-time Manutenção B",
      "teamId": "uuid-time-1"
    },
    {
      "id": "uuid-subtime-c",
      "name": "Sub-time Produção C",
      "teamId": "uuid-time-2"
    }
  ]
}
```

### Opção 2: Usar o subtimeId do próprio coordenador

Se o coordenador já está vinculado a um sub-time (campo `subtimeId`), você pode começar com esse ID:

```javascript
const coordenador = await fetch(`/api/v1/tecnicos/${id}`).then(r => r.json());

// Começar com o sub-time onde ele está vinculado
const ledSubtimeIds = [coordenador.subtimeId];

// Adicionar outros sub-times se necessário
ledSubtimeIds.push('uuid-outro-subtime');

await migrarCoordenador(id, email, senha, ledSubtimeIds);
```

### Opção 3: Coordenador lidera múltiplos sub-times

Um coordenador pode liderar sub-times de times diferentes:

```javascript
// Maria lidera 3 sub-times de 2 times diferentes
const ledSubtimeIds = [
  'uuid-subtime-a', // Time Manutenção
  'uuid-subtime-b', // Time Manutenção
  'uuid-subtime-c'  // Time Produção
];

await migrarCoordenador(
  'uuid-maria',
  'maria@empresa.com',
  'Senha@123',
  ledSubtimeIds
);
```

---

## 📝 Script de Migração em Lote

### Usando JavaScript (Node.js)

Salve este script em `migrate-coordenadores.js`:

```javascript
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/v1';
const ADMIN_TOKEN = 'seu-token-admin-aqui';

async function migrarTodosCoordenadores() {
  // 1. Listar todos os técnicos
  const response = await fetch(`${API_URL}/tecnicos?limit=1000`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });

  const { data: tecnicos } = await response.json();

  // 2. Filtrar coordenadores sem conta
  const coordenadores = tecnicos.filter(
    (t) => t.senioridade === 'Coordenador' && !t.hasUserAccount
  );

  console.log(`Encontrados ${coordenadores.length} coordenadores sem conta\n`);

  // 3. Dados de login para cada coordenador
  const coordenadoresData = [
    {
      id: 'uuid-coordenador-1',
      email: 'maria.coordenadora@empresa.com',
      password: 'Senha@123',
      ledSubtimeIds: ['uuid-subtime-a', 'uuid-subtime-b'], // Múltiplos sub-times
    },
    {
      id: 'uuid-coordenador-2',
      email: 'joao.coordenador@empresa.com',
      password: 'Senha@456',
      ledSubtimeIds: ['uuid-subtime-c'], // Um único sub-time
    },
    // Adicione mais conforme necessário
  ];

  // 4. Migrar cada um
  for (const coord of coordenadoresData) {
    console.log(`Migrando: ${coord.email}...`);

    try {
      const response = await fetch(`${API_URL}/tecnicos/${coord.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          email: coord.email,
          password: coord.password,
          ledSubtimeIds: coord.ledSubtimeIds, // Array de IDs
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${result.name} - Conta criada!`);
      } else {
        const error = await response.json();
        console.log(`❌ Erro: ${error.message}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao migrar:`, error.message);
    }

    console.log('');
  }

  console.log('✅ Migração concluída!');
}

migrarTodosCoordenadores();
```

**Executar:**
```bash
npm install node-fetch
node migrate-coordenadores.js
```

---

## 🔧 Método 2: Via Script TypeScript (Avançado)

Se preferir usar o script TypeScript fornecido:

### Passo 1: Instalar Dependências

```bash
npm install --save-dev ts-node @types/node
```

### Passo 2: Executar Script

```bash
npx ts-node scripts/migrate-coordenadores.ts
```

O script irá:
1. Conectar ao banco de dados
2. Listar todos os coordenadores sem conta
3. Pedir email, senha e ledSubtimeId para cada um
4. Criar conta de usuário automaticamente

---

## ⚠️ Validações Importantes

### 1. Email Único

O email deve ser único no sistema:

```sql
-- Verificar se email já existe
SELECT email FROM users WHERE email = 'coordenador@empresa.com';
```

### 2. ledSubtimeIds Obrigatório

Coordenadores **devem** ter ao menos um sub-time atribuído:

```bash
# Se tentar sem ledSubtimeIds
PATCH /api/v1/tecnicos/uuid-coordenador
{
  "email": "teste@email.com",
  "password": "Senha@123"
}

# Retornará erro:
{
  "statusCode": 400,
  "message": "É obrigatório vincular ao menos um sub-time ao Coordenador (ledSubtimeIds)"
}
```

### 3. Sub-times Devem Existir

Todos os IDs em `ledSubtimeIds` devem corresponder a sub-times válidos:

```bash
# Se um ID não existir
PATCH /api/v1/tecnicos/uuid-coordenador
{
  "email": "teste@email.com",
  "password": "Senha@123",
  "ledSubtimeIds": ["uuid-invalido"]
}

# Retornará erro:
{
  "statusCode": 400,
  "message": "Sub-time uuid-invalido não encontrado"
}
```

### 4. Senha Mínima

Senha deve ter **no mínimo 8 caracteres**.

---

## 🧪 Testar Após Migração

### 1. Login como Coordenador

```bash
POST http://localhost:3000/api/v1/auth/login

{
  "email": "coordenador@empresa.com",
  "password": "SenhaSegura@123"
}
```

**Response esperado:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "uuid-user",
    "email": "coordenador@empresa.com",
    "role": "coordenador",
    "tecnicoId": "uuid-coordenador"
  }
}
```

### 2. Listar Técnicos (deve ver apenas do sub-time)

```bash
GET http://localhost:3000/api/v1/tecnicos
Authorization: Bearer {token-coordenador}
```

Deve retornar apenas técnicos do sub-time que o coordenador lidera.

### 3. Tentar Editar Técnico do Sub-time

```bash
PATCH http://localhost:3000/api/v1/tecnicos/{id-tecnico-do-subtime}
Authorization: Bearer {token-coordenador}

{
  "cargo": "Novo Cargo"
}
```

Deve funcionar! ✅

### 4. Tentar Editar Técnico de Outro Sub-time

```bash
PATCH http://localhost:3000/api/v1/tecnicos/{id-tecnico-outro-subtime}
Authorization: Bearer {token-coordenador}

{
  "cargo": "Novo Cargo"
}
```

Deve retornar **403 Forbidden** ✅

---

## 📊 Checklist de Migração

Para cada coordenador:

- [ ] Encontrar ID do coordenador
- [ ] Definir email único
- [ ] Definir senha (mínimo 8 caracteres)
- [ ] Identificar sub-times que irá liderar (ledSubtimeIds - array)
- [ ] Fazer PATCH na API com os dados
- [ ] Validar resposta (hasUserAccount deve ser true)
- [ ] Validar que ledSubtimes tem ao menos 1 sub-time
- [ ] Testar login com email/senha
- [ ] Validar que vê apenas técnicos dos seus sub-times
- [ ] Enviar credenciais para o coordenador

---

## 🎯 Exemplo Completo: Postman/Insomnia

### Request

```http
PATCH http://localhost:3000/api/v1/tecnicos/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
Content-Type: application/json

{
  "email": "maria.silva@empresa.com",
  "password": "MinhaSenha@2024",
  "ledSubtimeIds": [
    "660e8400-e29b-41d4-a716-446655440001",
    "660e8400-e29b-41d4-a716-446655440002",
    "660e8400-e29b-41d4-a716-446655440003"
  ]
}
```

### Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Maria Silva",
  "workday": "WDC00050",
  "senioridade": "Coordenador",
  "email": "maria.silva@empresa.com",
  "hasUserAccount": true,
  "ledSubtimes": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Sub-time Manutenção A",
      "teamId": "uuid-time-1"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "name": "Sub-time Manutenção B",
      "teamId": "uuid-time-1"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440003",
      "name": "Sub-time Produção C",
      "teamId": "uuid-time-2"
    }
  ]
}
```

---

## ❓ FAQ

**Q: O coordenador já tem email cadastrado, mas não tem senha. Como proceder?**

A: Faça PATCH enviando apenas a senha e os sub-times:

```json
{
  "password": "NovaSenha@123",
  "ledSubtimeIds": ["uuid-subtime-a", "uuid-subtime-b"]
}
```

**Q: Posso usar o mesmo sub-time onde o coordenador está vinculado (subtimeId)?**

A: Sim! É comum que o coordenador esteja vinculado ao mesmo sub-time que lidera:

```javascript
const coordenador = await getTecnico(id);
const ledSubtimeIds = [coordenador.subtimeId]; // Usar o mesmo
```

**Q: O coordenador pode liderar sub-times de times diferentes?**

A: Sim! Um coordenador pode liderar quantos sub-times quiser, mesmo que estejam em times diferentes:

```javascript
const ledSubtimeIds = [
  'uuid-subtime-a', // Time Manutenção
  'uuid-subtime-b', // Time Produção
  'uuid-subtime-c', // Time Qualidade
];
```

**Q: O que acontece se eu não informar ledSubtimeIds?**

A: A API retornará erro 400:
```json
{
  "message": "É obrigatório vincular ao menos um sub-time ao Coordenador (ledSubtimeIds)"
}
```

**Q: Preciso informar todos os sub-times de uma vez?**

A: Sim. O campo `ledSubtimeIds` substitui completamente a lista anterior. Se quiser adicionar um novo sub-time, inclua os anteriores também:

```javascript
// Coordenador liderava A e B
const atual = coordenador.ledSubtimes.map(st => st.id); // ['uuid-a', 'uuid-b']

// Adicionar C
const novos = [...atual, 'uuid-c']; // ['uuid-a', 'uuid-b', 'uuid-c']

await atualizarCoordenador(id, { ledSubtimeIds: novos });
```

**Q: Posso alterar os sub-times depois?**

A: Sim, basta fazer outro PATCH com a nova lista de IDs.

**Q: Como saber se a conta foi criada?**

A: Verifique o campo `hasUserAccount` no técnico. Se for `true` e `ledSubtimes` tiver ao menos 1 sub-time, a conta foi criada.

---

## 🎯 Conclusão

Use o método **PATCH via API** (Método 1) para migrar coordenadores existentes. É simples, rápido e funciona via Postman/Insomnia ou código JavaScript.

**Resumo:**
1. Login como Admin
2. Listar coordenadores sem conta
3. Para cada um, fazer PATCH com email, senha e ledSubtimeId
4. Validar login do coordenador
5. Enviar credenciais

✅ **Pronto para usar!**
