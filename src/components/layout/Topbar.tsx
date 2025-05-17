import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn, processAvatarUrl } from "@/lib/utils";

// Navigation items shared with Sidebar
const navigationItems = [
  { name: "Painel", href: "/", icon: "📊" },
  { name: "Prospectos", href: "/prospects", icon: "🔍" },
  { name: "Clientes", href: "/clients", icon: "👥" },
  { name: "Reuniões", href: "/meetings", icon: "📅" },
  { name: "Configurações", href: "/settings", icon: "⚙️" },
];

const Topbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
      await signOut(navigate);
      // O redirecionamento para a página de login é feito no contexto de autenticação
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Handle navigation from mobile menu
  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    navigate(href);
  };
  
  return (
    <header className="bg-card dark:bg-gray-800 border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          {/* Mobile Menu Button - only visible on mobile */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center py-4">
                    <img src="/images/logo.png" alt="Advizall" className="h-8 mr-2" />
                    <span className="text-lg font-bold">
                      <span className="text-secondary">Advizall</span> <span className="text-foreground">CRM</span>
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start text-base"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Button>
                  ))}
                </nav>
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center p-4 border-t border-border">
                  <img src="/images/logo.png" alt="Advizall" className="h-6 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Desenvolvido por</p>
                    <p className="text-sm font-medium text-foreground">Advizall</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold text-foreground md:hidden">
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
                <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-white overflow-hidden">
                  {user?.avatar_url ? (
                    <img 
                      src={processAvatarUrl(user.avatar_url)} 
                      alt={user?.name || 'User avatar'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getUserInitials()
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || 'Minha Conta'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>Perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
