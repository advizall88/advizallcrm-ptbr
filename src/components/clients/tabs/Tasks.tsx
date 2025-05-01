import React, { useState } from 'react';
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
import { Project } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TasksProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

// Mock task data - in a real app this would come from props
const mockTasks = [
  {
    id: 't1',
    project_id: 'p1',
    title: 'Create wireframes',
    status: 'done',
    due_at: '2025-05-10T00:00:00Z',
    assignee_id: 'user1',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-15T00:00:00Z'
  },
  {
    id: 't2',
    project_id: 'p1',
    title: 'Design homepage',
    status: 'doing',
    due_at: '2025-05-20T00:00:00Z',
    assignee_id: 'user2',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-10T00:00:00Z'
  },
  {
    id: 't3',
    project_id: 'p1',
    title: 'Implement contact form',
    status: 'todo',
    due_at: '2025-05-25T00:00:00Z',
    assignee_id: 'user1',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z'
  }
];

const Tasks: React.FC<TasksProps> = ({
  open,
  onOpenChange,
  project
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState(mockTasks);

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

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: `t${Date.now()}`,
      project_id: project.id,
      title: newTaskTitle,
      status: 'todo',
      due_at: null,
      assignee_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updated_at: new Date().toISOString() } 
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tasks; 