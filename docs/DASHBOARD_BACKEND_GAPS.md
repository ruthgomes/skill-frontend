# 🔍 GAPS DE BACKEND - Dashboard Analítico

## 📋 Data: 19/03/2026

---

## 🎯 Problema Identificado

Durante a integração da página de **Dashboards Analíticos** (`app/dashboards/page.tsx`), foram identificados **dados mockados** que **NÃO possuem endpoints correspondentes** no backend atual.

---

## 📊 Dados Mockados vs Endpoints Disponíveis

### ✅ Disponível no Backend

| Dado | Endpoint | Método | Status |
|------|----------|--------|--------|
| Ranking Top Performers Geral | `/api/v1/analytics/top-performers` | `getTopPerformers(limit, quarter, year)` | ✅ Disponível |
| Matriz de Skills | `/api/v1/analytics/skills-matrix` | `getSkillsMatrix(teamId, subtimeId)` | ✅ Disponível |
| Cobertura de Skills | `/api/v1/analytics/skills-coverage` | `getSkillsCoverage(teamId)` | ✅ Disponível |
| Comparação entre Times | `/api/v1/analytics/team-comparison` | `getTeamComparison(metric)` | ✅ Disponível |

### ❌ NÃO Disponível no Backend

| Dado Mockado | Objetivo | Status | Prioridade |
|--------------|----------|--------|------------|
| **shiftRadarData** | Comparação de **desempenho de skills por turno** (1T, 2T, 3T, Comercial, Especial) | ❌ Não existe | 🔴 ALTA |
| **machineShiftRadarData** | Comparação de **desempenho de máquinas por turno** (qual turno é melhor em cada máquina) | ❌ Não existe | 🔴 ALTA |
| **Rankings por Senioridade** | Top 5 por nível: Auxiliar, Junior, Pleno, Sênior, Especialista | ❌ Não existe filtro por senioridade | 🟡 MÉDIA |

---

## 🔧 Endpoints Necessários

### 1. Comparação de Skills por Turno

**Endpoint:** `GET /api/v1/analytics/skills-by-shift`

**Query Params:**
- `teamId?` (string) - Filtrar por time específico
- `quarter?` (number) - Trimestre (1-4)
- `year?` (number) - Ano

**Response:**
```typescript
interface ShiftSkillComparison {
  skill: string          // Nome da skill (ex: "LASER", "PRINTER")
  shifts: {
    "1T": number        // Score médio do 1º turno (0-100)
    "2T": number        // Score médio do 2º turno
    "3T": number        // Score médio do 3º turno
    "ADM": number       // Score médio do turno administrativo
    "ESPECIAL": number  // Score médio do turno especial (se aplicável)
  }
}

// Array de comparações por skill
ShiftSkillComparison[]
```

**Exemplo de Retorno:**
```json
[
  {
    "skill": "LASER",
    "shifts": {
      "1T": 85.5,
      "2T": 88.2,
      "3T": 82.0,
      "ADM": 90.0,
      "ESPECIAL": 87.5
    }
  },
  {
    "skill": "PRINTER",
    "shifts": {
      "1T": 78.0,
      "2T": 82.5,
      "3T": 75.8,
      "ADM": 85.0,
      "ESPECIAL": 80.0
    }
  }
]
```

**Lógica de Cálculo:**
1. Para cada skill cadastrada no sistema
2. Buscar todos os técnicos que possuem essa skill (`TecnicoSkill`)
3. Agrupar por turno (`tecnico.shift`)
4. Calcular a média de `score` da skill para cada turno
5. Retornar array com comparação por skill

---

### 2. Comparação de Máquinas por Turno

**Endpoint:** `GET /api/v1/analytics/machines-by-shift`

**Query Params:**
- `teamId?` (string) - Filtrar por time específico
- `quarter?` (number) - Trimestre (1-4)
- `year?` (number) - Ano

