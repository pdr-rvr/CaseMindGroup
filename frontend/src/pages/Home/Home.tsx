import React, { useEffect, useState } from 'react';
import FeaturedArticle from '../../components/FeaturedArticle/FeaturedArticle';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import NewArticlesSection from '../../components/NewArticlesSection/NewArticlesSection';
import { ArticleCardSkeleton } from '../../components/Skeleton/Skeleton';
import { articleService } from '../../services/articleService';
import { Article } from '../../types/article';
import './Home.css';

const Home: React.FC = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [newArticles, setNewArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const [featured, recent, news] = await Promise.all([
          articleService.getFeaturedArticle(),
          articleService.getRecentArticles(),
          articleService.getNewArticles(),
        ]);

        if (featured) setFeaturedArticle(featured);
        setRecentArticles(recent);
        setNewArticles(news.slice(0, 4));
      } catch (error) {
        console.error('Erro ao carregar artigos da Home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="home-container">
      {loading ? (
        <div className="home-loading-grid">
          <div className="top-content-wrapper">
            <div className="left-column">
              <ArticleCardSkeleton />
            </div>
            <div className="right-column">
              <ArticleCardSkeleton />
            </div>
          </div>
          <div className="recent-articles-grid">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        </div>
      ) : (
        <>
          <div className="top-content-wrapper">
            <div className="left-column">
              {featuredArticle ? (
                <FeaturedArticle article={featuredArticle} />
              ) : (
                <div className="empty-featured-card">
                  <h3>Nenhum artigo em destaque ainda</h3>
                  <p>Seja o primeiro a publicar uma nova matéria!</p>
                </div>
              )}
            </div>
            <div className="right-column">
              <NewArticlesSection articles={newArticles} />
            </div>
          </div>

          <section className="recent-articles-section">
            <div className="section-heading">
              <h2 className="recent-heading-title">Mais Recentes</h2>
            </div>
            <div className="recent-articles-grid">
              {recentArticles.length === 0 ? (
                <p className="no-recent-text">Nenhum artigo recente encontrado.</p>
              ) : (
                recentArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;