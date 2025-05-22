import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet  } from 'react-router-dom';
import HomePage from './pages/Home/Home'; // Sua HomePage
import ArticlesPage from './pages/ArticlesPage/ArticlesPage'; // A nova ArticlesPage
import ArticleDetailPage from './pages/ArticlesPage/ArticlesPage'; // Para a página de detalhes de um artigo
import Navbar from './components/Navbar/Navbar' // Seu componente de navegação
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas que NÃO devem ter a Navbar (Auth pages) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Grupo de rotas que DEVEM ter a Navbar e o <main> */}
        <Route
          element={
            <>
              <Navbar />
              <main>
                <Outlet /> {/* ESTE É O COMPONENTE CHAVE! Ele renderiza o conteúdo da rota filha */}
              </main>
            </>
          }
        >
          {/* Rotas filhas que serão renderizadas no <Outlet /> do Route pai */}
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          {/* Adicione outras rotas que precisam da Navbar aqui */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;