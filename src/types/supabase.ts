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
          ical_uid: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: string
          attendee_name: string | null
          attendee_email: string | null
          meeting_url: string | null
          trigger_event: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ical_uid: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status: string
          attendee_name?: string | null
          attendee_email?: string | null
          meeting_url?: string | null
          trigger_event: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ical_uid?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: string
          attendee_name?: string | null
          attendee_email?: string | null
          meeting_url?: string | null
          trigger_event?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          /* Definição de tipos existentes... */
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      credentials: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      meetings: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      prospects: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          [key: string]: any
        }
        Insert: {
          id?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'moderator' | 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'moderator' | 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'moderator' | 'admin' | 'user'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
} 