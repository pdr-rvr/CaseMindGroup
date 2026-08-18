import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../types/article';
import { ArticleCoverImage } from '../ArticleCoverImage/ArticleCoverImage';
import { ClockIcon } from '../Icons/Icons';
import './FeaturedArticle.css';

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data indisponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div
      className="featured-article"
      onClick={() => navigate(`/articles/${article.id}`)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/articles/${article.id}`)}
    >
      <div className="featured-image-wrapper">
        <ArticleCoverImage
          imageUrl={article.image_url}
          base64Image={article.featured_image}
          mimeType={article.image_mime_type}
          alt={article.title}
          className="featured-image"
        />
        <div className="featured-badge">Destaque</div>
      </div>
      <div className="featured-content">
        <h2 className="featured-title">{article.title}</h2>
        <p className="featured-excerpt">
          {article.content ? article.content.substring(0, 160) + '...' : ''}
        </p>
        <div className="featured-meta">
          <span className="featured-author">Por <strong>{article.author_name}</strong></span>
          <span className="featured-meta-sep">•</span>
          <span className="featured-date">{formatDate(article.created_at)}</span>
          {article.read_time_minutes && (
            <>
              <span className="featured-meta-sep">•</span>
              <span className="featured-readtime">
                <ClockIcon size={14} /> {article.read_time_minutes} min
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;