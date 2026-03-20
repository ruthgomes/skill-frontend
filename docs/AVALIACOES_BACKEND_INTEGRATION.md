# Avaliações - Documentação de Integração para Backend

**Data:** 19/03/2026  
**Status:** ⚠️ **ENDPOINTS NÃO IMPLEMENTADOS** - Frontend aguardando implementação

## Status Atual

✅ **Backend implementado!** A API de avaliações está funcional.

Campos ajustados no frontend para atender à API real:
- `type`: deve ser lowercase (`"quarterly"`, não `"QUARTERLY"`)
- `evaluationDate`: campo obrigatório (ISO 8601)
- Tipos aceitos: `quarterly`, `annual`, `probationary`, `performance`

## Endpoints Necessários

### 1. GET `/api/v1/evaluations/tecnico/:tecnicoId`
**Descrição:** Busca todas as avaliações de um técnico específico  
**Usado em:** Carregamento inicial da página (para verificar histórico)  
**Frequência:** Uma vez por técnico ao abrir a página  

**Response esperado:**
```json
[
  {
    "id": "uuid",
    "type": "QUARTERLY",
    "quarter": 1,
    "year": 2026,
    "tecnicoId": "uuid",
    "evaluatorId": "uuid",
    "status": "SUBMITTED",
    "totalScore": 85.5,
    "generalComments": "Bom desempenho geral",
    "criteria": [
      {
        "id": "uuid",
        "name": "Operação de Injetora Básica",
        "weight": 25,
        "score": 90,
        "maxScore": 100,
        "comments": "Excelente domínio"
      }
    ],
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-01-15T10:00:00Z"
  }
]
```

**Observações:**
- Retornar array vazio `[]` se o técnico não tiver avaliações
- Ordenar por `createdAt` DESC (mais recente primeiro)
- Incluir o array `criteria` expandido

---

### 2. POST `/api/v1/evaluations`
**Descrição:** Cria nova avaliação trimestral  
**Usado em:** Botão "Confirmar Avaliação"  
**Permissões:** Apenas SUPERVISOR e MASTER podem criar  

**Request Body:**
```json
{
  "type": "quarterly",
  "quarter": 1,
  "year": 2026,
  "evaluationDate": "2026-03-19T15:30:00.000Z",
  "tecnicoId": "uuid-do-tecnico",
  "evaluatorId": "uuid-do-avaliador",
  "criteria": [
    {
      "name": "Operação de Injetora Básica",
      "description": "Habilidade em operar injetoras",
      "weight": 25,
      "score": 90,
      "maxScore": 100,
      "comments": ""
    },
    {
      "name": "Setup de Molde Avançado",
      "weight": 25,
      "score": 75,
      "maxScore": 100,
      "comments": ""
    }
  ],
  "generalComments": "Feedback geral sobre o desempenho"
}
```

**Response esperado:**
```json
{
  "id": "novo-uuid",
  "type": "quarterly",
  "quarter": 1,
  "year": 2026,
  "evaluationDate": "2026-03-19T15:30:00.000Z",
  "tecnicoId": "uuid-do-tecnico",
  "evaluatorId": "uuid-do-avaliador",
  "status": "DRAFT",
  "totalScore": 82.5,
  "generalComments": "Feedback geral sobre o desempenho",
  "criteria": [...],
  "createdAt": "2026-03-19T15:30:00Z",
  "updatedAt": "2026-03-19T15:30:00Z"
}
```

**Validações necessárias:**
- `type`: deve ser um de: `quarterly`, `annual`, `probationary`, `performance`
- `quarter`: deve ser 1, 2, 3 ou 4
- `year`: deve ser >= 2020
- `evaluationDate`: obrigatório, formato ISO 8601 (ex: "2026-03-19T15:30:00.000Z")
- `tecnicoId`: deve ser UUID válido de técnico ativo
- `evaluatorId`: deve ser UUID válido (usuário logado)
- `criteria`: array não vazio, pelo menos 1 critério
- `weight`: soma de todos os pesos deve ser 100
- `score`: deve ser entre 0 e 100
- `maxScore`: geralmente 100

**Cálculo do totalScore:**
```typescript
totalScore = soma de (criterio.score * criterio.weight / 100)
```

**Status inicial:** Deve ser criada como `DRAFT`

---

## Workflow de Avaliação

```
1. DRAFT → Avaliação criada, pode ser editada
2. SUBMITTED → Avaliação submetida, aguardando aprovação
3. APPROVED → Avaliação aprovada por MASTER
4. REJECTED → Avaliação rejeitada por MASTER
```

