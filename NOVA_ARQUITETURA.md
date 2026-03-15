# 🏗️ Nova Arquitetura - SkillFix Frontend

## 📐 Visão Geral

Esta aplicação segue os princípios de **Clean Architecture** adaptados para **Next.js 14+**, combinando o melhor dos dois mundos: a estrutura modular do Angular e as convenções do Next.js App Router.

---

## 📁 Estrutura de Diretórios

```
skill-frontend/
│
├── app/                          # 📱 Next.js App Router (Camada de Apresentação)
│   ├── (auth)/                  # Grupo de rotas de autenticação
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/             # Grupo de rotas protegidas
│   │   ├── home/
│   │   ├── cadastro/
│   │   ├── tecnicos/
│   │   ├── times/
│   │   ├── avaliacoes/
│   │   └── usuarios/
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Página inicial
│   └── globals.css              # Estilos globais
│
├── core/                         # 🎯 Núcleo da Aplicação (Camada de Negócio)
│   ├── contexts/                # React Contexts
│   │   ├── auth-context.tsx
│   │   ├── notification-context.tsx
│   │   └── index.ts
│   ├── hooks/                   # Custom Hooks compartilhados
│   │   ├── use-mobile.ts
│   │   ├── use-toast.ts
│   │   └── index.ts
│   ├── services/                # Serviços de negócio
│   │   ├── auth.service.ts
│   │   ├── api.service.ts
│   │   ├── storage.service.ts
│   │   └── index.ts
│   ├── utils/                   # Utilitários gerais
│   │   ├── cn.ts
│   │   ├── id-generator.ts
│   │   ├── formatters.ts
│   │   └── index.ts
│   ├── constants/               # Constantes globais
│   │   ├── app.constants.ts
│   │   ├── theme.constants.ts
│   │   ├── validation.constants.ts
│   │   └── index.ts
│   └── types/                   # Tipos TypeScript compartilhados
│       ├── common.types.ts
│       ├── api.types.ts
│       └── index.ts
│
├── modules/                      # 🔧 Módulos/Features (Organizados por Domínio)
│   ├── auth/                    # Módulo de Autenticação
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── users/                   # Módulo de Usuários/Colaboradores
│   │   ├── components/
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useUsers.ts
│   │   │   ├── useUserForm.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── users.service.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── user.types.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── teams/                   # Módulo de Times
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── evaluations/             # Módulo de Avaliações
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── dashboard/               # Módulo de Dashboard
│   │   ├── components/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── machines/                # Módulo de Máquinas
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts
│
├── shared/                       # 🔗 Compartilhado (Componentes Reutilizáveis)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (outros componentes UI)
│   │   ├── layout/              # Componentes de Layout
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── common/              # Componentes Comuns
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── validations/             # Validações Zod
│   │   ├── auth.validation.ts
│   │   ├── user.validation.ts
│   │   ├── team.validation.ts
│   │   └── index.ts
│   │
│   ├── data/                    # Mock Data (remover quando integrar backend)
│   │   ├── mock-users.ts
│   │   ├── mock-teams.ts
│   │   ├── mock-machines.ts
│   │   └── index.ts
│   │
│   └── types/                   # Tipos compartilhados entre módulos
│       ├── domain.types.ts
│       └── index.ts
│
└── infrastructure/              # 🔌 Infraestrutura (Camada Externa)
    ├── http/
    │   ├── api-client.ts       # Cliente HTTP (axios/fetch)
    │   ├── interceptors.ts     # Interceptors para requests
    │   └── index.ts
    └── storage/
        ├── local-storage.ts    # Wrapper para localStorage
        ├── session-storage.ts  # Wrapper para sessionStorage
        └── index.ts
```

---

## 🎯 Princípios da Arquitetura

### 1. **Separação de Responsabilidades**
- **app/**: Apenas rotas e páginas do Next.js
- **core/**: Lógica de negócio central, compartilhada por toda aplicação
- **modules/**: Features organizadas por domínio (cada módulo é independente)
- **shared/**: Componentes e utilidades compartilhadas
- **infrastructure/**: Detalhes de implementação externa (API, storage)

### 2. **Modularização por Feature**
Cada módulo em `modules/` contém tudo relacionado àquela feature:
- Componentes específicos
- Hooks customizados
- Serviços/lógica de negócio
- Tipos TypeScript
- Testes (futuramente)

### 3. **Barrel Exports**
Cada diretório tem um `index.ts` para facilitar imports:
```typescript
// ❌ Antes (imports longos)
import { useAuth } from '@/lib/auth-context'
import { useNotification } from '@/lib/notification-context'

// ✅ Depois (barrel exports)
import { useAuth, useNotification } from '@/core/contexts'
```

### 4. **Hierarquia de Dependências**
```
app/ 
  ↓ usa
modules/ 
  ↓ usa
shared/ + core/
  ↓ usa
infrastructure/
```

**Regras:**
- `app/` pode importar de qualquer lugar
- `modules/` podem importar de `shared/`, `core/`, `infrastructure/`
- `shared/` e `core/` NÃO devem conhecer `modules/` ou `app/`
- `infrastructure/` não deve importar nada interno

---

## 📦 Estrutura de um Módulo

Exemplo: `modules/users/`

```typescript
modules/users/
├── components/           # Componentes específicos deste módulo
│   ├── UserCard.tsx
│   ├── UserForm.tsx
│   ├── UserList.tsx
│   ├── UserFilters.tsx
│   └── index.ts         # Barrel export
│
├── hooks/               # Hooks customizados deste módulo
│   ├── useUsers.ts      # Buscar usuários
│   ├── useUserForm.ts   # Lógica do formulário
│   ├── useUserFilters.ts
│   └── index.ts
│
├── services/            # Lógica de negócio/API
│   ├── users.service.ts
│   └── index.ts
│
├── types/               # Tipos específicos
│   ├── user.types.ts
│   └── index.ts
│
├── validations/         # Validações específicas (opcional)
│   ├── user.validation.ts
│   └── index.ts
│
└── index.ts             # Barrel export do módulo inteiro
```

---

## 🔄 Fluxo de Dados

```
1. Usuário interage com UI (app/*)
                ↓
2. Componente chama hook (modules/*/hooks/)
                ↓
