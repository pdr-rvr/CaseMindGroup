import React, { useEffect, useState } from 'react';
import { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyArticlesPage.css';

const MyArticlesPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyArticles = async () => {
      if (authLoading) return;
      if (!isAuthenticated || !user?.id) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const allArticles = await articleService.getAllArticles();
        const userArticles = allArticles.filter(article => article.author_id === user.id);
        setArticles(userArticles);
      } catch (err) {
        console.error("Failed to fetch my articles:", err);
        setError("Erro ao carregar seus artigos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleEditArticle = (articleId: number) => {
    navigate(`/edit-article/${articleId}`);
  };

  if (authLoading || loading) {
    return <div className="my-articles-page-container">Carregando seus artigos...</div>;
  }

  if (error) {
    return <div className="my-articles-page-container error-message">{error}</div>;
  }

  if (articles.length === 0) {
    return <div className="my-articles-page-container no-articles">Você ainda não publicou nenhum artigo.</div>;
  }

  return (
    <div className="my-articles-page-container">
      <h1>Meus Artigos</h1>
      <div className="articles-grid">
        {articles.map((article, index) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            index={index} 
            isEditable={true} 
            onEditClick={handleEditArticle} 
          />
        ))}
      </div>
    </div>
  );
};

export default MyArticlesPage;