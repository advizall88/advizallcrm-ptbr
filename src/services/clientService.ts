import { supabase } from '@/lib/supabase';
import type { Client, Project, Payment } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export type ClientFormData = {
  id?: string;
  account_manager_id?: string;
  contact_name?: string;
  company_name?: string | null;
  phone?: string;
  email?: string | null;
  full_address?: string | null;
  zip_code?: string | null;
  website?: string | null;
  social_links?: any | null;
  lead_source?: string | null;
  business_type?: string | null;
  region_city?: string | null;
  region_state?: string | null;
  timezone?: string | null;
  score?: number | null;
  status?: 'active' | 'inactive' | 'delinquent' | null;
  plan_name?: string | null;
  monthly_fee?: number | null;
  ad_budget?: number | null;
  notes?: string | null;
  call_summary?: string | null;
  first_contact_at?: string | null;
};

export type CredentialFormData = {
  id?: string;
  client_id?: string;
  system: 'hosting' | 'domain' | 'facebook' | 'instagram' | 'other';
  login: string;
  password: string;
  notes?: string | null;
  visible_to?: 'moderator' | 'admin';
};

export type ProjectFormData = {
  id?: string;
  client_id?: string;
  service: 'website' | 'paid_ads' | 'organic' | 'branding' | 'ops';
  status: 'todo' | 'doing' | 'done';
  description: string;
  deadline?: string | null;
};

export type PaymentFormData = {
  id?: string;
  client_id?: string;
  amount: number;
  currency: string;
  description: string;
  invoice_date: string;
  paid: boolean;
  paid_at?: string | null;
};

