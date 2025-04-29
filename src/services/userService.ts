import { supabase, User } from '@/lib/supabase';

export type UserFormData = Omit<User, 'id' | 'created_at'>;

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data as User[];
  },

  async getUser(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
    
    return data as User;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw error;
    }
    
    return data as User | null;
  },

  async createUser(userData: UserFormData): Promise<User> {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: 'temp-password-123', // This should be generated and sent to the user
      email_confirm: true,
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }
    
    // Then create the user record
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      // Try to clean up the auth user if the database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
    
    return data as User;
  },

  async updateUser(id: string, updates: Partial<UserFormData>): Promise<User> {
    // Do not allow changing the email through this method
    // Email changes should be handled through the auth API
    const { email, ...safeUpdates } = updates;
    
    const { data, error } = await supabase
      .from('users')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
    
    return data as User;
  },

  async deleteUser(id: string): Promise<void> {
    // First delete the user record
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error(`Error deleting user ${id} from database:`, dbError);
      throw dbError;
    }
    
    // Then delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    
    if (authError) {
      console.error(`Error deleting auth user ${id}:`, authError);
      throw authError;
    }
  },
  
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error(`Error resetting password for ${email}:`, error);
      throw error;
    }
  },
  
  async changeRole(id: string, role: User['role']): Promise<User> {
    return this.updateUser(id, { role });
  }
}; 