import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useNavigate, NavigateFunction } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, navigate: NavigateFunction) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: (navigate: NavigateFunction) => Promise<void>;
  isUserRole: (role: 'user' | 'moderator' | 'admin') => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

// Para fins de desenvolvimento, o usuário padrão se logar falhar
const DEV_USER: User = {
  id: 'dev-user-id',
  name: 'Dev User',
  email: 'admin@advizall.com',
  role: 'admin',
  created_at: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Starts as true to check authentication

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Tentar obter a sessão do Supabase
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession) {
          // Se temos uma sessão, pegamos os dados do usuário
          setSession(supabaseSession);
          
          // Buscar dados completos do usuário do banco
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseSession.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
            // Fallback para o usuário da sessão
            setUser({
              id: supabaseSession.user.id,
              name: supabaseSession.user.email?.split('@')[0] || 'Unknown User',
              email: supabaseSession.user.email || '',
              role: 'user', // Default role
              created_at: new Date().toISOString()
            });
          } else {
            setUser(userData as User);
          }
        } else {
          // Sem sessão no Supabase, verificar o localStorage 
          const storedUser = safeLocalStorage.getItem('advizall_user');
          const storedSession = safeLocalStorage.getItem('advizall_session');
          
          if (storedUser && storedSession) {
            try {
              setUser(JSON.parse(storedUser));
              setSession(JSON.parse(storedSession));
            } catch (e) {
              console.warn('Error parsing stored auth data:', e);
              // Limpar dados inválidos
              safeLocalStorage.removeItem('advizall_user');
              safeLocalStorage.removeItem('advizall_session');
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setSession(session);
        
        if (session?.user) {
          // Buscar dados completos do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data on auth change:', userError);
            setUser({
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'Unknown User',
              email: session.user.email || '',
              role: 'user',
              created_at: new Date().toISOString()
            });
          } else {
            setUser(userData as User);
          }
          
          // Persistir no localStorage para backup
          safeLocalStorage.setItem('advizall_user', JSON.stringify(userData || {
            id: session.user.id,
            name: session.user.email?.split('@')[0] || 'Unknown User',
            email: session.user.email || '',
            role: 'user',
            created_at: new Date().toISOString()
          }));
          safeLocalStorage.setItem('advizall_session', JSON.stringify(session));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          safeLocalStorage.removeItem('advizall_user');
          safeLocalStorage.removeItem('advizall_session');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, navigate: NavigateFunction) => {
    try {
      setLoading(true);
      
      // Tenta fazer login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        // Fallback para ambiente de desenvolvimento
        if (process.env.NODE_ENV === 'development' && email === 'admin@advizall.com') {
          console.log('Using development fallback login');
          const mockSession = {
            user: { id: DEV_USER.id },
            access_token: 'dev-token',
            refresh_token: 'dev-refresh-token',
            expires_at: Date.now() + 3600000,
          } as any;
          
          setUser(DEV_USER);
          setSession(mockSession);
          
          safeLocalStorage.setItem('advizall_user', JSON.stringify(DEV_USER));
          safeLocalStorage.setItem('advizall_session', JSON.stringify(mockSession));
          
          setTimeout(() => {
            navigate('/');
          }, 500);
          
          setLoading(false);
          return { error: null, success: true };
        }
        
        setLoading(false);
        return { error, success: false };
      }

      if (data.user) {
        // Busca dados completos do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        let userToSet: User;
        
        if (userError) {
          console.error('Error fetching user data after login:', userError);
          
          // Se não encontrar o usuário no banco, cria um registro temporário
          userToSet = {
            id: data.user.id,
            name: data.user.email?.split('@')[0] || 'Unknown User',
            email: data.user.email || '',
            role: 'user', // Default role
            created_at: new Date().toISOString()
          };
          
          // Tenta criar o usuário no banco
          try {
            await supabase.from('users').insert(userToSet);
          } catch (insertError) {
            console.error('Error creating user record:', insertError);
          }
        } else {
          userToSet = userData as User;
        }
        
        setUser(userToSet);
        setSession(data.session);
        
        // Persiste no localStorage como backup
        safeLocalStorage.setItem('advizall_user', JSON.stringify(userToSet));
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

  const signOut = async (navigate: NavigateFunction) => {
    try {
      setLoading(true);
      
      // Limpa dados locais
      setUser(null);
      setSession(null);
      
      // Remove do localStorage
      safeLocalStorage.removeItem('advizall_user');
      safeLocalStorage.removeItem('advizall_session');
      
      // Logout do Supabase
      await supabase.auth.signOut();
      
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