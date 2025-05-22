// src/pages/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Navbar from '../../components/Navbar/Navbar';
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
      setNewArticles(fetchedNewArticles);
    };

    fetchArticles();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}
          <div className={styles.recentArticlesGrid}>
            {recentArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
        <div className={styles.rightColumn}>
          <NewArticlesSection articles={newArticles} />
        </div>
      </div>
    </div>
  );
};

export default Home;