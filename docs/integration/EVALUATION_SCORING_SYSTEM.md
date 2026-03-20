# 📊 Sistema de Pontuação de Avaliações

## 📋 Visão Geral

Este documento explica como funciona o sistema de cálculo de pontuação das avaliações de técnicos no SkillFix, incluindo a fórmula de média ponderada e como os dados são retornados pela API.

---

## 🧮 Cálculo de Pontuação

### Escala de Notas

O sistema utiliza uma **escala de 0 a 5** para as notas individuais:
- **0** - Não atende
- **1** - Atende parcialmente
- **2** - Atende
- **3** - Supera
- **4** - Supera significativamente
- **5** - Excelente/Excepcional

### Fórmula de Média Ponderada

A pontuação final é calculada usando **média ponderada** dos critérios:

```typescript
totalScore = Σ (score × weight) / 100
```

Onde:
- `score` = Nota do critério (0-5)
- `weight` = Peso do critério em porcentagem (%)
- A soma dos pesos de todos os critérios deve ser 100%

### Exemplo Prático

#### Avaliação com 5 critérios (peso igual):

```javascript
Critérios:
1. Manutenção Preventiva Geral - Nota: 3, Peso: 20%
2. Operação de Extrusora        - Nota: 4, Peso: 20%
3. Operação de Injetora Básica  - Nota: 3, Peso: 20%
4. Setup de Molde Avançado      - Nota: 5, Peso: 20%
5. Qualidade do Trabalho        - Nota: 4, Peso: 20%

Cálculo:
totalScore = (3 × 20/100) + (4 × 20/100) + (3 × 20/100) + (5 × 20/100) + (4 × 20/100)
totalScore = 0.6 + 0.8 + 0.6 + 1.0 + 0.8
totalScore = 3.8
```

**Resultado:** `3.8 / 5.0` ou `76%` de aproveitamento

#### Avaliação com pesos diferentes:

```javascript
Critérios:
1. Produtividade    - Nota: 4, Peso: 40%  (mais importante)
2. Qualidade        - Nota: 5, Peso: 30%
3. Pontualidade     - Nota: 3, Peso: 20%
4. Relacionamento   - Nota: 4, Peso: 10%

Cálculo:
totalScore = (4 × 40/100) + (5 × 30/100) + (3 × 20/100) + (4 × 10/100)
totalScore = 1.6 + 1.5 + 0.6 + 0.4
totalScore = 4.1
```

**Resultado:** `4.1 / 5.0` ou `82%` de aproveitamento

---

## 📦 Estrutura de Dados

### Evaluation (Avaliação)

```typescript
{
  id: string;
  tecnicoId: string;
  evaluatorId: string;
  reviewerId?: string;
  type: 'quarterly' | 'annual' | 'probationary' | 'performance';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  quarter?: number;           // 1, 2, 3 ou 4
  year?: number;
  evaluationDate: Date;       // Data da avaliação
  totalScore: number;         // Pontuação calculada (0-5)
  generalComments?: string;
  strengths?: string;
  improvements?: string;
  goals?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewComments?: string;
  criteria: EvaluationCriterion[];
  createdAt: Date;
  updatedAt: Date;
}
```

### EvaluationCriterion (Critério de Avaliação)

```typescript
{
  id: string;
  evaluationId: string;
  name: string;               // Nome do critério
  description?: string;       // Descrição detalhada
  weight: number;             // Peso em % (ex: 20, 30, 50)
  score: number;              // Nota obtida (0-5)
  maxScore: number;           // Nota máxima (geralmente 5)
  comments?: string;          // Comentários sobre este critério
}
```

---

## 🔌 Endpoints da API

### GET `/api/v1/tecnicos/:id`

Retorna os dados completos do técnico, **incluindo suas avaliações ordenadas por data (mais recente primeiro)**.

#### Response:

```json
{
  "id": "uuid",
  "name": "João Silva",
  "cargo": "Técnico de Produção",
  "senioridade": "Pleno",
  // ... outros campos do técnico
  
  "evaluations": [
    {
      "id": "eval-uuid-1",
      "evaluationDate": "2026-03-15",
      "totalScore": 3.8,
      "type": "quarterly",
      "status": "approved",
      "quarter": 1,
      "year": 2026,
      "criteria": [
        {
          "name": "Manutenção Preventiva",
          "score": 4,
          "maxScore": 5,
          "weight": 20
        },
        // ... outros critérios
      ]
    },
    {
      "id": "eval-uuid-2",
      "evaluationDate": "2025-12-20",
      "totalScore": 3.5,
      "type": "quarterly",
      "status": "approved",
      "quarter": 4,
      "year": 2025
    }
    // ... avaliações anteriores
  ]
}
```

### Como Usar os Dados no Frontend

```typescript
// Última avaliação (mais recente)
const lastEvaluation = tecnico.evaluations[0];
const lastEvaluationDate = lastEvaluation?.evaluationDate;
const lastScore = lastEvaluation?.totalScore;

// Média geral de todas as avaliações
const avgScore = tecnico.evaluations.length > 0
  ? tecnico.evaluations.reduce((sum, ev) => sum + ev.totalScore, 0) / tecnico.evaluations.length
  : 0;

// Total de avaliações
const totalEvaluations = tecnico.evaluations.length;
```

