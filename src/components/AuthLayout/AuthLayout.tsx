// src/components/AuthLayout/AuthLayout.tsx
import React from 'react';
import './AuthLayout.css'; // Vamos criar este CSS

interface AuthLayoutProps {
  children: React.ReactNode; // Para renderizar o conteúdo do formulário à direita
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout-container">
      <div className="auth-layout-left">
        <div className="auth-logo">
          M.
        </div>
        <div className="auth-slogan">
          Inovação ao Seu Alcance.
        </div>
      </div>
      <div className="auth-layout-right">
        {children} {/* Aqui é onde o formulário (Login, Register, Forgot Password) será renderizado */}
      </div>
    </div>
  );
};

export default AuthLayout;