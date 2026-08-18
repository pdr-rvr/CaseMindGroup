import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../types/article';
import { ArticleCoverImage } from '../ArticleCoverImage/ArticleCoverImage';
import './ArticleListItem.css';

interface ArticleListItemProps {
  article: Article;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ article }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data indisponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className="article-list-item"
      onClick={() => navigate(`/articles/${article.id}`)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/articles/${article.id}`)}
    >
      <div className="article-list-item-img-wrapper">
        <ArticleCoverImage
          imageUrl={article.image_url}
          base64Image={article.featured_image}
          mimeType={article.image_mime_type}
          alt={article.title}
          className="article-list-item-image"
        />
      </div>
      <div className="article-list-item-content">
        <h4 className="article-list-item-title">{article.title}</h4>
        <div className="article-list-item-meta">
          <span className="author">Por {article.author_name}</span>
          <span className="sep">•</span>
          <span className="date">{formatDate(article.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleListItem;