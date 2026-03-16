# 📖 Guia Completo: Fluxo de Trabalho - Do Zero ao Supervisor Operando

## 🎯 Objetivo

Este guia mostra **PASSO A PASSO** como:
1. ✅ Criar um usuário Supervisor
2. ✅ Fazer login com ele
3. ✅ Criar times e sub-times
4. ✅ Cadastrar máquinas
5. ✅ Cadastrar skills
6. ✅ Cadastrar técnicos/colaboradores
7. ✅ Fazer avaliações
8. ✅ Registrar notas trimestrais
9. ✅ Visualizar analytics

---

## 📋 PRÉ-REQUISITOS

### 1. Backend rodando
```bash
# O backend deve estar rodando em http://localhost:3000
# Verifique se está acessível
curl http://localhost:3000/api/v1
```

### 2. Variável de ambiente configurada
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Usuário Master já existe
Para criar supervisores, você precisa de um usuário **Master** primeiro.  
(Normalmente criado via seed ou migração do backend)

---

## 🔐 PASSO 1: Fazer Login como Master

Primeiro, precisamos logar como Master para criar o supervisor.

### Código (Componente ou Página de Login)

```typescript
'use client'

import { useState } from 'react'
import { authService } from '@/core/services'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Fazer login
      const response = await authService.login({ email, password })
      
      console.log('✅ Login realizado com sucesso!')
      console.log('Access Token:', response.accessToken)
      
      // 2. Buscar dados do usuário
      const user = await authService.me()
      console.log('👤 Usuário:', user.name)
      console.log('🔑 Role:', user.role)
      
      // 3. Salvar no localStorage (opcional, mas útil)
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      // 4. Redirecionar
      router.push('/dashboard')
      
    } catch (err) {
      console.error('❌ Erro no login:', err)
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login - SkillFix</h1>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@skillfix.com"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
```

### 🎯 Resultado Esperado:
```
✅ Login realizado com sucesso!
Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
👤 Usuário: Administrador Master
🔑 Role: master
```

---

## 👤 PASSO 2: Criar Usuário Supervisor

Agora que estamos logados como Master, vamos criar o supervisor.

### Código (Página de Criação de Usuário)

```typescript
'use client'

import { useState } from 'react'
import { usersService } from '@/core/services'
import type { UserRole, Workday } from '@/core/types'

export default function CreateSupervisorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'supervisor' as UserRole,
    workday: 'diurno' as Workday
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Criar supervisor
      const newUser = await usersService.create(formData)
      
      console.log('✅ Supervisor criado com sucesso!')
      console.log('📧 Email:', newUser.email)
      console.log('👤 Nome:', newUser.name)
      console.log('🔑 Role:', newUser.role)
      console.log('🌞 Turno:', newUser.workday)
      
      setSuccess(true)
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'supervisor',
        workday: 'diurno'
      })
      
    } catch (err) {
      console.error('❌ Erro ao criar supervisor:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Supervisor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nome Completo */}
        <div>
          <label className="block font-medium mb-2">Nome Completo *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: João Silva Santos"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="joao.silva@empresa.com"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block font-medium mb-2">Senha *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Mínimo 8 caracteres"
            className="w-full border p-3 rounded"
            minLength={8}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Mínimo 8 caracteres
          </p>
        </div>

        {/* Turno */}
        <div>
          <label className="block font-medium mb-2">Turno</label>
          <select
            value={formData.workday}
            onChange={(e) => setFormData({ ...formData, workday: e.target.value as Workday })}
            className="w-full border p-3 rounded"
          >
            <option value="diurno">☀️ Diurno</option>
            <option value="noturno">🌙 Noturno</option>
          </select>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Supervisor criado com sucesso! Agora ele pode fazer login.
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50 font-medium"
        >
          {loading ? '⏳ Criando...' : '✅ Criar Supervisor'}
        </button>
      </form>
    </div>
  )
}
```

### 🎯 Exemplo de Dados:
```
Nome: João Silva Santos
Email: joao.silva@empresa.com
Senha: Supervisor@2026
Turno: Diurno
```

