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

// In-memory fallback storage when localStorage is unavailable
const memoryStorage: Record<string, string> = {};

// Helpers for localStorage with error handling and fallback to in-memory storage
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      // First try localStorage
      const value = localStorage.getItem(key);
      if (value !== null) return value;
      
      // Fallback to memory storage
      return memoryStorage[key] || null;
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      // Fallback to memory storage
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      // Always store in memory
      memoryStorage[key] = value;
      
      // Try to store in localStorage
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
      // Already saved to memory storage
    }
  },
  removeItem: (key: string): void => {
    try {
      // Remove from both storages
      delete memoryStorage[key];
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      // Already removed from memory storage
    }
  },
  clearAll: () => {
    // Limpar todos os dados de autenticação
    try {
      localStorage.removeItem('advizall_user');
      localStorage.removeItem('advizall_session');
      delete memoryStorage['advizall_user'];
      delete memoryStorage['advizall_session'];
    } catch (error) {
      console.warn('Error clearing storage data:', error);
    }
  }
};

// Helper para criar um objeto de usuário padrão
const createDefaultUser = (
  id: string,
  name: string,
  email: string,
  role: string = 'user'
): User => ({
  id,
  name,
  email,
  role,
  created_at: new Date().toISOString(),
  avatar_url: '',
  phone: '',
  title: '',
  department: '',
  bio: '',
  last_login_at: new Date().toISOString(),
  last_active_at: new Date().toISOString()
});

// Para fins de desenvolvimento, o usuário padrão se logar falhar
const DEV_USER: User = createDefaultUser(
  'dev-user-id',
  'Dev User',
  'admin@advizall.com',
  'admin'
);

