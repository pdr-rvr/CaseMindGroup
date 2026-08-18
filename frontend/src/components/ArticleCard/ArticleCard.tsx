import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../types/article';
import { ArticleCoverImage } from '../ArticleCoverImage/ArticleCoverImage';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
  index?: number;
  isEditable?: boolean;
  onEditClick?: (articleId: number) => void;
  onDeleteClick?: (articleId: number) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  index = 0,
  isEditable = false,
  onEditClick,
  onDeleteClick,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data indisponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCardClick = () => {
    navigate(`/articles/${article.id}`);
  };

  return (
    <div
      className="article-card"
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="article-card-image-wrapper">
        <ArticleCoverImage
          imageUrl={article.image_url}
          base64Image={article.featured_image}
          mimeType={article.image_mime_type}
          alt={article.title}
          className="article-card-image"
        />
        {article.read_time_minutes && (
          <span className="card-read-time">{article.read_time_minutes} min</span>
        )}
      </div>

      <div className="article-card-content">
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-description">
          {article.content ? article.content.substring(0, 120) + '...' : ''}
        </p>
        <div className="article-card-meta">
          <span className="article-card-author-name">Por {article.author_name}</span>
          <span className="article-card-date">{formatDate(article.created_at)}</span>
        </div>
      </div>

      {isEditable && (
        <div className="card-action-bar" onClick={(e) => e.stopPropagation()}>
          {onEditClick && (
            <button
              type="button"
              className="card-action-btn edit-action-btn"
              onClick={() => onEditClick(article.id)}
            >
              Editar
            </button>
          )}
          {onDeleteClick && (
            <button
              type="button"
              className="card-action-btn delete-action-btn"
              onClick={() => onDeleteClick(article.id)}
            >
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleCard;