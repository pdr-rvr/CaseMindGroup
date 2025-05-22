import React from 'react';
import './AuthLayout.css'; 

interface AuthLayoutProps {
  children: React.ReactNode; 
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
        {children} 
      </div>
    </div>
  );
};

export default AuthLayout;