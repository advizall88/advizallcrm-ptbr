# Documentação de Implementação - AdvizallCRM

## Índice
1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura e Stack Tecnológico](#2-arquitetura-e-stack-tecnológico)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Frontend](#4-frontend)
   - [Componentes](#41-componentes)
   - [Páginas](#42-páginas)
   - [Fluxos de Usuário](#43-fluxos-de-usuário)
5. [Backend e Supabase](#5-backend-e-supabase)
   - [Serviços](#51-serviços)
   - [Integração com Supabase](#52-integração-com-supabase)
6. [Autenticação e Autorização](#6-autenticação-e-autorização)
7. [Recursos e Funcionalidades](#7-recursos-e-funcionalidades)
   - [Gestão de Prospectos](#71-gestão-de-prospectos)
   - [Gestão de Clientes](#72-gestão-de-clientes)
   - [Agendamento de Reuniões](#73-agendamento-de-reuniões)
8. [Integrações Externas](#8-integrações-externas)
   - [Cal.com](#81-calcom)
   - [Google Calendar](#82-google-calendar)
9. [Banco de Dados](#9-banco-de-dados)
10. [Desafios e Soluções](#10-desafios-e-soluções)
11. [Tarefas Pendentes](#11-tarefas-pendentes)

## 1. Visão Geral do Projeto

O AdvizallCRM é um sistema de gerenciamento de relacionamento com clientes (CRM) desenvolvido para a Advizall, uma agência de marketing baseada em Chicago. A plataforma permite capturar leads (prospectos), movê-los através de um pipeline de vendas, e gerenciar clientes ativos e seus projetos.

Os principais objetivos do CRM são:

1. Facilitar a gestão de prospectos através de um sistema de Kanban
2. Permitir a conversão de prospectos em clientes com um único clique
3. Armazenar credenciais técnicas (hosting, domínio, redes sociais) com acesso controlado por papel
4. Agendar reuniões e follow-ups via integração com calendário
5. Gerenciar projetos e pagamentos de clientes
6. Fornecer uma interface intuitiva, responsiva e eficiente

O sistema foi implementado como uma aplicação web moderna utilizando React, TypeScript, e diversas bibliotecas para UI, gerenciamento de estado, e integrações externas.

## 2. Arquitetura e Stack Tecnológico

O AdvizallCRM segue uma arquitetura moderna de aplicação web com um frontend React que se comunica com um backend baseado em Supabase. Abaixo estão os principais componentes tecnológicos utilizados:

### Frontend
- **Framework**: React 18 com TypeScript
- **Bundler**: Vite
- **UI Components**: 
  - shadcn/ui (componentes reutilizáveis baseados em Radix UI)
  - Tailwind CSS para estilização
  - Lucide React para ícones
- **Gerenciamento de Estado**:
  - TanStack Query (React Query) para gerenciamento de estado do servidor
  - React Context para estado global (autenticação, temas)
  - useState e useReducer para estado local
- **Formulários e Validação**:
  - React Hook Form para gerenciamento de formulários
  - Zod para validação de esquemas
- **Roteamento**: React Router Dom
- **Drag and Drop**: react-beautiful-dnd para o quadro Kanban
- **Calendário e Datas**:
  - date-fns para manipulação de datas
  - Componentes personalizados para seleção de data e hora
- **Notificações**: Sonner para toasts de notificação

### Backend
- **Plataforma**: Supabase (BaaS - Backend as a Service)
- **Banco de Dados**: PostgreSQL hospedado no Supabase
- **Autenticação**: Supabase Auth
- **Armazenamento**: Supabase Storage
- **Segurança**: Row-Level Security (RLS) para controle de acesso granular

### Integrações
- **Cal.com**: Para agendamento de reuniões
- **Google Calendar**: (Planejado) Para sincronização de eventos
- **SendGrid**: (Planejado) Para envio de emails transacionais

### DevOps
- **Controle de Versão**: Git/GitHub
- **Ambiente de Desenvolvimento**: Node.js, npm/yarn

### Arquitetura de Dados
- Modelo relacional com tabelas para usuarios, prospectos, clientes, credenciais, projetos, tarefas, pagamentos e reuniões
- RLS (Row-Level Security) para controlar o acesso baseado em papéis de usuário
- PostgreSQL para consultas avançadas e triggers

## 3. Estrutura do Projeto

O projeto segue uma estrutura organizada que separa claramente componentes, páginas, serviços e utilitários:

```
advizall-flow-hub/
├── conhecimento/           # Documentação do projeto 
├── public/                 # Arquivos estáticos
├── src/
│   ├── assets/             # Imagens, ícones e outros recursos
│   ├── components/         # Componentes reutilizáveis
│   │   ├── calendar/       # Componentes relacionados ao calendário
│   │   ├── clients/        # Componentes específicos para clientes
│   │   ├── layout/         # Componentes de layout (Sidebar, Topbar)
│   │   ├── prospects/      # Componentes específicos para prospectos
│   │   └── ui/             # Componentes de UI básicos (shadcn/ui)
│   ├── contexts/           # Contextos React (AuthContext, etc.)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Bibliotecas e utilitários
│   │   └── supabase.ts     # Cliente Supabase
│   ├── pages/              # Páginas principais da aplicação
│   ├── services/           # Serviços para comunicação com APIs
│   ├── styles/             # Estilos globais
│   ├── types/              # Definições de tipos TypeScript
│   ├── App.tsx             # Componente raiz
│   ├── main.tsx            # Ponto de entrada da aplicação
│   └── vite-env.d.ts       # Declarações de ambiente Vite
├── .env                    # Variáveis de ambiente
├── index.html              # HTML raiz
├── package.json            # Dependências e scripts
├── tailwind.config.js      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração do TypeScript
└── vite.config.ts          # Configuração do Vite
```

### Arquivos Importantes

- **src/lib/supabase.ts**: Configura a conexão com o Supabase
- **src/contexts/AuthContext.tsx**: Gerencia a autenticação e o usuário atual
- **src/components/layout/AppLayout.tsx**: Layout principal da aplicação
- **src/components/layout/Sidebar.tsx**: Barra lateral de navegação
- **src/pages/*.tsx**: Páginas principais (Dashboard, Prospects, Clients, etc.)
- **src/services/*.ts**: Serviços para comunicação com o backend

## 4. Frontend

O frontend do AdvizallCRM é construído com React e TypeScript, com foco em componentes reutilizáveis, tipagem estática e uma experiência de usuário moderna.

### 4.1 Componentes

#### Componentes de Layout

- **AppLayout**: Wrapper principal que inclui a Sidebar e Topbar, criando a estrutura básica da aplicação. Responsivo para desktops, tablets e dispositivos móveis.

- **Sidebar**: Menu lateral que contém navegação principal da aplicação:
  - Logo e nome do app "Advizall CRM"
  - Links para Dashboard, Prospects, Clients, Meetings, Settings
  - Indicação visual de item ativo
  - Versão colapsada em dispositivos móveis

- **Topbar**: Barra superior com:
  - Título em dispositivos móveis
  - Botão "Quick Add" para criar rapidamente prospectos ou reuniões
  - Menu dropdown do usuário com acesso a perfil e logout

#### Componentes de Prospectos

- **ProspectCard**: Card para exibir informações de prospectos no quadro Kanban:
  - Nome do contato e empresa
  - Indicador de classificação (1-5 estrelas)
  - Informações de contato
  - Data do próximo follow-up
  - Menu de ações (editar, ver detalhes, converter para cliente)
  - Botão para agendar reunião

- **ProspectFormDialog**: Modal para criação e edição de prospectos:
  - Formulários validados com React Hook Form e Zod
  - Campos para informações de contato, empresa e detalhes do lead
  - Seleção de data para próximo follow-up

- **ProspectDetailsDialog**: Modal que exibe informações detalhadas de um prospecto:
  - Informações de contato e empresa
  - Detalhes do lead (fonte, pontuação, datas)
  - Resumo de chamadas e notas
  - Botões para editar, converter para cliente e agendar reunião
  - Verificação se já é um cliente para evitar conversões duplicadas

- **KanbanColumn**: Coluna para o quadro Kanban que agrupa prospectos por status:
  - Título da coluna e contagem de prospectos
  - Lista de ProspectCards
  - Suporte a drag-and-drop

#### Componentes de Clientes

- **ClientCard**: Card para exibir informações básicas de clientes:
  - Nome do contato e empresa
  - Valor mensal do contrato
  - Informações de contato
  - Botões para ver detalhes e agendar reunião

- **ClientDetailTabs**: Interface com abas para visualizar diferentes aspectos de um cliente:
  - Aba Overview: Informações gerais do cliente
  - Aba Credentials: Credenciais técnicas (visível apenas para moderadores e admins)
  - Aba Projects: Projetos do cliente com status
  - Aba Finance: Pagamentos e valores de contrato
  - Aba Files: Documentos armazenados

#### Componentes de Calendário e Reuniões

- **ScheduleMeetingDialog**: Modal para agendar reuniões:
  - Interface com abas para agendamento manual ou via Cal.com
  - Seleção de data e hora com componentes personalizados
  - Configuração de título, duração e notas
  - Opções para associar com cliente ou prospecto

- **CalEmbed**: Componente para incorporar o widget do Cal.com:
  - Configuração dinâmica do link de agendamento
  - Pré-preenchimento de informações do participante
  - Integração com a API do Cal.com

- **TimePicker**: Componente personalizado para seleção de hora:
  - Interface com botões para incrementar/decrementar horas e minutos
  - Validação de formato de hora
  - Entrada manual ou através de controles

#### Componentes de UI (shadcn/ui)

O projeto utiliza extensivamente componentes do shadcn/ui, incluindo:

- **Dialog/Modal**: Para janelas modais como formulários e detalhes
- **Button**: Botões com variantes (primary, secondary, outline, destructive)
- **Card**: Para exibir informações agrupadas
- **Form**: Componentes de formulário integrados com React Hook Form
- **Tabs**: Para interfaces com múltiplas visualizações
- **Toast**: Para notificações temporárias
- **Badge**: Para indicadores de status
- **Popover**: Para menus e seletores
- **Dropdown**: Para menus contextuais
- **Calendar**: Para seleção de datas
- **Input/Textarea**: Para campos de texto e áreas de texto

### 4.2 Páginas

#### Dashboard

A página Dashboard (`src/pages/Dashboard.tsx`) serve como ponto de entrada principal e fornece uma visão geral da atividade do CRM:

- Cards de estatísticas:
  - Total de Prospectos
  - Clientes Ativos
  - Reuniões Agendadas
  - Receita
- Gráfico de funil de conversão mostrando taxas de conversão entre estágios
- Lista de prospectos recentes para acesso rápido
- Lista de próximos compromissos
- Interface responsiva adaptada para desktop e mobile

#### Prospects

A página Prospects (`src/pages/Prospects.tsx`) é o centro de gerenciamento de leads:

- Filtros e opções de busca
- Quadro Kanban com colunas para cada status (New, Interested, Negotiation, Lost)
- Funcionalidade de drag-and-drop para mover prospectos entre estágios
- Botão para adicionar novos prospectos
- Modal de criação e edição de prospectos
- Funcionalidade para converter prospectos em clientes
- Modal para visualizar detalhes de prospectos
- Integração com o componente de agendamento de reuniões

Recursos implementados:
- Verificação para evitar conversão de prospectos que já são clientes
- Cálculo automático de datas formatadas
- Validação de formulários
- Confirmação para operações críticas (conversão para cliente)
- Exibição de estrelas para representação visual da pontuação

#### Clients

A página Clients (`src/pages/Clients.tsx`) gerencia clientes ativos:

- Lista de clientes com cards
- Filtros e busca
- Visualização detalhada de cliente com sistema de abas
- Acesso a credenciais (protegido por papel de usuário)
- Gerenciamento de projetos e tarefas
- Visualização de informações financeiras
- Armazenamento de documentos
- Integração com agendamento de reuniões

Implementação especial:
- Sistema de abas para organizar diferentes aspectos do cliente
- Proteção de credenciais com base no papel do usuário
- Formatação de valores financeiros
- Exibição de badges coloridos para status

#### Meetings

A página Meetings (`src/pages/Meetings.tsx`) centraliza o agendamento e visualização de reuniões:

- Lista de reuniões agendadas
- Filtros por tipo (cliente, prospecto)
- Interface para agendar novas reuniões
- Opção para usar o Cal.com ou agendar manualmente
- Visualização de links de reunião (Google Meet)

### 4.3 Fluxos de Usuário

#### Fluxo de Criação e Gestão de Prospectos

1. Usuário acessa a página Prospects
2. Clica em "Add Prospect" para abrir o modal de criação
3. Preenche os dados do prospecto e salva
4. O prospecto aparece na coluna "New" do quadro Kanban
5. O usuário pode:
   - Arrastar o prospecto entre colunas para atualizar o status
   - Clicar em "View Details" para ver informações completas
   - Clicar em "Edit" para modificar informações
   - Clicar em "Schedule Meeting" para agendar uma reunião
   - Clicar em "Convert to Client" para transformar em cliente

#### Fluxo de Conversão de Prospecto para Cliente

1. Usuário visualiza detalhes do prospecto
2. Clica em "Convert to Client"
3. Um diálogo de confirmação é exibido
4. Ao confirmar, o sistema:
   - Copia os dados do prospecto para a tabela de clientes
   - Atualiza o status do prospecto
   - Redireciona para a página de detalhes do novo cliente
   - Mostra confirmação de sucesso

#### Fluxo de Agendamento de Reunião

1. Usuário pode iniciar o agendamento a partir de:
   - Card de prospecto
   - Detalhes do prospecto
   - Card de cliente
   - Detalhes do cliente
   - Página de reuniões
2. Modal de agendamento é aberto com duas opções:
   - Agendamento manual: usuário seleciona data, hora e duração
   - Cal.com: usuário utiliza o widget incorporado
3. Após confirmar o agendamento:
   - A reunião é criada no sistema
   - Um evento é criado no calendário (via Cal.com ou integração direta)
   - Participantes recebem notificação
   - Uma confirmação é exibida ao usuário

## 5. Backend e Supabase

O backend do AdvizallCRM é implementado usando o Supabase, uma plataforma de Backend as a Service (BaaS) que oferece um banco de dados PostgreSQL, autenticação, armazenamento e outras funcionalidades.

### 5.1 Serviços

Os serviços são implementados como módulos JavaScript/TypeScript que encapsulam a comunicação com o Supabase e outras APIs. Estes serviços seguem um padrão comum e são usados pelos componentes React através de React Query.

#### Estrutura Geral de um Serviço

```typescript
import { supabase } from '@/lib/supabase';
import { Type, TypeFormData } from '@/lib/types';

export const exampleService = {
  // Obter lista de itens
  async getItems(): Promise<Type[]> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Obter um item específico
  async getItem(id: string): Promise<Type> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Criar um novo item
  async createItem(formData: TypeFormData): Promise<Type> {
    const { data, error } = await supabase
      .from('table_name')
      .insert(formData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Atualizar um item existente
  async updateItem(id: string, formData: Partial<TypeFormData>): Promise<Type> {
    const { data, error } = await supabase
      .from('table_name')
      .update(formData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Excluir um item
  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
```

#### Serviços Implementados

##### prospectService

O `prospectService` gerencia a criação, leitura, atualização e exclusão de prospectos:

```typescript
export const prospectService = {
  async getProspects(): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getProspect(id: string): Promise<Prospect> {
    // Implementação
  },
  
  async createProspect(formData: ProspectFormData): Promise<Prospect> {
    // Implementação
  },
  
  async updateProspect(id: string, formData: Partial<ProspectFormData>): Promise<Prospect> {
    // Implementação
  },
  
  async deleteProspect(id: string): Promise<void> {
    // Implementação
  },
  
  async updateProspectStatus(id: string, status: ProspectStatus): Promise<Prospect> {
    // Implementação
  },
  
  async convertToClient(prospect: Prospect): Promise<Client> {
    // Implementação para converter prospecto em cliente
    // Inclui criação de registro na tabela clients
  },
  
  async checkIfProspectIsClient(prospectId: string): Promise<boolean> {
    // Verifica se o prospecto já foi convertido para cliente
  }
};
```

##### clientService

O `clientService` gerencia clientes e seus dados relacionados:

```typescript
export const clientService = {
  async getClients(): Promise<Client[]> {
    // Implementação
  },
  
  async getClient(id: string): Promise<Client> {
    // Implementação
  },
  
  async createClient(formData: ClientFormData): Promise<Client> {
    // Implementação
  },
  
  async updateClient(id: string, formData: Partial<ClientFormData>): Promise<Client> {
    // Implementação
  },
  
  async deleteClient(id: string): Promise<void> {
    // Implementação
  },
  
  // Métodos para credenciais
  async getCredentials(clientId: string): Promise<Credential[]> {
    // Implementação específica para permissões baseadas em papel
  },
  
  async createCredential(clientId: string, data: CredentialFormData): Promise<Credential> {
    // Implementação
  },
  
  // Métodos para projetos
  async getProjects(clientId: string): Promise<Project[]> {
    // Implementação
  },
  
  // Métodos para pagamentos
  async getPayments(clientId: string): Promise<Payment[]> {
    // Implementação
  }
};
```

##### calendarService

O `calendarService` gerencia a criação e manipulação de reuniões e integração com o Cal.com:

```typescript
export const calendarService = {
  async createMeeting(meetingData: MeetingFormData) {
    // Implementação que chama a API do Cal.com e depois salva no Supabase
  },
  
  async updateMeeting(id: string, meetingData: Partial<MeetingFormData>) {
    // Implementação
  },
  
  async deleteMeeting(id: string) {
    // Implementação
  },
  
  getSchedulingLink(eventTypeSlug = '30min') {
    // Retorna o link do Cal.com para incorporação
  },
  
  getEmbedHtml(eventTypeSlug = '30min', prefillData = {}) {
    // Gera o HTML para incorporar o widget do Cal.com
  }
};
```

### 5.2 Integração com Supabase

#### Inicialização do Cliente Supabase

O cliente Supabase é configurado em `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Uso do React Query para Gerenciamento de Estado

O TanStack Query (React Query) é usado para gerenciar o estado do servidor, fornecendo caching, revalidação automática, e estado de loading/error:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prospectService } from '@/services/prospectService';

// Exemplo de uso em um componente
function ProspectsList() {
  // Query para buscar prospectos
  const { data: prospects, isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: prospectService.getProspects
  });
  
  // QueryClient para invalidação
  const queryClient = useQueryClient();
  
  // Mutation para criar prospecto
  const createProspectMutation = useMutation({
    mutationFn: (data: ProspectFormData) => prospectService.createProspect(data),
    onSuccess: () => {
      // Invalidar queries para refetching
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    }
  });
  
  // Resto do componente...
}
```

#### Row-Level Security (RLS)

O Supabase utiliza políticas RLS do PostgreSQL para controlar o acesso aos dados. As políticas para o AdvizallCRM incluem:

- **Usuários** podem visualizar e editar apenas seus próprios prospectos e clientes
- **Moderadores** podem visualizar e editar todos os prospectos e clientes
- **Administradores** têm acesso completo a todos os dados
- **Credenciais** são visíveis apenas para moderadores e administradores

## 6. Autenticação e Autorização

A autenticação no AdvizallCRM é implementada utilizando o Supabase Auth, que fornece um sistema completo de autenticação e gerenciamento de sessão.

### Implementação da Autenticação

O sistema de autenticação é gerenciado através do `AuthContext`, que fornece:

- Estado do usuário atual
- Funções para login e logout
- Verificação de papel do usuário
- Persistência de sessão

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isModerator: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          // Buscar dados completos do usuário
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Ouvir mudanças de autenticação
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Buscar dados completos do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isModerator = () => user?.role === 'moderator' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin, isModerator }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
```

### Proteção de Rotas

As rotas que exigem autenticação são protegidas utilizando componentes de proteção:

```typescript
// src/components/layout/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

### Controle de Acesso Baseado em Papel

O acesso a determinadas funcionalidades e dados é controlado com base no papel do usuário:

- **User**: Acesso básico a prospectos e clientes próprios
- **Moderator**: Acesso a todos os prospectos e clientes, incluindo credenciais
- **Admin**: Acesso completo, incluindo gerenciamento de usuários

Este controle é implementado em dois níveis:

1. **Frontend**: Componentes condicionais que verificam o papel do usuário
2. **Backend**: Políticas RLS no Supabase que filtram dados com base no papel

Exemplo de controle de acesso no frontend:

```tsx
import { useAuth } from '@/contexts/AuthContext';

const CredentialsSection = ({ clientId }: { clientId: string }) => {
  const { isModerator } = useAuth();
  
  if (!isModerator()) {
    return (
      <div className="p-4 text-center">
        <p>Você não tem permissão para visualizar credenciais</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Conteúdo visível apenas para moderadores e admins */}
    </div>
  );
};
```

### Políticas RLS no Supabase

As políticas RLS (Row-Level Security) do PostgreSQL são configuradas no Supabase para restringir o acesso aos dados:

```sql
-- Exemplo de política para tabela prospects
CREATE POLICY "Usuários visualizam seus próprios prospectos"
ON public.prospects
FOR SELECT
USING (
  auth.uid() = owner_id OR
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (role = 'moderator' OR role = 'admin')
  )
);

-- Exemplo de política para tabela credentials
CREATE POLICY "Apenas moderadores e admins visualizam credenciais"
ON public.credentials
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (role = 'moderator' OR role = 'admin')
  )
);
```

## 7. Recursos e Funcionalidades

### 7.1 Gestão de Prospectos

A gestão de prospectos é uma das funcionalidades centrais do AdvizallCRM, permitindo que a equipe de vendas acompanhe e gerencie leads de forma visual e eficiente.

#### Quadro Kanban

O quadro Kanban é a principal interface para gerenciar prospectos. Ele organiza os prospectos em colunas que representam diferentes estágios do funil de vendas:

- **New**: Novos contatos que ainda não foram qualificados
- **Interested**: Prospectos que demonstraram interesse
- **Negotiation**: Prospectos em fase de negociação
- **Lost**: Oportunidades perdidas

A interface de Kanban permite:

- **Visualização rápida**: Ver todos os prospectos organizados por estágio
- **Drag and Drop**: Mover prospectos entre estágios arrastando os cards
- **Filtragem**: Filtrar prospectos por vários critérios
- **Contagem**: Ver o número de prospectos em cada estágio

#### Gerenciamento de Follow-ups

O sistema permite agendar e acompanhar follow-ups com prospectos:

- Definição de data para próximo contato
- Visualização de próximos follow-ups no dashboard
- Resumo de interações anteriores
- Possibilidade de agendar reuniões diretamente a partir do card do prospecto

#### Pontuação de Leads

Os prospectos podem ser classificados com uma pontuação de 1 a 5 estrelas, ajudando a equipe a priorizar os leads mais promissores:

- Representação visual com estrelas
- Filtro por pontuação
- Ajuda na priorização de esforços de vendas

#### Conversão para Cliente

O processo de conversão de prospecto para cliente é simplificado e ocorre com apenas alguns cliques:

1. Verificação automática para evitar duplicação
2. Transferência de todos os dados do prospecto para o registro do cliente
3. Atualização do status do prospecto
4. Criação automática de projetos iniciais (se configurado)
5. Notificação de sucesso após a conversão

### 7.2 Gestão de Clientes

A gestão de clientes permite acompanhar e gerenciar relacionamentos com clientes ativos após a conversão de prospectos.

#### Informações Gerais

Cada cliente possui uma página detalhada com várias informações:

- Dados de contato completos
- Histórico de interações
- Valor do contrato
- Status atual
- Links para reuniões e projetos

#### Sistema de Abas

A interface de cliente utiliza um sistema de abas para organizar diferentes aspectos do relacionamento:

- **Overview**: Visão geral do cliente
- **Credentials**: Credenciais técnicas (visível apenas para moderadores/admins)
- **Projects**: Lista de projetos e seu status
- **Finance**: Informações financeiras e pagamentos
- **Files**: Documentos e arquivos relacionados ao cliente

#### Gerenciamento de Credenciais

O sistema permite o armazenamento seguro de credenciais técnicas, com controle de acesso baseado em papel:

- Credenciais para hosting, domínio, redes sociais, etc.
- Visibilidade restrita a moderadores e administradores
- Toggle para mostrar/ocultar senhas
- Segurança adicional via políticas RLS no banco de dados

#### Projetos e Tarefas

Cada cliente pode ter múltiplos projetos associados:

- Projetos organizados por tipo de serviço
- Status visual (todo, doing, done)
- Tarefas associadas a cada projeto
- Responsáveis e prazos

#### Finanças

A aba de finanças mostra informações financeiras do cliente:

- Valor mensal do contrato
- Orçamento para anúncios
- Histórico de pagamentos
- Status de pagamentos (pago, pendente, atrasado)

### 7.3 Agendamento de Reuniões

O sistema de agendamento de reuniões foi implementado utilizando duas abordagens complementares:

#### Agendamento Manual

O agendamento manual permite criar reuniões diretamente no sistema:

- Seleção de data e hora
- Definição de duração
- Vinculação a cliente ou prospecto
- Geração de link para videoconferência
- Notificações para participantes

#### Integração com Cal.com

A integração com o Cal.com permite um fluxo de agendamento mais avançado:

- Widget do Cal.com incorporado na aplicação
- Prefenchimento automático de dados do participante
- Seleção de horários disponíveis
- Sincronização bidirecional com o banco de dados
- Confirmações automatizadas por email

#### Webhook para Eventos de Calendário

Um webhook foi configurado para receber eventos do Cal.com:

- Criação de registro no banco de dados quando uma reunião é agendada
- Atualização de registros quando reuniões são modificadas
- Exclusão de registros quando reuniões são canceladas
- Processamento de metadados personalizados

## 8. Integrações Externas

### 8.1 Cal.com

O AdvizallCRM integra-se com o Cal.com para fornecer uma experiência avançada de agendamento de reuniões. Esta integração consiste em duas partes principais: o widget incorporado e o webhook para eventos.

#### Widget de Agendamento

O widget do Cal.com é incorporado diretamente na aplicação:

```tsx
// src/components/calendar/CalEmbed.tsx
import { useEffect, useRef } from 'react';

type CalEmbedProps = {
  calLink: string;
  config?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: 'light' | 'dark';
  };
};

const CalEmbed = ({ calLink, config = {} }: CalEmbedProps) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embedRef.current) return;

    // @ts-ignore
    if (window.Cal) {
      // @ts-ignore
      window.Cal('inline', {
        elementOrSelector: embedRef.current,
        calLink,
        config: {
          theme: config.theme || 'light',
          hideEventTypeDetails: false,
          name: config.name,
          email: config.email,
          notes: config.notes,
          guests: config.guests,
        },
      });
    }
  }, [calLink, config]);

  return (
    <div className="w-full min-h-[70vh]">
      <div 
        ref={embedRef} 
        className="w-full h-full" 
        style={{ height: '100%', overflow: 'hidden' }}
      />
    </div>
  );
};

export default CalEmbed;
```

Este componente é utilizado no `ScheduleMeetingDialog` para permitir que os usuários agendem reuniões diretamente do CRM:

```tsx
// Exemplo de uso no ScheduleMeetingDialog
<Tabs defaultValue="cal">
  <TabsList>
    <TabsTrigger value="cal">Cal.com</TabsTrigger>
    <TabsTrigger value="manual">Manual</TabsTrigger>
  </TabsList>
  
  <TabsContent value="cal">
    <CalEmbed
      calLink={`${import.meta.env.VITE_CAL_USER_ID}/30min`}
      config={{
        name: attendeeName,
        email: attendeeEmail,
        notes: `Meeting with ${attendeeName} from ${companyName || 'N/A'}`,
      }}
    />
  </TabsContent>
  
  <TabsContent value="manual">
    {/* Formulário de agendamento manual */}
  </TabsContent>
</Tabs>
```

#### Webhook para Eventos do Calendário

Um webhook foi configurado para receber e processar eventos do Cal.com:

1. **Configuração no Cal.com**:
   - Webhook URL: `https://advizall-flow-hub.vercel.app/api/cal-webhook`
   - Eventos: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
   - Secret para verificação de assinatura

2. **Implementação do endpoint de API**:

```typescript
// src/pages/api/cal-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyCalWebhook } from '@/lib/calVerification';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verificar assinatura do webhook
  const signature = req.headers['x-cal-signature-256'] as string;
  if (!verifyCalWebhook(req.body, signature)) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const event = req.body;
  const { type, payload } = event;

  try {
    // Processar eventos
    switch (type) {
      case 'BOOKING_CREATED':
        await handleBookingCreated(payload);
        break;
      case 'BOOKING_RESCHEDULED':
        await handleBookingRescheduled(payload);
        break;
      case 'BOOKING_CANCELLED':
        await handleBookingCancelled(payload);
        break;
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
}

async function handleBookingCreated(payload: any) {
  // Extrair informações do payload
  const {
    uid: calendar_event_id,
    startTime,
    endTime,
    title,
    metadata,
    attendees,
    location,
  } = payload;

  // Detectar se é relacionado a prospect ou cliente
  const { prospectId, clientId } = metadata || {};

  // Criar registro de reunião no banco de dados
  await supabase.from('meetings').insert({
    calendar_event_id,
    title,
    starts_at: new Date(startTime).toISOString(),
    ends_at: new Date(endTime).toISOString(),
    prospect_id: prospectId || null,
    client_id: clientId || null,
    meet_link: location?.includes('meet.google.com') ? location : null,
    attendees: attendees.map((a: any) => a.email).join(','),
    status: 'scheduled',
  });
}

// Implementações para rescheduled e cancelled...
```

3. **Utilização dos dados**:
   - Reuniões agendadas são exibidas no dashboard
   - Links de reunião são acessíveis a partir dos cards de cliente/prospecto
   - Notificações são enviadas para os usuários relevantes

### 8.2 Google Calendar

A integração com o Google Calendar é realizada em duas camadas:

1. **Via Cal.com**: O Cal.com já se integra com o Google Calendar, sincronizando eventos.

2. **Direta (planejada)**: Integração direta utilizando a API do Google Calendar está em desenvolvimento.

```typescript
// Exemplo de integração direta (planejada)
import { google } from 'googleapis';

export async function createGoogleCalendarEvent(
  title: string,
  startDateTime: string,
  endDateTime: string,
  attendeeEmail: string,
  description: string
) {
  // Configurar autenticação
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  
  const calendar = google.calendar({ version: 'v3', auth });
  
  // Criar evento
  const event = {
    summary: title,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: 'America/Chicago',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'America/Chicago',
    },
    attendees: [
      { email: attendeeEmail },
      { email: 'meetings@advizall.com' }
    ],
    conferenceData: {
      createRequest: {
        requestId: `advizall-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };
  
  const response = await calendar.events.insert({
    calendarId: 'meetings@advizall.com',
    conferenceDataVersion: 1,
    requestBody: event
  });
  
  return {
    id: response.data.id,
    meetLink: response.data.hangoutLink,
    htmlLink: response.data.htmlLink
  };
}
</code_block_to_apply_changes_from>

## 9. Banco de Dados

O AdvizallCRM utiliza o PostgreSQL do Supabase como banco de dados, aproveitando os recursos avançados como Row-Level Security (RLS) e funções SQL para implementar a lógica de negócios.

### Modelo de Dados

O banco de dados é composto por várias tabelas inter-relacionadas:

```
users
├── id (PK)
├── name
├── email
├── role (enum: user, moderator, admin)
├── created_at
└── last_login_at

prospects
├── id (PK)
├── owner_id (FK -> users.id)
├── contact_name
├── company_name
├── phone
├── email
├── lead_source
├── business_type
├── region_city
├── region_state
├── score (1-5)
├── status (enum: new, interested, negotiation, lost)
├── first_contact_at
├── call_summary
├── notes
├── next_follow_up_at
├── timezone
└── created_at

clients
├── id (PK)
├── owner_id (FK -> users.id)
├── contact_name
├── company_name
├── phone
├── email
├── full_address
├── website
├── social_links (JSON)
├── plan_name
├── monthly_fee
├── ad_budget
└── created_at

credentials
├── id (PK)
├── client_id (FK -> clients.id)
├── system_type (enum: hosting, domain, social, other)
├── login
├── password
├── notes
└── created_at

projects
├── id (PK)
├── client_id (FK -> clients.id)
├── service_type (enum: website, paid_ads, organic, branding, biz_org)
├── description
├── status (enum: todo, doing, done)
├── deadline
└── created_at

tasks
├── id (PK)
├── project_id (FK -> projects.id)
├── title
├── description
├── status (enum: todo, doing, done)
├── due_at
├── assignee_id (FK -> users.id)
└── created_at

payments
├── id (PK)
├── client_id (FK -> clients.id)
├── amount
├── description
├── invoice_date
├── due_date
├── paid (boolean)
├── paid_at
└── created_at

meetings
├── id (PK)
├── client_id (FK -> clients.id, nullable)
├── prospect_id (FK -> prospects.id, nullable)
├── title
├── starts_at
├── ends_at
├── calendar_event_id
├── meet_link
├── notes
├── created_by_id (FK -> users.id)
└── created_at
```

### Políticas de Segurança (RLS)

O controle de acesso aos dados é gerenciado via RLS (Row-Level Security) do PostgreSQL, permitindo definir políticas detalhadas por tabela e operação:

```sql
-- Exemplo de políticas para a tabela prospects
CREATE POLICY "Users can view their own prospects" ON public.prospects
    FOR SELECT USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND (role = 'moderator' OR role = 'admin')
        )
    );

CREATE POLICY "Users can insert their own prospects" ON public.prospects
    FOR INSERT WITH CHECK (
        auth.uid() = owner_id
    );

CREATE POLICY "Users can update their own prospects" ON public.prospects
    FOR UPDATE USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND (role = 'moderator' OR role = 'admin')
        )
    );

-- Políticas específicas para credenciais
CREATE POLICY "Only moderators and admins can view credentials" ON public.credentials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND (role = 'moderator' OR role = 'admin')
        )
    );
```

### Funções e Triggers

Foram implementadas funções SQL para operações complexas como a conversão de prospecto para cliente:

```sql
CREATE OR REPLACE FUNCTION convert_prospect_to_client(prospect_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_client_id UUID;
    prospect_record public.prospects;
BEGIN
    -- Obter dados do prospecto
    SELECT * INTO prospect_record
    FROM public.prospects
    WHERE id = prospect_id;
    
    -- Inserir novo cliente
    INSERT INTO public.clients (
        id,
        owner_id,
        contact_name,
        company_name,
        phone,
        email,
        region_city,
        region_state,
        business_type,
        created_at
    ) VALUES (
        uuid_generate_v4(),
        prospect_record.owner_id,
        prospect_record.contact_name,
        prospect_record.company_name,
        prospect_record.phone,
        prospect_record.email,
        prospect_record.region_city,
        prospect_record.region_state,
        prospect_record.business_type,
        NOW()
    )
    RETURNING id INTO new_client_id;
    
    -- Atualizar status do prospecto
    UPDATE public.prospects
    SET status = 'converted'
    WHERE id = prospect_id;
    
    RETURN new_client_id;
END;
$$;
```

## 10. Desafios e Soluções

Durante o desenvolvimento do AdvizallCRM, diversos desafios foram enfrentados e solucionados:

### Desafio 1: Integração com Cal.com

**Problema**: Incorporar o widget do Cal.com e processar eventos de agendamento em tempo real.

**Solução**: 
- Implementação de um componente React para encapsular o widget do Cal.com
- Configuração de um webhook para receber eventos
- Uso de metadados personalizados para vincular agendamentos a prospects/clientes

### Desafio 2: Drag and Drop no Kanban

**Problema**: Implementar drag and drop entre colunas do Kanban mantendo a persistência de dados.

**Solução**:
- Utilização da biblioteca react-beautiful-dnd
- Otimistic UI updates para melhorar a experiência do usuário
- Confirmações visuais de movimentação
- Tratamento de erros com rollback visual

```tsx
// Exemplo de otimistic update
const handleDragEnd = async (result: DropResult) => {
  if (!result.destination) return;
  
  const { source, destination, draggableId } = result;
  
  // Se não mudou de coluna, não precisa atualizar
  if (source.droppableId === destination.droppableId) return;
  
  // Status de origem e destino
  const sourceStatus = source.droppableId as ProspectStatus;
  const destinationStatus = destination.droppableId as ProspectStatus;
  
  // Atualiza estado local imediatamente (otimistic update)
  setGroupedProspects(prev => {
    const newGroups = { ...prev };
    
    // Remover da origem
    const [moved] = newGroups[sourceStatus].splice(source.index, 1);
    
    // Adicionar ao destino
    newGroups[destinationStatus].splice(destination.index, 0, {
      ...moved,
      status: destinationStatus
    });
    
    return newGroups;
  });
  
  try {
    // Atualiza no banco de dados
    await prospectService.updateProspectStatus(draggableId, destinationStatus);
    // Atualiza queries
    queryClient.invalidateQueries({ queryKey: ['prospects'] });
  } catch (error) {
    // Rollback em caso de erro
    toast.error('Erro ao atualizar status. Tente novamente.');
    // Re-fetchs dados para restaurar estado
    queryClient.invalidateQueries({ queryKey: ['prospects'] });
  }
};
```

### Desafio 3: Controle de Acesso a Credenciais

**Problema**: Implementar proteção para credenciais técnicas, visíveis apenas para moderadores e admins.

**Solução**:
- Políticas RLS para controle de acesso no backend
- Componentes condicionais no frontend
- Toggle para mostrar/ocultar senhas
- Remoção de credenciais de payloads para usuários regulares

### Desafio 4: Formulários Complexos

**Problema**: Gerenciar formulários complexos com validação robusta.

**Solução**:
- Implementação com React Hook Form e Zod
- Separação em múltiplas etapas/abas para formulários longos
- Validação em tempo real
- Feedback visual claro para erros

```tsx
// Exemplo de validação com Zod
const prospectFormSchema = z.object({
  contact_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  company_name: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos"),
  lead_source: z.enum(["website", "referral", "cold_call", "social_media", "other"]),
  business_type: z.string().min(1, "Tipo de negócio é obrigatório"),
  region_city: z.string().min(1, "Cidade é obrigatória"),
  region_state: z.string().min(1, "Estado é obrigatório"),
  score: z.number().min(1).max(5),
  status: z.enum(["new", "interested", "negotiation", "lost"]),
  notes: z.string().optional(),
  next_follow_up_at: z.date().optional(),
});
```

## 11. Tarefas Pendentes

As seguintes tarefas estão planejadas para as próximas iterações do AdvizallCRM:

### Funcionalidades a Implementar

1. **Dashboards Avançados**:
   - Gráficos de conversão
   - Métricas de desempenho
   - Relatórios personalizáveis

2. **Sistema de Notificações**:
   - Notificações por email para follow-ups
   - Notificações push no navegador
   - Centro de notificações na aplicação

3. **Gerenciamento de Documentos**:
   - Upload e armazenamento de documentos
   - Versionamento de arquivos
   - Visualização inline de PDFs

4. **Integrações Adicionais**:
   - Integração direta com Google Calendar
   - Integração com SendGrid para emails transacionais
   - Conexão com ferramentas de marketing

### Melhorias Técnicas

1. **Refatoração e Otimização**:
   - Melhorar a estrutura de componentes
   - Otimizar queries e cache
   - Reduzir bundle size

2. **Testes Automatizados**:
   - Implementar testes unitários com Vitest
   - Adicionar testes E2E com Playwright
   - Configurar CI/CD para execução de testes

3. **Experiência do Usuário**:
   - Adicionar animações para transições
   - Melhorar responsividade em dispositivos móveis
   - Implementar dark mode

4. **Segurança**:
   - Reforçar políticas RLS
   - Implementar auditoria de ações
   - Revisar permissões de usuários

### Correções de Bugs Conhecidos

1. **Problema de carregamento do widget Cal.com** em alguns navegadores
2. **Inconsistência na atualização do Kanban** após drag-and-drop
3. **Validação de formulários** em cenários específicos
4. **Layout quebrado** em resoluções específicas

### Próximos Passos Imediatos

1. Finalizar implementação do webhook para Cal.com
2. Corrigir bug no componente ClientDetailTabs
3. Adicionar testes para serviços críticos
4. Implementar páginas administrativas 