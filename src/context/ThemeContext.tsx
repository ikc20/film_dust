// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  headerBackground: string;
  headerText: string;
  drawerBackground: string;
  drawerText: string;
  drawerActiveTint: string;
  drawerInactiveTint: string;
}

interface ThemeContextType {
  darkMode: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
}

const lightColors: ThemeColors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2c3e50',
  border: '#eee',
  notification: '#e74c3c',
  headerBackground: '#ffffff',
  headerText: '#000000',
  drawerBackground: '#ffffff',
  drawerText: '#333333',
  drawerActiveTint: '#e74c3c',
  drawerInactiveTint: '#333333',
};

const darkColors: ThemeColors = {
  primary: '#2980b9',
  secondary: '#27ae60',
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  border: '#333333',
  notification: '#c0392b',
  headerBackground: '#1e1e1e',
  headerText: '#ffffff',
  drawerBackground: '#121212',
  drawerText: '#ffffff',
  drawerActiveTint: '#e74c3c',
  drawerInactiveTint: '#aaaaaa',
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  colors: lightColors,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{
      darkMode,
      colors: darkMode ? darkColors : lightColors,
      toggleDarkMode,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);