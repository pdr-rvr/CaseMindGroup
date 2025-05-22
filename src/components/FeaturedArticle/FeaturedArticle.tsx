import React from 'react';
import { Article } from '../../types/article';
import styles from './FeaturedArticle.module.css';
import { Link } from 'react-router-dom';

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data Indisponível';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const imageUrl = article.featured_image && article.image_mime_type 
    ? `data:${article.image_mime_type};base64,${article.featured_image}`
    : '/images/default_article_image.png';

  return (
      <div className={styles.featuredArticle}>
        <img
          src={imageUrl}
          alt={article.title}
          className={styles.featuredImage}
        />
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