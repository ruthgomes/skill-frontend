# 📦 Services - Serviços de Integração com Backend

## 📋 Visão Geral

Esta pasta contém todos os serviços para integração com a API REST do backend SkillFix.

## 🗂️ Estrutura

```
services/
├── api-client.ts              # Cliente Axios configurado
├── auth.service.ts            # Autenticação e autorização
├── users.service.ts           # Gerenciamento de usuários
├── tecnicos.service.ts        # Gerenciamento de técnicos
├── teams.service.ts           # Gerenciamento de times
├── subtimes.service.ts        # Gerenciamento de sub-times
├── machines.service.ts        # Gerenciamento de máquinas
├── skills.service.ts          # Gerenciamento de competências
├── evaluations.service.ts     # Sistema de avaliações
├── quarterly-notes.service.ts # Notas trimestrais
├── analytics.service.ts       # Analytics e dashboards
├── index.ts                   # Exports centralizados
└── README.md                  # Este arquivo
```

## 🚀 Como Usar

### Import Único (Recomendado)

```typescript
import { 
  authService,
  usersService,
  tecnicosService,
  teamsService,
  // ... outros serviços
} from '@/core/services'
```

### Import Individual

```typescript
import authService from '@/core/services/auth.service'
import tecnicosService from '@/core/services/tecnicos.service'
```

## 📚 Serviços Disponíveis

### 🔐 authService

Gerenciamento de autenticação com JWT.

**Métodos:**
- `login(credentials)` - Realiza login
- `refreshToken(request)` - Renova access token
- `me()` - Busca dados do usuário logado
- `logout()` - Realiza logout
- `isAuthenticated()` - Verifica se está autenticado

**Exemplo:**
```typescript
const { accessToken } = await authService.login({
  email: 'admin@empresa.com',
  password: 'senha123'
})
```

---

### 👥 usersService

CRUD completo de usuários.

**Métodos:**
- `create(data)` - Cria usuário
- `findAll(params)` - Lista usuários com paginação
- `findOne(id)` - Busca por ID
- `getProfile()` - Busca perfil próprio
- `update(id, data)` - Atualiza usuário
- `updateProfile(data)` - Atualiza perfil próprio
- `changePassword(data)` - Altera senha
- `resetPassword(data)` - Reseta senha (Master)
- `toggleStatus(id)` - Ativa/desativa
- `remove(id)` - Deleta usuário

**Exemplo:**
```typescript
const users = await usersService.findAll({ 
  page: 1, 
  limit: 20,
  role: 'supervisor' 
})
```

---

### 👷 tecnicosService

Gerenciamento de técnicos/colaboradores.

**Métodos:**
- `create(data)` - Cria técnico
- `findAll(params)` - Lista técnicos
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza
- `uploadPhoto(id, file)` - Upload de foto
- `removePhoto(id)` - Remove foto
- `getSkills(id)` - Busca skills do técnico
- `updateSkillScore(tecnicoId, skillId, score)` - Atualiza pontuação
- `remove(id)` - Deleta

**Exemplo:**
```typescript
const tecnico = await tecnicosService.create({
  name: 'João Silva',
  employeeNumber: 'EMP-12345',
  position: 'Operador',
  teamId: 'team-uuid',
  subtimeId: 'subtime-uuid'
})
```

---

### 🏢 teamsService

Gerenciamento de times.

**Métodos:**
- `create(data)` - Cria time
- `findAll(params)` - Lista times
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza
- `getSubTimes(id)` - Lista sub-times do time
- `getMembers(id)` - Lista membros
- `remove(id)` - Deleta

---

### 👨‍👩‍👧‍👦 subtimesService

Gerenciamento de sub-times.

**Métodos:**
- `create(data)` - Cria sub-time
- `findAll(params)` - Lista sub-times
- `findByTeam(teamId)` - Lista por time
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza
- `getMembers(id)` - Lista membros
- `remove(id)` - Deleta

---

### 🏭 machinesService

Gerenciamento de máquinas/equipamentos.

**Métodos:**
- `create(data)` - Cria máquina
- `findAll(params)` - Lista máquinas
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza
- `getSkills(id)` - Lista skills da máquina
- `remove(id)` - Deleta

---

### 🔧 skillsService

Gerenciamento de competências/habilidades.

