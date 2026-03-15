# Resumo das Atualizações da Documentação do Back-End SkillFix

**Data**: 10 de março de 2026
**Versão**: 2.0

## 📋 Atualizações Realizadas

### 1. ✅ BACKEND.md - Arquivo Principal
**Arquivo**: [BACKEND.md](BACKEND.md)

**Mudanças**:
- ✅ Atualizado nome do sistema de "SisOp" para "SkillFix"
- ✅ Adicionado campo de última atualização e versão
- ✅ Corrigidos ENUMS do Prisma Schema:
  - `UserRole`: Removido SUPERVISOR, mantido apenas MASTER e TECNICO
  - Adicionado `Senioridade`: AUXILIAR, JUNIOR, PLENO, SENIOR, ESPECIALISTA, COORDENADOR, SUPERVISOR
  - Adicionado `Area`: PRODUCAO, MANUTENCAO, QUALIDADE, ENGENHARIA, LOGISTICA, ADMINISTRATIVA, OUTRO
  - Adicionado `Gender`: M, F
- ✅ Atualizado modelo `User`:
  - Adicionados relacionamentos `supervisedTeams` e `coordinatedSubTeams`
- ✅ Atualizado modelo `Machine`:
  - Adicionados campos `teamId` e `subTeamId`
  - Removido relacionamento direto com `Tecnico`
- ✅ Atualizado modelo `Skill`:
  - Adicionados campos `teamId` e `subTeamId`
  - Chave única alterada para incluir `subTeamId`
- ✅ Atualizado modelo `Tecnico`:
  - Adicionados campos: `senioridade`, `department`, `gender`, `photo`
  - Alterado `area` de string para enum
  - Adicionado relacionamento com SubTeam
  - Removido campo `machineId`
- ✅ Atualizado modelo `Team`:
  - Campo `managerId` renomeado para `supervisorId`
  - Adicionados relacionamentos `machines` e `skills`
  - Adicionado valor padrão para `color`
- ✅ Atualizado modelo `SubTeam`:
  - Campo `leaderId` renomeado para `coordenadorId`
  - Adicionados relacionamentos `machines`, `skills`, `tecnicos`
- ✅ Atualizada lista de documentações de API:
  - Adicionado link para [SUBTIMES_API.md](docs/SUBTIMES_API.md)

### 2. ✅ docs/AUTH_API.md - Autenticação
**Arquivo**: [docs/AUTH_API.md](docs/AUTH_API.md)

**Mudanças**:
- ✅ Atualizado nome do sistema para "SkillFix"
- ✅ Removida role SUPERVISOR, mantidas apenas MASTER e TECNICO
- ✅ Adicionada nota sobre senioridade vs role
- ✅ Atualizada estrutura do usuário:
  - Explicação sobre relacionamento 1:1 com Tecnico
- ✅ Atualizados exemplos de response:
  - Response separado para MASTER e TECNICO
  - Incluídos novos campos (senioridade, area, gender, photo, subTeam)
  - Removida estrutura de `permissions` detalhada
- ✅ Atualizada seção de registro:
  - Nota sobre uso preferencial de `/api/tecnicos` para criar TECNICOs

### 3. ✅ docs/TECNICOS_API.md - Técnicos/Colaboradores
**Arquivo**: [docs/TECNICOS_API.md](docs/TECNICOS_API.md)

**Mudanças**:
- ✅ Atualizado título para "Técnicos/Colaboradores"
- ✅ Adicionada nota sobre supervisores e coordenadores
- ✅ Atualizada estrutura do Técnico:
  - Adicionados campos: `senioridade`, `department`, `gender`, `photo`, `subTeamId`
  - Campo `area` alterado para enum
  - Removido campo `machineId`
  - Adicionados relacionamentos completos
- ✅ Atualizado endpoint de criação:
  - Nota sobre criação simultânea de User e Tecnico
  - Inclusão de todos os novos campos obrigatórios
  - Documentação completa de enums
  - Exemplo com foto em base64
