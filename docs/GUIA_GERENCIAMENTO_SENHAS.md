# 📖 Guia Completo ATUALIZADO: Gerenciamento de Senhas e Fluxo Completo

## 🎯 Sobre Este Guia

Este documento explica **como o gerenciamento de senhas funciona** no SkillFix e fornece exemplos práticos de uso dos novos componentes.

### 🔐 Como Funciona

Baseado em: `docs/PASSWORD_MANAGEMENT.md`

1. **Criação de Usuário**: Senha é **OPCIONAL**
   - Se NÃO enviar senha → Backend gera automaticamente e retorna `temporaryPassword`
   - Se enviar senha → Usa a senha fornecida (não retorna `temporaryPassword`)

2. **Alteração de Senha**: Qualquer usuário pode alterar sua própria senha
   - Endpoint: `POST /users/change-password`
   - Precisa: senha atual + nova senha

3. **Reset de Senha**: Apenas Masters podem resetar
   - Endpoint: `POST /users/reset-password`
   - Gera nova `temporaryPassword` e retorna na resposta

---

## 📦 Componentes Prontos

Criamos 3 componentes React prontos para usar:

### 1. `CreateUserForm` - Criar Usuário com Senha Automática

```typescript
import { CreateUserForm } from '@/modules/users/components'

// Uso básico
<CreateUserForm
  onSuccess={(user) => {
    console.log('Usuário criado:', user)
    // Redirecionar ou atualizar lista
  }}
  onCancel={() => router.back()}
/>
```

**Funcionalidades:**
- ✅ Checkbox para escolher: senha automática ou manual
- ✅ Se automática: mostra senha temporária em destaque
- ✅ Botão copiar para área de transferência
- ✅ Alerta visual para anotar credenciais
- ✅ Validação de formulário
- ✅ Feedback de sucesso/erro

### 2. `ChangePasswordForm` - Alterar Própria Senha

```typescript
import { ChangePasswordForm } from '@/modules/users/components'

// Uso básico
<ChangePasswordForm
  onSuccess={() => {
    toast.success('Senha alterada!')
    router.push('/dashboard')
  }}
  onCancel={() => router.back()}
/>
```

**Funcionalidades:**
- ✅ Validação de senha atual
- ✅ Indicador de força da senha
- ✅ Requisitos de segurança em tempo real
- ✅ Confirmação de senha
- ✅ Botões mostrar/esconder senha
- ✅ Feedback visual de sucesso

### 3. `ResetPasswordDialog` - Master Reseta Senha de Usuário

```typescript
import { ResetPasswordDialog } from '@/modules/users/components'

// Uso em lista de usuários
<ResetPasswordDialog
  user={selectedUser}
  trigger={
    <Button variant="outline" size="sm">
      🔄 Resetar Senha
    </Button>
  }
  onSuccess={() => {
    toast.success('Senha resetada!')
    refreshUsersList()
  }}
/>
```

**Funcionalidades:**
- ✅ Dialog modal com informações do usuário
- ✅ Confirmação antes de resetar
- ✅ Exibe nova senha temporária
- ✅ Botão copiar credenciais
- ✅ Instruções claras
- ✅ Apenas Masters podem usar

---

## 🔄 FLUXO COMPLETO ATUALIZADO

### PASSO 1: Login como Master

```typescript
import { authService } from '@/core/services'

async function handleLogin() {
  try {
    const { accessToken } = await authService.login({
      email: 'admin@skillfix.com',
      password: 'senha_do_master'
    })
    
    const user = await authService.me()
    console.log('✅ Logado como:', user.name, '- Role:', user.role)
    
    router.push('/dashboard')
  } catch (error) {
    console.error('Erro no login:', error)
  }
}
```

---

### PASSO 2: Criar Supervisor (ATUALIZADO)

#### Opção A: Usando o Componente Pronto (Recomendado)

```typescript
// app/usuarios/criar/page.tsx
'use client'

import { CreateUserForm } from '@/modules/users/components'
import { useRouter } from 'next/navigation'

export default function CreateUserPage() {
  const router = useRouter()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreateUserForm
        onSuccess={(user) => {
          console.log('✅ Usuário criado:', user)
          // Se tiver temporaryPassword, o componente já mostra!
          // Aguardar usuário confirmar que anotou a senha
        }}
        onCancel={() => router.push('/usuarios')}
      />
    </div>
  )
}
```

#### Opção B: Código Manual (para entender a lógica)

