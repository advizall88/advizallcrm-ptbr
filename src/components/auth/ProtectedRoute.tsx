import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  requiredRole?: 'user' | 'moderator' | 'admin';
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRole = 'user'
}) => {
  const { user, loading, isUserRole } = useAuth();
  const location = useLocation();

  // Log para debugging
  useEffect(() => {
    console.log('ProtectedRoute: Path =', location.pathname);
    console.log('ProtectedRoute: Loading =', loading);
    console.log('ProtectedRoute: User =', user ? 'Autenticado' : 'Não autenticado');
    console.log('ProtectedRoute: Role =', user?.role || 'N/A');
  }, [loading, user, location.pathname]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-700">Verificando autenticação...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('ProtectedRoute: Redirecionando para /login, usuário não autenticado');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (!isUserRole(requiredRole)) {
    console.log(`ProtectedRoute: Redirecionando para /unauthorized, usuário não tem a role ${requiredRole}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated and has proper role, render the children
  console.log('ProtectedRoute: Acesso permitido');
  return <Outlet />;
};

export default ProtectedRoute; 