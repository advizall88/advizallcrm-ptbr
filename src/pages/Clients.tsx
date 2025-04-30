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
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar } from "lucide-react";
import { Client, Project, Payment, Credential } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import ClientDetailsDialog from "@/components/clients/ClientDetailsDialog";
import { clientService, ClientFormData, ProjectFormData, PaymentFormData, CredentialFormData } from "@/services/clientService";
import { useAuth } from "@/contexts/AuthContext";
import MeetingScheduleDialog from "@/components/meetings/MeetingScheduleDialog";

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
    <Card className="mb-4 shadow-neumorph-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-bold">{client.company_name || client.contact_name}</CardTitle>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {client.plan_name || "No plan"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Business Type</p>
            <p className="font-medium">{client.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{client.region_city}, {client.region_state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Fee</p>
            <p className="font-medium">
              {client.retainer_value 
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(client.retainer_value)
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ad Budget</p>
            <p className="font-medium">
              {client.ad_budget 
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(client.ad_budget)
                : "-"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
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
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  
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
    setSelectedClient(client);
    setMeetingDialogOpen(true);
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
            <Button>
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
                .filter(client => client.plan_name && client.retainer_value)
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
                .filter(client => !client.plan_name || !client.retainer_value)
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
          projects={projects}
          payments={payments}
          credentials={credentials}
          isAdmin={isAdmin}
          isModerator={isModerator}
          onUpdateClient={handleUpdateClient}
          onAddProject={handleAddProject}
          onAddPayment={handleAddPayment}
          onAddCredential={handleAddCredential}
        />
        
        {/* Meeting Schedule Dialog */}
        {selectedClient && (
          <MeetingScheduleDialog
            open={meetingDialogOpen}
            onOpenChange={setMeetingDialogOpen}
            client={selectedClient}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
