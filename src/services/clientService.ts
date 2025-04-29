import { supabase } from '@/lib/supabase';

export type Client = {
  id: string;
  owner_id: string;
  contact_name: string;
  company_name?: string | null;
  phone: string;
  email?: string | null;
  full_address?: string | null;
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

export type ClientFormData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

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

export type CredentialFormData = Omit<Credential, 'id' | 'created_at' | 'updated_at'>;

export type Project = {
  id: string;
  client_id: string;
  service: 'website' | 'paid_ads' | 'organic' | 'branding' | 'ops';
  status: 'todo' | 'doing' | 'done';
  description: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

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

export type Payment = {
  id: string;
  client_id: string;
  amount: number;
  currency: string;
  description: string;
  invoice_date: string;
  paid: boolean;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentFormData = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;

export const clientService = {
  // Client CRUD
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return data as unknown as Client[];
  },

  async getClientsByManager(managerId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('owner_id', managerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching clients for manager ${managerId}:`, error);
      throw error;
    }
    
    return data as unknown as Client[];
  },

  async getClient(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
    
    return data as unknown as Client;
  },

  async updateClient(id: string, updates: Partial<ClientFormData>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
    
    return data as unknown as Client;
  },

  // Credentials CRUD
  async getCredentials(clientId: string): Promise<Credential[]> {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching credentials for client ${clientId}:`, error);
      throw error;
    }
    
    return data as Credential[];
  },

  async createCredential(credential: CredentialFormData): Promise<Credential> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('credentials')
      .insert({
        ...credential,
        created_at: now,
        updated_at: now,
      } as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating credential:', error);
      throw error;
    }
    
    return data as Credential;
  },

  async updateCredential(id: string, updates: Partial<CredentialFormData>): Promise<Credential> {
    const { data, error } = await supabase
      .from('credentials')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating credential ${id}:`, error);
      throw error;
    }
    
    return data as Credential;
  },

  async deleteCredential(id: string): Promise<void> {
    const { error } = await supabase
      .from('credentials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting credential ${id}:`, error);
      throw error;
    }
  },

  // Projects CRUD
  async getProjects(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching projects for client ${clientId}:`, error);
      throw error;
    }
    
    return data as Project[];
  },

  async createProject(project: ProjectFormData): Promise<Project> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        created_at: now,
        updated_at: now,
      } as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<ProjectFormData>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
    
    return data as Project;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  },

  // Tasks CRUD
  async getTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
    
    return data as Task[];
  },

  async createTask(task: TaskFormData): Promise<Task> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        created_at: now,
        updated_at: now,
      } as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<TaskFormData>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
    
    return data as Task;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },

  // Payments CRUD
  async getPayments(clientId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('client_id', clientId)
      .order('invoice_date', { ascending: false });
    
    if (error) {
      console.error(`Error fetching payments for client ${clientId}:`, error);
      throw error;
    }
    
    return data as Payment[];
  },

  async createPayment(payment: PaymentFormData): Promise<Payment> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ...payment,
        created_at: now,
        updated_at: now,
      } as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
    
    return data as Payment;
  },

  async updatePayment(id: string, updates: Partial<PaymentFormData>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
    
    return data as Payment;
  },

  async deletePayment(id: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  },
}; 