**Response:**
```typescript
interface ShiftMachineComparison {
  machine: string        // Nome da máquina (ex: "MAQ-001", "MAQ-002")
  machineName: string    // Nome legível (ex: "LASER XYZ", "PRINTER ABC")
  shifts: {
    "1T": number        // Score médio do 1º turno (0-100)
    "2T": number        // Score médio do 2º turno
    "3T": number        // Score médio do 3º turno
    "ADM": number       // Score médio do turno administrativo
    "ESPECIAL": number  // Score médio do turno especial (se aplicável)
  }
}

// Array de comparações por máquina
ShiftMachineComparison[]
```

**Exemplo de Retorno:**
```json
[
  {
    "machine": "MAQ-001",
    "machineName": "LASER XYZ",
    "shifts": {
      "1T": 82.0,
      "2T": 85.5,
      "3T": 78.0,
      "ADM": 88.0,
      "ESPECIAL": 84.0
    }
  },
  {
    "machine": "MAQ-002",
    "machineName": "PRINTER ABC",
    "shifts": {
      "1T": 75.0,
      "2T": 80.0,
      "3T": 72.5,
      "ADM": 83.0,
      "ESPECIAL": 79.0
    }
  }
]
```

**Lógica de Cálculo:**
1. Para cada máquina cadastrada no sistema (`Machine`)
2. Buscar todas as skills relacionadas àquela máquina (`Skill` where `machineId = machine.id`)
3. Para cada skill da máquina, buscar os técnicos que a possuem (`TecnicoSkill`)
4. Agrupar técnicos por turno (`tecnico.shift`)
5. Calcular a média de scores das skills da máquina para cada turno
6. Retornar array com comparação por máquina

---

### 3. Ranking por Senioridade (Enhancement)

**Endpoint:** `GET /api/v1/analytics/top-performers` *(ATUALIZAR EXISTENTE)*

**Query Params Atuais:**
- `limit` (number) - Limite de resultados (padrão: 10)
- `quarter?` (number) - Trimestre
- `year?` (number) - Ano

**Novos Query Params:**
- ✨ **`senioridade?`** (string) - Filtrar por senioridade: `'AUXILIAR' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA'`

**Exemplo de Chamada:**
```typescript
// Ranking geral (atual)
GET /api/v1/analytics/top-performers?limit=10

// Ranking de Auxiliares (novo)
GET /api/v1/analytics/top-performers?limit=5&senioridade=AUXILIAR

// Ranking de Juniores (novo)
GET /api/v1/analytics/top-performers?limit=5&senioridade=JUNIOR
```

**Lógica de Cálculo:**
1. Consulta existente em `QuarterlyNote` + join com `Tecnico`
2. **Adicionar filtro:** `WHERE tecnico.senioridade = :senioridade` (se fornecido)
3. Ordenar por `score DESC` e limitar por `limit`
4. Retornar array de top performers filtrados

---

## 📝 Estruturas de Dados Necessárias

### Relações no Banco de Dados

```typescript
// Já existem:
Tecnico {
  id: string
  name: string
  shift: '1T' | '2T' | '3T' | 'ADM' | 'ESPECIAL'  // ✅ Campo shift existe
  senioridade: 'AUXILIAR' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA'  // ✅ Campo senioridade existe
  tecnicoSkills: TecnicoSkill[]
}

TecnicoSkill {
  id: string
  tecnicoId: string
  skillId: string
  score: number  // ✅ Score da skill (0-100)
  skill: Skill
  tecnico: Tecnico
}

Skill {
  id: string
  name: string
  machineId: string  // ✅ Relacionamento com máquina existe
  machine: Machine
}

Machine {
  id: string
  code: string  // "MAQ-001", "MAQ-002"
  name: string  // "LASER XYZ", "PRINTER ABC"
  skills: Skill[]
}

QuarterlyNote {
  id: string
  tecnicoId: string
  score: number  // ✅ Score do técnico no trimestre
  quarter: number
  year: number
  tecnico: Tecnico
}
```