#### Exibição no Frontend:

```
📅 Última Avaliação: 15/03/2026          (evaluations[0].evaluationDate)
⭐ Pontuação: 3.8/5.0 (76%)              (evaluations[0].totalScore)
📊 Média Geral: 3.65/5.0 (73%)           (média de todas as avaliações)
📝 Total de Avaliações: 5                (evaluations.length)
```

---

## 📊 GET `/api/v1/evaluations/tecnico/:tecnicoId`

Retorna **apenas as avaliações** de um técnico específico.

#### Response:

```json
[
  {
    "id": "uuid",
    "tecnicoId": "tecnico-uuid",
    "evaluationDate": "2026-03-15",
    "totalScore": 3.8,
    "type": "quarterly",
    "status": "approved",
    "quarter": 1,
    "year": 2026,
    "tecnico": {
      "id": "tecnico-uuid",
      "name": "João Silva"
    },
    "evaluator": {
      "id": "user-uuid",
      "name": "Maria Supervisora"
    },
    "criteria": [
      {
        "name": "Manutenção Preventiva",
        "score": 4,
        "maxScore": 5,
        "weight": 20,
        "comments": "Bom desempenho"
      }
      // ... outros critérios
    ]
  }
  // ... outras avaliações
]
```

---

## 🎯 Boas Práticas

### ✅ Distribuição de Pesos

```javascript
// ✅ CORRETO - Soma = 100%
[
  { name: "Produtividade", weight: 40 },
  { name: "Qualidade", weight: 30 },
  { name: "Pontualidade", weight: 20 },
  { name: "Relacionamento", weight: 10 }
]

// ❌ ERRADO - Soma ≠ 100%
[
  { name: "Produtividade", weight: 50 },
  { name: "Qualidade", weight: 50 }  // Soma = 100, mas pode gerar confusão
]
```

### ✅ Número de Critérios

- **Mínimo recomendado:** 3 critérios
- **Ideal:** 5-7 critérios
- **Máximo recomendado:** 10 critérios

### ✅ Interpretação das Notas

| Faixa | Descrição | Ação Recomendada |
|-------|-----------|------------------|
| 4.5 - 5.0 | Excepcional | Considerar promoção/reconhecimento |
| 3.5 - 4.4 | Acima da média | Manter e incentivar |
| 2.5 - 3.4 | Satisfatório | Acompanhar desenvolvimento |
| 1.5 - 2.4 | Precisa melhorar | Criar plano de ação |
| 0.0 - 1.4 | Insatisfatório | Atenção urgente necessária |

---

## 🔧 Implementação Técnica

### Código do Cálculo

```typescript
// src/modules/avaliacoes/avaliacoes.service.ts

private calculateTotalScore(criteria: EvaluationCriterion[]): number {
  if (!criteria || criteria.length === 0) return 0;

  const totalScore = criteria.reduce((sum, criterion) => {
    // Média ponderada mantendo a escala original (0-5)
    const normalized = criterion.score; // já está na escala 0-maxScore
    const weightedScore = (normalized * criterion.weight) / 100;
    return sum + weightedScore;
  }, 0);

  return Math.round(totalScore * 100) / 100;
}
```

### Criação de Avaliação

```typescript
const evaluation = await avaliacoesService.create({
  tecnicoId: "tecnico-uuid",
  evaluatorId: "user-uuid",
  type: "quarterly",
  quarter: 1,
  year: 2026,
  evaluationDate: "2026-03-15",
  criteria: [
    {
      name: "Manutenção Preventiva",
      weight: 20,
      score: 4,
      maxScore: 5,
      comments: "Bom desempenho nas tarefas"
    },
    {
      name: "Operação de Máquinas",
      weight: 30,
      score: 5,
      maxScore: 5,
      comments: "Excelente domínio técnico"
    },
    // ... outros critérios (peso total = 100%)
  ],
  generalComments: "Colaborador com ótimo desempenho geral",
  strengths: "Proatividade e conhecimento técnico",
  improvements: "Melhorar comunicação com outros turnos"
});
```

---

## 📌 Notas Importantes

1. **Escala Consistente:** O sistema sempre usa escala 0-5 para facilitar comparações
2. **Pesos Flexíveis:** Cada avaliação pode ter distribuição de pesos diferente conforme a necessidade
3. **Ordem das Avaliações:** Sempre retornadas da mais recente para a mais antiga
4. **Precisão:** Valores são arredondados com 2 casas decimais
5. **Histórico Completo:** Todas as avaliações ficam registradas para análise de evolução

---

## 🔄 Changelog

### Versão 1.0 (19/03/2026)
- ✅ Implementada média ponderada em escala 0-5
- ✅ Adicionado relacionamento `evaluations` na entidade Tecnico
- ✅ Ordenação automática por data (DESC) no GET de técnico
- ✅ Correção: totalScore agora reflete corretamente a escala 0-5

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema de avaliações, consulte:
- Documentação da API: `/api/docs` (Swagger)
- Documentação de Avaliações: `docs/AVALIACOES_API.md`
- Documentação de Integração: `docs/integration/AVALIACOES_INTEGRATION.md`
