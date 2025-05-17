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
import { Project } from '@/lib/supabase';
import { Edit, Trash, Plus, List, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { ProjectFormData } from '@/services/clientService';

interface ProjectsProps {
  client: any;
  projects: Project[];
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewTasks: (project: Project) => void;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  selectedProject: Project | null;
  onSave: (data: ProjectFormData) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  client,
  projects,
  onAdd,
  onEdit,
  onDelete,
  onViewTasks,
  openForm,
  setOpenForm,
  selectedProject,
  onSave
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Todo</Badge>;
      case 'doing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'done':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Done</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceBadge = (service: string) => {
    switch (service) {
      case 'website':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">Website</Badge>;
      case 'paid_ads':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Paid Ads</Badge>;
      case 'organic':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Organic</Badge>;
      case 'branding':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">Branding</Badge>;
      case 'ops':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Operations</Badge>;
      default:
        return <Badge variant="secondary">{service}</Badge>;
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Projetos do Cliente</CardTitle>
              <CardDescription>
                Gerencie todos os projetos para {client?.company_name || client?.contact_name}
              </CardDescription>
            </div>
            <Button onClick={onAdd} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Projeto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum projeto foi adicionado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      {getServiceBadge(project.service)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {project.description}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(project.status)}
                    </TableCell>
                    <TableCell>
                      {project.deadline ? (
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          {formatDate(project.deadline)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sem prazo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewTasks(project)}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(project)}
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

export default Projects; 