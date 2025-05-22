import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types/article';
import './NewArticlesSection.css';

interface NewArticlesSectionProps {
  articles: Article[];
}

const NewArticlesSection: React.FC<NewArticlesSectionProps> = ({ articles }) => {
  const truncateByCharacters = (text: string, limit: number) => {
    if (text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + '...';
  };

  return (
    <div className="new-articles-section">
      <h2 className="section-title">New</h2>
      <div className="article-list">
        {articles.map(article => (
          <div key={article.id} className="article-item">
            <h3 className="article-item-title">{article.title}</h3> 
            <p className="article-item-text">{truncateByCharacters(article.content, 40)}</p> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArticlesSection;