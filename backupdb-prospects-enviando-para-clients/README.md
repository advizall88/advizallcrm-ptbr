# Documentação da Estrutura do Banco de Dados - AdvizallCRM

## Visão Geral

Este documento descreve a estrutura completa do banco de dados PostgreSQL usado pelo AdvizallCRM através do Supabase. O banco de dados é projetado para gerenciar prospects, clientes, projetos, pagamentos e outras entidades relacionadas ao fluxo de trabalho da Advizall.

## Extensões PostgreSQL Utilizadas

- `uuid-ossp`: Geração de UUIDs
- `pg_stat_statements`: Análise de performance de consultas
- `pgjwt`: Suporte para JWT (JSON Web Tokens)
- `pgcrypto`: Funções criptográficas
- `supabase_vault`: Armazenamento seguro de dados sensíveis
- `pg_graphql`: Suporte para GraphQL

## Estrutura de Tabelas

### Tabela: Users

Armazena informações sobre os usuários do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| name | TEXT | Nome completo do usuário |
| email | TEXT | Email do usuário (único) |
| role | TEXT | Função do usuário: 'user', 'moderator' ou 'admin' |
| created_at | TIMESTAMPTZ | Data de criação do registro |

### Tabela: Prospects

Armazena informações sobre leads/prospects que ainda não são clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| owner_id | UUID | ID do usuário responsável pelo prospect (FK para users.id) |
| contact_name | TEXT | Nome do contato principal |
| company_name | TEXT | Nome da empresa |
| phone | TEXT | Telefone de contato |
| email | TEXT | Email de contato |
| lead_source | TEXT | Origem do lead |
| business_type | TEXT | Tipo de negócio |
| region_city | TEXT | Cidade |
| region_state | TEXT | Estado |
| timezone | TEXT | Fuso horário (padrão: 'America/Chicago') |
| score | INTEGER | Pontuação de qualificação (1-5) |
| status | TEXT | Status do prospect: 'new', 'interested', 'negotiation', 'lost' |
| first_contact_at | TIMESTAMPTZ | Data do primeiro contato |
| call_summary | TEXT | Resumo da última chamada |
| notes | TEXT | Notas gerais |
| next_follow_up_at | TIMESTAMPTZ | Data do próximo acompanhamento |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |
| order_index | INTEGER | Índice para ordenação na interface |

### Tabela: Clients

Armazena informações sobre clientes ativos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| account_manager_id | UUID | ID do gerente de conta (FK para users.id) |
| contact_name | TEXT | Nome do contato principal |
| company_name | TEXT | Nome da empresa |
| phone | TEXT | Telefone de contato |
| email | TEXT | Email de contato |
| lead_source | TEXT | Origem do lead |
| business_type | TEXT | Tipo de negócio |
| region_city | TEXT | Cidade |
| region_state | TEXT | Estado |
| timezone | TEXT | Fuso horário (padrão: 'America/Chicago') |
| score | INTEGER | Pontuação de qualificação (1-5) |
| full_address | TEXT | Endereço completo |
| website | TEXT | URL do site |
| social_links | JSONB | Links para redes sociais (formato JSON) |
| plan_name | TEXT | Nome do plano contratado |
| retainer_value | NUMERIC | Valor do retainer |
| ad_budget | NUMERIC(10,2) | Orçamento para anúncios |
| monthly_fee | NUMERIC(10,2) | Mensalidade |
| first_contact_at | TIMESTAMPTZ | Data do primeiro contato |
| call_summary | TEXT | Resumo da última chamada |
| notes | TEXT | Notas gerais |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Tabela: Credentials

Armazena credenciais de acesso dos clientes a diversos sistemas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK para clients.id) |
| system | TEXT | Sistema: 'hosting', 'domain', 'facebook', 'instagram', 'other' |
| login | TEXT | Nome de usuário/login |
| password | TEXT | Senha |
| notes | TEXT | Notas adicionais |
| visible_to | TEXT | Nível de visibilidade: 'moderator', 'admin' |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Tabela: Projects

