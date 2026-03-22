# Integração de Fotos - Frontend

## 📅 Data: 22 de março de 2026

---

## 🎯 Resumo da Implementação

Sistema completo de gerenciamento de fotos de técnicos integrado com o backend. O sistema permite:
- ✅ Upload de foto durante cadastro de novo colaborador
- ✅ Visualização de foto na página de detalhes do técnico
- ✅ Upload/atualização de foto em técnico existente
- ✅ Remoção de foto
- ✅ Validação de formato e tamanho de arquivo

---

## 📁 Arquivos Modificados

### 1. `core/services/tecnicos.service.ts`

**Novo método adicionado:**

```typescript
/**
 * Cria novo técnico com foto em um único request
 */
async createWithPhoto(data: CreateTecnicoRequest, photoFile?: File): Promise<Tecnico>
```

**Funcionalidade:**
- Envia dados do técnico + foto via multipart/form-data
- Usa endpoint POST `/api/v1/tecnicos/with-photo`
- Foto é opcional (técnico pode ser criado sem foto)

**Métodos existentes utilizados:**
- `uploadPhoto(id, file)` - Upload de foto em técnico existente
- `removePhoto(id)` - Remoção de foto do técnico

---

### 2. `core/types/api.types.ts`

**Campo adicionado à interface Tecnico:**

```typescript
export interface Tecnico {
  // ... campos existentes
  photo?: string | null // Caminho da foto no backend (ex: "uploads/photos/uuid.jpg")
  // ...
}
```

---

### 3. `app/cadastro/page.tsx`

**Mudanças principais:**

1. **Novo estado para arquivo de foto:**
```typescript
const [photoFile, setPhotoFile] = useState<File | null>(null)
```

2. **Validação no handlePhotoChange:**
- Tipos válidos: JPG, PNG, WEBP, GIF
- Tamanho máximo: 5MB
- Guarda tanto o preview quanto o arquivo File

3. **Submit atualizado:**
```typescript
if (photoFile) {
  await tecnicosService.createWithPhoto(tecnicoData, photoFile)
} else {
  await tecnicosService.create(tecnicoData)
}
```

**Fluxo:**
1. Usuário seleciona foto no formulário
2. Preview é exibido
3. Arquivo é validado
4. Ao submeter, foto é enviada junto com dados do técnico
5. Backend cria técnico e salva foto em um único request

---

### 4. `app/tecnicos/[id]/page.tsx`

**Mudanças principais:**

1. **Constante para URL base:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
```

2. **Função para construir URL da foto:**
```typescript
const getPhotoURL = (photoPath: string | null | undefined): string | null => {
  if (!photoPath) return null
  return `${API_BASE_URL}/${photoPath}`
}
```

3. **Upload de foto implementado:**
```typescript
const uploadPhoto = async (file: File) => {
  await tecnicosService.uploadPhoto(tecnicoId, file)
  await fetchTecnicoData() // Recarrega dados do técnico
}
```

4. **Remoção de foto implementada:**
```typescript
const handlePhotoDelete = async () => {
  await tecnicosService.removePhoto(tecnicoId)
  await fetchTecnicoData() // Recarrega dados do técnico
}
```

5. **Avatar atualizado para usar foto do backend:**
```typescript
<Avatar>
  {tecnico.photo ? (
    <AvatarImage 
      src={getPhotoURL(tecnico.photo) || undefined} 
      alt={tecnico.name}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  ) : null}
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

**Funcionalidades:**
- Exibe foto do backend quando disponível
- Fallback para iniciais quando sem foto
- Botão de câmera para alterar foto (hover)
- Botão de lixeira para remover foto (hover)
- Loading state durante upload
- Validação de formato e tamanho

---

## 🔄 Fluxos Implementados

### Fluxo 1: Cadastro com Foto

```
1. Usuário preenche formulário de cadastro
2. Usuário seleciona foto (opcional)
   ↓
3. Validação de formato e tamanho
   ↓
4. Preview da foto é exibido
   ↓
5. Usuário clica em "Cadastrar"
   ↓
6. Frontend cria técnico (POST /tecnicos) com dados básicos
   ↓
7. Backend retorna técnico criado com ID
   ↓
8. Se houver foto: Frontend faz upload (POST /tecnicos/:id/photo)
   ↓
9. Técnico criado com sucesso (com ou sem foto)
```

### Fluxo 2: Upload de Foto em Técnico Existente

```
1. Usuário acessa página de detalhes (/tecnicos/[id])
2. Hover no avatar → botão de câmera aparece
3. Usuário clica no botão de câmera
   ↓
4. Seletor de arquivo abre
   ↓
5. Usuário seleciona foto
   ↓
6. Validação de formato e tamanho
   ↓
7. Frontend faz upload via POST /tecnicos/:id/photo
   ↓
8. Backend salva foto e retorna técnico atualizado
   ↓
9. Frontend recarrega dados e exibe nova foto
```

### Fluxo 3: Remoção de Foto

```
1. Usuário acessa página de detalhes
2. Hover no avatar → botão de lixeira aparece
3. Usuário clica no botão de lixeira
   ↓
4. Frontend faz DELETE /tecnicos/:id/photo
   ↓
5. Backend remove arquivo e limpa campo photo
   ↓
6. Frontend recarrega dados
   ↓
7. Avatar volta a exibir iniciais
```

---

## 🎨 Componentes UI Atualizados

### Cadastro (`/cadastro`)
- Input de arquivo com preview circular
- Botão de remover foto (X)
- Validação visual de erro

### Detalhes do Técnico (`/tecnicos/[id]`)
- Avatar com foto ou iniciais
- Controles de foto no hover (câmera + lixeira)
- Loading spinner durante upload
- Fallback automático para iniciais se imagem falhar

---

