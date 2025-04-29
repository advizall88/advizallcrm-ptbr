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
import ScheduleMeetingDialog from "@/components/calendar/ScheduleMeetingDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical } from "lucide-react";

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
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  
  useEffect(() => {
    // Verificar se o prospect já é um cliente
    const checkClientStatus = async () => {
      const isClient = await prospectService.checkIfProspectIsClient(prospect.id);
      setIsAlreadyClient(isClient);
    };
    
    checkClientStatus();
  }, [prospect.id]);

  const formattedFollowUp = prospect.next_follow_up_at
    ? format(new Date(prospect.next_follow_up_at), "MMM dd, yyyy")
    : "None";

  // Don't show convert button for lost prospects or prospects that are already clients
  const showConvertButton = prospect.status !== 'lost' && !isAlreadyClient;

  return (
    <>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(prospect)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewDetails(prospect)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setScheduleMeetingOpen(true)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                          
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700">
                            After conversion, you'll be redirected to the new client page where you can add more details.
                          </div>
                        </AlertDialogDescription>
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
      
      <ScheduleMeetingDialog
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
        prospectId={prospect.id}
        attendeeName={prospect.contact_name}
        attendeeEmail={prospect.email || ''}
        attendeeTimezone={prospect.timezone || 'America/New_York'}
      />
    </>
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
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | undefined>(undefined);
  const [convertLoading, setConvertLoading] = useState(false);

  // Fetch prospects
  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: prospectService.getProspects,
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
          title: "Sucesso",
          description: "Prospect convertido para cliente com sucesso",
        });
        
        navigate(`/clients/${data.client_id}`);
      } else if (data.already_exists && data.client_id) {
        toast({
          title: "Informação",
          description: "Este prospect já foi convertido para cliente anteriormente.",
        });
        
        navigate(`/clients/${data.client_id}`);
      } else {
        toast({
          title: "Atenção",
          description: data.message || "Não foi possível converter este prospect para cliente",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao converter prospect para cliente",
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
      
      toast({
        title: "Success",
        description: "Prospect updated successfully",
      });
      
      // Não limpe o selectedProspect aqui, 
      // isso será feito pelo handleFormClose
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
    setFormOpen(true);
  };

  const handleViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setDetailsOpen(true);
  };

  const handleConvertToClient = async (prospect: Prospect) => {
    setConvertLoading(true);
    try {
      const result = await convertToClientMutation.mutateAsync(prospect.id);
      // Não é necessário fazer nada aqui, o onSuccess/onError da mutation já tratam da resposta
    } catch (error) {
      console.error("Error converting prospect to client:", error);
    } finally {
      setConvertLoading(false);
    }
  };

  const handleFormSubmit = async (data: ProspectFormData) => {
    if (selectedProspect) {
      await handleUpdateProspect(data);
    } else {
      await handleCreateProspect(data);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setTimeout(() => {
      setSelectedProspect(undefined);
    }, 100);
  };

  // Handle drag and drop events
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable area
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get status values from droppableIds
    const sourceStatus = source.droppableId as Prospect['status'];
    const destinationStatus = destination.droppableId as Prospect['status'];

    // Update the prospect optimistically in the UI
    const updatedProspects = [...prospects];
    const movedProspect = prospectsByStatus[sourceStatus][source.index];
    
    // Remove from source array
    const sourceProspects = Array.from(prospectsByStatus[sourceStatus]);
    sourceProspects.splice(source.index, 1);
    
    // Add to destination array
    const destinationProspects = Array.from(prospectsByStatus[destinationStatus]);
    destinationProspects.splice(destination.index, 0, {
      ...movedProspect,
      status: destinationStatus
    });

    // Update backend
    updateProspectStatusMutation.mutate({
      prospectId: draggableId,
      sourceStatus,
      destinationStatus,
      sourceIndex: source.index,
      destinationIndex: destination.index
    });

    toast({
      title: "Prospect Moved",
      description: `Prospect moved to ${destinationStatus} stage`,
    });
  };

  // Group prospects by status
  const prospectsByStatus = {
    new: prospects.filter(p => p.status === "new"),
    interested: prospects.filter(p => p.status === "interested"),
    negotiation: prospects.filter(p => p.status === "negotiation"),
    lost: prospects.filter(p => p.status === "lost"),
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
            <p className="text-gray-500">Manage and track your sales pipeline.</p>
          </div>
          <Button 
            variant="default" 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setFormOpen(true)}
          >
            + Add Prospect
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Error loading prospects. Please try again.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board flex space-x-6 overflow-x-auto pb-4">
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
      </div>

      <ProspectFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedProspect}
        mode={selectedProspect ? "edit" : "create"}
      />

      <ProspectDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        prospect={selectedProspect}
        onEdit={handleEditProspect}
        onConvertToClient={handleConvertToClient}
      />
    </AppLayout>
  );
};

export default Prospects;
