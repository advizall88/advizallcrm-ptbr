import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!user || !user.name) return "?";
    
    // Divide o nome em partes e pega a primeira letra de cada parte
    const parts = user.name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    // Se houver mais partes, pega a primeira letra da primeira e da última parte
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Função para lidar com o clique no Profile
  const handleProfileClick = () => {
    navigate('/settings');
  };
  
  // Função para lidar com o clique no Log out
  const handleLogoutClick = async () => {
    try {
      await signOut();
      // O redirecionamento para a página de login é feito no contexto de autenticação
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 md:hidden">
            <span className="text-secondary">Advizall</span> CRM
          </h1>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                size="icon"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-white">
                  {getUserInitials()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
