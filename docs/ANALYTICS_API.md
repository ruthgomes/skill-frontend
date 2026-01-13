# API de Analytics e Rankings - SisOp

## Visão Geral

A API de Analytics fornece análises avançadas, dashboards, rankings e relatórios sobre desempenho de técnicos, times, máquinas e tendências do sistema.

## Endpoints da API

### Base URL
```
/api/analytics
```

### 🔒 Autenticação
Todos os endpoints requerem autenticação JWT:
```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 📊 Dashboard Principal

**GET** `/api/analytics/dashboard`

Retorna dados consolidados para o dashboard principal.

### Query Parameters:
- `period`: Período (ex: 2024-Q4, 2024-12, last-30-days)
- `teamId`: Filtrar por time específico
- `shift`: Filtrar por turno

### Response (200 OK):
```json
{
  "period": "2024-Q4",
  "summary": {
    "totalTecnicos": 50,
    "activeTecnicos": 48,
    "totalTeams": 8,
    "totalMachines": 25,
    "totalEvaluations": 200,
    "averagePerformance": 85.3
  },
  "performance": {
    "current": 85.3,
    "previous": 83.8,
    "trend": "UP",
    "improvement": 1.5
  },
  "topPerformers": [
    {
      "rank": 1,
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "name": "João Silva",
        "team": "Time Alpha"
      },
      "score": 95.5,
      "evaluations": 4
    },
    {
      "rank": 2,
      "tecnico": {
        "id": "tecnico-uuid-2",
        "workday": "OP67890",
        "name": "Maria Oliveira",
        "team": "Time Beta"
      },
      "score": 94.2,
      "evaluations": 4
    }
  ],
  "topTeams": [
    {
      "rank": 1,
      "team": {
        "id": "team-uuid-123",
        "name": "Time Alpha",
        "department": "Produção"
      },
      "averageScore": 87.5,
      "memberCount": 12
    }
  ],
  "alerts": [
    {
      "type": "LOW_PERFORMANCE",
      "severity": "MEDIUM",
      "message": "3 técnicos abaixo da média no último mês",
      "count": 3
    },
    {
      "type": "SKILL_GAP",
      "severity": "HIGH",
      "message": "5 gaps críticos de habilidades identificados",
      "count": 5
    }
  ],
  "byCategory": {
    "production": 86.5,
    "quality": 84.2,
    "safety": 90.1,
    "teamwork": 85.8
  },
  "byShift": {
    "PRIMEIRO": {
      "count": 20,
      "average": 86.2
    },
    "SEGUNDO": {
      "count": 18,
      "average": 84.5
    },
    "TERCEIRO": {
      "count": 10,
      "average": 85.1
    }
  }
}
```

---

## 🏆 Rankings

### Ranking Geral de Técnicos
**GET** `/api/analytics/rankings/tecnicos`

Query Parameters:
- `period`: Período (ex: 2024-Q4)
- `limit`: Número de resultados (padrão: 10)
- `teamId`: Filtrar por time
- `shift`: Filtrar por turno
- `area`: Filtrar por área

```json
{
  "period": "2024-Q4",
  "rankings": [
    {
      "rank": 1,
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "name": "João Silva",
        "cargo": "Operador de Máquina CNC",
        "team": "Time Alpha",
        "shift": "PRIMEIRO"
      },
      "score": 95.5,
      "scores": {
        "production": 96.0,
        "quality": 94.5,
        "safety": 97.0,
        "teamwork": 95.0
      },
      "evaluations": 4,
      "trend": "UP",
      "previousRank": 2
    }
  ],
  "total": 50,
  "statistics": {
    "averageScore": 85.3,
    "medianScore": 84.5,
    "highestScore": 95.5,
    "lowestScore": 68.2
  }
}
```

### Ranking de Times
**GET** `/api/analytics/rankings/teams`

Query Parameters:
- `period`: Período (ex: 2024-Q4)
- `limit`: Número de resultados (padrão: 10)
- `department`: Filtrar por departamento

```json
{
  "period": "2024-Q4",
  "rankings": [
    {
      "rank": 1,
      "team": {
        "id": "team-uuid-123",
        "name": "Time Alpha",
        "department": "Produção",
        "manager": "Carlos Manager"
      },
      "averageScore": 87.5,
      "memberCount": 12,
      "evaluationCount": 48,
      "trend": "UP",
      "improvement": 2.3,
      "scores": {
        "production": 88.2,
        "quality": 86.5,
        "safety": 90.2,
        "teamwork": 85.8
      }
    }
  ],
  "total": 8
}
```

### Ranking de Máquinas
**GET** `/api/analytics/rankings/machines`

Query Parameters:
- `period`: Período
- `metric`: Métrica (utilization, performance, efficiency)
- `limit`: Número de resultados

```json
{
  "period": "2024-Q4",
  "metric": "utilization",
  "rankings": [
    {
      "rank": 1,
      "machine": {
        "id": "machine-uuid-123",
        "name": "CNC-01",
        "code": "CNC001",
        "location": "Setor A"
      },
      "value": 92.5,
      "operatingHours": 2480,
      "downtime": 120,
      "operatorCount": 3,
      "operatorAverage": 88.5
    }
  ]
}
```

---

## 📈 Trends e Tendências

### Tendências de Performance
**GET** `/api/analytics/trends/performance`

Query Parameters:
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `groupBy`: Agrupar por (day, week, month, quarter)
- `tecnicoId`: Técnico específico (opcional)
- `teamId`: Time específico (opcional)

```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "groupBy": "month",
  "data": [
    {
      "period": "2024-01",
      "averageScore": 82.5,
      "evaluationCount": 42,
      "technicoCount": 45
    },
    {
      "period": "2024-02",
      "averageScore": 83.2,
      "evaluationCount": 44,
      "technicoCount": 46
    }
  ],
  "trend": "UP",
  "overallImprovement": 3.5,
  "statistics": {
    "highest": {
      "period": "2024-12",
      "score": 86.8
    },
    "lowest": {
      "period": "2024-03",
      "score": 81.5
    }
  }
}
```

### Tendências por Categoria
**GET** `/api/analytics/trends/categories`

```json
{
  "period": "2024",
  "categories": {
    "production": {
      "data": [
        { "period": "Q1", "score": 84.5 },
        { "period": "Q2", "score": 85.2 },
        { "period": "Q3", "score": 86.1 },
        { "period": "Q4", "score": 86.5 }
      ],
      "trend": "UP",
      "improvement": 2.0
    },
    "quality": {
      "data": [...],
      "trend": "STABLE",
      "improvement": 0.5
    },
    "safety": {
      "data": [...],
      "trend": "UP",
      "improvement": 4.2
    },
    "teamwork": {
      "data": [...],
      "trend": "UP",
      "improvement": 1.8
    }
  }
}
```

---

## 📊 Comparações

### Comparar Técnicos
**GET** `/api/analytics/compare/tecnicos`

Query Parameters:
- `tecnicoIds`: IDs dos técnicos separados por vírgula
- `period`: Período para comparação

```json
{
  "period": "2024-Q4",
  "comparison": [
    {
      "tecnico": {
        "id": "tecnico-uuid-1",
        "workday": "OP12345",
        "name": "João Silva"
      },
      "overallScore": 95.5,
      "scores": {
        "production": 96.0,
        "quality": 94.5,
        "safety": 97.0,
        "teamwork": 95.0
      },
      "rank": 1,
      "skillAverage": 90.5
    },
    {
      "tecnico": {
        "id": "tecnico-uuid-2",
        "workday": "OP67890",
        "name": "Maria Oliveira"
      },
      "overallScore": 88.3,
      "scores": {
        "production": 89.0,
        "quality": 87.5,
        "safety": 90.0,
        "teamwork": 86.5
      },
      "rank": 5,
      "skillAverage": 85.2
    }
  ],
  "insights": [
    "João Silva lidera em todas as categorias",
    "Maior diferença em Produção (7.0 pontos)"
  ]
}
```

### Comparar Times
**GET** `/api/analytics/compare/teams`

Query Parameters:
- `teamIds`: IDs dos times separados por vírgula
- `period`: Período

```json
{
  "period": "2024-Q4",
  "comparison": [
    {
      "team": {
        "id": "team-uuid-123",
        "name": "Time Alpha"
      },
      "averageScore": 87.5,
      "memberCount": 12,
      "scores": {
        "production": 88.2,
        "quality": 86.5,
        "safety": 90.2,
        "teamwork": 85.8
      },
      "rank": 1
    },
    {
      "team": {
        "id": "team-uuid-456",
        "name": "Time Beta"
      },
      "averageScore": 84.8,
      "memberCount": 10,
      "scores": {
        "production": 85.5,
        "quality": 84.0,
        "safety": 87.5,
        "teamwork": 82.1
      },
      "rank": 3
    }
  ]
}
```

---

## 📉 Análise de Performance

### Performance Individual
**GET** `/api/analytics/performance/tecnico/:id`

Query Parameters:
- `startDate`: Data inicial
- `endDate`: Data final
- `includeSkills`: Incluir análise de habilidades (true/false)

```json
{
  "tecnicoId": "tecnico-uuid-1",
  "tecnico": {
    "workday": "OP12345",
    "name": "João Silva",
    "cargo": "Operador de Máquina CNC",
    "team": "Time Alpha"
  },
  "period": {
    "start": "2024-10-01",
    "end": "2024-12-31"
  },
  "overall": {
    "averageScore": 88.5,
    "evaluationCount": 4,
    "trend": "UP",
    "improvement": 3.2
  },
  "byCategory": {
    "production": {
      "current": 90.0,
      "previous": 87.5,
      "trend": "UP"
    },
    "quality": {
      "current": 85.0,
      "previous": 84.0,
      "trend": "UP"
    },
    "safety": {
      "current": 92.0,
      "previous": 91.0,
      "trend": "UP"
    },
    "teamwork": {
      "current": 87.0,
      "previous": 85.5,
      "trend": "UP"
    }
  },
  "evaluationHistory": [
    {
      "period": "2024-10",
      "score": 86.0,
      "evaluatedAt": "2024-10-15"
    },
    {
      "period": "2024-11",
      "score": 87.5,
      "evaluatedAt": "2024-11-15"
    },
    {
      "period": "2024-12",
      "score": 88.5,
      "evaluatedAt": "2024-12-15"
    }
  ],
  "skills": {
    "total": 8,
    "averageScore": 86.5,
    "certified": 6,
    "gaps": 2
  },
  "ranking": {
    "overall": 3,
    "inTeam": 1,
    "inShift": 2
  },
  "insights": [
    "Performance consistente em crescimento",
    "Destaque em Segurança",
    "Oportunidade de melhoria em Qualidade"
  ],
  "recommendations": [
    "Considerar para promoção",
    "Indicado para mentoria de novos operadores",
    "Treinamento adicional em controle de qualidade"
  ]
}
```

### Performance por Time
**GET** `/api/analytics/performance/team/:id`

```json
{
  "teamId": "team-uuid-123",
  "team": {
    "name": "Time Alpha",
    "department": "Produção",
    "manager": "Carlos Manager"
  },
  "period": "2024-Q4",
  "overall": {
    "averageScore": 87.5,
    "memberCount": 12,
    "evaluationCount": 48,
    "trend": "UP",
    "improvement": 2.3
  },
  "memberPerformance": [
    {
      "tecnico": {
        "workday": "OP12345",
        "name": "João Silva"
      },
      "score": 95.5,
      "rank": 1,
      "trend": "UP"
    }
  ],
  "distribution": {
    "excellent": 3,
    "good": 6,
    "average": 2,
    "belowAverage": 1
  },
  "byCategory": {
    "production": 88.2,
    "quality": 86.5,
    "safety": 90.2,
    "teamwork": 85.8
  },
  "insights": [
    "Time com melhor performance do departamento",
    "Equilíbrio entre todos os turnos",
    "Excelente índice de segurança"
  ]
}
```

---

## 📊 Relatórios

### Relatório Consolidado
**GET** `/api/analytics/reports/consolidated`

Query Parameters:
- `period`: Período (ex: 2024-Q4, 2024, 2024-12)
- `format`: Formato de resposta (json, pdf, excel)
- `includeCharts`: Incluir dados para gráficos (true/false)

```json
{
  "reportId": "report-uuid-123",
  "generatedAt": "2024-12-16T10:00:00.000Z",
  "period": "2024-Q4",
  "summary": {
    "totalTecnicos": 50,
    "totalTeams": 8,
    "totalMachines": 25,
    "totalEvaluations": 200,
    "averagePerformance": 85.3
  },
  "sections": {
    "performance": {
      "overall": 85.3,
      "byCategory": {...},
      "trend": "UP",
      "improvement": 1.5
    },
    "rankings": {
      "topTecnicos": [...],
      "topTeams": [...]
    },
    "skills": {
      "totalSkills": 45,
      "averageScore": 82.5,
      "criticalGaps": 5
    },
    "machines": {
      "utilizationRate": 87.5,
      "downtime": 12.5,
      "maintenanceCost": 45000.00
    }
  },
  "insights": [
    "Performance geral em crescimento (+1.5%)",
    "Time Alpha lidera com 87.5 pontos",
    "5 gaps críticos identificados"
  ],
  "recommendations": [
    "Expandir programa de capacitação",
    "Focar em treinamentos de qualidade",
    "Otimizar distribuição de turnos"
  ]
}
```

### Exportar Relatório
**POST** `/api/analytics/reports/export`

Request Body:
```json
{
  "type": "consolidated",
  "period": "2024-Q4",
  "format": "pdf",
  "includeCharts": true,
  "filters": {
    "teamIds": ["team-uuid-123"],
    "departments": ["Produção"]
  }
}
```

Response:
```json
{
  "exportId": "export-uuid-123",
  "status": "PROCESSING",
  "estimatedTime": 30,
  "downloadUrl": null
}
```

### Verificar Status de Exportação
**GET** `/api/analytics/reports/export/:id`

```json
{
  "exportId": "export-uuid-123",
  "status": "COMPLETED",
  "format": "pdf",
  "fileSize": 2457600,
  "downloadUrl": "https://.../report-2024-Q4.pdf",
  "expiresAt": "2024-12-23T10:00:00.000Z"
}
```

---

## 🔔 Alertas e Notificações

### Obter Alertas Ativos
**GET** `/api/analytics/alerts`

Query Parameters:
- `severity`: Severidade (LOW, MEDIUM, HIGH, CRITICAL)
- `type`: Tipo de alerta
- `status`: Status (ACTIVE, RESOLVED, DISMISSED)

```json
{
  "alerts": [
    {
      "id": "alert-uuid-1",
      "type": "LOW_PERFORMANCE",
      "severity": "MEDIUM",
      "title": "Performance abaixo da média",
      "message": "3 técnicos com performance abaixo de 70 pontos",
      "affectedCount": 3,
      "tecnicos": [
        {
          "workday": "OP99999",
          "name": "Carlos Santos",
          "score": 68.5
        }
      ],
      "createdAt": "2024-12-15T10:00:00.000Z",
      "status": "ACTIVE"
    },
    {
      "id": "alert-uuid-2",
      "type": "SKILL_GAP",
      "severity": "HIGH",
      "title": "Gaps críticos de habilidades",
      "message": "5 gaps críticos identificados no Time Alpha",
      "affectedTeam": "Time Alpha",
      "gapCount": 5,
      "createdAt": "2024-12-14T15:00:00.000Z",
      "status": "ACTIVE"
    },
    {
      "id": "alert-uuid-3",
      "type": "MACHINE_DOWNTIME",
      "severity": "HIGH",
      "title": "Tempo de inatividade elevado",
      "message": "CNC-02 com 25% de downtime no último mês",
      "machine": "CNC-02",
      "downtime": 25.0,
      "createdAt": "2024-12-13T09:00:00.000Z",
      "status": "ACTIVE"
    }
  ],
  "summary": {
    "total": 12,
    "critical": 2,
    "high": 3,
    "medium": 5,
    "low": 2
  }
}
```

### Tipos de Alertas:
- `LOW_PERFORMANCE` - Performance abaixo da média
- `SKILL_GAP` - Gaps de habilidades
- `MACHINE_DOWNTIME` - Tempo de inatividade de máquina
- `CERTIFICATION_EXPIRING` - Certificações expirando
- `NO_EVALUATION` - Técnico sem avaliação no período
- `TEAM_UNDERPERFORMANCE` - Time com baixa performance

---

## 📊 Heatmaps

### Heatmap de Performance
**GET** `/api/analytics/heatmap/performance`

Query Parameters:
- `period`: Período
- `groupBy`: Agrupar por (team, shift, area)

```json
{
  "period": "2024-Q4",
  "groupBy": "team",
  "data": [
    {
      "team": "Time Alpha",
      "categories": {
        "production": 88.2,
        "quality": 86.5,
        "safety": 90.2,
        "teamwork": 85.8
      },
      "overall": 87.5
    }
  ]
}
```

---

## ⚠️ Códigos de Erro

- `400 Bad Request` - Parâmetros inválidos
- `401 Unauthorized` - Token JWT inválido ou ausente
- `403 Forbidden` - Sem permissão para acessar analytics
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

---

## 📝 Observações Importantes

1. **Períodos**: Suporta diversos formatos (Q1-Q4, meses, dias, ranges personalizados)
2. **Caching**: Dados de analytics são cacheados por performance
3. **Tempo Real**: Alguns endpoints oferecem dados em tempo real
4. **Exportação**: Suporta PDF, Excel e JSON
5. **Permissões**:
   - `MASTER`: Acesso total a todos os analytics
   - `SUPERVISOR`: Acesso a dados de sua área/time
   - `TECNICO`: Acesso apenas aos próprios dados
6. **Visualizações**: Dados otimizados para gráficos e dashboards
7. **Trends**: Calculados automaticamente com base em dados históricos
8. **Alertas**: Gerados automaticamente baseados em regras configuráveis
