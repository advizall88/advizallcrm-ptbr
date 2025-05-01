-- Advizall Flow Hub Supabase Schema Backup
-- Generated on: 2024-05-01
-- This file contains a complete backup of the Supabase schema

-- Tables from 20230501000000_initial_schema.sql and 20240430_meetings_cal.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  contact_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  lead_source TEXT NOT NULL,
  business_type TEXT NOT NULL,
  region_city TEXT NOT NULL,
  region_state TEXT NOT NULL,
  timezone TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'interested', 'negotiation', 'lost')),
  first_contact_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  call_summary TEXT,
  notes TEXT,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients table (expanded from prospects)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  contact_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  lead_source TEXT NOT NULL,
  business_type TEXT NOT NULL,
  region_city TEXT NOT NULL,
  region_state TEXT NOT NULL,
  timezone TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'interested', 'negotiation', 'lost')),
  first_contact_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  call_summary TEXT,
  notes TEXT,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  full_address TEXT NOT NULL,
  website TEXT,
  social_links JSONB,
  plan_name TEXT,
  retainer_value NUMERIC,
  ad_budget NUMERIC
);

-- Credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  system TEXT NOT NULL CHECK (system IN ('hosting', 'domain', 'facebook', 'instagram', 'other')),
  login TEXT NOT NULL,
  password TEXT NOT NULL,
  notes TEXT,
  visible_to TEXT NOT NULL DEFAULT 'admin' CHECK (visible_to IN ('moderator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (service IN ('website', 'paid_ads', 'organic', 'branding', 'ops')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  due_at TIMESTAMP WITH TIME ZONE,
  assignee_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  description TEXT NOT NULL,
  invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  calendar_event_id TEXT,
  meet_link TEXT,
  created_by_id UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT client_or_prospect CHECK (
    (client_id IS NULL AND prospect_id IS NOT NULL) OR
    (client_id IS NOT NULL AND prospect_id IS NULL)
  )
);

-- Cal Meetings Table (from 20240430_meetings_cal.sql)
CREATE TABLE IF NOT EXISTS cal_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ical_uid TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL, -- confirmed, cancelled, rescheduled
  attendee_name TEXT,
  attendee_email TEXT,
  meeting_url TEXT,
  trigger_event TEXT NOT NULL, -- created, rescheduled, cancelled
  note TEXT,
  phone TEXT,
  reschedule_reason TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to convert a prospect to a client
CREATE OR REPLACE FUNCTION convert_prospect_to_client(prospect_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_client_id UUID;
BEGIN
  -- Insert prospect into clients
  INSERT INTO clients (
    owner_id, contact_name, company_name, phone, email, 
    lead_source, business_type, region_city, region_state, 
    timezone, score, status, first_contact_at, call_summary, 
    notes, next_follow_up_at, full_address
  )
  SELECT 
    p.owner_id, p.contact_name, p.company_name, p.phone, p.email, 
    p.lead_source, p.business_type, p.region_city, p.region_state, 
    p.timezone, p.score, p.status, p.first_contact_at, p.call_summary, 
    p.notes, p.next_follow_up_at, 
    CONCAT(p.region_city, ', ', p.region_state) as full_address
  FROM prospects p
  WHERE p.id = prospect_id
  RETURNING id INTO new_client_id;
  
  -- Update any meetings associated with this prospect to point to the new client
  UPDATE meetings 
  SET client_id = new_client_id, prospect_id = NULL
  WHERE prospect_id = prospect_id;
  
  -- Delete the prospect now that it's been converted
  DELETE FROM prospects WHERE id = prospect_id;
  
  RETURN new_client_id;
END;
$$;

-- Indexes for Cal Meetings table
CREATE INDEX IF NOT EXISTS cal_meetings_attendee_email_idx ON cal_meetings (attendee_email);
CREATE INDEX IF NOT EXISTS cal_meetings_status_idx ON cal_meetings (status);
CREATE INDEX IF NOT EXISTS cal_meetings_start_time_idx ON cal_meetings (start_time); 