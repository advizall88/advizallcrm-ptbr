export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cal_meetings: {
        Row: {
          id: string
          ical_uid: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          attendees: Json | null
          organizer: Json | null
          calendar_event_id: string | null
          location: string | null
          status: string
          event_type: Json | null
          cal_user_id: string | null
          created_at: string
          updated_at: string
          processed: boolean | null
          raw_payload: Json | null
          trigger_event: string
          additional_notes: string | null
          attendee_name: string | null
          attendee_email: string | null
          phone_number: string | null
          meeting_link: string | null
          reschedule_reason: string | null
          cancellation_reason: string | null
        }
        Insert: {
          id?: string
          ical_uid?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          attendees?: Json | null
          organizer?: Json | null
          calendar_event_id?: string | null
          location?: string | null
          status: string
          event_type?: Json | null
          cal_user_id?: string | null
          created_at?: string
          updated_at?: string
          processed?: boolean | null
          raw_payload?: Json | null
          trigger_event: string
          additional_notes?: string | null
          attendee_name?: string | null
          attendee_email?: string | null
          phone_number?: string | null
          meeting_link?: string | null
          reschedule_reason?: string | null
          cancellation_reason?: string | null
        }
        Update: {
          id?: string
          ical_uid?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          attendees?: Json | null
          organizer?: Json | null
          calendar_event_id?: string | null
          location?: string | null
          status?: string
          event_type?: Json | null
          cal_user_id?: string | null
          created_at?: string
          updated_at?: string
          processed?: boolean | null
          raw_payload?: Json | null
          trigger_event?: string
          additional_notes?: string | null
          attendee_name?: string | null
          attendee_email?: string | null
          phone_number?: string | null
          meeting_link?: string | null
          reschedule_reason?: string | null
          cancellation_reason?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          owner_id: string
          contact_name: string
          company_name?: string
          phone: string
          email: string
          lead_source: string
          business_type: string
          region_city: string
          region_state: string
          timezone: string
          score: number
          status: 'active' | string
          first_contact_at: string
          call_summary?: string
          notes?: string
          next_follow_up_at?: string
          created_at: string
          updated_at: string
          full_address: string
          website?: string
          social_links?: Record<string, string>
          plan_name?: string
          retainer_value?: number
          ad_budget?: number
        }
        Insert: {
          id?: string
          owner_id: string
          contact_name: string
          company_name?: string
          phone: string
          email: string
          lead_source: string
          business_type: string
          region_city: string
          region_state: string
          timezone: string
          score?: number
          status?: 'active' | string
          first_contact_at?: string
          call_summary?: string
          notes?: string
          next_follow_up_at?: string
          created_at?: string
          updated_at?: string
          full_address: string
          website?: string
          social_links?: Record<string, string>
          plan_name?: string
          retainer_value?: number
          ad_budget?: number
        }
        Update: {
          id?: string
          owner_id?: string
          contact_name?: string
          company_name?: string
          phone?: string
          email?: string
          lead_source?: string
          business_type?: string
          region_city?: string
          region_state?: string
          timezone?: string
          score?: number
          status?: 'active' | string
          first_contact_at?: string
          call_summary?: string
          notes?: string
          next_follow_up_at?: string
          created_at?: string
          updated_at?: string
          full_address?: string
          website?: string
          social_links?: Record<string, string>
          plan_name?: string
          retainer_value?: number
          ad_budget?: number
        }
        Relationships: [
          {
            foreignKeyName: "clients_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credentials: {
        Row: {
          id: string
          client_id: string
          system: 'hosting' | 'domain' | 'facebook' | 'instagram' | 'other' | string
          login: string
          password: string
          notes?: string
          visible_to: 'moderator' | 'admin' | string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          system: 'hosting' | 'domain' | 'facebook' | 'instagram' | 'other' | string
          login: string
          password: string
          notes?: string
          visible_to?: 'moderator' | 'admin' | string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          system?: 'hosting' | 'domain' | 'facebook' | 'instagram' | 'other' | string
          login?: string
          password?: string
          notes?: string
          visible_to?: 'moderator' | 'admin' | string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      meetings: {
        Row: {
          id: string
          client_id?: string
          prospect_id?: string
          title: string
          starts_at: string
          ends_at: string
          calendar_event_id?: string
          meet_link?: string
          created_by_id: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string
          prospect_id?: string
          title: string
          starts_at: string
          ends_at: string
          calendar_event_id?: string
          meet_link?: string
          created_by_id: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          prospect_id?: string
          title?: string
          starts_at?: string
          ends_at?: string
          calendar_event_id?: string
          meet_link?: string
          created_by_id?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          client_id: string
          amount: number
          currency: string
          description: string
          invoice_date: string
          paid: boolean
          paid_at?: string
          due_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          amount: number
          currency: string
          description: string
          invoice_date: string
          paid?: boolean
          paid_at?: string
          due_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          amount?: number
          currency?: string
          description?: string
          invoice_date?: string
          paid?: boolean
          paid_at?: string
          due_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          service: 'website' | 'organic' | 'paid_ads' | 'branding' | 'ops' | string
          status: 'todo' | 'doing' | 'done' | string
          description?: string
          deadline?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          service: 'website' | 'organic' | 'paid_ads' | 'branding' | 'ops' | string
          status?: 'todo' | 'doing' | 'done' | string
          description?: string
          deadline?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          service?: 'website' | 'organic' | 'paid_ads' | 'branding' | 'ops' | string
          status?: 'todo' | 'doing' | 'done' | string
          description?: string
          deadline?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      prospects: {
        Row: {
          id: string
          owner_id: string
          contact_name: string
          company_name?: string
          phone: string
          email: string
          lead_source: string
          business_type: string
          region_city: string
          region_state: string
          timezone: string
          score: number
          status: 'new' | 'interested' | 'negotiation' | 'lost' | string
          first_contact_at: string
          call_summary?: string
          notes?: string
          next_follow_up_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          contact_name: string
          company_name?: string
          phone: string
          email: string
          lead_source: string
          business_type: string
          region_city: string
          region_state: string
          timezone: string
          score?: number
          status?: 'new' | 'interested' | 'negotiation' | 'lost' | string
          first_contact_at?: string
          call_summary?: string
          notes?: string
          next_follow_up_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          contact_name?: string
          company_name?: string
          phone?: string
          email?: string
          lead_source?: string
          business_type?: string
          region_city?: string
          region_state?: string
          timezone?: string
          score?: number
          status?: 'new' | 'interested' | 'negotiation' | 'lost' | string
          first_contact_at?: string
          call_summary?: string
          notes?: string
          next_follow_up_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          status: 'todo' | 'doing' | 'done' | string
          due_at?: string
          assignee_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          status?: 'todo' | 'doing' | 'done' | string
          due_at?: string
          assignee_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          status?: 'todo' | 'doing' | 'done' | string
          due_at?: string
          assignee_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          created_at: string
          avatar_url: string | null
          phone: string | null
          title: string | null
          department: string | null
          bio: string | null
          last_login_at: string | null
          last_active_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role: string
          created_at?: string
          avatar_url?: string | null
          phone?: string | null
          title?: string | null
          department?: string | null
          bio?: string | null
          last_login_at?: string | null
          last_active_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          created_at?: string
          avatar_url?: string | null
          phone?: string | null
          title?: string | null
          department?: string | null
          bio?: string | null
          last_login_at?: string | null
          last_active_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          theme: string
          email_notifications: boolean
          push_notifications: boolean
          meeting_reminders: boolean
          language: string
          timezone: string
          date_format: string
          time_format: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          theme?: string
          email_notifications?: boolean
          push_notifications?: boolean
          meeting_reminders?: boolean
          language?: string
          timezone?: string
          date_format?: string
          time_format?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme?: string
          email_notifications?: boolean
          push_notifications?: boolean
          meeting_reminders?: boolean
          language?: string
          timezone?: string
          date_format?: string
          time_format?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      convert_prospect_to_client: {
        Args: {
          prospect_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Row']

export type InsertTables<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Insert']

export type UpdateTables<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T] 