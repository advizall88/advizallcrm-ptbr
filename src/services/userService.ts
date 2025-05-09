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
    // This approach uses Supabase's sign-up method which doesn't require admin privileges
    // Instead of using the admin.createUser method, we'll use the standard sign-up
    // and then add the user to our public.users table
    
    // Generate a random password (this will be reset by the user)
    const tempPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: tempPassword,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        }
      }
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error('User creation failed: No user returned from auth API');
    }
    
    // Check if the user already exists in our public.users table
    // If not, we'll create a record for them
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', authData.user.id)
      .maybeSingle();
    
    if (!existingUser) {
      // Create the user record in our public.users table
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
        console.error('Error creating user in database:', error);
        throw error;
      }
      
      return data as User;
    }
    
    // If user already exists in public.users, fetch and return that record
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching newly created user:', error);
      throw error;
    }
    
    // Send password reset email so user can set their own password
    await this.resetPassword(userData.email);
    
    return user as User;
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
    // In Supabase, deleting a user from auth.users will also delete 
    // the corresponding record in public.users via RLS cascading delete
    // But since we don't have admin rights to delete from auth directly,
    // we'll use a serverless function or just mark the user as inactive
    
    try {
      // For now, we'll just delete from public.users
      // In a production environment, you would implement a server-side function
      // that has the proper admin rights to delete from auth.users
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        console.error(`Error deleting user ${id} from database:`, dbError);
        throw dbError;
      }
      
      // Note: Since we can't delete the auth user without admin privileges,
      // the best we can do here is to inform the user of this limitation
      console.warn(
        `User deleted from public.users but not from auth.users. ` +
        `In a production environment, you would need to implement a server-side ` +
        `function with admin privileges to fully delete the user.`
      );
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
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