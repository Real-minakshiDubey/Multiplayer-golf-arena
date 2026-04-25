import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#00FFCC', '#FF0055'] },
  { id: 'neon-night', name: 'Neon Night', colors: ['#FF00FF', '#00FFFF'] },
  { id: 'midnight-blue', name: 'Midnight Blue', colors: ['#38BDF8', '#818CF8'] },
  { id: 'gold-edition', name: 'Gold Edition', colors: ['#FDE047', '#F97316'] }
];

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('arena-theme') || 'cyberpunk');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('arena-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
