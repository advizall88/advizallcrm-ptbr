# Registro de Migrações do AdvizallCRM

Este documento mantém um histórico das migrações aplicadas ao banco de dados do AdvizallCRM.

## Migrações Aplicadas

| Data | Arquivo | Descrição | Autor |
|------|---------|-----------|-------|
| 2023-05-01 | 20230501000000_initial_schema.sql | Esquema inicial com tabelas principais | Andre Souza |
| 2024-04-30 | 20240430_meetings_cal.sql | Tabela para integração com Cal.com | Andre Souza |
| 2024-05-02 | 20240502000000_update_auth_profile.sql | Atualização do perfil de autenticação | Andre Souza |
| 2024-05-20 | 20240520_add_task_table.sql | Adição da tabela tasks | Andre Souza |
| 2024-05-20 | 20240520_add_missing_columns.sql | Adição das colunas monthly_fee e ad_budget na tabela clients | Andre Souza |
| 2024-05-20 | 20240520_reset_users.sql | Reset da tabela de usuários | Andre Souza |
| 2024-05-21 | 20240521_add_admin_users.sql | Adição de usuários administradores | Andre Souza |
| 2024-05-22 | 20240522_update_user_trigger.sql | Atualização do trigger para usuários | Andre Souza |
| 2024-05-22 | 20240522_add_admin.sql | Adição do usuário admin principal | Andre Souza |

## Como aplicar novas migrações

Para adicionar uma nova migração:

1. Crie um arquivo SQL na pasta `supabase/migrations` seguindo o padrão de nomenclatura: `AAAAMMDD_nome_descritivo.sql`
2. Execute a migração no banco de dados do Supabase
3. Adicione a migração a este registro

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