### ✅ Resultado:
```
✅ Supervisor criado com sucesso!
📧 Email: joao.silva@empresa.com
👤 Nome: João Silva Santos
🔑 Role: supervisor
🌞 Turno: diurno
```

---

## 🚪 PASSO 3: Fazer Logout e Login como Supervisor

### 3.1 Fazer Logout

```typescript
import { authService } from '@/core/services'
import { useRouter } from 'next/navigation'

function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await authService.logout()
      console.log('✅ Logout realizado')
      router.push('/login')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  return (
    <button onClick={handleLogout}>
      🚪 Sair
    </button>
  )
}
```

### 3.2 Login como Supervisor

Use o mesmo formulário de login do PASSO 1, mas com as credenciais do supervisor:

```
Email: joao.silva@empresa.com
Senha: Supervisor@2026
```

### 🎯 Resultado:
```
✅ Login realizado com sucesso!
👤 Usuário: João Silva Santos
🔑 Role: supervisor
```

---

## 🏢 PASSO 4: Criar Time

Agora como Supervisor, vamos criar um time.

```typescript
'use client'

import { useState } from 'react'
import { teamsService } from '@/core/services'

export default function CreateTeamPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    color: '#0096d6'
  })
  const [loading, setLoading] = useState(false)
  const [createdTeam, setCreatedTeam] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const team = await teamsService.create(formData)
      
      console.log('✅ Time criado!')
      console.log('🏢 Nome:', team.name)
      console.log('🆔 ID:', team.id)
      console.log('🎨 Cor:', team.color)
      
      setCreatedTeam(team)
      
      // Salvar ID para usar depois
      localStorage.setItem('lastCreatedTeamId', team.id)
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar time')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Time</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Nome do Time *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Time de Produção"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Responsável pela área de produção..."
            className="w-full border p-3 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Departamento</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Ex: Produção"
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Cor do Time</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full h-12 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '⏳ Criando...' : '✅ Criar Time'}
        </button>
      </form>

      {createdTeam && (
        <div className="mt-6 bg-green-100 border border-green-400 p-4 rounded">
          <h3 className="font-bold mb-2">✅ Time Criado com Sucesso!</h3>
          <p><strong>ID:</strong> {createdTeam.id}</p>
          <p><strong>Nome:</strong> {createdTeam.name}</p>
          <p className="text-sm text-gray-600 mt-2">
            💾 ID salvo no localStorage para próximos passos
          </p>
        </div>
      )}
    </div>
  )
}
```

### 🎯 Exemplo:
```
Nome: Time de Injeção Plástica
Descrição: Responsável pela operação de injetoras
Departamento: Produção
Cor: #0096d6
```

### ✅ Resultado:
```
✅ Time criado!
🏢 Nome: Time de Injeção Plástica
🆔 ID: bdb03293-da37-4998-a81d-b5f0344816ff
🎨 Cor: #0096d6
```

---

## 👨‍👩‍👧‍👦 PASSO 5: Criar Sub-Time

