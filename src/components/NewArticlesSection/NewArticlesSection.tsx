import React from 'react';
import { Article } from '../../types/article';
import ArticleListItem from '../ArticleListItem/ArticleListItem'; 
import styles from './NewArticlesSection.module.css';

interface NewArticlesSectionProps {
  articles: Article[];
}

const NewArticlesSection: React.FC<NewArticlesSectionProps> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <div className={styles.newArticlesSection}>
        <h2>Novos Artigos</h2>
        <p>Nenhum novo artigo disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className={styles.newArticlesSection}>
      <h2>Novos Artigos</h2>
      <div className={styles.articlesList}>
        {articles.map(article => (
          <ArticleListItem key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewArticlesSection;