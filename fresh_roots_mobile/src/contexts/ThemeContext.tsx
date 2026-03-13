import React, {createContext, useContext, useEffect, useState} from 'react';
import {ThemeMode, setThemeMode, getThemeMode} from '../theme';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider
 * - Holds app theme state (light/dark)
 * - Updates shared theme colors when toggled
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [mode, setModeState] = useState<ThemeMode>(getThemeMode());

  useEffect(() => {
    setThemeMode(mode);
  }, [mode]);

  const toggleMode = () => {
    setModeState(current => {
      const next = current === 'light' ? 'dark' : 'light';
      setThemeMode(next);
      return next;
    });
  };

  const setMode = (nextMode: ThemeMode) => {
    setThemeMode(nextMode);
    setModeState(nextMode);
  };

  return (
    <ThemeContext.Provider value={{mode, toggleMode, setMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

