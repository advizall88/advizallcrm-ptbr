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
import { useTheme } from '@/contexts/ThemeContext';

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
  const { darkMode } = useTheme();
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
          <Card className={`shadow-neumorph-sm ${snapshot.isDragging ? 'shadow-lg dark:shadow-md dark:bg-gray-800 bg-gray-100' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold">{prospect.contact_name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">{prospect.company_name || "N/A"}</div>
              <div className="flex items-center mt-1">
                {Array.from({ length: prospect.score }).map((_, i) => (
                  <span key={i} className="text-yellow-500 dark:text-yellow-400">★</span>
                ))}
                {Array.from({ length: 5 - prospect.score }).map((_, i) => (
                  <span key={i} className="text-gray-300 dark:text-gray-600">★</span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="text-xs text-muted-foreground">
                  Follow-up: {formattedFollowUp === 'None' ? 'Nenhum' : formattedFollowUp}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs h-7"
                    onClick={() => onEdit(prospect)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="text-xs h-7"
                    onClick={() => onViewDetails(prospect)}
                  >
                    Visualizar
                  </Button>
                </div>
              </div>
              
              {showConvertButton && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`text-xs h-7 w-full border-green-500 text-green-500 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/30`}
                    >
                      Converter em Cliente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Converter em Cliente</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso irá converter {prospect.contact_name} de {prospect.company_name || "N/A"} 
                        para um cliente ativo. Todos os dados do prospecto serão preservados.
                      </AlertDialogDescription>
                      <p className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-amber-700 dark:text-amber-400 text-sm">
                        Após a conversão, você será redirecionado para a página do novo cliente onde poderá adicionar mais detalhes.
                      </p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                        onClick={() => onConvertToClient(prospect)}
                      >
                        Converter em Cliente
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
  const { darkMode } = useTheme();
  
  // Função para determinar as cores a serem usadas baseadas na propriedade color
  const getStatusColor = () => {
    switch (color) {
      case 'bg-blue-500':
        return {
          bg: 'bg-blue-500',
          textColor: 'text-white',
          darkBg: 'dark:bg-blue-600'
        };
      case 'bg-green-500':
        return {
          bg: 'bg-green-500',
          textColor: 'text-white',
          darkBg: 'dark:bg-green-600'
        };
      case 'bg-purple-500':
        return {
          bg: 'bg-purple-500',
          textColor: 'text-white',
          darkBg: 'dark:bg-purple-600'
        };
      case 'bg-gray-500':
        return {
          bg: 'bg-gray-500',
          textColor: 'text-white',
          darkBg: 'dark:bg-gray-600'
        };
      default:
        return {
          bg: color,
          textColor: 'text-white',
          darkBg: `dark:${color.replace('bg-', 'bg-')}`
        };
    }
  };
  
  const colorClasses = getStatusColor();
  
  return (
    <div className="flex flex-col min-w-[250px] md:min-w-[280px]">
      <div className={`px-4 py-2 rounded-t-lg ${colorClasses.bg} ${colorClasses.darkBg} ${colorClasses.textColor} font-medium flex justify-between items-center`}>
        <span>{title}</span>
        <span className="bg-white/20 dark:bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
          {prospects.length}
        </span>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-gray-50 dark:bg-gray-900/30 p-3 rounded-b-lg flex-1 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[calc(100vh-240px)] ${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-950/30' : ''
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
              <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded p-4 flex flex-col items-center justify-center h-24">
                <p className="text-sm text-muted-foreground text-center">Nenhum prospecto</p>
                <p className="text-xs text-muted-foreground text-center mt-1">Arraste prospectos aqui</p>
              </div>
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentProspect, setCurrentProspect] = useState<Prospect | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formKey, setFormKey] = useState(Date.now());
  
  // Função para filtrar prospectos baseado no termo de pesquisa
  const filterProspects = (prospects: Prospect[]) => {
    if (!searchQuery.trim()) return prospects;
    
    const searchLower = searchQuery.toLowerCase();
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
  
  // Fetch prospects
  const { data: prospects = [], isLoading: isLoadingProspects, error: prospectsError, isError: isProspectsError } = useQuery<Prospect[]>({
    queryKey: ["prospects"],
    queryFn: prospectService.getProspects
  });
  
  // React to loading state and errors with useEffect
  useEffect(() => {
    if (!isLoadingProspects) {
      setIsLoading(false);
    }
    
    if (isProspectsError && prospectsError) {
      console.error("Error fetching prospects:", prospectsError);
      toast({
        title: "Erro",
        description: "Falha ao carregar prospectos. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [isLoadingProspects, isProspectsError, prospectsError, toast]);
  
  // Fetch converted prospect IDs
  const { data: convertedProspectIds = [] } = useQuery<string[]>({
    queryKey: ["convertedProspects"],
    queryFn: async () => {
      try {
        const storedIds = safeStorage.getItem("convertedProspects");
        return storedIds ? JSON.parse(storedIds) : [];
      } catch (error) {
        console.error("Error loading converted prospects:", error);
        return [];
      }
    }
  });
  
  // Group prospects by status
  const prospectsByStatus = {
    new: filterProspects(prospects.filter((p) => p.status === "new")),
    interested: filterProspects(prospects.filter((p) => p.status === "interested")),
    negotiation: filterProspects(prospects.filter((p) => p.status === "negotiation")),
    lost: filterProspects(prospects.filter((p) => p.status === "lost")),
  };
  
  // Create prospect mutation
  const createProspectMutation = useMutation({
    mutationFn: (data: ProspectFormData) => prospectService.createProspect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast({
        title: "Sucesso",
        description: "Prospecto criado com sucesso",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar prospecto",
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
        title: "Sucesso",
        description: "Prospecto atualizado com sucesso",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar prospecto",
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
        title: "Erro",
        description: "Falha ao atualizar ordem dos prospectos",
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
          description: "Prospecto convertido em cliente com sucesso",
        });
        
        navigate(`/clients/${data.client_id}`);
      } else if (data.already_exists && data.client_id) {
        toast({
          title: "Informação",
          description: "Este prospecto já foi convertido em cliente.",
        });
        
        navigate(`/clients/${data.client_id}`);
      } else {
        toast({
          title: "Atenção",
          description: data.message || "Não foi possível converter este prospecto em cliente",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao converter prospecto em cliente",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleCreateProspect = async (data: ProspectFormData) => {
    try {
      if (!data) {
        console.error("Invalid prospect data");
        toast({
          title: "Erro",
          description: "Dados do prospecto inválidos",
          variant: "destructive",
        });
        return;
      }
      await createProspectMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating prospect:", error);
    }
  };

  const handleUpdateProspect = async (data: ProspectFormData) => {
    if (!currentProspect?.id) return;
    
    try {
      await updateProspectMutation.mutateAsync({
        id: currentProspect.id,
        data,
      });
    } catch (error) {
      console.error("Error updating prospect:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar prospecto",
        variant: "destructive",
      });
    }
  };

  const handleEditProspect = (prospect: Prospect) => {
    setCurrentProspect(prospect);
    setIsFormOpen(true);
  };

  const handleViewDetails = (prospect: Prospect) => {
    setCurrentProspect(prospect);
    setIsDetailsOpen(true);
  };

  const handleConvertToClient = async (prospect: Prospect) => {
    try {
      setIsFormSubmitting(true);
      
      toast({
        title: "Convertendo prospecto",
        description: "Por favor, aguarde enquanto convertemos este prospecto em cliente...",
      });
      
      console.log(`Converting prospect to client: ${prospect.id} - ${prospect.contact_name}`);
      
      const result = await convertToClientMutation.mutateAsync(prospect.id);
      
      if (result.success && result.client_id) {
        // Force cache invalidation to ensure lists are updated
        await queryClient.invalidateQueries({ queryKey: ['prospects'] });
        await queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        toast({
          title: "Sucesso",
          description: "Prospecto convertido em cliente com sucesso",
        });
        
        navigate(`/clients/${result.client_id}`);
      } else if (result.already_exists && result.client_id) {
        toast({
          title: "Informação",
          description: "Este prospecto já foi convertido em cliente.",
        });
        
        navigate(`/clients/${result.client_id}`);
      } else {
        toast({
          title: "Atenção",
          description: result.message || "Não foi possível converter este prospecto em cliente",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error converting prospect:", error);
      toast({
        title: "Erro",
        description: "Falha ao converter prospecto em cliente. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Function to handle conversion success from the dialog
  const handleConvertSuccess = (prospectId: string) => {
    // Redirect to clients page or specific client page
    toast({
      title: "Cliente criado",
      description: "Prospecto convertido com sucesso. Redirecionando para Clientes...",
    });
    
    // Navigate immediately to the client page
    navigate(`/clients/${prospectId}`);
  };

  const handleFormSubmit = async (data: ProspectFormData) => {
    setIsFormSubmitting(true);
    try {
      if (currentProspect) {
        await handleUpdateProspect(data);
      } else {
        // Garantir que o owner_id está definido para o usuário atual
        const prospectData = {
          ...data,
          owner_id: user?.id || ''
        };
        await handleCreateProspect(prospectData);
      }
    } catch (error) {
      console.error("Error submitting prospect form:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar prospecto. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setCurrentProspect(null);
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

  // Função para lidar com a abertura do formulário para criar um novo prospect
  const handleAddProspect = () => {
    setCurrentProspect(null);
    setFormKey(Date.now()); // Forçar atualização do formulário
    setIsFormOpen(true);
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Prospectos</h1>
          <Button size="sm" onClick={handleAddProspect}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Prospecto
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar prospectos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando prospectos...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex space-x-4 min-w-max pb-4">
                <KanbanColumn
                  title="Novo"
                  prospects={prospectsByStatus.new}
                  color="bg-blue-500"
                  onEdit={handleEditProspect}
                  onViewDetails={handleViewDetails}
                  onConvertToClient={handleConvertToClient}
                  droppableId="new"
                />
                <KanbanColumn
                  title="Interessado"
                  prospects={prospectsByStatus.interested}
                  color="bg-green-500"
                  onEdit={handleEditProspect}
                  onViewDetails={handleViewDetails}
                  onConvertToClient={handleConvertToClient}
                  droppableId="interested"
                />
                <KanbanColumn
                  title="Negociação"
                  prospects={prospectsByStatus.negotiation}
                  color="bg-amber-500"
                  onEdit={handleEditProspect}
                  onViewDetails={handleViewDetails}
                  onConvertToClient={handleConvertToClient}
                  droppableId="negotiation"
                />
                <KanbanColumn
                  title="Perdido"
                  prospects={prospectsByStatus.lost}
                  color="bg-red-500"
                  onEdit={handleEditProspect}
                  onViewDetails={handleViewDetails}
                  onConvertToClient={handleConvertToClient}
                  droppableId="lost"
                />
              </div>
            </DragDropContext>
          </div>
        )}
        
        {/* Form dialog for creating/editing prospects */}
        <ProspectFormDialog
          key={formKey} // Forçar recriação do componente quando formKey muda
          open={isFormOpen}
          onOpenChange={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={currentProspect}
          mode={currentProspect ? 'edit' : 'create'}
        />

        {/* Details dialog */}
        {currentProspect && (
          <ProspectDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            prospect={currentProspect}
            onEdit={handleEditProspect}
            onConvertSuccess={handleConvertSuccess}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Prospects;
