// src/components/FeaturedArticle/FeaturedArticle.tsx
import React from 'react';
import styles from './FeaturedArticle.module.css';
import { Article } from '../../types/article';

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className={styles.featuredArticle}>
      {article.featured_image && (
        <img
          src={`data:${article.image_mime_type};base64,${article.featured_image}`}
          alt={article.title}
          className={styles.featuredImage}
        />
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.meta}>
          Por {article.author_name} - {formatDate(article.created_at)}
        </p>
        <button className={styles.readMoreButton}>LER MAIS</button>
      </div>
    </div>
  );
};

export default FeaturedArticle;