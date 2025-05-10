# Estrutura do Banco de Dados AdvizallCRM

Este documento contém uma visão detalhada da estrutura do banco de dados utilizado pelo AdvizallCRM, hospedado no Supabase.

## Organização do Supabase

- **Organização**: AdvizallCRM (ID: jnqdygadjkstnuiuhhhc)
- **Projeto Ativo**: advizallcrm (ID: kefcmlzofrreeoopxduv)
- **Região**: us-east-2
- **Versão PostgreSQL**: 15.8.1.077

## Tabelas Principais

### Tabela: `public.users`

Armazena informações dos usuários do sistema.

**Colunas principais:**
- `id` (uuid, PK): Identificador único do usuário, vinculado à tabela auth.users
- `name` (text): Nome completo do usuário
- `email` (text): Email do usuário (único)
- `role` (text): Papel do usuário no sistema (user, moderator, admin)
- `created_at` (timestamptz): Data de criação do registro
- `avatar_url`, `phone`, `title`, `department`, `bio`: Informações complementares
- `last_login_at`, `last_active_at`: Rastreamento de atividades

### Tabela: `public.prospects`

Armazena informações de prospectos (leads).

**Colunas principais:**
- `id` (uuid, PK): Identificador único do prospecto
- `owner_id` (uuid, FK): Referência ao usuário responsável
- `contact_name` (text): Nome do contato
- `company_name` (text): Nome da empresa (opcional)
- `phone`, `email`: Informações de contato
- `lead_source`, `business_type`: Classificação do prospecto
- `region_city`, `region_state`, `timezone`: Localização
- `score` (integer): Pontuação de 1-5
- `status` (text): Status do prospecto (new, interested, negotiation, lost)
- `first_contact_at`, `next_follow_up_at`: Datas importantes
- `call_summary`, `notes`: Anotações
- `order_index` (integer): Ordem de exibição no quadro Kanban

### Tabela: `public.clients`

Armazena informações de clientes convertidos.

**Colunas principais:**
- `id` (uuid, PK): Identificador único do cliente
- `account_manager_id` (uuid, FK): Referência ao usuário gerente da conta
- `contact_name`, `company_name`, `phone`, `email`: Informações básicas
- `lead_source`, `business_type`: Classificação do cliente
- `region_city`, `region_state`, `timezone`, `full_address`, `zip_code`: Localização
- `score`: Pontuação de 1-5
- `website`, `social_links`: Presença online
- `plan_name`, `monthly_fee`, `retainer_value`, `ad_budget`: Informações financeiras
- `first_contact_at`, `call_summary`, `notes`: Histórico e anotações
- `status` (varchar): Status do cliente (active, inactive, delinquent)

### Tabela: `public.credentials`

Armazena credenciais seguras de acesso dos clientes.

**Colunas principais:**
- `id` (uuid, PK): Identificador único da credencial
- `client_id` (uuid, FK): Referência ao cliente
- `system` (text): Sistema ao qual a credencial pertence (hosting, domain, facebook, instagram, other)
- `login`, `password`: Dados de acesso
- `notes`: Anotações adicionais
- `visible_to` (text): Nível de acesso à credencial (moderator, admin)

### Tabela: `public.projects`

Armazena projetos associados a clientes.

**Colunas principais:**
- `id` (uuid, PK): Identificador único do projeto
- `client_id` (uuid, FK): Referência ao cliente
- `service` (text): Tipo de serviço (website, paid_ads, organic, branding, ops)
- `status` (text): Status do projeto (todo, doing, done)
- `description`: Descrição do projeto
- `deadline`: Data limite para conclusão

### Tabela: `public.tasks`

Armazena tarefas associadas a projetos.

**Colunas principais:**
- `id` (uuid, PK): Identificador único da tarefa
- `project_id` (uuid, FK): Referência ao projeto
- `title` (text): Título da tarefa
- `status` (text): Status da tarefa (todo, doing, done)
- `due_at`: Data de vencimento
- `assignee_id` (uuid, FK): Referência ao usuário responsável

### Tabela: `public.payments`

Armazena registros de pagamentos de clientes.

**Colunas principais:**
- `id` (uuid, PK): Identificador único do pagamento
- `client_id` (uuid, FK): Referência ao cliente
- `amount` (numeric): Valor do pagamento
- `currency` (text): Moeda (padrão: USD)
- `description`: Descrição do pagamento
- `invoice_date`: Data da fatura
- `paid` (boolean): Status do pagamento
- `paid_at`: Data do pagamento efetivo

### Tabela: `public.meetings`

Armazena reuniões agendadas com clientes ou prospectos.

**Colunas principais:**
- `id` (uuid, PK): Identificador único da reunião
- `client_id` (uuid, FK): Referência ao cliente (opcional)
- `prospect_id` (uuid, FK): Referência ao prospecto (opcional)
- `title`: Título da reunião
- `starts_at`, `ends_at`: Horário de início e término
- `calendar_event_id`: ID do evento no Google Calendar
- `meet_link`: Link da reunião no Google Meet
- `created_by_id` (uuid, FK): Usuário que criou a reunião
- `notes`: Anotações da reunião