- ✅ Atualizado endpoint de listagem:
  - Novos filtros: `senioridade`, `subTeamId`, `gender`
  - Removido filtro `machineId`
  - Busca apenas por nome ou workday

### 4. ✅ docs/SUBTIMES_API.md - Sub-Times (NOVO)
**Arquivo**: [docs/SUBTIMES_API.md](docs/SUBTIMES_API.md)

**Conteúdo**:
- ✅ Documentação completa de Sub-Times
- ✅ Estrutura do Sub-Time
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Gerenciamento de membros (Adicionar, Remover, Listar)
- ✅ Endpoint de estatísticas
- ✅ Relacionamentos com:
  - Times principais
  - Coordenadores
  - Membros (técnicos)
  - Funções
  - Critérios de avaliação
  - Máquinas
  - Skills
- ✅ Regras de negócio:
  - Isolamento de skills por sub-time
  - Coordenadores com senioridade específica
  - Funções e critérios personalizados
- ✅ Exemplos completos de requests e responses
- ✅ Documentação de erros comuns

### 5. ✅ docs/AVALIACOES_API.md - Avaliações Trimestrais
**Arquivo**: [docs/AVALIACOES_API.md](docs/AVALIACOES_API.md)

**Mudanças**:
- ✅ Atualizado título para "Avaliações Trimestrais"
- ✅ Alterado sistema de avaliação:
  - De múltiplos critérios (production, quality, safety, teamwork)
  - Para avaliação individual de skills
- ✅ Estrutura QuarterlyNote:
  - Campos: `quarter`, `year`, `score`, `evaluatedDate`, `notes`
  - Score calculado como média das skills
- ✅ Adicionado sistema de cooldown:
  - Período mínimo de 3 meses (90 dias) entre avaliações
  - Validações e mensagens de erro específicas
- ✅ Novo sistema de validação:
  - Todas as skills devem ser avaliadas
  - Erros específicos para skills ausentes
- ✅ Response atualizado:
  - Incluído detalhamento de skill scores
  - Comparação com avaliação anterior
  - Cálculo de improvement
  - Data da próxima avaliação possível

---

## 📊 Estatísticas das Mudanças

### Arquivos Modificados: 5
- BACKEND.md
- docs/AUTH_API.md
- docs/TECNICOS_API.md
- docs/AVALIACOES_API.md
- docs/SUBTIMES_API.md (NOVO)

### Arquivos Criados: 2
- docs/SUBTIMES_API.md
- ATUALIZACOES_BACKEND.md (este arquivo)

### Arquivos Pendentes: 5
- docs/TEAMS_API.md - Atualizar com relacionamento com sub-times
- docs/SKILLS_API.md - Atualizar com relacionamentos team/subteam
- docs/MACHINES_API.md - Atualizar com relacionamentos team/subteam
- docs/ANALYTICS_API.md - Atualizar com endpoints reais da aplicação
- docs/USERS_API.md - Atualizar com estrutura simplificada

---

## 🎯 Principais Melhorias

### 1. Hierarquia Organizacional Clara
- **Times Principais** → gerenciados por SUPERVISORES
- **Sub-Times** → gerenciados por COORDENADORES
- **Técnicos** → alocados em sub-times
- Isolamento de skills e máquinas por sub-time

### 2. Sistema de Senioridade
Níveis hierárquicos bem definidos:
- AUXILIAR → JUNIOR → PLENO → SENIOR → ESPECIALISTA → COORDENADOR → SUPERVISOR

### 3. Roles Simplificadas
- **MASTER**: Acesso administrativo completo
- **TECNICO**: Acesso limitado a dados pessoais

### 4. Avaliação Trimestral Baseada em Skills
- Avaliação individual de cada skill do técnico
- Cooldown automático de 3 meses
- Comparação com avaliações anteriores
- Cálculo de improvement