```typescript
'use client'

import { useState } from 'react'
import { usersService } from '@/core/services'

export default function CreateUserManual() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [temporaryPassword, setTemporaryPassword] = useState('')

  async function handleCreate() {
    try {
      // ✨ NÃO ENVIAR SENHA - backend gera automaticamente
      const user = await usersService.create({
        email,
        name,
        role: 'supervisor',
        workday: 'diurno'
        // password: NÃO ENVIAR!
      })

      console.log('✅ Usuário criado!')
      console.log('📧 Email:', user.email)
      
      // ⚠️ IMPORTANTE: Backend retorna temporaryPassword aqui!
      if (user.temporaryPassword) {
        console.log('🔐 Senha Temporária:', user.temporaryPassword)
        setTemporaryPassword(user.temporaryPassword)
        // MOSTRAR NA TELA PARA O ADMIN COPIAR!
      }
      
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div>
      <h1>Criar Supervisor</h1>
      
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <button onClick={handleCreate}>Criar</button>

      {/* MOSTRAR SENHA TEMPORÁRIA */}
      {temporaryPassword && (
        <div style={{ background: 'yellow', padding: 20, marginTop: 20 }}>
          <h2>⚠️ ANOTE ESTAS CREDENCIAIS!</h2>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Senha Temporária:</strong> {temporaryPassword}</p>
          <button onClick={() => navigator.clipboard.writeText(temporaryPassword)}>
            📋 Copiar Senha
          </button>
          <p style={{ marginTop: 10, fontSize: 14 }}>
            💡 Compartilhe com o usuário e instrua-o a alterar no primeiro acesso
          </p>
        </div>
      )}
    </div>
  )
}
```

**✅ Resultado:**
```
✅ Usuário criado!
📧 Email: joao.silva@empresa.com
🔐 Senha Temporária: Xy9#aB2cD5eF
```

**📝 Anote e compartilhe com o usuário:**
- Email: joao.silva@empresa.com
- Senha: Xy9#aB2cD5eF

---

### PASSO 3: Primeiro Acesso do Supervisor

O supervisor recebe as credenciais e faz login:

1. **Login com senha temporária**

```typescript
async function handleFirstLogin() {
  try {
    await authService.login({
      email: 'joao.silva@empresa.com',
      password: 'Xy9#aB2cD5eF'  // Senha temporária
    })
    
    console.log('✅ Login realizado!')
    
    // Redirecionar para página de alterar senha
    router.push('/alterar-senha')
    
  } catch (error) {
    console.error('Erro no login:', error)
  }
}
```

2. **Alterar senha imediatamente**

#### Usando o Componente Pronto:

```typescript
// app/alterar-senha/page.tsx
'use client'

import { ChangePasswordForm } from '@/modules/users/components'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        🔒 Primeiro Acesso - Altere sua Senha
      </h1>
      
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mb-6">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Atenção:</strong> Por segurança, altere sua senha
          temporária para uma senha pessoal e segura.
        </p>
      </div>

      <ChangePasswordForm
        onSuccess={() => {
          alert('✅ Senha alterada! Faça login novamente.')
          router.push('/login')
        }}
      />
    </div>
  )
}
```

**✅ Resultado:**
```
✅ Senha alterada com sucesso!
```

---

### PASSO 4: Usuário Esqueceu a Senha

Se um usuário esquecer a senha, o **Master** pode resetar:

#### Opção A: Usando o Componente Dialog

```typescript
// Em uma lista de usuários (app/usuarios/page.tsx)
'use client'

import { useState, useEffect } from 'react'
import { usersService } from '@/core/services'
import { ResetPasswordDialog } from '@/modules/users/components'

export default function UsersListPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const response = await usersService.findAll()
    setUsers(response.data)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Usuários</h1>
      
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between border p-4 rounded">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            
            {/* Botão de Reset */}
            <ResetPasswordDialog
              user={user}
              onSuccess={() => {
                alert('✅ Senha resetada! Nova senha temporária gerada.')
                loadUsers()
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### Opção B: Código Manual

```typescript
async function handleResetPassword(userId: string) {
  try {
    const response = await usersService.resetPassword({ userId })
    
    console.log('✅ Senha resetada!')
    console.log('🔐 Nova senha temporária:', response.temporaryPassword)
    
    // MOSTRAR NA TELA PARA O ADMIN COPIAR
    alert(`Nova senha temporária: ${response.temporaryPassword}`)
    
    // Copiar para clipboard
    await navigator.clipboard.writeText(response.temporaryPassword)
    console.log('📋 Senha copiada para área de transferência!')
    
  } catch (error) {
    console.error('Erro ao resetar senha:', error)
  }
}
```

---

## 🎨 Exemplo de Página Completa

### Página de Gerenciamento de Usuários

```typescript
// app/admin/usuarios/page.tsx
'use client'

import { useState } from 'react'
import { CreateUserForm, ResetPasswordDialog } from '@/modules/users/components'
import { usersService, authService } from '@/core/services'
import { Button } from '@/components/ui/button'
import { Plus, Shield } from 'lucide-react'

