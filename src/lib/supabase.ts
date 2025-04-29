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
export type Client = Database['public']['Tables']['clients']['Row'];
export type Credential = Database['public']['Tables']['credentials']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row']; 