## 🔧 Validações Implementadas

### Frontend

**Tipo de arquivo:**
- Formatos aceitos: JPG, JPEG, PNG, WEBP, GIF
- Validação via `file.type`
- Mensagem de erro se formato inválido

**Tamanho:**
- Máximo: 5MB
- Validação via `file.size`
- Mensagem de erro se exceder limite

### Backend (já implementado)

Consulte `docs/TECNICOS_PHOTO_API.md` para validações do backend.

---

## 📡 Endpoints Utilizados

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/api/v1/tecnicos` | POST | Criar técnico (sem foto) |
| `/api/v1/tecnicos/:id/photo` | POST | Upload/atualizar foto |
| `/api/v1/tecnicos/:id/photo` | DELETE | Remover foto |
| `/uploads/photos/:filename` | GET | Servir arquivo de foto |

**Nota:** O endpoint `/api/v1/tecnicos/with-photo` (criar técnico + foto em um request) existe no método do service mas não é usado no fluxo de cadastro. O fluxo implementado cria o técnico primeiro e depois faz upload da foto separadamente (mais confiável).

---

## 🔑 Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Uso:**
- Construção da URL completa da foto
- Requisições ao backend

**Produção:**
```env
NEXT_PUBLIC_API_URL=https://api.skillfix.com
```

---

## ✅ Checklist de Funcionalidades

- [x] Upload de foto durante cadastro
- [x] Preview de foto no formulário
- [x] Validação de formato (frontend)
- [x] Validação de tamanho (frontend)
- [x] Exibição de foto na página de detalhes
- [x] Upload de foto em técnico existente
- [x] Remoção de foto
- [x] Fallback para iniciais
- [x] Loading states
- [x] Tratamento de erros
- [x] Tipo Tecnico atualizado com campo photo
- [x] Service method createWithPhoto
- [x] Documentação completa

---

## 🧪 Como Testar

### 1. Cadastrar Técnico com Foto

1. Acesse `/cadastro`
2. Preencha os dados obrigatórios
3. Clique no círculo "Adicionar Foto"
4. Selecione uma imagem (JPG, PNG, etc)
5. Verifique se preview aparece
6. Clique em "Cadastrar Colaborador"
7. Vá para `/tecnicos`
8. Clique no técnico criado
9. Verifique se a foto aparece

### 2. Atualizar Foto de Técnico Existente

1. Acesse `/tecnicos/[id]` de um técnico
2. Passe o mouse sobre o avatar
3. Clique no botão de câmera
4. Selecione nova foto
5. Aguarde upload (spinner aparece)
6. Verifique se nova foto é exibida

### 3. Remover Foto

1. Acesse `/tecnicos/[id]` de um técnico com foto
2. Passe o mouse sobre o avatar
3. Clique no botão de lixeira
4. Aguarde remoção
5. Verifique se avatar volta a exibir iniciais

### 4. Testar Validações

**Formato inválido:**
1. Tente fazer upload de arquivo .txt ou .pdf
2. Deve exibir erro: "Formato de imagem inválido..."

**Tamanho excedido:**
1. Tente fazer upload de imagem > 5MB
2. Deve exibir erro: "Imagem muito grande..."

---

## 🐛 Troubleshooting

### Foto não aparece na página de detalhes

**Verificar:**
1. Campo `photo` está no response do backend?
2. URL da foto está sendo construída corretamente?
3. Backend está servindo arquivos estáticos em `/uploads`?
4. CORS está configurado no backend?

**Solução:**
```typescript
console.log('Foto do técnico:', tecnico.photo)
console.log('URL construída:', getPhotoURL(tecnico.photo))
```

### Erro de CORS ao fazer upload

**Causa:** Backend não aceita requisições do frontend

**Solução:** Verificar configuração de CORS no backend (`main.ts`)

### Imagem não carrega (erro 404)

**Causa:** Arquivo não existe ou caminho incorreto

**Verificar:**
1. Arquivo existe em `backend/uploads/photos/`?
2. Nome do arquivo corresponde ao UUID do técnico?
3. Backend está servindo arquivos estáticos?

**Teste direto:**
```
http://localhost:3000/uploads/photos/[uuid-do-tecnico].jpg
```

### TypeScript não reconhece campo `photo`

**Causa:** Cache do TypeScript

**Solução:**
1. Feche e abra VSCode
2. Ou rode: `npx tsc --noEmit` para forçar verificação
3. Verifique se `core/types/api.types.ts` tem campo `photo` em Tecnico

---

## 📚 Documentação Relacionada

- `docs/TECNICOS_PHOTO_API.md` - API completa de fotos (backend)
- `docs/TECNICOS_PHOTO_IMPLEMENTATION.md` - Detalhes da implementação backend
- `docs/TECNICOS_PHOTO_TESTING.md` - Scripts de teste

---

## 🚀 Melhorias Futuras (Opcional)

1. **Cropping de imagem:**
   - Adicionar ferramenta de recorte antes do upload
   - Biblioteca sugerida: `react-image-crop`

2. **Compressão de imagem:**
   - Reduzir tamanho do arquivo antes do upload
   - Biblioteca sugerida: `browser-image-compression`

3. **Upload por drag-and-drop:**
   - Arrastar imagem para área de upload
   - Biblioteca sugerida: `react-dropzone`

4. **Foto na listagem:**
   - Adicionar avatar com foto nos cards da listagem `/tecnicos`
   - Melhora identificação visual

5. **Cache de imagens:**
   - Usar Next.js Image component
   - Otimização automática de imagens

---

## ✨ Status

**✅ IMPLEMENTAÇÃO COMPLETA E FUNCIONAL**

- Frontend totalmente integrado com backend
- Upload, exibição e remoção funcionando
- Validações implementadas
- Documentação completa
