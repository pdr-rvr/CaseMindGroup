import React from 'react';
import { Article } from '../../types/article';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const imageUrl = `data:${article.image_mime_type};base64,${article.featured_image}`;

  const truncateContent = (content: string, limit: number) => {
    if (content.length <= limit) {
      return content;
    }
    return content.substring(0, content.lastIndexOf(' ', limit)) + '...';
  };

  return (
    <div className="article-card">
      <Link to={`/articles/${article.id}`}> {}
        {article.featured_image && (
          <div className="article-card-image">
            <img src={imageUrl} alt={article.title} />
          </div>
        )}
        <div className="article-card-content">
          <h3>{article.title}</h3>
          <p className="article-card-description">
            {truncateContent(article.content, 150)} {}
          </p>
          <div className="article-card-meta">
            <span className="author">Por {article.author_name}</span>
            <span className="date">{formatDate(article.created_at)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;