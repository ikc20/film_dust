// src/theme/theme.ts
export interface Theme {
    mode: 'light' | 'dark';
    colors: {
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
    };
  }
  
  export const lightTheme: Theme = {
    mode: 'light',
    colors: {
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
    },
  };
  
  export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
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
    },
  };