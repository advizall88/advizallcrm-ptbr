import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  updateUserData: (userData: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const authCheckInProgress = useRef<boolean>(false);
  const authTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Verificar sessão ao carregar
  useEffect(() => {
    // Função para limpar timeout de segurança
    const clearAuthTimeout = () => {
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
        authTimeout.current = null;
      }
    };

    // Função para definir o timeout de segurança (limite máximo para verificação de autenticação)
    const setAuthTimeoutSafety = () => {
      clearAuthTimeout();
      authTimeout.current = setTimeout(() => {
        console.log('Auth check timed out - forcing completion');
        setLoading(false);
        authCheckInProgress.current = false;
      }, 3000); // 3 segundos é suficiente para timeout
    };

    const setupAuthListener = () => {
      // Configura um listener para mudanças na autenticação
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        // Limpar timeout atual quando o estado de auth mudar
        clearAuthTimeout();
        setSession(newSession);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          console.log('User signed out');
        } 
        else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession) {
          // Evitar chamadas duplicadas que podem ocorrer quando evento é disparado múltiplas vezes
          if (authCheckInProgress.current) {
            console.log('Auth check already in progress, skipping');
            return;
          }
          
          authCheckInProgress.current = true;
          setLoading(true);
          setAuthTimeoutSafety();

          try {
            // Fetch user data from database with timeout
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Database timeout')), 2000));
            
            const userFetch = supabase
              .from('users')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            // Race between fetch and timeout  
            const { data: userData, error: userError } = await Promise.race([
              userFetch, 
              timeoutPromise.then(() => ({ data: null, error: new Error('Timeout') }))
            ]) as any;
            
            if (userError || !userData) {
              console.log('User not found in database, creating new user record');
              
              // Create user in database if not exists
              const newUser = {
                id: newSession.user.id,
                email: newSession.user.email || '',
                name: newSession.user.user_metadata.name || newSession.user.email?.split('@')[0] || 'User',
                role: 'user', // Default role for new users
                created_at: new Date().toISOString(),
                avatar_url: '',
                phone: '',
                title: '',
                department: '',
                bio: '',
                last_login_at: new Date().toISOString(),
                last_active_at: new Date().toISOString()
              };
              
              // Insert the new user
              await supabase.from('users').insert(newUser);
              setUser(newUser as User);
            } else {
              console.log('User data fetched successfully');
              setUser(userData as User);
              
              // Update last login time - don't wait for this
              try {
                await supabase.from('users').update({
                  last_login_at: new Date().toISOString()
                }).eq('id', userData.id);
                console.log('Updated last login time');
              } catch (err) {
                console.error('Failed to update last login time:', err);
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            clearAuthTimeout();
            setLoading(false);
            authCheckInProgress.current = false;
          }
        }
      });
      
      // Initial session check
      const checkCurrentSession = async () => {
        // Evitar verificações duplicadas
        if (authCheckInProgress.current) {
          console.log('Initial auth check already in progress, skipping');
          return;
        }
        
        authCheckInProgress.current = true;
        setAuthTimeoutSafety();
        
        try {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          
          if (data.session) {
            // User is already logged in, fetch their data
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
            
            if (userData && !userError) {
              setUser(userData as User);
              
              // Update last active time - don't wait for this
              try {
                await supabase.from('users').update({
                  last_active_at: new Date().toISOString()
                }).eq('id', userData.id);
                console.log('Updated last active time');
              } catch (err) {
                console.error('Failed to update last active time:', err);
              }
            }
          } else {
            // Não há sessão ativa
            setUser(null);
          }
        } catch (error) {
          console.error('Error checking session:', error);
        } finally {
          clearAuthTimeout();
          setLoading(false);
          authCheckInProgress.current = false;
        }
      };
      
      checkCurrentSession();
      
      return () => {
        clearAuthTimeout();
        authListener.subscription.unsubscribe();
      };
    };
    
    return setupAuthListener();
  }, []);
  
  const signIn = async (email: string, password: string, navigate: NavigateFunction) => {
    console.log('Attempting to sign in with:', email);
    setLoading(true);
    
    try {
      // Usamos a opção session_config para não persistir sessões
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Definir sessão para não persistir manualmente
      try {
        await supabase.auth.setSession({
          access_token: data?.session?.access_token || '',
          refresh_token: data?.session?.refresh_token || ''
        });
      } catch (err) {
        console.log('Could not set session config, but login succeeded');
      }
      
      if (error) {
        console.error('Sign in error:', error.message);
        setLoading(false);
        return { error, success: false };
      }
      
      // The auth state listener will update the user data
      console.log('Sign in successful');
      return { error: null, success: true };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setLoading(false);
      return { error: error as Error, success: false };
    }
  };
  
  const signOut = async (navigate: NavigateFunction) => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setSession(null);
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
  
  const updateUserData = (userData: User) => {
    // Update the user state with the new data
    setUser(userData);
  };
  
  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isUserRole,
    updateUserData,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
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