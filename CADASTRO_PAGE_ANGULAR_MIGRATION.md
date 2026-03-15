# Documentação: Página de Cadastro - Migração para Angular 17+

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura da Aplicação](#estrutura-da-aplicação)
3. [Componentes UI Utilizados](#componentes-ui-utilizados)
4. [Interfaces TypeScript e Modelos de Dados](#interfaces-typescript-e-modelos-de-dados)
5. [Contextos e Serviços](#contextos-e-serviços)
6. [Estados da Aplicação](#estados-da-aplicação)
7. [Lógica de Negócio](#lógica-de-negócio)
8. [Validações e Regras](#validações-e-regras)
9. [Funcionalidades Principais](#funcionalidades-principais)
10. [Classes Tailwind CSS Utilizadas](#classes-tailwind-css-utilizadas)
11. [Integração com APIs](#integração-com-apis)
12. [Mapeamento React → Angular](#mapeamento-react--angular)
13. [Considerações SSR/SSG no Angular](#considerações-ssrssg-no-angular)
14. [Estrutura de Arquivos Angular Sugerida](#estrutura-de-arquivos-angular-sugerida)
15. [Dependências e Bibliotecas](#dependências-e-bibliotecas)

---

## 🎯 Visão Geral

### Propósito da Página
A página de **Cadastro** (`/cadastro`) é uma interface administrativa restrita ao perfil **MASTER** que permite gerenciar:
- **Colaboradores**: Cadastro completo de funcionários com diferentes senioridades
- **Máquinas**: Equipamentos vinculados a times específicos
- **Habilidades (Skills)**: Competências técnicas vinculadas a máquinas, times e sub-times

### Arquitetura Atual (React/Next.js)
- Framework: **Next.js 14+**
- Rendering: **Client-Side Rendering** (`"use client"` directive)
- Linguagem: **TypeScript**
- Styling: **Tailwind CSS**
- Componentes: **Shadcn/ui** (Radix UI + Tailwind)

---

## 🏗️ Estrutura da Aplicação

### Hierarquia de Componentes
```
CadastroPage (Componente Principal)
├── AppLayout (Layout com Sidebar e Header)
│   └── Sidebar + ThemeToggle + Logout
├── Tabs (Sistema de Abas)
│   ├── TabsList (Navegação entre abas)
│   └── TabsContent (Conteúdo de cada aba)
│       ├── Tab: "Novo Colaborador"
│       │   └── Card com Formulário de Colaborador
│       ├── Tab: "Máquinas"
│       │   ├── Card: Cadastrar Nova Máquina
│       │   └── Card: Grid de Máquinas Cadastradas
│       └── Tab: "Habilidades"
│           └── Card: Cadastrar Nova Habilidade
└── Dialog (Modal de Habilidades da Máquina)
    └── Lista de Skills por Máquina
```

### Fluxo de Navegação
```
Login → Home → Cadastro (somente role: "master")
```

---

## 🎨 Componentes UI Utilizados

### Componentes Shadcn/ui (Radix UI)
| Componente | Uso na Página | Localização |
|------------|---------------|-------------|
| **AppLayout** | Layout principal com sidebar | `@/components/layout/app-layout` |
| **Card** | Container para formulários e grid de máquinas | `@/components/ui/card` |
| **Tabs** | Sistema de abas (Colaborador/Máquinas/Habilidades) | `@/components/ui/tabs` |
| **Button** | Botões de ação (Cadastrar, Adicionar) | `@/components/ui/button` |
| **Input** | Campos de texto (nome, workday, cargo, etc.) | `@/components/ui/input` |
| **Badge** | Exibição de contador de habilidades | `@/components/ui/badge` |
| **Dialog** | Modal de visualização de skills por máquina | `@/components/ui/dialog` |
| **Select (nativo)** | Dropdowns de seleção (senioridade, área, turno, time, sub-time, gênero) | HTML `<select>` nativo estilizado |

### Ícones Lucide React
| Ícone | Uso | Migração Angular |
|-------|-----|------------------|
| **Settings** | Ícone de máquina no grid | `lucide-angular` ou `Angular Material Icons` |
| **Plus** | Botão "Adicionar" | `lucide-angular` |
| **Upload** | Upload de foto do colaborador | `lucide-angular` |
| **X** | Remover foto | `lucide-angular` |

**Migração**: Instalar `lucide-angular` ou usar `@angular/material` icons.

---

## 📊 Interfaces TypeScript e Modelos de Dados

### 1. ColaboradorForm (Estado Local)
```typescript
type ColaboradorForm = {
  name: string;           // Nome completo
  workday: string;        // ID do colaborador (Ex: WDC00001)
  cargo: string;          // Cargo (Ex: Engenheiro de Produção)
  senioridade: Senioridade | "";  // Nível hierárquico
  area: Area | "";        // Área de atuação
  shift: "1T" | "2T" | "3T" | "";  // Turno de trabalho
  department: string;     // Departamento
  teamId: string;         // ID do time (vazio para Supervisores)
  subtimeId: string;      // ID do sub-time (vazio para Supervisores)
  gender: "M" | "F" | ""; // Gênero
}
```

### 2. MachineForm (Estado Local)
```typescript
type MachineForm = {
  name: string;   // Nome da máquina
  teamId: string; // ID do time ao qual a máquina pertence
}
```

### 3. SkillForm (Estado Local)
```typescript
type SkillForm = {
  name: string;       // Nome da habilidade
  teamId: string;     // Time
  subtimeId: string;  // Sub-time
}
```

### 4. Enums e Tipos Globais (lib/data.ts)
```typescript
// Tipos de Turno
export type Shift = "1T" | "2T" | "3T";

// Tipos de Senioridade
export type Senioridade = 
  | "Auxiliar" 
  | "Junior" 
  | "Pleno" 
  | "Sênior" 
  | "Especialista" 
  | "Coordenador" 
  | "Supervisor";

// Tipos de Área
export type Area = 
  | "Produção" 
  | "Manutenção" 
  | "Qualidade" 
  | "Engenharia" 
  | "Logística" 
  | "Administrativa" 
  | "Outro";

// Tipo de Gênero
export type Gender = "M" | "F";

// Tipos de Role
export type UserRole = "master" | "tecnico";
```

### 5. Interface: Machine
```typescript
export interface Machine {
  id: string;
  name: string;          // Nome da máquina (Ex: LASER, PRINTER)
  code: string;          // Código da máquina
  teamId: string;        // ID do time ao qual pertence
  description?: string;  // Descrição opcional
}
```

### 6. Interface: Skill
```typescript
export interface Skill {
  id: string;
  name: string;          // Nome da habilidade
  category: string;      // Categoria = Nome da máquina (LASER, PRINTER)
  machineId: string;     // ID da máquina
  teamId: string;        // ID do time
  subtimeId: string;     // ID do sub-time
  description?: string;  // Descrição opcional
}
```

### 7. Interface: Team
```typescript
export interface Team {
  id: string;
  name: string;          // Nome do time
  description: string;
  department: string;    // Ex: "Engenharia", "Manutenção"
  supervisorId: string;  // ID do supervisor responsável
  managerId?: string;    // ID do gerente (opcional)
  createdAt: string;
  updatedAt: string;
  status: "ativo" | "inativo";
  color?: string;        // Cor para identificação visual
}
```

### 8. Interface: SubTeam
```typescript
export interface SubTeam {
  id: string;
  name: string;
  description: string;
  parentTeamId: string;     // Time principal ao qual pertence
  coordenadorId?: string;   // Coordenador responsável (opcional)
  functions: TeamFunction[];
  evaluationCriteria: EvaluationCriteria[];
  members: string[];        // Array de IDs de colaboradores
  createdAt: string;
  updatedAt: string;
  status: "ativo" | "inativo";
}
```

### 9. Interface: Tecnico (Modelo Completo)
```typescript
export interface Tecnico {
  id: string;
  name: string;
  workday: string;
  cargo: string;
  senioridade: Senioridade;
  area: Area;
  shift: Shift;
  department: string;
  teamId?: string;           // Não se aplica a Supervisores
  subtimeId?: string;        // Sub-time ao qual pertence
  gender: Gender;
  photo?: string;            // URL ou base64 da foto
  skills: Record<string, number>;  // skillId: pontuação
  quarterlyNotes: QuarterlyNote[];
  status: "ativo" | "inativo";
  joinDate: string;
}
```

---

## 🔧 Contextos e Serviços

### 1. AuthContext (lib/auth-context.tsx)
**Propósito**: Gerenciar autenticação e autorização do usuário.

```typescript
// Interface do Usuário Autenticado
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;  // "master" | "tecnico"
  workday?: string;
}

// Interface do Contexto
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**Uso na Página**:
```typescript
const { user } = useAuth();

// Proteção de Rota: Somente role "master" pode acessar
if (!user || user.role !== "master") {
  router.push("/");
  return null;
}
```

**Migração Angular**: 
- Criar serviço `AuthService` com RxJS BehaviorSubject
- Implementar `AuthGuard` para proteger rota
- Redirecionar não-autorizados para login

---

## 📦 Estados da Aplicação

### Estados Locais (useState)
| Estado | Tipo | Valor Inicial | Propósito |
|--------|------|---------------|-----------|
| `machines` | `Machine[]` | `MACHINES` | Lista de máquinas cadastradas |
| `profilePhoto` | `string \| null` | `null` | Preview da foto do colaborador (base64) |
| `selectedMachine` | `string \| null` | `null` | ID da máquina selecionada no modal |
| `colaboradorForm` | `ColaboradorForm` | Objeto vazio | Formulário de cadastro de colaborador |
| `machineForm` | `MachineForm` | Objeto vazio | Formulário de cadastro de máquina |
| `skillForm` | `SkillForm` | Objeto vazio | Formulário de cadastro de habilidade |
| `availableSubtimes` | `any[]` | `[]` | Sub-times filtrados baseado no teamId |

**Migração Angular**: Usar `signal()` do Angular 17+ ou propriedades de classe com detecção de mudanças.

---

## 🔐 Lógica de Negócio

### 1. Proteção de Rota
```typescript
// Verificar se usuário está logado E é master
if (!user || user.role !== "master") {
  router.push("/");
  return null;
}
```

**Angular**: Implementar `CanActivate` guard.

---

### 2. Filtragem Dinâmica de Sub-times
```typescript
useEffect(() => {
  if (colaboradorForm.teamId) {
    const subtimes = mockSubTeams.filter(
      st => st.parentTeamId === colaboradorForm.teamId
    );
    setAvailableSubtimes(subtimes);
  } else {
    setAvailableSubtimes([]);
    setColaboradorForm(prev => ({ ...prev, subtimeId: "" }));
  }
}, [colaboradorForm.teamId]);
```

**Comportamento**:
- Quando um **time** é selecionado, filtra os sub-times relacionados
- Se o time for desmarcado, limpa o campo de sub-time

**Angular**: Usar `combineLatest` ou `switchMap` do RxJS para reagir a mudanças no `teamId`.

---

### 3. Filtragem de Habilidades por Máquina
```typescript
const machineSkills = (machineCode: string) => {
  return SKILLS.filter(skill => skill.category === machineCode);
};
```

**Uso**: Exibir skills no modal quando uma máquina é clicada.

---

### 4. Upload de Foto (Base64)
```typescript
const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

const removePhoto = () => {
  setProfilePhoto(null);
};
```

**Comportamento**:
- Converte imagem para base64
- Exibe preview da foto
- Permite remover foto antes do cadastro

**Angular**: Usar `FileReader` API da mesma forma, armazenar base64 no formulário.

---

### 5. Cadastro de Colaborador
```typescript
const handleAddColaborador = () => {
  // Validação: Campos obrigatórios
  if (!colaboradorForm.name || !colaboradorForm.workday || 
      !colaboradorForm.cargo || !colaboradorForm.senioridade || 
      !colaboradorForm.area || !colaboradorForm.shift || 
      !colaboradorForm.department || !colaboradorForm.gender) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  // Validação especial: Não-supervisores precisam de time e sub-time
  if (colaboradorForm.senioridade !== "Supervisor") {
    if (!colaboradorForm.teamId || !colaboradorForm.subtimeId) {
      alert("Colaboradores não-supervisores precisam ter Time e Sub-time definidos!");
      return;
    }
  }

  // Simula sucesso (substituir por chamada API)
  alert(`Colaborador ${colaboradorForm.name} cadastrado com sucesso!`);
  
  // Reset do formulário
  setColaboradorForm({
    name: "", workday: "", cargo: "", senioridade: "", 
    area: "", shift: "", department: "", teamId: "", 
    subtimeId: "", gender: ""
  });
  setProfilePhoto(null);
};
```

**Migração Angular**: 
- Usar `HttpClient` para POST na API
- Implementar validações reativas com `FormBuilder` e `Validators`
- Usar `MatSnackBar` para feedback ao usuário

---

### 6. Cadastro de Máquina
```typescript
const handleAddMachine = () => {
  if (!machineForm.name || !machineForm.teamId) {
    alert("Preencha todos os campos!");
    return;
  }

  alert(`Máquina ${machineForm.name} cadastrada com sucesso para o time!`);
  setMachineForm({ name: "", teamId: "" });
};
```

**API Esperada**: `POST /api/machines`

---

### 7. Cadastro de Habilidade
```typescript
const handleAddSkill = () => {
  if (!skillForm.name || !skillForm.teamId || !skillForm.subtimeId) {
    alert("Preencha todos os campos!");
    return;
  }

  alert(`Habilidade ${skillForm.name} cadastrada com sucesso!`);
  setSkillForm({ name: "", teamId: "", subtimeId: "" });
};
```

**API Esperada**: `POST /api/skills`

---

## ✅ Validações e Regras

### Regras de Validação para Colaboradores
| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| **Nome** | Obrigatório | "Preencha todos os campos obrigatórios!" |
| **Workday** | Obrigatório | Idem |
| **Cargo** | Obrigatório | Idem |
| **Senioridade** | Obrigatório | Idem |
| **Área** | Obrigatório | Idem |
| **Turno** | Obrigatório | Idem |
| **Departamento** | Obrigatório | Idem |
| **Gênero** | Obrigatório | Idem |
| **Time** | Obrigatório se senioridade ≠ "Supervisor" | "Colaboradores não-supervisores precisam ter Time e Sub-time definidos!" |
| **Sub-time** | Obrigatório se senioridade ≠ "Supervisor" | Idem |
| **Foto** | Opcional | - |

### Regra Especial: Supervisores
```typescript
const isSupervisor = colaboradorForm.senioridade === "Supervisor";
```

**Comportamento**:
- Se senioridade = "Supervisor", os campos **Time** e **Sub-time** são OCULTOS
- Exibe uma nota informativa: "Supervisores não são alocados a times específicos. Eles criarão seus próprios times após o cadastro."

**Angular**: Usar `*ngIf` para condicionalmente renderizar campos.

---

### Validações para Máquinas
- **Nome**: Obrigatório
- **Time**: Obrigatório

### Validações para Habilidades
- **Nome**: Obrigatório
- **Time**: Obrigatório
- **Sub-time**: Obrigatório (habilitado somente após selecionar time)

---

## 🚀 Funcionalidades Principais

### 1. Sistema de Abas (Tabs)
```tsx
<Tabs defaultValue="colaborador">
  <TabsList>
    <TabsTrigger value="colaborador">Novo Colaborador</TabsTrigger>
    <TabsTrigger value="machines">Máquinas</TabsTrigger>
    <TabsTrigger value="skills">Habilidades</TabsTrigger>
  </TabsList>
  <TabsContent value="colaborador">...</TabsContent>
  <TabsContent value="machines">...</TabsContent>
  <TabsContent value="skills">...</TabsContent>
</Tabs>
```

**Angular**: Usar `mat-tab-group` do Angular Material.

---

### 2. Upload de Foto com Preview
```tsx
{/* Lógica: Se foto existe, exibe preview; senão, exibe botão de upload */}
{profilePhoto ? (
  <div className="relative">
    <img src={profilePhoto} alt="Foto" className="w-32 h-32 rounded-full" />
    <button onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-500">
      <X size={16} />
    </button>
  </div>
) : (
  <label className="cursor-pointer">
    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
  </label>
)}
```

**Angular**: 
- Usar `(change)` event binding no input file
- Armazenar base64 em variável de formulário
- Exibir com `[src]` binding e `*ngIf`

---

### 3. Grid Responsivo de Máquinas
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {machines.map((machine) => (
    <Card key={machine.id} onClick={() => setSelectedMachine(machine.id)}>
      <div className="w-16 h-16 rounded-full bg-primary/10">
        <Settings className="w-8 h-8 text-primary" />
      </div>
      <h3>{machine.name}</h3>
      <Badge>{skillCount} habilidades</Badge>
    </Card>
  ))}
</div>
```

**Responsividade**:
- Mobile: 2 colunas
- Tablet: 3 colunas
- Desktop: 4 colunas

**Angular**: Usar Tailwind grid classes + `*ngFor`.

---

### 4. Modal de Habilidades por Máquina
```tsx
<Dialog open={selectedMachine !== null} onOpenChange={() => setSelectedMachine(null)}>
  <DialogContent>
    <DialogTitle>{selectedMachineData?.name}</DialogTitle>
    {selectedMachineSkills.map((skill) => (
      <div key={skill.id}>
        <h4>{skill.name}</h4>
        <Badge>{skill.category}</Badge>
      </div>
    ))}
  </DialogContent>
</Dialog>
```

**Angular**: Usar `mat-dialog` do Angular Material.

---

### 5. Dropdowns Encadeados (Time → Sub-time)
```tsx
{/* Dropdown de Time */}
<select value={colaboradorForm.teamId} onChange={(e) => setColaboradorForm({...colaboradorForm, teamId: e.target.value})}>
  <option value="">Selecione um time</option>
  {mockTeams.filter(t => t.status === "ativo").map((team) => (
    <option key={team.id} value={team.id}>{team.name}</option>
  ))}
</select>

{/* Dropdown de Sub-time (habilitado somente se teamId estiver preenchido) */}
<select 
  value={colaboradorForm.subtimeId} 
  disabled={!colaboradorForm.teamId}
  onChange={(e) => setColaboradorForm({...colaboradorForm, subtimeId: e.target.value})}
>
  <option value="">Selecione um sub-time</option>
  {availableSubtimes.map((subtime) => (
    <option key={subtime.id} value={subtime.id}>{subtime.name}</option>
  ))}
</select>
```

**Angular**: 
- Usar `[disabled]` binding
- Filtrar sub-times com pipe `async` e Observable

---

### 6. Filtragem de Times Ativos
```typescript
mockTeams.filter(t => t.status === "ativo")
```

**Comportamento**: Exibe somente times com status "ativo" nos dropdowns.

---

## 🎨 Classes Tailwind CSS Utilizadas

### Layout e Espaçamento
| Classe | Uso |
|--------|-----|
| `p-6` | Padding do container principal |
| `space-y-4` | Espaçamento vertical entre elementos |
| `space-y-6` | Espaçamento vertical maior |
| `gap-4` | Gap no grid |
| `mt-2`, `mb-6` | Margin top/bottom |

### Grid System
```css
grid grid-cols-1 md:grid-cols-2   /* Formulário: 1 coluna mobile, 2 desktop */
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4   /* Grid máquinas: responsivo */
```

### Tipografia
| Classe | Uso |
|--------|-----|
| `text-4xl font-bold text-primary` | Título da página |
| `text-sm font-semibold` | Labels dos campos |
| `text-muted-foreground` | Texto secundário |
| `text-xs` | Texto pequeno |

### Componentes de Formulário
```css
/* Input/Select Styling */
border-primary/20           /* Borda sutil */
rounded p-2                 /* Arredondamento e padding */
bg-card text-card-foreground  /* Cores do tema */
h-10                        /* Altura padrão */
w-full                      /* Largura total */

/* Button */
bg-primary hover:bg-primary/90  /* Cor e hover */
w-full                      /* Largura total */
```

### Upload de Foto
```css
/* Container da Foto */
w-32 h-32 rounded-full      /* Tamanho e formato circular */
object-cover                /* Ajuste da imagem */
border-4 border-primary     /* Borda destacada */

/* Botão Upload */
border-2 border-dashed border-primary  /* Borda tracejada */
hover:bg-gray-300           /* Hover state */
```

### Cards de Máquinas
```css
border-primary/20 
hover:border-primary 
hover:shadow-lg             /* Efeito hover */
transition-all              /* Animação suave */
cursor-pointer              /* Indica clicável */
group                       /* Permite group-hover em filhos */
```

### Nota Informativa (Supervisores)
```css
bg-blue-50 border border-blue-200 rounded p-4   /* Estilo de alerta */
text-sm text-blue-800       /* Cor do texto */
```

### States e Interações
```css
disabled:opacity-50         /* Campo desabilitado */
transition-colors           /* Animação de cores */
group-hover:bg-primary/20   /* Hover em elementos filhos */
```

---

## 🔌 Integração com APIs

### Endpoints Esperados

#### 1. Cadastrar Colaborador
```http
POST /api/colaboradores
Content-Type: application/json

{
  "name": "João Silva",
  "workday": "WDC00001",
  "cargo": "Engenheiro de Produção",
  "senioridade": "Pleno",
  "area": "Produção",
  "shift": "1T",
  "department": "Engenharia",
  "teamId": "team1",         // Opcional se Supervisor
  "subtimeId": "subteam1",   // Opcional se Supervisor
  "gender": "M",
  "photo": "data:image/jpeg;base64,..."  // Base64 da foto
}
```

#### 2. Cadastrar Máquina
```http
POST /api/machines
Content-Type: application/json

{
  "name": "LASER",
  "teamId": "team1"
}
```

#### 3. Cadastrar Habilidade
```http
POST /api/skills
Content-Type: application/json

{
  "name": "Manutenção Preventiva",
  "teamId": "team1",
  "subtimeId": "subteam1"
}
```

#### 4. Listar Times
```http
GET /api/teams?status=ativo
```

**Resposta**:
```json
[
  {
    "id": "team1",
    "name": "Time Alpha",
    "status": "ativo",
    ...
  }
]
```

#### 5. Listar Sub-times por Time
```http
GET /api/subtimes?teamId=team1
```

#### 6. Listar Máquinas
```http
GET /api/machines
```

#### 7. Listar Habilidades por Máquina
```http
GET /api/skills?machineCode=LASER
```

---

## 🔄 Mapeamento React → Angular

### 1. Componentes UI

| Componente React | Equivalente Angular | Biblioteca |
|------------------|---------------------|------------|
| `Card` (Shadcn) | `mat-card` | Angular Material |
| `Tabs` | `mat-tab-group` | Angular Material |
| `Button` | `button mat-raised-button` | Angular Material |
| `Input` | `mat-form-field` + `input matInput` | Angular Material |
| `Badge` | `mat-chip` | Angular Material |
| `Dialog` | `MatDialog` service | Angular Material |
| `Select (nativo)` | `mat-select` | Angular Material |

### 2. Hooks → Angular Equivalente

| React Hook | Angular Equivalente | Como Implementar |
|------------|---------------------|------------------|
| `useState` | `signal()` ou propriedade de classe | Angular 17+ Signals |
| `useEffect` | `effect()` ou `ngOnInit` | Lifecycle hooks |
| `useAuth` (custom) | `AuthService` | Serviço injetável |
| `useRouter` (Next.js) | `Router` (Angular) | `@angular/router` |

### 3. Diretivas e Sintaxe

| React | Angular | Exemplo |
|-------|---------|---------|
| `{condition && <Component />}` | `*ngIf="condition"` | `<div *ngIf="isSupervisor">` |
| `{array.map(item => ...)}` | `*ngFor="let item of array"` | `<div *ngFor="let machine of machines">` |
| `className="..."` | `class="..."` ou `[ngClass]` | `<div class="p-6">` |
| `onChange={(e) => ...}` | `(change)="..."` | `<input (input)="onChange($event)">` |
| `disabled={!condition}` | `[disabled]="!condition"` | `<select [disabled]="!teamId">` |

### 4. Formulários

| React | Angular Reactive Forms |
|-------|------------------------|
| Estado local com `useState` | `FormGroup` com `FormBuilder` |
| Validações manuais no submit | `Validators` do Angular |
| `value={form.field}` | `formControlName="field"` |
| `onChange={(e) => setForm(...)}` | Two-way binding automático |

**Exemplo Angular**:
```typescript
// Componente TypeScript
colaboradorForm = this.fb.group({
  name: ['', Validators.required],
  workday: ['', Validators.required],
  cargo: ['', Validators.required],
  senioridade: ['', Validators.required],
  area: ['', Validators.required],
  shift: ['', Validators.required],
  department: ['', Validators.required],
  gender: ['', Validators.required],
  teamId: [''],
  subtimeId: ['']
});
```

```html
<!-- Template HTML -->
<form [formGroup]="colaboradorForm" (ngSubmit)="handleAddColaborador()">
  <mat-form-field>
    <input matInput placeholder="Nome Completo" formControlName="name">
    <mat-error *ngIf="colaboradorForm.get('name')?.hasError('required')">
      Campo obrigatório
    </mat-error>
  </mat-form-field>
</form>
```

---

## 🌐 Considerações SSR/SSG no Angular

### Server-Side Rendering (SSR)
**Quando Usar**: 
- SEO importante
- First Contentful Paint crítico
- Aplicações públicas

**Para Esta Página**:
❌ **NÃO RECOMENDADO** porque:
1. Página protegida por autenticação (não indexável)
2. Role "master" exclusivo
3. Conteúdo dinâmico e privado
4. Não há benefício de SEO

### Static Site Generation (SSG)
**Quando Usar**:
- Páginas com conteúdo estático
- Builds pré-renderizados

**Para Esta Página**:
❌ **NÃO APLICÁVEL** porque:
1. Formulários dinâmicos
2. Dados dependem de APIs em tempo real
3. Estados gerenciados no cliente

### Recomendação: Client-Side Rendering (CSR)
✅ **USAR CSR** porque:
- Página administrativa
- Interações complexas (upload de foto, filtros dinâmicos)
- Proteção de rota no lado do cliente
- Melhor experiência com Angular Material

**Implementação Angular**:
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()  // Para Angular Material
  ]
};
```

**Guarda de Rota**:
```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.user$ && authService.user$.role === 'master') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// routes.ts
{
  path: 'cadastro',
  component: CadastroComponent,
  canActivate: [authGuard]
}
```

---

## 📁 Estrutura de Arquivos Angular Sugerida

```
src/
├── app/
│   ├── core/                           # Serviços singleton
│   │   ├── services/
│   │   │   ├── auth.service.ts         # Gerenciamento de autenticação
│   │   │   ├── api.service.ts          # Wrapper do HttpClient
│   │   │   └── notification.service.ts # Toasts/Snackbars
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Proteção de rota
│   │   └── interceptors/
│   │       └── auth.interceptor.ts     # Adicionar token JWT
│   │
│   ├── shared/                         # Componentes reutilizáveis
│   │   ├── components/
│   │   │   └── app-layout/
│   │   │       ├── app-layout.component.ts
│   │   │       └── sidebar/
│   │   ├── models/                     # Interfaces TypeScript
│   │   │   ├── colaborador.model.ts
│   │   │   ├── machine.model.ts
│   │   │   ├── skill.model.ts
│   │   │   ├── team.model.ts
│   │   │   └── enums.ts
│   │   └── pipes/                      # Pipes customizados
│   │
│   ├── features/                       # Módulos de funcionalidades
│   │   └── cadastro/
│   │       ├── cadastro.component.ts           # Componente principal
│   │       ├── cadastro.component.html
│   │       ├── cadastro.component.scss
│   │       ├── components/
│   │       │   ├── colaborador-form/
│   │       │   │   ├── colaborador-form.component.ts
│   │       │   │   └── colaborador-form.component.html
│   │       │   ├── machine-form/
│   │       │   │   ├── machine-form.component.ts
│   │       │   │   └── machine-form.component.html
│   │       │   ├── skill-form/
│   │       │   │   ├── skill-form.component.ts
│   │       │   │   └── skill-form.component.html
│   │       │   └── machine-skills-modal/
│   │       │       ├── machine-skills-modal.component.ts
│   │       │       └── machine-skills-modal.component.html
│   │       └── services/
│   │           ├── colaborador.service.ts      # CRUD de colaboradores
│   │           ├── machine.service.ts          # CRUD de máquinas
│   │           └── skill.service.ts            # CRUD de habilidades
│   │
│   ├── app.config.ts                   # Configuração do app (Angular 17+)
│   └── app.routes.ts                   # Rotas
│
├── styles/
│   ├── styles.scss                     # Estilos globais
│   └── tailwind.scss                   # Importação do Tailwind
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## 📦 Dependências e Bibliotecas

### Instalação Angular 17+
```bash
# Criar projeto
ng new skill-frontend --standalone --routing --style=scss

cd skill-frontend

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Instalar Angular Material
ng add @angular/material

# Instalar Lucide Angular (ícones)
npm install lucide-angular

# Instalar RxJS (já vem por padrão)
```

### Configuração Tailwind CSS
**tailwind.config.js**:
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // ... outras cores do tema
      }
    },
  },
  plugins: [],
}
```

**styles.scss**:
```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

// Angular Material theme
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

### Angular Material Modules
```typescript
// material.module.ts
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  exports: [
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    MatSnackBarModule
  ]
})
export class MaterialModule {}
```

---

## 🔥 Implementação Passo a Passo (Angular)

### 1. Criar Modelos TypeScript
```typescript
// src/app/shared/models/enums.ts
export enum Senioridade {
  Auxiliar = 'Auxiliar',
  Junior = 'Junior',
  Pleno = 'Pleno',
  Senior = 'Sênior',
  Especialista = 'Especialista',
  Coordenador = 'Coordenador',
  Supervisor = 'Supervisor'
}

export enum Area {
  Producao = 'Produção',
  Manutencao = 'Manutenção',
  Qualidade = 'Qualidade',
  Engenharia = 'Engenharia',
  Logistica = 'Logística',
  Administrativa = 'Administrativa',
  Outro = 'Outro'
}

export enum Shift {
  Primeiro = '1T',
  Segundo = '2T',
  Terceiro = '3T'
}

export enum Gender {
  Masculino = 'M',
  Feminino = 'F'
}
```

### 2. Criar Serviço de Autenticação
```typescript
// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'tecnico';
  workday?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<AuthUser | null>(null);
  isLoading = signal(false);

  constructor(private router: Router) {}

  login(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock authentication
        if (email === 'master@example.com' && password === 'password') {
          this.user.set({
            id: Math.random().toString(36).slice(2),
            email,
            name: 'Maria Silva',
            role: 'master'
          });
          this.router.navigate(['/home']);
        }
        this.isLoading.set(false);
        resolve();
      }, 500);
    });
  }

  logout(): void {
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}
```

### 3. Criar Guard de Autenticação
```typescript
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();
  
  if (user && user.role === 'master') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### 4. Criar Serviço de Colaboradores
```typescript
// src/app/features/cadastro/services/colaborador.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ColaboradorDTO {
  name: string;
  workday: string;
  cargo: string;
  senioridade: string;
  area: string;
  shift: string;
  department: string;
  teamId?: string;
  subtimeId?: string;
  gender: string;
  photo?: string;
}

@Injectable({ providedIn: 'root' })
export class ColaboradorService {
  private http = inject(HttpClient);
  private apiUrl = '/api/colaboradores';

  create(colaborador: ColaboradorDTO): Observable<any> {
    return this.http.post(this.apiUrl, colaborador);
  }
}
```

### 5. Componente Principal de Cadastro
```typescript
// src/app/features/cadastro/cadastro.component.ts
import { Component, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColaboradorService } from './services/colaborador.service';
import { Senioridade } from '@shared/models/enums';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  standalone: true,
  imports: [
    // Importar módulos necessários
  ]
})
export class CadastroComponent {
  private fb = inject(FormBuilder);
  private colaboradorService = inject(ColaboradorService);
  private snackBar = inject(MatSnackBar);

  profilePhoto = signal<string | null>(null);
  selectedMachine = signal<string | null>(null);
  availableSubtimes = signal<any[]>([]);

  // Reactive Form
  colaboradorForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    workday: ['', Validators.required],
    cargo: ['', Validators.required],
    senioridade: ['', Validators.required],
    area: ['', Validators.required],
    shift: ['', Validators.required],
    department: ['', Validators.required],
    gender: ['', Validators.required],
    teamId: [''],
    subtimeId: ['']
  });

  // Effect para filtrar sub-times baseado no teamId
  constructor() {
    effect(() => {
      const teamId = this.colaboradorForm.get('teamId')?.value;
      if (teamId) {
        // Filtrar sub-times
        const subtimes = this.mockSubTeams.filter(
          st => st.parentTeamId === teamId
        );
        this.availableSubtimes.set(subtimes);
      } else {
        this.availableSubtimes.set([]);
        this.colaboradorForm.patchValue({ subtimeId: '' });
      }
    });
  }

  handleAddColaborador(): void {
    if (this.colaboradorForm.invalid) {
      this.snackBar.open('Preencha todos os campos obrigatórios!', 'Fechar', {
        duration: 3000
      });
      return;
    }

    const senioridade = this.colaboradorForm.get('senioridade')?.value;
    if (senioridade !== Senioridade.Supervisor) {
      const teamId = this.colaboradorForm.get('teamId')?.value;
      const subtimeId = this.colaboradorForm.get('subtimeId')?.value;
      
      if (!teamId || !subtimeId) {
        this.snackBar.open(
          'Colaboradores não-supervisores precisam ter Time e Sub-time!',
          'Fechar',
          { duration: 3000 }
        );
        return;
      }
    }

    const colaborador = {
      ...this.colaboradorForm.value,
      photo: this.profilePhoto()
    };

    this.colaboradorService.create(colaborador).subscribe({
      next: () => {
        this.snackBar.open('Colaborador cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.colaboradorForm.reset();
        this.profilePhoto.set(null);
      },
      error: (err) => {
        this.snackBar.open('Erro ao cadastrar colaborador', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  handlePhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.profilePhoto.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.profilePhoto.set(null);
  }

  get isSupervisor(): boolean {
    return this.colaboradorForm.get('senioridade')?.value === Senioridade.Supervisor;
  }
}
```

### 6. Template HTML (Resumido)
```html
<!-- cadastro.component.html -->
<app-layout>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-4xl font-bold text-primary">Cadastro</h1>
      <p class="text-muted-foreground mt-2">
        Gerenciar colaboradores, máquinas e habilidades
      </p>
    </div>

    <mat-tab-group>
      <!-- Aba: Novo Colaborador -->
      <mat-tab label="Novo Colaborador">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Cadastrar Novo Colaborador</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="colaboradorForm" (ngSubmit)="handleAddColaborador()">
              
              <!-- Upload de Foto -->
              <div class="flex justify-center mb-6">
                <div class="relative" *ngIf="profilePhoto(); else uploadButton">
                  <img 
                    [src]="profilePhoto()" 
                    alt="Foto" 
                    class="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <button 
                    type="button"
                    (click)="removePhoto()"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <lucide-icon name="x" [size]="16"></lucide-icon>
                  </button>
                </div>
                
                <ng-template #uploadButton>
                  <label class="cursor-pointer">
                    <div class="w-32 h-32 rounded-full bg-gray-200 flex flex-col items-center justify-center border-2 border-dashed border-primary">
                      <lucide-icon name="upload" [size]="32" class="text-primary mb-2"></lucide-icon>
                      <span class="text-xs text-gray-600">Adicionar Foto</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      (change)="handlePhotoChange($event)" 
                      class="hidden"
                    />
                  </label>
                </ng-template>
              </div>

              <!-- Grid de Campos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- Nome -->
                <mat-form-field appearance="outline">
                  <mat-label>Nome Completo *</mat-label>
                  <input matInput formControlName="name" placeholder="Nome completo">
                  <mat-error *ngIf="colaboradorForm.get('name')?.hasError('required')">
                    Campo obrigatório
                  </mat-error>
                </mat-form-field>

                <!-- Workday -->
                <mat-form-field appearance="outline">
                  <mat-label>Workday *</mat-label>
                  <input matInput formControlName="workday" placeholder="Ex: WDC00001">
                  <mat-error *ngIf="colaboradorForm.get('workday')?.hasError('required')">
                    Campo obrigatório
                  </mat-error>
                </mat-form-field>

                <!-- Cargo -->
                <mat-form-field appearance="outline">
                  <mat-label>Cargo *</mat-label>
                  <input matInput formControlName="cargo" placeholder="Ex: Engenheiro">
                </mat-form-field>

                <!-- Senioridade -->
                <mat-form-field appearance="outline">
                  <mat-label>Senioridade *</mat-label>
                  <mat-select formControlName="senioridade">
                    <mat-option value="">Selecione</mat-option>
                    <mat-option value="Auxiliar">Auxiliar</mat-option>
                    <mat-option value="Junior">Júnior</mat-option>
                    <mat-option value="Pleno">Pleno</mat-option>
                    <mat-option value="Sênior">Sênior</mat-option>
                    <mat-option value="Especialista">Especialista</mat-option>
                    <mat-option value="Coordenador">Coordenador</mat-option>
                    <mat-option value="Supervisor">Supervisor</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Área -->
                <mat-form-field appearance="outline">
                  <mat-label>Área *</mat-label>
                  <mat-select formControlName="area">
                    <mat-option value="">Selecione</mat-option>
                    <mat-option value="Produção">Produção</mat-option>
                    <mat-option value="Manutenção">Manutenção</mat-option>
                    <mat-option value="Qualidade">Qualidade</mat-option>
                    <mat-option value="Engenharia">Engenharia</mat-option>
                    <mat-option value="Logística">Logística</mat-option>
                    <mat-option value="Administrativa">Administrativa</mat-option>
                    <mat-option value="Outro">Outro</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Turno -->
                <mat-form-field appearance="outline">
                  <mat-label>Turno *</mat-label>
                  <mat-select formControlName="shift">
                    <mat-option value="">Selecione</mat-option>
                    <mat-option value="1T">1T</mat-option>
                    <mat-option value="2T">2T</mat-option>
                    <mat-option value="3T">3T</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Departamento -->
                <mat-form-field appearance="outline">
                  <mat-label>Departamento *</mat-label>
                  <input matInput formControlName="department" placeholder="Ex: Engenharia">
                </mat-form-field>

                <!-- Gênero -->
                <mat-form-field appearance="outline">
                  <mat-label>Gênero *</mat-label>
                  <mat-select formControlName="gender">
                    <mat-option value="">Selecione</mat-option>
                    <mat-option value="M">Masculino</mat-option>
                    <mat-option value="F">Feminino</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Time (somente se não for Supervisor) -->
                <mat-form-field appearance="outline" *ngIf="!isSupervisor">
                  <mat-label>Time *</mat-label>
                  <mat-select formControlName="teamId">
                    <mat-option value="">Selecione</mat-option>
                    <mat-option 
                      *ngFor="let team of mockTeams" 
                      [value]="team.id"
                    >
                      {{ team.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Sub-time (somente se não for Supervisor) -->
                <mat-form-field appearance="outline" *ngIf="!isSupervisor">
                  <mat-label>Sub-time *</mat-label>
                  <mat-select 
                    formControlName="subtimeId"
                    [disabled]="!colaboradorForm.get('teamId')?.value"
                  >
                    <mat-option value="">Selecione</mat-option>
                    <mat-option 
                      *ngFor="let subtime of availableSubtimes()" 
                      [value]="subtime.id"
                    >
                      {{ subtime.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

              </div>

              <!-- Nota Informativa para Supervisores -->
              <div 
                *ngIf="isSupervisor" 
                class="bg-blue-50 border border-blue-200 rounded p-4 mt-4"
              >
                <p class="text-sm text-blue-800">
                  <strong>Nota:</strong> Supervisores não são alocados a times específicos. 
                  Eles criarão seus próprios times após o cadastro.
                </p>
              </div>

              <!-- Botão Submit -->
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                class="w-full mt-4"
              >
                Cadastrar Colaborador
              </button>

            </form>
          </mat-card-content>
        </mat-card>
      </mat-tab>

      <!-- Aba: Máquinas -->
      <mat-tab label="Máquinas">
        <!-- Implementar formulário de máquinas -->
      </mat-tab>

      <!-- Aba: Habilidades -->
      <mat-tab label="Habilidades">
        <!-- Implementar formulário de habilidades -->
      </mat-tab>

    </mat-tab-group>
  </div>
</app-layout>
```

---

## 📝 Checklist de Migração

### ✅ Preparação
- [ ] Instalar Angular 17+
- [ ] Configurar Tailwind CSS
- [ ] Instalar Angular Material
- [ ] Instalar Lucide Angular (ícones)
- [ ] Configurar HttpClient

### ✅ Estrutura
- [ ] Criar modelos TypeScript (interfaces/enums)
- [ ] Criar `AuthService` com Signals
- [ ] Criar `AuthGuard` para proteção de rota
- [ ] Criar serviços de API (ColaboradorService, MachineService, SkillService)
- [ ] Criar componente `AppLayout` com sidebar

### ✅ Página de Cadastro
- [ ] Criar componente `CadastroComponent`
- [ ] Implementar sistema de abas com `mat-tab-group`
- [ ] Criar formulário reativo para colaboradores
- [ ] Implementar upload e preview de foto
- [ ] Implementar lógica de filtro de sub-times
- [ ] Implementar validações condicionais (Supervisor)
- [ ] Criar grid responsivo de máquinas
- [ ] Implementar modal de habilidades por máquina
- [ ] Criar formulário de máquinas
- [ ] Criar formulário de habilidades

### ✅ Integração
- [ ] Conectar com API de colaboradores (POST)
- [ ] Conectar com API de máquinas (GET/POST)
- [ ] Conectar com API de habilidades (GET/POST)
- [ ] Conectar com API de times (GET)
- [ ] Conectar com API de sub-times (GET)
- [ ] Implementar tratamento de erros
- [ ] Implementar feedback ao usuário (Snackbar/Toast)

### ✅ Testes
- [ ] Testar proteção de rota
- [ ] Testar validações de formulário
- [ ] Testar upload de foto
- [ ] Testar filtros dinâmicos (time → sub-time)
- [ ] Testar comportamento especial para Supervisores
- [ ] Testar responsividade (mobile, tablet, desktop)

---

## 🎓 Conceitos Importantes

### Diferenças Principais React vs Angular

| Aspecto | React/Next.js | Angular |
|---------|---------------|---------|
| **Arquitetura** | Biblioteca (UI apenas) | Framework completo (opinionado) |
| **Estado** | Hooks (`useState`, `useEffect`) | Signals ou RxJS Observables |
| **Formulários** | Controlados manualmente | Reactive Forms (validações built-in) |
| **Roteamento** | `next/navigation` | `@angular/router` |
| **HTTP** | Fetch API ou Axios | `HttpClient` (built-in) |
| **Estilização** | className + Tailwind | class/ngClass + Tailwind |
| **Componentes** | JSX | Templates HTML separados |
| **Detecção de Mudanças** | Reconciliação Virtual DOM | Zone.js ou OnPush Strategy |

---

## 🚨 Pontos de Atenção

1. **Validações Condicionais**: Supervisores não precisam de time/sub-time
2. **Upload de Foto**: Converter para base64 antes de enviar para API
3. **Filtros Encadeados**: Time → Sub-time (reativo)
4. **Status de Times**: Somente times com `status: "ativo"` aparecem
5. **Proteção de Rota**: Somente role "master" pode acessar
6. **Modal de Habilidades**: Filtrar por `category` (código da máquina)
7. **Reset de Formulários**: Após sucesso no cadastro
8. **Feedback ao Usuário**: Usar Snackbar do Material para mensagens

---

## 📚 Documentação de Referência

### Angular
- [Angular Docs](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [Reactive Forms Guide](https://angular.dev/guide/forms/reactive-forms)

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind with Angular](https://tailwindcss.com/docs/guides/angular)

### Lucide Icons
- [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular)

---

## 🎉 Conclusão

Esta documentação fornece uma visão completa da página de Cadastro e todos os detalhes necessários para migrá-la para Angular 17+. A estrutura foi projetada para:

- ✅ Ser escalável e manutenível
- ✅ Seguir as melhores práticas do Angular
- ✅ Manter a mesma experiência do usuário
- ✅ Facilitar testes e debugging
- ✅ Suportar futura expansão de funcionalidades

**BOA SORTE NA MIGRAÇÃO! 🚀**
