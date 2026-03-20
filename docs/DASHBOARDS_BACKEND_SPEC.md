# 📊 Especificação Backend - Tela de Dashboards Analíticos

**Data:** 19/03/2026  
**Status:** ⚠️ Parcialmente Implementado  
**Prioridade:** 🔴 ALTA

---

## 📋 Visão Geral

A tela de **Dashboards Analíticos** (`/dashboards`) exibe visualizações avançadas de desempenho da engenharia, incluindo:

1. **Radar de comparação de skills por turno** - Comparar performance de cada skill entre os diferentes turnos
2. **Radar de comparação de máquinas por turno** - Identificar qual turno tem melhor desempenho em cada máquina
3. **Rankings por senioridade** - Top 5 performers de cada nível (Auxiliar, Junior, Pleno, Sênior, Especialista)

---

## 🎯 Endpoints Necessários

### 1. ✅ Endpoint Existente (Funcionando)

#### `GET /api/v1/analytics/top-performers`

**Status:** ✅ Implementado  
**Uso Atual:** Ranking geral (sem filtro de senioridade)

**Query Params:**
- `limit` (number) - Quantidade de resultados (default: 10)
- `quarter` (number) - Trimestre (1-4)
- `year` (number) - Ano

**Response Atual:**
```json
[
  {
    "rank": 1,
    "name": "João Silva",
    "score": 95.5,
    "area": "Manutenção",
    "team": "uuid-do-time"
  }
]
```

**⚠️ Limitação:** Não possui filtro por senioridade

---

### 2. 🆕 Endpoint Novo - Comparação de Skills por Turno

#### `GET /api/v1/analytics/skills-by-shift`

**Prioridade:** 🔴 ALTA  
**Objetivo:** Comparar o desempenho médio de cada skill entre os diferentes turnos

**Query Params:**
```typescript
teamId?: string      // Filtrar por time específico
quarter?: number     // Trimestre (1-4)
year?: number        // Ano
```

**Response Esperado:**
```json
[
  {
    "skillId": "uuid-da-skill",
    "skillName": "LASER",
    "skillCategory": "EQUIPAMENTO",
    "shifts": {
      "1T": 85.5,      // Score médio do 1º turno nessa skill
      "2T": 88.2,      // Score médio do 2º turno nessa skill
      "3T": 82.0,      // Score médio do 3º turno nessa skill
      "ADM": 90.0      // Score médio do turno administrativo nessa skill
    },
    "overallAverage": 86.4,  // Média geral da skill
    "totalTecnicos": 45      // Quantidade de técnicos que possuem essa skill
  },
  {
    "skillId": "uuid-da-skill-2",
    "skillName": "PRINTER",
    "skillCategory": "EQUIPAMENTO",
    "shifts": {
      "1T": 78.0,
      "2T": 82.5,
      "3T": 75.8,
      "ADM": 85.0
    },
    "overallAverage": 80.3,
    "totalTecnicos": 38
  }
]
```

**Lógica de Cálculo:**

```sql
-- Pseudocódigo SQL
SELECT 
  s.id as skillId,
  s.name as skillName,
  s.category as skillCategory,
  AVG(CASE WHEN t.shift = '1T' THEN ts.score ELSE NULL END) as shift_1T,
  AVG(CASE WHEN t.shift = '2T' THEN ts.score ELSE NULL END) as shift_2T,
  AVG(CASE WHEN t.shift = '3T' THEN ts.score ELSE NULL END) as shift_3T,
  AVG(CASE WHEN t.shift = 'ADM' THEN ts.score ELSE NULL END) as shift_ADM,
  AVG(ts.score) as overallAverage,
  COUNT(DISTINCT t.id) as totalTecnicos
FROM skills s
INNER JOIN tecnico_skills ts ON ts.skillId = s.id
INNER JOIN tecnicos t ON t.id = ts.tecnicoId
WHERE t.status = true
GROUP BY s.id, s.name, s.category
ORDER BY s.name;
```

**Regras de Negócio:**
- Considerar apenas técnicos ativos (`status = true`)
- Calcular média dos scores de `TecnicoSkill`
- Agrupar por turno do técnico (`tecnico.shift`)
- Se um turno não tiver nenhum técnico com aquela skill, retornar `null` ou `0`

