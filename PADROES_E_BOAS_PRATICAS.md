# 📐 Padrões e Boas Práticas - SkillFix Frontend

## 🎯 Objetivo
Este documento estabelece os padrões e boas práticas a serem seguidos no desenvolvimento do projeto SkillFix Frontend.

---

## 📁 Estrutura de Arquivos

### Organização de Componentes
```
components/
├── ui/              # Componentes de UI reutilizáveis (shadcn/ui)
├── layout/          # Componentes de layout (sidebar, header, etc)
├── dashboard/       # Componentes específicos de dashboard
└── forms/           # Componentes de formulário (criar quando necessário)
```

### Organização de Páginas
```
app/
├── (auth)/          # Grupo de rotas de autenticação
│   ├── login/
│   └── register/
├── (dashboard)/     # Grupo de rotas protegidas
│   ├── home/
│   ├── cadastro/
│   └── ...
└── api/             # API routes (quando necessário)
```

### Organização de Utilitários
```
lib/
├── auth-context.tsx      # Contexto de autenticação
├── notification-context.tsx # Contexto de notificações
├── api-service.ts        # Serviço de API (criar)
├── validations.ts        # Schemas Zod
├── constants.ts          # Constantes
├── utils.ts              # Utilitários gerais
├── id-generator.ts       # Geração de IDs
└── hooks/                # Custom hooks (criar)
```

---

## 🎨 Padrões de Código

### 1. Nomenclatura

#### Componentes
- ✅ PascalCase: `UserProfile`, `DashboardCard`
- ✅ Sufixo descritivo: `LoginPage`, `UserList`, `CreateButton`
- ❌ Evitar: `page`, `component`, `thing`

#### Funções e Variáveis
- ✅ camelCase: `handleSubmit`, `isLoading`, `userData`
- ✅ Prefixos para booleans: `is`, `has`, `should`, `can`
- ✅ Prefixos para handlers: `handle`, `on`
- ❌ Evitar: `data`, `temp`, `thing`

#### Arquivos
- ✅ kebab-case para utilitários: `api-service.ts`, `id-generator.ts`
- ✅ PascalCase para componentes: `UserCard.tsx`
- ✅ lowercase para páginas Next.js: `page.tsx`, `layout.tsx`

### 2. Imports

#### Ordem de Imports
```typescript
// 1. React e Next.js
import React from "react"
import { useRouter } from "next/navigation"

// 2. Bibliotecas externas
import { z } from "zod"
import { useForm } from "react-hook-form"

// 3. Contextos e hooks customizados
import { useAuth } from "@/lib/auth-context"
import { useNotification } from "@/lib/notification-context"

// 4. Componentes
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 5. Utilitários e tipos
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

// 6. Ícones (sempre por último)
import { User, Settings, LogOut } from "lucide-react"
```

### 3. Estrutura de Componentes

#### Componente Completo
```typescript
"use client" // Apenas se necessário

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

// Tipos
interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

// Constantes locais
const DEFAULT_AVATAR = "/default-avatar.png"

// Componente
export default function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 1. Hooks do React
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 2. Hooks customizados
  const { user: currentUser } = useAuth()
  const router = useRouter()

  // 3. Effects
  useEffect(() => {
    loadUser()
  }, [userId])

  // 4. Callbacks e handlers
  const handleUpdate = useCallback(async () => {
    // lógica
  }, [userId])

  // 5. Early returns
  if (!currentUser) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  // 6. Render
  return (
    <div className="space-y-4">
      {/* conteúdo */}
    </div>
  )
}
```

### 4. TypeScript

#### Sempre Tipar
```typescript
// ✅ Bom
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}

// ❌ Evitar
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then(res => res.json())
}
```

#### Usar Type vs Interface
```typescript
// Use interface para objetos e classes
interface User {
  id: string
  name: string
}

// Use type para unions, intersections, e tipos primitivos
type Status = "active" | "inactive"
type UserWithStatus = User & { status: Status }
```

