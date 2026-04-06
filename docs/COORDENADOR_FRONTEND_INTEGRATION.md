# 👔 Sistema de Coordenador - Documentação de Integração Frontend

## 📋 Visão Geral

Este documento descreve como integrar o sistema de Coordenadores no frontend. O sistema implementa uma nova role que permite que coordenadores gerenciem técnicos dos seus sub-times específicos.

**⭐ Importante:** Um coordenador pode liderar **múltiplos sub-times** que podem estar em **times diferentes**.

---

## 🎯 Hierarquia de Acessos

```
┌─────────────────────────────────────────────────────────┐
│ ADMIN (MASTER)                                          │
│ ✅ Acesso total ao sistema                             │
└─────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ SUPERVISOR                                              │
│ ✅ Gerencia times/sub-times que criou                  │
│ ✅ Gerencia técnicos do seu time                       │
└─────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ COORDENADOR                                             │
│ ✅ Pode liderar MÚLTIPLOS sub-times                    │
│ ✅ Visualiza/edita técnicos dos SUB-TIMES que lidera   │
│ ❌ NÃO cria/deleta técnicos                            │
│ ❌ NÃO gerencia times/sub-times                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Novas Roles de Usuário

### Enum UserRole

```typescript
enum UserRole {
  MASTER = 'master',
  SUPERVISOR = 'supervisor',
  COORDENADOR = 'coordenador',
}
```

### Objeto User Atualizado

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'supervisor' | 'coordenador'; // ⭐ NOVO: role coordenador
  tecnicoId?: string; // UUID do técnico vinculado (se supervisor/coordenador)
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 👤 Objeto Técnico Atualizado

```typescript
interface SubTeam {
  id: string;
  name: string;
  teamId: string;
  // ... outros campos
}

