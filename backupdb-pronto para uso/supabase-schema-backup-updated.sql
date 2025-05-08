-- AdvizallCRM Database Schema Backup
-- Updated: May 22, 2024
-- This file contains the complete database schema for the AdvizallCRM application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema creation
CREATE SCHEMA IF NOT EXISTS "public";
CREATE SCHEMA IF NOT EXISTS "graphql";
CREATE SCHEMA IF NOT EXISTS "graphql_public";

-- Set default privileges
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT EXECUTE ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT USAGE ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT EXECUTE ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT USAGE ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT EXECUTE ON FUNCTIONS TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT USAGE ON SEQUENCES TO "service_role";

-- Users table
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "avatar_url" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "department" TEXT,
    "bio" TEXT,
    "last_login_at" TIMESTAMPTZ,
    "last_active_at" TIMESTAMPTZ,
    PRIMARY KEY ("id"),
    CONSTRAINT "users_email_key" UNIQUE ("email")
);

-- Prospects table
CREATE TABLE IF NOT EXISTS "public"."prospects" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "contact_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "business_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "assigned_to" UUID REFERENCES "public"."users"("id"),
    "notes" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT DEFAULT 'Brasil',
    "source" TEXT,
    "website" TEXT,
    PRIMARY KEY ("id"),
    CONSTRAINT "prospects_email_key" UNIQUE ("email")
);

-- Clients table
CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "contact_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "business_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "assigned_to" UUID REFERENCES "public"."users"("id"),
    "notes" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT DEFAULT 'Brasil',
    "website" TEXT,
    "plan_name" TEXT,
    "monthly_fee" NUMERIC(10,2) DEFAULT 0,
    "ad_budget" NUMERIC(10,2) DEFAULT 0,
    PRIMARY KEY ("id"),
    CONSTRAINT "clients_email_key" UNIQUE ("email")
);

-- Projects table
CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "client_id" UUID NOT NULL REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "start_date" DATE,
    "end_date" DATE,
    "progress" INTEGER DEFAULT 0,
    PRIMARY KEY ("id")
);

-- Payments table
CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "client_id" UUID NOT NULL REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "amount" NUMERIC(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_date" DATE,
    "due_date" DATE,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "payment_method" TEXT,
    "invoice_number" TEXT,
    PRIMARY KEY ("id")
);

-- Credentials table
CREATE TABLE IF NOT EXISTS "public"."credentials" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "client_id" UUID NOT NULL REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "service_name" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "url" TEXT,
    "api_key" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Meetings table
CREATE TABLE IF NOT EXISTS "public"."meetings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "meeting_date" TIMESTAMPTZ NOT NULL,
    "duration" INTEGER NOT NULL, -- Duration in minutes
    "client_id" UUID REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "prospect_id" UUID REFERENCES "public"."prospects"("id") ON DELETE CASCADE,
    "created_by" UUID REFERENCES "public"."users"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "meeting_link" TEXT,
    "notes" TEXT,
    "location" TEXT,
    PRIMARY KEY ("id"),
    CONSTRAINT "meeting_client_or_prospect" CHECK (
        (client_id IS NOT NULL AND prospect_id IS NULL) OR
        (client_id IS NULL AND prospect_id IS NOT NULL)
    )
);

-- Cal Meetings table for integration with Cal.com
CREATE TABLE IF NOT EXISTS "public"."cal_meetings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "attendees" JSONB,
    "organizer" JSONB,
    "calendar_event_id" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "event_type" JSONB,
    "cal_user_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "processed" BOOLEAN DEFAULT FALSE,
    "metadata" JSONB,
    PRIMARY KEY ("id")
);

-- Tasks table
CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "due_date" DATE,
    "client_id" UUID REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "project_id" UUID REFERENCES "public"."projects"("id") ON DELETE CASCADE,
    "assigned_to" UUID REFERENCES "public"."users"("id"),
    "created_by" UUID REFERENCES "public"."users"("id") NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "completed_at" TIMESTAMPTZ,
    "tags" TEXT[],
    "time_estimate" INTEGER, -- Time estimate in minutes
    PRIMARY KEY ("id")
);

-- Add updated_at triggers for all tables
CREATE OR REPLACE FUNCTION "public"."update_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON "public"."prospects"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON "public"."clients"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON "public"."projects"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON "public"."payments"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_credentials_updated_at
BEFORE UPDATE ON "public"."credentials"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON "public"."meetings"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_cal_meetings_updated_at
BEFORE UPDATE ON "public"."cal_meetings"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON "public"."tasks"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_updated_at"();

-- Convert prospect to client function
CREATE OR REPLACE FUNCTION "public"."convert_prospect_to_client"(
  prospect_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_client_id UUID;
  p record;
BEGIN
  -- Get the prospect data
  SELECT * INTO p FROM prospects WHERE id = prospect_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Prospect with ID % not found', prospect_id;
  END IF;
  
  -- Insert into clients table
  INSERT INTO clients (
    contact_name, company_name, email, phone, business_type,
    status, assigned_to, notes, address, city, state, zip, country, website
  ) VALUES (
    p.contact_name, p.company_name, p.email, p.phone, p.business_type,
    'active', p.assigned_to, p.notes, p.address, p.city, p.state, p.zip, p.country, p.website
  ) RETURNING id INTO new_client_id;
  
  -- Delete the prospect
  DELETE FROM prospects WHERE id = prospect_id;
  
  RETURN new_client_id;
END;
$$;

-- Insert default admin users
INSERT INTO "public"."users" (id, email, name, role, created_at, avatar_url, phone, last_login_at, last_active_at)
VALUES 
('e41c9005-e961-42b1-90c5-9d0de453e248', 'admin@advizall.com', 'Admin', 'admin', now(), '', '', now(), now()),
('ff193d1c-82c8-4082-9739-86d357b7ba80', 'andre@advizall.com', 'Andre Souza', 'admin', now(), '', '', now(), now()),
('503d7b55-f6ce-47ca-ad41-2a0e2232e484', 'vini@advizall.com', 'Vinicius Fernandes', 'admin', now(), '', '', now(), now())
ON CONFLICT (email) DO NOTHING; 