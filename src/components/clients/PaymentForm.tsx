import React, { useEffect, useState } from 'react';
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
  currency: z.string().default('BRL'),
  invoice_date: z.date(),
  paid: z.boolean().default(false),
  due_date: z.date().optional(),
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
          currency: initialData.currency || 'BRL',
          invoice_date: initialData.invoice_date ? new Date(initialData.invoice_date) : new Date(),
          paid: initialData.paid || false,
          due_date: initialData.due_date ? new Date(initialData.due_date) : undefined,
        }
      : {
          description: '',
          amount: 0,
          currency: 'BRL',
          invoice_date: new Date(),
          paid: false,
          due_date: undefined,
        },
  });

  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData.description || '',
        amount: initialData.amount || 0,
        currency: initialData.currency || 'BRL',
        invoice_date: initialData.invoice_date ? new Date(initialData.invoice_date) : new Date(),
        paid: initialData.paid || false,
        due_date: initialData.due_date ? new Date(initialData.due_date) : undefined,
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    if (open) {
      if (form.getValues('amount') !== undefined && form.getValues('amount') !== null && form.getValues('amount') !== 0) {
        setAmountInput(form.getValues('amount').toString().replace('.', ','));
      } else {
        setAmountInput('');
      }
    }
  }, [open]);

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
        due_date: values.due_date ? values.due_date.toISOString() : null,
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
                        type="text"
                        inputMode="decimal"
                        value={amountInput}
                        onChange={e => {
                          let value = e.target.value.replace(/[^\d,\.]/g, '');
                          if (value.includes(',')) {
                            const [int, dec] = value.split(',');
                            value = int + ',' + (dec ? dec.slice(0,2) : '');
                          }
                          let numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                          if (isNaN(numeric)) numeric = null;
                          if (numeric !== null && numeric > 500000) numeric = 500000;
                          setAmountInput(value);
                          field.onChange(numeric);
                        }}
                        onBlur={e => {
                          let value = e.target.value;
                          let numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                          if (!isNaN(numeric) && numeric !== null) {
                            setAmountInput(numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                          } else {
                            setAmountInput('');
                          }
                        }}
                        onFocus={e => {
                          if (form.getValues('amount') !== null && form.getValues('amount') !== undefined && form.getValues('amount') !== 0) {
                            setAmountInput(form.getValues('amount').toString().replace('.', ','));
                          } else {
                            setAmountInput('');
                          }
                        }}
                        maxLength={12}
                        placeholder="0,00"
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
                      <Input placeholder="BRL" {...field} />
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
                  <FormLabel>Data do Pagamento</FormLabel>
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

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Selecione a data de vencimento"
                      value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                      onChange={e => {
                        const value = e.target.value;
                        field.onChange(value ? new Date(value) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
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