interface Tecnico {
  id: string;
  name: string;
  workday: string;
  cargo: string;
  senioridade: 'Auxiliar' | 'Junior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenador' | 'Supervisor';
  area: string;
  shift: '1T' | '2T' | '3T' | 'ADM';
  department: string;
  gender: 'M' | 'F' | 'O';
  photo?: string;
  joinDate: string;
  email?: string;
  hasUserAccount: boolean;
  status: boolean;
  teamId?: string;
  subtimeId?: string;
  ledSubtimes?: SubTeam[]; // ⭐ NOVO: Array de sub-times que o coordenador lidera
  createdById?: string;
  // ... relações
}
```

---

## 🆕 Criando Coordenador

### POST `/api/v1/tecnicos`

Supervisores e Admins podem criar coordenadores.

#### Request Body

```typescript
{
  "name": "Maria Coordenadora",
  "workday": "WDC00100",
  "cargo": "Coordenadora de Manutenção",
  "senioridade": "Coordenador", // ⭐ Senioridade = Coordenador
  "area": "Manutenção",
  "shift": "1T",
  "department": "Manutenção Elétrica",
  "gender": "F",
  "joinDate": "2024-01-15",
  "teamId": "uuid-do-time",
  "subtimeId": "uuid-do-subtime", // Sub-time ao qual o coordenador pertence
  "ledSubtimeIds": [ // ⭐ OBRIGATÓRIO: Array de sub-times que o coordenador irá liderar
    "uuid-subtime-a",
    "uuid-subtime-b",
    "uuid-subtime-c"
  ],
  "email": "maria.coordenadora@empresa.com", // ⭐ OBRIGATÓRIO para coordenadores
  "password": "SenhaSegura@123", // ⭐ OBRIGATÓRIO para coordenadores
  "skills": [
    {
      "skillId": "uuid-skill-1",
      "score": 85.5,
      "notes": "Liderança de equipe"
    }
  ]
}
```

#### ⚠️ Validações Importantes

1. **Email e Senha são obrigatórios** quando `senioridade = "Coordenador"`
2. **ledSubtimeIds é obrigatório** quando `senioridade = "Coordenador"` (deve ter ao menos 1 sub-time)
3. Email deve ser único no sistema
4. Senha deve ter no mínimo 8 caracteres
5. Todos os IDs em ledSubtimeIds devem existir no banco de dados

#### Response (201 Created)

```json
{
  "id": "uuid-coordenador",
  "name": "Maria Coordenadora",
  "workday": "WDC00100",
  "senioridade": "Coordenador",
  "email": "maria.coordenadora@empresa.com",
  "hasUserAccount": true,
  "ledSubtimes": [
    {
      "id": "uuid-subtime-a",
      "name": "Sub-time A",
      "teamId": "uuid-do-time-1"
    },
    {
      "id": "uuid-subtime-b",
      "name": "Sub-time B",
      "teamId": "uuid-do-time-1"
    },
    {
      "id": "uuid-subtime-c",
      "name": "Sub-time C",
      "teamId": "uuid-do-time-2"
    }
  ],
  // ... outros campos
}
```

#### Exemplo JavaScript

```javascript
async function criarCoordenador(data) {
  const response = await fetch('http://localhost:3000/api/v1/tecnicos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: data.name,
      workday: data.workday,
      cargo: data.cargo,
      senioridade: 'Coordenador',
      area: data.area,
      shift: data.shift,
      department: data.department,
      gender: data.gender,
      joinDate: data.joinDate,
      teamId: data.teamId,
      subtimeId: data.subtimeId,
      ledSubtimeId: data.ledSubtimeId, // ⭐ ID do sub-time que irá liderar
      email: data.email,
      password: data.password
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
```

---

## 🔑 Login do Coordenador

O coordenador faz login usando **email e senha** cadastrados.

### POST `/api/v1/auth/login`

```typescript
{
  "email": "maria.coordenadora@empresa.com",
  "password": "SenhaSegura@123"
}
```

### Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user",
    "email": "maria.coordenadora@empresa.com",
    "name": "Maria Coordenadora",
    "role": "coordenador", // ⭐ Role do usuário
    "tecnicoId": "uuid-coordenador",
    "isActive": true
  }
}
```

### Decodificando o JWT

O token JWT contém:

```json
{
  "sub": "uuid-user",
  "email": "maria.coordenadora@empresa.com",
  "role": "coordenador",
  "tecnicoId": "uuid-coordenador",
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## 📊 Listar Técnicos (com filtro automático)

### GET `/api/v1/tecnicos`

O backend **filtra automaticamente** baseado no role:

- **Admin**: vê todos os técnicos
- **Supervisor**: vê apenas técnicos que criou
- **Coordenador**: vê apenas técnicos do sub-time que lidera

#### Request

```http
GET /api/v1/tecnicos?page=1&limit=10
Authorization: Bearer {token}
```

#### Response para Coordenador

```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "João Técnico",
      "workday": "WDC00001",
      "subtimeId": "uuid-subtime-a", // Mesmo sub-time do coordenador
      "subtime": {
        "id": "uuid-subtime-a",
        "name": "Sub-time A"
      }
    },
    {
      "id": "uuid-2",
      "name": "Pedro Técnico",
      "subtimeId": "uuid-subtime-a",
      "subtime": {
        "id": "uuid-subtime-a",
        "name": "Sub-time A"
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

🔒 **Coordenador NÃO verá técnicos de outros sub-times automaticamente**.

---

## ✏️ Editar Técnico (Coordenador)

### PATCH `/api/v1/tecnicos/:id`

Coordenadores **podem editar** técnicos do seu sub-time.

#### Permissões:
- ✅ Atualizar cargo, departamento, turno
- ✅ Atualizar skills e scores
- ✅ Upload/remover fotos
- ❌ NÃO pode alterar `workday` (matrícula) se há avaliações
- ❌ NÃO pode mover técnico para outro time/sub-time
- ❌ NÃO pode alterar senioridade para "Supervisor"

#### Request

```typescript
PATCH /api/v1/tecnicos/uuid-tecnico
Authorization: Bearer {coordenador-token}

{
  "cargo": "Técnico Sênior de Manutenção",
  "shift": "2T",
  "department": "Manutenção Preventiva"
}
```

#### Response (200 OK)

```json
{
  "id": "uuid-tecnico",
  "name": "João Técnico",
  "cargo": "Técnico Sênior de Manutenção",
  "shift": "2T",
  "department": "Manutenção Preventiva",
  // ... outros campos atualizados
}
```

#### Response de Erro (403 Forbidden)

Se coordenador tentar editar técnico de outro sub-time:

```json
{
  "statusCode": 403,
  "message": "Você só pode acessar técnicos do seu sub-time",
  "error": "Forbidden"
}
```

---

## 📸 Upload de Foto (Coordenador)

### POST `/api/v1/tecnicos/:id/photo`

```javascript
async function uploadFoto(tecnicoId, file) {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(
    `http://localhost:3000/api/v1/tecnicos/${tecnicoId}/photo`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${coordenadorToken}`
      },
      body: formData
    }
  );

  return await response.json();
}
```

🔒 **Só funciona se o técnico pertencer ao sub-time do coordenador**.

---

## 🗑️ Remover Foto (Coordenador)

### DELETE `/api/v1/tecnicos/:id/photo`

```javascript
async function removerFoto(tecnicoId) {
  const response = await fetch(
    `http://localhost:3000/api/v1/tecnicos/${tecnicoId}/photo`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${coordenadorToken}`
      }
    }
  );

  return await response.json();
}
```

---

## 🎯 Atualizar Skills (Coordenador)

### PATCH `/api/v1/tecnicos/:id/skills/:skillId`

Coordenadores podem atualizar pontuações de skills dos técnicos do seu sub-time.

#### Request

```typescript
PATCH /api/v1/tecnicos/uuid-tecnico/skills/uuid-skill
Authorization: Bearer {coordenador-token}

{
  "score": 92.5,
  "notes": "Melhorou muito após treinamento de NR-10"
}
```

#### Response (200 OK)

```json
{
  "id": "uuid-skill-tecnico",
  "tecnicoId": "uuid-tecnico",
  "skillId": "uuid-skill",
  "score": 92.5,
  "notes": "Melhorou muito após treinamento de NR-10",
  "skill": {
    "id": "uuid-skill",
    "name": "Manutenção Elétrica"
  }
}
```

---

## 🚫 Desativar Técnico (Soft Delete)

### DELETE `/api/v1/tecnicos/:id`

Coordenadores podem **desativar** técnicos (soft delete), mas **não deletar permanentemente**.

#### Request

```http
DELETE /api/v1/tecnicos/uuid-tecnico
Authorization: Bearer {coordenador-token}
```

#### Response (200 OK)

```json
{
  "message": "Técnico desativado com sucesso"
}
```

O técnico terá `status = false` mas não será deletado do banco.

---

## 🎨 Interface Frontend - Diretrizes

### 1. Detectar Role no Login

Após login, redirecionar baseado no `user.role`:

```typescript
function redirecionarAposLogin(user: User) {
  switch (user.role) {
    case 'master':
      navigate('/admin/dashboard');
      break;
    case 'supervisor':
      navigate('/supervisor/dashboard');
      break;
    case 'coordenador':
      navigate('/coordenador/dashboard');
      break;
    default:
      navigate('/login');
  }
}
```

### 2. Menu Específico para Coordenador

```typescript
const menuCoordenador = [
  { label: 'Meu Sub-Time', path: '/coordenador/tecnicos', icon: 'people' },
  { label: 'Minhas Avaliações', path: '/coordenador/avaliacoes', icon: 'star' },
  { label: 'Notas Trimestrais', path: '/coordenador/notas', icon: 'analytics' },
  { label: 'Dashboard', path: '/coordenador/dashboard', icon: 'chart' },
];
```

### 3. Formulário de Cadastro de Coordenador

```tsx
import React, { useState } from 'react';

const CriarCoordenadorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    workday: '',
    cargo: 'Coordenador de Manutenção',
    senioridade: 'Coordenador', // Fixo
    area: 'Manutenção',
    shift: '1T',
    department: '',
    gender: 'M',
    joinDate: '',
    teamId: '',
    subtimeId: '',
    ledSubtimeId: '', // ⭐ Campo específico para coordenador
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.email || !formData.password) {
      alert('E-mail e senha são obrigatórios para coordenadores');
      return;
    }

    if (!formData.ledSubtimeId) {
      alert('Selecione o sub-time que o coordenador irá liderar');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/tecnicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const coordenador = await response.json();
        alert(`Coordenador ${coordenador.name} criado com sucesso!`);
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao criar coordenador:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Coordenador</h2>
      
      {/* Informações Básicas */}
      <input
        type="text"
        placeholder="Nome Completo"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <input
        type="text"
        placeholder="Matrícula (workday)"
        value={formData.workday}
        onChange={(e) => setFormData({ ...formData, workday: e.target.value })}
        required
      />

      {/* Credenciais */}
      <input
        type="email"
        placeholder="E-mail (para login)"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Senha (mínimo 8 caracteres)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        minLength={8}
      />

      {/* Vínculo organizacional */}
      <select
        value={formData.teamId}
        onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
        required
      >
        <option value="">Selecione o Time</option>
        {/* Listar times disponíveis */}
      </select>

      <select
        value={formData.ledSubtimeId}
        onChange={(e) => setFormData({ ...formData, ledSubtimeId: e.target.value, subtimeId: e.target.value })}
        required
      >
        <option value="">Selecione o Sub-Time que irá liderar</option>
        {/* Listar sub-times do time selecionado */}
      </select>

      <button type="submit">Criar Coordenador</button>
    </form>
  );
};

export default CriarCoordenadorForm;
```

### 4. Tela de Listagem (Coordenador)

```tsx
import React, { useEffect, useState } from 'react';

const TecnicosListCoordenador = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Buscar técnicos (já vem filtrado pelo backend)
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/tecnicos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setTecnicos(data.data); // Backend já filtrou por sub-time
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
    }
  };

  return (
    <div className="tecnicos-container">
      <h1>Meu Sub-Time</h1>
      <p>Você gerencia {tecnicos.length} técnicos</p>

      <div className="tecnicos-grid">
        {tecnicos.map((tecnico) => (
          <div key={tecnico.id} className="tecnico-card">
            <img
              src={tecnico.photo ? `http://localhost:3000/${tecnico.photo}` : '/avatar-default.png'}
              alt={tecnico.name}
            />
            <h3>{tecnico.name}</h3>
            <p>{tecnico.cargo}</p>
            <p>Turno: {tecnico.shift}</p>
            
            <button onClick={() => editarTecnico(tecnico.id)}>
              Editar
            </button>
            <button onClick={() => avaliarTecnico(tecnico.id)}>
              Avaliar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. Controle de Permissões na UI

```typescript
// Hook para verificar permissões
function usePermissions() {
  const user = useAuthUser();

  return {
    canCreateTecnico: user?.role === 'master' || user?.role === 'supervisor',
    canEditTecnico: user?.role !== null,
    canDeleteTecnico: user?.role === 'master' || user?.role === 'supervisor',
    canManageTeams: user?.role === 'master' || user?.role === 'supervisor',
    canCreateEvaluation: user?.role !== null,
    canApproveEvaluation: user?.role === 'master' || user?.role === 'supervisor',
    isCoordenador: user?.role === 'coordenador',
    isSupervisor: user?.role === 'supervisor',
    isAdmin: user?.role === 'master',
  };
}

// Uso no componente
const TecnicoActions = ({ tecnico }) => {
  const { canCreateTecnico, canDeleteTecnico, isCoordenador } = usePermissions();

  return (
    <div>
      {canCreateTecnico && (
        <button>Criar Técnico</button>
      )}
      
      {/* Coordenadores só podem editar, não deletar */}
      {isCoordenador ? (
        <button>Editar</button>
      ) : canDeleteTecnico && (
        <>
          <button>Editar</button>
          <button>Deletar</button>
        </>
      )}
    </div>
  );
};
```

---

## 📊 Matriz de Permissões Detalhada

| Ação | Endpoint | Admin | Supervisor | Coordenador |
|------|----------|-------|------------|-------------|
| **Criar técnico** | `POST /tecnicos` | ✅ Todos | ✅ Seus | ❌ |
| **Listar técnicos** | `GET /tecnicos` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Visualizar técnico** | `GET /tecnicos/:id` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Editar técnico** | `PATCH /tecnicos/:id` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Desativar técnico** | `DELETE /tecnicos/:id` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Upload foto** | `POST /tecnicos/:id/photo` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Remover foto** | `DELETE /tecnicos/:id/photo` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Atualizar skills** | `PATCH /tecnicos/:id/skills/:skillId` | ✅ Todos | ✅ Criados | ✅ Sub-time |
| **Criar avaliação** | `POST /avaliacoes` | ✅ Todos | ✅ Seu time | ✅ Sub-time |
| **Aprovar avaliação** | `PATCH /avaliacoes/:id/approve` | ✅ Todos | ✅ Do time | ❌ |
| **Criar nota trimestral** | `POST /quarterly-notes` | ✅ Todos | ✅ Seu time | ✅ Sub-time |

---

## 🔍 Casos de Uso Práticos

### Caso 1: Supervisor cria Coordenador

```
1. Supervisor faz login
2. Acessa página "Criar Coordenador"
3. Preenche formulário:
   - Nome: "Maria Coordenadora"
   - Email: "maria@empresa.com"
   - Senha: "Senha@123"
   - Sub-time que irá liderar: "Sub-time A"
4. Sistema cria:
   - Técnico com senioridade "Coordenador"
   - Usuário com role "coordenador"
   - Vínculo ledSubtimeId → uuid-do-subtime-a
5. Maria recebe e-mail com credenciais
```

### Caso 2: Coordenador faz login pela primeira vez

```
1. Maria acessa sistema
2. Faz login com maria@empresa.com
3. Sistema retorna token com role: "coordenador"
4. Frontend redireciona para /coordenador/dashboard
5. Dashboard exibe:
   - Lista de técnicos do Sub-time A
   - Botões: Editar, Avaliar, Upload Foto
   - Analytics do sub-time
```

### Caso 3: Coordenador tenta acessar técnico de outro sub-time

```
1. Maria tenta editar técnico do "Sub-time B"
2. Backend valida: tecnico.subtimeId !== maria.ledSubtimeId
3. Retorna 403 Forbidden
4. Frontend exibe: "Você só pode editar técnicos do seu sub-time"
5. Maria é redirecionada para sua lista de técnicos
```

---

## 🧪 Testes Frontend

### Teste 1: Validar criação de coordenador

```javascript
test('Deve criar coordenador com ledSubtimeId', async () => {
  const response = await api.post('/tecnicos', {
    name: 'Coordenador Teste',
    senioridade: 'Coordenador',
    ledSubtimeId: 'uuid-subtime',
    email: 'coordenador@test.com',
    password: 'Senha@123',
    // ... outros campos
  });

  expect(response.status).toBe(201);
  expect(response.data.ledSubtimeId).toBe('uuid-subtime');
  expect(response.data.hasUserAccount).toBe(true);
});
```

### Teste 2: Validar filtro automático de técnicos

```javascript
test('Coordenador deve ver apenas técnicos do seu sub-time', async () => {
  // Login como coordenador
  const { token } = await api.post('/auth/login', {
    email: 'coordenador@test.com',
    password: 'Senha@123',
  });

  // Listar técnicos
  const response = await api.get('/tecnicos', {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Verificar que todos possuem o mesmo subtimeId
  const subtimeIds = new Set(response.data.data.map(t => t.subtimeId));
  expect(subtimeIds.size).toBe(1);
});
```

### Teste 3: Validar bloqueio de acesso a outros sub-times

```javascript
test('Coordenador não pode editar técnico de outro sub-time', async () => {
  const { token } = await loginAsCoordenador();
  
  const tecnicoOutroSubtime = 'uuid-tecnico-outro-subtime';
  
  const response = await api.patch(`/tecnicos/${tecnicoOutroSubtime}`, {
    cargo: 'Novo Cargo',
  }, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true, // Aceitar 403
  });

  expect(response.status).toBe(403);
  expect(response.data.message).toContain('sub-time');
});
```

---

## 📝 Checklist de Implementação Frontend

### Fase 1: Autenticação
- [ ] Atualizar interface `User` com role `coordenador`
- [ ] Decodificar JWT e extrair role  
- [ ] Implementar redirecionamento baseado em role
- [ ] Criar rotas protegidas para coordenador

### Fase 2: Formulários
- [ ] Atualizar formulário de criar técnico
- [ ] Adicionar campo `ledSubtimeId` (visível apenas quando senioridade = Coordenador)
- [ ] Validar email/senha obrigatórios para Coordenador
- [ ] Adicionar dropdown de sub-times

### Fase 3: Listagens e Filtros
- [ ] Criar página de listagem para coordenador
- [ ] Remover filtros manuais (backend já filtra)
- [ ] Exibir mensagem se lista vazia
- [ ] Adicionar badge indicando sub-time do coordenador

### Fase 4: Edição e Permissões
- [ ] Implementar hook `usePermissions`
- [ ] Condicionar botões baseado em permissões
- [ ] Ocultar "Criar Técnico" para coordenadores
- [ ] Exibir mensagens de erro 403 de forma amigável

### Fase 5: Dashboard
- [ ] Criar dashboard específico para coordenador
- [ ] Exibir KPIs do sub-time
- [ ] Listar avaliações pendentes
- [ ] Gráfico de evolução de skills

### Fase 6: Testes
- [ ] Testar login como coordenador
- [ ] Testar criação de coordenador
- [ ] Testar filtro automático de técnicos
- [ ] Testar bloqueio de acesso a outros sub-times
- [ ] Testar upload/remoção de fotos

---

## 🎯 Conclusão

Este sistema permite que coordenadores tenham **autonomia** para gerenciar técnicos do seu sub-time, sem comprometer a **segurança** e **isolamento de dados**.

### Principais Benefícios:
✅ Descentralização da gestão  
✅ Rastreabilidade total (quem fez o quê)  
✅ Workflow estruturado  
✅ Escalabilidade  

### Próximos Passos:
1. Implementar sistema de avaliações para coordenadores
2. Criar dashboard analytics para sub-times
3. Adicionar notificações para coordenadores
4. Implementar sistema de metas por sub-time

---

## 📞 Suporte

Para dúvidas ou problemas na integração, consulte:
- Documentação completa: `/docs/COORDENADOR_ACCESS_IDEAS.md`
- Swagger API: `http://localhost:3000/api`
- Repositório: Marcelojr29/SkillFix-Backend
