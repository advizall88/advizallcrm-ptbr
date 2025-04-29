import { supabase } from '@/lib/supabase';

// Tipos
export type MeetingFormData = {
  title: string;
  starts_at: string;
  ends_at: string;
  client_id?: string | null;
  prospect_id?: string | null;
  created_by_id: string;
  notes?: string | null;
  attendee_name?: string;
  attendee_email?: string;
  attendee_timezone?: string;
};

export type CalEventType = {
  id: number;
  title: string;
  slug: string;
  length: number;
  description?: string;
};

export type CalSlot = {
  uid: string;
  startTime: string;
  endTime: string;
  attendees?: number;
  bookingUid?: string;
};

export type CalReservation = {
  uid: string;
  eventTypeId: number;
  userId: string;
  status: string;
  responses: Record<string, any>;
};

// Constantes
const CAL_API_KEY = import.meta.env.VITE_CAL_API_KEY;
const CAL_USER_ID = import.meta.env.VITE_CAL_USER_ID; 
const CAL_API_VERSION = '2024-08-13'; // Versão atual da API
const CAL_API_BASE_URL = 'https://api.cal.com/v2';

// Dados de exemplo para desenvolvimento (fallback)
const MOCK_EVENT_TYPES: CalEventType[] = [
  {
    id: 1,
    title: 'Reunião inicial',
    slug: 'reuniao-inicial',
    length: 30,
    description: 'Primeira conversa para entender necessidades'
  },
  {
    id: 2,
    title: 'Apresentação de proposta',
    slug: 'apresentacao-de-proposta',
    length: 60,
    description: 'Apresentação detalhada de solução'
  },
  {
    id: 3,
    title: 'Ligação de áudio para marcar reunião',
    slug: 'evento-de-teste',
    length: 5,
    description: 'Breve chamada de áudio para agendar reunião principal com o cliente'
  }
];

/**
 * Serviço para integração com Cal.com
 */
export const calendarService = {
  // Exportar constantes públicas
  CAL_USER_ID,
  
  /**
   * Função auxiliar para fazer chamadas à API do Cal.com V2
   */
  async callCalApi(endpoint: string, method: string = 'GET', data?: any) {
    try {
      const url = `${CAL_API_BASE_URL}${endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CAL_API_KEY}`,
        'cal-api-version': CAL_API_VERSION
      };
      
      const options: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      };
      
      const response = await fetch(url, options);
      
      // Verificar limites de taxa
      const rateLimit = {
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset')
      };
      
      // Log dos limites de taxa (pode ser útil para debug)
      console.debug('Cal.com API Rate Limits:', rateLimit);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Cal.com API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      if (response.status === 204) {
        return true; // No content but success
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao chamar a API do Cal.com:', error);
      throw error;
    }
  },
  
  /**
   * Obtém todos os tipos de eventos disponíveis
   */
  async getEventTypes() {
    try {
      const events = await this.callCalApi('/event-types');
      return events?.data || MOCK_EVENT_TYPES;
    } catch (error) {
      console.error('Erro ao obter tipos de eventos, usando dados de exemplo:', error);
      return MOCK_EVENT_TYPES;
    }
  },

  /**
   * Obtém slots de disponibilidade para um tipo de evento
   */
  async getAvailableSlots(eventTypeId: number | string, startDate: Date, endDate: Date, timeZone: string = 'America/New_York') {
    try {
      const payload = {
        eventTypeId: Number(eventTypeId),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        timeZone
      };
      
      const response = await this.callCalApi('/slots', 'POST', payload);
      return response?.slots || [];
    } catch (error) {
      console.error('Erro ao obter slots disponíveis, gerando dados de exemplo:', error);
      
      // Gerar horários fictícios para os próximos 3 dias (fallback)
      const slots: CalSlot[] = [];
      const currentDate = new Date(startDate);
      
      // Limitar a 3 dias para exemplo
      for (let day = 0; day < 3; day++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + day);
        
        // Horários de exemplo: 9h, 11h, 14h, 16h
        const hours = [9, 11, 14, 16];
        
        hours.forEach(hour => {
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(startTime);
          // Definir duração com base no tipo de evento (30min ou 60min)
          const duration = Number(eventTypeId) === 1 ? 30 : 60;
          endTime.setMinutes(endTime.getMinutes() + duration);
          
          slots.push({
            uid: `mock-${date.toISOString()}-${hour}`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            attendees: 0
          });
        });
      }
      
      return slots;
    }
  },

  /**
   * Reserva um slot de horário
   */
  async reserveSlot(slotUid: string, name?: string, email?: string, notes?: string) {
    try {
      const payload = {
        slotUid,
        responses: {
          name,
          email,
          notes
        }
      };
      
      return await this.callCalApi('/slots/reservations', 'POST', payload);
    } catch (error) {
      console.error('Erro ao reservar slot:', error);
      
      // Retornar uma reserva simulada em caso de erro
      return {
        uid: slotUid,
        status: 'pending'
      };
    }
  },

  /**
   * Confirma uma reserva e cria um agendamento
   */
  async confirmReservation(reservationUid: string, responses: Record<string, any> = {}) {
    try {
      // Primeiro, tenta confirmar a reserva na API do Cal.com
      await this.callCalApi(`/slots/reservations/${reservationUid}`, 'POST', { responses });
      
      // Depois, salva no Supabase para tracking interno
      const meetingData = {
        title: 'Reunião agendada via Cal.com',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 3600000).toISOString(),
        client_id: responses.clientId,
        prospect_id: responses.prospectId,
        created_by_id: responses.userId || 'system',
        notes: responses.notes,
        calendar_event_id: reservationUid,
        meet_link: 'https://meet.google.com/exemplo'
      };
      
      const { data, error } = await supabase
        .from('meetings')
        .insert(meetingData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      throw error;
    }
  },

  /**
   * Obtém o link de agendamento para incorporar na interface
   */
  getSchedulingLink(eventTypeSlug = '30min') {
    return `https://cal.com/${CAL_USER_ID}/${eventTypeSlug}`;
  },

  /**
   * Gera código HTML para incorporar o widget do Cal.com
   */
  getEmbedHtml(eventTypeSlug = '30min', prefillData = {}) {
    const prefillDataString = encodeURIComponent(JSON.stringify(prefillData));
    
    return `
      <div 
        class="cal-embed"
        data-cal-link="${CAL_USER_ID}/${eventTypeSlug}"
        data-cal-prefill="${prefillDataString}"
        style="width:100%;height:100%;overflow:scroll"
      ></div>
      <script>
        (function (C, A, L) {
          let p = function (a, ar) {
            a.q.push(ar);
          };
          let d = C.document;
          C.Cal = C.Cal || function () {
            let cal = C.Cal;
            let ar = arguments;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              d.head.appendChild(d.createElement("script")).src = A;
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api = function () {
                p(api, arguments);
              };
              const namespace = ar[1];
              api.q = api.q || [];
              typeof namespace === "string"
                ? (cal.ns[namespace] = api) && p(api, ar)
                : p(cal, ar);
              return;
            }
            p(cal, ar);
          };
        })(window, "https://cal.com/embed.js", "init");
        Cal("init");
      </script>
    `;
  }
}; 