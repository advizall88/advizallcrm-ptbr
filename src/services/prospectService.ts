import { supabase, Prospect } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { clientService } from './clientService';
import type { Client } from '@/lib/supabase';

// In-memory fallback storage when localStorage is unavailable
const memoryStorage: Record<string, string> = {};

// Helpers for storage with error handling and fallback to in-memory storage
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      // First try localStorage
      const value = localStorage.getItem(key);
      if (value !== null) return value;
      
      // Fallback to memory storage
      return memoryStorage[key] || null;
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      // Fallback to memory storage
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      // Always store in memory
      memoryStorage[key] = value;
      
      // Try to store in localStorage
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
      // Already saved to memory storage
    }
  },
  removeItem: (key: string): void => {
    try {
      // Remove from both storages
      delete memoryStorage[key];
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      // Already removed from memory storage
    }
  }
};

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
  order_index?: number | null;
};

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
      // Using a more reliable approach with storage
      let convertedProspectIds: string[] = [];
      
      // Get list of converted prospect IDs from storage
      try {
        const convertedProspects = safeStorage.getItem('convertedProspects');
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
    
    // Verificar se temos um owner_id, se não, tente recuperar do localStorage
    if (!prospect.owner_id) {
      try {
        const userString = localStorage.getItem('auth_user');
        if (userString) {
          const user = JSON.parse(userString);
          prospect.owner_id = user.id;
        }
      } catch (error) {
        console.warn('Error accessing localStorage for user ID:', error);
      }
      
      // Se ainda não temos um owner_id, lance um erro específico
      if (!prospect.owner_id) {
        throw new Error('Missing owner_id for prospect. User authentication may be required.');
      }
    }
    
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
    try {
      // Passo 1: Atualizar o registro sem tentar buscar o resultado
      const { error: updateError } = await supabase
        .from('prospects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) {
        console.error(`Error updating prospect ${id}:`, updateError);
        throw updateError;
      }
      
      // Passo 2: Buscar o registro atualizado separadamente
      const { data, error: fetchError } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      // Se conseguirmos buscar o registro atualizado, ótimo
      if (data) {
        return data as Prospect;
      }
      
      // Se não conseguirmos buscar, mas a atualização foi bem-sucedida,
      // retorne um objeto com os campos que sabemos que foram atualizados
      if (fetchError) {
        console.warn(`Updated prospect ${id} but could not fetch it:`, fetchError);
        return {
          id,
          ...updates,
          updated_at: new Date().toISOString()
        } as Prospect;
      }
      
      // Se não encontramos o registro após atualização
      console.error(`Prospect with id ${id} not found after update`);
      throw new Error(`Prospect with id ${id} not found or could not be updated`);
    } catch (error) {
      console.error(`Error updating prospect ${id}:`, error);
      throw error;
    }
  },

  async updateProspectStatus(id: string, status: Prospect['status']): Promise<Prospect> {
    return this.updateProspect(id, { status });
  },
  
  async updateProspectOrder(id: string, status: Prospect['status'], order: number): Promise<Prospect> {
    // Aqui seria implementado se você tivesse um campo de ordem no banco de dados
    // Mas como estamos usando Supabase, isso pode ser feito de outra forma
    // Por ora, apenas retorna o status atualizado
    return this.updateProspect(id, { status });
  },

  async reorderProspects(
    sourceStatus: Prospect['status'],
    destinationStatus: Prospect['status'],
    sourceIndex: number,
    destinationIndex: number,
    prospectId: string
  ): Promise<void> {
    try {
      // Atualiza apenas o status do prospecto, sem outros campos
      const { error } = await supabase
        .from('prospects')
        .update({
          status: destinationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', prospectId);
      
      if (error) {
        console.error(`Error updating prospect status ${prospectId}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Error reordering prospect ${prospectId}:`, error);
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
      // Verifica no armazenamento
      try {
        const convertedProspects = safeStorage.getItem('convertedProspects');
        if (convertedProspects) {
          const parsed = JSON.parse(convertedProspects);
          if (Array.isArray(parsed) && parsed.includes(id)) {
            return true;
          }
        }
      } catch (e) {
        console.error('Error checking convertedProspects in storage:', e);
      }
      
      // Verifica no banco de dados de clientes se existe um com o mesmo ID
      // Este é um método mais confiável do que confiar apenas no armazenamento local
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error(`Error checking if prospect ${id} is client:`, error);
        // Não lança erro, apenas retorna falso
        return false;
      }
      
      // Se encontrou um cliente com esse ID, então o prospect foi convertido
      if (data) {
        // Garante que ele está na lista do armazenamento para futuras verificações
        this.markProspectAsConverted(id);
        return true;
      }
      
      return false;
    } catch (e) {
      console.error('Error in checkIfProspectIsClient:', e);
      return false;
    }
  },
  
  // Helper function to mark a prospect as converted in storage
  markProspectAsConverted(id: string): void {
    try {
      let convertedProspects: string[] = [];
      const stored = safeStorage.getItem('convertedProspects');
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            convertedProspects = parsed;
          }
        } catch (e) {
          console.error('Error parsing convertedProspects:', e);
        }
      }
      
      if (!convertedProspects.includes(id)) {
        convertedProspects.push(id);
        safeStorage.setItem('convertedProspects', JSON.stringify(convertedProspects));
      }
    } catch (e) {
      console.error('Error marking prospect as converted:', e);
    }
  },

  async convertToClient(id: string): Promise<{ success: boolean; client_id?: string; error?: any; message?: string; already_exists?: boolean }> {
    try {
      // Primeiro, verifique se o prospect já foi convertido
      const alreadyConverted = await this.checkIfProspectIsClient(id);
      
      if (alreadyConverted) {
        return {
          success: false,
          already_exists: true,
          message: 'This prospect has already been converted to a client'
        };
      }
      
      // Busca os dados do prospect
      const prospect = await this.getProspect(id);
      
      // Criando um novo cliente baseado nos dados do prospect
      const newClient: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
        owner_id: prospect.owner_id,
        contact_name: prospect.contact_name,
        company_name: prospect.company_name,
        phone: prospect.phone,
        email: prospect.email,
        lead_source: prospect.lead_source,
        business_type: prospect.business_type,
        region_city: prospect.region_city,
        region_state: prospect.region_state,
        timezone: prospect.timezone,
        status: 'active',
        first_contact_at: prospect.first_contact_at,
        call_summary: prospect.call_summary,
        notes: prospect.notes,
        score: prospect.score,
      };
      
      // Chama a função RPC do Supabase para converter o prospect em cliente
      const { data, error } = await supabase
        .rpc('convert_prospect_to_client', { prospect_id: id })
        .single();
      
      if (error) {
        console.error('Error converting prospect to client:', error);
        
        // Fallback para o método cliente mockado se o RPC falhar
        try {
          const client = await clientService.addMockClient(newClient);
          this.markProspectAsConverted(id);
          return { success: true, client_id: client.id };
        } catch (fallbackError) {
          console.error('Fallback client creation also failed:', fallbackError);
          return { success: false, error: fallbackError };
        }
      }
      
      // RPC bem-sucedido
      const client_id = data;
      this.markProspectAsConverted(id);
      
      return { success: true, client_id };
    } catch (error) {
      console.error('Error in convertToClient:', error);
      return { success: false, error };
    }
  }
}; 