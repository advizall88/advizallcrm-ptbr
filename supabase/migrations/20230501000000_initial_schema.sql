-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create prospects table
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  lead_source TEXT,
  business_type TEXT,
  region_city TEXT,
  region_state TEXT,
  timezone TEXT DEFAULT 'America/Chicago',
  score INTEGER DEFAULT 3 CHECK (score >= 1 AND score <= 5),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'interested', 'negotiation', 'lost')),
  first_contact_at TIMESTAMPTZ,
  call_summary TEXT,
  notes TEXT,
  next_follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY REFERENCES public.prospects(id) ON DELETE CASCADE,
  account_manager_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  lead_source TEXT,
  business_type TEXT,
  region_city TEXT,
  region_state TEXT,
  timezone TEXT DEFAULT 'America/Chicago',
  score INTEGER DEFAULT 3 CHECK (score >= 1 AND score <= 5),
  full_address TEXT,
  website TEXT,
  social_links JSONB,
  plan_name TEXT,
  retainer_value NUMERIC(10,2),
  ad_budget NUMERIC(10,2),
  first_contact_at TIMESTAMPTZ,
  call_summary TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create credentials table
CREATE TABLE IF NOT EXISTS public.credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  system TEXT NOT NULL CHECK (system IN ('hosting', 'domain', 'facebook', 'instagram', 'other')),
  login TEXT NOT NULL,
  password TEXT NOT NULL,
  notes TEXT,
  visible_to TEXT NOT NULL CHECK (visible_to IN ('moderator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (service IN ('website', 'paid_ads', 'organic', 'branding', 'ops')),
  status TEXT NOT NULL CHECK (status IN ('todo', 'doing', 'done')),
  description TEXT,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'doing', 'done')),
  due_at TIMESTAMPTZ,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  invoice_date TIMESTAMPTZ NOT NULL,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  calendar_event_id TEXT,
  meet_link TEXT,
  created_by_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT client_or_prospect_required CHECK (
    (client_id IS NOT NULL OR prospect_id IS NOT NULL)
  )
);

-- Create Row-Level Security (RLS) policies

-- Turn on RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Moderators can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Admins can manage users" ON public.users
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for prospects table
CREATE POLICY "Users can view their own prospects" ON public.prospects
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Moderators can view all prospects" ON public.prospects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Users can create prospects" ON public.prospects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own prospects" ON public.prospects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Moderators can update all prospects" ON public.prospects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Moderators can delete prospects" ON public.prospects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

-- Create policies for clients table
CREATE POLICY "Users can view clients they manage" ON public.clients
  FOR SELECT USING (auth.uid() = account_manager_id);

CREATE POLICY "Moderators can view all clients" ON public.clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Users can update clients they manage" ON public.clients
  FOR UPDATE USING (auth.uid() = account_manager_id);

CREATE POLICY "Moderators can update all clients" ON public.clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

-- Create policies for credentials table
CREATE POLICY "Only moderators and admins can view credentials" ON public.credentials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Only moderators and admins can insert credentials" ON public.credentials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Only moderators and admins can update credentials" ON public.credentials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Only admins can delete credentials" ON public.credentials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for projects, tasks, payments, meetings
-- ... similar policies for the remaining tables

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

CREATE TRIGGER update_credentials_updated_at
  BEFORE UPDATE ON public.credentials
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

-- Create function to convert prospect to client
CREATE OR REPLACE FUNCTION public.convert_prospect_to_client(prospect_id UUID)
RETURNS UUID AS $$
DECLARE
  v_prospect RECORD;
  v_client_id UUID;
BEGIN
  -- Check if prospect exists
  SELECT * INTO v_prospect FROM public.prospects
  WHERE id = prospect_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Prospect with ID % not found', prospect_id;
  END IF;
  
  -- Check if already converted to client
  SELECT id INTO v_client_id FROM public.clients
  WHERE id = prospect_id;
  
  IF FOUND THEN
    RAISE EXCEPTION 'Prospect with ID % already converted to client', prospect_id;
  END IF;
  
  -- Insert into clients table
  INSERT INTO public.clients (
    id,
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
    full_address,
    first_contact_at,
    call_summary,
    notes,
    created_at,
    updated_at
  )
  VALUES (
    prospect_id,
    v_prospect.owner_id,
    v_prospect.contact_name,
    v_prospect.company_name,
    v_prospect.phone,
    v_prospect.email,
    v_prospect.lead_source,
    v_prospect.business_type,
    v_prospect.region_city,
    v_prospect.region_state,
    v_prospect.timezone,
    v_prospect.score,
    COALESCE(v_prospect.region_city || ', ' || v_prospect.region_state, ''),
    v_prospect.first_contact_at,
    v_prospect.call_summary,
    v_prospect.notes,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_client_id;
  
  -- Update prospect status
  UPDATE public.prospects
  SET status = 'negotiation',
      updated_at = NOW()
  WHERE id = prospect_id;
  
  RETURN v_client_id;
END;
$$ LANGUAGE plpgsql; 