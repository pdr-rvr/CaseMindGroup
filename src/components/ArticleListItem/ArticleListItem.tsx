import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types/article';
import './ArticleListItem.css';

interface ArticleListItemProps {
  article: Article;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data Indisponível';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const imageUrl = article.featured_image && article.image_mime_type 
    ? `data:${article.image_mime_type};base64,${article.featured_image}`
    : '/images/default_article_image.png';

  const truncateContent = (content: string, limit: number) => {
    if (content.length <= limit) {
      return content;
    }
    return content.substring(0, limit) + '...';
  };

  return (
      <div className="article-list-item">
        <img src={imageUrl} alt={article.title} className="article-list-item-image" />
        <div className="article-list-item-content">
          <h3>{article.title}</h3>
          <p>{truncateContent(article.content, 100)}</p>
          <div className="article-list-item-meta">
            <span className="author">Por {article.author_name}</span>
            <span className="date">{formatDate(article.created_at)}</span>
          </div>
        </div>
      </div>
  );
};

export default ArticleListItem;