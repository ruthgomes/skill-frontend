# Exemplos de Uso - API Routes (Proxies)

⚠️ **ATENÇÃO**: Este arquivo contém apenas exemplos de código para documentação. Os exemplos mostram diferentes contextos (componentes React, funções standalone, etc.) apenas para fins didáticos.

---

## 1. Configuração do Axios

**Arquivo**: `core/services/api-client.ts`

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',  // Aponta para os proxies Next.js
  withCredentials: true,  // Envia cookies automaticamente
})
```

---

## 2. Serviços (Implementados em `core/services/`)

```typescript
class TecnicosService {
  // Listar técnicos
  async findAll(params: any) {
    const response = await apiClient.get('/tecnicos', { params })
    return response.data
  }

  // Buscar técnico por ID
  async findOne(id: string) {
    const response = await apiClient.get(`/tecnicos/${id}`)
    return response.data
  }

  // Criar técnico
  async create(data: any) {
    const response = await apiClient.post('/tecnicos', data)
    return response.data
  }

  // Atualizar técnico
  async update(id: string, data: any) {
    const response = await apiClient.patch(`/tecnicos/${id}`, data)
    return response.data
  }

  // Upload de foto
  async uploadPhoto(id: string, file: File) {
    const formData = new FormData()
    formData.append('photo', file)
    
    const response = await apiClient.post(`/tecnicos/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
```

---

## 3. Uso em Componentes React

```tsx
import { useState, useEffect } from 'react'
import tecnicosService from '@/core/services/tecnicos.service'

function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTecnicos()
  }, [])

  const loadTecnicos = async () => {
    try {
      const data = await tecnicosService.findAll()
      setTecnicos(data)
    } catch (error) {
      console.error('Erro ao carregar técnicos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData: any) => {
    try {
      await tecnicosService.create(formData)
      loadTecnicos() // Recarrega lista
    } catch (error) {
      console.error('Erro ao criar técnico:', error)
    }
  }

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {tecnicos.map(tecnico => (
            <li key={tecnico.id}>{tecnico.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## 4. Autenticação

```typescript
import authService from '@/core/services/auth.service'

async function handleLogin(email: string, password: string) {
  try {
    const response = await authService.login({ email, password })
    // Tokens são gerenciados automaticamente via cookies
    console.log('Login realizado:', response)
    
    // Redirecionar ou atualizar estado
    window.location.href = '/dashboard'
  } catch (error: any) {
    console.error('Erro no login:', error.message)
  }
}

async function handleLogout() {
  try {
    await authService.logout()
    // Cookies são removidos automaticamente
    window.location.href = '/login'
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}

async function getCurrentUser() {
  try {
    const user = await authService.me()
    return user
  } catch (error) {
    // Usuário não autenticado
    return null
  }
}
```

---

## 5. Server Components (Next.js 14+)

```tsx
// Você pode fazer chamadas diretas em Server Components
async function TecnicosServerPage() {
  const response = await fetch('http://localhost:3001/api/tecnicos', {
    cache: 'no-store',
  })
  const tecnicos = await response.json()

  return (
    <div>
      <h1>Técnicos</h1>
      <ul>
        {tecnicos.map((tecnico: any) => (
          <li key={tecnico.id}>{tecnico.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 6. Fetch Direto (Alternativa ao Axios)

```typescript

async function fetchTecnicos() {
  const response = await fetch('/api/tecnicos', {
    method: 'GET',
    credentials: 'include',  // Envia cookies
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar técnicos')
  }

  return await response.json()
}

async function createTecnico(data: any) {
  const response = await fetch('/api/tecnicos', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar técnico')
  }

  return await response.json()
}
```

---

## 7. Upload de Arquivos

```typescript
async function uploadTecnicoPhoto(id: string, file: File) {
  const formData = new FormData()
  formData.append('photo', file)

  const response = await fetch(`/api/tecnicos/${id}/photo`, {
    method: 'POST',
    credentials: 'include',
    body: formData,  // Não definir Content-Type, o browser faz automaticamente
  })

  if (!response.ok) {
    throw new Error('Erro ao fazer upload da foto')
  }

  return await response.json()
}
```

---

## 8. Filtros e Query Params

```typescript
async function searchTecnicos(filters: any) {
  const params = new URLSearchParams()
  
  if (filters.name) params.append('name', filters.name)
  if (filters.teamId) params.append('teamId', filters.teamId)
  if (filters.active !== undefined) params.append('active', filters.active)
  
  const response = await apiClient.get(`/tecnicos?${params.toString()}`)
  return response.data
}

// Ou usando axios params:
async function searchTecnicosAxios(filters: any) {
  const response = await apiClient.get('/tecnicos', {
    params: filters  // Axios converte automaticamente
  })
  return response.data
}
```

---

## 9. Tratamento de Erros

```typescript
async function handleApiCall() {
  try {
    const data = await tecnicosService.findAll()
    return data
  } catch (error: any) {
    if (error.response) {
      // Erro da API
      console.error('Status:', error.response.status)
      console.error('Mensagem:', error.response.data.message)
      
      if (error.response.status === 401) {
        // Não autenticado
        window.location.href = '/login'
      } else if (error.response.status === 403) {
        // Sem permissão
        alert('Você não tem permissão para esta ação')
      } else if (error.response.status === 404) {
        // Não encontrado
        alert('Recurso não encontrado')
      } else {
        // Erro genérico
        alert('Erro ao processar requisição')
      }
    } else if (error.request) {
      // Sem resposta do servidor
      console.error('Sem resposta do servidor')
      alert('Erro de conexão. Verifique sua internet.')
    } else {
      // Outro erro
      console.error('Erro:', error.message)
    }
  }
}
```

---

## Resumo dos Recursos

✅ **Autenticação automática** via cookies  
✅ **Renovação de tokens** transparente  
✅ **Tratamento de erros** padronizado  
✅ **Upload de arquivos** simplificado  
✅ **Query params** flexíveis  
✅ **TypeScript** suportado  
✅ **Server Components** compatível  

---

Para mais detalhes, consulte:
- [README da API](./README.md)
- [Guia de Migração](../../docs/API_PROXY_MIGRATION.md)

