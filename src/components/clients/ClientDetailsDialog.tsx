import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  BadgeIcon, 
  InfoIcon, 
  StarIcon, 
  ClockIcon, 
  TagIcon,
  Globe,
  DollarSign,
  CreditCard,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Client, Project, Payment, Credential } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import ProjectForm from './ProjectForm';
import PaymentForm from './PaymentForm';
import CredentialForm from './CredentialForm';
import { ClientFormData, ProjectFormData, PaymentFormData, CredentialFormData } from '@/services/clientService';
import { useQueryClient } from '@tanstack/react-query';

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  projects?: Project[];
  payments?: Payment[];
  credentials?: Credential[];
  isAdmin?: boolean;
  isModerator?: boolean;
  onUpdateClient?: (client: Partial<Client>) => void;
  onAddProject?: (project: Partial<Project>) => void;
  onAddPayment?: (payment: Partial<Payment>) => void;
  onAddCredential?: (credential: Partial<Credential>) => void;
}

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({
  open,
  onOpenChange,
  client,
  projects = [],
  payments = [],
  credentials = [],
  isAdmin = false,
  isModerator = false,
  onUpdateClient,
  onAddProject,
  onAddPayment,
  onAddCredential
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("overview");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [callSummaryValue, setCallSummaryValue] = useState('');
  
  // Form dialog states
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [credentialFormOpen, setCredentialFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  // Initialize form values when client changes
  useEffect(() => {
    if (client) {
      setNotesValue(client.notes || '');
      setCallSummaryValue(client.call_summary || '');
    }
  }, [client]);

  if (!client) return null;

  const togglePasswordVisibility = (credentialId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-yellow-100 text-yellow-800";
      case "doing": return "bg-blue-100 text-blue-800";
      case "done": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadge = (paid: boolean) => {
    return paid 
      ? <Badge variant="default" className="bg-green-500">Paid</Badge>
      : <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">Pending</Badge>;
  };

  const handleCreateProject = () => {
    if (!onAddProject) {
      toast({
        title: "Feature in development",
        description: "Creating projects will be implemented soon."
      });
      return;
    }
    
    setSelectedProject(null);
    setProjectFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setProjectFormOpen(true);
  };

  const handleProjectSubmit = async (data: ProjectFormData) => {
    if (!client || !onAddProject) return;
    
    try {
      await onAddProject({
        ...data,
        client_id: client.id
      });
      setProjectFormOpen(false);
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  const handleCreatePayment = () => {
    if (!onAddPayment) {
      toast({
        title: "Feature in development",
        description: "Creating payments will be implemented soon."
      });
      return;
    }
    
    setSelectedPayment(null);
    setPaymentFormOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentFormOpen(true);
  };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    if (!client || !onAddPayment) return;
    
    try {
      await onAddPayment({
        ...data,
        client_id: client.id
      });
      setPaymentFormOpen(false);
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  const handleAddCredential = () => {
    if (!onAddCredential || !(isAdmin || isModerator)) {
      toast({
        title: "Feature in development",
        description: "Adding credentials will be implemented soon."
      });
      return;
    }
    
    setSelectedCredential(null);
    setCredentialFormOpen(true);
  };

  const handleEditCredential = (credential: Credential) => {
    setSelectedCredential(credential);
    setCredentialFormOpen(true);
  };

  const handleCredentialSubmit = async (data: CredentialFormData) => {
    if (!client || !onAddCredential || !(isAdmin || isModerator)) return;
    
    try {
      await onAddCredential({
        ...data,
        client_id: client.id
      });
      setCredentialFormOpen(false);
    } catch (error) {
      console.error("Error submitting credential:", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!client || !onUpdateClient) return;
    
    try {
      await onUpdateClient({
        id: client.id,
        notes: notesValue
      });
      setEditingNotes(false);
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleSaveCallSummary = async () => {
    if (!client || !onUpdateClient) return;
    
    try {
      await onUpdateClient({
        id: client.id,
        call_summary: callSummaryValue
      });
      toast({
        title: "Success",
        description: "Call summary updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update call summary",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleTogglePaymentStatus = async (paymentId: string, currentStatus: boolean) => {
    toast({
      title: currentStatus ? "Payment Marked as Unpaid" : "Payment Marked as Paid",
      description: "Payment status updated successfully.",
    });
  };

  const handleDeleteCredential = (credentialId: string) => {
    toast({
      title: "Credential Deleted",
      description: "The credential has been removed successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <BadgeIcon className="h-5 w-5 text-primary" />
            {client.company_name || client.contact_name}
          </DialogTitle>
          <DialogDescription>
            Complete client details
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <BadgeIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contact Name</p>
                        <p>{client.contact_name}</p>
                      </div>
                    </div>
                    
                    {client.company_name && (
                      <div className="flex items-start gap-2">
                        <InfoIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Company</p>
                          <p>{client.company_name}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <PhoneIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Phone</p>
                        <p>{client.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MailIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Email</p>
                        <p>{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Address</p>
                        <p>{client.full_address}</p>
                      </div>
                    </div>

                    {client.website && (
                      <div className="flex items-start gap-2">
                        <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Website</p>
                          <a 
                            href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {client.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Plan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <TagIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Business Type</p>
                        <p>{client.business_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <StarIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Score</p>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-4 w-4 ${i < client.score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {client.plan_name && (
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Plan</p>
                          <p>{client.plan_name}</p>
                        </div>
                      </div>
                    )}
                    
                    {client.retainer_value !== undefined && client.retainer_value !== null && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Monthly Value</p>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD' 
                            }).format(client.retainer_value)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {client.ad_budget !== undefined && client.ad_budget !== null && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Ad Budget</p>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD' 
                            }).format(client.ad_budget)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <ClockIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Client since</p>
                        <p>
                          {format(new Date(client.created_at), "MMMM d, yyyy", { locale: enUS })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Projects and Payments Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Active Projects</h3>
                      {projects.length > 0 ? (
                        <div className="space-y-2">
                          {projects.slice(0, 3).map(project => (
                            <div key={project.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-medium">{project.service}</p>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                {project.status === 'todo' ? 'To Do' : 
                                 project.status === 'doing' ? 'In Progress' : 'Completed'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No active projects.</p>
                      )}
                      
                      {projects.length > 3 && (
                        <Button 
                          variant="link" 
                          className="mt-2 p-0 h-auto" 
                          onClick={() => setActiveTab("projects")}
                        >
                          View all projects
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recent Payments</h3>
                      {payments.length > 0 ? (
                        <div className="space-y-2">
                          {payments.slice(0, 3).map(payment => (
                            <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-medium">{payment.description}</p>
                                <p className="text-sm">
                                  {new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: payment.currency || 'USD' 
                                  }).format(payment.amount)}
                                </p>
                              </div>
                              {getPaymentStatusBadge(payment.paid)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No payments recorded.</p>
                      )}
                      
                      {payments.length > 3 && (
                        <Button 
                          variant="link" 
                          className="mt-2 p-0 h-auto" 
                          onClick={() => setActiveTab("finance")}
                        >
                          View all payments
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Projects</h3>
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map(project => (
                    <Card key={project.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md">{project.service}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                            {project.status === 'todo' ? 'To Do' : 
                             project.status === 'doing' ? 'In Progress' : 'Completed'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{project.description}</p>
                        {project.deadline && (
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <ClockIcon className="h-3.5 w-3.5 mr-1" />
                            <span>Deadline: {format(new Date(project.deadline), "MM/dd/yyyy")}</span>
                          </div>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">View Tasks</Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditProject(project)}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No projects registered for this client.</p>
                    <Button onClick={handleCreateProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="finance" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Financial Information</h3>
                <Button onClick={handleCreatePayment}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Payment
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Plan and Values</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.plan_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Plan</span>
                      <span className="font-medium">{client.plan_name}</span>
                    </div>
                  )}
                  
                  {client.retainer_value !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Fee</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(client.retainer_value || 0)}
                      </span>
                    </div>
                  )}
                  
                  {client.ad_budget !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ad Budget</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(client.ad_budget || 0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Monthly Total</span>
                    <span className="font-bold">
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      }).format((client.retainer_value || 0) + (client.ad_budget || 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Date</th>
                            <th className="text-left py-2 px-4">Description</th>
                            <th className="text-right py-2 px-4">Amount</th>
                            <th className="text-center py-2 px-4">Status</th>
                            <th className="text-center py-2 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map(payment => (
                            <tr key={payment.id} className="border-b">
                              <td className="py-2 px-4">
                                {format(new Date(payment.invoice_date), "MM/dd/yyyy")}
                              </td>
                              <td className="py-2 px-4">{payment.description}</td>
                              <td className="py-2 px-4 text-right">
                                {new Intl.NumberFormat('en-US', { 
                                  style: 'currency', 
                                  currency: payment.currency 
                                }).format(payment.amount)}
                              </td>
                              <td className="py-2 px-4 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="p-0 h-auto"
                                  onClick={() => handleTogglePaymentStatus(payment.id, payment.paid)}
                                >
                                  {getPaymentStatusBadge(payment.paid)}
                                </Button>
                              </td>
                              <td className="py-2 px-4 text-center">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditPayment(payment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No payments recorded.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credentials Tab */}
            <TabsContent value="credentials" className="space-y-4 mt-4">
              {isAdmin || isModerator ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Credentials</h3>
                    <Button onClick={handleAddCredential}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Credential
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      {credentials.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-4">System</th>
                                <th className="text-left py-2 px-4">Login</th>
                                <th className="text-left py-2 px-4">Password</th>
                                <th className="text-left py-2 px-4">Notes</th>
                                <th className="text-center py-2 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {credentials.map(credential => (
                                <tr key={credential.id} className="border-b">
                                  <td className="py-2 px-4">
                                    <Badge variant="outline">
                                      {credential.system === 'hosting' ? 'Hosting' :
                                       credential.system === 'domain' ? 'Domain' :
                                       credential.system === 'facebook' ? 'Facebook' :
                                       credential.system === 'instagram' ? 'Instagram' : 'Other'}
                                    </Badge>
                                  </td>
                                  <td className="py-2 px-4">{credential.login}</td>
                                  <td className="py-2 px-4">
                                    <div className="flex items-center">
                                      {showPasswords[credential.id] ? credential.password : '••••••••'}
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => togglePasswordVisibility(credential.id)}
                                        className="ml-2 h-6 w-6 p-0"
                                      >
                                        {showPasswords[credential.id] ? 
                                          <EyeOff className="h-4 w-4" /> : 
                                          <Eye className="h-4 w-4" />}
                                      </Button>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 text-sm">{credential.notes}</td>
                                  <td className="py-2 px-4 text-center">
                                    <div className="flex justify-center gap-1">
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => handleEditCredential(credential)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="text-red-500"
                                        onClick={() => handleDeleteCredential(credential.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">
                          No credentials recorded.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <InfoIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Restricted Access</h3>
                    <p className="text-center text-muted-foreground">
                      Credentials are only available to Moderator and Administrator users.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Notes and Observations</CardTitle>
                  <CardDescription>
                    Additional information, communication history, and general observations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={notesValue} 
                    onChange={(e) => setNotesValue(e.target.value)}
                    rows={10}
                    placeholder="Type your observations about this client..."
                    className="resize-none"
                    readOnly={!onUpdateClient}
                  />
                </CardContent>
                {onUpdateClient && (
                  <CardFooter>
                    <Button 
                      className="ml-auto"
                      onClick={handleSaveNotes}
                    >
                      Save Notes
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Call Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={callSummaryValue} 
                    onChange={(e) => setCallSummaryValue(e.target.value)}
                    rows={6}
                    placeholder="Summary of recent calls with the client..."
                    className="resize-none"
                    readOnly={!onUpdateClient}
                  />
                </CardContent>
                {onUpdateClient && (
                  <CardFooter>
                    <Button 
                      className="ml-auto"
                      onClick={handleSaveCallSummary}
                    >
                      Save Summary
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Form Dialogs */}
      {client && (
        <>
          <ProjectForm
            open={projectFormOpen}
            onOpenChange={setProjectFormOpen}
            onSubmit={handleProjectSubmit}
            clientId={client.id}
            initialData={selectedProject || undefined}
            mode={selectedProject ? 'edit' : 'create'}
          />
          
          <PaymentForm
            open={paymentFormOpen}
            onOpenChange={setPaymentFormOpen}
            onSubmit={handlePaymentSubmit}
            clientId={client.id}
            initialData={selectedPayment || undefined}
            mode={selectedPayment ? 'edit' : 'create'}
          />
          
          <CredentialForm
            open={credentialFormOpen}
            onOpenChange={setCredentialFormOpen}
            onSubmit={handleCredentialSubmit}
            clientId={client.id}
            initialData={selectedCredential || undefined}
            mode={selectedCredential ? 'edit' : 'create'}
          />
        </>
      )}
    </Dialog>
  );
};

export default ClientDetailsDialog; 