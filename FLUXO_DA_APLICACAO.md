# Fluxo da Aplicação SkillFix

## Visão Geral
O SkillFix é um sistema hierárquico de gerenciamento de técnicos, times e avaliações de habilidades, com estrutura bem definida de cadastros e relacionamentos.

---

## Hierarquia de Usuários

### 1. Administrador (Desenvolvedor)
- **Papel**: Admin total do sistema
- **Responsabilidade**: Cadastrar TODOS os supervisores no sistema
- **Acesso**: Acesso completo a todas as funcionalidades

### 2. Supervisores
- **Papel**: Gerentes de times e coordenadores
- **Acesso**: 
  - Podem ver seu próprio cadastro em `/tecnicos` buscando pelo Workday
  - Acesso total ao fluxo de cadastro e gerenciamento
- **Responsabilidades**: Executar todo o fluxo de cadastro descrito abaixo

### 3. Coordenadores
- **Papel**: Líderes de subtimes
- **Relacionamento**: Vinculados a subtimes específicos
- **Cadastro**: Feito pelos supervisores

### 4. Técnicos
- **Papel**: Colaboradores operacionais
- **Relacionamento**: Alocados em subtimes
- **Acesso**: SEM acesso ao sistema (apenas dados gerenciados pelos supervisores)

---

## Fluxo de Cadastro (Ordem Obrigatória)

O supervisor deve seguir esta sequência EXATA de cadastros:

### **PASSO 1: Cadastrar Coordenadores**
- Local: `/cadastro`
- Ação: Criar todos os coordenadores que vão liderar os subtimes
- Dados necessários:
  - Nome completo
  - Email
  - Workday
  - Área de atuação
  - Senioridade: "Coordenador"

### **PASSO 2: Cadastrar Times Principais**
- Local: `/times`
- Ação: Criar times principais vinculados ao supervisor
- Relacionamento: **Time → Supervisor**
- Exemplos de times:
  - Spare & Parts
  - Backend (BE)
  - Frontend (FE)
  - Produção
  - Manutenção

### **PASSO 3: Criar Subtimes**
- Local: `/times` (dentro de cada time)
- Ação: Criar subtimes e relacionar aos coordenadores
- Relacionamento: **Subtime → Coordenador → Time → Supervisor**
- Estrutura hierárquica:
  ```
  Supervisor
    └── Time Principal
          └── Subtime 1 (Coordenador A)
          └── Subtime 2 (Coordenador B)
          └── Subtime 3 (Coordenador C)
  ```

### **PASSO 4: Cadastrar Técnicos**
- Local: `/cadastro` (aba Técnicos)
- Ação: Cadastrar todos os técnicos com suas funções
- Alocar: Distribuir técnicos nos subtimes apropriados
- Dados necessários:
  - Nome, Workday, Cargo
  - Senioridade (Auxiliar, Junior, Pleno, Sênior, Especialista)
  - Área, Turno
  - **Subtime ao qual pertence**

### **PASSO 5: Cadastrar Máquinas**
- Local: `/cadastro` (aba Máquinas)
- Ação: Registrar todas as máquinas/equipamentos
- **IMPORTANTE**: Cada subtime tem suas próprias máquinas
- Relacionamento: **Máquina → Subtime**
- Exemplos:
  - LASER, PRINTER, SPI, NXT, AOI, FORNO, ROUTER, ANDA

### **PASSO 6: Cadastrar Habilidades**
- Local: `/cadastro` (aba Habilidades/Skills)
- Ação: Definir habilidades específicas por máquina e subtime
- **REGRA CRÍTICA**: Cada subtime tem habilidades DIFERENTES
- Relacionamento: **Habilidade → Máquina → Subtime**

---

## Regras Importantes de Negócio

### 1. Isolamento de Avaliações por Subtime
- ✅ Cada subtime é avaliado de forma independente
- ✅ As habilidades do Spare & Parts ≠ Habilidades do Backend
- ✅ As habilidades do Frontend ≠ Habilidades da Produção
- ❌ Um time NÃO pode usar métricas/avaliações de outro time

### 2. Hierarquia Fixa
```
Admin (Desenvolvedor)
  └── Supervisores (cadastrados pelo admin)
        └── Times Principais (criados pelo supervisor)
              └── Subtimes (criados pelo supervisor)
                    ├── Coordenador (1 por subtime)
                    ├── Técnicos (vários por subtime)
                    ├── Máquinas (específicas do subtime)
                    └── Habilidades (específicas do subtime)
```

### 3. Vinculações Obrigatórias
- **Subtime** → Deve ter 1 Coordenador
- **Subtime** → Deve ter N Técnicos
- **Subtime** → Deve ter suas próprias Máquinas
- **Subtime** → Deve ter suas próprias Habilidades
- **Máquina** → Pertence a um Subtime específico
- **Habilidade** → Vinculada a uma Máquina de um Subtime específico

### 4. Avaliações
- Cada técnico é avaliado nas habilidades do SEU subtime
- Não é possível comparar diretamente técnicos de subtimes diferentes
- Rankings e dashboards devem considerar o contexto do subtime

---

## Impacto na Estrutura Atual

### ✅ O que já temos implementado:
- Cadastro de usuários (supervisores)
- Listagem de técnicos
- Filtros por senioridade
- Sistema de autenticação
- Estrutura básica de times

### ⚠️ O que precisa ser ajustado/implementado:
1. **Estrutura de Times**:
   - Adicionar hierarquia: Time → Subtime
   - Vincular Subtime → Coordenador

2. **Cadastro de Máquinas**:
   - Criar interface de cadastro
   - Vincular Máquina → Subtime

3. **Cadastro de Habilidades**:
   - Criar interface de cadastro
   - Vincular Habilidade → Máquina → Subtime

4. **Página de Cadastro**:
   - Reorganizar com abas: Coordenadores, Times, Técnicos, Máquinas, Habilidades
   - Implementar o fluxo sequencial

5. **Avaliações**:
   - Sistema de avaliação por subtime
   - Dashboards específicos por contexto

6. **Validações**:
   - Garantir que subtimes só vejam suas próprias máquinas
   - Garantir que avaliações não cruzem entre subtimes

---

## Exemplos Práticos

### Cenário 1: Time de Spare & Parts
```
Time: Spare & Parts (Supervisor: João)
  └── Subtime: Logística (Coordenador: Maria)
        ├── Técnicos: 5 técnicos
        ├── Máquinas: Empilhadeira, Scanner, Sistema WMS
        └── Habilidades: 
            - Empilhadeira: Operação, Manutenção básica, Picking
            - Scanner: Configuração, Leitura de códigos
            - Sistema WMS: Entrada de dados, Consultas, Relatórios
```

### Cenário 2: Time de Backend
```
Time: Backend (Supervisor: Carlos)
  └── Subtime: APIs (Coordenador: Ana)
        ├── Técnicos: 8 desenvolvedores
        ├── Máquinas: Servidores, Banco de dados, Ferramentas CI/CD
        └── Habilidades:
            - Servidores: Node.js, Python, Docker, Kubernetes
            - Banco de dados: SQL, NoSQL, Otimização
            - CI/CD: Jenkins, GitLab, Deploy automation
```

**Importante**: As habilidades do Spare & Parts não fazem sentido para o Backend, e vice-versa!

---

## Conclusão

O sistema é hierárquico e segmentado por contexto. Cada subtime opera como uma "ilha" com suas próprias máquinas, habilidades e formas de avaliação. Isso garante que técnicos sejam avaliados de forma justa dentro do seu contexto de trabalho específico.
