import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import '../../styles/AuthForms.css';
import { changePasswordWithEmail } from '../../services/authService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (newPassword !== confirmNewPassword) {
      setMessage('As senhas não coincidem!');
      setIsError(true);
      return;
    }

    try {
      const response = await changePasswordWithEmail(email, newPassword);
      setMessage(response.message || 'Sua senha foi alterada com sucesso! Você pode fazer login agora.');
      setIsError(false);
      setEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'Erro ao alterar a senha. Verifique seu e-mail ou tente novamente.');
      setIsError(true);
      console.error('Password change error:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-card">
        <h2>Esqueci a senha</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              placeholder="****"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmar nova senha</label>
            <input
              type="password"
              id="confirmNewPassword"
              placeholder="****"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className={isError ? "error-message" : "success-message"}>{message}</p>}
          <button type="submit" className="auth-button">Alterar</button>
        </form>
        <div className="auth-bottom-link">
          Já tem cadastro? <Link to="/login">Clique aqui</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;