**TypeScript Interface (Frontend):**
```typescript
interface ShiftSkillComparison {
  skillId: string
  skillName: string
  skillCategory: string
  shifts: {
    '1T': number
    '2T': number
    '3T': number
    'ADM': number
  }
  overallAverage: number
  totalTecnicos: number
}
```

---

### 3. 🆕 Endpoint Novo - Comparação de Máquinas por Turno

#### `GET /api/v1/analytics/machines-by-shift`

**Prioridade:** 🔴 ALTA  
**Objetivo:** Identificar qual turno tem melhor desempenho em cada máquina

**Query Params:**
```typescript
teamId?: string      // Filtrar por time específico
quarter?: number     // Trimestre (1-4)
year?: number        // Ano
```

**Response Esperado:**
```json
[
  {
    "machineId": "uuid-da-maquina",
    "machineCode": "MAQ-001",
    "machineName": "LASER XYZ Modelo A",
    "shifts": {
      "1T": 82.0,      // Score médio do 1º turno nessa máquina
      "2T": 85.5,      // Score médio do 2º turno nessa máquina
      "3T": 78.0,      // Score médio do 3º turno nessa máquina
      "ADM": 88.0      // Score médio do turno administrativo nessa máquina
    },
    "overallAverage": 83.4,    // Média geral da máquina
    "totalSkills": 5,          // Quantidade de skills relacionadas à máquina
    "totalTecnicos": 20,       // Quantidade de técnicos que trabalham com essa máquina
    "bestShift": "ADM"         // Turno com melhor performance
  },
  {
    "machineId": "uuid-da-maquina-2",
    "machineCode": "MAQ-002",
    "machineName": "PRINTER ABC Modelo B",
    "shifts": {
      "1T": 75.0,
      "2T": 80.0,
      "3T": 72.5,
      "ADM": 83.0
    },
    "overallAverage": 77.6,
    "totalSkills": 3,
    "totalTecnicos": 15,
    "bestShift": "ADM"
  }
]
```

**Lógica de Cálculo:**

```sql
-- Pseudocódigo SQL
SELECT 
  m.id as machineId,
  m.code as machineCode,
  m.name as machineName,
  AVG(CASE WHEN t.shift = '1T' THEN ts.score ELSE NULL END) as shift_1T,
  AVG(CASE WHEN t.shift = '2T' THEN ts.score ELSE NULL END) as shift_2T,
  AVG(CASE WHEN t.shift = '3T' THEN ts.score ELSE NULL END) as shift_3T,
  AVG(CASE WHEN t.shift = 'ADM' THEN ts.score ELSE NULL END) as shift_ADM,
  AVG(ts.score) as overallAverage,
  COUNT(DISTINCT s.id) as totalSkills,
  COUNT(DISTINCT t.id) as totalTecnicos
FROM machines m
INNER JOIN skills s ON s.machineId = m.id
INNER JOIN tecnico_skills ts ON ts.skillId = s.id
INNER JOIN tecnicos t ON t.id = ts.tecnicoId
WHERE t.status = true
GROUP BY m.id, m.code, m.name
ORDER BY m.code;
```

**Regras de Negócio:**
- Para cada máquina, buscar todas as skills relacionadas (`skill.machineId`)
- Para cada skill da máquina, calcular média dos scores dos técnicos
- Agrupar por turno do técnico
- Identificar o turno com maior score médio (`bestShift`)

**TypeScript Interface (Frontend):**
```typescript
interface ShiftMachineComparison {
  machineId: string
  machineCode: string
  machineName: string
  shifts: {
    '1T': number
    '2T': number
    '3T': number
    'ADM': number
  }
  overallAverage: number
  totalSkills: number
  totalTecnicos: number
  bestShift: '1T' | '2T' | '3T' | 'ADM'
}
```

---

### 4. 🔧 Atualização - Filtro por Senioridade

#### `GET /api/v1/analytics/top-performers` (ATUALIZAR)

**Prioridade:** 🟡 MÉDIA  
**Objetivo:** Adicionar filtro por senioridade ao endpoint existente

**Query Params NOVOS:**
```typescript
senioridade?: 'AUXILIAR' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA'
```

