# Implementação do Cal.com na Plataforma Advizall

## Visão Geral

O Cal.com foi implementado como um widget embutido na forma de iframe para facilitar o agendamento de reuniões com clientes e prospects. A integração foi feita através de um componente reutilizável que pode ser chamado de qualquer parte da aplicação.

## Arquivos e Componentes

### 1. Componente Principal: `CalendarWidget.tsx`

**Localização:** `src/components/meetings/CalendarWidget.tsx`

Este é o componente central que encapsula toda a funcionalidade do Cal.com. O componente:

- Carrega dinamicamente o script do Cal.com quando o modal é aberto
- Remove o script quando o modal é fechado para evitar conflitos
- Aceita um prop `calLink` que pode ser personalizado para diferentes calendários
- É implementado como um modal/dialog para proporcionar boa experiência ao usuário
- Possui tamanho responsivo e fixo para garantir boa visualização

```jsx
// Trecho principal de como o widget é carregado
useEffect(() => {
  if (open) {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.onload = () => {
      if (window.Cal) {
        window.Cal.init();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }
}, [open]);
```

O componente também define um tipo global para garantir a disponibilidade do objeto `Cal` no escopo do navegador:

```typescript
declare global {
  interface Window {
    Cal?: {
      init: () => void;
    }
  }
}
```

### 2. Integração na Página de Reuniões: `Meetings.tsx`

**Localização:** `src/pages/Meetings.tsx`

A página de Meetings implementa o botão principal "+ Schedule Meeting" que abre o widget do Cal.com:

```jsx
const [calendarOpen, setCalendarOpen] = useState(false);

// ...

<Button 
  variant="default" 
  className="bg-secondary hover:bg-secondary/90"
  onClick={() => setCalendarOpen(true)}
>
  + Schedule Meeting
</Button>

// ...

<CalendarWidget 
  open={calendarOpen}
  onOpenChange={setCalendarOpen}
  calLink="andre-uu15wu"
/>
```

### 3. Integração na Visão de Cliente: `Overview.tsx`

**Localização:** `src/components/clients/tabs/Overview.tsx`

O componente Overview, que exibe os detalhes de um cliente, também integra o CalendarWidget permitindo agendar reuniões diretamente da página de detalhes do cliente:

```jsx
const [calendarOpen, setCalendarOpen] = useState(false);

// ...

<Button variant="outline" onClick={() => setCalendarOpen(true)}>
  <Calendar className="h-4 w-4 mr-2" />
  Schedule Meeting
</Button>

// ...

<CalendarWidget
  open={calendarOpen}
  onOpenChange={setCalendarOpen}
  calLink="andre-uu15wu"
/>
```

### 4. Integração na Visão de Prospect: `ProspectDetailsDialog.tsx`

**Localização:** `src/components/prospects/ProspectDetailsDialog.tsx`

Similar à visão do cliente, o diálogo de detalhes do prospect também permite agendar reuniões:

```jsx
const [calendarOpen, setCalendarOpen] = useState(false);

// ...

<Button
  variant="outline"
  onClick={() => setCalendarOpen(true)}
>
  <Calendar className="h-4 w-4 mr-2" />
  Schedule Meeting
</Button>

// ...

<CalendarWidget
  open={calendarOpen}
  onOpenChange={setCalendarOpen}
  calLink="andre-uu15wu"
/>
```

## Detalhes da Implementação

### Estrutura HTML do Widget

```html
<div 
  className="cal-inline w-full h-full"
  data-cal-link="andre-uu15wu"
  style={{ width: '100%', height: '100%', minHeight: '600px' }}
></div>
```

- `cal-inline`: Classe específica que é reconhecida pelo script do Cal.com
- `data-cal-link`: Atributo que contém o link público para o calendário do Cal.com
- Estilo ajustado para garantir que o widget ocupe todo o espaço disponível

### Carregamento Dinâmico do Script

O script do Cal.com é carregado dinamicamente apenas quando o modal é aberto, evitando impacto no carregamento inicial da página. A função `Cal.init()` é chamada após o script ser carregado para inicializar o widget.

### Limpeza e Gestão de Recursos

O script é removido quando o modal é fechado para evitar acúmulo de scripts no DOM e possíveis conflitos ou vazamentos de memória.

## Customizações e Possíveis Extensões

### Personalização por Usuário/Cliente

Atualmente, está sendo usado um link fixo para o calendário (`andre-uu15wu`), mas o componente foi projetado para aceitar links customizados. Potencialmente, pode-se:

- Associar calendários específicos a cada usuário da plataforma
- Passar informações contextuais (como nome do cliente/prospect) para pré-preencher campos no formulário de agendamento
- Integrar a API do Cal.com para obter disponibilidade dinâmica

### Integração com Sistema de Notificações

Uma possível extensão seria integrar eventos do Cal.com (como agendamento, cancelamento, etc.) com o sistema de notificações da plataforma.

### Sincronização com o Banco de Dados

Quando uma reunião é agendada via Cal.com, uma integração futura poderia:
- Registrar automaticamente a reunião no banco de dados da aplicação
- Atualizar status de leads/prospects conforme reuniões são agendadas
- Criar tarefas ou lembretes automaticamente baseados em reuniões agendadas

## Resumo Técnico

A implementação atual do Cal.com na plataforma Advizall é uma solução elegante e não intrusiva que:

1. Carrega recursos apenas quando necessário
2. Proporciona uma experiência de usuário consistente
3. É facilmente acessível de múltiplos pontos da aplicação
4. Foi projetada para ser extensível conforme necessidades futuras 