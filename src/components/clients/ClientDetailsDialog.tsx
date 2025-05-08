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
  Plus,
  FileText
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
import Overview from "./tabs/Overview";
import Projects from "./tabs/Projects";
import Finance from "./tabs/Finance";
import Credentials from "./tabs/Credentials";
import EditClient from "./tabs/EditClient";
import Tasks from "./tabs/Tasks";
import Notes from "./tabs/Notes";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  setClient: React.Dispatch<React.SetStateAction<Client | null>>;
  projects: Project[];
  payments: Payment[];
  credentials: Credential[];
  onUpdateClient: (data: ClientFormData) => void;
  onAddProject: (data: ProjectFormData) => void;
  onAddPayment: (data: PaymentFormData) => void;
  onAddCredential: (data: CredentialFormData) => void;
  onUpdateProject: (id: string, data: ProjectFormData) => void;
  onDeleteProject: (id: string) => void;
  onUpdatePayment: (id: string, data: Partial<PaymentFormData>) => void;
  onDeletePayment: (id: string) => void;
  onUpdateCredential: (id: string, data: CredentialFormData) => void;
  onDeleteCredential: (id: string) => void;
}

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({
  open,
  onOpenChange,
  client,
  setClient,
  projects,
  payments,
  credentials,
  onUpdateClient,
  onAddProject,
  onAddPayment,
  onAddCredential,
  onUpdateProject,
  onDeleteProject,
  onUpdatePayment,
  onDeletePayment,
  onUpdateCredential,
  onDeleteCredential,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("overview");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [callSummaryValue, setCallSummaryValue] = useState('');
  
  // Form dialog states
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const [openCredentialForm, setOpenCredentialForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  // At the top of the component, add state for tasks dialog
  const [openTasksView, setOpenTasksView] = useState(false);

  // Add a state to track the editable client
  const [editableClient, setEditableClient] = useState<ClientFormData | null>(null);
  
  // Initialize editable client when actual client changes or when opening edit mode
  useEffect(() => {
    if (client) {
      setEditableClient({
        contact_name: client.contact_name,
        company_name: client.company_name || "",
        email: client.email,
        phone: client.phone,
        full_address: client.full_address || "",
        website: client.website || "",
        business_type: client.business_type,
        status: client.status as "active" | "inactive" | "delinquent",
        plan_name: client.plan_name || "",
        monthly_fee: client.monthly_fee || 0,
        ad_budget: client.ad_budget || 0,
        notes: client.notes || '',
      });
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

  const handleEditClient = () => {
    if (client) {
      setEditableClient({
        contact_name: client.contact_name,
        company_name: client.company_name || "",
        email: client.email,
        phone: client.phone,
        full_address: client.full_address || "",
        website: client.website || "",
        business_type: client.business_type,
        status: client.status as "active" | "inactive" | "delinquent",
        plan_name: client.plan_name || "",
        monthly_fee: client.monthly_fee || 0,
        ad_budget: client.ad_budget || 0,
        notes: client.notes || '',
      });
      setActiveTab("editClient");
    }
  };

  const handleSaveClient = () => {
    if (editableClient && client) {
      onUpdateClient(editableClient);
      setActiveTab("overview");
    }
  };

  const handleEditClientChange = (field: keyof ClientFormData, value: any) => {
    if (editableClient) {
      setEditableClient({
        ...editableClient,
        [field]: value,
      });
    }
  };

  const handleAddProject = (data: ProjectFormData) => {
    onAddProject(data);
    setOpenProjectForm(false);
    setSelectedProject(null);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setOpenProjectForm(true);
  };

  const handleDeleteProject = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete project: ${project.description}?`)) {
      onDeleteProject(project.id);
      toast({
        title: "Success",
        description: `Project deleted successfully`,
      });
    }
  };

  const handleSaveProject = async (data: ProjectFormData) => {
    if (selectedProject) {
      await onUpdateProject(selectedProject.id, data);
    } else {
      await onAddProject(data);
    }
    setOpenProjectForm(false);
    setSelectedProject(null);
  };

  const handleAddPayment = (data: PaymentFormData) => {
    onAddPayment(data);
    setOpenPaymentForm(false);
    setSelectedPayment(null);
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenPaymentForm(true);
  };

  const handleDeletePayment = (payment: Payment) => {
    if (window.confirm(`Are you sure you want to delete payment: ${payment.description}?`)) {
      onDeletePayment(payment.id);
      toast({
        title: "Success",
        description: `Payment deleted successfully`,
      });
    }
  };

  const handleSavePayment = async (data: PaymentFormData) => {
    if (selectedPayment) {
      await onUpdatePayment(selectedPayment.id, data);
    } else {
      await onAddPayment(data);
    }
    setOpenPaymentForm(false);
    setSelectedPayment(null);
  };

  const handleTogglePaymentStatus = (payment: Payment) => {
    const updatedPayment = { ...payment, paid: !payment.paid };
    onUpdatePayment(payment.id, { paid: !payment.paid });
    toast({
      title: payment.paid ? "Payment Marked as Unpaid" : "Payment Marked as Paid",
      description: `Payment for ${payment.description} has been updated.`,
    });
  };

  const handleAddCredential = (data: CredentialFormData) => {
    onAddCredential(data);
    setOpenCredentialForm(false);
    setSelectedCredential(null);
  };

  const handleEditCredential = (credential: Credential) => {
    setSelectedCredential(credential);
    setOpenCredentialForm(true);
  };

  const handleDeleteCredential = (credential: Credential) => {
    if (window.confirm(`Are you sure you want to delete credential for ${credential.system}?`)) {
      onDeleteCredential(credential.id);
      toast({
        title: "Success",
        description: `Credential deleted successfully`,
      });
    }
  };

  const handleSaveCredential = async (data: CredentialFormData) => {
    if (selectedCredential) {
      await onUpdateCredential(selectedCredential.id, data);
    } else {
      await onAddCredential(data);
    }
    setOpenCredentialForm(false);
    setSelectedCredential(null);
  };

  const handleViewTasks = (project: Project) => {
    setSelectedProject(project);
    setOpenTasksView(true);
  };

  const handleUpdateNotes = (notes: string) => {
    if (client && editableClient) {
      const updatedClient = {
        ...editableClient,
        notes: notes
      };
      onUpdateClient(updatedClient);
      setEditableClient(updatedClient);
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <BadgeIcon className="h-5 w-5 text-primary" />
            {client.company_name || client.contact_name}
          </DialogTitle>
          <DialogDescription>
            Complete client details
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="editClient" className="hidden">
                Edit Client
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 px-1 h-[calc(80vh-10rem)]">
              <TabsContent value="overview" className="mt-0 h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:mt-4">
                <Overview client={client} onEdit={handleEditClient} />
              </TabsContent>

              <TabsContent value="projects" className="mt-0 h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:mt-4">
                <Projects 
                  client={client}
                  projects={projects}
                  onAdd={() => {
                    setSelectedProject(null);
                    setOpenProjectForm(true);
                  }}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onViewTasks={handleViewTasks}
                  openForm={openProjectForm}
                  setOpenForm={setOpenProjectForm}
                  selectedProject={selectedProject}
                  onSave={handleSaveProject}
                />
              </TabsContent>

              <TabsContent value="finance" className="mt-0 h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:mt-4">
                <Finance 
                  client={client}
                  payments={payments}
                  onAdd={() => {
                    setSelectedPayment(null);
                    setOpenPaymentForm(true);
                  }}
                  onEdit={handleEditPayment}
                  onDelete={handleDeletePayment}
                  onToggleStatus={handleTogglePaymentStatus}
                  openForm={openPaymentForm}
                  setOpenForm={setOpenPaymentForm}
                  selectedPayment={selectedPayment}
                  onSave={handleSavePayment}
                />
              </TabsContent>

              <TabsContent value="credentials" className="mt-0 h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:mt-4">
                <Credentials 
                  client_id={client?.id || ''}
                  credentials={credentials}
                  onAdd={() => {
                    setSelectedCredential(null);
                    setOpenCredentialForm(true);
                  }}
                  onEdit={handleEditCredential}
                  onDelete={handleDeleteCredential}
                  openForm={openCredentialForm}
                  setOpenForm={setOpenCredentialForm}
                  selectedCredential={selectedCredential}
                  onSave={handleSaveCredential}
                  showPasswords={showPasswords}
                  togglePasswordVisibility={togglePasswordVisibility}
                />
              </TabsContent>

              <TabsContent value="notes" className="mt-0 h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:mt-4">
                <Notes 
                  client={client}
                  onUpdateNotes={handleUpdateNotes}
                />
              </TabsContent>

              <TabsContent value="editClient" className="mt-0 h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:mt-4">
                <EditClient 
                  client={editableClient}
                  onChange={handleEditClientChange}
                  onSave={handleSaveClient}
                  onCancel={() => setActiveTab("overview")}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

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
            open={openProjectForm}
            onOpenChange={setOpenProjectForm}
            onSubmit={handleSaveProject}
            clientId={client.id}
            initialData={selectedProject || undefined}
            mode={selectedProject ? 'edit' : 'create'}
          />
          
          <PaymentForm
            open={openPaymentForm}
            onOpenChange={setOpenPaymentForm}
            onSubmit={handleSavePayment}
            clientId={client.id}
            initialData={selectedPayment || undefined}
            mode={selectedPayment ? 'edit' : 'create'}
          />
          
          <CredentialForm
            open={openCredentialForm}
            onOpenChange={setOpenCredentialForm}
            onSubmit={handleSaveCredential}
            clientId={client.id}
            initialData={selectedCredential || undefined}
            mode={selectedCredential ? 'edit' : 'create'}
          />
        </>
      )}

      <Tasks 
        open={openTasksView}
        onOpenChange={setOpenTasksView}
        project={selectedProject}
      />
    </Dialog>
  );
};

export default ClientDetailsDialog; 