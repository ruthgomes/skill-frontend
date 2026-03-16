# 🚀 Guia de Uso - Serviços de Integração com Backend

## 📋 Índice

1. [Introdução](#introdução)
2. [Configuração Inicial](#configuração-inicial)
3. [Autenticação](#autenticação)
4. [Uso dos Serviços](#uso-dos-serviços)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 Introdução

Este guia explica como usar os serviços de integração com o backend SkillFix que foram criados. Todos os serviços estão localizados em `core/services/` e são executados automaticamente no cliente (client-side).

### Estrutura de Arquivos

```
core/
├── services/
│   ├── api-client.ts          # Cliente Axios configurado
│   ├── auth.service.ts         # Autenticação
│   ├── users.service.ts        # Usuários
│   ├── tecnicos.service.ts     # Técnicos
│   ├── teams.service.ts        # Times
│   ├── subtimes.service.ts     # Sub-times
│   ├── machines.service.ts     # Máquinas
│   ├── skills.service.ts       # Skills
│   ├── evaluations.service.ts  # Avaliações
│   ├── quarterly-notes.service.ts  # Notas Trimestrais
│   ├── analytics.service.ts    # Analytics
│   └── index.ts                # Exports centralizados
├── types/
│   ├── api.types.ts            # Tipos TypeScript
│   └── index.ts
└── constants/
    └── app.constants.ts        # API_CONFIG e endpoints
```

---

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Instalar Dependências

```bash
npm install axios
# ou
pnpm install axios
# ou
yarn add axios
```

### 3. TypeScript

Todos os tipos já estão definidos em `core/types/api.types.ts`. Eles são automaticamente importados pelos serviços.

---

## 🔐 Autenticação

### Login Básico

```typescript
import { authService } from '@/core/services'

// Em um componente ou página
async function handleLogin(email: string, password: string) {
  try {
    const response = await authService.login({ email, password })
    
    // Tokens já são salvos automaticamente no localStorage
    console.log('Login realizado com sucesso!')
    console.log('Access Token:', response.accessToken)
    
    // Redirecionar usuário
    router.push('/dashboard')
  } catch (error) {
    console.error('Erro no login:', error.message)
  }
}
```

### Verificar Autenticação

```typescript
import { authService } from '@/core/services'

// Verificar se usuário está logado
if (authService.isAuthenticated()) {
  console.log('Usuário está autenticado')
} else {
  console.log('Usuário não está autenticado')
  router.push('/login')
}
```

### Buscar Dados do Usuário Logado

```typescript
import { authService } from '@/core/services'

async function loadUserData() {
  try {
    const user = await authService.me()
    console.log('Usuário logado:', user.name)
    console.log('Role:', user.role)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
  }
}
```

### Logout

```typescript
import { authService } from '@/core/services'

async function handleLogout() {
  try {
    await authService.logout()
    // Tokens já são limpos automaticamente
    router.push('/login')
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}
```

---

## 📦 Uso dos Serviços

### 1. Técnicos (Tecnicos Service)

#### Listar Técnicos

```typescript
import { tecnicosService } from '@/core/services'

async function loadTecnicos() {
  try {
    // Sem filtros (todos)
    const tecnicos = await tecnicosService.findAll()
    console.log('Técnicos:', tecnicos)
    
    // Com filtros
    const filtered = await tecnicosService.findAll({
      search: 'João',
      teamId: 'team-uuid-123',
      status: true,
      page: 1,
      limit: 20
    })
    console.log('Técnicos filtrados:', filtered)
  } catch (error) {
    console.error('Erro ao buscar técnicos:', error)
  }
}
```

#### Criar Técnico

```typescript
import { tecnicosService } from '@/core/services'

async function createTecnico() {
  try {
    const newTecnico = await tecnicosService.create({
      name: 'João Silva',
      employeeNumber: 'EMP-12345',
      position: 'Operador de Produção',
      teamId: 'team-uuid-123',
      subtimeId: 'subtime-uuid-456',
      email: 'joao.silva@empresa.com',
      phone: '(11) 98765-4321',
      admissionDate: '2022-01-15',
      birthDate: '1990-05-20',
      notes: 'Experiência prévia'
    })
    console.log('Técnico criado:', newTecnico)
  } catch (error) {
    console.error('Erro ao criar técnico:', error)
  }
}
```

#### Upload de Foto

```typescript
import { tecnicosService } from '@/core/services'

async function uploadPhoto(tecnicoId: string, file: File) {
  try {
    const updated = await tecnicosService.uploadPhoto(tecnicoId, file)
    console.log('Foto atualizada:', updated.photoUrl)
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
  }
}

// Em um componente com input file
function PhotoUpload({ tecnicoId }: { tecnicoId: string }) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadPhoto(tecnicoId, file)
    }
  }

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleFileChange} 
    />
  )
}
```

### 2. Times (Teams Service)

```typescript
import { teamsService } from '@/core/services'

// Listar todos os times
async function loadTeams() {
  const teams = await teamsService.findAll()
  console.log('Times:', teams)
}

// Criar time
async function createTeam() {
  const team = await teamsService.create({
    name: 'Time de Produção',
    description: 'Responsável pela área de produção',
    department: 'Produção',
    supervisorId: 'user-uuid-123',
    color: '#0096d6'
  })
  console.log('Time criado:', team)
}

// Buscar membros de um time
async function getTeamMembers(teamId: string) {
  const members = await teamsService.getMembers(teamId)
  console.log('Membros:', members)
}

// Buscar subtimes de um time
async function getSubTimes(teamId: string) {
  const subtimes = await teamsService.getSubTimes(teamId)
  console.log('Sub-times:', subtimes)
}
```

### 3. Usuários (Users Service)

```typescript
import { usersService } from '@/core/services'

// Listar usuários com paginação
async function loadUsers() {
  const result = await usersService.findAll({
    page: 1,
    limit: 20,
    search: 'admin',
    role: 'master'
  })
  
  console.log('Usuários:', result.data)
  console.log('Total:', result.meta.total)
  console.log('Páginas:', result.meta.totalPages)
}

// Criar novo usuário
async function createUser() {
  const user = await usersService.create({
    name: 'Admin Silva',
    email: 'admin@empresa.com',
    password: 'Senha@123',
    role: 'master',
    workday: 'diurno'
  })
  console.log('Usuário criado:', user)
}

// Alterar senha
async function changePassword() {
  const result = await usersService.changePassword({
    currentPassword: 'SenhaAntiga@123',
    newPassword: 'SenhaNova@456'
  })
  console.log(result.message)
}

// Buscar perfil próprio
async function getMyProfile() {
  const profile = await usersService.getProfile()
  console.log('Meu perfil:', profile)
}
```

### 4. Analytics (Analytics Service)

```typescript
import { analyticsService } from '@/core/services'

// Dashboard principal
async function loadDashboard() {
  const metrics = await analyticsService.getDashboard()
  console.log('Total de técnicos:', metrics.totalTecnicos)
  console.log('Média de score:', metrics.averageScore)
  console.log('Média de skills:', metrics.averageSkillLevel)
}

// Top performers
async function loadTopPerformers() {
  const topPerformers = await analyticsService.getTopPerformers(10)
  topPerformers.forEach(performer => {
    console.log(`#${performer.rank} ${performer.name}: ${performer.score}`)
  })
}

// Relatório trimestral
async function loadQuarterlyReport() {
  const report = await analyticsService.getQuarterlyReport(1, 2026)
  console.log('Relatório Q1/2026:', report)
  console.log('Total de avaliações:', report.totalEvaluations)
  console.log('Média geral:', report.averageScore)
}

// Skills gaps (competências críticas)
async function loadSkillGaps() {
  const gaps = await analyticsService.getSkillGaps()
  console.log(`Total de gaps: ${gaps.totalGaps}`)
  gaps.gaps.forEach(gap => {
    console.log(`${gap.tecnicoName} - ${gap.skillName}: ${gap.gap} pontos (${gap.priority})`)
  })
}
```

### 5. Avaliações (Evaluations Service)

```typescript
import { evaluationsService } from '@/core/services'

// Criar avaliação
async function createEvaluation() {
  const evaluation = await evaluationsService.create({
    type: 'quarterly',
    quarter: 1,
    year: 2026,
    tecnicoId: 'tecnico-uuid-123',
    evaluatorId: 'user-uuid-456',
    criteria: [
      {
        name: 'Qualidade do Trabalho',
        weight: 30,
        score: 85,
        maxScore: 100,
        comments: 'Ótimo desempenho'
      },
      {
        name: 'Pontualidade',
        weight: 20,
        score: 90,
        maxScore: 100
      }
    ],
    generalComments: 'Excelente trabalho neste trimestre',
    strengths: 'Proativo, colaborativo',
    improvements: 'Melhorar documentação'
  })
  console.log('Avaliação criada:', evaluation)
}

// Submeter para aprovação
async function submitEvaluation(evaluationId: string) {
  const submitted = await evaluationsService.submit(evaluationId, {
    finalComments: 'Avaliação completa e revisada'
  })
  console.log('Status:', submitted.status) // 'submitted'
}

// Aprovar avaliação (somente Master)
async function approveEvaluation(evaluationId: string) {
  const approved = await evaluationsService.approve(evaluationId, {
    approved: true,
    comments: 'Aprovado'
  })
  console.log('Status:', approved.status) // 'approved'
}
```

---

## ⚠️ Tratamento de Erros

Todos os serviços lançam exceções com mensagens descritivas. Use try/catch:

```typescript
import { tecnicosService } from '@/core/services'

async function safeLoadTecnicos() {
  try {
    const tecnicos = await tecnicosService.findAll()
    return tecnicos
  } catch (error) {
    if (error instanceof Error) {
      // Erro com mensagem do backend
      console.error('Erro:', error.message)
      
      // Exibir para o usuário
      alert(`Erro: ${error.message}`)
    } else {
      console.error('Erro desconhecido:', error)
    }
    return []
  }
}
```

### Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | Token inválido/expirado | Fazer login novamente |
| 403 Forbidden | Sem permissão | Verificar role do usuário |
| 404 Not Found | Recurso não existe | Verificar ID |
| 409 Conflict | Duplicado (email, matrícula) | Usar valores únicos |
| 500 Internal Server Error | Erro no backend | Verificar logs do servidor |

---

## 🎨 Exemplos em Componentes React

### Exemplo Completo: Lista de Técnicos

```typescript
'use client'

import { useEffect, useState } from 'react'
import { tecnicosService } from '@/core/services'
import type { Tecnico } from '@/core/types'

export function TecnicosList() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTecnicos()
  }, [])

  async function loadTecnicos() {
    try {
      setLoading(true)
      setError(null)
      const data = await tecnicosService.findAll()
      setTecnicos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar técnicos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <h1>Técnicos ({tecnicos.length})</h1>
      <ul>
        {tecnicos.map(tecnico => (
          <li key={tecnico.id}>
            {tecnico.name} - {tecnico.position}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Exemplo: Formulário de Login

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/core/services'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      await authService.login({ email, password })
      
      // Redirecionar para dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

---

## 📝 Notas Importantes

### 1. Renovação Automática de Token

O `api-client.ts` já possui interceptors que renovam automaticamente o access token quando ele expira (usando o refresh token). Você não precisa se preocupar com isso!

### 2. Client-Side Only

Todos os serviços usam `localStorage` e devem ser executados apenas no cliente. Use a diretiva `'use client'` em componentes Next.js que usam os serviços.

### 3. TypeScript

Todos os tipos estão definidos e serão verificados automaticamente. Use autocomplete do seu editor!

### 4. Variáveis de Ambiente

Lembre-se de prefixar variáveis públicas com `NEXT_PUBLIC_` para que fiquem disponíveis no browser.

---

## 🔗 Links Úteis

- [Documentação da API Backend](./integration/README.md)
- [Tipos TypeScript](../core/types/api.types.ts)
- [Constantes da Aplicação](../core/constants/app.constants.ts)
- [Cliente API](../core/services/api-client.ts)

---

## ✅ Checklist de Implementação

- [x] Cliente Axios configurado
- [x] Interceptors de autenticação
- [x] Renovação automática de token
- [x] Todos os serviços criados (10 módulos)
- [x] Tipos TypeScript completos
- [x] Tratamento de erros
- [x] Documentação completa

---

**Pronto! Agora você pode integrar o frontend com o backend do SkillFix! 🚀**
