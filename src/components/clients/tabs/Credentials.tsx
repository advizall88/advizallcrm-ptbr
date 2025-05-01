import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Credential } from '@/lib/supabase';
import { Eye, EyeOff, Edit, Trash, Plus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import CredentialForm from '../CredentialForm';
import { CredentialFormData } from '@/services/clientService';

interface CredentialsProps {
  client_id: string;
  credentials: Credential[];
  onAdd: () => void;
  onEdit: (credential: Credential) => void;
  onDelete: (credential: Credential) => void;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  selectedCredential: Credential | null;
  onSave: (data: CredentialFormData) => void;
  showPasswords: Record<string, boolean>;
  togglePasswordVisibility: (credentialId: string) => void;
}

const Credentials: React.FC<CredentialsProps> = ({
  client_id,
  credentials,
  onAdd,
  onEdit,
  onDelete,
  openForm,
  setOpenForm,
  selectedCredential,
  onSave,
  showPasswords,
  togglePasswordVisibility
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Access Credentials</CardTitle>
              <CardDescription>
                Store login information for client systems securely
              </CardDescription>
            </div>
            <Button onClick={onAdd} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Credentials
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No credentials have been added yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>System</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="capitalize">
                        {credential.system}
                      </Badge>
                    </TableCell>
                    <TableCell>{credential.login}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                          {showPasswords[credential.id] ? credential.password : '••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(credential.id)}
                          className="ml-2"
                        >
                          {showPasswords[credential.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {credential.notes || '-'}
                    </TableCell>
                    <TableCell>{formatDate(credential.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(credential)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(credential)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Credentials; 