import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Propriedades do componente de rota protegida (comentário em português)
type ProtectedRouteProps = {
  requiredRole?: 'user' | 'moderator' | 'admin';
};

/**
 * Componente de rota protegida que verifica autenticação e permissões
 * 
 * Este componente verifica:
 * 1. Se o usuário está autenticado
 * 2. Se o usuário possui a função/papel necessário para acessar a rota
 * 3. Redireciona para login ou página não autorizada conforme necessário
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRole = 'user'
}) => {
  // Obtém o estado de autenticação do contexto (comentário em português)
  const { user, loading, isUserRole } = useAuth();
  const location = useLocation();

  // Log detalhado para depuração de problemas de autenticação (comentário em português)
  useEffect(() => {
    console.log('------- ProtectedRoute -------');
    console.log('Caminho:', location.pathname);
    console.log('Estado de carregamento:', loading);
    console.log('Estado do usuário:', user ? `Autenticado (${user.email})` : 'Não autenticado');
    console.log('Função requerida:', requiredRole);
    console.log('Função do usuário:', user?.role || 'N/A');
    console.log('Tem permissão:', user ? isUserRole(requiredRole) : false);
    console.log('-----------------------------');
  }, [loading, user, location.pathname, requiredRole, isUserRole]);

  // Exibe indicador de carregamento enquanto verifica autenticação (comentário em português)
  if (loading) {
    console.log('ProtectedRoute: Exibindo indicador de carregamento');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-700">Verifying authentication...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login (comentário em português)
  if (!user) {
    console.log('ProtectedRoute: Redirecionando para /login, usuário não autenticado');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o usuário tem a função necessária (comentário em português)
  if (!isUserRole(requiredRole)) {
    console.log(`ProtectedRoute: Redirecionando para /unauthorized, usuário não tem a função ${requiredRole}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Se autenticado e com função adequada, renderiza os componentes filhos (comentário em português)
  console.log('ProtectedRoute: Acesso concedido');
  return <Outlet />;
};

export default ProtectedRoute; 