export default function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    loadCurrentUser()
    loadUsers()
  }, [])

  async function loadCurrentUser() {
    const user = await authService.me()
    setCurrentUser(user)
  }

  async function loadUsers() {
    const response = await usersService.findAll()
    setUsers(response.data)
  }

  // Apenas Masters podem acessar
  if (!currentUser || currentUser.role !== 'master') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 p-4 rounded">
          <p className="text-red-800">
            ❌ Acesso negado. Apenas Masters podem gerenciar usuários.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 mt-1">
            Crie, edite e gerencie usuários do sistema
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Formulário de Criação */}
      {showCreateForm && (
        <div className="mb-8">
          <CreateUserForm
            onSuccess={(user) => {
              loadUsers()
              // Não fechar automaticamente - deixar usuário anotar senha
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Lista de Usuários */}
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user.role === 'master' ? '👑 Master' : '👤 Supervisor'}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {user.workday === 'diurno' ? '☀️ Diurno' : '🌙 Noturno'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? '✅ Ativo' : '❌ Inativo'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ResetPasswordDialog
                  user={user}
                  onSuccess={() => loadUsers()}
                />
                
                <Button variant="outline" size="sm">
                  ✏️ Editar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 Fluxo Recomendado de Onboarding

### Para Novos Usuários:

1. **Admin cria usuário** (sem enviar senha)
   - Sistema gera senha temporária automaticamente
   - Admin recebe senha na tela
   
2. **Admin compartilha credenciais**
   - Enviar por canal seguro (WhatsApp corporativo, email interno, etc)
   - Nunca por email não criptografado
   
3. **Usuário faz primeiro login**
   - Usa senha temporária recebida
   
4. **Usuário altera senha imediatamente**
   - Define senha pessoal e segura
   - Sistema valida força da senha
   
5. **Usuário opera normalmente**
   - A partir daqui, usa sempre sua senha pessoal

### Se Usuário Esquecer Senha:

1. **Usuário solicita ao Admin/Master**
2. **Master reseta a senha** via ResetPasswordDialog
3. **Master compartilha nova senha temporária**
4. **Usuário repete fluxo** (login → alterar senha)

---

## 📊 Tipos TypeScript Atualizados

```typescript
// core/types/api.types.ts

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  workday?: Workday | null
  isActive: boolean
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
  // ✨ NOVO: Senha temporária retornada apenas na criação
  temporaryPassword?: string
}

export interface CreateUserRequest {
  email: string
  password?: string  // ✨ OPCIONAL agora!
  name: string
  role?: UserRole
  workday?: Workday
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordRequest {
  userId: string  // ✨ ATUALIZADO: era "email", agora é "userId"
}

export interface ResetPasswordResponse {
  message: string
  temporaryPassword: string
}
```

---

## 🔒 Boas Práticas de Segurança

### ✅ FAÇA:

1. **Sempre use senha automática** ao criar usuários
2. **Mostre a senha temporária** em destaque na tela
3. **Forneça botão de copiar** para facilitar
4. **Instrua o usuário** a alterar no primeiro acesso
5. **Use canais seguros** para compartilhar credenciais
6. **Valide força da senha** no frontend
7. **Implemente timeout** na sessão

### ❌ NÃO FAÇA:

1. ❌ Enviar senhas por email não criptografado
2. ❌ Reutilizar mesma senha temporária
3. ❌ Permitir senhas fracas (menos de 8 caracteres)
4. ❌ Armazenar senhas em texto plano
5. ❌ Compartilhar credenciais em chats públicos
6. ❌ Deixar usuário sem alterar senha temporária

---

## 🚀 Quick Start

### 1. Instalar (já está instalado)

Os componentes já estão em `/modules/users/components/`

### 2. Importar

```typescript
import {
  CreateUserForm,
  ChangePasswordForm,
  ResetPasswordDialog
} from '@/modules/users/components'
```

### 3. Usar

```typescript
// Criar usuário
<CreateUserForm onSuccess={(user) => console.log(user)} />

// Alterar senha
<ChangePasswordForm onSuccess={() => router.push('/dashboard')} />

// Resetar senha
<ResetPasswordDialog user={selectedUser} />
```

---

## 📚 Documentação Relacionada

- 📄 `docs/PASSWORD_MANAGEMENT.md` - Documentação completa do backend
- 📄 `docs/GUIA_DE_USO_INTEGRACAO.md` - Guia de integração dos serviços
- 📄 `core/services/README.md` - Referência dos serviços
- 📄 `docs/AUTH_API.md` - Documentação da API de autenticação

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript atualizados
- [x] `temporaryPassword` opcional em User
- [x] `password` opcional em CreateUserRequest
- [x] Componente CreateUserForm criado
- [x] Componente ChangePasswordForm criado
- [x] Componente ResetPasswordDialog criado
- [x] Exportação dos componentes em index.ts
- [x] Documentação completa
- [ ] Integrar na interface de usuários real
- [ ] Adicionar notificações toast
- [ ] Implementar auditoria de alterações de senha
- [ ] Adicionar política de expiração de senha temporária

---

## 🎉 Pronto!

Agora você tem um **sistema completo de gerenciamento de senhas** com:

✅ Geração automática de senhas seguras  
✅ Interface amigável com componentes prontos  
✅ Validação de força de senha  
✅ Reset de senha para Masters  
✅ Feedback visual claro  
✅ Segurança em primeiro lugar  

**Próximos passos:** Integre os componentes nas suas páginas reais e teste o fluxo completo! 🚀
