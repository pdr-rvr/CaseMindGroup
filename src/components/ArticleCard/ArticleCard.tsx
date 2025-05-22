// src/components/ArticleCard/ArticleCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types/article';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
  index: number;
  isEditable?: boolean;
  onEditClick?: (articleId: number) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isEditable = false, onEditClick }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data Indisponível';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const imageUrl = article.featured_image && article.image_mime_type
    ? `data:${article.image_mime_type};base64,${article.featured_image}`
    : '/images/default_article_image.png';

  return (
    <div className="article-card">
        <img src={imageUrl} alt={article.title} className="article-card-image" />
        <div className="article-card-content">
          <h3 className="article-card-title">{article.title}</h3>
          <p className="article-card-description">
            {article.content.substring(0, 150)}...
          </p>
          <div className="article-card-meta">
            <span className="article-card-author-name">Por {article.author_name}</span>
            <span className="article-card-date">{formatDate(article.created_at)}</span>
          </div>
        </div>
      {isEditable && onEditClick && (
        <button className="edit-button" onClick={() => onEditClick(article.id)}>
          <img src="/icons/edit-icon.svg" alt="Editar" style={{ width: '20px', height: '20px' }} />
        </button>
      )}
    </div>
  );
};

export default ArticleCard;