# 🔄 Guia de Migração para Nova Arquitetura

## 📋 Visão Geral

Este guia explica como migrar seus imports e códigos para a nova arquitetura Clean + Angular style.

---

## 🗺️ Mapeamento de Paths

### Antes → Depois

#### Contexts
```typescript
// ❌ Antes
import { useAuth } from '@/lib/auth-context'
import { useNotification } from '@/lib/notification-context'

// ✅ Depois
import { useAuth, useNotification } from '@/core/contexts'
```

#### Hooks
```typescript
// ❌ Antes
import { useMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'

// ✅ Depois
import { useMobile, useToast } from '@/core/hooks'
```

#### Utils
```typescript
// ❌ Antes
import { cn } from '@/lib/utils'
import { generateId } from '@/lib/id-generator'

// ✅ Depois
import { cn, generateId } from '@/core/utils'
```

#### Constants
```typescript
// ❌ Antes
import { THEME_COLORS, STATUS } from '@/lib/constants'

// ✅ Depois
import { THEME_COLORS, STATUS } from '@/core/constants'
```

#### Validations
```typescript
// ❌ Antes
import { loginSchema, userSchema } from '@/lib/validations'

// ✅ Depois
import { loginSchema, userSchema } from '@/shared/validations'
```

#### Mock Data
```typescript
// ❌ Antes
import { mockTecnicos, MACHINES } from '@/lib/data'

// ✅ Depois
import { mockTecnicos, MACHINES } from '@/shared/data'
```

#### Componentes UI
```typescript
// ❌ Antes
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// ✅ Depois - Opção 1: Imports individuais
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

// ✅ Depois - Opção 2: Barrel export (recomendado)
import { Button, Card, Input } from '@/shared/components/ui'
```

#### Componentes de Layout
```typescript
// ❌ Antes
import { AppLayout } from '@/components/layout/app-layout'
import { Sidebar } from '@/components/layout/sidebar'

// ✅ Depois
import { AppLayout, Sidebar } from '@/shared/components/layout'
```

#### Theme Provider
```typescript
// ❌ Antes
import { ThemeProvider } from '@/components/theme-provider'

// ✅ Depois
import { ThemeProvider } from '@/shared/components/common'
```

#### Componentes Dashboard
```typescript
// ❌ Antes
import { StatsCard } from '@/components/dashboard/stats-card'
import { PerformanceChart } from '@/components/dashboard/performance-chart'

// ✅ Depois
import { StatsCard, PerformanceChart } from '@/modules/dashboard/components'
// ou
import { StatsCard, PerformanceChart } from '@/modules/dashboard'
```

---

## 📂 Nova Organização de Arquivos

### Estrutura Completa

```
skill-frontend/
├── app/                  # Next.js App Router (SEM MUDANÇAS)
│   ├── (auth)/login/
│   ├── (dashboard)/...
│   ├── layout.tsx
│   └── page.tsx
│
├── core/                 # ✨ NOVO - Núcleo
│   ├── contexts/
│   │   ├── auth-context.tsx         (de lib/)
│   │   ├── notification-context.tsx (de lib/)
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-mobile.ts            (de hooks/)
│   │   ├── use-toast.ts             (de hooks/)
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts                    (de lib/utils.ts)
│   │   ├── id-generator.ts          (de lib/)
│   │   └── index.ts
│   ├── constants/
│   │   ├── app.constants.ts         (de lib/constants.ts)
│   │   └── index.ts
│   └── types/
│       └── index.ts
│
├── modules/              # ✨ NOVO - Features
│   ├── auth/
│   ├── users/
│   ├── teams/
│   ├── evaluations/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── stats-card.tsx       (de components/dashboard/)
│   │   │   ├── performance-chart.tsx
│   │   │   ├── operator-ranking.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── machines/
│
├── shared/               # ✨ NOVO - Compartilhado
│   ├── components/
│   │   ├── ui/                      (de components/ui/)
│   │   │   └── ... (todos os arquivos)
│   │   ├── layout/                  (de components/layout/)
│   │   │   ├── app-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── main-layout.tsx
│   │   │   └── index.ts
│   │   └── common/                  (de components/)
│   │       ├── theme-provider.tsx
│   │       └── index.ts
│   ├── validations/
│   │   ├── schemas.ts               (de lib/validations.ts)
│   │   └── index.ts
│   └── data/
│       ├── mock-data.ts             (de lib/data.ts)
│       └── index.ts
│
├── lib/                  # 🗑️ DEPRECADO - Será removido
├── hooks/                # 🗑️ DEPRECADO - Será removido
└── components/           # 🗑️ DEPRECADO - Será removido
```

---

## 🚀 Passo a Passo para Migração

### Fase 1: Configuração (✅ CONCLUÍDO)
- [x] Criar nova estrutura de diretórios
- [x] Copiar arquivos para novos locais
- [x] Criar barrel exports (index.ts)
- [x] Atualizar tsconfig.json com novos paths

### Fase 2: Atualizar Imports (🔄 EM ANDAMENTO)

#### 1. Atualizar app/layout.tsx
```typescript
// ❌ Antes
import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/lib/notification-context"
import { ThemeProvider } from "@/components/theme-provider"

// ✅ Depois
import { AuthProvider, NotificationProvider } from "@/core/contexts"
import { ThemeProvider } from "@/shared/components/common"
```

