import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Payment } from '@/lib/supabase';
import { PaymentFormData } from '@/services/clientService';

const formSchema = z.object({
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  amount: z.coerce.number().min(1, 'Valor deve ser maior que 0'),
  currency: z.string().default('USD'),
  invoice_date: z.date(),
  paid: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  clientId: string;
  initialData?: Payment;
  mode?: 'create' | 'edit';
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  clientId,
  initialData,
  mode = 'create',
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          description: initialData.description || '',
          amount: initialData.amount || 0,
          currency: initialData.currency || 'USD',
          invoice_date: initialData.invoice_date ? new Date(initialData.invoice_date) : new Date(),
          paid: initialData.paid || false,
        }
      : {
          description: '',
          amount: 0,
          currency: 'USD',
          invoice_date: new Date(),
          paid: false,
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData.description || '',
        amount: initialData.amount || 0,
        currency: initialData.currency || 'USD',
        invoice_date: initialData.invoice_date ? new Date(initialData.invoice_date) : new Date(),
        paid: initialData.paid || false,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const formattedData: PaymentFormData = {
        client_id: clientId,
        description: values.description,
        amount: values.amount,
        currency: values.currency,
        invoice_date: values.invoice_date.toISOString(),
        paid: values.paid,
        paid_at: values.paid ? new Date().toISOString() : null,
      };

      await onSubmit(formattedData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting payment form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Nova Pagamento' : 'Editar Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Taxa Mensal - Julho 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value || '0'))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <FormControl>
                      <Input placeholder="USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="invoice_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Fatura</FormLabel>
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
                            <span>Selecione uma data</span>
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
              name="paid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Pagamento Recebido
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque isso se o pagamento já foi recebido
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {mode === 'create' ? 'Adicionar Pagamento' : 'Atualizar Pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm; 