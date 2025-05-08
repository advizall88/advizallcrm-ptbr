# Registro de Migrações do Banco de Dados AdvizallCRM

Este documento registra todas as migrações aplicadas ao banco de dados do AdvizallCRM, em ordem cronológica.

## Migrações Aplicadas

### 20240501000000_initial_schema.sql
- Criação do esquema inicial do banco de dados
- Tabelas criadas: users, prospects, clients, projects, payments, credentials, meetings, cal_meetings
- Criação de triggers para manutenção de updated_at

### 20240520_add_missing_columns.sql
- Adição das colunas `monthly_fee` e `ad_budget` na tabela `clients`
- Definição: `monthly_fee` NUMERIC(10,2) DEFAULT 0
- Definição: `ad_budget` NUMERIC(10,2) DEFAULT 0
- Adição de comentários para documentar o propósito das colunas

### 20240522_add_tasks_table.sql
- Criação da tabela `tasks` para gerenciamento de tarefas dos clientes
- Definição de chaves estrangeiras para clients, projects e users
- Adição de trigger para manutenção de updated_at

### 20240522_add_admin_users.sql
- Adição de usuários administrativos iniciais
- Usuários adicionados: Andre Souza e Vinicius Fernandes
- Definição de role como 'admin' para acesso completo

### 20240523_add_status_column.sql
- Adição do campo `status` na tabela `clients`
- Definição: VARCHAR(20) DEFAULT 'active' NOT NULL
- Adição de constraint para validar valores: active, inactive, delinquent

### 20240524_update_prospects_nullability.sql
- Alteração da tabela `prospects` para permitir valores nulos em:
  - email
  - region_city
  - region_state

### 20240524_update_clients_nullability.sql
- Alteração da tabela `clients` para permitir valores nulos em:
  - email
  - region_city
  - region_state
- Alteração da coluna `first_contact_at` para ter valor padrão CURRENT_TIMESTAMP

## Migrações Pendentes

Nenhuma migração pendente no momento.

## Como aplicar novas migrações

1. Crie um novo arquivo SQL na pasta `/supabase/migrations` com o seguinte formato de nome:
   - `YYYYMMDD_descricao_curta.sql` (ex: `20240601_add_notifications_table.sql`)

2. Adicione comentários explicativos no início do arquivo:
   ```sql
   -- Migração para [descrição]
   -- Data: [data]
   -- Descrição: [descrição detalhada]
   ```

3. Após aplicar a migração no banco de dados, adicione a migração a este registro.

4. Atualize também os arquivos `supabase-schema-backup-updated.sql` e `DB_STRUCTURE.md` para refletir as alterações.

## Como reverter migrações

Para reverter uma migração:

1. Crie um arquivo SQL com o comando para reverter as alterações
2. Execute o script diretamente no SQL Editor do Supabase
3. Atualize este registro indicando que a migração foi revertida

## Convenções de nomenclatura

- Use o formato `AAAAMMDD_nome_descritivo.sql` para arquivos de migração
- Use snake_case para nomes de tabelas e colunas
- Prefixe triggers com nome da tabela + ação
- Prefixe índices com `idx_` seguido de tabela e colunas
- Prefixe constraints com tipo de constraint seguido de tabelas envolvidas 