**Observação:** O frontend atual cria apenas como DRAFT. Submissão e aprovação serão implementadas futuramente.

---

## Regra de Negócio: Intervalo de 3 Meses

O frontend **previne** múltiplas avaliações do mesmo técnico em menos de 3 meses:

**Lógica no frontend:**
```typescript
function canEvaluate(tecnicoId: string): boolean {
  const lastEval = getLastEvaluationDate(tecnicoId) // data da última avaliação
  if (!lastEval) return true // sem avaliações = pode avaliar
  
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  
  return lastEval <= threeMonthsAgo // pode avaliar se última foi há 3+ meses
}
```

**Recomendação:** O backend **também deve validar** essa regra para evitar burlar via API:
```typescript
// No backend, antes de criar:
const lastEvaluation = await this.evaluationsRepository.findOne({
  where: { tecnicoId },
  order: { createdAt: 'DESC' }
})

if (lastEvaluation) {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  
  if (new Date(lastEvaluation.createdAt) > threeMonthsAgo) {
    throw new BadRequestException(
      'Não é possível avaliar este técnico novamente. ' +
      'Aguarde 3 meses desde a última avaliação.'
    )
  }
}
```

---

## Conversão de Scores

O frontend usa escala **0-5** (mais intuitivo para avaliadores):
- Slider mostra: 0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0

Mas o backend espera escala **0-100**:

**Conversão no frontend:**
```typescript
score: userScore * 20  // 5.0 * 20 = 100, 2.5 * 20 = 50
```

**Exemplo:**
- Usuário avalia: 4.5 → Backend recebe: 90
- Usuário avalia: 3.0 → Backend recebe: 60
- Usuário avalia: 5.0 → Backend recebe: 100

---

## Controllers e Entities (NestJS)

### Entity: `Evaluation`
```typescript
@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: EvaluationType })
  type: EvaluationType // QUARTERLY, ANNUAL, PROBATIONARY, PERFORMANCE

  @Column({ type: 'int' })
  quarter: number // 1-4

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'uuid' })
  tecnicoId: string

  @ManyToOne(() => Tecnico)
  @JoinColumn({ name: 'tecnicoId' })
  tecnico: Tecnico

  @Column({ type: 'uuid' })
  evaluatorId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'evaluatorId' })
  evaluator: User

  @Column({ type: 'enum', enum: EvaluationStatus, default: 'DRAFT' })
  status: EvaluationStatus

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalScore: number

  @Column({ type: 'text', nullable: true })
  generalComments?: string

  @OneToMany(() => EvaluationCriterion, criterion => criterion.evaluation, { cascade: true })
  criteria: EvaluationCriterion[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

### Entity: `EvaluationCriterion`
```typescript
@Entity('evaluation_criteria')
export class EvaluationCriterion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  evaluationId: string

  @ManyToOne(() => Evaluation, evaluation => evaluation.criteria)
  @JoinColumn({ name: 'evaluationId' })
  evaluation: Evaluation

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number // percentual 0-100

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number // 0-100

  @Column({ type: 'int' })
  maxScore: number // geralmente 100

  @Column({ type: 'text', nullable: true })
  comments?: string
}
```

### Controller: `EvaluationsController`
```typescript
@Controller('evaluations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationsController {
  
  // Endpoint usado pelo frontend ao carregar página
  @Get('tecnico/:tecnicoId')
  @Roles('SUPERVISOR', 'MASTER', 'USER')
  async findByTecnico(@Param('tecnicoId') tecnicoId: string) {
    return this.evaluationsService.findByTecnico(tecnicoId)
  }

  // Endpoint usado ao criar avaliação
  @Post()
  @Roles('SUPERVISOR', 'MASTER')
  async create(@Body() createDto: CreateEvaluationDto, @CurrentUser() user: User) {
    // Validar intervalo de 3 meses
    await this.validateThreeMonthsInterval(createDto.tecnicoId)
    
    // Calcular totalScore
    const totalScore = this.calculateTotalScore(createDto.criteria)
    
    return this.evaluationsService.create({
      ...createDto,
      status: EvaluationStatus.DRAFT,
      totalScore
    })
  }
  
  private async validateThreeMonthsInterval(tecnicoId: string) {
    const lastEval = await this.evaluationsService.findLastByTecnico(tecnicoId)
    if (!lastEval) return
    
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    
    if (new Date(lastEval.createdAt) > threeMonthsAgo) {
      throw new BadRequestException(
        'Não é possível avaliar este técnico novamente antes de 3 meses desde a última avaliação.'
      )
    }
  }
  
  private calculateTotalScore(criteria: CriterionInput[]): number {
    return criteria.reduce((total, c) => total + (c.score * c.weight / 100), 0)
  }
}
```

---

## DTOs

### `CreateEvaluationDto`
```typescript
export class CreateEvaluationDto {
  @IsEnum(['quarterly', 'annual', 'probationary', 'performance'])
  type: string

