import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';

type User = {
  email: string;
  password?: string; // Stocké uniquement pour l'exemple (en réel, stockez juste le hash)
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem('@users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userFound = users.find((u: User) => u.email === email);
      
      if (!userFound) {
        return { success: false, message: 'Email non trouvé' };
      }

      const passwordMatch = await bcrypt.compare(password, userFound.password);
      if (!passwordMatch) {
        return { success: false, message: 'Mot de passe incorrect' };
      }

      const userToStore = { email: userFound.email };
      setUser(userToStore);
      await AsyncStorage.setItem('@currentUser', JSON.stringify(userToStore));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Validation simple
      if (password.length < 6) {
        return { success: false, message: 'Le mot de passe doit faire au moins 6 caractères' };
      }

      const storedUsers = await AsyncStorage.getItem('@users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      if (users.some((u: User) => u.email === email)) {
        return { success: false, message: 'Cet email est déjà utilisé' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { email, password: hashedPassword };
      
      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));
      
      const userToStore = { email };
      setUser(userToStore);
      await AsyncStorage.setItem('@currentUser', JSON.stringify(userToStore));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: "Échec de l'inscription" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('@currentUser');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}