Armazena projetos associados aos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK para clients.id) |
| service | TEXT | Tipo de serviço: 'website', 'paid_ads', 'organic', 'branding', 'ops' |
| status | TEXT | Status do projeto: 'todo', 'doing', 'done' |
| description | TEXT | Descrição do projeto |
| deadline | TIMESTAMPTZ | Data limite para conclusão |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Tabela: Tasks

Armazena tarefas associadas aos projetos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| project_id | UUID | ID do projeto (FK para projects.id) |
| title | TEXT | Título da tarefa |
| status | TEXT | Status da tarefa: 'todo', 'doing', 'done' |
| due_at | TIMESTAMPTZ | Data de vencimento |
| assignee_id | UUID | ID do usuário responsável (FK para users.id) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Tabela: Payments

Armazena informações sobre pagamentos dos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK para clients.id) |
| amount | NUMERIC | Valor do pagamento |
| currency | TEXT | Moeda (padrão: 'USD') |
| description | TEXT | Descrição do pagamento |
| invoice_date | TIMESTAMPTZ | Data da fatura |
| paid | BOOLEAN | Indica se foi pago (padrão: FALSE) |
| paid_at | TIMESTAMPTZ | Data do pagamento |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

### Tabela: Meetings

Armazena informações sobre reuniões com clientes ou prospects.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| client_id | UUID | ID do cliente (FK para clients.id) |
| prospect_id | UUID | ID do prospect (FK para prospects.id) |
| title | TEXT | Título da reunião |
| starts_at | TIMESTAMPTZ | Data/hora de início |
| ends_at | TIMESTAMPTZ | Data/hora de término |
| calendar_event_id | TEXT | ID do evento no calendário |
| meet_link | TEXT | Link para a reunião virtual |
| created_by_id | UUID | ID do usuário que criou (FK para users.id) |
| notes | TEXT | Notas sobre a reunião |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

**Observação**: Uma reunião deve estar associada a um cliente OU a um prospect, nunca a ambos simultaneamente.

### Tabela: Cal Meetings

Armazena informações sobre reuniões agendadas via integração com Cal.com.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| ical_uid | TEXT | UID do evento iCalendar (único) |
| trigger_event | TEXT | Evento que disparou o registro |
| title | TEXT | Título da reunião |
| description | TEXT | Descrição da reunião |
| start_time | TIMESTAMPTZ | Data/hora de início |
| end_time | TIMESTAMPTZ | Data/hora de término |
| additional_notes | TEXT | Notas adicionais |
| attendee_name | TEXT | Nome do participante |
| attendee_email | TEXT | Email do participante |
| phone_number | TEXT | Telefone do participante |
| meeting_link | TEXT | Link para a reunião virtual |
| reschedule_reason | TEXT | Motivo do reagendamento, se aplicável |
| cancellation_reason | TEXT | Motivo do cancelamento, se aplicável |
| status | TEXT | Status da reunião |
| raw_payload | JSONB | Payload completo recebido do webhook |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data da última atualização |

## Índices

Os seguintes índices foram criados para otimizar a performance das consultas:

| Nome do Índice | Tabela | Colunas | Propósito |
|----------------|--------|---------|-----------|
| idx_prospects_owner_id | prospects | owner_id | Acelerar consultas que filtram por responsável |
| idx_prospects_status | prospects | status | Acelerar consultas que filtram por status |
| idx_clients_account_manager_id | clients | account_manager_id | Acelerar consultas que filtram por gerente de conta |
| idx_projects_client_id | projects | client_id | Acelerar consultas que filtram por cliente |
| idx_tasks_project_id | tasks | project_id | Acelerar consultas que filtram por projeto |
| idx_tasks_assignee_id | tasks | assignee_id | Acelerar consultas que filtram por responsável |
| idx_tasks_status | tasks | status | Acelerar consultas que filtram por status |
| idx_payments_client_id | payments | client_id | Acelerar consultas que filtram por cliente |
| idx_credentials_client_id | credentials | client_id | Acelerar consultas que filtram por cliente |
| idx_meetings_client_id | meetings | client_id | Acelerar consultas que filtram por cliente |
| idx_meetings_prospect_id | meetings | prospect_id | Acelerar consultas que filtram por prospect |
| cal_meetings_attendee_email_idx | cal_meetings | attendee_email | Acelerar consultas que filtram por email do participante |
| cal_meetings_status_idx | cal_meetings | status | Acelerar consultas que filtram por status |
| cal_meetings_start_time_idx | cal_meetings | start_time | Acelerar consultas que filtram por data/hora de início |

