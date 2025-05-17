import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Prospect } from "@/lib/supabase";
import { ProspectFormData } from "@/services/prospectService";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  contact_name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  company_name: z.string().nullable().optional(),
  phone: z.string().min(5, { message: "O telefone é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }).optional().nullable(),
  lead_source: z.string().default("Outro"),
  business_type: z.string().optional(),
  region_city: z.string().optional().nullable(),
  region_state: z.string().optional().nullable(),
  timezone: z.string().default("America/Los_Angeles"),
  score: z.coerce.number().min(1).max(5).default(3).optional(),
  status: z.enum(["new", "interested", "negotiation", "lost"]).default("new").optional(),
  first_contact_at: z.date().default(() => new Date()).optional(),
  call_summary: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  next_follow_up_at: z.date().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ProspectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProspectFormData) => Promise<void>;
  initialData?: Prospect;
  mode?: "create" | "edit";
};

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

const ProspectFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "create",
}: ProspectFormDialogProps) => {
  const { user } = useAuth();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(!!initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "saving-locally" | "retrying">("idle");
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          first_contact_at: initialData.first_contact_at
            ? new Date(initialData.first_contact_at)
            : new Date(),
          next_follow_up_at: initialData.next_follow_up_at
            ? new Date(initialData.next_follow_up_at)
            : undefined,
        }
      : {
          status: "new",
          score: 3,
          first_contact_at: new Date(),
          timezone: "America/Los_Angeles",
          lead_source: "Outro",
          business_type: "Outro",
        },
  });

  // Reset form when initialData changes or when modal opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Reset form with initialData for edit mode
        form.reset({
          ...initialData,
          first_contact_at: initialData.first_contact_at
            ? new Date(initialData.first_contact_at)
            : new Date(),
          next_follow_up_at: initialData.next_follow_up_at
            ? new Date(initialData.next_follow_up_at)
            : undefined,
        });
        // Automatically open advanced section for existing prospects
        setIsAdvancedOpen(true);
      } else {
        // Reset form with defaults for create mode
        form.reset({
          status: "new",
          score: 3,
          first_contact_at: new Date(),
          timezone: "America/Los_Angeles",
          lead_source: "Outro",
          business_type: "Outro",
        });
        setIsAdvancedOpen(false);
      }
    }
  }, [form, initialData, open]);

  const saveFormDataLocally = (data: ProspectFormData) => {
    try {
      // Save the current form data to storage
      const pendingForms = JSON.parse(safeStorage.getItem('pendingProspectForms') || '[]');
      pendingForms.push({ 
        data, 
        timestamp: new Date().toISOString(),
        id: initialData?.id || `pending-${Date.now()}`
      });
      safeStorage.setItem('pendingProspectForms', JSON.stringify(pendingForms));
      return true;
    } catch (error) {
      console.error("Failed to save form data locally:", error);
      return false;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSubmitStatus("submitting");
      
      // Ensure required fields are present for ProspectFormData
      const formattedData: ProspectFormData = {
        contact_name: values.contact_name,
        company_name: values.company_name || null,
        phone: values.phone,
        email: values.email || null,
        lead_source: values.lead_source || "Outro",
        business_type: values.business_type || "Outro",
        region_city: values.region_city || null,
        region_state: values.region_state || null,
        timezone: values.timezone || "America/Los_Angeles",
        score: values.score || 3,
        status: values.status || "new",
        first_contact_at: values.first_contact_at?.toISOString() || new Date().toISOString(),
        call_summary: values.call_summary || null,
        notes: values.notes || null,
        next_follow_up_at: values.next_follow_up_at?.toISOString() || null,
        owner_id: initialData?.owner_id || user?.id || "",
      };
      
      // Increase timeout to 20 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("A solicitação está demorando muito. Salvando os dados localmente...")), 20000);
      });
      
      try {
        // Try to submit the form
        await Promise.race([onSubmit(formattedData), timeoutPromise]);
        onOpenChange(false);
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          // First try to retry
          setSubmitStatus("retrying");
          setRetryCount(prev => prev + 1);
          setError(`Tentativa ${retryCount + 1}/${MAX_RETRIES + 1} falhou. Tentando novamente...`);
          
          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            await onSubmit(formattedData);
            onOpenChange(false);
            return;
          } catch (retryError) {
            throw retryError; // Let the outer catch handle it
          }
        }
        
        // If we reach here, all retries failed or it's a timeout
        setSubmitStatus("saving-locally");
        
        // Save the form data locally
        const savedLocally = saveFormDataLocally(formattedData);
        
        if (savedLocally) {
          setError("Não foi possível salvar seus dados online, mas salvamos localmente. O sistema tentará sincronizar quando você retornar ao aplicativo.");
          // Keep the dialog open so the user can see the message
          // But enable the Cancel button so they can dismiss it if they want
        } else {
          throw new Error("Falha ao salvar os dados localmente. Por favor, tente novamente ou copie seus dados para outro lugar.");
        }
      }
    } catch (error) {
      console.error("Error submitting prospect form:", error);
      setError(error instanceof Error ? error.message : "Falha ao enviar o formulário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
      if (submitStatus !== "saving-locally") {
        setSubmitStatus("idle");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if we're not in the middle of submitting
      if (!isSubmitting || submitStatus === "saving-locally") {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar Novo Prospecto" : "Editar Prospecto"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do prospecto abaixo
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto pr-4 max-h-[calc(80vh-10rem)]">
          {error && (
            <Alert variant={submitStatus === "saving-locally" ? "default" : "destructive"} className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Contato *</FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa Exemplo" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 91234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lead_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem do Lead</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma origem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ads">Anúncios</SelectItem>
                          <SelectItem value="Cold-call">Ligação Fria</SelectItem>
                          <SelectItem value="Referral">Indicação</SelectItem>
                          <SelectItem value="Website">Site</SelectItem>
                          <SelectItem value="Social Media">Mídia Social</SelectItem>
                          <SelectItem value="Other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Negócio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="Healthcare">Saúde</SelectItem>
                          <SelectItem value="Education">Educação</SelectItem>
                          <SelectItem value="Real Estate">Imobiliário</SelectItem>
                          <SelectItem value="Finance">Finanças</SelectItem>
                          <SelectItem value="Retail">Varejo</SelectItem>
                          <SelectItem value="Other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="region_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CT">Connecticut</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          {/* Add other states as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="p-0 h-auto font-normal text-primary dark:text-primary-foreground"
              >
                {isAdvancedOpen ? "Ocultar Opções Avançadas" : "Mostrar Opções Avançadas"}
              </Button>
              
              {isAdvancedOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pontuação (1-5)</FormLabel>
                        <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString() || "3"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Avalie a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Baixa</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3 - Média</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 - Alta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">Novo</SelectItem>
                            <SelectItem value="interested">Interessado</SelectItem>
                            <SelectItem value="negotiation">Negociação</SelectItem>
                            <SelectItem value="lost">Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="first_contact_at"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data do Primeiro Contato</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="next_follow_up_at"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Próximo Follow-up</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="call_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Resumo da Ligação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Resumo da ligação inicial..."
                            className="min-h-[80px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notas adicionais..."
                            className="min-h-[80px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting && submitStatus !== "saving-locally"}
          >
            {submitStatus === "saving-locally" ? "Fechar" : "Cancelar"}
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting
              ? submitStatus === "retrying" 
                ? `Tentar novamente ${retryCount}/${MAX_RETRIES}`
                : submitStatus === "saving-locally"
                ? "Salvo Localmente"
                : "Salvando..."
              : mode === "create"
              ? "Criar Prospecto"
              : "Atualizar Prospecto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectFormDialog; 