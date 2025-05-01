import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These should be environment variables in a production app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Type aliases for convenience
export type User = Database['public']['Tables']['users']['Row'];
export type Prospect = Database['public']['Tables']['prospects']['Row'];
export interface Client {
  id: string;
  owner_id: string;
  contact_name: string;
  company_name?: string;
  phone: string;
  email: string;
  lead_source: string;
  business_type: string;
  region_city: string;
  region_state: string;
  timezone: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  full_address?: string;
  zip_code?: string;
  notes?: string;
  score?: number;
  status: string;
  created_at: string;
  updated_at: string;
  ad_budget?: number;
  plan_name?: string;
  monthly_fee?: number;
  call_summary?: string;
  first_contact_at?: string;
}
export type Credential = Database['public']['Tables']['credentials']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type CalMeeting = Database['public']['Tables']['cal_meetings']['Row']; 