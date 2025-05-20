import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Client, Project, Payment, Credential } from "@/lib/supabase";
import { clientService, ClientFormData, ProjectFormData, PaymentFormData, CredentialFormData } from "@/services/clientService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Calendar, CreditCard, MapPin, Phone, Mail, Building2, Star, FileText } from "lucide-react";
import ClientDetailsDialog from "@/components/clients/ClientDetailsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClientCard = ({ 
  client, 
  onViewDetails,
  onScheduleMeeting 
}: { 
  client: Client; 
  onViewDetails: (client: Client) => void;
  onScheduleMeeting: (client: Client) => void;
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-4">
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-center dark:text-white">
              {client.contact_name}
            </CardTitle>
            <CardDescription className="dark:text-slate-300">
              {client.company_name || 'Cliente Individual'}
            </CardDescription>
          </div>
          <div>
            <Badge className="bg-primary">
              {client.business_type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            {client.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            {client.phone}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            {client.region_city}, {client.region_state}
          </div>
          {client.plan_name && (
            <div className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              Plano: {client.plan_name}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(client)}
          >
            Ver Detalhes
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onScheduleMeeting(client)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Reunião
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Clients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isUserRole } = useAuth();
  const { id: clientIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<ClientFormData>({
    contact_name: '',
    company_name: '',
    phone: '',
    email: '',
    full_address: '',
    zip_code: '',
    website: '',
    business_type: '',
    region_city: '',
    region_state: '',
    status: 'active',
    lead_source: '',
    plan_name: '',
    monthly_fee: null,
    ad_budget: null,
    notes: '',
  });
  const [monthlyFeeInput, setMonthlyFeeInput] = useState('');
  const [adBudgetInput, setAdBudgetInput] = useState('');
  
  // Check if user has admin or moderator privileges
  const isAdmin = isUserRole('admin');
  const isModerator = isUserRole('moderator') || isAdmin;
  
  // Query to get clients
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  });
  
  // Handle client ID from URL - find and select that client when clients are loaded
  useEffect(() => {
    if (clientIdFromUrl && clients.length > 0) {
      const clientFromUrl = clients.find(client => client.id === clientIdFromUrl);
      if (clientFromUrl) {
        setSelectedClient(clientFromUrl);
        setDetailsDialogOpen(true);
      } else {
        // Client not found - show a toast and redirect to clients page
        toast({
          title: "Cliente Transferido",
          description: `O cliente foi transferido de Prospectados para cá, ID: ${clientIdFromUrl}`,
          variant: "destructive"
        });
        navigate('/clients');
      }
    }
  }, [clientIdFromUrl, clients, toast, navigate]);

  // Handle dialog close to update URL
  const handleDetailsDialogOpenChange = (open: boolean) => {
    setDetailsDialogOpen(open);
    if (!open && clientIdFromUrl) {
      // Remove the ID from the URL when closing the dialog
      navigate('/clients');
    }
  };
  
  // Query to get projects for the selected client
  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['projects', selectedClient?.id],
    queryFn: () => selectedClient ? clientService.getProjects(selectedClient.id) : Promise.resolve([]),
    enabled: !!selectedClient,
  });
  
  // Query to get payments for the selected client
  const { data: payments = [], refetch: refetchPayments } = useQuery({
    queryKey: ['payments', selectedClient?.id],
    queryFn: () => selectedClient ? clientService.getPayments(selectedClient.id) : Promise.resolve([]),
    enabled: !!selectedClient,
  });
  
  // Query to get credentials for the selected client (only if user is admin or moderator)
  const { data: credentials = [], refetch: refetchCredentials } = useQuery({
    queryKey: ['credentials', selectedClient?.id],
    queryFn: () => selectedClient && (isAdmin || isModerator) 
      ? clientService.getCredentials(selectedClient.id) 
      : Promise.resolve([]),
    enabled: !!selectedClient && (isAdmin || isModerator),
  });
  
  // Mutation to update client details
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientFormData }) => 
      clientService.updateClient(id, data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (selectedClient) {
        queryClient.invalidateQueries({ queryKey: ['clients', selectedClient.id] });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to create a new project
  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectFormData) => clientService.createProject(data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso",
      });
      refetchProjects();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar projeto",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to create a new payment
  const createPaymentMutation = useMutation({
    mutationFn: (data: PaymentFormData) => clientService.createPayment(data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso",
      });
      refetchPayments();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao registrar pagamento",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to create a new credential
  const createCredentialMutation = useMutation({
    mutationFn: (data: CredentialFormData) => clientService.createCredential(data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Credencial adicionada com sucesso",
      });
      refetchCredentials();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao adicionar credencial",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to update a project
  const updateProjectMutation = useMutation({
    mutationFn: (data: { id: string; project: ProjectFormData }) => 
      clientService.updateProject(data.id, data.project),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso",
      });
      refetchProjects();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar projeto",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to delete a project
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => clientService.deleteProject(id),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso",
      });
      refetchProjects();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao excluir projeto",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to update a payment
  const updatePaymentMutation = useMutation({
    mutationFn: (data: { id: string; payment: Partial<PaymentFormData> }) => 
      clientService.updatePayment(data.id, data.payment),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Pagamento atualizado com sucesso",
      });
      refetchPayments();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar pagamento",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to delete a payment
  const deletePaymentMutation = useMutation({
    mutationFn: (id: string) => clientService.deletePayment(id),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Pagamento excluído com sucesso",
      });
      refetchPayments();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao excluir pagamento",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to update a credential
  const updateCredentialMutation = useMutation({
    mutationFn: (data: { id: string; credential: CredentialFormData }) => 
      clientService.updateCredential(data.id, data.credential),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Credencial atualizada com sucesso",
      });
      refetchCredentials();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar credencial",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to delete a credential
  const deleteCredentialMutation = useMutation({
    mutationFn: (id: string) => clientService.deleteCredential(id),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Credencial excluída com sucesso",
      });
      refetchCredentials();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao excluir credencial",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation to create a new client
  const createClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => {
      const newClientData = {
        ...data,
        id: uuidv4(),
        account_manager_id: user?.id || 'unknown',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return clientService.addMockClient(newClientData);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setAddClientDialogOpen(false);
      resetNewClientForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar cliente",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Reset new client form
  const resetNewClientForm = () => {
    setNewClient({
      contact_name: '',
      company_name: '',
      phone: '',
      email: '',
      full_address: '',
      zip_code: '',
      website: '',
      business_type: '',
      region_city: '',
      region_state: '',
      status: 'active',
      lead_source: '',
      plan_name: '',
      monthly_fee: null,
      ad_budget: null,
      notes: '',
    });
  };

  // Handle creating a new client
  const handleCreateClient = async () => {
    try {
      // Validate required fields
      if (!newClient.contact_name || !newClient.phone) {
        toast({
          title: "Erro de Validação",
          description: "Nome do contato e telefone são obrigatórios",
          variant: "destructive",
        });
        return;
      }
      
      await createClientMutation.mutateAsync(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  // Function to handle client updates
  const handleUpdateClient = async (data: ClientFormData) => {
    if (!selectedClient) return;
    
    try {
      await updateClientMutation.mutateAsync({
        id: selectedClient.id,
        data,
      });
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };
  
  // Function to handle new project creation
  const handleAddProject = async (data: ProjectFormData) => {
    if (!selectedClient) return;
    
    try {
      await createProjectMutation.mutateAsync({
        ...data,
        client_id: selectedClient.id,
      });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  
  // Function to handle new payment creation
  const handleAddPayment = async (data: PaymentFormData) => {
    if (!selectedClient) return;
    
    try {
      await createPaymentMutation.mutateAsync({
        ...data,
        client_id: selectedClient.id,
      });
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };
  
  // Function to handle new credential creation
  const handleAddCredential = async (data: CredentialFormData) => {
    if (!selectedClient || !(isAdmin || isModerator)) return;
    
    try {
      await createCredentialMutation.mutateAsync({
        ...data,
        client_id: selectedClient.id,
      });
    } catch (error) {
      console.error("Error creating credential:", error);
    }
  };
  
  // Function to handle client selection for detailed view
  const handleViewClientDetails = (client: Client) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
    // Update URL with client ID for direct linking
    navigate(`/clients/${client.id}`);
  };
  
  // Function to handle meeting scheduling
  const handleScheduleMeeting = (client: Client) => {
    const url = `https://cal.com/andre-uu15wu/reuniao-restrita` +
      `?name=${encodeURIComponent(client.contact_name)}` +
      `&email=${encodeURIComponent(client.email)}` +
      `&clientid=${client.id}`;
    window.open(url, '_blank');
  };
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.contact_name.toLowerCase().includes(searchLower) ||
      (client.company_name && client.company_name.toLowerCase().includes(searchLower)) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.business_type.toLowerCase().includes(searchLower) ||
      client.region_city.toLowerCase().includes(searchLower) ||
      client.region_state.toLowerCase().includes(searchLower)
    );
  });
  
  // Update project handler
  const handleUpdateProject = async (id: string, data: ProjectFormData) => {
    try {
      await updateProjectMutation.mutateAsync({ id, project: data });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  
  // Delete project handler
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  
  // Update payment handler
  const handleUpdatePayment = async (id: string, data: Partial<PaymentFormData>) => {
    try {
      await updatePaymentMutation.mutateAsync({ id, payment: data });
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };
  
  // Delete payment handler
  const handleDeletePayment = async (id: string) => {
    try {
      await deletePaymentMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };
  
  // Update credential handler
  const handleUpdateCredential = async (id: string, data: CredentialFormData) => {
    try {
      await updateCredentialMutation.mutateAsync({ id, credential: data });
    } catch (error) {
      console.error("Error updating credential:", error);
    }
  };
  
  // Delete credential handler
  const handleDeleteCredential = async (id: string) => {
    try {
      await deleteCredentialMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  };
  
  // Handler for opening add client dialog
  const handleOpenAddClientDialog = () => {
    setAddClientDialogOpen(true);
  };
  
  // Sincronizar os valores iniciais ao abrir o dialog
  useEffect(() => {
    setMonthlyFeeInput(
      newClient.monthly_fee !== null && newClient.monthly_fee !== undefined
        ? newClient.monthly_fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : ''
    );
    setAdBudgetInput(
      newClient.ad_budget !== null && newClient.ad_budget !== undefined
        ? newClient.ad_budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : ''
    );
  }, [addClientDialogOpen]);
  
  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <div className="flex gap-2 items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <Input
                placeholder="Buscar clientes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
            <Button onClick={handleOpenAddClientDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
              </Button>
            </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Todos os Clientes</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoadingClients ? (
              <div className="text-center py-8">Carregando clientes...</div>
            ) : clientsError ? (
              <div className="text-center py-8 text-red-500">Erro ao carregar clientes. Por favor, tente novamente.</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">Nenhum cliente encontrado.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    onViewDetails={handleViewClientDetails} 
                    onScheduleMeeting={handleScheduleMeeting}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients
                .filter(client => client.plan_name && client.status === 'active')
                .map(client => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    onViewDetails={handleViewClientDetails}
                    onScheduleMeeting={handleScheduleMeeting}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients
                .filter(client => client.status === 'inactive' || client.status === 'delinquent')
                .map(client => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onViewDetails={handleViewClientDetails}
                  onScheduleMeeting={handleScheduleMeeting}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Client Details Dialog */}
        <ClientDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={handleDetailsDialogOpenChange}
          client={selectedClient}
          setClient={setSelectedClient}
          projects={projects}
          payments={payments}
          credentials={credentials}
          onUpdateClient={handleUpdateClient}
          onAddProject={handleAddProject}
          onAddPayment={handleAddPayment}
          onAddCredential={handleAddCredential}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onUpdatePayment={handleUpdatePayment}
          onDeletePayment={handleDeletePayment}
          onUpdateCredential={handleUpdateCredential}
          onDeleteCredential={handleDeleteCredential}
        />

        {/* Add Client Dialog */}
        <Dialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-background z-20 border-b">
              <DialogTitle className="text-xl font-semibold">Add New Client</DialogTitle>
              <DialogDescription>
                Crie um novo cliente preenchendo os detalhes abaixo. Campos obrigatórios estão marcados com um asterisco (*).
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <div className="space-y-6">
                {/* Client Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Informações do Cliente</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="contact_name" className="after:content-['*'] after:ml-0.5 after:text-red-500">Nome do Contato</Label>
                    <Input
                      id="contact_name"
                      value={newClient.contact_name}
                      onChange={(e) => setNewClient({ ...newClient, contact_name: e.target.value })}
                      placeholder="Nome Completo"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Empresa</Label>
                      <Input
                        id="company_name"
                        value={newClient.company_name || ''}
                        onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                        placeholder="Nome da Empresa"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_type">Tipo de Negócio</Label>
                      <Input
                        id="business_type"
                        value={newClient.business_type || ''}
                        onChange={(e) => setNewClient({ ...newClient, business_type: e.target.value })}
                        placeholder="ex: Restaurante, Varejo"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contact Information Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Informações de Contato</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="after:content-['*'] after:ml-0.5 after:text-red-500">Telefone</Label>
                      <Input
                        id="phone"
                        value={(function formatPhone(value) {
                          const numbers = (value || '').replace(/\D/g, '').slice(0, 11);
                          if (numbers.length <= 2) return numbers;
                          if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
                          return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
                        })(newClient.phone)}
                        onChange={e => {
                          const onlyNumbers = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setNewClient({ ...newClient, phone: onlyNumbers });
                        }}
                        maxLength={16}
                        placeholder="(11) 91234-5678"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email || ''}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="Endereço de E-mail"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="website">Site</Label>
                    <Input
                      id="website"
                      value={newClient.website || ''}
                      onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                      placeholder="https://exemplo.com"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                </div>
                
                {/* Location Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Localização</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region_city">Cidade</Label>
                      <Input
                        id="region_city"
                        value={newClient.region_city || ''}
                        onChange={(e) => setNewClient({ ...newClient, region_city: e.target.value })}
                        placeholder="Cidade"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region_state">Estado</Label>
                      <Select 
                        value={newClient.region_state || ''} 
                        onValueChange={(value) => setNewClient({ ...newClient, region_state: value })}
                      >
                        <SelectTrigger id="region_state" className="focus-visible:ring-primary">
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">Acre</SelectItem>
                          <SelectItem value="AL">Alagoas</SelectItem>
                          <SelectItem value="AP">Amapá</SelectItem>
                          <SelectItem value="AM">Amazonas</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="CE">Ceará</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="GO">Goiás</SelectItem>
                          <SelectItem value="MA">Maranhão</SelectItem>
                          <SelectItem value="MT">Mato Grosso</SelectItem>
                          <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="PA">Pará</SelectItem>
                          <SelectItem value="PB">Paraíba</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="PI">Piauí</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="RO">Rondônia</SelectItem>
                          <SelectItem value="RR">Roraima</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="SE">Sergipe</SelectItem>
                          <SelectItem value="TO">Tocantins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_address">Endereço</Label>
                      <Input
                        id="full_address"
                        value={newClient.full_address || ''}
                        onChange={(e) => setNewClient({ ...newClient, full_address: e.target.value })}
                        placeholder="Endereço Completo"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">CEP</Label>
                      <Input
                        id="zip_code"
                        value={newClient.zip_code || ''}
                        onChange={(e) => setNewClient({ ...newClient, zip_code: e.target.value })}
                        placeholder="CEP"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Billing Information Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Informações de Cobrança</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan_name">Plano</Label>
                      <Input
                        id="plan_name"
                        value={newClient.plan_name || ''}
                        onChange={(e) => setNewClient({ ...newClient, plan_name: e.target.value })}
                        placeholder="Plano de Serviço"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newClient.status || 'active'}
                        onChange={(e) => setNewClient({ ...newClient, status: e.target.value as 'active' | 'inactive' | 'delinquent' })}
                      >
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                        <option value="delinquent">Inadimplente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly_fee">Mensalidade (R$)</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"></span>
                        <Input
                          id="monthly_fee"
                          type="text"
                          inputMode="decimal"
                          value={monthlyFeeInput}
                          onChange={e => {
                            let value = e.target.value.replace(/[^\d,\.]/g, '');
                            // Limita a 2 casas decimais
                            if (value.includes(',')) {
                              const [int, dec] = value.split(',');
                              value = int + ',' + (dec ? dec.slice(0,2) : '');
                            }
                            // Limita o valor máximo
                            let numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            if (isNaN(numeric)) numeric = null;
                            if (numeric !== null && numeric > 500000) numeric = 500000;
                            setMonthlyFeeInput(value);
                            setNewClient({
                              ...newClient,
                              monthly_fee: numeric
                            });
                          }}
                          onBlur={e => {
                            let value = e.target.value;
                            let numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            if (!isNaN(numeric) && numeric !== null) {
                              setMonthlyFeeInput(numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                            } else {
                              setMonthlyFeeInput('');
                            }
                          }}
                          onFocus={e => {
                            if (newClient.monthly_fee !== null && newClient.monthly_fee !== undefined) {
                              setMonthlyFeeInput(newClient.monthly_fee.toString().replace('.', ','));
                            } else {
                              setMonthlyFeeInput('');
                            }
                          }}
                          maxLength={12}
                          className="pl-7 focus-visible:ring-primary"
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ad_budget">Orçamento de Anúncios (R$)</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"></span>
                        <Input
                          id="ad_budget"
                          type="text"
                          inputMode="decimal"
                          value={adBudgetInput}
                          onChange={e => {
                            let value = e.target.value.replace(/[^\d,\.]/g, '');
                            if (value.includes(',')) {
                              const [int, dec] = value.split(',');
                              value = int + ',' + (dec ? dec.slice(0,2) : '');
                            }
                            let numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            if (isNaN(numeric)) numeric = null;
                            if (numeric !== null && numeric > 500000) numeric = 500000;
                            setAdBudgetInput(value);
                            setNewClient({
                              ...newClient,
                              ad_budget: numeric
                            });
                          }}
                          onBlur={e => {
                            let value = e.target.value;
                            let numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            if (!isNaN(numeric) && numeric !== null) {
                              setAdBudgetInput(numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                            } else {
                              setAdBudgetInput('');
                            }
                          }}
                          onFocus={e => {
                            if (newClient.ad_budget !== null && newClient.ad_budget !== undefined) {
                              setAdBudgetInput(newClient.ad_budget.toString().replace('.', ','));
                            } else {
                              setAdBudgetInput('');
                            }
                          }}
                          maxLength={12}
                          className="pl-7 focus-visible:ring-primary"
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Informações Adicionais</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={newClient.notes || ''}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      placeholder="Observações do cliente ou informações adicionais"
                      rows={4}
                      className="resize-none focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="px-6 py-4 border-t">
              <div className="flex gap-2 w-full justify-end">
                <Button variant="outline" onClick={() => setAddClientDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleCreateClient} 
                  disabled={createClientMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {createClientMutation.isPending ? (
                    <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>Salvando...</>
                  ) : (
                    <>Salvar Cliente</>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Clients;
