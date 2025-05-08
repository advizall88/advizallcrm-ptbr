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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/supabase';
import { ProjectFormData } from '@/services/clientService';

const formSchema = z.object({
  service: z.enum(['website', 'paid_ads', 'organic', 'branding', 'ops']),
  status: z.enum(['todo', 'doing', 'done']),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  deadline: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  clientId: string;
  initialData?: Project;
  mode?: 'create' | 'edit';
}

const ProjectForm: React.FC<ProjectFormProps> = ({
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
          service: initialData.service,
          status: initialData.status,
          description: initialData.description || '',
          deadline: initialData.deadline ? new Date(initialData.deadline) : undefined,
        }
      : {
          service: 'website',
          status: 'todo',
          description: '',
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        service: initialData.service,
        status: initialData.status,
        description: initialData.description || '',
        deadline: initialData.deadline ? new Date(initialData.deadline) : undefined,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const formattedData: ProjectFormData = {
        client_id: clientId,
        service: values.service,
        status: values.status,
        description: values.description,
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };

      await onSubmit(formattedData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting project form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Project' : 'Edit Project'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="website">Website Development</SelectItem>
                      <SelectItem value="paid_ads">Paid Advertising</SelectItem>
                      <SelectItem value="organic">Organic Marketing</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="ops">Business Operations</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="doing">In Progress</SelectItem>
                      <SelectItem value="done">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline (Optional)</FormLabel>
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
                            <span>Pick a date</span>
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
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {mode === 'create' ? 'Create Project' : 'Update Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm; 