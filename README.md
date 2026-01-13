# SisOp - Sistema de Desempenho de Operadores

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?logo=tailwind-css)

## 📋 Sobre o Projeto

O **SisOp** (Sistema de Desempenho de Operadores) é uma plataforma web moderna e profissional para gerenciamento e análise de desempenho de operadores em ambientes industriais e de telecomunicações. O sistema oferece dashboards interativos, gestão de equipes, avaliações de performance e análises detalhadas por máquinas, turnos e habilidades.

### 🎯 Principais Funcionalidades

- **Gestão de Operadores**: Cadastro, edição e visualização de técnicos com informações completas
- **Dashboard Analítico**: Visão geral com gráficos de performance, rankings e estatísticas
- **Sistema de Habilidades**: Avaliação por habilidades específicas vinculadas a máquinas
- **Gestão de Times**: Organização em times e sub-times com funções e lideranças
- **Avaliações Trimestrais**: Registro de notas por trimestre com histórico completo
- **Análises Avançadas**: Gráficos radar, barras e linhas para análise detalhada
- **Sistema de Autenticação**: Dois níveis de acesso (Master/Supervisor e Operador)
- **Modo Claro/Escuro**: Interface adaptável com suporte a temas

## 🚀 Tecnologias Utilizadas

### Core
- **[Next.js 16.0](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca JavaScript para UI
- **[TypeScript 5.6](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática

### UI & Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Gerenciamento de temas

### Gráficos & Visualização
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React

### Formulários & Validação
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Schema validation

### Utilidades
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes CSS condicionais
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificações toast

## 📁 Estrutura do Projeto

```
sistema/
├── app/                          # App Router do Next.js
│   ├── layout.tsx               # Layout raiz da aplicação
│   ├── page.tsx                 # Página inicial (redireciona para login)
│   ├── globals.css              # Estilos globais
│   ├── login/                   # Autenticação
│   ├── dashboard/               # Dashboard principal (Master)
│   ├── dashboards/              # Dashboards analíticos avançados
│   ├── tecnicos/                # Listagem e detalhes de técnicos
│   ├── cadastro/                # Cadastro de máquinas, habilidades e técnicos
│   ├── usuarios/                # Gerenciamento de usuários
│   ├── avaliacoes/              # Sistema de avaliações
│   ├── times/                   # Gestão de times e sub-times
│   ├── rankings/                # Rankings de desempenho
│   ├── historico/               # Histórico de avaliações
│   ├── meu-desempenho/          # Dashboard do operador (Técnico)
│   └── ...                      # Outras páginas
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes UI reutilizáveis (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...                  # ~50 componentes UI
│   ├── layout/                  # Componentes de layout
│   │   ├── app-layout.tsx       # Layout principal com sidebar
│   │   ├── sidebar.tsx          # Menu lateral de navegação
│   │   └── main-layout.tsx      # Container principal
│   ├── dashboard/               # Componentes específicos do dashboard
│   │   ├── stats-card.tsx
│   │   ├── performance-chart.tsx
│   │   └── operator-ranking.tsx
│   ├── theme-provider.tsx       # Provider de temas
│   └── toast-container.tsx      # Container de notificações
│
├── lib/                         # Bibliotecas e utilitários
│   ├── auth-context.tsx         # Context de autenticação
│   ├── notification-context.tsx # Context de notificações
│   ├── data.ts                  # Dados mockados e tipos
│   └── utils.ts                 # Funções utilitárias
│
├── hooks/                       # Custom hooks
│   ├── use-mobile.ts           # Hook para detectar dispositivos móveis
│   └── use-toast.ts            # Hook para notificações
│
├── public/                      # Arquivos estáticos
├── styles/                      # Estilos adicionais
│
├── components.json              # Configuração shadcn/ui
├── next.config.mjs              # Configuração Next.js
├── tailwind.config.ts           # Configuração Tailwind CSS
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências do projeto
└── pnpm-lock.yaml              # Lock file do pnpm

```

## 🎨 Design System

### Paleta de Cores
- **Primária**: Azul Marinho (`#0A3D62`)
- **Secundária**: Branco (`#FFFFFF`)
- **Sucesso**: Verde (`#10b981`)
- **Aviso**: Amarelo (`#f59e0b`)
- **Erro**: Vermelho (`#ef4444`)

### Componentes UI
O projeto utiliza uma biblioteca completa de componentes baseada em **shadcn/ui** com mais de 50 componentes prontos:
- Forms, Inputs, Selects, Checkboxes, Radio Groups
- Dialogs, Modals, Sheets, Popovers, Tooltips
- Tables, Cards, Badges, Avatars
- Charts, Progress Bars, Spinners
- Navigation Menus, Breadcrumbs, Tabs
- E muito mais...

## 👥 Níveis de Acesso

### 🔑 Master/Supervisor
**Email**: `master@example.com`  
**Senha**: `password`

**Acesso a**:
- Dashboard geral com estatísticas e gráficos
- Listagem e detalhes de todos os operadores
- Cadastro de máquinas, habilidades e técnicos
- Dashboards analíticos avançados
- Gerenciamento de usuários
- Sistema de avaliações
- Gestão de times e sub-times
- Rankings e histórico completo

### 👷 Operador/Técnico
**Email**: `tecnico@example.com`  
**Senha**: `password`

**Acesso a**:
- Visualização do próprio desempenho
- Gráficos de evolução pessoal
- Habilidades e pontuações
- Histórico de avaliações pessoais

## 🛠️ Instalação e Configuração

### Pré-requisitos
- **Node.js**: versão 18 ou superior
- **pnpm**: gerenciador de pacotes (recomendado)
- **Git**: para controle de versão

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd sistema
```

2. **Instale as dependências**
```bash
pnpm install
# ou
npm install
# ou
yarn install
```

3. **Execute o projeto em modo de desenvolvimento**
```bash
pnpm dev
# ou
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📜 Scripts Disponíveis

```bash
pnpm dev      # Inicia o servidor de desenvolvimento
pnpm build    # Cria build de produção
pnpm start    # Inicia o servidor de produção
pnpm lint     # Executa o linter (ESLint)
```

## 📊 Estrutura de Dados

### Principais Entidades

#### Técnico (Operador)
```typescript
interface Tecnico {
  id: string
  name: string
  workday: string          // ID único do operador
  cargo: string            // Cargo/função
  area: string             // Área de atuação
  shift: "1" | "2" | "3"   // Turno
  teamId?: string          // Time ao qual pertence
  skills: Record<string, number>  // Habilidades por máquina
  quarterlyNotes: QuarterlyNote[] // Notas trimestrais
  status: "ativo" | "inativo"
  joinDate: string
}
```

#### Máquina
```typescript
interface Machine {
  id: string
  name: string
  code: string
}
```

#### Habilidade
```typescript
interface Skill {
  id: string
  name: string
  category: string
}
```

#### Time
```typescript
interface Team {
  id: string
  name: string
  description: string
  department: string
  managerId?: string
  status: "ativo" | "inativo"
  color?: string
}
```

#### Sub-Time
```typescript
interface SubTeam {
  id: string
  name: string
  description: string
  parentTeamId: string
  functions: TeamFunction[]
  evaluationCriteria: EvaluationCriteria[]
  members: string[]
  leaderId?: string
  status: "ativo" | "inativo"
}
```

## 🗺️ Rotas da Aplicação

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Página inicial (redireciona para login) |
| `/login` | Público | Autenticação |
| `/dashboard` | Master | Dashboard principal com visão geral |
| `/dashboards` | Master | Dashboards analíticos avançados |
| `/tecnicos` | Master | Listagem de operadores |
| `/tecnicos/[id]` | Master | Detalhes do operador |
| `/cadastro` | Master | Cadastro de máquinas, habilidades e técnicos |
| `/usuarios` | Master | Gerenciamento de usuários |
| `/avaliacoes` | Master | Sistema de avaliações |
| `/times` | Master | Gestão de times |
| `/times/[id]` | Master | Detalhes do time |
| `/rankings` | Master | Rankings de desempenho |
| `/historico` | Master | Histórico de avaliações |
| `/meu-desempenho` | Técnico | Dashboard pessoal do operador |

## 🎯 Funcionalidades Principais

### 1. Dashboard Principal
- **Cards de Estatísticas**: Operadores ativos, pontuação média, total de máquinas
- **Gráfico de Barras**: Pontuação por operador
- **Gráfico de Linhas**: Evolução de desempenho mensal
- **Lista de Operadores**: Visão geral com nome, workday, máquina, turno e pontuação

### 2. Gestão de Técnicos
- **Listagem Completa**: Grid responsivo com cards de operadores
- **Busca em Tempo Real**: Filtragem por nome ou workday
- **Detalhes do Técnico**: Página individual com informações completas
- **Status**: Visualização de operadores ativos/inativos

### 3. Sistema de Cadastro
- **Máquinas**: Cadastro com nome e código
- **Habilidades**: Cadastro com nome e categoria
- **Técnicos**: Cadastro completo com workday, máquina e turno

### 4. Dashboards Analíticos
- **Gráficos Radar**: Desempenho por turno (1º, 2º, 3º)
- **Perfil Detalhado**: Análise aprofundada por operador
- **Desempenho por Máquina**: Comparativo entre equipamentos

### 5. Gestão de Times
- **Criação de Times**: Organização por departamento
- **Sub-Times**: Divisão em grupos menores
- **Funções**: Atribuição de responsabilidades
- **Lideranças**: Definição de líderes de time

### 6. Sistema de Avaliações
- **Avaliações Trimestrais**: Registro de notas por trimestre
- **Critérios Customizáveis**: Definição de pesos e pontuações
- **Histórico Completo**: Visualização de evolução temporal

## 🔐 Autenticação

O sistema utiliza um **Context API** para gerenciamento de autenticação com as seguintes funcionalidades:

- Login com email e senha
- Validação de credenciais (mock)
- Redirecionamento baseado em role (Master/Técnico)
- Persistência de sessão
- Logout com limpeza de estado

## 🎨 Temas

Suporte completo a modo claro e escuro através do **next-themes**:
- Detecção automática de preferência do sistema
- Alternância manual entre temas
- Persistência da escolha do usuário
- Transições suaves entre temas

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints otimizados:
- **Mobile**: Layout em coluna única
- **Tablet**: Layout em 2 colunas
- **Desktop**: Layout em 3 colunas
- **Sidebar**: Colapsável em dispositivos móveis

## 🚧 Status do Projeto

### ✅ Implementado
- Sistema de autenticação
- Dashboard principal
- Listagem de técnicos
- Sistema de cadastro (máquinas, habilidades, técnicos)
- Dashboards analíticos
- Gestão de times e sub-times
- Sistema de avaliações
- Rankings e histórico
- Dashboard do operador
- Temas claro/escuro
- Notificações toast
- Componentes UI completos

### 🔄 Em Desenvolvimento
- Integração com back-end
- Sistema de relatórios em PDF
- Notificações push
- Sistema de anexos/documentos
- Filtros avançados

### 📝 Planejado
- Aplicativo mobile
- Sistema de gamificação
- Integração com BI tools
- API REST completa
- Sistema de chat interno

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.

## 👨‍💻 Suporte

Para suporte, entre em contato através de:
- Email: suporte@sisop.com
- Issues: GitHub Issues do projeto

## 📚 Documentação Adicional

- [DOCUMENTACAO.md](./DOCUMENTACAO.md) - Documentação detalhada do frontend
- [BACKEND.md](./BACKEND.md) - Especificação do back-end (NestJS + Prisma + PostgreSQL)

---

**Desenvolvido com ❤️ usando Next.js e React**
