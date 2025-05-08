import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Prospects from "./pages/Prospects";
import Clients from "./pages/Clients";
import Meetings from "./pages/Meetings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import { useEffect } from "react";

// Configuração do cliente de consulta para gerenciar o estado global de dados
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuração padrão para consultas - se necessário ajustar no futuro
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

/**
 * Componente principal da aplicação
 * 
 * Estrutura:
 * - Provedores de contexto (Query, Auth, Tooltip) para funcionalidades globais
 * - Sistema de notificações com dois tipos de toasts
 * - Roteamento com rotas públicas e protegidas
 * - Proteção de rotas baseada em funções de usuário
 */
const App = () => {
  // Log de inicialização do aplicativo
  useEffect(() => {
    console.log("Aplicativo AdvizallCRM inicializado");
    return () => {
      console.log("Aplicativo AdvizallCRM desmontado");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Sistemas de notificação toast */}
        <Toaster />
        <Sonner />
        
        {/* Roteamento com BrowserRouter */}
        <BrowserRouter>
          {/* Contexto de autenticação */}
          <AuthProvider>
            <Routes>
              {/* Rotas públicas - acessíveis sem autenticação */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Rotas protegidas para todos os usuários autenticados */}
              <Route element={<ProtectedRoute requiredRole="user" />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/prospects" element={<Prospects />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Rotas protegidas para moderadores e admins */}
              <Route element={<ProtectedRoute requiredRole="moderator" />}>
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<Clients />} />
                {/* Rotas adicionais apenas para moderadores podem ser adicionadas aqui */}
              </Route>
              
              {/* Rotas protegidas apenas para admins */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                {/* Rotas apenas para admin serão adicionadas aqui */}
              </Route>
              
              {/* Rota 404 para páginas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
