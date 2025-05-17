import React from 'react';
import AppLayout from './AppLayout';

const MobileMenuDemo = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mobile Menu Demo</h1>
        <p className="text-gray-600">
          Este é um exemplo de menu de navegação para dispositivos móveis.
        </p>
        <p className="text-gray-600">
          Redimensione a tela para um formato móvel ou use a emulação de dispositivo 
          do seu navegador para ver o menu hamburger no canto superior esquerdo.
        </p>
        <div className="p-4 bg-secondary/10 rounded-md border border-secondary/20">
          <h2 className="font-medium text-secondary">Instruções</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Em telas móveis, um botão de menu aparece no canto superior esquerdo</li>
            <li>Clique no botão de menu para abrir o menu de navegação</li>
            <li>Selecione qualquer item de menu para navegar</li>
            <li>O menu se fecha automaticamente após a seleção</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default MobileMenuDemo; 