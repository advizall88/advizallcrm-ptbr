import axios from 'axios';

// Configuração da API
const API_KEY = import.meta.env.VITE_CAL_API_KEY;
const CAL_USER_ID = import.meta.env.VITE_CAL_USER_ID;
const CAL_API_VERSION = '2024-08-13';
const BASE_URL = 'https://api.cal.com/v2';

// Criando uma instância do axios com configurações padrão
const calApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'cal-api-version': CAL_API_VERSION
  }
});

// Interfaces
export interface AvailableSlotsParams {
  eventTypeId: number;
  startTime: string; // ISO String
  endTime: string; // ISO String
  timeZone?: string;
}

export interface SlotReservationParams {
  slotUid: string;
  name?: string;
  email?: string;
  notes?: string;
}

export interface BookingParams {
  reservationUid: string;
  name?: string;
  email?: string;
  notes?: string;
  // Campos adicionais específicos da aplicação
  clientId?: string;
  prospectId?: string;
  userId?: string;
}

// Funções para interagir com a API
export const getAvailableSlots = async (params: AvailableSlotsParams) => {
  try {
    const response = await calApi.post('/slots', params);
    return response.data.slots || [];
  } catch (error) {
    console.error('Erro ao obter slots disponíveis:', error);
    throw error;
  }
};

export const reserveSlot = async (params: SlotReservationParams) => {
  try {
    const payload = {
      slotUid: params.slotUid,
      responses: {
        name: params.name,
        email: params.email,
        notes: params.notes
      }
    };
    
    const response = await calApi.post('/slots/reservations', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao reservar slot:', error);
    throw error;
  }
};

export const createBooking = async (params: BookingParams) => {
  try {
    const payload = {
      responses: {
        name: params.name,
        email: params.email,
        notes: params.notes,
        // Incluindo metadados da aplicação
        clientId: params.clientId,
        prospectId: params.prospectId,
        userId: params.userId
      }
    };
    
    const response = await calApi.post(`/slots/reservations/${params.reservationUid}`, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    throw error;
  }
};

// Exportar constante para uso em componentes
export { CAL_USER_ID };

// Exportar objeto com todas as funções
export default {
  getAvailableSlots,
  reserveSlot,
  createBooking,
  CAL_USER_ID
}; 