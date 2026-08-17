import React, { useEffect, useState } from 'react';
import { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import ArticleCard from '../../components/ArticleCard/ArticleCard'; 
import './ArticlesPage.css';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articleService.getAllArticles(); 
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch all articles:", err);
        setError("Erro ao carregar artigos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="articles-page-container">Carregando artigos...</div>;
  }

  if (error) {
    return <div className="articles-page-container error-message">{error}</div>;
  }

  if (articles.length === 0) {
    return <div className="articles-page-container no-articles">Nenhum artigo encontrado.</div>;
  }

  return (
    <div className="articles-page-container">
      <div className="articles-grid">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;