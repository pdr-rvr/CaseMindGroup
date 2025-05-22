// src/pages/ArticlesPage.tsx
import React, { useEffect, useState } from 'react';
import { Article } from '../../types/article';
import { getNewestArticles } from '../../services/articleService'; // Importa a função de serviço
import ArticleCard from '../../components/ArticleCard/ArticleCard'; // Seu componente de cartão de artigo

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getNewestArticles();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Erro ao carregar artigos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []); // O array vazio garante que o useEffect rode apenas uma vez ao montar o componente

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
      <h1>Artigos Mais Recentes</h1>
      <div className="articles-grid">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;