### 5. Estado e Handlers

#### Naming Convention
```typescript
// ✅ Bom
const [isOpen, setIsOpen] = useState(false)
const [userData, setUserData] = useState<User | null>(null)

const handleSubmit = async (e: React.FormEvent) => {
  // lógica
}

const handleUserUpdate = useCallback((id: string) => {
  // lógica
}, [dependencies])

// ❌ Evitar
const [open, setOpen] = useState(false)
const [data, setData] = useState(null)
const submit = (e) => { /* ... */ }
```

### 6. Formulários

#### Usar React Hook Form + Zod
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validations"

const form = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
})

const onSubmit = async (values: z.infer<typeof loginSchema>) => {
  // valores já validados!
}
```

### 7. Tratamento de Erros

#### Sempre Tratar Erros
```typescript
// ✅ Bom
try {
  await someAsyncOperation()
  success("Operação concluída!")
} catch (error) {
  if (error instanceof Error) {
    showError(error.message)
  } else {
    showError("Erro desconhecido")
  }
  console.error("Error details:", error)
}

// ❌ Evitar
try {
  await someAsyncOperation()
} catch (error) {
  // silencioso - péssimo!
}
```

### 8. Acessibilidade

#### Labels e ARIA
```typescript
// ✅ Bom
<label htmlFor="email">Email</label>
<input 
  id="email" 
  type="email"
  aria-label="Email do usuário"
  aria-required="true"
/>

<button 
  aria-label="Fechar modal"
  onClick={handleClose}
>
  <X />
</button>

// Mensagens de erro
<div role="alert" className="text-red-600">
  {error}
</div>
```

### 9. Performance

#### Memoização
```typescript
// Use useMemo para cálculos custosos
const expensiveValue = useMemo(() => {
  return complexCalculation(data)
}, [data])

// Use useCallback para funções passadas como props
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])

// Use React.memo para componentes que re-renderizam demais
const MemoizedComponent = React.memo(MyComponent)
```

#### Lazy Loading
```typescript
// Para rotas
const DashboardPage = lazy(() => import("./pages/Dashboard"))

// Para componentes pesados
const HeavyChart = lazy(() => import("./components/HeavyChart"))
```

---

## 🎨 CSS e Tailwind

### Ordem de Classes Tailwind
```typescript
// Layout → Espaçamento → Tipografia → Visual → Estados
<div className="
  flex items-center justify-between    // Layout
  p-4 gap-2                            // Espaçamento
  text-sm font-medium                  // Tipografia
  bg-primary text-white rounded-lg     // Visual
  hover:bg-primary/90 focus:ring-2     // Estados
">
```

### Evitar Estilos Inline
```typescript
// ❌ Evitar
<div style={{ backgroundColor: "#005486" }}>

// ✅ Usar Tailwind ou CSS modules
<div className="bg-[#005486]">
// ou melhor ainda, usar variáveis CSS
<div className="bg-primary">
```

### Componentes Consistentes
```typescript
// Use as variantes do shadcn/ui
<Button variant="default" size="lg">
<Button variant="outline" size="sm">
<Button variant="ghost">
```

---

## 🔒 Segurança

### Checklist de Segurança
- ✅ Nunca expor senhas ou tokens no código cliente
- ✅ Validar TODOS os inputs (cliente E servidor)
- ✅ Sanitizar dados antes de exibir (evitar XSS)
- ✅ Usar HTTPS em produção
- ✅ Implementar CSRF protection
- ✅ Rate limiting em APIs
- ✅ Não logar dados sensíveis

### Exemplo de Input Seguro
```typescript
// ✅ Sempre validar
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// ✅ Sanitizar antes de exibir
import DOMPurify from 'isomorphic-dompurify'
const cleanHTML = DOMPurify.sanitize(userInput)
```

---

## 📝 Comentários e Documentação

### Quando Comentar
```typescript
// ✅ Bom - explica o "porquê"
// Usamos setTimeout pois o modal precisa terminar a animação
setTimeout(() => setOpen(false), 300)

