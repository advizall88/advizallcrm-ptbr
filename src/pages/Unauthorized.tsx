import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Unauthorized = () => {
  const { forceDefaultTheme } = useTheme();
  
  // Forçar tema light para a página de não autorizado
  useEffect(() => {
    forceDefaultTheme();
  }, [forceDefaultTheme]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-red-700 sm:text-3xl">
          Acesso Não Autorizado
        </h1>
        
        <p className="text-base text-gray-600">
          Você não tem permissão para acessar esta página. 
          Por favor, verifique suas credenciais ou entre em contato com o administrador.
        </p>
        
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="bg-slate-800 hover:bg-slate-700">
            <Link to="/">Voltar ao Início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 