import React from 'react';
import { Article } from '../../types/article';
import './FeaturedArticle.css';
import { Link } from 'react-router-dom';

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data Indisponível';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const imageUrl = article.featured_image && article.image_mime_type
    ? `data:${article.image_mime_type};base64,${article.featured_image}`
    : '/images/default_article_image.png';

  return (
    <div className="featured-article">
      <img
        src={imageUrl}
        alt={article.title}
        className="featured-image"
      />
      <div className="content">
        <h2 className="title">{article.title}</h2>
        <p className="meta">
          Por {article.author_name} - {formatDate(article.created_at)}
        </p>
      </div>
    </div>
  );
};

export default FeaturedArticle;