**Exemplo de Chamadas:**
```bash
# Ranking geral (atual)
GET /api/v1/analytics/top-performers?limit=15&quarter=1&year=2026

# Ranking de Auxiliares (novo)
GET /api/v1/analytics/top-performers?limit=5&quarter=1&year=2026&senioridade=AUXILIAR

# Ranking de Juniores (novo)
GET /api/v1/analytics/top-performers?limit=5&quarter=1&year=2026&senioridade=JUNIOR

# Ranking de Plenos (novo)
GET /api/v1/analytics/top-performers?limit=5&quarter=1&year=2026&senioridade=PLENO

# Ranking de Sêniores (novo)
GET /api/v1/analytics/top-performers?limit=5&quarter=1&year=2026&senioridade=SENIOR

# Ranking de Especialistas (novo)
GET /api/v1/analytics/top-performers?limit=5&quarter=1&year=2026&senioridade=ESPECIALISTA
```

**Response (mantém estrutura atual):**
```json
[
  {
    "rank": 1,
    "name": "João Silva",
    "score": 95.5,
    "area": "Manutenção",
    "team": "uuid-do-time",
    "senioridade": "JUNIOR"  // ✨ Pode adicionar esse campo (opcional)
  }
]
```

**Lógica de Cálculo Atualizada:**

```sql
-- Pseudocódigo SQL (método getTopPerformers atualizado)
SELECT 
  qn.score,
  t.name,
  t.area,
  t.teamId as team,
  t.senioridade
FROM quarterly_notes qn
INNER JOIN tecnicos t ON t.id = qn.tecnicoId
WHERE qn.year = :year 
  AND qn.quarter = :quarter
  AND t.status = true
  AND (:senioridade IS NULL OR t.senioridade = :senioridade)  -- ✨ NOVO FILTRO
ORDER BY qn.score DESC
LIMIT :limit;
```

---

## 📊 Estrutura de Dados do Banco

### Tabelas Envolvidas

```typescript
// Técnico
Tecnico {
  id: string
  name: string
  shift: '1T' | '2T' | '3T' | 'ADM'           // ✅ Campo shift existe
  senioridade: 'AUXILIAR' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA'  // ✅ Existe
  area: string
  teamId: string
  status: boolean
}

// Skill do Técnico (scores)
TecnicoSkill {
  id: string
  tecnicoId: string
  skillId: string
  score: number                                // ✅ Score da skill (0-100)
  nivel: 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO'
}

// Skill
Skill {
  id: string
  name: string
  category: string
  machineId: string                            // ✅ Relacionamento com máquina
}

// Máquina
Machine {
  id: string
  code: string                                 // "MAQ-001", "MAQ-002"
  name: string                                 // "LASER XYZ", "PRINTER ABC"
  teamId: string
}

// Avaliação Trimestral
QuarterlyNote {
  id: string
  tecnicoId: string
  score: number                                // ✅ Score do técnico no trimestre
  quarter: number                              // 1, 2, 3, 4
  year: number
  evaluatedDate: string
}
```

**✅ TODAS as tabelas e campos necessários JÁ EXISTEM!**  
Apenas faltam os endpoints para agregar e retornar os dados.

---

## 🚀 Plano de Implementação (Backend)

### Fase 1: Skills por Turno (ALTA PRIORIDADE)

**Arquivo:** `src/modules/analytics/analytics.controller.ts`

```typescript
@Get('skills-by-shift')
@ApiOperation({ summary: 'Comparação de skills por turno' })
@ApiQuery({ name: 'teamId', required: false })
@ApiQuery({ name: 'quarter', required: false, type: Number })
@ApiQuery({ name: 'year', required: false, type: Number })
getSkillsByShift(
  @Query('teamId') teamId?: string,
  @Query('quarter') quarter?: number,
  @Query('year') year?: number,
) {
  return this.analyticsService.getSkillsByShift(teamId, quarter, year);
}
```

**Arquivo:** `src/modules/analytics/analytics.service.ts`

