-- Criar tabela para armazenar dados de reuniões do Cal.com
CREATE TABLE IF NOT EXISTS public.cal_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ical_uid TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  attendee_name TEXT,
  attendee_email TEXT,
  meeting_url TEXT,
  trigger_event TEXT NOT NULL,
  note TEXT,
  phone TEXT,
  reschedule_reason TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS cal_meetings_ical_uid_idx ON public.cal_meetings (ical_uid);
CREATE INDEX IF NOT EXISTS cal_meetings_start_time_idx ON public.cal_meetings (start_time);
CREATE INDEX IF NOT EXISTS cal_meetings_status_idx ON public.cal_meetings (status);

-- Adicionar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cal_meetings_updated_at
BEFORE UPDATE ON public.cal_meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Adicionar comentários na tabela para documentação
COMMENT ON TABLE public.cal_meetings IS 'Reuniões agendadas através do Cal.com';
COMMENT ON COLUMN public.cal_meetings.ical_uid IS 'Identificador único do evento no padrão iCal';
COMMENT ON COLUMN public.cal_meetings.trigger_event IS 'Tipo de evento que acionou o webhook (BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED)';
COMMENT ON COLUMN public.cal_meetings.status IS 'Status da reunião (ACCEPTED, PENDING, CANCELLED, etc)'; 