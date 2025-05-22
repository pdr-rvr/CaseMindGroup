// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import '../../styles/AuthForms.css'; // Mantenha a importação do CSS comum
import { useAuth } from '../../context/AuthContext'; // Importe o useAuth

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Adicionado estado de carregamento
  const [error, setError] = useState<string | null>(null); // Adicionado estado de erro
  const navigate = useNavigate();
  const { login } = useAuth(); // Pega a função de login do contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Inicia o carregamento
    setError(null); // Limpa erros anteriores

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', { // <--- Confirme esta URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Assume que o backend envia { message: "..." } em caso de erro
        throw new Error(errorData.message || 'Falha no login. Credenciais inválidas.');
      }

      const data = await response.json();
      // O backend DEVE retornar { token: "...", user: { id: ..., name: ..., email: ... } }
      // Se seu backend retorna um formato diferente, ajuste data.user para o objeto correto.
      login(data.token, data.user); // <--- PASSA O user OBJECT AQUI PARA O CONTEXTO
      navigate('/'); // Redireciona para a página inicial após o login bem-sucedido
    } catch (err: any) {
      console.error('Erro de login:', err);
      setError(err.message || 'Ocorreu um erro desconhecido durante o login.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-card">
        <h2>Conectar</h2>
        {error && <div className="error-message">{error}</div>} {/* Exibe mensagens de erro */}
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
              disabled={loading}
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
          <Link to="/forgot-password" className="forgot-password-link">
            Esqueceu a senha?
          </Link>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'} {/* Texto do botão dinâmico */}
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