```typescript
'use client'

import { useState } from 'react'
import { subtimesService } from '@/core/services'
import type { TeamFunction, EvaluationCriteria } from '@/core/types'

export default function CreateSubTimePage() {
  // Pegar o ID do time criado anteriormente
  const teamId = localStorage.getItem('lastCreatedTeamId') || ''
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentTeamId: teamId,
    functions: [] as TeamFunction[],
    evaluationCriteria: [] as EvaluationCriteria[]
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      // Adicionar funções padrão
      const functions: TeamFunction[] = [
        {
          id: '1',
          name: 'Operador de Máquina',
          description: 'Opera injetoras',
          responsibilities: 'Setup, operação, limpeza'
        },
        {
          id: '2',
          name: 'Auxiliar',
          description: 'Auxilia operador',
          responsibilities: 'Preparação de materiais, organização'
        }
      ]

      // Adicionar critérios de avaliação
      const evaluationCriteria: EvaluationCriteria[] = [
        {
          id: '1',
          name: 'Qualidade',
          description: 'Qualidade do trabalho executado',
          weight: 30,
          maxScore: 100
        },
        {
          id: '2',
          name: 'Produtividade',
          description: 'Quantidade produzida',
          weight: 25,
          maxScore: 100
        },
        {
          id: '3',
          name: 'Segurança',
          description: 'Cumprimento das normas',
          weight: 25,
          maxScore: 100
        },
        {
          id: '4',
          name: 'Pontualidade',
          description: 'Assiduidade e pontualidade',
          weight: 20,
          maxScore: 100
        }
      ]

      const subtime = await subtimesService.create({
        ...formData,
        functions,
        evaluationCriteria
      })

      console.log('✅ Sub-time criado!')
      console.log('👨‍👩‍👧‍👦 Nome:', subtime.name)
      console.log('🆔 ID:', subtime.id)
      console.log('📋 Funções:', subtime.functions.length)
      console.log('⭐ Critérios:', subtime.evaluationCriteria.length)

      // Salvar para próximo passo
      localStorage.setItem('lastCreatedSubtimeId', subtime.id)

      alert('✅ Sub-time criado com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar sub-time')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Sub-Time</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Time Pai (ID)</label>
          <input
            type="text"
            value={formData.parentTeamId}
            onChange={(e) => setFormData({ ...formData, parentTeamId: e.target.value })}
            className="w-full border p-3 rounded bg-gray-50"
            required
            readOnly
          />
          <p className="text-sm text-gray-500">
            ℹ️ Usando o ID do time criado anteriormente
          </p>
        </div>

        <div>
          <label className="block font-medium mb-2">Nome do Sub-Time *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Turno A - Injeção"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Turno diurno de injeção..."
            className="w-full border p-3 rounded"
            rows={3}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Funções e Critérios de Avaliação</strong> serão criados automaticamente:
          </p>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
            <li>Operador de Máquina</li>
            <li>Auxiliar</li>
            <li>Critérios: Qualidade (30%), Produtividade (25%), Segurança (25%), Pontualidade (20%)</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          ✅ Criar Sub-Time
        </button>
      </form>
    </div>
  )
}
```

### 🎯 Exemplo:
```
Nome: Turno A - Injeção
Descrição: Turno diurno de operação de injetoras
```

### ✅ Resultado:
```
✅ Sub-time criado!
👨‍👩‍👧‍👦 Nome: Turno A - Injeção
🆔 ID: 028a97e8-9937-4a6d-8c82-5e3c59f2e3c6
📋 Funções: 2
⭐ Critérios: 4
```

---

## 🏭 PASSO 6: Criar Máquina

```typescript
'use client'

import { useState } from 'react'
import { machinesService } from '@/core/services'

export default function CreateMachinePage() {
  const teamId = localStorage.getItem('lastCreatedTeamId') || ''
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    teamId: teamId,
    manufacturer: '',
    model: '',
    installationDate: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const machine = await machinesService.create(formData)

      console.log('✅ Máquina criada!')
      console.log('🏭 Nome:', machine.name)
      console.log('🔢 Código:', machine.code)
      console.log('🆔 ID:', machine.id)

      localStorage.setItem('lastCreatedMachineId', machine.id)

      alert('✅ Máquina criada com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar máquina')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cadastrar Máquina</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Nome da Máquina *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Injetora 150T"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Código *</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="Ex: MAQ-001"
            className="w-full border p-3 rounded font-mono"
            pattern="MAQ-[0-9]{3}"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Formato: MAQ-XXX (ex: MAQ-001)
          </p>
        </div>

        <div>
          <label className="block font-medium mb-2">Fabricante</label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            placeholder="Ex: Arburg"
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Modelo</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Ex: Allrounder 420C"
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Data de Instalação</label>
          <input
            type="date"
            value={formData.installationDate}
            onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Injetora de 150 toneladas para peças técnicas..."
            className="w-full border p-3 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          ✅ Cadastrar Máquina
        </button>
      </form>
    </div>
  )
}
```

### 🎯 Exemplo:
```
Nome: Injetora 150T
Código: MAQ-001
Fabricante: Arburg
Modelo: Allrounder 420C
Data: 2020-01-15
```

### ✅ Resultado:
```
✅ Máquina criada!
🏭 Nome: Injetora 150T
🔢 Código: MAQ-001
🆔 ID: f3b2c4d5-6789-01ab-cdef-234567890abc
```

---

## 🔧 PASSO 7: Criar Skill (Competência)

```typescript
'use client'

import { useState } from 'react'
import { skillsService } from '@/core/services'
import type { SkillLevel } from '@/core/types'

export default function CreateSkillPage() {
  const machineId = localStorage.getItem('lastCreatedMachineId') || ''
  const teamId = localStorage.getItem('lastCreatedTeamId') || ''
  const subtimeId = localStorage.getItem('lastCreatedSubtimeId') || ''

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    machineId: machineId,
    teamId: teamId,
    subtimeId: subtimeId,
    level: 'Intermediário' as SkillLevel
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const skill = await skillsService.create(formData)

      console.log('✅ Skill criada!')
      console.log('🔧 Nome:', skill.name)
      console.log('📊 Nível:', skill.level)
      console.log('🆔 ID:', skill.id)

      alert('✅ Skill criada com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar skill')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Competência (Skill)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Nome da Competência *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Operação de Injetora 150T"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Categoria *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ex: Injeção Plástica"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Nível *</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as SkillLevel })}
            className="w-full border p-3 rounded"
            required
          >
            <option value="Básico">⭐ Básico</option>
            <option value="Intermediário">⭐⭐ Intermediário</option>
            <option value="Avançado">⭐⭐⭐ Avançado</option>
            <option value="Especialista">⭐⭐⭐⭐ Especialista</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Capacidade de operar injetora 150T incluindo setup..."
            className="w-full border p-3 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          ✅ Criar Skill
        </button>
      </form>
    </div>
  )
}
```

### 🎯 Exemplo:
```
Nome: Operação de Injetora 150T
Categoria: Injeção Plástica
Nível: Intermediário
Descrição: Operação completa incluindo setup e ajustes
```

---

## 👷 PASSO 8: Cadastrar Técnico/Colaborador

```typescript
'use client'

import { useState } from 'react'
import { tecnicosService } from '@/core/services'

export default function CreateTecnicoPage() {
  const teamId = localStorage.getItem('lastCreatedTeamId') || ''
  const subtimeId = localStorage.getItem('lastCreatedSubtimeId') || ''

  const [formData, setFormData] = useState({
    name: '',
    employeeNumber: '',
    position: '',
    teamId: teamId,
    subtimeId: subtimeId,
    email: '',
    phone: '',
    admissionDate: '',
    birthDate: '',
    notes: ''
  })

  const [createdTecnico, setCreatedTecnico] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const tecnico = await tecnicosService.create(formData)

      console.log('✅ Técnico criado!')
      console.log('👷 Nome:', tecnico.name)
      console.log('🔢 Matrícula:', tecnico.employeeNumber)
      console.log('🆔 ID:', tecnico.id)

      setCreatedTecnico(tecnico)
      localStorage.setItem('lastCreatedTecnicoId', tecnico.id)

      alert('✅ Técnico cadastrado com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar técnico')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cadastrar Técnico/Colaborador</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nome */}
        <div>
          <label className="block font-medium mb-2">Nome Completo *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Carlos Alberto da Silva"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* Matrícula */}
        <div>
          <label className="block font-medium mb-2">Matrícula *</label>
          <input
            type="text"
            value={formData.employeeNumber}
            onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value.toUpperCase() })}
            placeholder="Ex: EMP-12345"
            className="w-full border p-3 rounded font-mono"
            required
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="block font-medium mb-2">Cargo *</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Ex: Operador de Produção"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="carlos.silva@empresa.com"
            className="w-full border p-3 rounded"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block font-medium mb-2">Telefone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(11) 98765-4321"
            className="w-full border p-3 rounded"
          />
        </div>

        {/* Data de Admissão */}
        <div>
          <label className="block font-medium mb-2">Data de Admissão *</label>
          <input
            type="date"
            value={formData.admissionDate}
            onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block font-medium mb-2">Data de Nascimento</label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* Observações */}
        <div>
          <label className="block font-medium mb-2">Observações</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Experiência anterior, certificações, etc..."
            className="w-full border p-3 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 font-medium"
        >
          ✅ Cadastrar Técnico
        </button>
      </form>

      {createdTecnico && (
        <div className="mt-6 bg-green-100 border border-green-400 p-4 rounded">
          <h3 className="font-bold mb-2">✅ Técnico Cadastrado!</h3>
          <p><strong>Nome:</strong> {createdTecnico.name}</p>
          <p><strong>Matrícula:</strong> {createdTecnico.employeeNumber}</p>
          <p><strong>Cargo:</strong> {createdTecnico.position}</p>
        </div>
      )}
    </div>
  )
}
```

