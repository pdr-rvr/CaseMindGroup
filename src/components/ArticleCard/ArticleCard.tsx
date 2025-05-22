// src/components/ArticleCard/ArticleCard.tsx
import React from 'react';
import styles from './ArticleCard.module.css';
import { Article } from '../../types/article';

interface ArticleCardProps {
  article: Article;
  index: number; // To display 01, 02, 03
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  return (
    <div className={styles.articleCard}>
      {article.featured_image && (
        <img
          src={`data:${article.image_mime_type};base64,${article.featured_image}`}
          alt={article.title}
          className={styles.articleImage}
        />
      )}
      <div className={styles.cardContent}>
        <span className={styles.cardNumber}>{(index + 1).toString().padStart(2, '0')}</span>
        <h3 className={styles.cardTitle}>{article.title}</h3>
        <p className={styles.cardMeta}>{article.author_name} - {new Date(article.created_at).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>
  );
};

export default ArticleCard;