# 🤖 PROMPT PARA DESENVOLVER O BACKEND

> **Instruções:** Copie todo o conteúdo abaixo e cole em uma nova conversa com o Claude no projeto do backend.

---

## 📋 PROMPT COMPLETO

Olá! Preciso que você desenvolva um backend completo em **NestJS** seguindo uma documentação detalhada que eu tenho.

### 🎯 Contexto do Projeto

Estou desenvolvendo o **SkillFix**, um sistema de gestão de colaboradores técnicos, avaliações e competências para ambientes industriais. O frontend já está pronto em Next.js 15, e agora preciso do backend completo.

### 📚 Documentação Disponível

Eu tenho uma documentação completa com **11 arquivos** que especificam EXATAMENTE como deve ser implementado cada módulo. Vou compartilhar cada arquivo com você:

#### 1. **README.md** - Visão Geral do Projeto
```
[Cole aqui o conteúdo completo de docs/README.md]
```

#### 2. **AUTH_API.md** - Sistema de Autenticação JWT
```
[Cole aqui o conteúdo completo de docs/AUTH_API.md]
```

#### 3. **USERS_API.md** - Gerenciamento de Usuários
```
[Cole aqui o conteúdo completo de docs/USERS_API.md]
```

#### 4. **TECNICOS_API.md** - CRUD de Técnicos/Colaboradores
```
[Cole aqui o conteúdo completo de docs/TECNICOS_API.md]
```

#### 5. **TEAMS_API.md** - Gestão de Times
```
[Cole aqui o conteúdo completo de docs/TEAMS_API.md]
```

#### 6. **SUBTIMES_API.md** - Gestão de Sub-times
```
[Cole aqui o conteúdo completo de docs/SUBTIMES_API.md]
```

#### 7. **MACHINES_API.md** - Cadastro de Máquinas
```
[Cole aqui o conteúdo completo de docs/MACHINES_API.md]
```

#### 8. **SKILLS_API.md** - Competências Técnicas
```
[Cole aqui o conteúdo completo de docs/SKILLS_API.md]
```

#### 9. **AVALIACOES_API.md** - Sistema de Avaliações
```
[Cole aqui o conteúdo completo de docs/AVALIACOES_API.md]
```

#### 10. **QUARTERLY_NOTES_API.md** - Notas Trimestrais
```
[Cole aqui o conteúdo completo de docs/QUARTERLY_NOTES_API.md]
```

#### 11. **ANALYTICS_API.md** - Dashboards e Relatórios
```
[Cole aqui o conteúdo completo de docs/ANALYTICS_API.md]
```

---

### 🛠️ O QUE PRECISO QUE VOCÊ FAÇA

1. **Criar a estrutura completa do projeto NestJS** seguindo as boas práticas
2. **Implementar TODOS os módulos** conforme especificado na documentação
3. **Criar todas as entidades TypeORM** exatamente como estão nos arquivos
4. **Implementar todos os DTOs** com as validações do class-validator
5. **Criar todos os controllers** com decorators do Swagger
6. **Implementar todos os services** com a lógica de negócio
7. **Criar todas as migrations** para o banco PostgreSQL
8. **Configurar autenticação JWT** com guards e decorators
9. **Configurar Docker** (Dockerfile e docker-compose.yml)
10. **Criar arquivo .env.example** com todas as variáveis
11. **Implementar todos os relacionamentos** entre entidades (foreign keys, cascades)
12. **Adicionar validações** em todos os endpoints
13. **Configurar Swagger** para documentação automática
14. **Implementar upload de arquivos** (fotos dos técnicos)

### 📦 Stack Tecnológica OBRIGATÓRIA

- **NestJS 10.x** (framework backend)
- **TypeORM 0.3.x** (ORM - OBRIGATÓRIO)
- **PostgreSQL 15+** (banco de dados)
- **JWT** (autenticação com passport-jwt)
- **bcrypt** (hash de senhas)
- **class-validator** e **class-transformer** (validação)
- **@nestjs/swagger** (documentação API)
- **Docker** (containerização)
- **Multer** (upload de arquivos)
- **Helmet** (segurança)
- **CORS** (cross-origin)

### 📁 Estrutura de Pastas Esperada

```
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── database.config.ts
│   └── jwt.config.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   ├── tecnicos/
│   │   ├── tecnicos.module.ts
│   │   ├── tecnicos.controller.ts
│   │   ├── tecnicos.service.ts
│   │   ├── entities/
│   │   │   ├── tecnico.entity.ts
│   │   │   └── tecnico-skill.entity.ts
│   │   └── dto/
│   ├── teams/
│   ├── subtimes/
│   ├── machines/
│   ├── skills/
│   ├── evaluations/
│   ├── quarterly-notes/
│   └── analytics/
├── migrations/
└── common/
    ├── filters/
    ├── interceptors/
    └── pipes/
```

### ✅ REQUISITOS IMPORTANTES

1. **Siga EXATAMENTE** as entidades, DTOs, controllers e services da documentação
2. **Todos os enums** devem ser implementados como estão especificados
3. **Todos os relacionamentos** (OneToMany, ManyToOne, ManyToMany) devem funcionar
4. **Validações** com class-validator em TODOS os DTOs
5. **Guards JWT** em todos os endpoints (exceto login)
6. **RolesGuard** para diferenciar Master e Supervisor
7. **Swagger** configurado e funcionando em `/api/docs`
8. **Migrations** funcionais para criar todo o banco
9. **Docker Compose** com PostgreSQL e Redis
10. **Testes** não são necessários neste momento

### 🎯 ORDEM DE IMPLEMENTAÇÃO SUGERIDA

1. Setup inicial do projeto NestJS
2. Configuração TypeORM + PostgreSQL
3. Módulo Auth (base para tudo)
4. Módulo Users
5. Módulo Teams
6. Módulo SubTimes
7. Módulo Machines
8. Módulo Skills
9. Módulo Tecnicos (depende de Teams, SubTimes, Skills)
10. Módulo QuarterlyNotes
11. Módulo Evaluations
12. Módulo Analytics

### 🚀 COMEÇE AGORA

Por favor, comece criando a estrutura base do projeto e vá implementando módulo por módulo. Me avise quando concluir cada etapa e tire qualquer dúvida sobre a documentação.

**IMPORTANTE:** A documentação está 100% completa e precisa. Siga ela à risca! Cada entidade, DTO, controller e service já está especificado com código pronto para implementar.

Vamos começar?

---

## 📝 NOTAS ADICIONAIS

- Use **UUID** para todos os IDs
- Use **timestamps** (createdAt, updatedAt) em todas as entidades
- Use **soft delete** quando especificado (campo `status` boolean)
- Use **bcrypt** com 10 salt rounds para senhas
- JWT access token: **7 dias**
- JWT refresh token: **30 dias**
- Paginação padrão: **page=1, limit=20**
- Upload de fotos: salvar no filesystem em `uploads/photos/`
- CORS: permitir origem do frontend Next.js
- Swagger em: `http://localhost:3000/api/docs`
