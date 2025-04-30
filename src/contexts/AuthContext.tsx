import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  isUserRole: (role: 'user' | 'moderator' | 'admin') => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test user and password
const TEST_USER: User = {
  id: 'b391c27d-5f1f-4c93-9ef3-e3ce0880a8e2',
  name: 'Admin User',
  email: 'admin@advizall.com',
  role: 'admin',
  created_at: new Date().toISOString()
};

// Helpers for localStorage with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Starts as true to check authentication
  const navigate = useNavigate();

  // Check if there's already an authenticated user in localStorage at startup
  useEffect(() => {
    // Check if we already have a stored user
    const storedUser = safeLocalStorage.getItem('advizall_user');
    const storedSession = safeLocalStorage.getItem('advizall_session');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        if (storedSession) {
          setSession(JSON.parse(storedSession));
        }
      } catch (e) {
        console.warn('Error parsing data from localStorage:', e);
      }
    }
    
    setLoading(false);
  }, []);

  // Simplified authentication for development
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // To simplify during development, we accept any login with this email
      if (email === 'admin@advizall.com') {
        // Simplified login without Supabase
        setUser(TEST_USER);
        
        // Create a simulated session
        const mockSession = { 
          user: { id: TEST_USER.id },
          access_token: 'mock_token',
          refresh_token: 'mock_refresh_token',
          expires_at: Date.now() + 3600000
        } as any;
        
        setSession(mockSession);
        
        // Persist in localStorage
        safeLocalStorage.setItem('advizall_user', JSON.stringify(TEST_USER));
        safeLocalStorage.setItem('advizall_session', JSON.stringify(mockSession));
        
        // Navigate to the home page
        setTimeout(() => {
          navigate('/');
        }, 500);
        
        setLoading(false);
        return { error: null, success: true };
      }
      
      // Try real login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error, success: false };
      }

      if (data.user) {
        // Create a simulated user
        const testUser: User = {
          id: data.user.id,
          name: 'Admin User',
          email: data.user.email || '',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        
        setUser(testUser);
        setSession(data.session);
        
        // Persist in localStorage
        safeLocalStorage.setItem('advizall_user', JSON.stringify(testUser));
        safeLocalStorage.setItem('advizall_session', JSON.stringify(data.session));
        
        navigate('/');
      }

      setLoading(false);
      return { error: null, success: true };
    } catch (error) {
      setLoading(false);
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear local data
      setUser(null);
      setSession(null);
      
      // Remove from localStorage
      safeLocalStorage.removeItem('advizall_user');
      safeLocalStorage.removeItem('advizall_session');
      
      // Try to logout from Supabase
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Error logging out from Supabase, ignoring...');
      }
      
      navigate('/login');
      setLoading(false);
    } catch (error) {
      console.error('Error during logout:', error);
      setLoading(false);
    }
  };

  const isUserRole = (role: 'user' | 'moderator' | 'admin') => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // Moderator has access to moderator and user roles
    if (user.role === 'moderator' && (role === 'moderator' || role === 'user')) return true;
    
    // User only has access to user role
    if (user.role === 'user' && role === 'user') return true;
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        isUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 