  @IsInt()
  @Min(1)
  @Max(4)
  quarter: number

  @IsInt()
  @Min(2020)
  year: number

  @IsISO8601()
  @IsNotEmpty()
  evaluationDate: string

  @IsUUID()
  tecnicoId: string

  @IsUUID()
  evaluatorId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterionInput)
  criteria: CriterionInput[]

  @IsOptional()
  @IsString()
  generalComments?: string
}
```

### `CriterionInput`
```typescript
export class CriterionInput {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number

  @IsInt()
  maxScore: number

  @IsOptional()
  @IsString()
  comments?: string
}
```

---

## Checklist de Implementação

### Backend ✅ (Implementado)

- [x] Criar entity `Evaluation` 
- [x] Criar entity `EvaluationCriterion`
- [x] Criar migration para tabelas
- [x] Criar DTOs (`CreateEvaluationDto`, `CriterionInput`)
- [x] Implementar `GET /evaluations/tecnico/:tecnicoId`
- [x] Implementar `POST /evaluations`
- [x] Adicionar guards de permissão (SUPERVISOR/MASTER)
- [x] Validação de tipos aceitos: `quarterly, annual, probationary, performance`
- [x] Campo `evaluationDate` obrigatório

### Frontend ✅ (Completo e Ajustado)

- [x] Integração com `evaluationsService`
- [x] Busca de técnicos e skills
- [x] Busca de histórico de avaliações
- [x] Criação de avaliações
- [x] Conversão de scores (0-5 → 0-100)
- [x] Validação de intervalo de 3 meses
- [x] Loading e error states
- [x] Tratamento gracioso de 404 (endpoints não implementados)
- [x] **Ajuste para usar `type` em lowercase**
- [x] **Adição do campo `evaluationDate` obrigatório**
- [x] **Atualização do enum `EvaluationType`**: `quarterly, annual, probationary, performance`

---

## Testando Após Implementação

1. **Verificar se endpoints respondem:**
   ```bash
   # Listar avaliações de um técnico
   curl -X GET http://localhost:3000/api/v1/evaluations/tecnico/{tecnicoId} \
     -H "Authorization: Bearer {token}"
   
   # Criar avaliação
   curl -X POST http://localhost:3000/api/v1/evaluations \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "QUARTERLY",
       "quarter": 1,
       "year": 2026,
       "tecnicoId": "uuid",
       "evaluatorId": "uuid",
       "criteria": [...]
     }'
   ```

2. **No frontend:**
   - Abrir `/avaliacoes`
   - Verificar que lista de técnicos carrega
   - Expandir um técnico
   - Avaliar skills (mover sliders)
   - Clicar "Confirmar Avaliação"
   - Verificar toast de sucesso
   - Verificar que badge "Avaliado" aparece
   - Verificar que não pode avaliar novamente antes de 3 meses

3. **Casos de erro a testar:**
   - Tentar avaliar técnico avaliado há menos de 3 meses → deve retornar erro 400
   - Enviar quarter inválido (5) → erro 400
   - Enviar score > 100 → erro 400
   - Soma de weights ≠ 100 → erro 400 (se implementar validação)

---

## Próximos Passos (Futuro)

Após implementação básica, podemos adicionar:

1. **PATCH `/evaluations/:id`** - Editar avaliação DRAFT
2. **POST `/evaluations/:id/submit`** - Submeter para aprovação
3. **POST `/evaluations/:id/approve`** - Aprovar/rejeitar (MASTER only)
4. **GET `/evaluations`** - Listar com filtros (quarter, year, status)
5. **DELETE `/evaluations/:id`** - Deletar (MASTER only)

Mas por enquanto, **apenas GET tecnico/:id e POST /** são necessários para o frontend funcionar.

---

## Contato

Dúvidas sobre a integração: @frontend-team  
Implementação backend: @backend-team  
Documentação da API completa: `docs/AVALIACOES_API.md`
