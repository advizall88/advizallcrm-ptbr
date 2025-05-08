/**
 * TypeScript types for the AdvizallCRM database schema
 * Updated: May 22, 2024
 * 
 * This file contains TypeScript interfaces that match the database schema structure.
 * Use these types in your application code to ensure type safety when working with
 * database data.
 */

/**
 * User role types
 */
export type UserRole = 'user' | 'moderator' | 'admin';

/**
 * User status for UI
 */
export type UserStatus = 'online' | 'away' | 'offline';

/**
 * User interface representing users table
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  created_at: string;
  avatar_url?: string | null;
  phone?: string | null;
  title?: string | null;
  department?: string | null;
  bio?: string | null;
  last_login_at?: string | null;
  last_active_at?: string | null;
}

/**
 * Prospect status types
 */
export type ProspectStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

/**
 * Prospect interface representing prospects table
 */
export interface Prospect {
  id: string;
  contact_name: string;
  company_name?: string | null;
  email?: string | null;
  phone: string;
  business_type?: string | null;
  status: ProspectStatus;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  notes?: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  source: string | null;
  website: string | null;
}

/**
 * Client status types
 */
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'archived';

/**
 * Client interface representing clients table
 */
export interface Client {
  id: string;
  contact_name: string;
  company_name?: string | null;
  email?: string | null;
  phone: string;
  business_type?: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  notes?: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  website: string | null;
  plan_name?: string | null;
  monthly_fee?: number | null;
  ad_budget?: number | null;
}

/**
 * Project status types
 */
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

/**
 * Project interface representing projects table
 */
export interface Project {
  id: string;
  client_id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  start_date?: string | null;
  end_date?: string | null;
  progress?: number;
}

/**
 * Task status types
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Task priority types
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task interface representing tasks table
 */
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  client_id?: string | null;
  project_id?: string | null;
  assigned_to?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  tags?: string[] | null;
  time_estimate?: number | null;
}

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

/**
 * Payment interface representing payments table
 */
export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
  payment_date?: string | null;
  due_date?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
  payment_method?: string | null;
  invoice_number?: string | null;
}

/**
 * Credential interface representing credentials table
 */
export interface Credential {
  id: string;
  client_id: string;
  service_name: string;
  username?: string | null;
  password?: string | null;
  url?: string | null;
  api_key?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Meeting status types
 */
export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

/**
 * Meeting interface representing meetings table
 */
export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  meeting_date: string;
  duration: number;
  client_id?: string | null;
  prospect_id?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  status: MeetingStatus;
  meeting_link?: string | null;
  notes?: string | null;
  location?: string | null;
}

/**
 * Cal.com meeting status types
 */
export type CalMeetingStatus = 'active' | 'cancelled' | 'rescheduled';

/**
 * Calendar meeting interface representing cal_meetings table
 */
export interface CalMeeting {
  id: string;
  uid: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  attendees?: Record<string, any> | null;
  organizer?: Record<string, any> | null;
  calendar_event_id?: string | null;
  location?: string | null;
  status: CalMeetingStatus;
  event_type?: Record<string, any> | null;
  cal_user_id?: string | null;
  created_at: string;
  updated_at: string;
  processed: boolean;
  metadata?: Record<string, any> | null;
}

/**
 * Database schema interface containing all tables
 */
export interface DatabaseSchema {
  users: User[];
  prospects: Prospect[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  payments: Payment[];
  credentials: Credential[];
  meetings: Meeting[];
  cal_meetings: CalMeeting[];
}

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  activeClients: number;
  pendingProspects: number;
  upcomingMeetings: number;
  overduePayments: number;
  pendingTasks: number;
  recentActivity: {
    type: 'client' | 'prospect' | 'meeting' | 'payment' | 'task';
    id: string;
    title: string;
    date: string;
    entityId: string;
  }[];
}

/**
 * Client with related data - used for detailed client view
 */
export interface ClientWithRelated {
  client: Client;
  projects: Project[];
  payments: Payment[];
  credentials: Credential[];
  meetings: Meeting[];
  tasks: Task[];
  assignedUser: User | null;
}

/**
 * Prospect with related data - used for detailed prospect view
 */
export interface ProspectWithRelated {
  prospect: Prospect;
  meetings: Meeting[];
  assignedUser: User | null;
}

/**
 * Project with related data - used for detailed project view
 */
export interface ProjectWithRelated {
  project: Project;
  client: Client;
  tasks: Task[];
}

/**
 * Task with related data - used for detailed task view
 */
export interface TaskWithRelated {
  task: Task;
  client: Client | null;
  project: Project | null;
  assignedUser: User | null;
  createdByUser: User;
}

/**
 * Meeting with related data - used for detailed meeting view
 */
export interface MeetingWithRelated {
  meeting: Meeting;
  client: Client | null;
  prospect: Prospect | null;
  createdByUser: User | null;
}

/**
 * User with related data - used for detailed user view
 */
export interface UserWithRelated {
  user: User;
  assignedClients: Client[];
  assignedProspects: Prospect[];
  assignedTasks: Task[];
  createdTasks: Task[];
}

/**
 * Calendar event interface - used for calendar view
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: 'meeting' | 'task' | 'payment';
  color: string;
  meta: {
    id: string;
    entityType: 'meeting' | 'task' | 'payment';
    clientId?: string;
    prospectId?: string;
    projectId?: string;
  };
}

/**
 * Filter option interface - used for filtering lists
 */
export interface FilterOptions {
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string[];
  searchTerm?: string;
}

/**
 * Prospect form data interface
 */
export interface ProspectFormData {
  contact_name: string;
  phone: string;
  owner_id: string;
  company_name?: string | null;
  email?: string | null;
  lead_source?: string | null;
  business_type?: string | null;
  region_city?: string | null;
  region_state?: string | null;
  timezone?: string | null;
  score?: number;
  status?: 'new' | 'interested' | 'negotiation' | 'lost';
  first_contact_at?: string | null;
  call_summary?: string | null;
  notes?: string | null;
  next_follow_up_at?: string | null;
}

/**
 * Client form data interface
 */
export interface ClientFormData {
  contact_name: string;
  phone: string;
  account_manager_id: string;
  company_name?: string | null;
  email?: string | null;
  lead_source?: string | null;
  business_type?: string | null;
  region_city?: string | null;
  region_state?: string | null;
  timezone?: string | null;
  score?: number;
  status?: 'active' | 'inactive' | 'delinquent';
  plan_name?: string | null;
  full_address?: string | null;
  website?: string | null;
  social_links?: string | null;
  first_contact_at?: string | null;
  call_summary?: string | null;
  notes?: string | null;
  zip_code?: string | null;
  monthly_fee?: number | null;
  ad_budget?: number | null;
} 