### 🎯 Exemplo:
```
Nome: Carlos Alberto da Silva
Matrícula: EMP-12345
Cargo: Operador de Produção
Email: carlos.silva@empresa.com
Telefone: (11) 98765-4321
Admissão: 2024-01-15
Nascimento: 1985-06-20
```

### ✅ Resultado:
```
✅ Técnico criado!
👷 Nome: Carlos Alberto da Silva
🔢 Matrícula: EMP-12345
🆔 ID: e1f2g3h4-5678-90ab-cdef-1234567890cd
```

---

## ⭐ PASSO 9: Criar Avaliação

```typescript
'use client'

import { useState, useEffect } from 'react'
import { evaluationsService, authService } from '@/core/services'
import type { EvaluationType } from '@/core/types'

export default function CreateEvaluationPage() {
  const tecnicoId = localStorage.getItem('lastCreatedTecnicoId') || ''
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  async function loadCurrentUser() {
    try {
      const user = await authService.me()
      setCurrentUser(user)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
    }
  }

  async function handleCreateEvaluation() {
    if (!currentUser) {
      alert('Carregando dados do usuário...')
      return
    }

    try {
      const evaluation = await evaluationsService.create({
        type: 'quarterly' as EvaluationType,
        quarter: 1,  // 1º trimestre
        year: 2026,
        tecnicoId: tecnicoId,
        evaluatorId: currentUser.id,
        criteria: [
          {
            name: 'Qualidade do Trabalho',
            description: 'Precisão e atenção aos detalhes',
            weight: 30,
            score: 85,
            maxScore: 100,
            comments: 'Excelente qualidade nas peças produzidas'
          },
          {
            name: 'Produtividade',
            description: 'Quantidade produzida no período',
            weight: 25,
            score: 90,
            maxScore: 100,
            comments: 'Superou a meta de produção'
          },
          {
            name: 'Segurança',
            description: 'Cumprimento das normas de segurança',
            weight: 25,
            score: 95,
            maxScore: 100,
            comments: 'Sempre utiliza EPIs corretamente'
          },
          {
            name: 'Pontualidade',
            description: 'Assiduidade e pontualidade',
            weight: 20,
            score: 88,
            maxScore: 100,
            comments: 'Pontual e assíduo'
          }
        ],
        generalComments: 'Excelente desempenho geral neste trimestre. Colaborador proativo e dedicado.',
        strengths: 'Qualidade técnica, trabalho em equipe, iniciativa',
        improvements: 'Melhorar documentação dos processos',
        goals: 'Treinar novos operadores, reduzir setup em 10%'
      })

      console.log('✅ Avaliação criada!')
      console.log('⭐ Score Total:', evaluation.totalScore)
      console.log('📊 Status:', evaluation.status)
      console.log('🆔 ID:', evaluation.id)

      localStorage.setItem('lastCreatedEvaluationId', evaluation.id)

      // Agora vamos submeter para aprovação
      const submitted = await evaluationsService.submit(evaluation.id, {
        finalComments: 'Avaliação completa e revisada. Pronta para aprovação.'
      })

      console.log('✅ Avaliação submetida!')
      console.log('📊 Status:', submitted.status)  // agora é 'submitted'

      alert('✅ Avaliação criada e submetida para aprovação!')
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar avaliação')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Avaliação Trimestral</h1>

      {currentUser && (
        <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded">
          <p><strong>Avaliador:</strong> {currentUser.name}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
        </div>
      )}

      <div className="bg-gray-50 border p-6 rounded mb-6">
        <h2 className="text-xl font-bold mb-4">📋 Critérios de Avaliação</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>1. Qualidade do Trabalho (peso 30%)</span>
            <span className="font-bold">85/100</span>
          </div>
          <div className="flex justify-between">
            <span>2. Produtividade (peso 25%)</span>
            <span className="font-bold">90/100</span>
          </div>
          <div className="flex justify-between">
            <span>3. Segurança (peso 25%)</span>
            <span className="font-bold">95/100</span>
          </div>
          <div className="flex justify-between">
            <span>4. Pontualidade (peso 20%)</span>
            <span className="font-bold">88/100</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Score Total Calculado:</span>
            <span className="text-green-600">88.95</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreateEvaluation}
        className="w-full bg-green-500 text-white p-4 rounded hover:bg-green-600 font-bold text-lg"
      >
        ✅ Criar e Submeter Avaliação
      </button>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
        <p className="text-sm text-yellow-800">
          ℹ️ <strong>Próximo passo:</strong> Um usuário Master precisará aprovar esta avaliação.
        </p>
      </div>
    </div>
  )
}
```

