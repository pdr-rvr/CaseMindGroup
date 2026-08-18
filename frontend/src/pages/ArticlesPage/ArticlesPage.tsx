import React, { useEffect, useState, useCallback } from 'react';
import { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import { ArticleCardSkeleton } from '../../components/Skeleton/Skeleton';
import { SearchIcon, CloseIcon } from '../../components/Icons/Icons';
import './ArticlesPage.css';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getAllArticles(query);
      setArticles(data);
    } catch (err) {
      console.error('Erro ao buscar artigos:', err);
      setError('Erro ao carregar artigos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchArticles]);

  return (
    <div className="articles-page-container">
      <div className="articles-page-header">
        <div>
          <h1 className="articles-page-title">Todos os Artigos</h1>
          <p className="articles-page-subtitle">
            Explore publicações, ideias e tutoriais da nossa comunidade
          </p>
        </div>

        <div className="search-input-wrapper">
          <span className="search-icon">
            <SearchIcon size={18} color="#94a3b8" />
          </span>
          <input
            type="text"
            placeholder="Buscar por título, autor ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar busca"
            >
              <CloseIcon size={14} color="#94a3b8" />
            </button>
          )}
        </div>
      </div>

      <div className="articles-results-bar">
        {!loading && (
          <span className="results-count">
            {articles.length} {articles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            {searchTerm && ` para "${searchTerm}"`}
          </span>
        )}
      </div>

      {loading ? (
        <div className="articles-grid">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      ) : error ? (
        <div className="articles-status-box error">
          <p>{error}</p>
          <button type="button" onClick={() => fetchArticles()} className="retry-btn">
            Tentar novamente
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="articles-status-box empty">
          <h3>Nenhum artigo encontrado</h3>
          <p>
            {searchTerm
              ? `Não encontramos nenhum resultado para "${searchTerm}". Tente outros termos.`
              : 'Nenhum artigo foi publicado ainda.'}
          </p>
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="reset-search-btn">
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;