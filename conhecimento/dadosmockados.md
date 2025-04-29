# Dados Mockados - AdvizallCRM

Este documento lista todos os dados mockados implementados no projeto AdvizallCRM para fins de desenvolvimento e teste. Estes dados deverão ser substituídos por dados reais quando o Supabase for configurado adequadamente.

## 1. Usuário de Teste

### Localização: `/src/contexts/AuthContext.tsx` 

```typescript
// Usuário temporário para teste
const TEST_USER: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'André Souza',
  email: 'andresouzaamador@gmail.com',
  role: 'admin', // Dando acesso de admin para testar todas as funcionalidades
  created_at: new Date().toISOString()
};

// Senha temporária para teste
const TEST_PASSWORD = '251108';
```

### Detalhes
- Usuário com permissões de administrador para testar todas as funcionalidades
- Credenciais: andresouzaamador@gmail.com / 251108
- Utilizado em todo o sistema para autenticação e controle de acesso
- ID do usuário (`123e4567-e89b-12d3-a456-426614174000`) referenciado em outros dados mockados

### Como Remover
1. Remover as constantes `TEST_USER` e `TEST_PASSWORD`
2. Descomentar o código original que usa o Supabase Auth
3. Remover o código de armazenamento no localStorage
4. Restaurar as funções originais de signIn e signOut

## 2. Prospectos Mockados

### Localização: `/src/services/prospectService.ts`

```typescript
// Mock data para prospectos
const MOCK_PROSPECTS: Prospect[] = [
  {
    id: uuidv4(),
    owner_id: '123e4567-e89b-12d3-a456-426614174000', // ID do usuário de teste
    contact_name: 'João Silva',
    company_name: 'Tech Solutions',
    // ... outros campos
  },
  // ... outros prospectos
];

// Array mutável para armazenar os prospectos
let prospects = [...MOCK_PROSPECTS];
```

### Detalhes
- 4 prospectos mockados com diferentes status (new, interested, negotiation, lost)
- Dados incluem informações completas como nome, empresa, contato, histórico, etc.
- Todos estão vinculados ao usuário de teste através do `owner_id`
- Implementação inclui manipulação local via array (`let prospects = [...]`)

### Como Remover
1. Remover as constantes `MOCK_PROSPECTS` e a variável `prospects`
2. Descomentar o código original que faz chamadas ao Supabase
3. Remover as implementações mockadas de cada método (getProspects, createProspect, etc.)

## 3. Página de Login Modificada

### Localização: `/src/pages/Login.tsx`

Modificações:
- Adicionado Alert com informações de acesso de demonstração
- Valores padrão do formulário preenchidos com as credenciais de teste

### Como Remover
1. Remover o componente Alert com as informações de acesso
2. Restaurar os valores padrão vazios para os campos de email e senha

## 4. Implementação de Serviços Mockados

### Serviços Implementados com Dados Mockados:
- `/src/services/prospectService.ts` - Completamente mockado

### Pendentes (ainda usando chamadas diretas ao Supabase):
- `/src/services/clientService.ts`
- `/src/services/meetingService.ts`
- `/src/services/userService.ts`

### Como Remover
Para cada serviço mockado:
1. Remover as implementações alternativas que usam arrays locais
2. Descomentar o código original das funções que fazem chamadas ao Supabase
3. Verificar se todos os comentários /* ... */ foram removidos

## 5. Configuração do Ambiente

### Localização: `/src/lib/supabase.ts`

As variáveis de ambiente foram modificadas de `NEXT_PUBLIC_` para `VITE_` mas isso deve ser mantido mesmo após a remoção dos dados mockados.

## Procedimento para Migração para Dados Reais

1. Criar projeto no Supabase
2. Configurar esquema de banco de dados conforme `/supabase/migrations/20230501000000_initial_schema.sql`
3. Atualizar as variáveis de ambiente no arquivo `.env` com as credenciais do novo projeto
4. Remover todos os dados mockados conforme documentado acima
5. Implementar autenticação real com Supabase Auth
6. Testar todas as funcionalidades para garantir que estão funcionando com dados reais

## Ordem Recomendada para Remoção dos Mocks

1. Primeiro crie o projeto no Supabase e configure o banco de dados
2. Remova os dados mockados do serviço de prospectos (`prospectService.ts`)
3. Restaure a implementação original da autenticação (`AuthContext.tsx`)
4. Ajuste a página de login para remover as credenciais de teste
5. Verifique se não há outras referências aos dados mockados em outros arquivos 