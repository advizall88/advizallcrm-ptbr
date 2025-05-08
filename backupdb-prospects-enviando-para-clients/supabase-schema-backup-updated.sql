-- Backup completo do esquema do banco de dados Supabase - AdvizallCRM
-- Gerado em: 2024-05-20

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgjwt";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de prospects (leads)
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.users(id),
    contact_name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT,
    email TEXT,
    lead_source TEXT,
    business_type TEXT,
    region_city TEXT,
    region_state TEXT,
    timezone TEXT DEFAULT 'America/Chicago',
    score INTEGER CHECK (score BETWEEN 1 AND 5),
    status TEXT CHECK (status IN ('new', 'interested', 'negotiation', 'lost')) DEFAULT 'new',
    first_contact_at TIMESTAMPTZ,
    call_summary TEXT,
    notes TEXT,
    next_follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    order_index INTEGER NOT NULL DEFAULT 0
);

-- Índices para prospects
CREATE INDEX IF NOT EXISTS idx_prospects_owner_id ON public.prospects(owner_id);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_manager_id UUID REFERENCES public.users(id),
    contact_name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT,
    email TEXT,
    lead_source TEXT,
    business_type TEXT,
    region_city TEXT,
    region_state TEXT,
    timezone TEXT DEFAULT 'America/Chicago',
    score INTEGER CHECK (score BETWEEN 1 AND 5),
    full_address TEXT,
    website TEXT,
    social_links JSONB,
    plan_name TEXT,
    retainer_value NUMERIC,
    ad_budget NUMERIC(10,2) DEFAULT 0,
    monthly_fee NUMERIC(10,2) DEFAULT 0,
    first_contact_at TIMESTAMPTZ,
    call_summary TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clients_account_manager_id ON public.clients(account_manager_id);

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    service TEXT CHECK (service IN ('website', 'paid_ads', 'organic', 'branding', 'ops')),
    status TEXT CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo',
    description TEXT,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para projetos
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo',
    due_at TIMESTAMPTZ,
    assignee_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para tarefas
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT NOT NULL,
    invoice_date TIMESTAMPTZ NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para pagamentos
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);

-- Tabela de credenciais
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    system TEXT CHECK (system IN ('hosting', 'domain', 'facebook', 'instagram', 'other')),
    login TEXT NOT NULL,
    password TEXT NOT NULL,
    notes TEXT,
    visible_to TEXT CHECK (visible_to IN ('moderator', 'admin')) DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para credenciais
CREATE INDEX IF NOT EXISTS idx_credentials_client_id ON public.credentials(client_id);

-- Tabela de reuniões
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    calendar_event_id TEXT,
    meet_link TEXT,
    created_by_id UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        (client_id IS NOT NULL AND prospect_id IS NULL) OR
        (client_id IS NULL AND prospect_id IS NOT NULL)
    )
);

-- Índices para reuniões
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON public.meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_prospect_id ON public.meetings(prospect_id);

-- Tabela para integração com Cal.com
CREATE TABLE IF NOT EXISTS public.cal_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ical_uid TEXT UNIQUE NOT NULL,
    trigger_event TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    additional_notes TEXT,
    attendee_name TEXT,
    attendee_email TEXT,
    phone_number TEXT,
    meeting_link TEXT,
    reschedule_reason TEXT,
    cancellation_reason TEXT,
    status TEXT NOT NULL,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para cal_meetings
CREATE INDEX IF NOT EXISTS cal_meetings_attendee_email_idx ON public.cal_meetings(attendee_email);
CREATE INDEX IF NOT EXISTS cal_meetings_status_idx ON public.cal_meetings(status);
CREATE INDEX IF NOT EXISTS cal_meetings_start_time_idx ON public.cal_meetings(start_time);

-- Função para converter prospect em cliente
CREATE OR REPLACE FUNCTION public.convert_prospect_to_client(prospect_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    new_client_id UUID;
BEGIN
    -- Inserir na tabela clients
    INSERT INTO clients (
        account_manager_id,
        contact_name,
        company_name,
        phone,
        email,
        lead_source,
        business_type,
        region_city,
        region_state,
        timezone,
        score,
        first_contact_at,
        call_summary,
        notes
    )
    SELECT
        owner_id,
        contact_name,
        company_name,
        phone,
        email,
        lead_source,
        business_type,
        region_city,
        region_state,
        timezone,
        score,
        first_contact_at,
        call_summary,
        notes
    FROM prospects
    WHERE id = prospect_id
    RETURNING id INTO new_client_id;
    
    -- Atualizar reuniões relacionadas
    UPDATE meetings
    SET client_id = new_client_id,
        prospect_id = NULL
    WHERE prospect_id = prospect_id;
    
    -- Remover prospect
    DELETE FROM prospects WHERE id = prospect_id;
    
    RETURN new_client_id;
END;
$$;

-- Triggers para atualizar o campo updated_at
CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON public.prospects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_credentials_updated_at
BEFORE UPDATE ON public.credentials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cal_meetings_updated_at
BEFORE UPDATE ON public.cal_meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at(); 