// Limpar todos os dados de autenticação ao carregar este arquivo
// Isso forçará um novo login em caso de problemas com autenticação
safeStorage.clearAll();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para verificar autenticação
  
  // Verificar sessão ao carregar
  useEffect(() => {
    // Tempo máximo para verificação de autenticação (10 segundos)
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Verificação de autenticação excedeu o tempo limite (10s) - forçando conclusão');
        setLoading(false);
      }
    }, 10000);
    
    const checkSession = async () => {
      try {
        console.log('Iniciando verificação de sessão...');
        
        // Tenta obter a sessão atual do Supabase
        const { data } = await supabase.auth.getSession();
        const supabaseSession = data.session;
        
        if (supabaseSession) {
          console.log('Sessão encontrada no Supabase');
          setSession(supabaseSession);
          
          // Busca dados do usuário
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', supabaseSession.user.id)
              .single();
            
            if (userError) {
              throw userError;
            }
            
            // Define o usuário e armazena localmente
            setUser(userData as User);
            safeStorage.setItem('advizall_user', JSON.stringify(userData));
            safeStorage.setItem('advizall_session', JSON.stringify(supabaseSession));
            console.log('Dados do usuário carregados com sucesso');
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            
            // Cria um usuário padrão baseado nos dados da sessão
            const fallbackUser = createDefaultUser(
              supabaseSession.user.id,
              supabaseSession.user.email?.split('@')[0] || 'Unknown User',
              supabaseSession.user.email || '',
              'user' // Papel padrão
            );
            
            setUser(fallbackUser);
            safeStorage.setItem('advizall_user', JSON.stringify(fallbackUser));
            safeStorage.setItem('advizall_session', JSON.stringify(supabaseSession));
          }
        } else {
          // Tenta recuperar de armazenamento local como último recurso
          const storedUser = safeStorage.getItem('advizall_user');
          const storedSession = safeStorage.getItem('advizall_session');
          
          if (storedUser && storedSession) {
            console.log('Sessão não encontrada no Supabase, usando dados armazenados localmente');
            try {
              setUser(JSON.parse(storedUser));
              setSession(JSON.parse(storedSession));
            } catch (e) {
              console.warn('Erro ao analisar dados armazenados:', e);
              setUser(null);
              setSession(null);
              safeStorage.removeItem('advizall_user');
              safeStorage.removeItem('advizall_session');
            }
          } else {
            console.log('Nenhuma sessão encontrada');
            setUser(null);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };
    
    checkSession();
    
    // Configura um listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Estado de autenticação alterado:', event);
      
      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        // O usuário será carregado na próxima re-execução do useEffect
      } 
      else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        safeStorage.removeItem('advizall_user');
        safeStorage.removeItem('advizall_session');
      }
    });
    
    return () => {
      clearTimeout(safetyTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []); // Sem dependências para evitar loops
  
  // Efeito para carregar dados do usuário quando a sessão muda
  useEffect(() => {
    const loadUserData = async () => {
      if (session && !user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            throw userError;
          }
          
          setUser(userData as User);
          safeStorage.setItem('advizall_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Erro ao carregar dados do usuário após mudança de sessão:', error);
          
          // Criar usuário padrão se não for possível carregar do banco
          const fallbackUser = createDefaultUser(
            session.user.id,
            session.user.email?.split('@')[0] || 'Unknown User',
            session.user.email || '',
            'user'
          );
          
          setUser(fallbackUser);
          safeStorage.setItem('advizall_user', JSON.stringify(fallbackUser));
        }
      }
    };
    
    loadUserData();
  }, [session, user]);

  const signIn = async (email: string, password: string, navigate: NavigateFunction) => {
    console.log('Tentando fazer login com:', email);
    try {
      setLoading(true);
      
      // Limpa dados existentes
      safeStorage.removeItem('advizall_user');
      safeStorage.removeItem('advizall_session');
      
      // Tenta fazer login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de login Supabase:', error);
        
        // Apenas para ambiente de desenvolvimento - login alternativo
        if (import.meta.env.DEV && email === 'admin@advizall.com') {
          console.log('Usando login alternativo de desenvolvimento');
          const mockSession = {
            user: { id: DEV_USER.id, email: DEV_USER.email },
            access_token: 'dev-token',
            refresh_token: 'dev-refresh-token',
            expires_at: Date.now() + 3600000,
          } as unknown as Session;
          
          setUser(DEV_USER);
          setSession(mockSession);
          
          safeStorage.setItem('advizall_user', JSON.stringify(DEV_USER));
          safeStorage.setItem('advizall_session', JSON.stringify(mockSession));
          
          setLoading(false);
          // Não navegue aqui - deixe o useEffect do Login fazer isso
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
          console.error('Erro ao buscar dados do usuário após login:', userError);
          
          // Se não encontrar o usuário no banco, cria um registro temporário
          userToSet = createDefaultUser(
            data.user.id,
            data.user.email?.split('@')[0] || 'Unknown User',
            data.user.email || '',
            'user'
          );
          
          // Tenta criar o usuário no banco
          try {
            await supabase.from('users').insert(userToSet);
          } catch (insertError) {
            console.error('Erro ao criar registro de usuário:', insertError);
          }
        } else {
          userToSet = userData as User;
        }
        
        setUser(userToSet);
        setSession(data.session);
        
        // Persiste no armazenamento como backup
        safeStorage.setItem('advizall_user', JSON.stringify(userToSet));
        safeStorage.setItem('advizall_session', JSON.stringify(data.session));
        
        // Não navegue aqui - deixe o useEffect do Login fazer isso
      }

      setLoading(false);
      return { error: null, success: true };
    } catch (error) {
      console.error('Erro inesperado durante login:', error);
      setLoading(false);
      return { error: error as Error, success: false };
    }
  };

  const signOut = async (navigate: NavigateFunction) => {
    console.log('Iniciando processo de logout');
    try {
      setLoading(true);
      
      // Limpa dados locais
      setUser(null);
      setSession(null);
      
      // Remove do armazenamento
      safeStorage.removeItem('advizall_user');
      safeStorage.removeItem('advizall_session');
      
      // Logout do Supabase
      await supabase.auth.signOut();
      
      navigate('/login');
      setLoading(false);
    } catch (error) {
      console.error('Erro durante logout:', error);
      setLoading(false);
      
      // Se houver erro, ainda assim limpe tudo e redirecione
      setUser(null);
      setSession(null);
      safeStorage.removeItem('advizall_user');
      safeStorage.removeItem('advizall_session');
      navigate('/login');
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

  // Valor para o contexto
  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isUserRole,
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