// ✅ Bom - documenta função complexa
/**
 * Calcula a pontuação média do colaborador baseado em suas habilidades
 * @param skills - Record de habilidades com suas pontuações
 * @param weights - Pesos opcionais para cada habilidade
 * @returns Pontuação média ponderada (0-100)
 */
function calculateAverageScore(
  skills: Record<string, number>,
  weights?: Record<string, number>
): number {
  // implementação
}

// ❌ Evitar - comenta o óbvio
// Define o estado como true
setIsOpen(true)
```

### TODOs
```typescript
// TODO: Integrar com API real
// TODO: Adicionar tratamento de erro
// FIXME: Bug ao recarregar a página
// HACK: Solução temporária até refatorar
// NOTE: Este componente será deprecado na v2
```

---

## 🧪 Testes (Para Implementar)

### Estrutura de Testes
```typescript
// NomeDoComponente.test.tsx
describe("UserProfile", () => {
  it("should render user name", () => {
    // teste
  })

  it("should handle update correctly", () => {
    // teste
  })

  it("should show error on failed update", () => {
    // teste
  })
})
```

### O que Testar
- ✅ Componentes críticos (login, cadastro, checkout)
- ✅ Lógica de negócio (cálculos, validações)
- ✅ Hooks customizados
- ✅ Utilitários
- ⏸️ Componentes de UI simples (menos prioritário)

---

## 📦 Commits e Git

### Mensagens de Commit (Conventional Commits)
```bash
# Features
git commit -m "feat: adicionar página de cadastro de usuários"

# Correções
git commit -m "fix: corrigir bug no cálculo de média"

# Refactoring
git commit -m "refactor: extrair lógica de validação para hook"

# Documentação
git commit -m "docs: atualizar README com instruções de deploy"

# Tipos
git commit -m "types: adicionar tipos para API de avaliações"

# Testes
git commit -m "test: adicionar testes para AuthContext"
```

### Branches
```bash
main          # Produção
develop       # Desenvolvimento
feature/*     # Features (feature/user-profile)
fix/*         # Correções (fix/login-bug)
refactor/*    # Refatoração
```

---

## 🚀 Performance

### Checklist de Performance
- ✅ Lazy load de rotas e componentes pesados
- ✅ Otimizar imagens (Next.js Image)
- ✅ Memoizar componentes e valores custosos
- ✅ Usar React Query/SWR para cache de dados
- ✅ Code splitting automático do Next.js
- ✅ Debounce em pesquisas e inputs
- ✅ Virtualização para listas grandes

---

## 📱 Responsividade

### Breakpoints Tailwind
```typescript
// sm:  640px  - Celular grande / Tablet pequeno
// md:  768px  - Tablet
// lg:  1024px - Laptop
// xl:  1280px - Desktop
// 2xl: 1536px - Desktop grande

<div className="
  grid 
  grid-cols-1           // Mobile
  md:grid-cols-2        // Tablet
  lg:grid-cols-3        // Laptop+
  gap-4
">
```

---

## ✅ Checklist Antes de Commit

- [ ] Código compila sem erros
- [ ] Sem warnings do TypeScript
- [ ] Sem console.logs desnecessários
- [ ] Componentes tipados corretamente
- [ ] Tratamento de erros implementado
- [ ] Loading states implementados
- [ ] Acessibilidade verificada
- [ ] Responsivo testado
- [ ] TODOs adicionados onde necessário
- [ ] Commit message seguindo padrão

---

## 📚 Recursos

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zod:** https://zod.dev/
- **React Hook Form:** https://react-hook-form.com/
- **shadcn/ui:** https://ui.shadcn.com/

---

*Documento mantido por: Equipe SkillFix*
*Última atualização: 14 de março de 2026*
