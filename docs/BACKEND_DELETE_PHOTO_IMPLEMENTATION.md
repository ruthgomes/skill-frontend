# Implementação de DELETE Foto de Técnico no Backend

## 🐛 Problema Identificado

O frontend está tentando deletar fotos de técnicos através do endpoint:
```
DELETE /api/v1/tecnicos/:id/photo
```

Porém, o backend retorna **404 Not Found** indicando que este endpoint não existe.

### Erro Atual
```
Cannot DELETE /api/v1/tecnicos/4488b7b8-a0ef-4427-ac8d-04de680af8e1/photo
{"message":"Cannot DELETE /api/v1/tecnicos/4488b7b8-a0ef-4427-ac8d-04de680af8e1/photo","error":"Not Found","statusCode":404}
```

### Stack do Erro no Frontend
```
at TecnicosService.handleError (core/services/tecnicos.service.ts:199:14)
at TecnicosService.removePhoto (core/services/tecnicos.service.ts:139:18)
at async handlePhotoDelete (app/tecnicos/[id]/page.tsx:257:7)
```

---

## ✅ Solução Requerida

Implementar o endpoint DELETE no backend para remover fotos de técnicos.

---

## 📋 Especificação do Endpoint

### **DELETE** `/api/v1/tecnicos/:id/photo`

Remove a foto de um técnico específico.

#### Parâmetros de Rota

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | UUID | ID do técnico |

#### Headers

```http
Authorization: Bearer {access_token}
```

#### Permissões

- Requer autenticação
- Role permitida: `MASTER` (ou conforme política de segurança)

#### Comportamento Esperado

1. **Validar o técnico existe**
   - Se não existir → Retornar 404

2. **Verificar se técnico tem foto**
   - Se não tiver foto → Retornar sucesso (operação idempotente)

3. **Remover arquivo físico**
   - Deletar arquivo do sistema de arquivos em `uploads/tecnicos/`
   - Ignorar erro se arquivo não existir

4. **Atualizar registro no banco**
   - Setar campo `photo` como `null`

5. **Retornar técnico atualizado**
   - Retornar objeto do técnico com `photo: null`

#### Respostas

**✅ Sucesso - 200 OK**

```json
{
  "id": "4488b7b8-a0ef-4427-ac8d-04de680af8e1",
  "name": "João Silva",
  "workday": "WDC00001",
  "cargo": "Técnico Elétrico",
  "photo": null,
  // ... outros campos
}
```

