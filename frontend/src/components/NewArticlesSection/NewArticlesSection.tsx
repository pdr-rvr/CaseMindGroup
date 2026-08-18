import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Article } from '../../types/article';
import './NewArticlesSection.css';

interface NewArticlesSectionProps {
  articles: Article[];
}

const NewArticlesSection: React.FC<NewArticlesSectionProps> = ({ articles }) => {
  const navigate = useNavigate();

  return (
    <div className="new-articles-section">
      <div className="new-section-header">
        <h2 className="section-title">Novidades</h2>
        <Link to="/articles" className="view-all-link">Ver todos →</Link>
      </div>
      <div className="article-list">
        {articles.length === 0 ? (
          <p className="no-new-articles">Nenhum artigo recente no momento.</p>
        ) : (
          articles.map((article, idx) => (
            <div
              key={article.id}
              className="article-item"
              onClick={() => navigate(`/articles/${article.id}`)}
              role="article"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/articles/${article.id}`)}
            >
              <h3 className="article-item-title">{article.title}</h3>
              <p className="article-item-text">
                {article.content ? article.content.substring(0, 80) + '...' : ''}
              </p>
              {idx < articles.length - 1 && <hr className="article-item-divider" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewArticlesSection;