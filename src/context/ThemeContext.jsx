import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Forçando o tema 'dark' permanentemente para a estética minimalista
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    // Adicionamos cor de fundo diretamente no HTML para evitar flashes brancos
    root.style.backgroundColor = '#0a0a0a';
  }, []);

  // Dummy toggle para não quebrar componentes que ainda chamam
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
