# Documentação da Estrutura do Banco de Dados - AdvizallCRM

Última atualização: 22 de Maio de 2024

## Visão Geral

O AdvizallCRM utiliza um banco de dados PostgreSQL gerenciado pelo Supabase. Esta documentação descreve a estrutura completa do banco de dados, incluindo tabelas, relacionamentos, índices, funções e gatilhos.

## Extensões

O banco de dados utiliza as seguintes extensões:

- `uuid-ossp`: Para geração de UUIDs
- `pg_graphql`: Para suporte a GraphQL
- `pg_stat_statements`: Para análise de performance de consultas
- `pgcrypto`: Para funções criptográficas

## Tabelas

### Users

Armazena informações sobre os usuários do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| email | TEXT | Email do usuário (único) |
| name | TEXT | Nome do usuário |
| role | TEXT | Função do usuário (user, moderator, admin) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| avatar_url | TEXT | URL para o avatar do usuário |
| phone | TEXT | Número de telefone do usuário |
| title | TEXT | Título profissional |
| department | TEXT | Departamento |
| bio | TEXT | Biografia/descrição |
| last_login_at | TIMESTAMPTZ | Data do último login |
| last_active_at | TIMESTAMPTZ | Data da última atividade |

### Prospects

Armazena informações sobre leads/prospects antes de se tornarem clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| contact_name | TEXT | Nome do contato |
| company_name | TEXT | Nome da empresa |
| email | TEXT | Email do contato (único) |
| phone | TEXT | Telefone do contato |
| business_type | TEXT | Tipo de negócio |
| status | TEXT | Status do prospect (new, contacted, qualified, etc) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |
| assigned_to | UUID | Referência ao usuário responsável |
| notes | TEXT | Observações |
| address | TEXT | Endereço |
| city | TEXT | Cidade |
| state | TEXT | Estado |
| zip | TEXT | CEP |
| country | TEXT | País (padrão 'Brasil') |
| source | TEXT | Origem do prospect |
| website | TEXT | Website |

### Clients

Armazena informações sobre clientes ativos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| contact_name | TEXT | Nome do contato |
| company_name | TEXT | Nome da empresa |
| email | TEXT | Email do contato (único) |
| phone | TEXT | Telefone do contato |
| business_type | TEXT | Tipo de negócio |
| status | TEXT | Status do cliente (active, inactive, etc) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |
| assigned_to | UUID | Referência ao usuário responsável |
| notes | TEXT | Observações |
| address | TEXT | Endereço |
| city | TEXT | Cidade |
| state | TEXT | Estado |
| zip | TEXT | CEP |
| country | TEXT | País (padrão 'Brasil') |
| website | TEXT | Website |
| plan_name | TEXT | Nome do plano contratado |
| monthly_fee | NUMERIC(10,2) | Valor mensal cobrado (em reais) |
| ad_budget | NUMERIC(10,2) | Orçamento para anúncios (em reais) |

### Projects

Armazena projetos associados aos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| client_id | UUID | Referência ao cliente |
| name | TEXT | Nome do projeto |
| description | TEXT | Descrição do projeto |
| status | TEXT | Status do projeto (active, completed, etc) |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |
| start_date | DATE | Data de início do projeto |
| end_date | DATE | Data de finalização prevista |
| progress | INTEGER | Percentual de progresso (0-100) |

### Tasks

Armazena tarefas específicas relacionadas a projetos ou clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| title | TEXT | Título da tarefa |
| description | TEXT | Descrição detalhada |
| status | TEXT | Status da tarefa (pending, in_progress, completed) |
| priority | TEXT | Prioridade (low, medium, high) |
| due_date | DATE | Data limite |
| client_id | UUID | Referência ao cliente (opcional) |
| project_id | UUID | Referência ao projeto (opcional) |
| assigned_to | UUID | Usuário responsável pela tarefa |
| created_by | UUID | Usuário que criou a tarefa |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |
| completed_at | TIMESTAMPTZ | Data de conclusão |
| tags | TEXT[] | Tags/categorias para a tarefa |
| time_estimate | INTEGER | Tempo estimado em minutos |

### Payments

Armazena informações sobre pagamentos dos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| client_id | UUID | Referência ao cliente |
| amount | NUMERIC(10,2) | Valor do pagamento |
| status | TEXT | Status do pagamento (pending, paid, etc) |
| payment_date | DATE | Data do pagamento (quando foi pago) |
| due_date | DATE | Data de vencimento |
| description | TEXT | Descrição do pagamento |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |
| payment_method | TEXT | Método de pagamento |
| invoice_number | TEXT | Número da fatura/nota fiscal |

### Credentials

Armazena credenciais dos clientes para diversos serviços.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| client_id | UUID | Referência ao cliente |
| service_name | TEXT | Nome do serviço |
| username | TEXT | Nome de usuário |
| password | TEXT | Senha |
| url | TEXT | URL do serviço |
| api_key | TEXT | Chave de API (quando aplicável) |
| notes | TEXT | Observações adicionais |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |

### Meetings