**✅ Tudo que é necessário JÁ EXISTE no banco!** Apenas faltam os **endpoints para agregar e retornar** os dados.

---

## 🚀 Plano de Implementação (Backend)

### Fase 1: Skills por Turno (ALTA PRIORIDADE)

1. **Criar DTO:**
   ```typescript
   // src/modules/analytics/dto/shift-skill-comparison.dto.ts
   export class ShiftSkillComparisonDto {
     skill: string;
     shifts: {
       '1T': number;
       '2T': number;
'3T': number;
       'ADM': number;
       'ESPECIAL'?: number;
     };
   }
   ```

2. **Criar método no Service:**
   ```typescript
   // src/modules/analytics/analytics.service.ts
   async getSkillsByShift(teamId?: string, quarter?: number, year?: number): Promise<ShiftSkillComparisonDto[]> {
     // 1. Buscar todas as skills
     // 2. Para cada skill, buscar TecnicoSkill e agrupar por tecnico.shift
     // 3. Calcular média de score por shift
     // 4. Retornar array de comparações
   }
   ```

3. **Criar endpoint no Controller:**
   ```typescript
   @Get('skills-by-shift')
   @ApiOperation({ summary: 'Comparação de skills por turno' })
   getSkillsByShift(
     @Query('teamId') teamId?: string,
     @Query('quarter') quarter?: number,
     @Query('year') year?: number,
   ) {
     return this.analyticsService.getSkillsByShift(teamId, quarter, year);
   }
   ```

### Fase 2: Máquinas por Turno (ALTA PRIORIDADE)

1. **Criar DTO:**
   ```typescript
   // src/modules/analytics/dto/shift-machine-comparison.dto.ts
   export class ShiftMachineComparisonDto {
     machine: string;
     machineName: string;
     shifts: {
       '1T': number;
       '2T': number;
       '3T': number;
       'ADM': number;
       'ESPECIAL'?: number;
     };
   }
   ```

2. **Criar método no Service:**
   ```typescript
   async getMachinesByShift(teamId?: string, quarter?: number, year?: number): Promise<ShiftMachineComparisonDto[]> {
     // 1. Buscar todas as máquinas
     // 2. Para cada máquina, buscar as skills relacionadas
     // 3. Para cada skill, buscar TecnicoSkill e agrupar por tecnico.shift
     // 4. Calcular média de scores por shift para aquela máquina
     // 5. Retornar array de comparações
   }
   ```

3. **Criar endpoint no Controller.**

### Fase 3: Filtro por Senioridade (MÉDIA PRIORIDADE)

1. **Atualizar método existente:**
   ```typescript
   async getTopPerformers(
     limit: number = 10,
     quarter?: number,
     year?: number,
     senioridade?: string,  // ✨ NOVO PARÂMETRO
   ): Promise<TopPerformer[]> {
     const query = this.quarterlyNotesRepository
       .createQueryBuilder('qn')
       .leftJoinAndSelect('qn.tecnico', 'tecnico')
       .where('qn.year = :year AND qn.quarter = :quarter', { year, quarter });
     
     // ✨ ADICIONAR FILTRO
     if (senioridade) {
       query.andWhere('tecnico.senioridade = :senioridade', { senioridade });
     }
     
     return query.orderBy('qn.score', 'DESC').take(limit).getMany();
   }
   ```

2. **Atualizar Controller:**
   ```typescript
   @Get('top-performers')
   @ApiQuery({ name: 'senioridade', required: false, enum: ['AUXILIAR', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA'] })
   getTopPerformers(
     @Query('limit') limit: number = 10,
     @Query('quarter') quarter?: number,
     @Query('year') year?: number,
     @Query('senioridade') senioridade?: string,  // ✨ NOVO
   ) {
     return this.analyticsService.getTopPerformers(limit, quarter, year, senioridade);
   }
   ```

