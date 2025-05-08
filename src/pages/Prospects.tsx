import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Prospect } from "@/lib/supabase";
import { prospectService, ProspectFormData } from "@/services/prospectService";
import ProspectFormDialog from "@/components/prospects/ProspectFormDialog";
import ProspectDetailsDialog from "@/components/prospects/ProspectDetailsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

// Add necessary type for Promise.allSettled
type PromiseFulfilledResult<T> = {
  status: 'fulfilled';
  value: T;
};

type ProspectCardProps = {
  prospect: Prospect;
  onEdit: (prospect: Prospect) => void;
  onViewDetails: (prospect: Prospect) => void;
  onConvertToClient: (prospect: Prospect) => void;
  index: number;
};

const ProspectCard: React.FC<ProspectCardProps> = ({ 
  prospect, 
  onEdit,
  onViewDetails,
  onConvertToClient,
  index
}) => {
  const [isAlreadyClient, setIsAlreadyClient] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the prospect is already a client
    const checkClientStatus = async () => {
      try {
        const isClient = await prospectService.checkIfProspectIsClient(prospect.id);
        setIsAlreadyClient(isClient);
      } catch (error) {
        console.error(`Error checking client status for prospect ${prospect.id}:`, error);
        setIsAlreadyClient(false);
      }
    };
    
    checkClientStatus();
  }, [prospect.id]);

  const formattedFollowUp = prospect.next_follow_up_at
    ? format(new Date(prospect.next_follow_up_at), "MMM dd, yyyy")
    : "None";

  // Don't show convert button only for lost prospects or prospects that are already clients
  const showConvertButton = prospect.status !== 'lost' && !isAlreadyClient;

  return (
    <Draggable draggableId={prospect.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'z-10' : ''}`}
        >
          <Card className={`shadow-neumorph-sm ${snapshot.isDragging ? 'shadow-lg bg-gray-100' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold">{prospect.contact_name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-gray-500">{prospect.company_name || "N/A"}</div>
              <div className="flex items-center mt-1">
                {Array.from({ length: prospect.score }).map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
                {Array.from({ length: 5 - prospect.score }).map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="text-xs text-gray-500">
                  Follow-up: {formattedFollowUp}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs h-7"
                    onClick={() => onEdit(prospect)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="text-xs h-7"
                    onClick={() => onViewDetails(prospect)}
                  >
                    View
                  </Button>
                </div>
              </div>
              
              {showConvertButton && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7 w-full border-green-500 text-green-500 hover:bg-green-50"
                    >
                      Convert to Client
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Convert to Client</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will convert {prospect.contact_name} from {prospect.company_name || "N/A"} 
                        to an active client. All prospect data will be preserved.
                      </AlertDialogDescription>
                      <p className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
                        After conversion, you'll be redirected to the new client page where you can add more details.
                      </p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => onConvertToClient(prospect)}
                      >
                        Convert to Client
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

type KanbanColumnProps = {
  title: string;
  prospects: Prospect[];
  color: string;
  onEdit: (prospect: Prospect) => void;
  onViewDetails: (prospect: Prospect) => void;
  onConvertToClient: (prospect: Prospect) => void;
  droppableId: string;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  prospects, 
  color,
  onEdit,
  onViewDetails,
  onConvertToClient,
  droppableId
}) => {
  return (
    <div className="flex flex-col min-w-[250px] md:min-w-[280px]">
      <div className={`px-4 py-2 rounded-t-lg ${color} text-white font-medium flex justify-between items-center`}>
        <span>{title}</span>
        <span className="bg-white text-gray-800 px-2 py-0.5 rounded-full text-xs">
          {prospects.length}
        </span>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-gray-50 p-3 rounded-b-lg flex-1 border border-gray-200 overflow-y-auto max-h-[calc(100vh-240px)] ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {prospects.map((prospect, index) => (
              <ProspectCard 
                key={prospect.id} 
                prospect={prospect} 
                index={index}
                onEdit={onEdit}
                onViewDetails={onViewDetails}
                onConvertToClient={onConvertToClient}
              />
            ))}
            {provided.placeholder}
            {prospects.length === 0 && (
              <div className="text-center text-gray-400 py-8">No prospects</div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const Prospects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | undefined>(undefined);
  const [convertLoading, setConvertLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch prospects
  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => prospectService.getProspects(),
  });

  // Create prospect mutation
  const createProspectMutation = useMutation({
    mutationFn: (data: ProspectFormData) => prospectService.createProspect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast({
        title: "Success",
        description: "Prospect created successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create prospect",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Update prospect mutation
  const updateProspectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProspectFormData }) => 
      prospectService.updateProspect(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast({
        title: "Success",
        description: "Prospect updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update prospect",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Update prospect status mutation (for drag and drop)
  const updateProspectStatusMutation = useMutation({
    mutationFn: ({ 
      prospectId, 
      sourceStatus, 
      destinationStatus, 
      sourceIndex, 
      destinationIndex 
    }: { 
      prospectId: string;
      sourceStatus: Prospect['status'];
      destinationStatus: Prospect['status'];
      sourceIndex: number;
      destinationIndex: number;
    }) => 
      prospectService.reorderProspects(
        sourceStatus,
        destinationStatus,
        sourceIndex,
        destinationIndex,
        prospectId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update prospect order",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Convert prospect to client mutation
  const convertToClientMutation = useMutation({
    mutationFn: (id: string) => prospectService.convertToClient(id),
    onSuccess: (data) => {
      if (data.success && data.client_id) {
        queryClient.invalidateQueries({ queryKey: ['prospects'] });
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        toast({
          title: "Success",
          description: "Prospect successfully converted to client",
        });
        
        navigate(`/clients/${data.client_id}`);
      } else if (data.already_exists && data.client_id) {
        toast({
          title: "Information",
          description: "This prospect has already been converted to a client.",
        });
        
        navigate(`/clients/${data.client_id}`);
      } else {
        toast({
          title: "Warning",
          description: data.message || "Unable to convert this prospect to a client",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to convert prospect to client",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleCreateProspect = async (data: ProspectFormData) => {
    try {
      await createProspectMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating prospect:", error);
    }
  };

  const handleUpdateProspect = async (data: ProspectFormData) => {
    if (!selectedProspect?.id) return;
    
    try {
      await updateProspectMutation.mutateAsync({
        id: selectedProspect.id,
        data,
      });
    } catch (error) {
      console.error("Error updating prospect:", error);
      toast({
        title: "Error",
        description: "Failed to update prospect",
        variant: "destructive",
      });
    }
  };

  const handleEditProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setEditMode('edit');
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setDetailsOpen(true);
  };

  const handleConvertToClient = async (prospect: Prospect) => {
    try {
      setConvertLoading(true);
      
      toast({
        title: "Converting prospect",
        description: "Please wait while we convert this prospect to a client...",
      });
      
      console.log(`Converting prospect to client: ${prospect.id} - ${prospect.contact_name}`);
      
      const result = await convertToClientMutation.mutateAsync(prospect.id);
      
      if (result.success && result.client_id) {
        // Force cache invalidation to ensure lists are updated
        await queryClient.invalidateQueries({ queryKey: ['prospects'] });
        await queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        toast({
          title: "Success",
          description: "Prospect successfully converted to client",
        });
        
        navigate(`/clients/${result.client_id}`);
      } else if (result.already_exists && result.client_id) {
        toast({
          title: "Information",
          description: "This prospect has already been converted to a client.",
        });
        
        navigate(`/clients/${result.client_id}`);
      } else {
        toast({
          title: "Warning",
          description: result.message || "Unable to convert this prospect to a client",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error converting prospect:", error);
      toast({
        title: "Error",
        description: "Failed to convert prospect to client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConvertLoading(false);
    }
  };

  // Function to handle conversion success from the dialog
  const handleConvertSuccess = (prospectId: string) => {
    // Redirect to clients page or specific client page
    toast({
      title: "Client created",
      description: "Prospect successfully converted. Redirecting to Clients...",
    });
    
    // Navigate immediately to the client page
    navigate(`/clients/${prospectId}`);
  };

  const handleFormSubmit = async (data: ProspectFormData) => {
    if (editMode === 'edit' && selectedProspect) {
      await handleUpdateProspect(data);
    } else {
      await handleCreateProspect(data);
    }
  };

  const handleFormClose = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => {
      setSelectedProspect(undefined);
      setEditMode('create');
    }, 100);
  };

  // Handle drag and drop events
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable area
    if (!destination) return;

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Handle status update
    updateProspectStatusMutation.mutate({
      prospectId: draggableId,
      sourceStatus: source.droppableId as Prospect['status'],
      destinationStatus: destination.droppableId as Prospect['status'],
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  // Filtrar prospectos baseado no termo de pesquisa
  // Esta função filtra os prospectos antes de agrupá-los por status
  const filterProspects = (prospects: Prospect[]) => {
    if (!searchTerm.trim()) return prospects;
    
    const searchLower = searchTerm.toLowerCase();
    return prospects.filter(prospect => {
      return (
        prospect.contact_name.toLowerCase().includes(searchLower) ||
        (prospect.company_name && prospect.company_name.toLowerCase().includes(searchLower)) ||
        (prospect.email && prospect.email.toLowerCase().includes(searchLower)) ||
        (prospect.business_type && prospect.business_type.toLowerCase().includes(searchLower)) ||
        (prospect.region_city && prospect.region_city.toLowerCase().includes(searchLower)) ||
        (prospect.region_state && prospect.region_state.toLowerCase().includes(searchLower))
      );
    });
  };

  // Filtrar e agrupar prospectos por status
  const filteredProspects = prospects ? filterProspects(prospects) : [];
  const prospectsByStatus = {
    new: filteredProspects.filter(p => p.status === 'new'),
    interested: filteredProspects.filter(p => p.status === 'interested'),
    negotiation: filteredProspects.filter(p => p.status === 'negotiation'),
    lost: filteredProspects.filter(p => p.status === 'lost')
  };

  // Function to attempt syncing locally saved forms
  const syncLocalForms = async () => {
    try {
      const pendingFormsString = safeStorage.getItem('pendingProspectForms');
      if (!pendingFormsString) return;
      
      const pendingForms = JSON.parse(pendingFormsString);
      if (!Array.isArray(pendingForms) || pendingForms.length === 0) return;
      
      setIsSyncing(true);
      toast({
        title: "Syncing data",
        description: `Attempting to sync ${pendingForms.length} pending prospect forms...`,
      });
      
      // Process each pending form
      const results = await Promise.allSettled(
        pendingForms.map(async (item) => {
          try {
            if (item.data.id) {
              // If it's an update
              await prospectService.updateProspect(item.data.id, item.data);
            } else {
              // If it's a new prospect
              await prospectService.createProspect(item.data);
            }
            return item.id; // Return the ID for successful items
          } catch (error) {
            console.error(`Failed to sync form ${item.id}:`, error);
            throw error;
          }
        })
      );
      
      // Filter out successful forms
      const successfulIds = results
        .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
        .map(result => result.value);
      
      // Remove successfully synced forms from storage
      if (successfulIds.length > 0) {
        const remainingForms = pendingForms.filter(
          (form) => !successfulIds.includes(form.id)
        );
        
        if (remainingForms.length > 0) {
          safeStorage.setItem('pendingProspectForms', JSON.stringify(remainingForms));
        } else {
          safeStorage.removeItem('pendingProspectForms');
        }
        
        // Refresh the data
        queryClient.invalidateQueries({ queryKey: ['prospects'] });
        
        toast({
          title: "Sync complete",
          description: `Successfully synced ${successfulIds.length} of ${pendingForms.length} pending forms.`,
        });
      }
      
      if (successfulIds.length < pendingForms.length) {
        toast({
          title: "Sync incomplete",
          description: `${pendingForms.length - successfulIds.length} forms could not be synced and will be retried later.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error syncing local forms:", error);
      toast({
        title: "Sync failed",
        description: "Failed to sync some locally saved data. We'll try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Try to sync local forms when the component mounts
  useEffect(() => {
    if (!isLoading && !error) {
      syncLocalForms();
    }
  }, [isLoading]);

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Prospects</h1>
          <div className="flex gap-2 items-center">
            {/* Barra de pesquisa */}
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <Input
                placeholder="Search prospects..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isSyncing && (
              <Button variant="outline" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </Button>
            )}
            <Button onClick={() => {
              setSelectedProspect(undefined);
              setEditMode('create');
              setIsEditDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Prospect
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading prospects...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error loading prospects. Please try again.</p>
          </div>
        ) : filteredProspects.length === 0 && searchTerm ? (
          <div className="flex justify-center items-center h-64">
            <p>No prospects found matching "{searchTerm}"</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              <KanbanColumn
                title="New"
                prospects={prospectsByStatus.new}
                color="bg-blue-500"
                onEdit={handleEditProspect}
                onViewDetails={handleViewDetails}
                onConvertToClient={handleConvertToClient}
                droppableId="new"
              />
              <KanbanColumn
                title="Interested"
                prospects={prospectsByStatus.interested}
                color="bg-green-500"
                onEdit={handleEditProspect}
                onViewDetails={handleViewDetails}
                onConvertToClient={handleConvertToClient}
                droppableId="interested"
              />
              <KanbanColumn
                title="Negotiation"
                prospects={prospectsByStatus.negotiation}
                color="bg-purple-500"
                onEdit={handleEditProspect}
                onViewDetails={handleViewDetails}
                onConvertToClient={handleConvertToClient}
                droppableId="negotiation"
              />
              <KanbanColumn
                title="Lost"
                prospects={prospectsByStatus.lost}
                color="bg-gray-500"
                onEdit={handleEditProspect}
                onViewDetails={handleViewDetails}
                onConvertToClient={handleConvertToClient}
                droppableId="lost"
              />
            </div>
          </DragDropContext>
        )}

        {/* Form dialog for creating/editing prospects */}
        <ProspectFormDialog
          open={isEditDialogOpen}
          onOpenChange={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={selectedProspect}
          mode={editMode}
        />

        {/* Details dialog */}
        {selectedProspect && (
          <ProspectDetailsDialog
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            prospect={selectedProspect}
            onEdit={handleEditProspect}
            onConvertSuccess={handleConvertSuccess}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Prospects;