## Funções e Procedimentos

### Função: update_updated_at()

Atualiza automaticamente o campo `updated_at` com a data/hora atual quando um registro é modificado.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Função: convert_prospect_to_client(prospect_id UUID)

Converte um prospect em cliente, transferindo todos os dados relevantes e atualizando as reuniões associadas.

```sql
CREATE OR REPLACE FUNCTION public.convert_prospect_to_client(prospect_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    new_client_id UUID;
BEGIN
    -- Inserir na tabela clients
    INSERT INTO clients (
        account_manager_id,
        contact_name,
        company_name,
        phone,
        email,
        lead_source,
        business_type,
        region_city,
        region_state,
        timezone,
        score,
        first_contact_at,
        call_summary,
        notes
    )
    SELECT
        owner_id,
        contact_name,
        company_name,
        phone,
        email,
        lead_source,
        business_type,
        region_city,
        region_state,
        timezone,
        score,
        first_contact_at,
        call_summary,
        notes
    FROM prospects
    WHERE id = prospect_id
    RETURNING id INTO new_client_id;
    
    -- Atualizar reuniões relacionadas
    UPDATE meetings
    SET client_id = new_client_id,
        prospect_id = NULL
    WHERE prospect_id = prospect_id;
    
    -- Remover prospect
    DELETE FROM prospects WHERE id = prospect_id;
    
    RETURN new_client_id;
END;
$$;
```

## Triggers

Os seguintes triggers foram criados para manter o campo `updated_at` atualizado automaticamente:

| Nome do Trigger | Tabela | Evento | Função |
|----------------|--------|---------|--------|
| update_prospects_updated_at | prospects | BEFORE UPDATE | update_updated_at() |
| update_clients_updated_at | clients | BEFORE UPDATE | update_updated_at() |
| update_credentials_updated_at | credentials | BEFORE UPDATE | update_updated_at() |
| update_projects_updated_at | projects | BEFORE UPDATE | update_updated_at() |
| update_tasks_updated_at | tasks | BEFORE UPDATE | update_updated_at() |
| update_payments_updated_at | payments | BEFORE UPDATE | update_updated_at() |
| update_meetings_updated_at | meetings | BEFORE UPDATE | update_updated_at() |
| update_cal_meetings_updated_at | cal_meetings | BEFORE UPDATE | update_updated_at() |

## Estratégia de Backup

### Backups Automáticos
- Backups diários completos do banco de dados
- Retenção de 7 dias para backups diários
- Retenção de 4 semanas para backups semanais
- Retenção de 3 meses para backups mensais

### Backups Manuais
- Recomendado antes de alterações significativas no esquema
- Exportação do esquema completo usando o script `backup.sh`

## Atualizações Recentes

- Adição da tabela `tasks` para gerenciamento de tarefas de projetos
- Adição das colunas `monthly_fee` e `ad_budget` na tabela `clients`
- Otimização de índices para melhorar a performance de consultas frequentes

## Considerações de Segurança

- Dados sensíveis como senhas são armazenados de forma segura
- Implementação de Row Level Security (RLS) para controle de acesso granular
- Criptografia de dados em repouso pelo Supabase

## Implementação

Este esquema está implementado no projeto Supabase com ID `kefcmlzofrreeoopxduv` na região `us-east-2`.

Para restaurar o banco de dados a partir deste backup, utilize o arquivo SQL `supabase-schema-backup-updated.sql`. 