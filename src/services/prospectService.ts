import { supabase, Prospect } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { clientService } from './clientService';
import type { Client } from '@/lib/supabase';

export type ProspectFormData = {
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
};

// Mock data para prospectos
const MOCK_PROSPECTS: Prospect[] = [
  {
    id: uuidv4(),
    owner_id: '123e4567-e89b-12d3-a456-426614174000', // ID do usuário de teste
    contact_name: 'João Silva',
    company_name: 'Tech Solutions',
    phone: '(11) 98765-4321',
    email: 'joao@techsolutions.com',
    lead_source: 'Website',
    business_type: 'Technology',
    region_city: 'São Paulo',
    region_state: 'SP',
    timezone: 'America/Sao_Paulo',
    score: 4,
    status: 'interested',
    first_contact_at: new Date(2023, 9, 15).toISOString(),
    call_summary: 'Cliente potencial para serviços de desenvolvimento web.',
    notes: 'Demonstrou interesse em redesenho do site atual.',
    next_follow_up_at: new Date(2023, 10, 5).toISOString(),
    created_at: new Date(2023, 9, 15).toISOString(),
    updated_at: new Date(2023, 9, 15).toISOString()
  },
  {
    id: uuidv4(),
    owner_id: '123e4567-e89b-12d3-a456-426614174000', // ID do usuário de teste
    contact_name: 'Maria Oliveira',
    company_name: 'Café Expresso',
    phone: '(11) 97654-3210',
    email: 'maria@cafeexpresso.com',
    lead_source: 'Referral',
    business_type: 'Food & Beverage',
    region_city: 'Rio de Janeiro',
    region_state: 'RJ',
    timezone: 'America/Sao_Paulo',
    score: 3,
    status: 'new',
    first_contact_at: new Date(2023, 9, 20).toISOString(),
    call_summary: 'Interessada em marketing digital para sua cafeteria.',
    notes: 'Precisa aumentar presença online para competir com grandes redes.',
    next_follow_up_at: new Date(2023, 10, 10).toISOString(),
    created_at: new Date(2023, 9, 20).toISOString(),
    updated_at: new Date(2023, 9, 20).toISOString()
  },
  {
    id: uuidv4(),
    owner_id: '123e4567-e89b-12d3-a456-426614174000', // ID do usuário de teste
    contact_name: 'Paulo Mendes',
    company_name: 'Construções PM',
    phone: '(11) 99876-5432',
    email: 'paulo@construcoespm.com',
    lead_source: 'Cold Call',
    business_type: 'Construction',
    region_city: 'Curitiba',
    region_state: 'PR',
    timezone: 'America/Sao_Paulo',
    score: 5,
    status: 'negotiation',
    first_contact_at: new Date(2023, 9, 10).toISOString(),
    call_summary: 'Empresa de construção buscando atualizar sua identidade visual e estratégia de marketing.',
    notes: 'Orçamento disponível para projeto completo.',
    next_follow_up_at: new Date(2023, 10, 1).toISOString(),
    created_at: new Date(2023, 9, 10).toISOString(),
    updated_at: new Date(2023, 9, 10).toISOString()
  },
  {
    id: uuidv4(),
    owner_id: '123e4567-e89b-12d3-a456-426614174000', // ID do usuário de teste
    contact_name: 'Ana Santos',
    company_name: 'Moda AS',
    phone: '(11) 91234-5678',
    email: 'ana@modaas.com',
    lead_source: 'Social Media',
    business_type: 'Retail',
    region_city: 'Belo Horizonte',
    region_state: 'MG',
    timezone: 'America/Sao_Paulo',
    score: 2,
    status: 'lost',
    first_contact_at: new Date(2023, 8, 25).toISOString(),
    call_summary: 'Pequeno negócio de moda procurando expandir presença online.',
    notes: 'Orçamento limitado, ficou indecisa sobre avançar com o projeto.',
    next_follow_up_at: null,
    created_at: new Date(2023, 8, 25).toISOString(),
    updated_at: new Date(2023, 9, 25).toISOString()
  }
];

// Array mutável para armazenar os prospectos
let prospects = [...MOCK_PROSPECTS];

