# Documentação - Sistema de Desempenho de Operadores (SisOp)

## Índice
1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Páginas Master/Supervisor](#páginas-mastersupervisor)
4. [Páginas Operador](#páginas-operador)
5. [Estrutura de Dados](#estrutura-de-dados)
6. [Guia de Uso](#guia-de-uso)

---

## Visão Geral

O **SisOp** (Sistema de Desempenho de Operadores) é uma plataforma profissional para gerenciamento de performance de operadores em ambiente industrial/telecom. O sistema oferece dois níveis de acesso:

- **Master/Supervisor**: Acesso completo para gerenciar técnicos, máquinas, habilidades e visualizar análises
- **Operador**: Acesso restrito para visualizar seu próprio desempenho

**Cores Principais**: Azul Marinho (#0A3D62) e Branco
**Tecnologia**: Next.js 16, React 19, Tailwind CSS v4, Recharts

---

## Autenticação

### Página: `/login`

**Descrição**: Página de autenticação do sistema.

**Componentes**:
- Logo "SisOp" em um quadrado azul marinho
- Formulário de login com email e senha
- Dois botões de demo para acesso rápido

**Contas de Demonstração**:
```
Master:
  Email: master@example.com
  Senha: password
  Acesso: Todas as funcionalidades

Operador:
  Email: operador@example.com
  Senha: password
  Acesso: Apenas visualização de desempenho pessoal
```

**Fluxo**:
1. Usuário insere email e senha
2. Sistema valida credenciais
3. Se Master → redireciona para `/dashboard`
4. Se Operador → redireciona para `/meu-desempenho`

**Funcionalidades**:
- Validação de campos obrigatórios
- Mensagem de erro em caso de credenciais inválidas
- Botões de demo para teste rápido
- Estado de carregamento durante autenticação

---

## Páginas Master/Supervisor

### 1. Dashboard (`/dashboard`)

**Objetivo**: Visão geral do desempenho dos operadores.

**Acesso**: Apenas Master/Supervisor

**Seções**:

#### Cards de Estatísticas (Topo)
- **Operadores Ativos**: Número de operadores em status "ativo" vs. total
- **Pontuação Média**: Média geral de habilidades de todos os operadores
- **Máquinas**: Total de máquinas disponíveis no sistema (8)

#### Gráficos
1. **Pontuação por Operador** (Gráfico de Barras)
   - Eixo X: Nome do operador (primeiro nome)
   - Eixo Y: Pontuação média (0-100)
   - Cor: Azul marinho

2. **Evolução de Desempenho** (Gráfico de Linhas)
   - Eixo X: Meses (Jan-Jun)
   - Eixo Y: Pontuação média
   - Mostra tendência de melhoria

#### Lista de Operadores
- Exibe todos os operadores com:
  - Nome completo
  - Workday (ID do operador)
  - Máquina atribuída
  - Turno
  - Pontuação em badge azul
  - Status (Ativo/Inativo)

---

### 2. Técnicos (`/tecnicos`)

**Objetivo**: Gerenciar e visualizar lista de todos os operadores técnicos.

**Acesso**: Apenas Master/Supervisor

**Funcionalidades**:

#### Barra de Pesquisa
- Busca em tempo real por nome ou workday
- Ícone de lupa na esquerda
- Filtra resultados instantaneamente

#### Grid de Operadores
- Exibe cards em layout responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- Cada card mostra:
  - Nome e workday
  - Status (badge verde para Ativo, cinza para Inativo)
  - Máquina e Turno
  - 4 primeiras habilidades com pontuações
  - Última avaliação (data e pontos)

#### Interações
- Cards têm efeito hover (borda azul)
- Clicáveis (estrutura pronta para detalhe futuro)

---

### 3. Cadastro (`/cadastro`)

**Objetivo**: Gerenciar máquinas, habilidades e registrar novos técnicos.

**Acesso**: Apenas Master/Supervisor

**Abas**:

#### Aba 1: Máquinas
**Campos**:
- Nome da Máquina (texto)
- Código (texto)

**Ações**:
- Botão "Adicionar Máquina" para registrar nova máquina
- Lista de máquinas cadastradas em grid

**Máquinas Pré-cadastradas**:
- LASER, PRINTER, SPINX, TAO, CNC, GRAVER, 3D, SCANNER

#### Aba 2: Habilidades
**Campos**:
- Nome da Habilidade (texto)
- Categoria (texto)

**Ações**:
- Botão "Adicionar Habilidade" para registrar nova habilidade
- Lista de habilidades cadastradas

**Habilidades Pré-cadastradas**:
- Atendimento, Técnica, Conhecimento, Atitude, Produtividade, Qualidade, Liderança, Comunicação

#### Aba 3: Novo Técnico
**Campos**:
- Nome (texto)
- Workday (texto) - ID único do operador
- Máquina (dropdown com máquinas cadastradas)
- Turno (dropdown: 1º Turno, 2º Turno, 3º Turno)

**Ações**:
- Botão "Cadastrar Técnico" para registrar novo operador
- Valida campos obrigatórios antes de enviar

---

### 4. Dashboards Analíticos (`/dashboards`)

**Objetivo**: Análises avançadas e detalhadas de desempenho.

**Acesso**: Apenas Master/Supervisor

**Gráficos**:

#### 1. Desempenho por Turno (Radar Charts)
- 3 gráficos radar lado a lado (1º, 2º, 3º turno)
- Mostra 4 dimensões: Atendimento, Técnica, Conhecimento, Atitude
- Escala 0-100
- Preenchimento com 60% de opacidade para visualização clara

#### 2. Perfil Detalhado do Operador (Radar Grande)
- Mostra o primeiro operador da lista em detalhado
- 6 dimensões: Atendimento, Técnica, Conhecimento, Atitude, Produtividade, Qualidade
- Eixos com rótulos e escala 0-100

#### 3. Desempenho por Máquina (Gráfico de Barras)
- Máquinas no eixo X: LASER, PRINTER, SPINX, TAO
- Pontuação no eixo Y (0-100)
- Barras azul marinho com cantos arredondados

---

### 5. Usuários (`/usuarios`)

**Objetivo**: Controlar acessos e gerenciar usuários do sistema.

**Acesso**: Apenas Master/Supervisor

**Funcionalidades**:

#### Adicionar Novo Usuário
**Campos**:
- Email (campo email)
- Nome (texto)
- Função (dropdown: Operador, Master)

**Ações**:
- Botão "Adicionar Usuário" (azul marinho)
- Valida email antes de adicionar

#### Lista de Usuários
- Exibe todos os usuários do sistema
- Cada linha mostra:
  - Nome do usuário
  - Email
  - Badge de função (azul para Master, cinza para Operador)
  - Botão "Editar" para modificar usuário

**Usuários Pré-cadastrados**:
- Master User (master@example.com) - Master
- Demo Operador (operador@example.com) - Operador
- 2 operadores adicionais

---

### 6. Avaliações Trimestrais (`/avaliacoes`)

**Objetivo**: Realizar avaliações formais dos operadores a cada 3 meses.

**Acesso**: Apenas Master/Supervisor

**Recurso Principal - Controle de Frequência (3 meses)**:
- Sistema valida automaticamente se um operador pode ser avaliado
- Cada operador só pode ser avaliado a cada 3 meses
- Se não puder ser avaliado, mostra data da próxima avaliação
- Impede avaliações duplicadas dentro do período de 3 meses

**Seções**:

#### 1. Seletor de Trimestre
- **Dropdown Trimestre**: Permite selecionar entre 1º-4º trimestres
- **Dropdown Ano**: Permite selecionar ano atual ou anterior
- Utilizados para contexto da avaliação

#### 2. Seleção de Operador
- Grid responsivo mostrando todos os operadores ativos
- Cada card mostra:
  - Nome completo
  - Workday (ID)
  - Máquina atribuída
  - Turno
  - Status de disponibilidade para avaliação
  - Data da próxima avaliação (se não disponível)
- Cards selecionáveis com visual feedback (borda azul para selecionado)
- Operadores indisponíveis ficam desabilitados (opacidade reduzida)

#### 3. Formulário de Avaliação
**Componentes**:

**Avaliação de Skills** (Range Sliders)
- 6 sliders para as 6 habilidades principais
- Cada slider tem:
  - Nome da habilidade
  - Categoria (ex: "Soft Skills")
  - Range de 0-100
  - Valor em tempo real exibido
- Slider com cor azul marinho (accent)

**Observações e Feedback**
- Campo de textarea para observações livres
- Espaço para anotar pontos fortes e áreas de melhoria
- Placeholder: "Adicione feedback, pontos fortes e áreas de melhoria..."

**Preview de Pontuação**
- Card azul mostrando a média automática das skills avaliadas
- Texto destacado em azul marinho
- Atualiza em tempo real conforme os sliders mudam

#### 4. Ações
- **Botão "Confirmar Avaliação"** (azul marinho)
  - Valida que todas as skills foram preenchidas
  - Confirma submissão da avaliação
  - Mostra mensagem de sucesso com operador e nota média
  - Limpa o formulário

- **Botão "Cancelar"** (cinza)
  - Volta ao estado inicial
  - Limpa formulário e deseleciona operador

**Fluxo de Uso**:
1. Master acessa `/avaliacoes`
2. Seleciona trimestre e ano (opcional)
3. Escolhe um operador na grid
4. Preenche scores das 6 habilidades usando sliders
5. Adiciona observações/feedback
6. Clica "Confirmar Avaliação"
7. Sistema valida e registra (em produção: salva no DB)
8. Operador fica indisponível para nova avaliação por 3 meses

**Validações**:
- Operador pode ser avaliado apenas a cada 3 meses
- Todas as skills devem ter um valor (0-100)
- Email de feedback é obrigatório para auditoria

---

## Páginas Operador

### 1. Meu Desempenho (`/meu-desempenho`)

**Objetivo**: Visualizar performance pessoal e evolução.

**Acesso**: Apenas Operador logado

**Seções**:

#### Informações Pessoais (Card)
- Nome completo
- Workday
- Máquina atribuída
- Turno

#### Estatísticas (3 Cards)
1. **Última Avaliação**: Pontuação da avaliação mais recente
2. **Status**: Status atual (Ativo/Inativo)
3. **Avaliações**: Número total de trimestres avaliados

#### Gráficos (Layout 2 colunas)

1. **Evolução de Pontuação** (Gráfico de Linhas)
   - Eixo X: Trimestres (Q1, Q2, Q3, etc.)
   - Eixo Y: Pontuação (0-100)
   - Linha azul marinho com pontos
   - Mostra tendência pessoal

2. **Perfil de Habilidades** (Radar Chart)
   - 6 dimensões de habilidades
   - Preenchimento azul marinho com 60% opacidade
   - Visualiza pontos fortes e fracos

#### Detalhamento de Habilidades
- Grid com 2 colunas (1 em mobile)
- Cada habilidade mostra:
  - Nome
  - Percentual em badge azul
  - Barra de progresso com cor azul marinho

#### Histórico de Avaliações
- Lista completa de avaliações por trimestre
- Cada avaliação mostra:
  - Trimestre e ano
  - Data de avaliação formatada (DD/MM/AAAA)
  - Pontuação em badge
  - Notas/comentários do avaliador

---

### 2. Histórico (`/historico`)

**Objetivo**: Visualizar histórico completo de avaliações.

**Acesso**: Apenas Operador logado

**Seções**:

#### Avaliações Trimestrais
- Cada avaliação em card separado com:
  - Título: "Avaliação Q[número] - [ano]"
  - Data formatada em português (ex: "15 de janeiro de 2024")
  - Badge com pontuação
  - Notas/feedback completo do trimestre
- Background cinza claro para distinção
- Borda azul marinho suave

#### Informações da Conta
- **Data de Admissão**: Data formatada quando operador entrou
- **Status**: Badge verde se Ativo, cinza se Inativo

---

## Estrutura de Dados

### Operador (Mock Data)
```javascript
{
  id: string,
  name: string,           // Nome completo
  workday: string,        // ID único (ex: OP001)
  machine: string,        // Máquina atribuída (LASER, PRINTER, etc)
  shift: number,          // Turno (1, 2 ou 3)
  status: 'ativo' | 'inativo',
  joinDate: string,       // Data de admissão
  skills: {
    '1': number,          // Atendimento (0-100)
    '2': number,          // Técnica
    '3': number,          // Conhecimento
    '4': number,          // Atitude
    '5': number,          // Produtividade
    '6': number,          // Qualidade
  },
  quarterlyNotes: [
    {
      quarter: number,    // 1-4
      year: number,
      score: number,      // 0-100
      evaluatedDate: string,
      notes: string       // Feedback/comentários
    }
  ]
}
```

### Máquina
```javascript
{
  id: string,
  name: string,           // LASER, PRINTER, etc
  code: string
}
```

### Habilidade
```javascript
{
  id: string,
  name: string,           // Atendimento, Técnica, etc
  category: string        // Soft Skills, Technical, etc
}
```

### Usuário
```javascript
{
  id: string,
  email: string,
  name: string,
  role: 'master' | 'operador'
}
```

---

## Guia de Uso

### Para Master/Supervisor

1. **Acessar o Sistema**
   - Ir para `/login`
   - Usar: `master@example.com` / `password`
   - Ou clicar no botão "Master"

2. **Dashboard**
   - Ver overview de operadores e desempenho
   - Analisa tendências gerais

3. **Gerenciar Técnicos**
   - Ir para `/tecnicos`
   - Pesquisar operadores por nome ou workday
   - Visualizar skills e última avaliação

4. **Cadastrar Dados**
   - Ir para `/cadastro`
   - Adicionar novas máquinas na aba "Máquinas"
   - Adicionar novas habilidades na aba "Habilidades"
   - Registrar novo operador na aba "Novo Técnico"

5. **Análises Avançadas**
   - Ir para `/dashboards`
   - Visualizar desempenho por turno
   - Analisar performance por máquina
   - Revisar perfil detalhado de operadores

6. **Realizar Avaliações**
   - Ir para `/avaliacoes`
   - Selecionar trimestre e ano (opcional)
   - Escolher um operador disponível na grid
   - Avaliar cada habilidade com o slider (0-100)
   - Adicionar feedback e observações
   - Clicar "Confirmar Avaliação"
   - Sistema valida frequência (a cada 3 meses)
   - Operador recebe avaliação em seu histórico

7. **Gerenciar Acessos**
   - Ir para `/usuarios`
   - Adicionar novos usuários do sistema
   - Atribuir função (Master ou Operador)
   - Editar usuários existentes

### Para Operador

1. **Acessar o Sistema**
   - Ir para `/login`
   - Usar: `operador@example.com` / `password`
   - Ou clicar no botão "Operador"

2. **Visualizar Desempenho**
   - Vai automaticamente para `/meu-desempenho`
   - Ver informações pessoais
   - Acompanhar evolução de pontuação
   - Analisar perfil de habilidades
   - Revisar notas detalhadas por habilidade

3. **Histórico Completo**
   - Ir para `/historico`
   - Visualizar todas as avaliações trimestrais
   - Ver feedback do supervisor
   - Consultar data de admissão

---

## Navegação

### Barra Lateral (Sidebar)
- **Logo**: SisOp (clicável para home)
- **Menu Dinâmico**: Muda conforme role do usuário

**Para Master**:
- Dashboard
- Técnicos
- Cadastro
- Dashboards
- Avaliações
- Usuários
- Logout

**Para Operador**:
- Meu Desempenho
- Histórico
- Logout

### Cores da Sidebar
- Fundo: Azul marinho (#0A3D62)
- Texto: Branco
- Items hover: Fundo ligeiramente mais claro

---

## Design e Responsividade

### Breakpoints
- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (lg)
- **Desktop**: > 1024px

### Layout Principal
- Sidebar fixa à esquerda
- Conteúdo principal com padding
- Cards com bordas azul marinho suaves
- Espaçamento consistente (6px a 24px)

### Paleta de Cores
- **Primário**: #0A3D62 (Azul Marinho)
- **Secundário**: #F5F5F5 (Cinza Claro)
- **Fundo**: #FFFFFF (Branco)
- **Texto**: #1F2937 (Cinza Escuro)
- **Muted**: #6B7280 (Cinza Médio)

---

## Funcionalidades Futuras

- Integração com banco de dados real
- Notificações em tempo real
- Exportar relatórios em PDF
- Gráficos comparativos entre períodos
- Sistema de metas e objetivos
- Feedback 360º entre operadores
- Certificações e treinamentos
