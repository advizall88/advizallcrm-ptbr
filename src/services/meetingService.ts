import { supabase, Meeting } from '@/lib/supabase';

export type MeetingFormData = Omit<Meeting, 'id' | 'created_at' | 'updated_at'>;

// Helper function for Google Calendar integration
const formatTimeToISO = (date: Date): string => {
  return date.toISOString();
};

export const meetingService = {
  async getMeetings(): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('starts_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
    
    return data as Meeting[];
  },

  async getUpcomingMeetings(): Promise<Meeting[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .gte('starts_at', now)
      .order('starts_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming meetings:', error);
      throw error;
    }
    
    return data as Meeting[];
  },

  async getMeetingsByClient(clientId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('client_id', clientId)
      .order('starts_at', { ascending: true });
    
    if (error) {
      console.error(`Error fetching meetings for client ${clientId}:`, error);
      throw error;
    }
    
    return data as Meeting[];
  },

  async getMeetingsByProspect(prospectId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('starts_at', { ascending: true });
    
    if (error) {
      console.error(`Error fetching meetings for prospect ${prospectId}:`, error);
      throw error;
    }
    
    return data as Meeting[];
  },

  async getMeeting(id: string): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching meeting ${id}:`, error);
      throw error;
    }
    
    return data as Meeting;
  },

  async createMeeting(meeting: MeetingFormData): Promise<Meeting> {
    const now = new Date().toISOString();
    
    // Create the meeting in the database
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        ...meeting,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
    
    // For now, Google Calendar integration will be handled by a serverless function
    // This would trigger a webhook to n8n or a serverless function
    // that would create the Google Calendar event and update the meeting with the event ID and meet link
    
    return data as Meeting;
  },

  async updateMeeting(id: string, updates: Partial<MeetingFormData>): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating meeting ${id}:`, error);
      throw error;
    }
    
    // If calendar_event_id exists, we should update the Google Calendar event as well
    // This would be handled by a webhook to n8n or a serverless function
    
    return data as Meeting;
  },

  async deleteMeeting(id: string): Promise<void> {
    // First, get the meeting to check if it has a calendar event ID
    const meeting = await this.getMeeting(id);
    
    // Delete the meeting from the database
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting meeting ${id}:`, error);
      throw error;
    }
    
    // If calendar_event_id exists, we should delete the Google Calendar event as well
    // This would be handled by a webhook to n8n or a serverless function
  }
}; 