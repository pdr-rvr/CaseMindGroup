import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { ClockIcon } from '../../components/Icons/Icons';
import { ArticleCoverImage } from '../../components/ArticleCoverImage/ArticleCoverImage';
import './ArticleDetailPage.css';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || isNaN(Number(id))) {
        setError('Artigo não encontrado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await articleService.getArticleById(Number(id));
        if (data) {
          setArticle(data);
        } else {
          setError('Artigo não encontrado ou indisponível.');
        }
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
        setError('Ocorreu um erro ao carregar o artigo.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDeleteArticle = async () => {
    if (!article) return;
    setDeleting(true);
    try {
      const success = await articleService.deleteArticle(article.id);
      if (success) {
        toast.success('Artigo excluído com sucesso!');
        navigate('/articles');
      } else {
        toast.error('Não foi possível excluir o artigo.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir artigo.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const hasImage = Boolean(article?.image_url || article?.featured_image);

  if (loading) {
    return (
      <div className="article-detail-container">
        <Skeleton height="36px" width="160px" borderRadius="8px" />
        <div style={{ marginTop: '24px' }}>
          <Skeleton height="48px" width="85%" borderRadius="8px" />
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Skeleton height="20px" width="140px" />
            <Skeleton height="20px" width="100px" />
          </div>
          <div style={{ marginTop: '24px' }}>
            <Skeleton height="360px" borderRadius="16px" />
          </div>
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="95%" />
            <Skeleton height="20px" width="90%" />
            <Skeleton height="20px" width="98%" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-container not-found-state">
        <h2>{error || 'Artigo não encontrado'}</h2>
        <p>O artigo que você procura pode ter sido removido ou não existe.</p>
        <Link to="/articles" className="back-link-btn">
          Voltar para todos os artigos
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === article.author_id;

  return (
    <article className="article-detail-container">
      <div className="article-top-nav">
        <button type="button" onClick={() => navigate(-1)} className="back-button">
          Voltar
        </button>
        {isOwner && (
          <div className="owner-actions">
            <Link to={`/edit-article/${article.id}`} className="owner-btn edit-btn">
              Editar
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="owner-btn delete-btn"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      <header className="article-header">
        <h1 className="article-main-title">{article.title}</h1>
        <div className="article-meta-row">
          <div className="author-info">
            <div className="author-avatar-circle">
              {article.author_name.charAt(0).toUpperCase()}
            </div>
            <span className="author-name">Por <strong>{article.author_name}</strong></span>
          </div>
          <span className="meta-divider">•</span>
          <time className="publish-date">{formatDate(article.created_at)}</time>
          {article.read_time_minutes && (
            <>
              <span className="meta-divider">•</span>
              <span className="read-time-badge">
                <ClockIcon size={13} /> {article.read_time_minutes} min de leitura
              </span>
            </>
          )}
        </div>
      </header>

      {hasImage && (
        <div className="article-banner-wrapper">
          <ArticleCoverImage
            imageUrl={article.image_url}
            base64Image={article.featured_image}
            mimeType={article.image_mime_type}
            alt={article.title}
            className="article-banner-image"
          />
        </div>
      )}

      <div className="article-body">
        {article.content.split('\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return null;
          return <p key={idx} className="article-paragraph">{paragraph}</p>;
        })}
      </div>

      <footer className="article-footer">
        <div className="footer-author-box">
          <div className="author-avatar-circle large">
            {article.author_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>Publicado por {article.author_name}</h4>
            <p>Artigo integrante da plataforma CaseMindGroup.</p>
          </div>
        </div>
      </footer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Excluir Artigo"
        message={`Tem certeza que deseja excluir "${article.title}"? Esta ação é definitiva e não poderá ser desfeita.`}
        confirmText="Sim, excluir"
        isDanger={true}
        loading={deleting}
        onConfirm={handleDeleteArticle}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </article>
  );
};

export default ArticleDetailPage;