---

## 🎨 Adaptação do Frontend (Solução Temporária)

Enquanto os endpoints não são criados, o frontend pode:

### Opção 1: Mensagem Informativa
```tsx
<Card>
  <CardHeader>
    <CardTitle>Radar por Turno (Máquinas e Skills)</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-center h-[400px] text-muted-foreground">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">⚠️ Funcionalidade em Desenvolvimento</p>
        <p className="text-sm">
          A comparação de desempenho por turno será implementada em breve.
        </p>
        <p className="text-xs">
          Endpoint necessário: <code>GET /api/v1/analytics/skills-by-shift</code>
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Opção 2: Usar Ranking Geral (sem divisão por senioridade)
```tsx
// Substituir os 5 rankings por senioridade por 1 ranking geral top 20
const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([])

useEffect(() => {
  fetchTopPerformers()
}, [])

async function fetchTopPerformers() {
  try {
    const data = await analyticsService.getTopPerformers(20)
    setTopPerformers(data)
  } catch (error) {
    console.error('❌ Erro ao buscar top performers:', error)
  }
}

// Renderizar um único ranking com top 20
```

### Opção 3: Combinar Dados Disponíveis
- Usar `getSkillsCoverage()` para mostrar coverage de skills geral
- Usar `getTeamComparison()` para comparar times
- Usar `getTopPerformers()` para ranking geral

---

## ✅ Checklist de Implementação

### Backend (NestJS)

- [ ] **Fase 1: Skills por Turno**
  - [ ] Criar DTO `ShiftSkillComparisonDto`
  - [ ] Implementar `getSkillsByShift()` no service
  - [ ] Adicionar endpoint `GET /analytics/skills-by-shift` no controller
  - [ ] Testar com Postman/Insomnia
  - [ ] Documentar no Swagger

- [ ] **Fase 2: Máquinas por Turno**
  - [ ] Criar DTO `ShiftMachineComparisonDto`
  - [ ] Implementar `getMachinesByShift()` no service
  - [ ] Adicionar endpoint `GET /analytics/machines-by-shift` no controller
  - [ ] Testar com Postman/Insomnia
  - [ ] Documentar no Swagger

- [ ] **Fase 3: Filtro por Senioridade**
  - [ ] Atualizar método `getTopPerformers()` para aceitar parâmetro `senioridade`
  - [ ] Atualizar controller e Swagger
  - [ ] Testar filtros por cada senioridade
  - [ ] Validar enum de senioridade no DTO

### Frontend (Next.js)

**Solução Temporária:**
- [x] Documentar gaps do backend
- [ ] Adicionar mensagens informativas nos radars pendentes
- [ ] Integrar ranking geral (não dividido por senioridade)
- [ ] Adicionar loading/error states
- [ ] Testar com backend atual

**Após Backend Implementado:**
- [ ] Atualizar `analyticsService` com novos métodos
- [ ] Criar interfaces TypeScript para novos DTOs
- [ ] Substituir mensagens informativas por chamadas reais
- [ ] Implementar radars de comparação por turno
- [ ] Implementar rankings divididos por senioridade
- [ ] Atualizar documentação em `docs/ANALYTICS_API.md`

---

## 📌 Conclusão

A página de **Dashboards Analíticos** possui visualizações avançadas que **dependem de dados não disponíveis no backend atual**. 

**Prioridades:**
1. 🔴 **ALTA:** Endpoints de comparação por turno (skills e máquinas)
2. 🟡 **MÉDIA:** Filtro de ranking por senioridade

**Próximos Passos:**
1. Criar issue no repositório do backend com este documento
2. Implementar solução temporária no frontend (mensagens informativas)
3. Aguardar implementação dos endpoints
4. Integrar quando disponível

---

**Documento criado em:** 19/03/2026  
**Status:** 🔴 Aguardando implementação no backend  
**Atualizar quando:** Endpoints estiverem disponíveis