#### 2. Atualizar Páginas
Atualizar os imports em cada página dentro de `app/`:
- app/login/page.tsx
- app/home/page.tsx
- app/cadastro/page.tsx
- app/tecnicos/page.tsx
- app/times/page.tsx
- app/avaliacoes/page.tsx
- etc.

#### 3. Atualizar Componentes
Atualizar imports nos componentes movidos para shared/

### Fase 3: Testar (⏳ PENDENTE)
```bash
# Verificar erros de compilação
npm run build

# Iniciar dev server
npm run dev

# Testar todas as páginas manualmente
```

### Fase 4: Limpeza (⏳ PENDENTE)
```bash
# Após confirmar que tudo funciona, remover diretórios antigos
rm -rf lib/
rm -rf hooks/
rm -rf components/
```

---

## 🛠️ Script de Migração Automática

Para facilitar, você pode usar este script para substituir imports:

```bash
# find-replace-imports.sh

#!/bin/bash

# Substituir imports de contexts
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/auth-context'|from '@/core/contexts'|g"

find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/notification-context'|from '@/core/contexts'|g"

# Substituir imports de hooks
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/hooks/use-mobile'|from '@/core/hooks'|g"

# Substituir imports de utils
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/utils'|from '@/core/utils'|g"

find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/id-generator'|from '@/core/utils'|g"

# Substituir imports de constants
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/constants'|from '@/core/constants'|g"

# Substituir imports de validations
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/validations'|from '@/shared/validations'|g"

# Substituir imports de data
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/lib/data'|from '@/shared/data'|g"

# Substituir imports de componentes UI
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/components/ui/|from '@/shared/components/ui/|g"

# Substituir imports de layout
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/components/layout/|from '@/shared/components/layout/|g"

# Substituir imports de theme-provider
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/components/theme-provider'|from '@/shared/components/common'|g"

# Substituir imports de dashboard
find app -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '@/components/dashboard/|from '@/modules/dashboard/components/|g"

echo "✅ Imports atualizados! Execute 'npm run build' para verificar erros."
```

**Para Windows (PowerShell):**
```powershell
# find-replace-imports.ps1

Get-ChildItem -Path app -Include *.tsx,*.ts -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace "from '@/lib/auth-context'", "from '@/core/contexts'"
    $content = $content -replace "from '@/lib/notification-context'", "from '@/core/contexts'"
    $content = $content -replace "from '@/hooks/use-mobile'", "from '@/core/hooks'"
    $content = $content -replace "from '@/lib/utils'", "from '@/core/utils'"
    $content = $content -replace "from '@/lib/id-generator'", "from '@/core/utils'"
    $content = $content -replace "from '@/lib/constants'", "from '@/core/constants'"
    $content = $content -replace "from '@/lib/validations'", "from '@/shared/validations'"
    $content = $content -replace "from '@/lib/data'", "from '@/shared/data'"
    $content = $content -replace "from '@/components/ui/", "from '@/shared/components/ui/"
    $content = $content -replace "from '@/components/layout/", "from '@/shared/components/layout/"
    $content = $content -replace "from '@/components/theme-provider'", "from '@/shared/components/common'"
    $content = $content -replace "from '@/components/dashboard/", "from '@/modules/dashboard/components/"
    Set-Content -Path $_.FullName -Value $content
}

Write-Host "✅ Imports atualizados! Execute 'npm run build' para verificar erros."
```

---

##  Checklist de Migração

### Por Arquivo

- [ ] app/layout.tsx
- [ ] app/page.tsx
- [ ] app/login/page.tsx
- [ ] app/home/page.tsx
- [ ] app/cadastro/page.tsx
- [ ] app/tecnicos/page.tsx
- [ ] app/times/page.tsx
- [ ] app/times/[id]/page.tsx
- [ ] app/avaliacoes/page.tsx
- [ ] app/dashboards/page.tsx
- [ ] app/usuarios/page.tsx
- [ ] shared/components/layout/app-layout.tsx
- [ ] shared/components/layout/sidebar.tsx
- [ ] modules/dashboard/components/*.tsx

### Verificação Final

- [ ] `npm run build` executa sem erros
- [ ] Todas as páginas carregam corretamente
- [ ] Login funciona
- [ ] Navegação funciona
- [ ] Toasts funcionam
- [ ] Temas funcionam
- [ ] Remover diretórios antigos (lib/, hooks/, components/)

---

## 🆘 Problemas Comuns

### Erro: "Module not found"
**Solução:** Verifique se o path no erro está correto. Use os novos paths.

### Erro: "Cannot find module '@/core/contexts'"
**Solução:** Reinicie o TypeScript server:
```
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Erro: Imports circulares
**Solução:** Certifique-se de que:
- `core/` e `shared/` NÃO importam de `modules/`
- `modules/` NÃO importam uns dos outros diretamente
- Use barrel exports para evitar imports circulares

---

## 📚 Recursos

- [NOVA_ARQUITETURA.md](./NOVA_ARQUITETURA.md) - Documentação completa
- [PADROES_E_BOAS_PRATICAS.md](./PADROES_E_BOAS_PRATICAS.md) - Padrões de código
- [CODIGO_REVIEW_REPORT.md](./CODIGO_REVIEW_REPORT.md) - Relatório de melhorias

---

*Última atualização: 14 de março de 2026*
