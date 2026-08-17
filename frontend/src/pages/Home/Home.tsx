import React, { useEffect, useState } from 'react';
import './Home.css';
import FeaturedArticle from '../../components/FeaturedArticle/FeaturedArticle';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import NewArticlesSection from '../../components/NewArticlesSection/NewArticlesSection';
import { articleService } from '../../services/articleService';
import { Article } from '../../types/article';

const Home: React.FC = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [newArticles, setNewArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const fetchedFeaturedArticle = await articleService.getFeaturedArticle();
      if (fetchedFeaturedArticle) {
        setFeaturedArticle(fetchedFeaturedArticle);
      }

      const fetchedRecentArticles = await articleService.getRecentArticles();
      setRecentArticles(fetchedRecentArticles);

      const fetchedNewArticles = await articleService.getNewArticles();
      setNewArticles(fetchedNewArticles.slice(0, 4));
    };

    fetchArticles();
  }, []);

  return (
    <div className="home-container">
      <div className="top-content-wrapper">
        <div className="left-column">
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}
        </div>
        <div className="right-column">
          <NewArticlesSection articles={newArticles} />
        </div>
      </div>

      <div className="recent-articles-footer">
        <div className="recent-articles-grid">
          {recentArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;