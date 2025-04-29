import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { clientService, Client } from "@/services/clientService";
import ScheduleMeetingDialog from "@/components/calendar/ScheduleMeetingDialog";

const ClientCard = ({ client }: { client: Client }) => {
  const navigate = useNavigate();
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  const handleViewDetails = (id: string) => {
    navigate(`/clients/${id}`);
  };

  return (
    <>
      <Card className="mb-4 shadow-neumorph-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg font-bold">{client.contact_name}</CardTitle>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {client.plan_name || "Standard"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{client.company_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business Type</p>
              <p className="font-medium">{client.business_type || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Fee</p>
              <p className="font-medium">${client.monthly_fee || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ad Budget</p>
              <p className="font-medium">${client.ad_budget || 0}</p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => handleViewDetails(client.id)}
            >
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setScheduleMeetingOpen(true)}
            >
              Schedule Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ScheduleMeetingDialog
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
        clientId={client.id}
        attendeeName={client.contact_name}
        attendeeEmail={client.email}
        attendeeTimezone={client.timezone}
      />
    </>
  );
};

const ClientDetailTabs = ({ client }: { client: Client }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  
  // Query para buscar credenciais
  const {
    data: credentials = [],
    isLoading: isLoadingCredentials
  } = useQuery({
    queryKey: ['credentials', client.id],
    queryFn: () => clientService.getCredentials(client.id),
    enabled: activeTab === "credentials"
  });

  // Query para buscar projetos
  const {
    data: projects = [],
    isLoading: isLoadingProjects
  } = useQuery({
    queryKey: ['projects', client.id],
    queryFn: () => clientService.getProjects(client.id),
    enabled: activeTab === "projects"
  });

  // Query para buscar pagamentos
  const {
    data: payments = [],
    isLoading: isLoadingPayments
  } = useQuery({
    queryKey: ['payments', client.id],
    queryFn: () => clientService.getPayments(client.id),
    enabled: activeTab === "finance"
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-yellow-100 text-yellow-800";
      case "doing": return "bg-blue-100 text-blue-800";
      case "done": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <>
      <Tabs 
        defaultValue="overview" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{client.contact_name}</p>
                <p className="font-medium text-gray-700">{client.company_name || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">{client.email || 'N/A'}</p>
                <p className="text-sm text-gray-500">{client.phone || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">{client.full_address || 'N/A'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Account Manager:</span>
                  <span className="font-medium">ID: {client.owner_id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Plan:</span>
                  <span className="font-medium">{client.plan_name || 'Standard'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Monthly Fee:</span>
                  <span className="font-medium">{formatCurrency(client.monthly_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ad Budget:</span>
                  <span className="font-medium">{formatCurrency(client.ad_budget)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setScheduleMeetingOpen(true)}
                >
                  Schedule Meeting
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  Create Invoice
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  Add Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="credentials" className="p-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Credentials</CardTitle>
                <Button size="sm" variant="secondary">+ Add Credential</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCredentials ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : credentials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No credentials found. Add your first credential.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">System</th>
                        <th className="text-left py-2 px-4">Login</th>
                        <th className="text-left py-2 px-4">Password</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {credentials.map((cred) => (
                        <tr key={cred.id} className="border-b">
                          <td className="py-2 px-4">{cred.system}</td>
                          <td className="py-2 px-4">{cred.login}</td>
                          <td className="py-2 px-4">
                            <Button size="sm" variant="ghost">
                              👁️ Show
                            </Button>
                          </td>
                          <td className="py-2 px-4">
                            <Button size="sm" variant="ghost">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="p-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Projects</CardTitle>
                <Button size="sm" variant="secondary">+ Add Project</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No projects found. Add your first project.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md">{project.service}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{project.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Deadline: {formatDate(project.deadline)}</span>
                          <Button size="sm" variant="outline">Tasks</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="p-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payments</CardTitle>
                <Button size="sm" variant="secondary">Create Invoice</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingPayments ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No payments found. Create your first invoice.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Description</th>
                        <th className="text-left py-2 px-4">Amount</th>
                        <th className="text-left py-2 px-4">Date</th>
                        <th className="text-left py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="py-2 px-4">{payment.description}</td>
                          <td className="py-2 px-4">{formatCurrency(payment.amount)}</td>
                          <td className="py-2 px-4">{formatDate(payment.invoice_date)}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${payment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {payment.paid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files" className="p-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Files & Documents</CardTitle>
                <Button size="sm" variant="secondary">Upload File</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No files uploaded yet.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ScheduleMeetingDialog
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
        clientId={client.id}
        attendeeName={client.contact_name}
        attendeeEmail={client.email}
        attendeeTimezone={client.timezone}
      />
    </>
  );
};

// Component for client details page
const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    data: client,
    isLoading,
    error
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id || ''),
    enabled: !!id
  });
  
  const handleBackToList = () => {
    navigate('/clients');
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={handleBackToList}
            >
              ← Back
            </Button>
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (error || !client) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={handleBackToList}
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Error</h1>
          </div>
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Failed to load client details. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/clients')}
            >
              Return to clients list
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={handleBackToList}
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.contact_name}
            </h1>
          </div>
          <Button variant="default" className="bg-secondary hover:bg-secondary/90">
            Edit Client
          </Button>
        </div>
        <ClientDetailTabs client={client} />
      </div>
    </AppLayout>
  );
};

// Main component that acts as a router between list and details view
const Clients = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // If we have an ID, show the client details page
  if (id) {
    return <ClientDetails />;
  }
  
  // Query to get all clients
  const {
    data: clients = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients
  });
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-500">Manage your active client accounts.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Filter</Button>
            <Button 
              variant="default" 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => navigate('/prospects')}
            >
              + Add Client
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Error loading clients. Please try again.
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No clients found.</p>
            <Button 
              variant="default"
              onClick={() => navigate('/prospects')}
            >
              Add your first client by converting a prospect
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {clients.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
