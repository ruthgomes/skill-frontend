# 🔐 User Management Components

Componentes React prontos para gerenciamento de usuários e senhas, baseados na documentação `docs/PASSWORD_MANAGEMENT.md`.

## 📦 Componentes Disponíveis

### 1. CreateUserForm

Formulário completo para criação de usuários com opção de senha automática.

```typescript
import { CreateUserForm } from '@/modules/users/components'

<CreateUserForm
  onSuccess={(user) => {
    if (user.temporaryPassword) {
      // Senha temporária foi gerada!
      console.log('Senha:', user.temporaryPassword)
    }
  }}
  onCancel={() => router.back()}
/>
```

**Features:**
- ✅ Gera senha automática (recomendado) ou permite senha manual
- ✅ Exibe senha temporária em destaque após criação
- ✅ Botão copiar para área de transferência
- ✅ Validação de formulário
- ✅ Suporte a Master e Supervisor
- ✅ Seleção de turno (diurno/noturno)

---

### 2. ChangePasswordForm

Formulário para usuário alterar sua própria senha.

```typescript
import { ChangePasswordForm } from '@/modules/users/components'

<ChangePasswordForm
  onSuccess={() => {
    toast.success('Senha alterada!')
    router.push('/dashboard')
  }}
  onCancel={() => router.back()}
/>
```

**Features:**
- ✅ Validação de senha atual
- ✅ Indicador visual de força da senha
- ✅ Requisitos de segurança em tempo real
- ✅ Confirmação de senha
- ✅ Botões mostrar/esconder senha
- ✅ Feedback de sucesso com card verde

---

### 3. ResetPasswordDialog

Dialog para Masters resetarem senha de outros usuários.

```typescript
import { ResetPasswordDialog } from '@/modules/users/components'

<ResetPasswordDialog
  user={selectedUser}
  trigger={<Button>🔄 Resetar Senha</Button>}
  onSuccess={() => {
    toast.success('Senha resetada!')
    refreshList()
  }}
/>
```

**Features:**
- ✅ Dialog modal com informações do usuário
- ✅ Confirmação de segurança
- ✅ Exibe nova senha temporária gerada
- ✅ Botão copiar credenciais completas
- ✅ Instruções para compartilhar com usuário
- ✅ Controle de permissão (apenas Masters)

---

## 🎯 Uso Típico

### Página de Criar Usuário

```typescript
// app/usuarios/criar/page.tsx
'use client'

import { CreateUserForm } from '@/modules/users/components'
import { useRouter } from 'next/navigation'

export default function CreateUserPage() {
  const router = useRouter()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Usuário</h1>
      <CreateUserForm
        onSuccess={(user) => {
          console.log('✅ Usuário criado:', user)
        }}
        onCancel={() => router.push('/usuarios')}
      />
    </div>
  )
}
```

### Página de Alterar Senha

```typescript
// app/perfil/alterar-senha/page.tsx
'use client'

import { ChangePasswordForm } from '@/modules/users/components'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Alterar Senha</h1>
      <ChangePasswordForm
        onSuccess={() => router.push('/perfil')}
        onCancel={() => router.back()}
      />
    </div>
  )
}
```

### Lista de Usuários com Reset

```typescript
// app/usuarios/page.tsx
'use client'

import { ResetPasswordDialog } from '@/modules/users/components'
import { usersService } from '@/core/services'

export default function UsersListPage() {
  const [users, setUsers] = useState([])

  async function loadUsers() {
    const response = await usersService.findAll()
    setUsers(response.data)
  }

  return (
    <div className="p-6">
      {users.map((user) => (
        <div key={user.id} className="flex justify-between items-center p-4 border rounded">
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          
          <ResetPasswordDialog
            user={user}
            onSuccess={loadUsers}
          />
        </div>
      ))}
    </div>
  )
}
```

---

## 🔧 Dependências

Estes componentes usam:

- **shadcn/ui**: Button, Input, Label, Card, Dialog, Alert, etc.
- **lucide-react**: Ícones
- **@/core/services**: usersService para chamadas à API
- **@/core/types**: Types TypeScript

---

## 📚 Documentação Relacionada

- `docs/GUIA_GERENCIAMENTO_SENHAS.md` - Guia completo com exemplos
- `docs/PASSWORD_MANAGEMENT.md` - Documentação do backend
- `core/services/users.service.ts` - Service de usuários
- `core/types/api.types.ts` - Tipos TypeScript

---

## ✨ Próximas Melhorias

- [ ] Adicionar suporte a notificações toast
- [ ] Implementar histórico de alterações
- [ ] Adicionar expiração de senha temporária
- [ ] Implementar força de senha configurável
- [ ] Adicionar auditoria de ações
