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
        {/*
          Grupo 1: Rotas de Autenticação
          Estas rotas são acessíveis a qualquer momento e NÃO exibirão a Navbar.
          Elas são renderizadas diretamente.
        */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/*
          Grupo 2: Layout Principal com Navbar
          Este é um Route pai que define um layout comum (Navbar + <main> com <Outlet>).
          Todas as rotas FILHAS definidas DENTRO deste Route usarão este layout.
          A Navbar, por sua vez, internamente usa o `useAuth()` para decidir
          se exibe links de "logado" (Publicar, Perfil) ou "deslogado" (Entrar, Registrar).
        */}
        <Route
          element={
            <>
              <Navbar /> {/* A Navbar é renderizada aqui */}
              <main>
                <Outlet /> {/* Onde o conteúdo da rota filha será renderizado */}
              </main>
            </>
          }
        >
          {/*
            Subgrupo 2.1: Rotas PÚBLICAS que usam o Layout da Navbar
            Estas rotas são acessíveis a QUALQUER usuário (logado ou deslogado).
            Elas serão renderizadas dentro do <Outlet> do layout principal.
          */}
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />

          {/*
            Subgrupo 2.2: Rotas PROTEGIDAS que usam o Layout da Navbar
            Este é um Route aninhado dentro do layout principal.
            Ele usa o <ProtectedRoute> como seu `element`.
            O <ProtectedRoute> verifica se o usuário está autenticado e, se não estiver,
            redireciona para a página de login. Se estiver, ele renderiza seu próprio <Outlet>.
            As rotas filhas deste <ProtectedRoute> serão renderizadas dentro do <Outlet> dele.
          */}
          <Route element={<ProtectedRoute />}>
            {/* Rotas que exigem autenticação */}
            <Route path="/create-article" element={<CreateArticlePage />} />
            <Route path="/edit-profile/:id" element={<EditProfilePage />} />
            {/* Adicione outras rotas que precisam de autenticação aqui */}
          </Route>
        </Route>

        {/*
          Rota de Fallback para 404 - Página Não Encontrada
          Esta rota captura qualquer URL que não corresponda a nenhuma das rotas acima.
          Sempre deve ser a ÚLTIMA rota definida.
        */}
        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default App;