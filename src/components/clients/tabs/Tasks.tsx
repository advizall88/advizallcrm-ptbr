import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Project, Task } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { taskService, TaskFormData } from '@/services/taskService';
import { useToast } from '@/components/ui/use-toast';

interface TasksProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const Tasks: React.FC<TasksProps> = ({
  open,
  onOpenChange,
  project
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar tarefas do projeto quando o modal for aberto
  useEffect(() => {
    if (open && project) {
      loadProjectTasks();
    }
  }, [open, project]);

  // Função para carregar as tarefas do projeto
  const loadProjectTasks = async () => {
    if (!project) return;
    
    setIsLoading(true);
    try {
      const projectTasks = await taskService.getProjectTasks(project.id);
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) return null;

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

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const taskData: TaskFormData = {
        title: newTaskTitle,
        status: 'todo',
        project_id: project.id,
      };
      
      const newTask = await taskService.createTask(taskData);
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      
      toast({
        title: "Success",
        description: "Task added successfully"
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      
      toast({
        title: "Success",
        description: "Task status updated"
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const projectTasks = tasks.filter(task => task.project_id === project.id);
  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const doingTasks = projectTasks.filter(task => task.status === 'doing');
  const doneTasks = projectTasks.filter(task => task.status === 'done');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Project Tasks: {project.description}
          </DialogTitle>
          <DialogDescription>
            Manage tasks for this project
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-1">
          {isLoading ? (
            <div className="flex justify-center py-8">Loading tasks...</div>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="new-task">New Task</Label>
                  <Input 
                    id="new-task" 
                    value={newTaskTitle} 
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                </div>
                <Button onClick={handleAddTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-800 flex items-center">
                      Todo
                      <Badge className="ml-2 bg-yellow-200 text-yellow-800">{todoTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {todoTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">No tasks</p>
                    ) : todoTasks.map(task => (
                      <div key={task.id} className="bg-card border rounded-md p-2 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            {task.due_at && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(task.due_at)}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleUpdateTaskStatus(task.id, 'doing')}
                            >
                              <Edit className="h-3 w-3" />
                              <span className="sr-only">Move to In Progress</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
                      In Progress
                      <Badge className="ml-2 bg-blue-200 text-blue-800">{doingTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {doingTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">No tasks</p>
                    ) : doingTasks.map(task => (
                      <div key={task.id} className="bg-card border rounded-md p-2 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            {task.due_at && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(task.due_at)}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleUpdateTaskStatus(task.id, 'done')}
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span className="sr-only">Move to Done</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-800 flex items-center">
                      Done
                      <Badge className="ml-2 bg-green-200 text-green-800">{doneTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {doneTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">No tasks</p>
                    ) : doneTasks.map(task => (
                      <div key={task.id} className="bg-card border rounded-md p-2 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            {task.due_at && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(task.due_at)}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tasks; 