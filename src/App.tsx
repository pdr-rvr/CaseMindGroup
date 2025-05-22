import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/Home'; // Sua HomePage
import ArticlesPage from './pages/ArticlesPage/ArticlesPage'; // A nova ArticlesPage
import ArticleDetailPage from './pages/ArticlesPage/ArticlesPage'; // Para a página de detalhes de um artigo
import Navbar from './components/Navbar/Navbar' // Seu componente de navegação

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;