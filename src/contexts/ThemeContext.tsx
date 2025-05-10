import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  forceDefaultTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Verificar preferência salva no localStorage ou usar a preferência do sistema
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Verificar se há uma preferência salva
    const savedTheme = localStorage.getItem('advizall-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Caso contrário, usar a preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Aplicar o tema ao body quando o darkMode mudar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('advizall-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('advizall-theme', 'light');
    }
  }, [darkMode]);

  // Função para alternar entre os temas
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  // Função para forçar o tema light (uso em páginas de autenticação)
  const forceDefaultTheme = () => {
    document.documentElement.classList.remove('dark');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, forceDefaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 