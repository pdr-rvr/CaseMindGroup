// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import '../../styles/AuthForms.css';
import { loginUser } from '../../services/authService'; // Importar o serviço de login

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Adicionar estado de carregamento
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Limpar erros anteriores
    setLoading(true); // Ativar estado de carregamento

    console.log('Login attempt:', { email, password }); // Este log está correto

    try {
      // *** AQUI É ONDE A CHAMADA REAL AO BACKEND ACONTECE ***
      await loginUser(email, password); // Chama a função de serviço
      
      // Se a chamada acima for bem-sucedida, então podemos navegar e mostrar sucesso
      alert('Login realizado com sucesso!');
      navigate('/'); // Redireciona para a home page após o login bem-sucedido
    } catch (error: any) {
      // Se houver um erro na requisição (ou na rede), ele será capturado aqui
      setErrorMessage(error.message || 'Ocorreu um erro desconhecido.');
      console.error('Login error:', error);
    } finally {
      setLoading(false); // Desativar estado de carregamento, independentemente do resultado
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-card">
        <h2>Conectar</h2>
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
              disabled={loading} // Desabilita inputs enquanto carrega
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Link to="/forgot-password" className="forgot-password-link">
            Esqueceu a senha?
          </Link>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'} {/* Muda texto do botão */}
          </button>
        </form>
        <div className="auth-bottom-link">
          Novo usuário? <Link to="/register">Clique aqui</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;