### ✅ Resultado:
```
✅ Avaliação criada!
⭐ Score Total: 88.95
📊 Status: draft
🆔 ID: a1b2c3d4-5678-90ab-cdef-1234567890ef

✅ Avaliação submetida!
📊 Status: submitted
```

---

## 📝 PASSO 10: Criar Nota Trimestral

```typescript
'use client'

import { useState, useEffect } from 'react'
import { quarterlyNotesService, authService } from '@/core/services'

export default function CreateQuarterlyNotePage() {
  const tecnicoId = localStorage.getItem('lastCreatedTecnicoId') || ''
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  async function loadCurrentUser() {
    const user = await authService.me()
    setCurrentUser(user)
  }

  async function handleCreateNote() {
    if (!currentUser) return

    try {
      const note = await quarterlyNotesService.create({
        quarter: 1,  // 1º trimestre
        year: 2026,
        score: 88.95,  // Usar o score da avaliação
        evaluatedDate: '2026-03-31',  // Último dia do trimestre
        notes: 'Excelente desempenho no 1º trimestre. Superou expectativas em produtividade e segurança.',
        tecnicoId: tecnicoId,
        evaluatorId: currentUser.id,
        breakdown: {
          'Qualidade': 85,
          'Produtividade': 90,
          'Segurança': 95,
          'Pontualidade': 88
        }
      })

      console.log('✅ Nota trimestral criada!')
      console.log('📝 Score:', note.score)
      console.log('📅 Trimestre:', `Q${note.quarter}/${note.year}`)
      console.log('🆔 ID:', note.id)

      alert('✅ Nota trimestral registrada com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar nota')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Registrar Nota Trimestral</h1>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded mb-6">
        <h2 className="font-bold mb-4">📊 Resumo da Nota</h2>
        <div className="space-y-2">
          <p><strong>Trimestre:</strong> Q1/2026 (Janeiro - Março)</p>
          <p><strong>Score Final:</strong> 88.95</p>
          <p><strong>Data de Avaliação:</strong> 31/03/2026</p>
        </div>

        <h3 className="font-bold mt-4 mb-2">Detalhamento por Critério:</h3>
        <ul className="space-y-1">
          <li>• Qualidade: 85</li>
          <li>• Produtividade: 90</li>
          <li>• Segurança: 95</li>
          <li>• Pontualidade: 88</li>
        </ul>
      </div>

      <button
        onClick={handleCreateNote}
        className="w-full bg-blue-500 text-white p-4 rounded hover:bg-blue-600 font-bold"
      >
        ✅ Registrar Nota Trimestral
      </button>
    </div>
  )
}
```

