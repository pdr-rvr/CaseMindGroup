// src/components/NewArticlesSection/NewArticlesSection.tsx
import React from 'react';
import styles from './NewArticlesSection.module.css';
import { Article } from '../../types/article';

interface NewArticlesSectionProps {
  articles: Article[];
}

const NewArticlesSection: React.FC<NewArticlesSectionProps> = ({ articles }) => {
  return (
    <div className={styles.newArticlesSection}>
      <h3 className={styles.sectionTitle}>New</h3>
      {articles.map((article) => (
        <div key={article.id} className={styles.newArticleItem}>
          <h4 className={styles.newArticleTitle}>{article.title}</h4>
          <p className={styles.newArticleContent}>{article.content.substring(0, 150)}...</p> {/* Truncate content */}
        </div>
      ))}
    </div>
  );
};

export default NewArticlesSection;