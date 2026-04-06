# 👔 Sistema de Acesso do Coordenador - Ideias e Funcionalidades

## 📋 Contexto

**Problema:** Coordenadores lideram sub-times, mas os sub-times não têm operações CRUD (criação/edição/exclusão). Apenas Supervisores podem gerenciar a estrutura organizacional.

**Solução:** Dar ao Coordenador permissões para **gerenciar pessoas** dos seus sub-times, sem poder alterar a estrutura organizacional.

**⭐ Importante:** Um coordenador pode liderar **múltiplos sub-times** que podem estar em **times diferentes**. 
- Exemplo: Maria é coordenadora dos sub-times A, B, C e D
  - Sub-times A e B pertencem ao Time 1
  - Sub-time C pertence ao Time 2
  - Sub-time D pertence ao Time 3

---

## 🎯 Hierarquia de Acessos

```
┌─────────────────────────────────────────────────────────┐
│ ADMIN (MASTER)                                          │
│ ✅ Acesso total ao sistema                             │
│ ✅ Gerencia todos os times, sub-times e técnicos       │
└─────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ SUPERVISOR                                              │
│ ✅ Cria/edita/deleta times e sub-times (seus)          │
│ ✅ Cria/edita/deleta técnicos do seu time              │
│ ✅ Avalia todos os técnicos do seu time                │
│ ✅ Aprova avaliações dos coordenadores                 │
│ ✅ Gerencia skills, fotos, dados                       │
└─────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ COORDENADOR (NOVA ROLE) ⭐                              │
│ ❌ NÃO cria/edita/deleta times ou sub-times            │
│ ❌ NÃO cria/deleta técnicos                            │
│ ✅ Pode liderar MÚLTIPLOS sub-times (mesmo de times diferentes) │
│ ✅ Visualiza técnicos dos seus sub-times               │
│ ✅ Edita dados dos técnicos dos seus sub-times         │
│ ✅ Avalia técnicos dos seus sub-times                  │
│ ✅ Registra notas trimestrais                          │
│ ✅ Atualiza skills e fotos                             │
│ ✅ Visualiza analytics dos sub-times                   │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Funcionalidades do Coordenador

### 1️⃣ **Gestão de Técnicos dos Sub-Times**

#### ✅ O que pode fazer:
- **Visualizar** todos os técnicos dos seus sub-times
- **Editar informações** dos técnicos:
  - Cargo
  - Departamento  
  - Turno (shift)
  - Skills e pontuações
  - Fotos
- **Desativar** técnicos (soft delete) dos seus sub-times
  - Quando técnico muda de área ou é demitido

#### ❌ O que NÃO pode fazer:
- Criar novos técnicos (apenas Supervisor)
- Deletar permanentemente
- Alterar `workday` (matrícula)
- Mover técnicos entre times/sub-times
- Alterar senioridade para "Supervisor"

#### 📍 Exemplo de Uso:
```
Coordenadora Maria lidera 3 sub-times:
- "Sub-Time A" (Time de Manutenção)
- "Sub-Time B" (Time de Manutenção)  
- "Sub-Time C" (Time de Produção)

Pode editar dados de:
- João, Pedro, Ana (Sub-Time A)
- Carlos, Julia (Sub-Time B)
- Roberto, Fernanda (Sub-Time C)

NÃO pode editar:
- Lucas (está no Sub-Time D do Time de Manutenção - não liderado por Maria)
- NÃO pode criar novo técnico (pede ao Supervisor)
```

---

### 2️⃣ **Sistema de Avaliações**

#### ✅ O que pode fazer:
- **Criar avaliações** para técnicos do seu sub-time
- **Preencher critérios** de avaliação
- **Submeter avaliações** para aprovação do Supervisor
- **Visualizar histórico** de avaliações do sub-time
- **Editar avaliações** em status "DRAFT"

#### 📊 Workflow de Avaliação:
```
1. Coordenador cria avaliação (status: DRAFT)
2. Coordenador preenche critérios e comentários
3. Coordenador SUBMETE (status: SUBMITTED)
4. Supervisor APROVA ou REJEITA
   - Se rejeitado, volta para DRAFT
   - Se aprovado, status: APPROVED
