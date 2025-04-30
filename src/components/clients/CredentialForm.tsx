import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { Credential } from '@/lib/supabase';
import { CredentialFormData } from '@/services/clientService';

const formSchema = z.object({
  system: z.enum(['hosting', 'domain', 'facebook', 'instagram', 'other']),
  login: z.string().min(3, 'Login must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  notes: z.string().optional(),
  visible_to: z.enum(['moderator', 'admin']),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CredentialFormData) => Promise<void>;
  clientId: string;
  initialData?: Credential;
  mode?: 'create' | 'edit';
}

const CredentialForm: React.FC<CredentialFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  clientId,
  initialData,
  mode = 'create',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          system: initialData.system,
          login: initialData.login,
          password: initialData.password,
          notes: initialData.notes || '',
          visible_to: initialData.visible_to,
        }
      : {
          system: 'hosting',
          login: '',
          password: '',
          notes: '',
          visible_to: 'moderator',
        },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const formattedData: CredentialFormData = {
        client_id: clientId,
        system: values.system,
        login: values.login,
        password: values.password,
        notes: values.notes || '',
        visible_to: values.visible_to,
      };

      await onSubmit(formattedData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting credential form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Credential' : 'Edit Credential'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="system"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hosting">Hosting</SelectItem>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Login / Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <div className="flex w-full items-center">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="password"
                          {...field}
                          className="rounded-r-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-l-none"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about this credential..."
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visible_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moderator">Moderator & Admin</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {mode === 'create' ? 'Create Credential' : 'Update Credential'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialForm; 