'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_password: string;
  user_cover: string;
  user_profile: string;
}

interface ClientContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLogedIn: boolean;
  setIsLogedIn: (logedIn: boolean) => void;
  logout: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogedIn, setIsLogedIn] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLogedIn(true);
         console.log('ClientContext - user cover:', user.user_cover);
        console.log('ClientContext - User loaded from sessionStorage:', user);
      } catch (error) {
        console.error('ClientContext - Error parsing stored user:', error);
      }
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setIsLogedIn(false);
    location.reload();
    sessionStorage.removeItem('currentUser');
  };

  return (
    <ClientContext.Provider value={{ currentUser, setCurrentUser, isLogedIn, setIsLogedIn, logout }}>
      {children}
    </ClientContext.Provider>
  );
};
