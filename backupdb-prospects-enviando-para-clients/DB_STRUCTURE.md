# Documentação da Estrutura do Banco de Dados - AdvizallCRM

Este documento descreve a estrutura completa do banco de dados Supabase utilizado pelo AdvizallCRM, incluindo todas as tabelas, relacionamentos, índices, funções e gatilhos necessários para o funcionamento da aplicação.

## Visão Geral

O banco de dados utiliza PostgreSQL gerenciado pelo Supabase e foi projetado para suportar um CRM completo para uma agência de marketing, com recursos para rastreamento de clientes potenciais (prospects), gerenciamento de clientes, projetos, tarefas, pagamentos, credenciais e reuniões.

## Extensões Utilizadas

O sistema utiliza as seguintes extensões do PostgreSQL:

- **uuid-ossp**: Para geração de UUIDs como identificadores únicos
- **pg_stat_statements**: Para monitoramento estatístico de queries SQL
- **pgjwt**: Para manipulação de tokens JWT
- **pgcrypto**: Para funções criptográficas
- **supabase_vault**: Para armazenamento seguro de dados sensíveis
- **pg_graphql**: Para suporte a GraphQL nativo

## Tabelas e Relacionamentos

### Users (`public.users`)

Armazena informações sobre os usuários do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| name | TEXT | Nome completo do usuário |
| email | TEXT | E-mail do usuário (único) |
| role | TEXT | Função do usuário (user, moderator, admin) |
| created_at | TIMESTAMPTZ | Data de criação do registro |

### Prospects (`public.prospects`)

Armazena informações sobre leads/prospects (clientes potenciais).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| owner_id | UUID | ID do usuário responsável (FK -> users.id) |
| contact_name | TEXT | Nome do contato |
| company_name | TEXT | Nome da empresa (opcional) |
| phone | TEXT | Telefone de contato |
| email | TEXT | E-mail de contato |
| lead_source | TEXT | Origem do lead |
| business_type | TEXT | Tipo de negócio |
| region_city | TEXT | Cidade |
| region_state | TEXT | Estado |
| timezone | TEXT | Fuso horário (padrão 'America/Chicago') |
| score | INTEGER | Pontuação (1-5) |
| status | TEXT | Status (new, interested, negotiation, lost) |
| first_contact_at | TIMESTAMPTZ | Data do primeiro contato |
| call_summary | TEXT | Resumo da chamada (opcional) |
| notes | TEXT | Notas gerais (opcional) |
| next_follow_up_at | TIMESTAMPTZ | Data de próximo follow-up (opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |
| order_index | INTEGER | Índice para ordenação na interface (padrão 0) |

### Clients (`public.clients`)

Armazena informações sobre clientes ativos, expandido de prospects.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| account_manager_id | UUID | ID do gerente de conta (FK -> users.id) |
| contact_name | TEXT | Nome do contato |
| company_name | TEXT | Nome da empresa (opcional) |
| phone | TEXT | Telefone de contato |
| email | TEXT | E-mail de contato |
| lead_source | TEXT | Origem do lead |
| business_type | TEXT | Tipo de negócio |
| region_city | TEXT | Cidade |
| region_state | TEXT | Estado |
| timezone | TEXT | Fuso horário (padrão 'America/Chicago') |
| score | INTEGER | Pontuação (1-5) |
| full_address | TEXT | Endereço completo |
| website | TEXT | Site (opcional) |
| social_links | JSONB | Links sociais (opcional, formato JSON) |
| plan_name | TEXT | Nome do plano contratado (opcional) |
| retainer_value | NUMERIC | Valor da mensalidade (opcional) |
| ad_budget | NUMERIC | Orçamento de anúncios (opcional) |
| monthly_fee | NUMERIC(10,2) | Taxa mensal (padrão 0) |
| first_contact_at | TIMESTAMPTZ | Data do primeiro contato |
| call_summary | TEXT | Resumo da chamada (opcional) |
| notes | TEXT | Notas gerais (opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Credentials (`public.credentials`)

Armazena credenciais seguras dos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK -> clients.id) |
| system | TEXT | Sistema (hosting, domain, facebook, instagram, other) |
| login | TEXT | Nome de usuário/login |
| password | TEXT | Senha |
| notes | TEXT | Notas adicionais (opcional) |
| visible_to | TEXT | Visibilidade (moderator, admin) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Projects (`public.projects`)

Armazena projetos associados aos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK -> clients.id) |
| service | TEXT | Tipo de serviço (website, paid_ads, organic, branding, ops) |
| status | TEXT | Status do projeto (todo, doing, done) |
| description | TEXT | Descrição do projeto (opcional) |
| deadline | TIMESTAMPTZ | Prazo de entrega (opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Tasks (`public.tasks`)

Armazena tarefas associadas a projetos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| project_id | UUID | ID do projeto (FK -> projects.id) |
| title | TEXT | Título da tarefa |
| status | TEXT | Status (todo, doing, done) |
| due_at | TIMESTAMPTZ | Prazo de conclusão (opcional) |
| assignee_id | UUID | ID do responsável (FK -> users.id, opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Payments (`public.payments`)

Armazena informações de pagamentos de clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK -> clients.id) |
| amount | NUMERIC | Valor do pagamento |
| currency | TEXT | Moeda (padrão 'USD') |
| description | TEXT | Descrição do pagamento |
| invoice_date | TIMESTAMPTZ | Data da fatura |
| paid | BOOLEAN | Status de pagamento (padrão false) |
| paid_at | TIMESTAMPTZ | Data de pagamento (opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Meetings (`public.meetings`)

Armazena informações sobre reuniões agendadas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK -> clients.id, opcional) |
| prospect_id | UUID | ID do prospect (FK -> prospects.id, opcional) |
| title | TEXT | Título da reunião |
| starts_at | TIMESTAMPTZ | Data/hora de início |
| ends_at | TIMESTAMPTZ | Data/hora de término |
| calendar_event_id | TEXT | ID do evento no Google Calendar (opcional) |
| meet_link | TEXT | Link para reunião no Google Meet (opcional) |
| created_by_id | UUID | ID do usuário que criou (FK -> users.id) |
| notes | TEXT | Notas da reunião (opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Cal Meetings (`public.cal_meetings`)

Armazena dados de integração com Cal.com.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| ical_uid | TEXT | UID do evento iCalendar (único) |
| trigger_event | TEXT | Evento disparador (created, rescheduled, cancelled) |
| title | TEXT | Título da reunião |
| description | TEXT | Descrição (opcional) |
| start_time | TIMESTAMPTZ | Data/hora de início |
| end_time | TIMESTAMPTZ | Data/hora de término |
| additional_notes | TEXT | Notas adicionais (opcional) |
| attendee_name | TEXT | Nome do participante (opcional) |
| attendee_email | TEXT | E-mail do participante (opcional) |
| phone_number | TEXT | Telefone do participante (opcional) |
| meeting_link | TEXT | Link da reunião (opcional) |
| reschedule_reason | TEXT | Motivo de reagendamento (opcional) |
| cancellation_reason | TEXT | Motivo de cancelamento (opcional) |
| status | TEXT | Status da reunião |
| raw_payload | JSONB | Payload completo do webhook (opcional) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

## Índices

Foram criados os seguintes índices para otimização de performance:

| Nome | Tabela | Colunas | Propósito |
|------|--------|---------|-----------|
| idx_prospects_owner_id | prospects | owner_id | Pesquisa por proprietário |
| idx_prospects_status | prospects | status | Filtragem por status |
| idx_clients_account_manager_id | clients | account_manager_id | Pesquisa por gerente |
| idx_credentials_client_id | credentials | client_id | Pesquisa por cliente |
| idx_projects_client_id | projects | client_id | Pesquisa por cliente |
| idx_tasks_project_id | tasks | project_id | Pesquisa por projeto |
| idx_tasks_assignee_id | tasks | assignee_id | Pesquisa por responsável |
| idx_tasks_status | tasks | status | Filtragem por status |
| idx_payments_client_id | payments | client_id | Pesquisa por cliente |
| idx_meetings_client_id | meetings | client_id | Pesquisa por cliente |
| idx_meetings_prospect_id | meetings | prospect_id | Pesquisa por prospect |
| cal_meetings_attendee_email_idx | cal_meetings | attendee_email | Pesquisa por e-mail |
| cal_meetings_status_idx | cal_meetings | status | Filtragem por status |
| cal_meetings_start_time_idx | cal_meetings | start_time | Pesquisa por data |

## Funções e Procedimentos

### convert_prospect_to_client

Esta função converte um prospect em cliente, preservando todos os dados.

```sql
CREATE OR REPLACE FUNCTION public.convert_prospect_to_client(prospect_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
```

**Parâmetros:**
- `prospect_id` - UUID do prospect a ser convertido

**Comportamento:**
1. Copia os dados do prospect para uma nova entrada na tabela clients
2. Atualiza qualquer reunião associada ao prospect para apontar para o novo cliente
3. Remove o prospect original
4. Retorna o ID do novo cliente

### update_updated_at

Função auxiliar que atualiza automaticamente o campo `updated_at` para a data/hora atual.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Triggers

Os seguintes triggers são utilizados para manter o campo `updated_at` atualizado em todas as tabelas:

| Nome | Tabela | Evento | Função |
|------|--------|--------|--------|
| update_prospects_updated_at | prospects | BEFORE UPDATE | update_updated_at() |
| update_clients_updated_at | clients | BEFORE UPDATE | update_updated_at() |
| update_credentials_updated_at | credentials | BEFORE UPDATE | update_updated_at() |
| update_projects_updated_at | projects | BEFORE UPDATE | update_updated_at() |
| update_tasks_updated_at | tasks | BEFORE UPDATE | update_updated_at() |
| update_payments_updated_at | payments | BEFORE UPDATE | update_updated_at() |
| update_meetings_updated_at | meetings | BEFORE UPDATE | update_updated_at() |
| update_cal_meetings_updated_at | cal_meetings | BEFORE UPDATE | update_updated_at() |

## Estratégia de Backup

Para garantir a segurança e disponibilidade dos dados, é recomendada a seguinte estratégia de backup:

1. Backups automáticos diários do esquema e dados completos do banco
2. Retenção de backups por pelo menos 30 dias
3. Backup manual adicional antes de grandes migrações ou alterações estruturais

Os scripts de backup neste repositório facilitam o processo de:
- Backup do esquema completo (estrutura)
- Backup dos dados de todas as tabelas
- Restauração do esquema e dados em um novo ambiente

## Atualizações Recentes

- **20240520**: Adição de tabela `tasks` para gestão de tarefas de projetos
- **20240520**: Adição das colunas `monthly_fee` e `ad_budget` à tabela `clients`
- **20240430**: Integração com Cal.com através da tabela `cal_meetings`

## Considerações de Segurança

- Dados sensíveis como senhas são armazenados em texto plano na tabela `credentials`, mas protegidos por:
  - RLS (Row Level Security) para limitar o acesso a usuários moderator e admin
  - Criptografia em repouso no banco de dados Supabase
  - Campo `visible_to` que restringe a visualização baseada em perfil

## Notas de Implementação

Este esquema está implementado no projeto Supabase `kefcmlzofrreeoopxduv` (advizallcrm) na região `us-east-2`. Para restaurar este banco de dados em um novo projeto, utilize o arquivo `supabase-schema-backup-updated.sql` neste repositório. 