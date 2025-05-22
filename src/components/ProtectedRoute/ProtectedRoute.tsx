// src/components/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importe o hook do AuthContext

interface ProtectedRouteProps {
  // role?: 'admin' | 'user'; // Exemplo para futuras validações de role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { isAuthenticated, loading } = useAuth(); // Pega o estado de autenticação do contexto

  if (loading) {
    // Pode mostrar um spinner ou tela de carregamento enquanto verifica o token
    return <div>Carregando autenticação...</div>;
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza as rotas filhas
  return <Outlet />;
};

export default ProtectedRoute;