```typescript
async getSkillsByShift(teamId?: string, quarter?: number, year?: number) {
  const query = this.tecnicoSkillsRepository
    .createQueryBuilder('ts')
    .leftJoinAndSelect('ts.skill', 'skill')
    .leftJoinAndSelect('ts.tecnico', 'tecnico')
    .where('tecnico.status = :status', { status: true });

  if (teamId) {
    query.andWhere('tecnico.teamId = :teamId', { teamId });
  }

  const tecnicoSkills = await query.getMany();

  // Agrupar por skill e calcular médias por turno
  const skillsMap = new Map();

  tecnicoSkills.forEach((ts) => {
    const skillKey = ts.skill.id;
    if (!skillsMap.has(skillKey)) {
      skillsMap.set(skillKey, {
        skillId: ts.skill.id,
        skillName: ts.skill.name,
        skillCategory: ts.skill.category,
        shifts: { '1T': [], '2T': [], '3T': [], 'ADM': [] },
        totalTecnicos: new Set(),
      });
    }

    const skillData = skillsMap.get(skillKey);
    const shift = ts.tecnico.shift;
    
    if (skillData.shifts[shift]) {
      skillData.shifts[shift].push(ts.score);
    }
    skillData.totalTecnicos.add(ts.tecnico.id);
  });

  // Calcular médias
  const result = Array.from(skillsMap.values()).map((skill) => ({
    skillId: skill.skillId,
    skillName: skill.skillName,
    skillCategory: skill.skillCategory,
    shifts: {
      '1T': this.calculateAverage(skill.shifts['1T']),
      '2T': this.calculateAverage(skill.shifts['2T']),
      '3T': this.calculateAverage(skill.shifts['3T']),
      'ADM': this.calculateAverage(skill.shifts['ADM']),
    },
    overallAverage: this.calculateOverallAverage(skill.shifts),
    totalTecnicos: skill.totalTecnicos.size,
  }));

  return result;
}

private calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

private calculateOverallAverage(shifts: any): number {
  const allScores = [...shifts['1T'], ...shifts['2T'], ...shifts['3T'], ...shifts['ADM']];
  return this.calculateAverage(allScores);
}
```

**Arquivo:** `src/modules/analytics/dto/shift-skill-comparison.dto.ts`

```typescript
export class ShiftSkillComparisonDto {
  skillId: string;
  skillName: string;
  skillCategory: string;
  shifts: {
    '1T': number;
    '2T': number;
    '3T': number;
    'ADM': number;
  };
  overallAverage: number;
  totalTecnicos: number;
}
```

---

### Fase 2: Máquinas por Turno (ALTA PRIORIDADE)

**Arquivo:** `src/modules/analytics/analytics.controller.ts`

```typescript
@Get('machines-by-shift')
@ApiOperation({ summary: 'Comparação de máquinas por turno' })
@ApiQuery({ name: 'teamId', required: false })
@ApiQuery({ name: 'quarter', required: false, type: Number })
@ApiQuery({ name: 'year', required: false, type: Number })
getMachinesByShift(
  @Query('teamId') teamId?: string,
  @Query('quarter') quarter?: number,
  @Query('year') year?: number,
) {
  return this.analyticsService.getMachinesByShift(teamId, quarter, year);
}
```

**Arquivo:** `src/modules/analytics/analytics.service.ts`

```typescript
async getMachinesByShift(teamId?: string, quarter?: number, year?: number) {
  const query = this.machinesRepository
    .createQueryBuilder('m')
    .leftJoinAndSelect('m.skills', 'skill')
    .leftJoinAndSelect('skill.tecnicoSkills', 'ts')
    .leftJoinAndSelect('ts.tecnico', 'tecnico')
    .where('tecnico.status = :status', { status: true });

  if (teamId) {
    query.andWhere('m.teamId = :teamId', { teamId });
  }

  const machines = await query.getMany();

  const result = machines.map((machine) => {
    const shifts = { '1T': [], '2T': [], '3T': [], 'ADM': [] };
    const tecnicosSet = new Set();
    const skillsCount = machine.skills.length;

    machine.skills.forEach((skill) => {
      skill.tecnicoSkills?.forEach((ts) => {
        const shift = ts.tecnico.shift;
        if (shifts[shift]) {
          shifts[shift].push(ts.score);
        }
        tecnicosSet.add(ts.tecnico.id);
      });
    });

    const shiftAverages = {
      '1T': this.calculateAverage(shifts['1T']),
      '2T': this.calculateAverage(shifts['2T']),
      '3T': this.calculateAverage(shifts['3T']),
      'ADM': this.calculateAverage(shifts['ADM']),
    };

    const bestShift = Object.entries(shiftAverages).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0];

    return {
      machineId: machine.id,
      machineCode: machine.code,
      machineName: machine.name,
      shifts: shiftAverages,
      overallAverage: this.calculateOverallAverage(shifts),
      totalSkills: skillsCount,
      totalTecnicos: tecnicosSet.size,
      bestShift,
    };
  });

  return result;
}
```