Armazena informações sobre reuniões com clientes ou prospects.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| title | TEXT | Título da reunião |
| description | TEXT | Descrição da reunião |
| meeting_date | TIMESTAMPTZ | Data e hora da reunião |
| duration | INTEGER | Duração em minutos |
| client_id | UUID | Referência ao cliente (opcional) |
| prospect_id | UUID | Referência ao prospect (opcional) |
| created_by | UUID | Usuário que agendou a reunião |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |
| status | TEXT | Status da reunião (scheduled, completed, etc) |
| meeting_link | TEXT | Link para a reunião virtual |
| notes | TEXT | Anotações sobre a reunião |
| location | TEXT | Local da reunião |

* Nota: Uma reunião só pode estar vinculada a um cliente OU um prospect, nunca ambos.

### Cal Meetings

Armazena dados de integração com o Cal.com para agendamento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| uid | TEXT | ID único da reunião no Cal.com |
| title | TEXT | Título da reunião |
| description | TEXT | Descrição da reunião |
| start_time | TIMESTAMPTZ | Data e hora de início |
| end_time | TIMESTAMPTZ | Data e hora de término |
| attendees | JSONB | Participantes da reunião em formato JSON |
| organizer | JSONB | Organizador da reunião em formato JSON |
| calendar_event_id | TEXT | ID do evento no calendário |
| location | TEXT | Local da reunião |
| status | TEXT | Status da reunião |
| event_type | JSONB | Tipo de evento em formato JSON |
| cal_user_id | TEXT | ID do usuário no Cal.com |
| created_at | TIMESTAMPTZ | Data de criação do registro |
| updated_at | TIMESTAMPTZ | Data de atualização do registro |
| processed | BOOLEAN | Indica se a reunião foi processada |
| metadata | JSONB | Metadados adicionais em formato JSON |

## Índices

Os seguintes índices foram criados para otimização de performance:

| Nome do índice | Tabela | Colunas | Finalidade |
|---------------|---------|---------|------------|
| users_email_key | users | email | Garantir unicidade de emails |
| prospects_email_key | prospects | email | Garantir unicidade de emails |
| clients_email_key | clients | email | Garantir unicidade de emails |

## Funções e Procedimentos

### convert_prospect_to_client

Converte um prospect em cliente.

```sql
CREATE OR REPLACE FUNCTION "public"."convert_prospect_to_client"(
  prospect_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_client_id UUID;
  p record;
BEGIN
  -- Get the prospect data
  SELECT * INTO p FROM prospects WHERE id = prospect_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Prospect with ID % not found', prospect_id;
  END IF;
  
  -- Insert into clients table
  INSERT INTO clients (
    contact_name, company_name, email, phone, business_type,
    status, assigned_to, notes, address, city, state, zip, country, website
  ) VALUES (
    p.contact_name, p.company_name, p.email, p.phone, p.business_type,
    'active', p.assigned_to, p.notes, p.address, p.city, p.state, p.zip, p.country, p.website
  ) RETURNING id INTO new_client_id;
  
  -- Delete the prospect
  DELETE FROM prospects WHERE id = prospect_id;
  
  RETURN new_client_id;
END;
$$;
```

### update_updated_at

Função para atualizar automaticamente o timestamp `updated_at` em tabelas.

```sql
CREATE OR REPLACE FUNCTION "public"."update_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Gatilhos (Triggers)

Gatilhos para manter o campo `updated_at` atualizado em todas as tabelas relevantes:

| Nome do Trigger | Tabela | Evento | Função |
|----------------|--------|--------|--------|
| update_users_updated_at | users | BEFORE UPDATE | update_updated_at |
| update_prospects_updated_at | prospects | BEFORE UPDATE | update_updated_at |
| update_clients_updated_at | clients | BEFORE UPDATE | update_updated_at |
| update_projects_updated_at | projects | BEFORE UPDATE | update_updated_at |
| update_tasks_updated_at | tasks | BEFORE UPDATE | update_updated_at |
| update_payments_updated_at | payments | BEFORE UPDATE | update_updated_at |
| update_credentials_updated_at | credentials | BEFORE UPDATE | update_updated_at |
| update_meetings_updated_at | meetings | BEFORE UPDATE | update_updated_at |
| update_cal_meetings_updated_at | cal_meetings | BEFORE UPDATE | update_updated_at |

## Estratégia de Backup

- **Backups Diários**: São realizados backups automáticos diariamente às 03:00 UTC.
- **Política de Retenção**: Os backups são mantidos por 7 dias.
- **Backups Manuais**: É recomendado realizar backups manuais antes de alterações significativas no esquema.

## Atualizações Recentes

- **22/05/2024**:
  - Adicionados usuários administradores padrão
  - Ajustes nos gatilhos para garantir consistência de timestamps

- **20/05/2024**:
  - Adicionada tabela `tasks` para gerenciamento de tarefas 
  - Adicionadas colunas `monthly_fee` e `ad_budget` na tabela `clients`

## Considerações de Segurança

- Dados sensíveis são protegidos pela infraestrutura do Supabase
- Senhas e credenciais são armazenadas em formato seguro
- Políticas de Row Level Security (RLS) podem ser implementadas para restringir acesso a dados

## Implementação

O esquema acima está implementado no projeto Supabase com ID `kefcmlzofrreeoopxduv` na região `us-east-2`. 