```

#### 🔐 Regras de Negócio:
- Apenas 1 avaliação por técnico por trimestre
- Coordenador só vê avaliações que ele criou
- Supervisor vê todas as avaliações do time
- Após aprovação, coordenador não pode mais editar

#### 📍 Exemplo de Uso:
```
Trimestre 1/2026 - Coordenador João avalia:
✅ Maria (Sub-Time A) - pode avaliar
✅ Pedro (Sub-Time A) - pode avaliar
❌ Carlos (Sub-Time B) - não pode avaliar (outro sub-time)
```

---

### 3️⃣ **Notas Trimestrais**

#### ✅ O que pode fazer:
- **Registrar notas** trimestrais dos técnicos do sub-time
- **Editar notas** do trimestre atual
- **Visualizar histórico** de notas
- **Adicionar comentários** e observações

#### 📊 Estrutura:
```json
{
  "tecnicoId": "uuid",
  "quarter": 1,
  "year": 2026,
  "score": 8.5,
  "notes": "Bom desempenho, melhorou tempo de resposta",
  "breakdown": [
    {
      "categoryName": "Qualidade Técnica",
      "score": 9.0,
      "maxScore": 10
    },
    {
      "categoryName": "Trabalho em Equipe",
      "score": 8.0,
      "maxScore": 10
    }
  ],
  "evaluatorId": "uuid-coordenador"
}
```

#### 📍 Exemplo de Uso:
```
Final do Q1/2026:
- João registra nota 8.5 para Maria
- João registra nota 7.8 para Pedro
- Sistema gera relatório do sub-time
```

---

### 4️⃣ **Gestão de Skills**

#### ✅ O que pode fazer:
- **Visualizar skills** de cada técnico do sub-time
- **Atualizar pontuações** de skills existentes
- **Adicionar observações** sobre cada skill
- **Sugerir treinamentos** baseado em gaps de skills

#### ❌ O que NÃO pode fazer:
- Criar novas skills no sistema (apenas Admin)
- Atribuir skills que o técnico não possui
- Deletar skills do técnico

#### 📍 Exemplo:
```
Técnico: Maria Silva
Skill: Manutenção Elétrica
- Score atual: 7.5
- Coordenador atualiza para: 8.5
- Observação: "Concluiu treinamento de NR-10"
```

---

### 5️⃣ **Analytics e Relatórios do Sub-Time**

#### ✅ Dashboards Disponíveis:
1. **Performance do Sub-Time:**
   - Média de notas do trimestre
   - Top performers
   - Técnicos que precisam de atenção
   
2. **Skills Gap Analysis:**
   - Skills mais fortes do time
   - Skills que precisam desenvolvimento
   - Comparação com outros sub-times (anônimo)

3. **Evolução Temporal:**
   - Gráfico de performance trimestral
   - Crescimento de skills
   - Taxa de conclusão de avaliações

4. **Distribuição:**
   - Por turno (1T, 2T, 3T)
   - Por senioridade
   - Por área de atuação

#### 📍 Exemplo de Dashboard:
```
Sub-Time A - Q1/2026
┌─────────────────────────────────────┐
│ Performance Média: 8.2              │
│ Técnicos avaliados: 12/15           │
│ Skills em desenvolvimento: 5        │
│                                     │
│ Top 3 Skills:                       │
│ 1. Manutenção Preventiva (9.2)     │
│ 2. Análise de Falhas (8.8)         │
│ 3. Liderança (8.5)                 │
└─────────────────────────────────────┘
```

---

### 6️⃣ **Gestão de Fotos**

#### ✅ O que pode fazer:
- **Upload** de fotos dos técnicos do sub-time
- **Atualizar** fotos existentes
- **Remover** fotos

#### 📍 Caso de Uso:
```
Novo técnico entra no sub-time:
- Supervisor cria o técnico no sistema
- Coordenador adiciona foto durante onboarding
- Foto aparece em avaliações e relatórios
```

---

## 🔐 Implementação Técnica

### 1. Criar Nova Role: `COORDENADOR`

#### `user.entity.ts`
```typescript
export enum UserRole {
  MASTER = 'master',
  SUPERVISOR = 'supervisor',
  COORDENADOR = 'coordenador', // ⭐ NOVO
}
```

### 2. Vincular Coordenador ao Sub-Time

#### `tecnico.entity.ts`
```typescript
@Entity('tecnicos')
export class Tecnico {
  // ... campos existentes
  
  // ⭐ NOVO: ID do sub-time que o coordenador lidera
  @Column({ name: 'led_subtime_id', nullable: true })
  ledSubtimeId?: string;
  