export type ClientData = {
  id: string;
  account_manager_id: string;
  contact_name: string;
  company_name?: string | null;
  phone: string;
  email?: string | null;
  full_address?: string | null;
  zip_code?: string | null;
  website?: string | null;
  social_links?: string | null;
  lead_source?: string | null;
  business_type?: string | null;
  region_city?: string | null;
  region_state?: string | null;
  timezone?: string | null;
  score?: number | null;
  status?: 'active' | 'inactive' | 'delinquent' | null;
  plan_name?: string | null;
  monthly_fee?: number | null;
  ad_budget?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

// Define Credential type locally to avoid import conflict
export type Credential = {
  id: string;
  client_id: string;
  system: 'hosting' | 'domain' | 'facebook' | 'instagram' | 'other';
  login: string;
  password: string;
  notes: string | null;
  visible_to: 'moderator' | 'admin';
  created_at: string;
  updated_at: string;
};

// Define Task type locally to avoid import conflict
export type Task = {
  id: string;
  project_id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  due_at: string | null;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskFormData = Omit<Task, 'id' | 'created_at' | 'updated_at'>;

export const clientService = {
  // Client CRUD
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Este método é usado como fallback temporário para clientes convertidos
  async addMockClient(client: any): Promise<Client> {
    try {
      const now = new Date().toISOString();
      
      // Preparar dados do cliente, garantindo que account_manager_id esteja presente
      const clientData = {
        ...client,
        id: client.id || uuidv4(),
        account_manager_id: client.account_manager_id || client.owner_id || 'unknown', // Faz fallback para owner_id se necessário
        created_at: client.created_at || now,
        updated_at: client.updated_at || now
      };
      
      // Remover owner_id se estiver presente para evitar erro
      if ('owner_id' in clientData) {
        delete clientData.owner_id;
      }
      
      // Inserir na tabela de clientes
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }
      
      return data as Client;
    } catch (error) {
      console.error('Error adding client:', error);
      
      // Fallback para localStorage se o Supabase falhar
      try {
        // Para manter compatibilidade, mantemos o localStorage como fallback
        const storageKey = 'clients';
        const existingClientsJSON = localStorage.getItem(storageKey);
        let existingClients: Client[] = [];
        
        if (existingClientsJSON) {
          try {
            existingClients = JSON.parse(existingClientsJSON);
          } catch (e) {
            console.error('Error parsing clients from localStorage:', e);
            existingClients = [];
          }
        }
        
        // Garantir que estamos usando account_manager_id no fallback também
        const newClient = {
          ...client,
          id: client.id || uuidv4(),
          account_manager_id: client.account_manager_id || client.owner_id || 'unknown',
          created_at: client.created_at || new Date().toISOString(),
          updated_at: client.updated_at || new Date().toISOString()
        };
        
        // Remover owner_id se estiver presente
        if ('owner_id' in newClient) {
          delete newClient.owner_id;
        }
        
        existingClients.push(newClient);
        localStorage.setItem(storageKey, JSON.stringify(existingClients));
        
        return newClient as Client;
      } catch (fallbackError) {
        console.error('Fallback to localStorage also failed:', fallbackError);
        throw error;
      }
    }
  },

  async getClientsByManager(managerId: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('account_manager_id', managerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    } catch (error) {
      console.error(`Error fetching clients for manager ${managerId}:`, error);
      throw error;
    }
  },

  async getClient(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data as Client;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  async updateClient(id: string, data: ClientFormData): Promise<Client> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Remover campos problemáticos temporariamente se eles causarem erros
      try {
        const { data: updatedClient, error } = await supabase
          .from('clients')
          .update(updateData as any)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return updatedClient as Client;
      } catch (error: any) {
        // Se ocorrer erro relacionado ao campo monthly_fee, tentar novamente sem esse campo
        if (error.message && error.message.includes('monthly_fee')) {
          console.warn('Campo monthly_fee não encontrado, tentando atualizar sem ele.');
          const safeUpdateData = { ...updateData };
          delete safeUpdateData.monthly_fee;
          delete safeUpdateData.ad_budget;
          
          const { data: updatedClient, error: retryError } = await supabase
            .from('clients')
            .update(safeUpdateData as any)
            .eq('id', id)
            .select()
            .single();
          
          if (retryError) throw retryError;
          return updatedClient as Client;
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  },

  // Credentials CRUD
  async getCredentials(clientId: string): Promise<Credential[]> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Credential[];
    } catch (error) {
      console.error(`Error fetching credentials for client ${clientId}:`, error);
      throw error;
    }
  },

  async createCredential(data: CredentialFormData): Promise<Credential> {
    try {
      const now = new Date().toISOString();
      
      const credentialData = {
        id: uuidv4(),
        client_id: data.client_id,
        system: data.system,
        login: data.login,
        password: data.password,
        notes: data.notes || null,
        visible_to: data.visible_to || 'moderator',
        created_at: now,
        updated_at: now
      };
      
      const { data: newCredential, error } = await supabase
        .from('credentials')
        .insert(credentialData)
        .select()
        .single();
      
      if (error) throw error;
      return newCredential as Credential;
    } catch (error) {
      console.error('Error creating credential:', error);
      throw error;
    }
  },

  async updateCredential(id: string, data: CredentialFormData): Promise<Credential> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      const { data: updatedCredential, error } = await supabase
        .from('credentials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedCredential as Credential;
    } catch (error) {
      console.error(`Error updating credential ${id}:`, error);
      throw error;
    }
  },

  async deleteCredential(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting credential ${id}:`, error);
      throw error;
    }
  },

  // Projects CRUD
  async getProjects(clientId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    } catch (error) {
      console.error(`Error fetching projects for client ${clientId}:`, error);
      throw error;
    }
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    try {
      const now = new Date().toISOString();
      
      const projectData = {
        id: uuidv4(),
        client_id: data.client_id,
        service: data.service,
        status: data.status,
        description: data.description,
        deadline: data.deadline || null,
        created_at: now,
        updated_at: now
      };
      
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();
      
      if (error) throw error;
      return newProject as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(id: string, data: ProjectFormData): Promise<Project> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedProject as Project;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      // Primeiro apagamos todas as tarefas relacionadas ao projeto
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', id);
      
      if (tasksError) throw tasksError;
      
      // Depois removemos o projeto
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  },

  // Tasks CRUD
  async getTasks(projectId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  },

  async createTask(task: TaskFormData): Promise<Task> {
    try {
      const now = new Date().toISOString();
      
      const taskData = {
        id: uuidv4(),
        ...task,
        created_at: now,
        updated_at: now
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (error) throw error;
      return data as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(id: string, updates: Partial<TaskFormData>): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Task;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },

  // Payments CRUD
  async getPayments(clientId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', clientId)
        .order('invoice_date', { ascending: false });
      
      if (error) throw error;
      return data as Payment[];
    } catch (error) {
      console.error(`Error fetching payments for client ${clientId}:`, error);
      throw error;
    }
  },

  async createPayment(data: PaymentFormData): Promise<Payment> {
    try {
      const now = new Date().toISOString();
      
      const paymentData = {
        id: uuidv4(),
        client_id: data.client_id,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        invoice_date: data.invoice_date,
        paid: data.paid,
        paid_at: data.paid ? data.paid_at || now : null,
        created_at: now,
        updated_at: now
      };
      
      const { data: newPayment, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();
      
      if (error) throw error;
      return newPayment as Payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  async updatePayment(id: string, updates: Partial<PaymentFormData>): Promise<Payment> {
    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Se o pagamento for marcado como pago e não tiver data de pagamento,
      // definir a data atual como data de pagamento
      if (updates.paid && !updates.paid_at) {
        updateData.paid_at = new Date().toISOString();
      }
      
      // Se o pagamento for marcado como não pago, remover a data de pagamento
      if (updates.paid === false) {
        updateData.paid_at = null;
      }
      
      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Payment;
    } catch (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
  },

  async deletePayment(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  }
}; 