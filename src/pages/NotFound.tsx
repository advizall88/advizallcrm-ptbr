import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full shadow-neumorph p-8 bg-white rounded-lg">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="Advizall" className="h-16" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-2xl font-medium text-gray-700 mb-6">Página não encontrada</p>
        <p className="text-gray-500 mb-8">
          A página que você procura não existe ou você não tem permissão para visualizá-la.
        </p>
        <div className="flex flex-col space-y-2">
          <Link to="/">
            <Button variant="default" className="w-full">
              Voltar para o Painel
            </Button>
          </Link>
          <Link to="/prospects">
            <Button variant="outline" className="w-full">
              Ver Prospectos
            </Button>
          </Link>
          <Link to="/clients">
            <Button variant="outline" className="w-full">
              Ver Clientes
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-400">
        Advizall CRM • Precisa de ajuda? Contate support@advizall.com
      </div>
    </div>
  );
};

export default NotFound;