### 5. Campos Adicionais Importantes
- **Photo**: Upload de foto de perfil
- **Gender**: Análise demográfica
- **Senioridade**: Hierarquia clara
- **Department**: Organização interna
- **SubTeam**: Estrutura hierárquica

---

## 🔄 Próximos Passos

### Documentação Pendente (Prioridade Alta)
1. [ ] Atualizar `docs/SKILLS_API.md`:
   - Adicionar campos `teamId` e `subTeamId`
   - Documentar isolamento de skills por sub-time
   - Atualizar exemplos

2. [ ] Atualizar `docs/MACHINES_API.md`:
   - Adicionar campos `teamId` e `subTeamId`
   - Remover relacionamento direto com Tecnico
   - Documentar isolamento por sub-time

3. [ ] Atualizar `docs/TEAMS_API.md`:
   - Adicionar endpoints de sub-times
   - Documentar campo `supervisorId`
   - Adicionar estatísticas por time

### Documentação Pendente (Prioridade Média)
4. [ ] Atualizar `docs/ANALYTICS_API.md`:
   - Endpoints para dashboards reais da aplicação
   - Rankings por senioridade
   - Análises por turno
   - Quebra por gênero

5. [ ] Atualizar `docs/USERS_API.md`:
   - Simplificar estrutura (foco em MASTER)
   - Remover referências a SUPERVISOR como role

### Implementação do Back-End (Futuro)
6. [ ] Criar projeto NestJS com estrutura definida
7. [ ] Implementar Prisma Schema completo
8. [ ] Criar seeds com dados da aplicação
9. [ ] Implementar endpoints documentados
10. [ ] Configurar Docker e CI/CD

---

## 📝 Notas de Implementação

### Regras de Negócio Críticas
1. **Isolamento de Skills**: Skills são específicas por sub-time e máquina
2. **Cooldown de Avaliação**: 3 meses (90 dias) entre avaliações
3. **Hierarquia**: Supervisor → Time → Coordenador → Sub-Time → Técnicos
4. **Avaliações**: Baseadas em scores individuais de skills
5. **Supervisores**: Não pertencem a times/sub-times (teamId e subTeamId null)

### Campos Importantes não Óbvios
- `photo`: Pode ser URL ou base64 (base64 convertido para URL no backend)
- `workday`: ID único do colaborador (ex: OP12345, SUP001)
- `department`: Diferente de team (ex: team="Manutenção SMT", department="Engenharia")
- `joinDate`: Data de entrada na empresa
- `quarter`: Trimestre da avaliação (1-4)

### Validações Importantes
- Workday deve ser único
- Email deve ser único
- Nome do sub-time único dentro do time
- Todas as skills devem ser avaliadas
- Período mínimo entre avaliações respeitado
- Coordenadores devem ter senioridade COORDENADOR
- Supervisores devem ter senioridade SUPERVISOR

---

## ✅ Checklist de Validação

Para validar se a documentação está correta, verificar:

- [x] Enums correspondem à aplicação real
- [x] Campos dos modelos batem com a aplicação
- [x] Relacionamentos estão corretos
- [x] Exemplos de requests são válidos
- [x] Responses incluem todos os campos necessários
- [x] Regras de negócio estão documentadas
- [x] Validações estão descritas
- [x] Mensagens de erro são claras
- [x] Permissões estão corretas (MASTER vs TECNICO)
- [x] Sistema de avaliação trimestral está correto

---

## 📌 Referências

- **Frontend**: [skill-frontend](https://github.com/ruthgomes/skill-frontend)
- **Documentação Completa**: Ver pasta `/docs`
- **Schema Prisma**: Ver `BACKEND.md` seção "Modelo de Dados"
- **Análise da Aplicação**: Ver relatório do agente Explore

---

**Documentação atualizada por**: GitHub Copilot
**Data**: 10 de março de 2026
**Versão**: 2.0