**❌ Técnico não encontrado - 404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Técnico não encontrado",
  "error": "Not Found"
}
```

**❌ Não autorizado - 401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

**❌ Sem permissão - 403 Forbidden**

```json
{
  "statusCode": 403,
  "message": "Você não tem permissão para realizar esta ação",
  "error": "Forbidden"
}
```

---

## 💻 Exemplo de Implementação (NestJS)

### Controller (`tecnicos.controller.ts`)

```typescript
@Delete(':id/photo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MASTER)
@ApiOperation({ summary: 'Remove a foto de um técnico' })
@ApiResponse({ status: 200, description: 'Foto removida com sucesso', type: Tecnico })
@ApiResponse({ status: 404, description: 'Técnico não encontrado' })
async removePhoto(
  @Param('id', ParseUUIDPipe) id: string,
): Promise<Tecnico> {
  return this.tecnicosService.removePhoto(id);
}
```

### Service (`tecnicos.service.ts`)

```typescript
async removePhoto(id: string): Promise<Tecnico> {
  // 1. Buscar técnico
  const tecnico = await this.tecnicoRepository.findOne({
    where: { id },
  });

  if (!tecnico) {
    throw new NotFoundException('Técnico não encontrado');
  }

  // 2. Se não tem foto, retornar sucesso (idempotente)
  if (!tecnico.photo) {
    return tecnico;
  }

  // 3. Remover arquivo físico (se existir)
  try {
    const filePath = join(process.cwd(), 'uploads', 'tecnicos', tecnico.photo);
    await fs.unlink(filePath);
    this.logger.log(`Foto removida: ${filePath}`);
  } catch (error) {
    // Ignorar erro se arquivo não existir
    if (error.code !== 'ENOENT') {
      this.logger.warn(`Erro ao remover arquivo físico: ${error.message}`);
    }
  }

  // 4. Atualizar banco de dados
  tecnico.photo = null;
  return await this.tecnicoRepository.save(tecnico);
}
```

---

## 🧪 Testes Recomendados

### Casos de Teste

1. **✅ Remover foto existente**
   - GIVEN: Técnico com foto cadastrada
   - WHEN: DELETE /api/v1/tecnicos/:id/photo
   - THEN: Foto removida, campo `photo` = null, retorna 200

2. **✅ Remover foto quando já está vazio (idempotente)**
   - GIVEN: Técnico sem foto
   - WHEN: DELETE /api/v1/tecnicos/:id/photo
   - THEN: Retorna 200, técnico permanece sem alteração

3. **❌ Técnico não existe**
   - GIVEN: UUID inexistente
   - WHEN: DELETE /api/v1/tecnicos/uuid-inexistente/photo
   - THEN: Retorna 404

4. **❌ Sem autenticação**
   - GIVEN: Request sem token
   - WHEN: DELETE /api/v1/tecnicos/:id/photo
   - THEN: Retorna 401

5. **❌ Sem permissão**
   - GIVEN: Usuário sem role MASTER
   - WHEN: DELETE /api/v1/tecnicos/:id/photo
   - THEN: Retorna 403

### Exemplo de Teste Unitário

```typescript
describe('TecnicosService - removePhoto', () => {
  it('deve remover foto com sucesso', async () => {
    const mockTecnico = {
      id: 'uuid-123',
      name: 'João Silva',
      photo: 'foto-123.jpg',
    };

    tecnicoRepository.findOne.mockResolvedValue(mockTecnico);
    tecnicoRepository.save.mockResolvedValue({ ...mockTecnico, photo: null });

    const result = await service.removePhoto('uuid-123');

    expect(result.photo).toBeNull();
    expect(tecnicoRepository.save).toHaveBeenCalledWith({
      ...mockTecnico,
      photo: null,
    });
  });

  it('deve retornar 404 se técnico não existir', async () => {
    tecnicoRepository.findOne.mockResolvedValue(null);

    await expect(service.removePhoto('uuid-inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve ser idempotente quando técnico já não tem foto', async () => {
    const mockTecnico = {
      id: 'uuid-123',
      name: 'João Silva',
      photo: null,
    };

    tecnicoRepository.findOne.mockResolvedValue(mockTecnico);

    const result = await service.removePhoto('uuid-123');

    expect(result.photo).toBeNull();
    expect(tecnicoRepository.save).not.toHaveBeenCalled();
  });
});
```

---

## 🔗 Endpoints Relacionados

Para referência, aqui estão os outros endpoints de foto já implementados:

### POST `/api/v1/tecnicos/:id/photo`
- Upload de nova foto
- Substitui foto existente
- Retorna técnico com campo `photo` atualizado

### POST `/api/v1/tecnicos/with-photo`
- Cria técnico com foto em um único request
- FormData com todos os campos + arquivo

---

## 📝 Checklist de Implementação

- [ ] Criar método `removePhoto()` no service
- [ ] Adicionar rota DELETE no controller
- [ ] Adicionar decorators de permissão (@Roles, @UseGuards)
- [ ] Implementar remoção de arquivo físico
- [ ] Atualizar campo `photo` no banco para `null`
- [ ] Adicionar tratamento de erros (técnico não encontrado)
- [ ] Criar testes unitários
- [ ] Criar testes E2E (opcional)
- [ ] Atualizar documentação Swagger
- [ ] Testar integração com frontend

---

## 🚀 Como Testar Após Implementação

### Via cURL

```bash
# Remover foto de um técnico
curl -X DELETE http://localhost:3000/api/v1/tecnicos/4488b7b8-a0ef-4427-ac8d-04de680af8e1/photo \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Via Frontend

1. Acesse: http://localhost:4200/tecnicos/[id]
2. Hover sobre a foto do técnico
3. Clique no ícone de lixeira 🗑️
4. A foto deve ser removida
5. Avatar deve mostrar iniciais do técnico

---

## 📚 Referências

- [TECNICOS_PHOTO_API.md](./TECNICOS_PHOTO_API.md) - Documentação completa da API de fotos
- [FRONTEND_PHOTO_INTEGRATION.md](./FRONTEND_PHOTO_INTEGRATION.md) - Integração no frontend
- [API_PROXY_MIGRATION.md](./API_PROXY_MIGRATION.md) - Rotas de proxy implementadas

---

## 🎯 Prioridade

**ALTA** - Bloqueando funcionalidade de gerenciamento de fotos no frontend.

O frontend já está preparado e aguardando apenas a implementação no backend.
