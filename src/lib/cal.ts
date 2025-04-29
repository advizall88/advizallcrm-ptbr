import axios, { AxiosInstance } from "axios";

const CAL_API_VERSION = "2024-08-13";           // igual à docs v2
const BASE_URL        = "https://api.cal.com/v2";

// API key vinda do .env
const CAL_API_KEY = import.meta.env.VITE_CAL_API_KEY;

export const cal: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "cal-api-version": CAL_API_VERSION,
    "Authorization": `Bearer ${CAL_API_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * Busca os dias/horários disponíveis de um Event Type.
 * @param eventTypeId ID do Event Type (number)
 * @param start       ISO date (YYYY-MM-DD) início do intervalo
 * @param end         ISO date (YYYY-MM-DD) fim do intervalo
 * @param timeZone    ex: "America/Chicago"
 */
export async function getAvailableSlots(
  eventTypeId: number,
  start: string,
  end: string,
  timeZone = "America/Chicago"
) {
  const { data } = await cal.get("/slots", {
    params: { eventTypeId, start, end, timeZone },
  });
  return data; // array de { start: ISO, end: ISO, slotUid, status }
}

/**
 * Reserva um slot e devolve o reservationUid.
 */
export async function reserveSlot(slotUid: string) {
  const { data } = await cal.post("/slots/reservations", { slotUid });
  return data.reservationUid as string;
}

/**
 * Cria o booking confirmando a reserva.
 */
export async function createBooking(
  reservationUid: string,
  attendee: { name: string; email: string; timeZone?: string }
) {
  const body = {
    reservationUid,
    attendee,
  };
  const { data } = await cal.post("/bookings", body);
  return data; // booking completo
}

/**
 * Busca todos os tipos de evento (event types) disponíveis
 */
export async function getEventTypes() {
  try {
    const { data } = await cal.get("/event-types");
    return data.event_types || [];
  } catch (error) {
    console.error("Erro ao buscar tipos de eventos:", error);
    return [];
  }
}

// Exporta o ID do usuário do Cal.com para uso direto
export const CAL_USER_ID = import.meta.env.VITE_CAL_USER_ID; 