**Arquivo:** `src/modules/analytics/dto/shift-machine-comparison.dto.ts`

```typescript
export class ShiftMachineComparisonDto {
  machineId: string;
  machineCode: string;
  machineName: string;
  shifts: {
    '1T': number;
    '2T': number;
    '3T': number;
    'ADM': number;
  };
  overallAverage: number;
  totalSkills: number;
  totalTecnicos: number;
  bestShift: '1T' | '2T' | '3T' | 'ADM';
}
```

---

### Fase 3: Filtro por Senioridade (MÉDIA PRIORIDADE)

**Arquivo:** `src/modules/analytics/analytics.controller.ts`

```typescript
@Get('top-performers')
@ApiOperation({ summary: 'Top performers do período' })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'quarter', required: false, type: Number })
@ApiQuery({ name: 'year', required: false, type: Number })
@ApiQuery({ 
  name: 'senioridade', 
  required: false, 
  enum: ['AUXILIAR', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA'] 
})  // ✨ NOVO PARÂMETRO
getTopPerformers(
  @Query('limit') limit: number = 10,
  @Query('quarter') quarter?: number,
  @Query('year') year?: number,
  @Query('senioridade') senioridade?: string,  // ✨ NOVO
) {
  return this.analyticsService.getTopPerformers(limit, quarter, year, senioridade);
}
```

**Arquivo:** `src/modules/analytics/analytics.service.ts`

```typescript
async getTopPerformers(
  limit: number = 10,
  quarter?: number,
  year?: number,
  senioridade?: string,  // ✨ NOVO PARÂMETRO
) {
  const currentYear = year || new Date().getFullYear();
  const currentQuarter = quarter || Math.ceil((new Date().getMonth() + 1) / 3);

  const query = this.quarterlyNotesRepository
    .createQueryBuilder('qn')
    .leftJoinAndSelect('qn.tecnico', 'tecnico')
    .where('qn.year = :year AND qn.quarter = :quarter', {
      year: currentYear,
      quarter: currentQuarter,
    })
    .andWhere('tecnico.status = :status', { status: true });

  // ✨ ADICIONAR FILTRO DE SENIORIDADE
  if (senioridade) {
    query.andWhere('tecnico.senioridade = :senioridade', { senioridade });
  }

  const topPerformers = await query
    .orderBy('qn.score', 'DESC')
    .take(limit)
    .getMany();

  return topPerformers.map((note, index) => ({
    rank: index + 1,
    name: note.tecnico.name,
    score: note.score,
    area: note.tecnico.area,
    team: note.tecnico.teamId,
    senioridade: note.tecnico.senioridade,  // ✨ Opcional: incluir no response
  }));
}
```

---

## ✅ Checklist de Implementação

### Backend (NestJS)

- [ ] **Fase 1: Skills por Turno** (ALTA PRIORIDADE)
  - [ ] Criar `ShiftSkillComparisonDto`
  - [ ] Implementar método `getSkillsByShift()` no service
  - [ ] Adicionar endpoint `GET /analytics/skills-by-shift` no controller
  - [ ] Testar com Postman/Insomnia
  - [ ] Documentar no Swagger
  - [ ] Validar performance da query

- [ ] **Fase 2: Máquinas por Turno** (ALTA PRIORIDADE)
  - [ ] Criar `ShiftMachineComparisonDto`
  - [ ] Implementar método `getMachinesByShift()` no service
  - [ ] Adicionar endpoint `GET /analytics/machines-by-shift` no controller
  - [ ] Testar com Postman/Insomnia
  - [ ] Documentar no Swagger
  - [ ] Validar performance da query

