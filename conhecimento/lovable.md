
# CRM Advizall - Documentação de Implementação

Este documento detalha todos os componentes e funcionalidades já implementados no CRM Advizall, assim como os elementos que ainda precisam ser desenvolvidos. Esta documentação serve como base de conhecimento para entender a estrutura atual do projeto.

## Estrutura Geral do Projeto

O projeto segue uma arquitetura baseada em componentes React com TypeScript, utilizando o Vite como bundler. A estilização é feita com Tailwind CSS e complementada por componentes do shadcn/ui.

### Principais Pastas e Arquivos

- **src/components/**: Contém todos os componentes reutilizáveis
  - **layout/**: Componentes de layout como Sidebar e Topbar
  - **ui/**: Componentes de UI base (shadcn/ui)
- **src/pages/**: Páginas principais do aplicativo
- **src/hooks/**: Hooks personalizados React
- **src/lib/**: Utilitários e funções auxiliares

## Layout da Aplicação

### AppLayout (`src/components/layout/AppLayout.tsx`)

Componente de layout principal que envolve todas as páginas da aplicação. Consiste em:

- **Sidebar**: Menu lateral de navegação, visível apenas em telas médias e maiores
- **Topbar**: Barra superior com nome do aplicativo (em telas móveis), botão de "Quick Add" e menu de usuário
- **Área de conteúdo principal**: Onde as páginas são renderizadas

Funcionalidade:
- Responsividade implementada: sidebar oculta em telas pequenas
- Layout flexível que se adapta a diferentes tamanhos de tela

### Sidebar (`src/components/layout/Sidebar.tsx`)

Menu lateral de navegação com:

- Logo e nome do app "Advizall CRM"
- Links de navegação com ícones:
  - Dashboard
  - Prospects
  - Clients
  - Meetings
  - Settings
- Área de footer com "Powered by Advizall"

Funcionalidade:
- Links ativos por meio do react-router-dom (links funcionais, mas sem lógica de estado ativo)
- Ocultação automática em telas móveis
- Estilização com sombras neumórficas sutis conforme especificação

### Topbar (`src/components/layout/Topbar.tsx`)

Barra superior com:

- Título do app em telas móveis
- Botão "Quick Add +" 
- Menu dropdown do usuário com iniciais "JD"

Funcionalidade:
- Menu dropdown implementado mas sem lógica de autenticação real
- Botão "Quick Add" presente mas sem funcionalidade de modal associada

## Páginas Implementadas

### Dashboard (`src/pages/Dashboard.tsx`)

Página inicial que apresenta uma visão geral do sistema com:

- Cards de estatísticas (Total Prospects, Active Clients, Scheduled Meetings, Revenue)
- Gráfico de funil de conversão
- Lista de prospects recentes
- Lista de próximos compromissos

Status:
- Layout visual implementado
- Dados estáticos (sem integração com backend)
- Gráficos implementados com Recharts
- Componentes de tabela implementados mas com dados fictícios

### Prospects (`src/pages/Prospects.tsx`)

Página de gerenciamento de leads/prospects com:

- Filtros e buscas
- Kanban board para visualizar prospects por estágio (New, Interested, Negotiation, Lost)
- Cards de prospects com informações principais e menu de ações

Status:
- Interface visual implementada
- Layout de Kanban estruturado
- Sem funcionalidade de drag-and-drop implementada
- Sem integração com banco de dados
- Botões de ação presentes mas sem funcionalidade

### Clients (`src/pages/Clients.tsx`)

Página de gerenciamento de clientes com:

- Lista de clientes ativos
- Filtros e busca
- Cards de clientes com informações básicas

Status:
- Interface básica implementada
- Sem navegação detalhada para perfis de clientes
- Sem integração com backend para listar clientes reais
- Sem implementação dos módulos de credenciais, projetos e finanças

### Meetings (`src/pages/Meetings.tsx`)

Página de agendamento e visualização de reuniões:

- Calendário/agenda
- Lista de próximas reuniões
- Botão para agendar nova reunião

Status:
- Layout básico implementado
- Sem integração com Google Calendar
- Modal de criação de reunião não implementado
- Sem funcionalidade de gerar links do Google Meet

## Componentes UI

Todos os componentes do shadcn/ui foram importados e estão disponíveis para uso. Alguns dos principais componentes utilizados incluem:

- **Button**: Botões com várias variantes (default, destructive, outline, etc.)
- **Card**: Componente de card com header, content e footer
- **Tabs**: Sistema de abas para interfaces com múltiplas visualizações
- **Input/Textarea**: Campos de formulário
- **Label**: Etiquetas para campos de formulário
- **Dropdown**: Menus dropdown para ações
- **Badge**: Etiquetas coloridas para status
- **Calendar**: Seletor de data
- **Table**: Tabelas de dados
- **Tooltip**: Dicas de ferramentas

## Fluxos de Usuário e Funcionalidades Pendentes

### Autenticação

**Status: Não implementado**

Funcionalidades pendentes:
- Tela de login
- Registro de usuários
- Recuperação de senha
- Gerenciamento de sessão
- Context API para autenticação
- Row-Level Security com Supabase

### Módulo de Prospects

**Status: Parcialmente implementado (apenas UI)**

Funcionalidades pendentes:
- Criação de novos prospects
- Modal de formulário para novos prospects
- Drag-and-drop para mover entre estágios
- Edição de prospects
- Conversão de prospect para cliente
- Agendamento de follow-up
- Integração com banco de dados (Supabase)

### Módulo de Clientes

**Status: Parcialmente implementado (UI básica)**

Funcionalidades pendentes:
- Página de detalhes do cliente com abas
- Aba de credenciais com visualização protegida por perfil
- Aba de projetos com mini-kanban
- Aba de finanças com listagem de pagamentos
- Aba de arquivos para documentos
- Conversão de prospect para cliente
- Permissões baseadas em perfil de usuário

### Módulo de Reuniões

**Status: Minimamente implementado**

Funcionalidades pendentes:
- Modal de agendamento de reunião
- Integração com Google Calendar via N8n
- Geração automática de links do Google Meet
- Notificações por email
- Listagem de reuniões agendadas

### Integrações Externas

**Status: Não implementado**

Funcionalidades pendentes:
- Integração com Supabase para autenticação e banco de dados
- Integração com N8n para automações
- Integração com Google Calendar e Google Meet
- Integração com SendGrid para emails

## Papéis de Usuário e Permissões

**Status: Não implementado**

Definições implementadas mas sem funcionalidade:
- **User**: Vendedor/gerente de conta regular
- **Moderator**: Staff sênior/líder de equipe
- **Admin**: Proprietário do sistema

Funcionalidades pendentes:
- Controle de acesso baseado em perfil
- Visibilidade de credenciais apenas para Moderator e Admin
- Gerenciamento de usuários (apenas Admin)
- Row-Level Security no Supabase

## Componentes e Elementos Específicos

### Cards de Prospect

Cards exibidos no quadro Kanban com:

- Nome do contato e empresa
- Badge de pontuação (1-5)
- Informações de contato (email/telefone)
- Data do próximo follow-up
- Menu de ações (⋮)

Funcionalidade pendente:
- Menu dropdown com ações (Editar, Converter para Cliente, Arquivar)
- Atualização de informações
- Visualização detalhada em modal

### Quick Add Button

Botão "+" na Topbar para adicionar rapidamente:

Funcionalidade pendente:
- Modal com opções rápidas (Novo Prospect, Nova Reunião, etc.)
- Formulários simplificados

### User Menu

Menu dropdown no avatar de usuário:

Funcionalidade pendente:
- Perfil do usuário
- Configurações
- Logout
- Integração com sistema de autenticação

## Elementos de Design

### Cores principais
- **Primary**: #111827 (cinza escuro)
- **Secondary**: #A855F7 (roxo)
- **Accent**: #22D3EE (azul ciano)

### Sombras
- Sombras neumórficas sutis em alguns elementos como cards e botões

### Responsividade
- Layout responsivo implementado
- Sidebar oculta em dispositivos móveis
- Design adaptável para diferentes tamanhos de tela

## Próximas Etapas de Implementação

1. **Autenticação e Autorização**:
   - Implementar login/registro com Supabase
   - Configurar Row-Level Security

2. **Banco de Dados**:
   - Configurar tabelas Supabase conforme modelo de dados
   - Implementar funções RPC para operações complexas

3. **Integração com Backend**:
   - Conectar interfaces a dados reais
   - Implementar operações CRUD em todos os módulos

4. **Automações**:
   - Configurar N8n para integração com Google Calendar
   - Implementar notificações por email

5. **Refinar UI/UX**:
   - Adicionar animações de transição
   - Implementar mensagens de feedback (toasts)
   - Completar todos os fluxos de usuário

6. **Testes**:
   - Implementar testes unitários e E2E
   - Validar todos os fluxos de usuário

## Considerações Técnicas

- O projeto está configurado para usar TanStack Query para gerenciamento de estado de dados
- Todos os formulários devem usar react-hook-form + zod para validação
- As integrações externas serão feitas através de N8n
- O banco de dados usará Supabase com PostgreSQL

## Conclusão

O CRM Advizall possui uma estrutura básica implementada com foco na interface de usuário. A maioria dos componentes visuais está em lugar, mas a funcionalidade real ainda precisa ser implementada, especialmente no que diz respeito à integração com banco de dados, autenticação e integrações externas. A próxima fase de desenvolvimento deve focar em transformar esta estrutura visual em um aplicativo totalmente funcional.
