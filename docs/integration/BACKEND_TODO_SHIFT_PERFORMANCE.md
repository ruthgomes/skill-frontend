# 🚨 AÇÃO NECESSÁRIA: Implementar Endpoint shift-performance

## ❌ Status Atual
**Endpoint**: `GET /api/v1/analytics/shift-performance`  
**Status**: **404 - Not Found**  
**Teste realizado**: 02/04/2026 às 13:00  

## ✅ Frontend Pronto
O frontend **já está 100% implementado** e aguardando apenas a implementação do backend.

---

## 📋 O que precisa ser feito no Backend

### 1️⃣ Criar DTO (Data Transfer Object)

**Arquivo**: `src/modules/analytics/dto/shift-performance.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class ShiftPerformanceQueryDto {
  @ApiProperty({ 
    required: false, 
    description: 'Ano para filtrar avaliações',
    example: 2026 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  @Max(2100)
  year?: number

  @ApiProperty({ 
    required: false, 
    description: 'Trimestre específico (1-4)',
    example: 2,
    minimum: 1,
    maximum: 4
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  quarter?: number
}

export class ShiftPerformanceResponseDto {
  @ApiProperty({ example: 'Jan', description: 'Nome do mês' })
  month: string

  @ApiProperty({ example: 1, description: 'Número do mês (1-12)' })
  monthNumber: number

  @ApiProperty({ example: 85.5, description: 'Pontuação média 1º Turno (0-100)' })
  '1T': number

  @ApiProperty({ example: 82.3, description: 'Pontuação média 2º Turno (0-100)' })
  '2T': number

  @ApiProperty({ example: 78.9, description: 'Pontuação média 3º Turno (0-100)' })
  '3T': number

  @ApiProperty({ example: 86.2, description: 'Pontuação média Turno Administrativo (0-100)' })
  'ADM': number

  @ApiProperty({ 
    example: 84.1, 
    description: 'Pontuação média Turno Especial (opcional)',
    required: false 
  })
  'Especial'?: number
}
```

---

### 2️⃣ Adicionar método no Service

**Arquivo**: `src/modules/analytics/analytics.service.ts`

```typescript
async getShiftPerformance(
  year?: number,
  quarter?: number
): Promise<ShiftPerformanceResponseDto[]> {
  const targetYear = year || new Date().getFullYear()
  
  // 1. Buscar avaliações do ano/trimestre
  const queryBuilder = this.evaluationsRepository
    .createQueryBuilder('evaluation')
    .leftJoinAndSelect('evaluation.tecnico', 'tecnico')
    .where('evaluation.year = :year', { year: targetYear })
  
  if (quarter) {
    queryBuilder.andWhere('evaluation.quarter = :quarter', { quarter })
  }
  
  const evaluations = await queryBuilder.getMany()
  
  // 2. Agrupar por mês e turno
  const monthlyData: Record<number, Record<string, { total: number, count: number }>> = {}
  
  evaluations.forEach(evaluation => {
    const month = new Date(evaluation.evaluationDate).getMonth() + 1
    const shift = evaluation.tecnico.shift
    
    if (!monthlyData[month]) {
      monthlyData[month] = {}
    }
    
    if (!monthlyData[month][shift]) {
      monthlyData[month][shift] = { total: 0, count: 0 }
    }
    
    monthlyData[month][shift].total += evaluation.totalScore
    monthlyData[month][shift].count += 1
  })
  
  // 3. Calcular médias e formatar resposta
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  const result: ShiftPerformanceResponseDto[] = []
  
  for (let month = 1; month <= 12; month++) {
    const shifts = monthlyData[month] || {}
    
    result.push({
      month: monthNames[month - 1],
      monthNumber: month,
      '1T': shifts['1T'] ? shifts['1T'].total / shifts['1T'].count : 0,
      '2T': shifts['2T'] ? shifts['2T'].total / shifts['2T'].count : 0,
      '3T': shifts['3T'] ? shifts['3T'].total / shifts['3T'].count : 0,
      'ADM': shifts['ADM'] ? shifts['ADM'].total / shifts['ADM'].count : 0,
      'Especial': shifts['Especial'] ? shifts['Especial'].total / shifts['Especial'].count : 0,
    })
  }
  
  return result
}
```

---

### 3️⃣ Adicionar endpoint no Controller

**Arquivo**: `src/modules/analytics/analytics.controller.ts`

```typescript
@Get('shift-performance')
@ApiOperation({ 
  summary: 'Desempenho por turno ao longo do tempo',
  description: 'Retorna evolução mensal da pontuação média de cada turno'
})
@ApiResponse({ 
  status: 200, 
  description: 'Dados de performance por turno',
  type: [ShiftPerformanceResponseDto]
})
async getShiftPerformance(
  @Query() query: ShiftPerformanceQueryDto
): Promise<ShiftPerformanceResponseDto[]> {
  return this.analyticsService.getShiftPerformance(query.year, query.quarter)
}
```

---

## 🧪 Como Testar

### 1. Implementar os arquivos acima

### 2. Reiniciar o servidor backend

### 3. Testar diretamente:

```bash
# Teste básico
curl http://localhost:3000/api/v1/analytics/shift-performance

# Teste com ano específico
curl http://localhost:3000/api/v1/analytics/shift-performance?year=2026

# Teste com trimestre
curl http://localhost:3000/api/v1/analytics/shift-performance?year=2026&quarter=2
```

### 4. Verificar resposta esperada:

```json
[
  {
    "month": "Jan",
    "monthNumber": 1,
    "1T": 85.5,
    "2T": 82.3,
    "3T": 78.9,
    "ADM": 86.2,
    "Especial": 84.1
  },
  // ... outros meses
]
```

---

## ✅ Quando Implementado

**O frontend detectará automaticamente!**

1. Recarregue a página `/home` no frontend
2. O badge mudará de "⏳ Endpoint backend pendente" para "✅ Dados reais do backend"
3. O gráfico usará dados reais ao invés de mockados

---

## 📚 Documentação Completa

- [Especificação Completa](./SHIFT_PERFORMANCE_API.md)
- [Integração Analytics Geral](./ANALYTICS_INTEGRATION.md)

---

## 🆘 Dúvidas ou Problemas?

Se encontrar dificuldades na implementação:
1. Verifique os exemplos no documento de especificação
2. Siga o padrão dos outros endpoints analytics já implementados
3. Certifique-se de que os campos `year` e `quarter` existem na entidade `Evaluation`
4. Verifique que a relação `tecnico` está disponível e inclui o campo `shift`

---

**Prioridade**: Média  
**Impacto**: O gráfico "Pontuação Anual por Turno" está usando dados mockados  
**Tempo estimado**: 30-60 minutos de implementação