### Tabela: `public.cal_meetings`

Armazena informações de reuniões agendadas através do Cal.com.

**Colunas principais:**
- `id` (uuid, PK): Identificador único
- `ical_uid` (text): Identificador único do evento no iCalendar
- `trigger_event`: Evento que disparou o registro
- `title`, `description`: Informações da reunião
- `start_time`, `end_time`: Horários
- `attendee_name`, `attendee_email`, `phone_number`: Informações do participante
- `meeting_link`: Link da reunião
- `status`: Status da reunião
- `raw_payload` (jsonb): Payload completo recebido do Cal.com

## Autenticação e Segurança

O sistema utiliza o esquema `auth` do Supabase, que inclui:

- `auth.users`: Armazenamento seguro de usuários e senhas
- `auth.sessions`: Sessões ativas
- `auth.refresh_tokens`: Tokens para renovação de acesso
- `auth.mfa_factors`, `auth.mfa_challenges`: Suporte a autenticação multi-fator
- `auth.identities`: Identidades associadas a usuários
- `auth.one_time_tokens`: Tokens para recuperação de senha e outras operações

## Relacionamentos Principais

1. `users.id` → `auth.users.id`: Vincula perfis públicos a autenticação
2. `prospects.owner_id` → `users.id`: Associa prospectos a usuários
3. `clients.account_manager_id` → `users.id`: Associa clientes a gerentes de conta
4. `credentials.client_id` → `clients.id`: Associa credenciais a clientes
5. `projects.client_id` → `clients.id`: Associa projetos a clientes
6. `tasks.project_id` → `projects.id`: Associa tarefas a projetos
7. `tasks.assignee_id` → `users.id`: Associa tarefas a usuários
8. `payments.client_id` → `clients.id`: Associa pagamentos a clientes
9. `meetings.client_id` → `clients.id`: Associa reuniões a clientes
10. `meetings.prospect_id` → `prospects.id`: Associa reuniões a prospectos
11. `meetings.created_by_id` → `users.id`: Identifica criador da reunião

## Extensões PostgreSQL Ativas

- `plpgsql`: Linguagem procedural PL/pgSQL
- `uuid-ossp`: Geração de UUIDs
- `pg_stat_statements`: Estatísticas de consultas SQL
- `pgjwt`: Suporte a JSON Web Tokens
- `pgcrypto`: Funções criptográficas
- `supabase_vault`: Armazenamento seguro de segredos
- `pg_graphql`: Suporte a GraphQL

## Migrações Aplicadas

1. `20250429014410_initial_schema`: Esquema inicial
2. `20250429014428_rls_policies`: Políticas de segurança em nível de linha
3. `20250429014440_functions_and_triggers`: Funções e gatilhos
4. `20250429015946_create_convert_prospect_to_client_function`: Função para converter prospecto em cliente
5. `20250429022422_fix_users_rls_policy`: Correção na política de segurança de usuários
6. `20250429023438_fix_recursive_users_policy`: Correção de política recursiva
7. `20250429025301_remove_all_rls_policies`: Remoção de políticas de segurança
8. `20250429032901_add_order_index_to_prospects`: Adição de índice de ordenação para prospectos
9. `20250430111748_20240430_cal_meetings`: Adição da tabela de reuniões do Cal.com
10. `20250508010826_20240521_add_admin_users_fixed`: Adição de usuários administradores
11. `20250508023019_reset_users`: Redefinição de usuários
12. `20250508023038_update_user_trigger`: Atualização de gatilho de usuário
13. `20250508023117_add_admin_fixed`: Correção na adição de administradores

## Observações sobre Segurança

1. **Políticas RLS**: A maioria das tabelas atualmente tem RLS (Row Level Security) desativado, conforme indicado por `rls_enabled: false`. Isso significa que não há restrições de acesso em nível de linha.

2. **Armazenamento de Senhas**: As senhas dos usuários são armazenadas de forma segura na tabela `auth.users` pelo mecanismo interno do Supabase.

3. **Credenciais de Clientes**: As credenciais de clientes (logins e senhas) são armazenadas como texto na tabela `credentials`, com acesso restrito por lógica de aplicação aos papéis de moderador e administrador.

## Recomendações

1. **Implementar RLS**: Considerar ativar Row Level Security para limitar o acesso a dados sensíveis.

2. **Armazenamento Seguro**: Para credenciais de clientes, considerar usar o Supabase Vault para criptografia adicional.

3. **Auditoria**: Implementar rastreamento de alterações (audit trail) para dados sensíveis.

4. **Backups Regulares**: Manter uma política de backups regulares do banco de dados.

5. **Monitoramento de Performance**: Usar o pg_stat_statements para identificar e otimizar consultas de baixo desempenho. 