### ✅ Resultado:
```
✅ Nota trimestral criada!
📝 Score: 88.95
📅 Trimestre: Q1/2026
🆔 ID: b2c3d4e5-6789-01ab-cdef-234567890fgh
```

---

## 📊 PASSO 11: Visualizar Analytics

```typescript
'use client'

import { useEffect, useState } from 'react'
import { analyticsService } from '@/core/services'

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      // Métricas principais
      const dashboardMetrics = await analyticsService.getDashboard()
      setMetrics(dashboardMetrics)

      // Top performers
      const performers = await analyticsService.getTopPerformers(5)
      setTopPerformers(performers)

      console.log('📊 Dashboard carregado!')
      
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard de Analytics</h1>

      {/* Métricas Principais */}
      {metrics && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-6 rounded">
            <h3 className="text-sm text-gray-600 mb-2">Total de Técnicos</h3>
            <p className="text-3xl font-bold">{metrics.totalTecnicos}</p>
          </div>
          
          <div className="bg-green-100 p-6 rounded">
            <h3 className="text-sm text-gray-600 mb-2">Média de Score</h3>
            <p className="text-3xl font-bold">{metrics.averageScore}</p>
          </div>
          
          <div className="bg-purple-100 p-6 rounded">
            <h3 className="text-sm text-gray-600 mb-2">Média de Skills</h3>
            <p className="text-3xl font-bold">{metrics.averageSkillLevel}</p>
          </div>
        </div>
      )}

      {/* Top Performers */}
      <div className="bg-white border rounded p-6">
        <h2 className="text-xl font-bold mb-4">🏆 Top Performers</h2>
        <div className="space-y-3">
          {topPerformers.map((performer) => (
            <div key={performer.rank} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-400">#{performer.rank}</span>
                <div>
                  <p className="font-bold">{performer.name}</p>
                  <p className="text-sm text-gray-600">{performer.area}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{performer.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### ✅ Resultado:
```
📊 Dashboard carregado!

Total de Técnicos: 1
Média de Score: 88.95
Média de Skills: 0.00

🏆 Top Performers:
#1 Carlos Alberto da Silva - 88.95 pontos
```

---

## 🎉 CONCLUSÃO

**Parabéns!** Você completou todo o fluxo! 🚀

### ✅ O que foi feito:

1. ✅ Login como Master
2. ✅ Criado supervisor "João Silva Santos"
3. ✅ Login como Supervisor
4. ✅ Criado Time "Time de Injeção Plástica"
5. ✅ Criado Sub-Time "Turno A - Injeção"
6. ✅ Cadastrada Máquina "Injetora 150T" (MAQ-001)
7. ✅ Criada Skill "Operação de Injetora 150T"
8. ✅ Cadastrado Técnico "Carlos Alberto da Silva"
9. ✅ Criada Avaliação Trimestral (Q1/2026)
10. ✅ Registrada Nota Trimestral (88.95)
11. ✅ Visualizado Dashboard de Analytics

### 📊 Dados Criados:

```
👤 Usuários: 2 (1 Master + 1 Supervisor)
🏢 Times: 1
👨‍👩‍👧‍👦 Sub-Times: 1
🏭 Máquinas: 1
🔧 Skills: 1
👷 Técnicos: 1
⭐ Avaliações: 1
📝 Notas Trimestrais: 1
```

### 🔄 Próximos Passos:

- Adicionar mais técnicos
- Criar mais avaliações
- Adicionar fotos aos técnicos
- Explorar relatórios de analytics
- Comparar performance entre times

---

## 💾 IDs Salvos no localStorage

Durante o processo, foram salvos:
- `lastCreatedTeamId`
- `lastCreatedSubtimeId`
- `lastCreatedMachineId`
- `lastCreatedTecnicoId`
- `lastCreatedEvaluationId`
- `currentUser`

Você pode usar esses IDs para continuar testando! 🎯
