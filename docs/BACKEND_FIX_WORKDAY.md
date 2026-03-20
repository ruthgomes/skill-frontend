# 🔧 Correção Backend: Campo `workday` vs `shift` em Técnicos

## 📋 Problema Identificado

Atualmente, o backend possui uma **inconsistência conceitual** na entidade `Tecnico`:

```typescript
// ❌ ATUAL (INCORRETO)
@Column({ type: 'enum', enum: Shift })
workday: Shift;  // Valores: '1T', '2T', '3T', 'ADM'

@Column({ type: 'enum', enum: Shift })
shift: Shift;    // Valores: '1T', '2T', '3T', 'ADM'
```

**Problema:** Ambos os campos usam o mesmo enum `Shift`, mas `workday` deveria ser a **matrícula do colaborador** (string), não o turno.

---

## ✅ Correção Necessária

### 1. Alterar a Entidade `Tecnico`

**Arquivo:** `src/modules/tecnicos/entities/tecnico.entity.ts`

```typescript
// ✅ CORRETO
@Column()
workday: string;  // Matrícula do colaborador (ex: "WDC00001", "MAT12345")

@Column({ type: 'enum', enum: Shift })
shift: Shift;     // Turno de trabalho: '1T', '2T', '3T', 'ADM'
```

### 2. Atualizar o DTO de Criação

**Arquivo:** `src/modules/tecnicos/dto/create-tecnico.dto.ts`

```typescript
export class CreateTecnicoDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  // ✅ CORRIGIDO: workday agora é string
  @ApiProperty({ example: 'WDC00001', description: 'Matrícula do colaborador' })
  @IsString()
  @IsNotEmpty({ message: 'Matrícula (workday) é obrigatória' })
  workday: string;  // Matrícula

  @ApiProperty({ example: 'Técnico de Manutenção Elétrica' })
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @ApiProperty({ enum: Senioridade, example: 'Pleno' })
  @IsEnum(Senioridade)
  @IsNotEmpty()
  senioridade: Senioridade;

  @ApiProperty({ enum: Area, example: 'Manutenção' })
  @IsEnum(Area)
  @IsNotEmpty()
  area: Area;

  // ✅ shift permanece como enum
  @ApiProperty({ enum: Shift, example: '1T', description: 'Turno de trabalho' })
  @IsEnum(Shift, { message: 'Turno deve ser um dos seguintes valores: 1T, 2T, 3T, ADM' })
  @IsNotEmpty()
  shift: Shift;

  @ApiProperty({ example: 'Manutenção Elétrica' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ enum: Gender, example: 'M' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ example: '2020-01-15' })
  @IsDateString()
  @IsNotEmpty()
  joinDate: string;

  @ApiProperty({ example: 'team-id-123', required: false })
  @IsUUID()
  @IsOptional()
  teamId?: string;

  @ApiProperty({ example: 'subtime-id-456', required: false })
  @IsUUID()
  @IsOptional()
  subtimeId?: string;

  @ApiProperty({ type: [SkillInput], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillInput)
  @IsOptional()
  skills?: SkillInput[];
}
```

### 3. Atualizar o DTO de Atualização

**Arquivo:** `src/modules/tecnicos/dto/update-tecnico.dto.ts`

```typescript
export class UpdateTecnicoDto extends PartialType(CreateTecnicoDto) {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
```

O `PartialType` já vai herdar as mudanças do `CreateTecnicoDto`.

---

## 🗄️ Migration (Migração do Banco de Dados)

**IMPORTANTE:** Como o campo `workday` está mudando de enum para string, é necessário criar uma migration:

