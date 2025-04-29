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

// Usuário e senha de teste
const TEST_USER: User = {
  id: 'b391c27d-5f1f-4c93-9ef3-e3ce0880a8e2',
  name: 'Admin User',
  email: 'admin@advizall.com',
  role: 'admin',
  created_at: new Date().toISOString()
};

// Helpers para localStorage com tratamento de erros
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Erro ao acessar localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Erro ao remover do localStorage:', error);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para verificar autenticação
  const navigate = useNavigate();

  // Verificar se há usuário já autenticado no localStorage ao iniciar
  useEffect(() => {
    // Verificar se já temos um usuário armazenado
    const storedUser = safeLocalStorage.getItem('advizall_user');
    const storedSession = safeLocalStorage.getItem('advizall_session');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        if (storedSession) {
          setSession(JSON.parse(storedSession));
        }
      } catch (e) {
        console.warn('Erro ao parsear dados do localStorage:', e);
      }
    }
    
    setLoading(false);
  }, []);

  // Autenticação simplificada para desenvolvimento
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Para simplificar durante o desenvolvimento, aceitamos qualquer login com este email
      if (email === 'admin@advizall.com') {
        // Login simplificado sem Supabase
        setUser(TEST_USER);
        
        // Criar uma sessão simulada
        const mockSession = { 
          user: { id: TEST_USER.id },
          access_token: 'mock_token',
          refresh_token: 'mock_refresh_token',
          expires_at: Date.now() + 3600000
        } as any;
        
        setSession(mockSession);
        
        // Persistir no localStorage
        safeLocalStorage.setItem('advizall_user', JSON.stringify(TEST_USER));
        safeLocalStorage.setItem('advizall_session', JSON.stringify(mockSession));
        
        // Navegar para a página inicial
        setTimeout(() => {
          navigate('/');
        }, 500);
        
        setLoading(false);
        return { error: null, success: true };
      }
      
      // Tentar login real com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error, success: false };
      }

      if (data.user) {
        // Criar um usuário simulado
        const testUser: User = {
          id: data.user.id,
          name: 'Admin User',
          email: data.user.email || '',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        
        setUser(testUser);
        setSession(data.session);
        
        // Persistir no localStorage
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
      
      // Limpar dados locais
      setUser(null);
      setSession(null);
      
      // Remover do localStorage
      safeLocalStorage.removeItem('advizall_user');
      safeLocalStorage.removeItem('advizall_session');
      
      // Tentar logout do Supabase
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Erro ao deslogar do Supabase, ignorando...');
      }
      
      navigate('/login');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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