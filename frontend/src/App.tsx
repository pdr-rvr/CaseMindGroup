import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/Home/Home';
import ArticlesPage from './pages/ArticlesPage/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage/ArticleDetailPage';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CreateArticlePage from './pages/CreateArticlePage/CreateArticlePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import MyArticlesPage from './pages/MyArticlesPage/MyArticlesPage';
import EditArticlePage from './pages/EditArticlePage/EditArticlePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Layout Principal com Navbar */}
        <Route
          element={
            <>
              <Navbar />
              <main className="main-content-layout">
                <Outlet />
              </main>
            </>
          }
        >
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-article" element={<CreateArticlePage />} />
            <Route path="/my-articles" element={<MyArticlesPage />} />
            <Route path="/edit-article/:id" element={<EditArticlePage />} />
            <Route path="/edit-profile/:id" element={<EditProfilePage />} />
            <Route path="/edit-profile/me" element={<EditProfilePage />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h1 style={{ fontSize: '3rem', color: '#0f172a' }}>404</h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Página não encontrada.</p>
              <a
                href="/"
                style={{
                  display: 'inline-block',
                  marginTop: '16px',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Voltar para o Início
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;