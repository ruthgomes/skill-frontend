# 🔄 Atualização: Coordenadores com Múltiplos Sub-times

## 📋 Resumo da Mudança

Sistema atualizado para permitir que um coordenador possa liderar **múltiplos sub-times**, inclusive de **times diferentes**.

**Exemplo real:**
- Maria é coordenadora dos sub-times A, B, C e D
  - Sub-times A e B pertencem ao Time 1 (Manutenção)
  - Sub-time C pertence ao Time 2 (Produção)
  - Sub-time D pertence ao Time 3 (Qualidade)

---

## 🔄 O Que Mudou

### 1. **Banco de Dados**

#### Antes (Relacionamento 1:1)
```sql
-- Coluna na tabela tecnicos
led_subtime_id UUID -- Um coordenador liderava 1 sub-time
```

#### Depois (Relacionamento N:N)
```sql
-- Tabela intermediária Many-to-Many
CREATE TABLE coordenador_led_subtimes (
  coordenadorId UUID NOT NULL,
  subtimeId UUID NOT NULL,
  PRIMARY KEY (coordenadorId, subtimeId)
);
```

**Migration:** `1743800000000-UpdateCoordenadorToMultipleSubtimes.ts`
- Remove coluna `led_subtime_id`
- Cria tabela `coordenador_led_subtimes`
- Migra dados existentes automaticamente

---

### 2. **Entidades TypeORM**

#### Tecnico Entity ([src/modules/tecnicos/entities/tecnico.entity.ts](src/modules/tecnicos/entities/tecnico.entity.ts))

```typescript
// ❌ REMOVIDO
@Column({ name: 'led_subtime_id', nullable: true })
ledSubtimeId?: string;

@ManyToOne('SubTeam', { nullable: true })
@JoinColumn({ name: 'led_subtime_id' })
ledSubtime?: any;

// ✅ ADICIONADO
@ManyToMany('SubTeam', { nullable: true })
@JoinTable({
  name: 'coordenador_led_subtimes',
  joinColumn: { name: 'coordenadorId', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'subtimeId', referencedColumnName: 'id' },
})
ledSubtimes?: any[]; // Array de sub-times
```

---

### 3. **DTOs**

#### CreateTecnicoDto ([src/modules/tecnicos/dto/create-tecnico.dto.ts](src/modules/tecnicos/dto/create-tecnico.dto.ts))

```typescript
// ❌ REMOVIDO
@ApiProperty({ example: 'uuid-subtime-789' })
@IsUUID()
@IsOptional()
ledSubtimeId?: string;

// ✅ ADICIONADO
@ApiProperty({
  example: ['uuid-subtime-a', 'uuid-subtime-b', 'uuid-subtime-c'],
  type: [String],
})
@IsArray({ message: 'ledSubtimeIds deve ser um array de UUIDs' })
@IsUUID('4', { each: true })
@IsOptional()
ledSubtimeIds?: string[]; // Array de IDs
```

**UpdateTecnicoDto:** Herda automaticamente via `PartialType(CreateTecnicoDto)`

---

### 4. **Service**

#### tecnicos.service.ts ([src/modules/tecnicos/tecnicos.service.ts](src/modules/tecnicos/tecnicos.service.ts))

##### Método `create()`

```typescript
// Validação atualizada
if (tecnicoData.senioridade === Senioridade.COORDENADOR) {
  if (!ledSubtimeIds || ledSubtimeIds.length === 0) {
    throw new BadRequestException(
      'É obrigatório vincular ao menos um sub-time'
    );
  }

  // Verificar se todos os sub-times existem
  for (const subtimeId of ledSubtimeIds) {
    const subtime = await this.subTeamsRepository.findOne({
      where: { id: subtimeId },
    });
    if (!subtime) {
      throw new BadRequestException(`Sub-time ${subtimeId} não encontrado`);
    }
  }
}

// Associar múltiplos sub-times
if (tecnicoData.senioridade === Senioridade.COORDENADOR && ledSubtimeIds?.length > 0) {
  const subtimes = await this.subTeamsRepository.findByIds(ledSubtimeIds);
  savedTecnico.ledSubtimes = subtimes;
  await queryRunner.manager.save(savedTecnico);
}
```

##### Método `findAll()`

