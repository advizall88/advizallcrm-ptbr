import { Fragment, useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Definindo as interfaces que precisamos
interface Slot {
  uid: string;
  time: string;
}

interface EventType {
  id: string;
  title: string;
  description: string;
  length: number;
  slug: string;
  hidden: boolean;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../lib/utils';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import CalEmbed from './CalEmbed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';

// Importando o novo serviço cal
import calService, { AvailableSlotsParams, SlotReservationParams, BookingParams, CAL_USER_ID } from '../../services/cal';

interface MeetingSchedulerProps {
  onComplete?: (reservationData: any) => void;
  defaultEventTypeId?: string;
  defaultDate?: Date;
  defaultDetails?: string;
  defaultUserEmail?: string;
  defaultUserName?: string;
  onStepChange?: (step: string) => void;
  className?: string;
  clientName?: string;
  clientEmail?: string;
  clientId?: string;
  prospectId?: string;
  userId?: string;
  step?: string;
  defaultTab?: string;
  hideCalEmbed?: boolean;
}

export default function MeetingScheduler({
  onComplete,
  defaultEventTypeId,
  defaultDate,
  defaultDetails,
  defaultUserEmail,
  defaultUserName,
  onStepChange,
  className,
  clientName,
  clientEmail,
  clientId,
  prospectId,
  userId,
  step: initialStep = 'event-type',
  defaultTab = 'list',
  hideCalEmbed = false,
}: MeetingSchedulerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [step, setStep] = useState(initialStep);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState('');
  const [reservationUid, setReservationUid] = useState<string | null>(null);
  
  // Ajustando interface da resposta para compatibilidade
  interface ApiSlot {
    uid: string;
    time: string;
    // Outros campos que possam existir...
  }

  // Função para converter formato da API para o formato utilizado pelo componente
  const convertToComponentSlot = (apiSlot: ApiSlot): Slot => {
    return {
      uid: apiSlot.uid,
      time: apiSlot.time,
    };
  };

  // Consulta para buscar os tipos de evento
  const eventTypesQuery = useQuery({
    queryKey: ['eventTypes'],
    queryFn: async () => {
      try {
        // Aqui você pode implementar uma chamada para os tipos de evento, ou usar dados estáticos
        // Como o serviço cal não tem um método para isso, vamos manter como estava ou usar estáticos
        const mockEventTypes: EventType[] = [
          {
            id: "1",
            title: "Consulta de 30 minutos",
            description: "Consulta inicial para entender suas necessidades",
            length: 30,
            slug: "consulta-30-min",
            hidden: false
          },
          {
            id: "2",
            title: "Reunião de 60 minutos",
            description: "Reunião detalhada para planejamento financeiro",
            length: 60,
            slug: "reuniao-60-min",
            hidden: false
          }
        ];
        return mockEventTypes;
      } catch (error) {
        console.error('Erro ao buscar tipos de eventos:', error);
        throw error;
      }
    },
  });

  // Efeito para definir o tipo de evento padrão se houver
  useEffect(() => {
    if (defaultEventTypeId && eventTypesQuery.data) {
      const defaultEvent = eventTypesQuery.data.find(et => et.id === defaultEventTypeId);
      if (defaultEvent) {
        setSelectedEventType(defaultEvent);
        setStep('date');
      }
    }
  }, [defaultEventTypeId, eventTypesQuery.data]);

  // Consulta para buscar slots disponíveis
  const slotsQuery = useQuery({
    queryKey: ['availableSlots', selectedEventType?.id, selectedDate],
    queryFn: async () => {
      if (!selectedEventType || !selectedDate) {
        return [];
      }

      try {
        // Calculando o período para consulta (dia atual)
        const startTime = startOfDay(selectedDate).toISOString();
        const endTime = endOfDay(selectedDate).toISOString();

        const params: AvailableSlotsParams = {
          eventTypeId: selectedEventType.id,
          startTime,
          endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        const slotsData = await calService.getAvailableSlots(params);
        return slotsData.map(convertToComponentSlot);
      } catch (error) {
        console.error('Erro ao buscar slots disponíveis:', error);
        // Se falhar, retorna array vazio para não quebrar a interface
        return [];
      }
    },
    enabled: !!selectedEventType && !!selectedDate,
  });

  // Mutação para reservar um slot
  const reserveSlotMutation = useMutation({
    mutationFn: async (slot: Slot) => {
      if (!slot) throw new Error('Nenhum slot selecionado');

      const reservationParams: SlotReservationParams = {
        slotUid: slot.uid,
        name: clientName,
        email: clientEmail,
        notes: notes
      };

      return await calService.reserveSlot(reservationParams);
    },
    onSuccess: (data) => {
      // Salvando o UID da reserva para uso na confirmação
      setReservationUid(data.uid);
      setStep('confirmation');
      if (onStepChange) onStepChange('confirmation');
    },
    onError: (error) => {
      console.error('Erro ao reservar slot:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reservar o horário selecionado.',
        variant: 'destructive',
      });
    }
  });

  // Mutação para confirmar a reserva
  const confirmReservationMutation = useMutation({
    mutationFn: async () => {
      if (!reservationUid) throw new Error('Nenhuma reserva para confirmar');

      const bookingParams: BookingParams = {
        reservationUid,
        name: clientName,
        email: clientEmail,
        notes,
        clientId,
        prospectId,
        userId,
      };

      return await calService.createBooking(bookingParams);
    },
    onSuccess: (data) => {
      setStep('success');
      if (onStepChange) onStepChange('success');
      if (onComplete) onComplete(data);
      
      // Invalidar queries para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['availableSlots'] });

      toast({
        title: 'Reunião agendada',
        description: 'Sua reunião foi agendada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao confirmar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível confirmar o agendamento.',
        variant: 'destructive',
      });
    }
  });

  // Navegação entre etapas
  const handleSelectEventType = (value: string) => {
    if (!eventTypesQuery.data) return;
    const selectedEvent = eventTypesQuery.data.find(et => et.id === value);
    if (selectedEvent) {
      setSelectedEventType(selectedEvent);
      setStep('date');
      if (onStepChange) onStepChange('date');
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep('time');
      if (onStepChange) onStepChange('time');
    }
  };

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    reserveSlotMutation.mutate(slot);
  };

  const handleConfirmReservation = () => {
    confirmReservationMutation.mutate();
  };

  const handleBack = () => {
    switch (step) {
      case 'date':
        setStep('event-type');
        if (onStepChange) onStepChange('event-type');
        break;
      case 'time':
        setStep('date');
        if (onStepChange) onStepChange('date');
        break;
      case 'confirmation':
        setStep('time');
        if (onStepChange) onStepChange('time');
        // Se voltar da confirmação, cancelar a reserva (opcional)
        setReservationUid(null);
        break;
      default:
        break;
    }
  };

  // Formatando a data para exibição
  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';
    return format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);

  // Formatando o horário do slot para exibição
  const formattedSlotTime = useMemo(() => {
    if (!selectedSlot) return '';
    return format(parseISO(selectedSlot.time), "HH:mm", { locale: ptBR });
  }, [selectedSlot]);

  return (
    <div className={cn('w-full', className)}>
      {!hideCalEmbed && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de horários</TabsTrigger>
            <TabsTrigger value="embed">Calendário completo</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            {renderStepContent()}
          </TabsContent>
          <TabsContent value="embed">
            <CalEmbed 
              username={CAL_USER_ID}
              calLink={`${CAL_USER_ID}/${selectedEventType?.slug || ''}`}
              prefill={{
                name: clientName,
                email: clientEmail,
                notes: notes,
                customInputs: {
                  clientId: clientId,
                  prospectId: prospectId,
                  userId: userId,
                }
              }}
              className="w-full h-[600px]"
            />
          </TabsContent>
        </Tabs>
      )}

      {hideCalEmbed && renderStepContent()}
    </div>
  );

  function renderStepContent() {
    switch (step) {
      case 'event-type':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Selecione o tipo de reunião</h2>
            {eventTypesQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : eventTypesQuery.isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Não foi possível carregar os tipos de eventos. Tente novamente mais tarde.
                </AlertDescription>
              </Alert>
            ) : (
              <RadioGroup 
                value={selectedEventType?.id}
                onValueChange={handleSelectEventType}
                className="space-y-2 mt-4"
              >
                {eventTypesQuery.data?.map((eventType) => (
                  <div key={eventType.id} className="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none">
                    <RadioGroupItem value={eventType.id} id={eventType.id} className="sr-only" />
                    <div className="w-full flex justify-between">
                      <div>
                        <Label htmlFor={eventType.id} className="font-medium">
                          {eventType.title}
                        </Label>
                        <Label htmlFor={eventType.id} className="block text-sm text-muted-foreground">
                          {eventType.description}
                        </Label>
                        <div className="mt-2 flex items-center">
                          <span className="text-xs text-muted-foreground">
                            {eventType.length} minutos
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-primary">
                        {selectedEventType?.id === eventType.id && (
                          <Check className="h-6 w-6" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
              <h2 className="text-lg font-medium">Selecione uma data</h2>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="w-full md:w-auto">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
                />
              </div>
              
              <div className="w-full space-y-3">
                <h3 className="font-medium">Detalhes</h3>
                {selectedEventType && (
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Tipo</span>
                      <span className="text-sm">{selectedEventType.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Duração</span>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{selectedEventType.length} min</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'time':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
              <h2 className="text-lg font-medium">Selecione um horário</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="capitalize">{formattedDate}</span>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto h-8">
                    Alterar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelectDate}
                    disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {slotsQuery.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : slotsQuery.isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Não foi possível carregar os horários disponíveis. Tente novamente mais tarde.
                </AlertDescription>
              </Alert>
            ) : slotsQuery.data && slotsQuery.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slotsQuery.data.map((slot) => (
                  <Button
                    key={slot.uid}
                    variant="outline"
                    className="justify-start h-12"
                    onClick={() => handleSelectSlot(slot)}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(parseISO(slot.time), "HH:mm", { locale: ptBR })}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Não há horários disponíveis para esta data.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleSelectDate(addDays(selectedDate || new Date(), 1))}
                >
                  Verificar próximo dia
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'confirmation':
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Confirmar agendamento</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3">
              {selectedEventType && selectedSlot && (
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reunião</span>
                    <span className="text-sm">{selectedEventType.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Data</span>
                    <span className="text-sm capitalize">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Horário</span>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{formattedSlotTime}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duração</span>
                    <span className="text-sm">{selectedEventType.length} min</span>
                  </div>
                  {clientName && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Nome</span>
                      <span className="text-sm">{clientName}</span>
                    </div>
                  )}
                  {clientEmail && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm">{clientEmail}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionais</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione detalhes ou tópicos para serem discutidos na reunião..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirmReservation}
                disabled={confirmReservationMutation.isPending}
              >
                {confirmReservationMutation.isPending ? 'Confirmando...' : 'Confirmar agendamento'}
              </Button>
            </DialogFooter>
          </div>
        );
      
      case 'success':
        return (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-lg font-medium">Agendamento confirmado!</h2>
            <p className="text-muted-foreground">
              Uma confirmação foi enviada para o seu email. Você também receberá um lembrete antes da reunião.
            </p>
            
            {selectedEventType && selectedSlot && (
              <div className="rounded-lg border p-3 mt-4 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Reunião</span>
                  <span className="text-sm">{selectedEventType.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Data</span>
                  <span className="text-sm capitalize">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Horário</span>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formattedSlotTime}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <Button
                onClick={() => {
                  setSelectedEventType(null);
                  setSelectedDate(new Date());
                  setSelectedSlot(null);
                  setNotes('');
                  setReservationUid(null);
                  setStep('event-type');
                  if (onStepChange) onStepChange('event-type');
                }}
                variant="outline"
              >
                Agendar outra reunião
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  }
} 