- [ ] **Fase 3: Filtro por Senioridade** (MÉDIA PRIORIDADE)
  - [ ] Atualizar método `getTopPerformers()` para aceitar parâmetro `senioridade`
  - [ ] Atualizar controller e adicionar `@ApiQuery` para senioridade
  - [ ] Testar filtros por cada senioridade (5 testes)
  - [ ] Validar enum de senioridade no DTO
  - [ ] Atualizar documentação Swagger

### Frontend (Next.js) - Pós-implementação Backend

- [ ] Criar interface `ShiftSkillComparison` em `core/types/api.types.ts`
- [ ] Criar interface `ShiftMachineComparison` em `core/types/api.types.ts`
- [ ] Adicionar método `getSkillsByShift()` no `analyticsService`
- [ ] Adicionar método `getMachinesByShift()` no `analyticsService`
- [ ] Implementar Radar Chart de Skills por Turno
- [ ] Implementar Radar Chart de Máquinas por Turno
- [ ] Implementar 5 rankings separados por senioridade
- [ ] Remover mensagens de "Funcionalidade em Desenvolvimento"
- [ ] Testar integração completa
- [ ] Validar responsividade dos charts

---

## 📊 Exemplos de Uso (Frontend)

### Como os dados serão consumidos no frontend:

```typescript
// app/dashboards/page.tsx

// Estados
const [skillsData, setSkillsData] = useState<ShiftSkillComparison[]>([])
const [machinesData, setMachinesData] = useState<ShiftMachineComparison[]>([])
const [rankingAuxiliares, setRankingAuxiliares] = useState<TopPerformer[]>([])
const [rankingJuniores, setRankingJuniores] = useState<TopPerformer[]>([])
// ... outros rankings

// Fetch de dados
async function fetchDashboardData() {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  // Buscar skills por turno
  const skills = await analyticsService.getSkillsByShift(undefined, currentQuarter, currentYear)
  setSkillsData(skills)

  // Buscar máquinas por turno
  const machines = await analyticsService.getMachinesByShift(undefined, currentQuarter, currentYear)
  setMachinesData(machines)

  // Buscar rankings por senioridade
  const auxiliares = await analyticsService.getTopPerformers(5, currentQuarter, currentYear, 'AUXILIAR')
  setRankingAuxiliares(auxiliares)

  const juniores = await analyticsService.getTopPerformers(5, currentQuarter, currentYear, 'JUNIOR')
  setRankingJuniores(juniores)

  // ... outros rankings
}

// Transformar dados para o Radar Chart
const radarData = skillsData.map(skill => ({
  skill: skill.skillName,
  '1º Turno': skill.shifts['1T'],
  '2º Turno': skill.shifts['2T'],
  '3º Turno': skill.shifts['3T'],
  'Comercial': skill.shifts['ADM']
}))
```

---

## 🎨 Interface Visual (Referência)

### Radar de Skills por Turno
- Eixos radiais: Nome das skills (LASER, PRINTER, SPINX, etc.)
- Linhas: Uma para cada turno (cores diferentes)
- Valores: Score médio (0-100)

### Radar de Máquinas por Turno
- Eixos radiais: Código das máquinas (MAQ-001, MAQ-002, etc.)
- Linhas: Uma para cada turno (cores diferentes)
- Valores: Score médio (0-100)

### Rankings por Senioridade
- 5 cards separados (Auxiliar, Junior, Pleno, Sênior, Especialista)
- Cada card com Top 5
- Badges com posição (1º, 2º, 3º)
- Score destacado

---

## 📞 Contato e Dúvidas

**Desenvolvedor Frontend:** [Seu Nome]  
**Repositório Frontend:** `ruthgomes/skill-frontend`  
**Documentação Completa de Gaps:** `docs/DASHBOARD_BACKEND_GAPS.md`

---

## 📝 Notas Finais

1. **Performance:** As queries devem ser otimizadas para não sobrecarregar o banco quando houver muitos técnicos
2. **Cache:** Considerar implementar cache para dados que mudam apenas trimestralmente
3. **Filtros:** Os filtros de `teamId`, `quarter` e `year` são opcionais mas recomendados
4. **Validação:** Validar ranges de `quarter` (1-4) e `year` (> 2020) nos DTOs
5. **Empty States:** Se não houver dados, retornar array vazio `[]`, não erro 500

---

**Status da Documentação:** ✅ Completa  
**Última Atualização:** 19/03/2026  
**Aguardando:** Implementação Backend
