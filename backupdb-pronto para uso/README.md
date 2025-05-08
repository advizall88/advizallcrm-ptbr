# AdvizallCRM - Backup do Banco de Dados

Última atualização: 22 de Maio de 2024

## Visão geral

Este diretório contém arquivos para backup e restauração do banco de dados PostgreSQL gerenciado pelo Supabase para o AdvizallCRM. Inclui a estrutura completa do banco (esquema), definições de tipos TypeScript, e scripts para backup e restauração.

## Conteúdo do diretório

- **supabase-schema-backup-updated.sql**: Backup completo do esquema do banco de dados (definições de tabelas, índices, funções, triggers)
- **types.ts**: Definições de tipos TypeScript que correspondem à estrutura do banco de dados
- **DB_STRUCTURE.md**: Documentação detalhada da estrutura do banco de dados
- **migrations-registry.md**: Registro de todas as migrações aplicadas ao banco
- **backup-database.js**: Script Node.js para criar backup do banco de dados
- **restore-database-browser.js**: Script para restaurar o banco a partir do backup
- **backup-database-browser.js**: Versão para navegador do script de backup
- **backup.sh**: Script shell para backup automático

## Como usar o backup

### Restauração via interface do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.io)
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Cole o conteúdo do arquivo `supabase-schema-backup-updated.sql`
5. Execute o script

### Restauração usando scripts

Para restaurar o banco usando nossos scripts automatizados:

```bash
# Instalar dependências
npm install

# Executar script de restauração
node restore-database-browser.js
```

### Atualizações recentes do banco de dados

- **22/05/2024**:
  - Adicionados usuários administradores padrão
  - Ajustados os gatilhos para consistência de timestamps

- **20/05/2024**:
  - Adicionada tabela `tasks` para gerenciamento de tarefas 
  - Adicionadas colunas `monthly_fee` e `ad_budget` na tabela `clients`

### Estrutura atual do banco

O banco de dados contém as seguintes tabelas principais:

- `users`: Usuários do sistema
- `prospects`: Leads/prospects antes de se tornarem clientes
- `clients`: Clientes ativos
- `projects`: Projetos associados a clientes
- `tasks`: Tarefas específicas
- `payments`: Pagamentos feitos pelos clientes
- `credentials`: Credenciais de acesso a serviços
- `meetings`: Reuniões com clientes/prospects
- `cal_meetings`: Integração com Cal.com para agendamento

Para detalhes completos, consulte o arquivo [DB_STRUCTURE.md](./DB_STRUCTURE.md).

## Como criar novo backup

### Via script automatizado

```bash
# Backup completo (esquema + dados)
node backup-database.js

# Apenas esquema
node backup-database.js --schema-only
```

### Manualmente via Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.io)
2. Selecione seu projeto
3. Vá para "Database" > "Backups"
4. Clique em "Create backup"
5. Baixe o arquivo gerado

## Considerações de segurança

- Os backups podem conter dados sensíveis (credenciais, informações financeiras)
- Mantenha os arquivos de backup em local seguro
- As senhas são armazenadas pelo Supabase com criptografia adequada
- Este backup contém apenas a estrutura, não os dados sensíveis dos clientes

## Manutenção do banco

### Recomendações para manutenção regular

- Realize backups completos semanalmente
- Execute backup antes de qualquer migração ou alteração estrutural
- Verifique regularmente a integridade dos backups tentando restaurá-los em um ambiente de teste
- Mantenha este repositório de backup atualizado após alterações no esquema

## Informações do projeto Supabase

- **Projeto ID**: kefcmlzofrreeoopxduv
- **Região**: us-east-2
- **Nome do projeto**: advizallcrm 