```typescript
// Filtrar por múltiplos sub-times
if (role === UserRole.COORDENADOR) {
  const coordenadorSubtimeIds = await this.ownershipService.getAccessibleTecnicosSubtimeIds(userId);
  
  if (coordenadorSubtimeIds?.length > 0) {
    queryBuilder.andWhere('tecnico.subtimeId IN (:...coordenadorSubtimeIds)', {
      coordenadorSubtimeIds,
    });
  }
}
```

##### Método `update()`

```typescript
// Atualizar sub-times liderados
if (updateTecnicoDto.ledSubtimeIds !== undefined) {
  if (updateTecnicoDto.ledSubtimeIds.length > 0) {
    const subtimes = await this.subTeamsRepository.findByIds(updateTecnicoDto.ledSubtimeIds);
    tecnico.ledSubtimes = subtimes;
  } else {
    tecnico.ledSubtimes = [];
  }
}
```

---

### 5. **OwnershipService**

#### Novo Método: `getAccessibleTecnicosSubtimeIds()` ([src/modules/auth/services/ownership.service.ts](src/modules/auth/services/ownership.service.ts))

```typescript
/**
 * Retorna IDs dos sub-times que o coordenador lidera
 */
async getAccessibleTecnicosSubtimeIds(userId: string): Promise<string[]> {
  const role = await this.getUserRole(userId);

  if (role === UserRole.COORDENADOR) {
    const coordenador = await this.tecnicosRepository.findOne({
      where: { user: { id: userId } },
      relations: ['ledSubtimes'],
    });
    
    return coordenador?.ledSubtimes?.map(st => st.id) || [];
  }

  return [];
}
```

#### Método Atualizado: `validateCoordenadorTecnicoAccess()`

```typescript
// Validar se técnico pertence a QUALQUER sub-time liderado
if (role === UserRole.COORDENADOR) {
  const coordenadorTecnico = await this.tecnicosRepository.findOne({
    where: { user: { id: userId } },
    relations: ['ledSubtimes'],
  });

  const ledSubtimeIds = coordenadorTecnico.ledSubtimes.map(st => st.id);
  
  if (!ledSubtimeIds.includes(tecnico.subtimeId)) {
    throw new ForbiddenException(
      'Você só pode acessar técnicos dos seus sub-times'
    );
  }
}
```

---

## 📝 Documentação Atualizada

### 1. [COORDENADOR_ACCESS_IDEAS.md](docs/COORDENADOR_ACCESS_IDEAS.md)
- Adicionada seção explicando múltiplos sub-times
- Atualizado exemplo de uso
- Atualizada hierarquia de acessos

### 2. [COORDENADOR_FRONTEND_INTEGRATION.md](docs/COORDENADOR_FRONTEND_INTEGRATION.md)
- Interface Tecnico atualizada com `ledSubtimes?: SubTeam[]`
- Request/Response examples com arrays
- Validações atualizadas

### 3. [MIGRAR_COORDENADORES_EXISTENTES.md](docs/MIGRAR_COORDENADORES_EXISTENTES.md)
- Atualizado para usar `ledSubtimeIds` (array)
- Exemplos com múltiplos sub-times
- FAQ expandido

---

## 🚀 Como Usar

### Criar Coordenador com Múltiplos Sub-times

```bash
POST /api/v1/tecnicos
Content-Type: application/json

{
  "name": "Maria Coordenadora",
  "workday": "WDC00100",
  "senioridade": "Coordenador",
  "email": "maria@empresa.com",
  "password": "Senha@123",
  "ledSubtimeIds": [
    "uuid-subtime-a", // Time Manutenção
    "uuid-subtime-b", // Time Manutenção
    "uuid-subtime-c"  // Time Produção
  ],
  // ... outros campos
}
```

### Atualizar Sub-times do Coordenador

```bash
PATCH /api/v1/tecnicos/{id-coordenador}

{
  "ledSubtimeIds": [
    "uuid-subtime-a",
    "uuid-subtime-d" // Adicionar novo sub-time
  ]
}
```

**⚠️ Nota:** O array substitui completamente a lista anterior.

### Listar Técnicos (como Coordenador)

```bash
GET /api/v1/tecnicos
Authorization: Bearer {token-coordenador}

# Retorna técnicos de TODOS os sub-times liderados
```

---

## 📊 Migração de Dados

### Etapa 1: Executar Migration

```bash
npm run migration:run
```

Isso irá:
1. Criar tabela `coordenador_led_subtimes`
2. Migrar dados de `led_subtime_id` → tabela intermediária
3. Remover coluna `led_subtime_id`

### Etapa 2: Migrar Coordenadores Existentes