export const prospectService = {
  async getProspects(): Promise<Prospect[]> {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching prospects:', error);
        throw error;
      }
      
      const prospects = data as Prospect[];
      
      // Filter out prospects that have been converted to clients
      // Using a more reliable approach with localStorage
      let convertedProspectIds: string[] = [];
      
      // Get list of converted prospect IDs from localStorage
      try {
        const convertedProspects = localStorage.getItem('convertedProspects');
        if (convertedProspects) {
          const parsed = JSON.parse(convertedProspects);
          if (Array.isArray(parsed)) {
            convertedProspectIds = parsed;
            console.log(`Found ${convertedProspectIds.length} converted prospects to filter out`);
          }
        }
      } catch (e) {
        console.error('Error parsing convertedProspects:', e);
      }
      
      // Filter out prospects that have been converted
      const filteredProspects = prospects.filter(prospect => 
        !convertedProspectIds.includes(prospect.id)
      );
      
      console.log(`Filtered ${prospects.length - filteredProspects.length} converted prospects`);
      
      return filteredProspects;
    } catch (error) {
      console.error('Error fetching prospects:', error);
      throw error;
    }
  },

  async getProspectsByStatus(status: Prospect['status']): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching prospects with status ${status}:`, error);
      throw error;
    }
    
    return data as Prospect[];
  },

  async getProspectsByOwner(ownerId: string): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching prospects for owner ${ownerId}:`, error);
      throw error;
    }
    
    return data as Prospect[];
  },

  async getProspect(id: string): Promise<Prospect> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching prospect ${id}:`, error);
      throw error;
    }
    
    return data as Prospect;
  },

  async createProspect(prospect: ProspectFormData): Promise<Prospect> {
    const now = new Date().toISOString();
    
    // Preparar os dados com valores padrão para campos opcionais
    const prospectData = {
      owner_id: prospect.owner_id,
      contact_name: prospect.contact_name,
      phone: prospect.phone,
      company_name: prospect.company_name || null,
      email: prospect.email || null,
      lead_source: prospect.lead_source || "Other",
      business_type: prospect.business_type || "Other",
      region_city: prospect.region_city || null,
      region_state: prospect.region_state || null,
      timezone: prospect.timezone || 'America/Chicago',
      score: prospect.score || 3,
      status: prospect.status || 'new',
      first_contact_at: prospect.first_contact_at || now,
      call_summary: prospect.call_summary || null,
      notes: prospect.notes || null,
      next_follow_up_at: prospect.next_follow_up_at || null,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('prospects')
      .insert(prospectData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating prospect:', error);
      throw error;
    }
    
    return data as Prospect;
  },

  async updateProspect(id: string, updates: Partial<ProspectFormData>): Promise<Prospect> {
    const { data, error } = await supabase
      .from('prospects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating prospect ${id}:`, error);
      throw error;
    }
    
    return data as Prospect;
  },

  async updateProspectStatus(id: string, status: Prospect['status']): Promise<Prospect> {
    return this.updateProspect(id, { status });
  },

  async updateProspectOrder(id: string, status: Prospect['status'], order: number): Promise<Prospect> {
    const { data, error } = await supabase
      .from('prospects')
      .update({
        status,
        order_index: order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating prospect order for ${id}:`, error);
      throw error;
    }
    
    return data as Prospect;
  },

  async reorderProspects(
    sourceStatus: Prospect['status'],
    destinationStatus: Prospect['status'],
    sourceIndex: number,
    destinationIndex: number,
    prospectId: string
  ): Promise<void> {
    try {
      // First update the moved prospect's status
      await this.updateProspectStatus(prospectId, destinationStatus);
      
      // Then update the order of all affected prospects
      // This would ideally be done in a single transaction or batch operation
      // but for simplicity, we'll just update the moved prospect here
      
      // In a real application, you'd want to update all items that were affected
      // by the reordering to maintain consistent order indexes
      
      console.log(`Reordered prospect ${prospectId} from ${sourceStatus}[${sourceIndex}] to ${destinationStatus}[${destinationIndex}]`);
    } catch (error) {
      console.error('Error reordering prospects:', error);
      throw error;
    }
  },

  async deleteProspect(id: string): Promise<void> {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting prospect ${id}:`, error);
      throw error;
    }
  },

  async checkIfProspectIsClient(id: string): Promise<boolean> {
    try {
      // Check the localStorage for the list of converted prospects
      const convertedList = localStorage.getItem('convertedProspects');
      if (convertedList) {
        const parsed = JSON.parse(convertedList);
        if (Array.isArray(parsed) && parsed.includes(id)) {
          console.log(`Prospect ${id} is already a client (found in convertedProspects)`);
          return true;
        }
      }
      
      // Double-check by trying to get the client directly
      try {
        const client = await clientService.getClient(id);
        if (client) {
          console.log(`Prospect ${id} is already a client (found in clients)`);
          
          // Ensure it's in the convertedList for future checks
          const existingList = convertedList ? JSON.parse(convertedList) : [];
          if (!existingList.includes(id)) {
            existingList.push(id);
            localStorage.setItem('convertedProspects', JSON.stringify(existingList));
            console.log(`Added ${id} to convertedProspects list for consistency`);
          }
          
          return true;
        }
      } catch (error) {
        console.error(`Error checking client existence for ${id}:`, error);
      }
      
      return false;
    } catch (error) {
      console.error(`Error checking if prospect ${id} is client:`, error);
      return false;
    }
  },

  async convertToClient(id: string): Promise<{ success: boolean; client_id?: string; error?: any; message?: string; already_exists?: boolean }> {
    try {
      // First check if the prospect is already a client
      const isAlreadyClient = await this.checkIfProspectIsClient(id);
      
      if (isAlreadyClient) {
        console.log(`Prospect ${id} is already a client, returning existing client info`);
        return { 
          success: false, 
          already_exists: true, 
          client_id: id,
          message: 'This prospect has already been converted to a client.' 
        };
      }
      
      // Get the prospect data to convert
      const prospect = await this.getProspect(id);
      if (!prospect) {
        console.error(`Error converting prospect ${id} to client: Prospect not found`);
        return { 
          success: false, 
          message: 'Prospect not found. Unable to convert to client.' 
        };
      }
      
      console.log(`Creating client from prospect ${id}: ${prospect.contact_name}`);
      
      // Create the client with prospect data (with better type safety)
      const newClient = {
        id: prospect.id,
        owner_id: prospect.owner_id || 'usr_1', // Fallback to default user
        contact_name: prospect.contact_name,
        company_name: prospect.company_name,
        phone: prospect.phone,
        email: prospect.email,
        lead_source: prospect.lead_source,
        business_type: prospect.business_type,
        region_city: prospect.region_city,
        region_state: prospect.region_state,
        timezone: prospect.timezone,
        score: prospect.score,
        full_address: `${prospect.region_city || ''}, ${prospect.region_state || ''}`,
        website: '', // Initialize with empty values
        social_links: {},
        first_contact_at: prospect.first_contact_at,
        call_summary: prospect.call_summary,
        notes: prospect.notes,
        status: 'active',
        plan_name: 'Basic', // Set default plan
        retainer_value: 0, // Default values can be set later
        ad_budget: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store in localStorage
      await clientService.addMockClient(newClient);
      
      // Mark as converted in localStorage
      let convertedList: string[] = [];
      const storedConvertedList = localStorage.getItem('convertedProspects');
      
      if (storedConvertedList) {
        try {
          const parsed = JSON.parse(storedConvertedList);
          if (Array.isArray(parsed)) {
            convertedList = parsed;
          }
        } catch (e) {
          console.error('Error parsing convertedProspects:', e);
        }
      }
      
      // Add to converted list if not already there
      if (!convertedList.includes(id)) {
        convertedList.push(id);
        localStorage.setItem('convertedProspects', JSON.stringify(convertedList));
        console.log(`Added ${id} to convertedProspects list`);
      }
      
      console.log(`Successfully converted prospect ${id} to client.`);
      
      return { success: true, client_id: id };
    } catch (error) {
      console.error(`Error converting prospect ${id} to client:`, error);
      return { 
        success: false, 
        error,
        message: 'An error occurred while converting the prospect to a client.' 
      };
    }
  }
}; 