```typescript
// src/migrations/XXXXXX-fix-workday-field.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixWorkdayField1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Passo 1: Criar coluna temporária
    await queryRunner.query(`
      ALTER TABLE "tecnicos" 
      ADD COLUMN "workday_temp" VARCHAR
    `);

    // Passo 2: Copiar dados existentes (se houver técnicos já cadastrados)
    // Como workday atual tem valores '1T', '2T', '3T', 'ADM', podemos:
    // - Manter esses valores temporariamente
    // OU
    // - Gerar matrículas automáticas baseadas no ID
    await queryRunner.query(`
      UPDATE "tecnicos" 
      SET "workday_temp" = CONCAT('MAT', LPAD(CAST(ROW_NUMBER() OVER (ORDER BY "createdAt") AS VARCHAR), 5, '0'))
    `);

    // Passo 3: Remover coluna antiga
    await queryRunner.query(`
      ALTER TABLE "tecnicos" 
      DROP COLUMN "workday"
    `);

    // Passo 4: Renomear coluna temporária
    await queryRunner.query(`
      ALTER TABLE "tecnicos" 
      RENAME COLUMN "workday_temp" TO "workday"
    `);

    // Passo 5: Adicionar constraint NOT NULL
    await queryRunner.query(`
      ALTER TABLE "tecnicos" 
      ALTER COLUMN "workday" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter para enum (se necessário)
    await queryRunner.query(`
      ALTER TABLE "tecnicos" 
      ALTER COLUMN "workday" TYPE VARCHAR
    `);
    
    // Depois ajustar de volta para enum manualmente ou manter como VARCHAR
  }
}
```

**⚠️ ATENÇÃO:** Se já existem técnicos cadastrados no banco, a migration acima vai gerar matrículas automáticas (MAT00001, MAT00002, etc). Ajuste conforme a necessidade do negócio.

---

## 📊 Impacto das Mudanças

### ✅ O que vai funcionar:
- ✅ Frontend poderá enviar matrícula real (ex: "WDC00123")
- ✅ Turno permanece como enum validado
- ✅ Validações mais claras e semânticas
- ✅ Dados ficam consistentes com a realidade do negócio

### ⚠️ Pontos de atenção:
- ⚠️ Se houver técnicos já cadastrados, a migration vai sobrescrever os valores de workday
- ⚠️ Frontend precisa ser atualizado simultaneamente (já está sendo feito)
- ⚠️ Testes automáticos que usam workday precisam ser atualizados

---

## 🧪 Como Testar Após a Correção

### 1. Criar novo técnico via API:

```bash
POST http://localhost:3000/api/v1/tecnicos
Content-Type: application/json

{
  "name": "João da Silva",
  "workday": "WDC00123",           # ✅ Agora aceita matrícula
  "cargo": "Técnico Elétrico",
  "senioridade": "Pleno",
  "area": "Manutenção",
  "shift": "1T",                    # ✅ Turno continua como enum
  "department": "Manutenção Elétrica",
  "gender": "M",
  "joinDate": "2024-01-15",
  "teamId": "uuid-do-time",
  "subtimeId": "uuid-do-subtime"
}
```

### 2. Validar erro ao usar enum em workday:

```bash
POST http://localhost:3000/api/v1/tecnicos
{
  "workday": "1T",  # ❌ Deve ACEITAR (agora é string)
  ...
}
```

Agora vai funcionar porque workday é string!

### 3. Validar erro ao usar string em shift:

```bash
POST http://localhost:3000/api/v1/tecnicos
{
  "shift": "Primeiro turno",  # ❌ Deve REJEITAR
  ...
}
```

Deve retornar erro: `"shift must be one of the following values: 1T, 2T, 3T, ADM"`

---

## 📝 Checklist de Implementação

- [ ] Atualizar entidade `Tecnico` (mudar workday de enum para string)
- [ ] Atualizar `CreateTecnicoDto` (workday: string)
- [ ] Atualizar `UpdateTecnicoDto` (se necessário)
- [ ] Criar e rodar migration para alterar coluna no banco
- [ ] Atualizar seeds/fixtures (se houver)
- [ ] Atualizar testes unitários
- [ ] Atualizar testes e2e
- [ ] Atualizar documentação Swagger
- [ ] Testar no Postman/Insomnia
- [ ] Sincronizar com Frontend (já feito)

---

## 📚 Documentação Relacionada

- [TECNICOS_API.md](./TECNICOS_API.md) - Documentação completa da API de Técnicos
- [ATUALIZACOES_BACKEND.md](./ATUALIZACOES_BACKEND.md) - Histórico de mudanças no backend

---

**Data:** 17/03/2026  
**Identificado por:** Frontend Team  
**Prioridade:** 🔴 Alta (bloqueia cadastro correto de colaboradores)  
**Status:** 📋 Aguardando implementação no backend