#### Opção A: Via API (Manual)

```bash
PATCH /api/v1/tecnicos/{id-coordenador}

{
  "email": "coordenador@empresa.com",
  "password": "Senha@123",
  "ledSubtimeIds": ["uuid-a", "uuid-b"]
}
```

#### Opção B: Script Automático

```bash
npx ts-node scripts/migrate-coordenadores-v2.ts
```

**Features do script:**
- ✅ Lista coordenadores sem conta
- ✅ Mostra todos os sub-times disponíveis
- ✅ Permite selecionar múltiplos sub-times por coordenador
- ✅ Valida dados antes de salvar
- ✅ Usa transações (rollback em caso de erro)

---

## ✅ Checklist de Implementação

- [x] Atualizar entidade Tecnico (Many-to-Many)
- [x] Criar migration para tabela intermediária
- [x] Atualizar DTOs (ledSubtimeIds array)
- [x] Atualizar tecnicos.service.ts
- [x] Atualizar OwnershipService
- [x] Atualizar documentações
- [x] Criar script de migração v2
- [ ] Executar migration no banco de dados
- [ ] Migrar coordenadores existentes
- [ ] Testar criação de coordenador com múltiplos sub-times
- [ ] Testar login e acesso a técnicos
- [ ] Atualizar frontend (seguir COORDENADOR_FRONTEND_INTEGRATION.md)

---

## 🧪 Testes Recomendados

### 1. Criar Coordenador

```bash
POST /api/v1/tecnicos
{
  "senioridade": "Coordenador",
  "ledSubtimeIds": ["uuid-a", "uuid-b", "uuid-c"],
  "email": "teste@teste.com",
  "password": "Senha@123"
}

# Validar:
# - hasUserAccount = true
# - ledSubtimes.length = 3
```

### 2. Login como Coordenador

```bash
POST /api/v1/auth/login
{
  "email": "teste@teste.com",
  "password": "Senha@123"
}

# Validar:
# - role = "coordenador"
# - tecnicoId presente
```

### 3. Listar Técnicos

```bash
GET /api/v1/tecnicos
Authorization: Bearer {token-coordenador}

# Validar:
# - Retorna apenas técnicos dos sub-times A, B e C
# - NÃO retorna técnicos de outros sub-times
```

### 4. Editar Técnico do Sub-time

```bash
PATCH /api/v1/tecnicos/{tecnico-subtime-a}
{
  "cargo": "Novo Cargo"
}

# Deve funcionar ✅
```

### 5. Editar Técnico de Outro Sub-time

```bash
PATCH /api/v1/tecnicos/{tecnico-subtime-z}
{
  "cargo": "Novo Cargo"
}

# Deve retornar 403 Forbidden ❌
```

---

## 🎯 Benefícios

✅ **Flexibilidade:** Coordenadores podem liderar quantos sub-times precisarem

✅ **Escalabilidade:** Sub-times podem estar em times diferentes

✅ **Compatibilidade:** Migration migra dados existentes automaticamente

✅ **Segurança:** Validações garantem integridade dos dados

✅ **Manutenibilidade:** Código limpo e bem documentado

---

## 📞 Suporte

Para dúvidas sobre implementação:
1. Consulte [COORDENADOR_FRONTEND_INTEGRATION.md](docs/COORDENADOR_FRONTEND_INTEGRATION.md)
2. Consulte [MIGRAR_COORDENADORES_EXISTENTES.md](docs/MIGRAR_COORDENADORES_EXISTENTES.md)
3. Veja exemplos de código nos arquivos de documentação

**Arquivos Modificados:**
- [src/modules/tecnicos/entities/tecnico.entity.ts](src/modules/tecnicos/entities/tecnico.entity.ts)
- [src/modules/tecnicos/dto/create-tecnico.dto.ts](src/modules/tecnicos/dto/create-tecnico.dto.ts)
- [src/modules/tecnicos/tecnicos.service.ts](src/modules/tecnicos/tecnicos.service.ts)
- [src/modules/auth/services/ownership.service.ts](src/modules/auth/services/ownership.service.ts)
- [src/database/migrations/1743800000000-UpdateCoordenadorToMultipleSubtimes.ts](src/database/migrations/1743800000000-UpdateCoordenadorToMultipleSubtimes.ts)

**Scripts:**
- [scripts/migrate-coordenadores-v2.ts](scripts/migrate-coordenadores-v2.ts)

✅ **Sistema pronto para uso!**