**Métodos:**
- `create(data)` - Cria skill
- `findAll(params)` - Lista skills
- `findByMachine(machineId)` - Lista por máquina
- `findBySubTime(subtimeId)` - Lista por sub-time
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza
- `remove(id)` - Deleta

---

### ⭐ evaluationsService

Sistema completo de avaliações com workflow.

**Métodos:**
- `create(data)` - Cria avaliação
- `findAll(params)` - Lista avaliações
- `findByTecnico(tecnicoId)` - Lista por técnico
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza (apenas draft)
- `submit(id, data)` - Submete para aprovação
- `approve(id, data)` - Aprova/rejeita (Master)
- `remove(id)` - Deleta

**Exemplo:**
```typescript
const evaluation = await evaluationsService.submit(evaluationId, {
  finalComments: 'Avaliação completa'
})
// Status muda para 'submitted'
```

---

### 📝 quarterlyNotesService

Notas trimestrais dos técnicos.

**Métodos:**
- `create(data)` - Cria nota trimestral
- `findAll(params)` - Lista notas
- `findByTecnico(tecnicoId)` - Lista por técnico
- `findOne(id)` - Busca por ID
- `update(id, data)` - Atualiza
- `remove(id)` - Deleta

---

### 📊 analyticsService

Dashboards, métricas e relatórios.

**Métodos:**
- `getDashboard(teamId?, period?)` - Métricas principais
- `getPerformanceTrends(...)` - Tendências de desempenho
- `getSkillsMatrix(...)` - Matriz de competências
- `getTopPerformers(...)` - Top performers
- `getSkillsCoverage(...)` - Cobertura de skills
- `getTeamComparison(...)` - Comparação entre times
- `getQuarterlyReport(quarter, year)` - Relatório trimestral
- `getSkillGaps(teamId?)` - Análise de gaps

**Exemplo:**
```typescript
const metrics = await analyticsService.getDashboard()
console.log('Total técnicos:', metrics.totalTecnicos)
console.log('Média score:', metrics.averageScore)
```

---

## 🔧 API Client

### Configuração Automática

O `api-client.ts` já está configurado com:

✅ **Base URL** - Lê de `NEXT_PUBLIC_API_URL`  
✅ **Interceptors** - Adiciona token automaticamente  
✅ **Renovação de Token** - Renova access token quando expira  
✅ **Tratamento de Erros** - Redireciona para login se necessário  

### Interceptors Implementados

#### Request Interceptor
```typescript
// Adiciona token automaticamente em todas as requisições
Authorization: Bearer {accessToken}
```

#### Response Interceptor
```typescript
// Renova token automaticamente se receber 401
if (erro === 401 && não é /auth/login) {
  1. Tenta renovar com refresh token
  2. Se sucesso, retenta requisição original
  3. Se falha, redireciona para /login
}
```

---

## 📝 Tipos TypeScript

Todos os tipos estão definidos em `core/types/api.types.ts`:

```typescript
import type {
  User,
  Tecnico,
  Team,
  SubTeam,
  Machine,
  Skill,
  Evaluation,
  QuarterlyNote,
  // ... etc
} from '@/core/types'
```

---

## ⚠️ Tratamento de Erros

Todos os serviços lançam exceções com mensagens descritivas:

```typescript
try {
  const tecnicos = await tecnicosService.findAll()
} catch (error) {
  console.error('Erro:', error.message)
  // Exibir mensagem para usuário
}
```

### Mensagens de Erro

Os erros retornados pelos serviços já estão formatados e podem ser exibidos diretamente ao usuário.

---

## 🔗 Links

- **Guia Completo de Uso:** [GUIA_DE_USO_INTEGRACAO.md](../../docs/GUIA_DE_USO_INTEGRACAO.md)
- **Documentação da API:** [docs/integration/README.md](../../docs/integration/README.md)
- **Tipos:** [core/types/api.types.ts](../types/api.types.ts)
- **Constantes:** [core/constants/app.constants.ts](../constants/app.constants.ts)

---

## ✅ Status

- [x] API Client configurado
- [x] Interceptors implementados
- [x] 10 serviços completos
- [x] TypeScript 100%
- [x] Tratamento de erros
- [x] Documentação completa

---

**Todos os serviços estão prontos para uso! 🚀**
