import { supabase } from '@/lib/supabase';
import type { Client, Project, Payment } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export type ClientFormData = {
  id?: string;
  owner_id?: string;
  contact_name?: string;
  company_name?: string | null;
  phone?: string;
  email?: string | null;
  full_address?: string | null;
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

// Default mock projects data
const mockProjects: Project[] = [
  {
    id: "p1",
    client_id: "1",
    service: "website",
    status: "doing",
    description: "Corporate website redesign",
    deadline: "2025-06-15T00:00:00Z",
    created_at: "2025-04-10T00:00:00Z",
    updated_at: "2025-04-10T00:00:00Z"
  },
  {
    id: "p2",
    client_id: "1",
    service: "paid_ads",
    status: "todo",
    description: "Google Ads Campaign",
    deadline: "2025-06-20T00:00:00Z",
    created_at: "2025-04-10T00:00:00Z",
    updated_at: "2025-04-10T00:00:00Z"
  },
  {
    id: "p3",
    client_id: "2",
    service: "branding",
    status: "done",
    description: "Logo redesign",
    deadline: "2025-05-01T00:00:00Z",
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-04-25T00:00:00Z"
  }
];

// Default mock payments data
const mockPayments: Payment[] = [
  {
    id: "pay1",
    client_id: "1",
    amount: 2500,
    currency: "USD",
    description: "Monthly Fee - May 2025",
    invoice_date: "2025-05-01T00:00:00Z",
    paid: true,
    paid_at: "2025-05-02T00:00:00Z",
    created_at: "2025-04-25T00:00:00Z",
    updated_at: "2025-05-02T00:00:00Z"
  },
  {
    id: "pay2",
    client_id: "1",
    amount: 10000,
    currency: "USD",
    description: "Ad Budget - May 2025",
    invoice_date: "2025-05-01T00:00:00Z",
    paid: false,
    paid_at: null,
    created_at: "2025-04-25T00:00:00Z",
    updated_at: "2025-04-25T00:00:00Z"
  },
  {
    id: "pay3",
    client_id: "2",
    amount: 1500,
    currency: "USD",
    description: "Monthly Fee - May 2025",
    invoice_date: "2025-05-01T00:00:00Z",
    paid: true,
    paid_at: "2025-05-03T00:00:00Z",
    created_at: "2025-04-25T00:00:00Z",
    updated_at: "2025-05-03T00:00:00Z"
  }
];

// Default mock credentials
const mockCredentials: Credential[] = [
  {
    id: uuidv4(),
    client_id: "1",
    system: "hosting",
    login: "abc_admin",
    password: "secure123pass",
    notes: "AWS hosting credentials",
    visible_to: "moderator",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    client_id: "1",
    system: "domain",
    login: "domains_admin",
    password: "domain987pass",
    notes: "Domain registrar credentials",
    visible_to: "moderator",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    client_id: "2",
    system: "facebook",
    login: "xyz_social",
    password: "fb_password123",
    notes: "Facebook Business account",
    visible_to: "moderator",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const clientService = {
  // Client CRUD
  async getClients(): Promise<Client[]> {
    try {
      // In a real app, this would call Supabase
      // const { data, error } = await supabase
      //   .from('clients')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      // return data;
      
      // For now, return mock data
      const mockClients: Client[] = [
        {
          id: "1",
          owner_id: "usr_1",
          contact_name: "John Smith",
          company_name: "ABC Corporation",
          phone: "+1 (123) 456-7890",
          email: "john@abc.com",
          lead_source: "Referral",
          business_type: "Technology",
          region_city: "Chicago",
          region_state: "IL",
          timezone: "America/Chicago",
          score: 4,
          status: "active" as any, // Cast to any to avoid type conflict
          first_contact_at: "2025-01-15T10:30:00Z",
          call_summary: "Client interested in full digital marketing services. Initial meeting was productive.",
          notes: "Technology company looking to expand, with needs to improve online presence and generate qualified leads.",
          created_at: "2025-01-15T10:30:00Z",
          updated_at: "2025-04-20T14:25:00Z",
          full_address: "123 Business St, Chicago, IL, 60601",
          website: "www.abccorp.com",
          social_links: { facebook: "facebook.com/abccorp", linkedin: "linkedin.com/company/abccorp" },
          plan_name: "Premium",
          retainer_value: 2500,
          ad_budget: 10000
        },
        {
          id: "2",
          owner_id: "usr_2",
          contact_name: "Mary Johnson",
          company_name: "XYZ Inc",
          phone: "+1 (987) 654-3210",
          email: "mary@xyz.com",
          lead_source: "Google Ads",
          business_type: "Marketing",
          region_city: "New York",
          region_state: "NY",
          timezone: "America/New_York",
          score: 3,
          status: "active" as any, // Cast to any to avoid type conflict
          first_contact_at: "2025-02-20T14:00:00Z",
          call_summary: "Client interested in brand redesign and content strategy.",
          notes: "Established company seeking new visual identity and improved social media engagement.",
          created_at: "2025-02-20T14:00:00Z",
          updated_at: "2025-04-15T11:30:00Z",
          full_address: "456 Market Ave, New York, NY, 10001",
          website: "www.xyzinc.com",
          social_links: { instagram: "instagram.com/xyzinc", twitter: "twitter.com/xyzinc" },
          plan_name: "Standard",
          retainer_value: 1500,
          ad_budget: 5000
        }
      ];
      
      // Always check localStorage for stored clients (converted prospects)
      let allClients = [...mockClients];
      
      try {
        const storedClients = localStorage.getItem('mockClients');
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          if (Array.isArray(parsedClients) && parsedClients.length > 0) {
            console.log(`Found ${parsedClients.length} converted clients in localStorage`);
            allClients = [...allClients, ...parsedClients];
          }
        }
      } catch (e) {
        console.error('Error retrieving clients from localStorage:', e);
      }
      
      return allClients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Add a new client to mock data (used for prospect conversion)
  async addMockClient(client: any): Promise<Client> {
    try {
      console.log(`Adding/updating client: ${client.id} - ${client.contact_name}`);
      
      // Get existing clients from localStorage
      const storedClients = localStorage.getItem('mockClients') || '[]';
      let clients = [];
      
      try {
        clients = JSON.parse(storedClients);
      } catch (e) {
        console.error('Error parsing stored clients:', e);
        clients = [];
      }
      
      // Check if client already exists (by ID)
      const existingIndex = clients.findIndex(c => c.id === client.id);
      
      if (existingIndex >= 0) {
        // Update existing client
        console.log(`Updating existing client ${client.id}`);
        clients[existingIndex] = {
          ...clients[existingIndex],
          ...client,
          updated_at: new Date().toISOString()
        };
      } else {
        // Add new client
        console.log(`Adding new client ${client.id}`);
        clients.push(client);
      }
      
      // Save to localStorage
      localStorage.setItem('mockClients', JSON.stringify(clients));
      console.log(`Successfully saved client ${client.id} to localStorage`);
      
      return client;
    } catch (error) {
      console.error('Error adding mock client:', error);
      throw error;
    }
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

  async getClient(id: string): Promise<Client | null> {
    try {
      // In a real app, this would call Supabase
      // const { data, error } = await supabase
      //   .from('clients')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      
      // if (error) throw error;
      // return data;
      
      // For now, find the client in the mock data
      const clients = await this.getClients();
      return clients.find(client => client.id === id) || null;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  async updateClient(id: string, data: ClientFormData): Promise<Client> {
    try {
      // In a real app, this would call Supabase
      // const { data: updatedClient, error } = await supabase
      //   .from('clients')
      //   .update({ ...data, updated_at: new Date().toISOString() })
      //   .eq('id', id)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      // return updatedClient;
      
      // For now, simulate an update
      const client = await this.getClient(id);
      if (!client) throw new Error(`Client with ID ${id} not found`);
      
      const updatedClient = {
        ...client,
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // In a real app, this would be handled by Supabase
      // For simulation purposes, we'll return the updated client
      return updatedClient;
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  },

  // Credentials CRUD
  async getCredentials(clientId: string): Promise<Credential[]> {
    try {
      // Get credentials from localStorage
      let allCredentials = [...mockCredentials];
      
      try {
        const storedCredentials = localStorage.getItem('mockCredentials');
        if (storedCredentials) {
          const parsedCredentials = JSON.parse(storedCredentials);
          if (Array.isArray(parsedCredentials) && parsedCredentials.length > 0) {
            console.log(`Found ${parsedCredentials.length} credentials in localStorage`);
            allCredentials = [...allCredentials, ...parsedCredentials];
          }
        }
      } catch (e) {
        console.error('Error retrieving credentials from localStorage:', e);
      }
      
      // Filter credentials by client ID
      return allCredentials.filter(cred => cred.client_id === clientId);
    } catch (error) {
      console.error(`Error fetching credentials for client ${clientId}:`, error);
      throw error;
    }
  },

  async createCredential(data: CredentialFormData): Promise<Credential> {
    try {
    const now = new Date().toISOString();
      const newCredential: Credential = {
        id: uuidv4(),
        client_id: data.client_id || '',
        system: data.system || 'other',
        login: data.login || '',
        password: data.password || '',
        notes: data.notes || '',
        visible_to: data.visible_to || 'moderator',
        created_at: now,
        updated_at: now
      };
      
      // Store the credential in localStorage
      const storedCredentials = localStorage.getItem('mockCredentials') || '[]';
      let credentials = [];
      
      try {
        credentials = JSON.parse(storedCredentials);
        if (!Array.isArray(credentials)) {
          credentials = [];
        }
      } catch (e) {
        console.error('Error parsing stored credentials:', e);
        credentials = [];
      }
      
      // Add the new credential
      credentials.push(newCredential);
      
      // Save to localStorage
      localStorage.setItem('mockCredentials', JSON.stringify(credentials));
      console.log(`Credential ${newCredential.id} saved to localStorage`);
      
      return newCredential;
    } catch (error) {
      console.error('Error creating credential:', error);
      throw error;
    }
  },

  async updateCredential(id: string, data: CredentialFormData): Promise<Credential> {
    try {
      const now = new Date().toISOString();
      
      // Get existing credentials from localStorage
      const storedCredentials = localStorage.getItem('mockCredentials') || '[]';
      let credentials = [];
      
      try {
        credentials = JSON.parse(storedCredentials);
        if (!Array.isArray(credentials)) {
          credentials = [];
        }
      } catch (e) {
        console.error('Error parsing stored credentials:', e);
        credentials = [];
      }
      
      // Find the credential to update
      const credentialIndex = credentials.findIndex(c => c.id === id);
      
      // Create the updated credential
      let updatedCredential: Credential;
      
      if (credentialIndex >= 0) {
        updatedCredential = {
          ...credentials[credentialIndex],
          system: data.system,
          login: data.login,
          password: data.password,
          notes: data.notes || '',
          visible_to: data.visible_to || 'moderator',
          updated_at: now
        };
        credentials[credentialIndex] = updatedCredential;
      } else {
        // Try to find in mock data
        const mockCredIndex = mockCredentials.findIndex(c => c.id === id);
        if (mockCredIndex >= 0) {
          updatedCredential = {
            id,
            client_id: data.client_id || mockCredentials[mockCredIndex].client_id,
            system: data.system,
            login: data.login,
            password: data.password,
            notes: data.notes || '',
            visible_to: data.visible_to || 'moderator',
            created_at: mockCredentials[mockCredIndex].created_at,
            updated_at: now
          };
          credentials.push(updatedCredential);
        } else {
          throw new Error(`Credential with ID ${id} not found`);
        }
      }
      
      // Save to localStorage
      localStorage.setItem('mockCredentials', JSON.stringify(credentials));
      console.log(`Credential ${id} updated in localStorage`);
      
      return updatedCredential;
    } catch (error) {
      console.error(`Error updating credential ${id}:`, error);
      throw error;
    }
  },

  async deleteCredential(id: string): Promise<void> {
    try {
      // Get existing credentials from localStorage
      const storedCredentials = localStorage.getItem('mockCredentials') || '[]';
      let credentials = [];
      
      try {
        credentials = JSON.parse(storedCredentials);
        if (!Array.isArray(credentials)) {
          credentials = [];
        }
      } catch (e) {
        console.error('Error parsing stored credentials:', e);
        credentials = [];
      }
      
      // Find the credential to delete
      const credentialIndex = credentials.findIndex(c => c.id === id);
      
      // Remove if found
      if (credentialIndex >= 0) {
        credentials.splice(credentialIndex, 1);
        localStorage.setItem('mockCredentials', JSON.stringify(credentials));
        console.log(`Credential ${id} deleted from localStorage`);
      } else {
        console.log(`Credential ${id} not found in localStorage, nothing to delete`);
      }
    } catch (error) {
      console.error(`Error deleting credential ${id}:`, error);
      throw error;
    }
  },

  // Projects CRUD
  async getProjects(clientId: string): Promise<Project[]> {
    try {
      // Define the hardcoded mock projects
      const mockProjects: Project[] = [
        {
          id: "p1",
          client_id: "1",
          service: "website",
          status: "doing",
          description: "Corporate website redesign",
          deadline: "2025-06-15T00:00:00Z",
          created_at: "2025-04-10T00:00:00Z",
          updated_at: "2025-04-10T00:00:00Z"
        },
        {
          id: "p2",
          client_id: "1",
          service: "paid_ads",
          status: "todo",
          description: "Google Ads Campaign",
          deadline: "2025-06-20T00:00:00Z",
          created_at: "2025-04-10T00:00:00Z",
          updated_at: "2025-04-10T00:00:00Z"
        },
        {
          id: "p3",
          client_id: "2",
          service: "branding",
          status: "done",
          description: "Logo redesign",
          deadline: "2025-05-01T00:00:00Z",
          created_at: "2025-03-01T00:00:00Z",
          updated_at: "2025-04-25T00:00:00Z"
        }
      ];
      
      // Get projects from localStorage
      let allProjects = [...mockProjects];
      
      try {
        const storedProjects = localStorage.getItem('mockProjects');
        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects);
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            console.log(`Found ${parsedProjects.length} projects in localStorage`);
            allProjects = [...allProjects, ...parsedProjects];
          }
        }
      } catch (e) {
        console.error('Error retrieving projects from localStorage:', e);
      }
      
      // Filter projects by client ID
      return allProjects.filter(project => project.client_id === clientId);
    } catch (error) {
      console.error(`Error fetching projects for client ${clientId}:`, error);
      throw error;
    }
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    try {
    const now = new Date().toISOString();
      const newProject: Project = {
        id: uuidv4(),
        client_id: data.client_id || '',
        service: data.service || 'website',
        status: data.status || 'todo',
        description: data.description || '',
        deadline: data.deadline || null,
        created_at: now,
        updated_at: now
      };
      
      // Store the project in localStorage
      const storedProjects = localStorage.getItem('mockProjects') || '[]';
      let projects = [];
      
      try {
        projects = JSON.parse(storedProjects);
        if (!Array.isArray(projects)) {
          projects = [];
        }
      } catch (e) {
        console.error('Error parsing stored projects:', e);
        projects = [];
      }
      
      // Add the new project
      projects.push(newProject);
      
      // Save to localStorage
      localStorage.setItem('mockProjects', JSON.stringify(projects));
      console.log(`Project ${newProject.id} saved to localStorage`);
      
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(id: string, data: ProjectFormData): Promise<Project> {
    try {
      const now = new Date().toISOString();
      
      // Get existing projects from localStorage
      const storedProjects = localStorage.getItem('mockProjects') || '[]';
      let projects = [];
      
      try {
        projects = JSON.parse(storedProjects);
        if (!Array.isArray(projects)) {
          projects = [];
        }
      } catch (e) {
        console.error('Error parsing stored projects:', e);
        projects = [];
      }
      
      // Find the project to update
      const projectIndex = projects.findIndex(p => p.id === id);
      
      // Create the updated project
      const updatedProject: Project = {
        id,
        client_id: data.client_id || '',
        service: data.service || 'website',
        status: data.status || 'todo',
        description: data.description || '',
        deadline: data.deadline || null,
        created_at: projectIndex >= 0 ? projects[projectIndex].created_at : now,
        updated_at: now
      };
      
      // Update existing or add as new
      if (projectIndex >= 0) {
        projects[projectIndex] = updatedProject;
      } else {
        // Also check mock projects
        const mockProjectIndex = mockProjects.findIndex(p => p.id === id);
        if (mockProjectIndex >= 0) {
          projects.push(updatedProject);
        } else {
          throw new Error(`Project with ID ${id} not found`);
        }
      }
      
      // Save to localStorage
      localStorage.setItem('mockProjects', JSON.stringify(projects));
      console.log(`Project ${id} updated in localStorage`);
      
      return updatedProject;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      // Get existing projects from localStorage
      const storedProjects = localStorage.getItem('mockProjects') || '[]';
      let projects = [];
      
      try {
        projects = JSON.parse(storedProjects);
        if (!Array.isArray(projects)) {
          projects = [];
        }
      } catch (e) {
        console.error('Error parsing stored projects:', e);
        projects = [];
      }
      
      // Find the project to delete
      const projectIndex = projects.findIndex(p => p.id === id);
      
      // Remove if found
      if (projectIndex >= 0) {
        projects.splice(projectIndex, 1);
        localStorage.setItem('mockProjects', JSON.stringify(projects));
        console.log(`Project ${id} deleted from localStorage`);
      } else {
        console.log(`Project ${id} not found in localStorage, nothing to delete`);
      }
    } catch (error) {
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
    try {
      // Define the hardcoded mock payments
      const mockPayments: Payment[] = [
        {
          id: "pay1",
          client_id: "1",
          amount: 2500,
          currency: "USD",
          description: "Monthly Fee - May 2025",
          invoice_date: "2025-05-01T00:00:00Z",
          paid: true,
          paid_at: "2025-05-02T00:00:00Z",
          created_at: "2025-04-25T00:00:00Z",
          updated_at: "2025-05-02T00:00:00Z"
        },
        {
          id: "pay2",
          client_id: "1",
          amount: 10000,
          currency: "USD",
          description: "Ad Budget - May 2025",
          invoice_date: "2025-05-01T00:00:00Z",
          paid: false,
          paid_at: null,
          created_at: "2025-04-25T00:00:00Z",
          updated_at: "2025-04-25T00:00:00Z"
        },
        {
          id: "pay3",
          client_id: "2",
          amount: 1500,
          currency: "USD",
          description: "Monthly Fee - May 2025",
          invoice_date: "2025-05-01T00:00:00Z",
          paid: true,
          paid_at: "2025-05-03T00:00:00Z",
          created_at: "2025-04-25T00:00:00Z",
          updated_at: "2025-05-03T00:00:00Z"
        }
      ];
      
      // Get payments from localStorage
      let allPayments = [...mockPayments];
      
      try {
        const storedPayments = localStorage.getItem('mockPayments');
        if (storedPayments) {
          const parsedPayments = JSON.parse(storedPayments);
          if (Array.isArray(parsedPayments) && parsedPayments.length > 0) {
            console.log(`Found ${parsedPayments.length} payments in localStorage`);
            allPayments = [...allPayments, ...parsedPayments];
          }
        }
      } catch (e) {
        console.error('Error retrieving payments from localStorage:', e);
      }
      
      // Filter payments by client ID
      return allPayments.filter(payment => payment.client_id === clientId);
    } catch (error) {
      console.error(`Error fetching payments for client ${clientId}:`, error);
      throw error;
    }
  },

  async createPayment(data: PaymentFormData): Promise<Payment> {
    try {
    const now = new Date().toISOString();
      const newPayment: Payment = {
        id: uuidv4(),
        client_id: data.client_id || '',
        amount: data.amount || 0,
        currency: data.currency || 'USD',
        description: data.description || '',
        invoice_date: data.invoice_date || now,
        paid: data.paid || false,
        paid_at: data.paid ? data.paid_at || now : null,
        created_at: now,
        updated_at: now
      };
      
      // Store the payment in localStorage
      const storedPayments = localStorage.getItem('mockPayments') || '[]';
      let payments = [];
      
      try {
        payments = JSON.parse(storedPayments);
        if (!Array.isArray(payments)) {
          payments = [];
        }
      } catch (e) {
        console.error('Error parsing stored payments:', e);
        payments = [];
      }
      
      // Add the new payment
      payments.push(newPayment);
      
      // Save to localStorage
      localStorage.setItem('mockPayments', JSON.stringify(payments));
      console.log(`Payment ${newPayment.id} saved to localStorage`);
      
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  async updatePayment(id: string, updates: Partial<PaymentFormData>): Promise<Payment> {
    try {
      const now = new Date().toISOString();
      
      // Get existing payments from localStorage
      const storedPayments = localStorage.getItem('mockPayments') || '[]';
      let payments = [];
      
      try {
        payments = JSON.parse(storedPayments);
        if (!Array.isArray(payments)) {
          payments = [];
        }
      } catch (e) {
        console.error('Error parsing stored payments:', e);
        payments = [];
      }
      
      // Find the payment to update
      const paymentIndex = payments.findIndex(p => p.id === id);
      
      // Create the updated payment
      let updatedPayment: Payment;
      
      if (paymentIndex >= 0) {
        updatedPayment = {
          ...payments[paymentIndex],
          ...updates,
          updated_at: now
        };
        payments[paymentIndex] = updatedPayment;
      } else {
        // Try to find in mock data
        const mockPaymentIndex = mockPayments.findIndex(p => p.id === id);
        if (mockPaymentIndex >= 0) {
          updatedPayment = {
            ...mockPayments[mockPaymentIndex],
        ...updates,
            updated_at: now
          };
          payments.push(updatedPayment);
        } else {
          throw new Error(`Payment with ID ${id} not found`);
        }
      }
      
      // Save to localStorage
      localStorage.setItem('mockPayments', JSON.stringify(payments));
      console.log(`Payment ${id} updated in localStorage`);
      
      return updatedPayment;
    } catch (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
  },

  async deletePayment(id: string): Promise<void> {
    try {
      // Get existing payments from localStorage
      const storedPayments = localStorage.getItem('mockPayments') || '[]';
      let payments = [];
      
      try {
        payments = JSON.parse(storedPayments);
        if (!Array.isArray(payments)) {
          payments = [];
        }
      } catch (e) {
        console.error('Error parsing stored payments:', e);
        payments = [];
      }
      
      // Find the payment to delete
      const paymentIndex = payments.findIndex(p => p.id === id);
      
      // Remove if found
      if (paymentIndex >= 0) {
        payments.splice(paymentIndex, 1);
        localStorage.setItem('mockPayments', JSON.stringify(payments));
        console.log(`Payment ${id} deleted from localStorage`);
      } else {
        console.log(`Payment ${id} not found in localStorage, nothing to delete`);
      }
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  },
}; 