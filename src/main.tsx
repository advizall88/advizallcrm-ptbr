import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  console.log("Iniciando renderização da aplicação");
  const root = document.getElementById("root");
  
  if (!root) {
    console.error("Elemento root não encontrado no DOM");
  } else {
    createRoot(root).render(<App />);
    console.log("Aplicação renderizada com sucesso");
  }
} catch (error) {
  console.error("Erro ao renderizar a aplicação:", error);
  
  // Exibe o erro na tela para facilitar o debugging
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: red; margin: 20px; font-family: sans-serif;">
        <h1>Erro na Renderização</h1>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
        <pre>${error instanceof Error && error.stack ? error.stack : ''}</pre>
      </div>
    `;
  }
}
