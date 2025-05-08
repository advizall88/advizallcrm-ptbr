import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// This is a backup copy of the Supabase client configuration used in the project

// These would normally be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialize the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Type aliases for convenience (matching src/lib/supabase.ts)
export type User = Database['public']['Tables']['users']['Row'];
export type Prospect = Database['public']['Tables']['prospects']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Credential = Database['public']['Tables']['credentials']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type CalMeeting = Database['public']['Tables']['cal_meetings']['Row']; 