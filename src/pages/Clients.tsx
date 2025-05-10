import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, CreditCard, MapPin, Phone, Mail, Building2, Star, FileText } from "lucide-react";
import { Client, Project, Payment, Credential } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import ClientDetailsDialog from "@/components/clients/ClientDetailsDialog";
import { clientService, ClientFormData, ProjectFormData, PaymentFormData, CredentialFormData } from "@/services/clientService";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
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
              {client.company_name || 'Individual Client'}
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
              Plan: {client.plan_name}
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
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onScheduleMeeting(client)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
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
          title: "Client Not Found",
          description: `No client found with ID: ${clientIdFromUrl}`,
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
        title: "Success",
        description: "Client updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (selectedClient) {
        queryClient.invalidateQueries({ queryKey: ['clients', selectedClient.id] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update client",
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
        title: "Success",
        description: "Project created successfully",
      });
      refetchProjects();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project",
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
        title: "Success",
        description: "Payment recorded successfully",
      });
      refetchPayments();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record payment",
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
        title: "Success",
        description: "Credential added successfully",
      });
      refetchCredentials();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add credential",
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
        title: "Success",
        description: "Project updated successfully",
      });
      refetchProjects();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project",
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
        title: "Success",
        description: "Project deleted successfully",
      });
      refetchProjects();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project",
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
        title: "Success",
        description: "Payment updated successfully",
      });
      refetchPayments();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payment",
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
        title: "Success",
        description: "Payment deleted successfully",
      });
      refetchPayments();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete payment",
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
        title: "Success",
        description: "Credential updated successfully",
      });
      refetchCredentials();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update credential",
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
        title: "Success",
        description: "Credential deleted successfully",
      });
      refetchCredentials();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete credential",
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
        title: "Success",
        description: "Client created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setAddClientDialogOpen(false);
      resetNewClientForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create client",
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
          title: "Validation Error",
          description: "Contact name and phone are required",
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
  
  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <div className="flex gap-2 items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <Input
                placeholder="Search clients..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
            <Button onClick={handleOpenAddClientDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
              </Button>
            </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoadingClients ? (
              <div className="text-center py-8">Loading clients...</div>
            ) : clientsError ? (
              <div className="text-center py-8 text-red-500">Error loading clients. Please try again.</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">No clients found.</div>
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
                Create a new client by filling out the details below. Required fields are marked with an asterisk (*).
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <div className="space-y-6">
                {/* Client Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Client Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="contact_name" className="after:content-['*'] after:ml-0.5 after:text-red-500">Contact Name</Label>
                    <Input
                      id="contact_name"
                      value={newClient.contact_name}
                      onChange={(e) => setNewClient({ ...newClient, contact_name: e.target.value })}
                      placeholder="Full Name"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company</Label>
                      <Input
                        id="company_name"
                        value={newClient.company_name || ''}
                        onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                        placeholder="Company Name"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_type">Business Type</Label>
                      <Input
                        id="business_type"
                        value={newClient.business_type || ''}
                        onChange={(e) => setNewClient({ ...newClient, business_type: e.target.value })}
                        placeholder="e.g. Restaurant, Retail"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contact Information Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="after:content-['*'] after:ml-0.5 after:text-red-500">Phone</Label>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        placeholder="Phone Number"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email || ''}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="Email Address"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={newClient.website || ''}
                      onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                      placeholder="https://example.com"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                </div>
                
                {/* Location Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Location</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region_city">City</Label>
                      <Input
                        id="region_city"
                        value={newClient.region_city || ''}
                        onChange={(e) => setNewClient({ ...newClient, region_city: e.target.value })}
                        placeholder="City"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region_state">State</Label>
                      <Input
                        id="region_state"
                        value={newClient.region_state || ''}
                        onChange={(e) => setNewClient({ ...newClient, region_state: e.target.value })}
                        placeholder="State"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_address">Address</Label>
                      <Input
                        id="full_address"
                        value={newClient.full_address || ''}
                        onChange={(e) => setNewClient({ ...newClient, full_address: e.target.value })}
                        placeholder="Street Address"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input
                        id="zip_code"
                        value={newClient.zip_code || ''}
                        onChange={(e) => setNewClient({ ...newClient, zip_code: e.target.value })}
                        placeholder="Zip Code"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Billing Information Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Billing Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan_name">Plan</Label>
                      <Input
                        id="plan_name"
                        value={newClient.plan_name || ''}
                        onChange={(e) => setNewClient({ ...newClient, plan_name: e.target.value })}
                        placeholder="Service Plan"
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="delinquent">Delinquent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly_fee">Monthly Fee ($)</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="monthly_fee"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newClient.monthly_fee !== undefined && newClient.monthly_fee !== null ? newClient.monthly_fee : ''}
                          onChange={(e) => setNewClient({ 
                            ...newClient, 
                            monthly_fee: e.target.value ? parseFloat(e.target.value) : null 
                          })}
                          className="pl-7 focus-visible:ring-primary"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ad_budget">Ad Budget ($)</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="ad_budget"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newClient.ad_budget !== undefined && newClient.ad_budget !== null ? newClient.ad_budget : ''}
                          onChange={(e) => setNewClient({
                            ...newClient,
                            ad_budget: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="pl-7 focus-visible:ring-primary"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes Section */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Additional Information</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newClient.notes || ''}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      placeholder="Client notes or additional information"
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
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleCreateClient} 
                  disabled={createClientMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {createClientMutation.isPending ? (
                    <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>Saving...</>
                  ) : (
                    <>Save Client</>
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
