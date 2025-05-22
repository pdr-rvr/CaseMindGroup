// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Supondo que sua interface UserInfo seja algo assim:
interface UserInfo {
  id: number;
  name: string;
  email: string;
  // Adicione outras propriedades do usuário que você precisa, como profilePictureUrl
  // profilePictureUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void; // <--- Certifique-se de que 'user' está aqui
  logout: () => void;
  getToken: () => string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Começa como true para verificar token

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Opcional: Validar o token com o backend aqui para garantir que não expirou
        // e buscar os dados mais recentes do usuário.
        try {
          const response = await fetch('http://localhost:3000/api/users/profile', { // Rota para buscar o perfil
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              // ... outras propriedades do usuário que o backend retorna
              // profilePictureUrl: userData.profilePictureUrl,
            });
          } else {
            // Token inválido ou expirado
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Erro ao verificar status de autenticação:', error);
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token: string, userInfo: UserInfo) => { // <--- userInfo recebido aqui
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(userInfo); // <--- ATUALIZA O ESTADO 'user'
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};