import { supabase } from "@/lib/supabase";
import { Task } from "@/lib/supabase";

export interface TaskFormData {
  title: string;
  status: 'todo' | 'doing' | 'done';
  project_id: string;
  due_at?: string | null;
  assignee_id?: string | null;
  description?: string | null;
}

// Mock de tarefas para desenvolvimento
let mockTasks: Task[] = [];

export const taskService = {
  // Obter todas as tarefas para um projeto
  async getProjectTasks(projectId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      
      // Fallback para desenvolvimento local
      return mockTasks.filter(task => task.project_id === projectId);
    }
  },

  // Criar uma nova tarefa
  async createTask(data: TaskFormData): Promise<Task> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error('Usuário não autenticado');
      const newTask = {
        ...data,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdTask, error } = await supabase
        .from('tasks')
        .insert(newTask as any)
        .select()
        .single();

      if (error) throw error;
      return createdTask as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      
      // Fallback para desenvolvimento local
      const newTask = {
        id: `task_${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Task;
      
      mockTasks.push(newTask);
      return newTask;
    }
  },

  // Atualizar uma tarefa existente
  async updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedTask as Task;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      
      // Fallback para desenvolvimento local
      const taskIndex = mockTasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        const updatedTask = {
          ...mockTasks[taskIndex],
          ...data,
          updated_at: new Date().toISOString()
        } as Task;
        
        mockTasks[taskIndex] = updatedTask;
        return updatedTask;
      }
      throw error;
    }
  },

  // Excluir uma tarefa
  async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      
      // Fallback para desenvolvimento local
      mockTasks = mockTasks.filter(task => task.id !== id);
    }
  }
};

export default taskService; 