3. Hook chama service (modules/*/services/ ou core/services/)
                ↓
4. Service usa API client (infrastructure/http/)
                ↓
5. API client faz requisição HTTP
                ↓
6. Resposta volta pelo caminho inverso
                ↓
7. UI é atualizada via estado/context
```

---

## 📝 Exemplos de Uso

### Importando de Core
```typescript
// Em qualquer arquivo
import { useAuth, useNotification } from '@/core/contexts'
import { generateId } from '@/core/utils'
import { THEME_COLORS, STATUS } from '@/core/constants'
import type { ApiResponse, PaginatedData } from '@/core/types'
```

### Importando de Módulos
```typescript
// Em app/tecnicos/page.tsx
import { UserList, UserCard } from '@/modules/users/components'
import { useUsers } from '@/modules/users/hooks'
import type { User, UserFilters } from '@/modules/users/types'
```

### Importando de Shared
```typescript
// Em qualquer módulo
import { Button, Card, Input } from '@/shared/components/ui'
import { AppLayout, Sidebar } from '@/shared/components/layout'
import { userSchema } from '@/shared/validations'
```

### Usando Infrastructure
```typescript
// Em um service
import { apiClient } from '@/infrastructure/http'
import { localStorage } from '@/infrastructure/storage'

export const usersService = {
  async getAll() {
    return apiClient.get('/users')
  }
}
```

---

## 🎨 Convenções de Nomenclatura

### Arquivos
- **Componentes**: PascalCase → `UserCard.tsx`, `LoginForm.tsx`
- **Hooks**: camelCase com 'use' → `useUsers.ts`, `useAuth.ts`
- **Services**: camelCase com '.service' → `users.service.ts`, `api.service.ts`
- **Types**: camelCase com '.types' → `user.types.ts`, `common.types.ts`
- **Constants**: camelCase com '.constants' → `app.constants.ts`
- **Validations**: camelCase com '.validation' → `user.validation.ts`
- **Utils**: camelCase → `formatters.ts`, `validators.ts`

### Exports
- Use **named exports** sempre que possível
- **Default export** apenas para páginas Next.js e componentes únicos

```typescript
// ✅ Bom - Named exports
export const UserCard = () => { }
export const useUsers = () => { }

// ✅ OK - Default export para páginas
export default function UsersPage() { }
```

---

## 🚀 Benefícios desta Arquitetura

### Para o Time
- ✅ **Fácil localização**: Sabe exatamente onde cada coisa está
- ✅ **Fácil manutenção**: Módulos independentes
- ✅ **Fácil teste**: Cada módulo pode ser testado isoladamente
- ✅ **Fácil escala**: Adicionar novos módulos é simples

### Para o Código
- ✅ **Baixo acoplamento**: Módulos não dependem uns dos outros
- ✅ **Alta coesão**: Cada módulo tem responsabilidade clara
- ✅ **Reutilização**: Componentes em shared/ são facilmente reutilizados
- ✅ **Testabilidade**: Serviços e hooks isolados são fáceis de testar

### Para Novos Desenvolvedores
- ✅ **Curva de aprendizado menor**: Estrutura intuitiva
- ✅ **Documentação implícita**: Organização já explica a arquitetura
- ✅ **Padrões claros**: Sabe onde criar novos arquivos

---

## 📋 Checklist ao Criar Nova Feature

1. [ ] Criar diretório em `modules/nome-feature/`
2. [ ] Criar subdiretórios necessários (components, hooks, services, types)
3. [ ] Criar barrel exports (`index.ts`) em cada diretório
4. [ ] Implementar componentes em `components/`
5. [ ] Implementar lógica em `hooks/` e `services/`
6. [ ] Definir tipos em `types/`
7. [ ] Adicionar validações em `validations/` (se necessário)
8. [ ] Criar página em `app/` que usa o módulo
9. [ ] Atualizar documentação

---

## 🔄 Migração Gradual

A migração da estrutura atual para a nova pode ser feita gradualmente:

1. **Fase 1**: Criar nova estrutura vazia
2. **Fase 2**: Mover arquivos core (contexts, utils, constants)
3. **Fase 3**: Reorganizar componentes em shared/
4. **Fase 4**: Criar módulos feature por feature
5. **Fase 5**: Atualizar todos os imports
6. **Fase 6**: Remover estrutura antiga

---

## 📚 Referências

- **Clean Architecture**: Robert C. Martin (Uncle Bob)
- **Angular Style Guide**: https://angular.io/guide/styleguide
- **Next.js Best Practices**: https://nextjs.org/docs/app/building-your-application
- **Feature-Sliced Design**: https://feature-sliced.design/

---

*Documento criado em: 14 de março de 2026*
*Mantido por: Equipe SkillFix*
