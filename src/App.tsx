import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet  } from 'react-router-dom';
import HomePage from './pages/Home/Home'; // Sua HomePage
import ArticlesPage from './pages/ArticlesPage/ArticlesPage'; // A nova ArticlesPage
import Navbar from './components/Navbar/Navbar' // Seu componente de navegação
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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          element={
            <>
              <Navbar />
              <main>
                <Outlet />
              </main>
            </>
          }
        >

          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/create-article" element={<CreateArticlePage />} />
            <Route path="/edit-profile/:id" element={<EditProfilePage />} />
            <Route path="/my-articles" element={<MyArticlesPage />} />
            <Route path="/edit-article/:id" element={<EditArticlePage />} /> 
          </Route>
        </Route>

        <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
      </Routes>
    </Router>
  );
};
export default App;