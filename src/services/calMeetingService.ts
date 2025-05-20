import { supabase, CalMeeting } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

// Use type alias for insert operation
export type CalMeetingInsert = Database['public']['Tables']['cal_meetings']['Insert'];

/**
 * Serviço para gerenciar reuniões do Cal.com
 * 
 * IMPORTANTE: Este serviço requer a tabela cal_meetings no banco de dados.
 * Execute a migração em supabase/migrations/20240430_meetings_cal.sql 
 * antes de usar este serviço em produção.
 */
export const calMeetingService = {
  /**
   * Busca todas as reuniões
   */
  async getMeetings(): Promise<CalMeeting[]> {
    try {
      const { data, error } = await supabase
        .from('cal_meetings')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMeetings:', error);
      return [];
    }
  },

  /**
   * Busca reuniões futuras (data de início >= hora atual)
   */
  async getUpcomingMeetings(): Promise<CalMeeting[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('cal_meetings')
        .select('*')
        .gte('start_time', now)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming meetings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUpcomingMeetings:', error);
      return [];
    }
  },

  /**
   * Busca reuniões passadas (data de início < hora atual)
   */
  async getPastMeetings(): Promise<CalMeeting[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('cal_meetings')
        .select('*')
        .lt('start_time', now)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching past meetings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPastMeetings:', error);
      return [];
    }
  },

  /**
   * Busca uma reunião pelo iCalUID
   */
  async getMeetingByICalUID(iCalUID: string): Promise<CalMeeting | null> {
    try {
      const { data, error } = await supabase
        .from('cal_meetings')
        .select('*')
        .eq('ical_uid', iCalUID)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        console.error('Error fetching meeting by iCalUID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getMeetingByICalUID:', error);
      return null;
    }
  },

  /**
   * Cria ou atualiza uma reunião
   */
  async createOrUpdateMeeting(meeting: CalMeetingInsert): Promise<CalMeeting> {
    try {
      const existingMeeting = await this.getMeetingByICalUID(meeting.ical_uid);

      if (existingMeeting) {
        // Update existing meeting
        const { data, error } = await supabase
          .from('cal_meetings')
          .update({
            title: meeting.title,
            description: meeting.description,
            start_time: meeting.start_time,
            end_time: meeting.end_time,
            status: meeting.status,
            attendee_name: meeting.attendee_name,
            attendee_email: meeting.attendee_email,
            meeting_link: meeting.meeting_link,
            trigger_event: meeting.trigger_event,
            additional_notes: meeting.additional_notes,
            phone_number: meeting.phone_number,
            reschedule_reason: meeting.reschedule_reason,
            cancellation_reason: meeting.cancellation_reason
          })
          .eq('ical_uid', meeting.ical_uid)
          .select()
          .single();

        if (error) {
          console.error('Error updating meeting:', error);
          throw error;
        }

        return data;
      } else {
        // Insert new meeting
        const { data, error } = await supabase
          .from('cal_meetings')
          .insert(meeting)
          .select()
          .single();

        if (error) {
          console.error('Error creating meeting:', error);
          throw error;
        }

        return data;
      }
    } catch (error) {
      console.error('Error in createOrUpdateMeeting:', error);
      return { 
        id: 'error-id', 
        ical_uid: meeting.ical_uid,
        title: meeting.title,
        description: meeting.description || null,
        start_time: meeting.start_time,
        end_time: meeting.end_time,
        status: meeting.status,
        attendee_name: meeting.attendee_name || null,
        attendee_email: meeting.attendee_email || null,
        meeting_link: meeting.meeting_link || null,
        trigger_event: meeting.trigger_event,
        additional_notes: meeting.additional_notes || null,
        phone_number: meeting.phone_number || null,
        reschedule_reason: meeting.reschedule_reason || null,
        cancellation_reason: meeting.cancellation_reason || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        attendees: null,
        organizer: null,
        calendar_event_id: null,
        location: null,
        event_type: null,
        cal_user_id: null,
        processed: false,
        raw_payload: null
      };
    }
  }
};

export default calMeetingService; 