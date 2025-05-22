import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet  } from 'react-router-dom';
import HomePage from './pages/Home/Home'; // Sua HomePage
import ArticlesPage from './pages/ArticlesPage/ArticlesPage'; // A nova ArticlesPage
import ArticleDetailPage from './pages/ArticlesPage/ArticlesPage'; // Para a página de detalhes de um artigo
import Navbar from './components/Navbar/Navbar' // Seu componente de navegação
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CreateArticlePage from './pages/CreateArticlePage/CreateArticlePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas de Autenticação (SEM Navbar, SEM Proteção) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/*
          Layout Principal: Navbar + Main Content
          Todas as rotas dentro deste <Route> usarão a Navbar e o <main>
          A Navbar internamente decidirá o que exibir com base no estado de autenticação.
        */}
        <Route
          element={
            <>
              <Navbar />
              <main>
                <Outlet /> {/* Aqui as rotas filhas serão renderizadas */}
              </main>
            </>
          }
        >
          {/* Rotas PÚBLICAS que usam a Navbar (acessíveis a todos) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />

          {/*
            Rotas PROTEGIDAS que usam a Navbar
            Essas rotas são aninhadas dentro de um <ProtectedRoute> para garantir acesso.
            A ProtectedRoute redirecionará para /login se não estiver autenticado.
            A <Outlet> aqui renderiza as rotas filhas DO ProtectedRoute.
          */}
          <Route element={<ProtectedRoute />}>
            <Route path="/article/new" element={<CreateArticlePage />} />
            <Route path="/user/:id" element={<EditProfilePage />} />
            {/* Adicione outras rotas que precisam de autenticação aqui */}
          </Route>
        </Route>

        {/* Rota para 404 - Página Não Encontrada */}
        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default App;