  @ManyToOne(() => SubTeam, { nullable: true })
  @JoinColumn({ name: 'led_subtime_id' })
  ledSubtime?: SubTeam;
}
```

### 3. Guards de Autorização

#### `coordenador.guard.ts` (NOVO)
```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tecnico } from '../../tecnicos/entities/tecnico.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CoordenadorSubTimeGuard implements CanActivate {
  constructor(
    @InjectRepository(Tecnico)
    private tecnicosRepository: Repository<Tecnico>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Do JwtAuthGuard
    const tecnicoId = request.params.id;

    // Admin sempre tem acesso
    if (user.role === 'master') {
      return true;
    }

    // Buscar técnico do usuário logado
    const coordenador = await this.tecnicosRepository.findOne({
      where: { email: user.email },
      relations: ['ledSubtime'],
    });

    if (!coordenador || !coordenador.ledSubtimeId) {
      throw new ForbiddenException('Você não é coordenador de nenhum sub-time');
    }

    // Buscar técnico que está sendo editado/avaliado
    const tecnico = await this.tecnicosRepository.findOne({
      where: { id: tecnicoId },
    });

    if (!tecnico) {
      throw new NotFoundException('Técnico não encontrado');
    }

    // Verificar se técnico pertence ao sub-time do coordenador
    if (tecnico.subtimeId !== coordenador.ledSubtimeId) {
      throw new ForbiddenException(
        'Você só pode gerenciar técnicos do seu sub-time'
      );
    }

    return true;
  }
}
```

### 4. Aplicar Guards nas Rotas

#### Exemplo: `avaliacoes.controller.ts`
```typescript
@Post()
@Roles(UserRole.MASTER, UserRole.SUPERVISOR, UserRole.COORDENADOR) // ⭐
@UseGuards(JwtAuthGuard, RolesGuard, CoordenadorSubTimeGuard) // ⭐
@ApiOperation({ summary: 'Criar avaliação (Coordenador: apenas seu sub-time)' })
createEvaluation(
  @Body() createEvaluationDto: CreateEvaluationDto,
  @GetUser() user: User,
) {
  return this.avaliacoesService.create(createEvaluationDto, user.id);
}
```

---

## 📊 Matriz de Permissões

| Funcionalidade | Admin | Supervisor | Coordenador |
|----------------|-------|------------|-------------|
| **Times/Sub-times** |
| Criar time/sub-time | ✅ Todos | ✅ Seus | ❌ |
| Editar time/sub-time | ✅ Todos | ✅ Seus | ❌ |
| Deletar time/sub-time | ✅ Todos | ✅ Seus | ❌ |
| Visualizar times | ✅ Todos | ✅ Seus | ✅ Seu sub-time |
| **Técnicos** |
| Criar técnico | ✅ Todos | ✅ Seu time | ❌ |
| Editar técnico | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |
| Deletar técnico | ✅ Todos | ✅ Seu time | ❌ |
| Desativar técnico | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |
| Upload foto | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |
| **Avaliações** |
| Criar avaliação | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |
| Editar avaliação (draft) | ✅ Todas | ✅ Seu time | ✅ Suas |
| Submeter avaliação | ✅ Todas | ✅ Suas | ✅ Suas |
| Aprovar avaliação | ✅ Todas | ✅ Do time | ❌ |
| Deletar avaliação | ✅ Todas | ✅ Seu time | ❌ |
| **Notas Trimestrais** |
| Criar nota | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |
| Editar nota | ✅ Todas | ✅ Seu time | ✅ Suas |
| Deletar nota | ✅ Todas | ✅ Seu time | ❌ |
| **Skills** |
| Criar skill (catálogo) | ✅ | ❌ | ❌ |
| Atualizar score | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |
| Adicionar skill a técnico | ✅ Todos | ✅ Seu time | ❌ |
| Remover skill de técnico | ✅ Todos | ✅ Seu time | ❌ |
| **Analytics** |
| Ver dashboard geral | ✅ | ❌ | ❌ |
| Ver dashboard do time | ✅ | ✅ Seu time | ❌ |
| Ver dashboard do sub-time | ✅ | ✅ Seus | ✅ Seu sub-time |
| Exportar relatórios | ✅ Todos | ✅ Seu time | ✅ Seu sub-time |

---

## 🎯 Benefícios da Solução

### Para a Empresa:
1. ✅ **Descentralização**: Coordenadores assumem gestão diária
2. ✅ **Escalabilidade**: Menos sobrecarga no Supervisor
3. ✅ **Rastreabilidade**: Quem avaliou/editou cada técnico
4. ✅ **Workflow estruturado**: Aprovações em camadas

### Para o Coordenador:
1. ✅ **Autonomia**: Gerencia seu sub-time sem depender do supervisor
2. ✅ **Visibilidade**: Acompanha evolução dos técnicos
3. ✅ **Responsabilidade**: Accountable por performance do sub-time

### Para o Supervisor:
1. ✅ **Foco estratégico**: Delega operações táticas
2. ✅ **Aprovações**: Valida trabalho dos coordenadores
3. ✅ **Visão macro**: Relatórios consolidados do time inteiro

---

## 🧪 Cenários de Teste

### Cenário 1: Coordenador avalia técnico do seu sub-time ✅
```
Given: João é coordenador do "Sub-Time A"
When: João cria avaliação para Maria (Sub-Time A)
Then: ✅ Avaliação criada com sucesso
```

### Cenário 2: Coordenador tenta avaliar técnico de outro sub-time ❌
```
Given: João é coordenador do "Sub-Time A"
When: João tenta avaliar Carlos (Sub-Time B)
Then: ❌ 403 Forbidden - "Você só pode avaliar técnicos do seu sub-time"
```

### Cenário 3: Coordenador tenta criar sub-time ❌
```
Given: João é coordenador
When: João tenta POST /api/v1/subtimes
Then: ❌ 403 Forbidden - "Apenas Supervisores podem criar sub-times"
```

### Cenário 4: Coordenador edita foto de técnico do sub-time ✅
```
Given: João é coordenador do "Sub-Time A"
When: João faz POST /api/v1/tecnicos/{maria-id}/photo
Then: ✅ Foto atualizada com sucesso
```

---

## 📝 Próximos Passos

### Fase 1: Estrutura Base (Sprint 1)
- [ ] Criar enum `UserRole.COORDENADOR`
- [ ] Adicionar coluna `led_subtime_id` em `tecnicos`
- [ ] Migration para atualizar banco
- [ ] Atualizar seed de dados de teste

### Fase 2: Guards e Autorização (Sprint 2)
- [ ] Criar `CoordenadorSubTimeGuard`
- [ ] Atualizar decorators `@Roles` em controllers
- [ ] Implementar lógica de ownership service
- [ ] Testes unitários dos guards

### Fase 3: Funcionalidades (Sprint 3)
- [ ] Avaliações: Permitir coordenador criar/submeter
- [ ] Notas trimestrais: Permitir registro
- [ ] Skills: Permitir atualização de scores
- [ ] Fotos: Permitir upload/delete

### Fase 4: Analytics (Sprint 4)
- [ ] Dashboard do sub-time para coordenador
- [ ] Relatórios exportáveis
- [ ] Comparativos de performance

### Fase 5: Frontend (Sprint 5)
- [ ] Tela de login: Detectar role e redirecionar
- [ ] Menu específico para coordenador
- [ ] Listagem filtrada por sub-time
- [ ] Formulários de avaliação

---

## ❓ FAQ

**Q: Coordenador pode ver técnicos de outros sub-times?**  
A: Não, apenas do sub-time que ele lidera.

**Q: Supervisor pode aprovar avaliações do coordenador?**  
A: Sim, faz parte do workflow de aprovação.

**Q: E se técnico não pertence a nenhum sub-time?**  
A: Coordenador não pode gerenciá-lo. Apenas Supervisor ou Admin.

**Q: Coordenador pode promover técnico a Supervisor?**  
A: Não, apenas Admin ou Supervisor podem alterar senioridade.

**Q: Como atribuir sub-time ao coordenador?**  
A: No cadastro do técnico com senioridade "Coordenador", Supervisor preenche campo `led_subtime_id`.

---

## 🎬 Conclusão

Esta solução dá **propósito real** ao login do Coordenador, permitindo que ele:
- ✅ Gerencie técnicos do SUB-TIME (não do time inteiro)
- ✅ Avalie e acompanhe performance
- ✅ Tenha autonomia sem quebrar hierarquia
- ✅ Trabalhe de forma isolada e segura

O sistema mantém **isolamento de dados**, **workflow de aprovações** e **rastreabilidade completa**.
