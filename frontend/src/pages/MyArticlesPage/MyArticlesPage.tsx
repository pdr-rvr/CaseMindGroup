import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import { ArticleCardSkeleton } from '../../components/Skeleton/Skeleton';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './MyArticlesPage.css';

const MyArticlesPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchMyArticles = useCallback(async () => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.id) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getMyArticles();
      setArticles(data);
    } catch (err) {
      console.error('Erro ao carregar meus artigos:', err);
      setError('Erro ao carregar seus artigos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  useEffect(() => {
    fetchMyArticles();
  }, [fetchMyArticles]);

  const handleEditArticle = (articleId: number) => {
    navigate(`/edit-article/${articleId}`);
  };

  const handleOpenDeleteModal = (articleId: number) => {
    setSelectedArticleId(articleId);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArticleId) return;

    setDeleting(true);
    try {
      const success = await articleService.deleteArticle(selectedArticleId);
      if (success) {
        toast.success('Artigo excluído com sucesso!');
        setArticles((prev) => prev.filter((a) => a.id !== selectedArticleId));
      } else {
        toast.error('Não foi possível excluir o artigo.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir artigo.');
    } finally {
      setDeleting(false);
      setSelectedArticleId(null);
    }
  };

  if (authLoading) {
    return <div className="my-articles-page-container">Carregando...</div>;
  }

  return (
    <div className="my-articles-page-container">
      <div className="my-articles-header">
        <div>
          <h1 className="my-articles-title">Meus Artigos</h1>
          <p className="my-articles-subtitle">
            Gerencie todas as publicações criadas por você na plataforma
          </p>
        </div>
        <Link to="/create-article" className="create-new-article-btn">
          + Criar Novo Artigo
        </Link>
      </div>

      {loading ? (
        <div className="articles-grid">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      ) : error ? (
        <div className="my-articles-status-box error">
          <p>{error}</p>
          <button type="button" onClick={fetchMyArticles} className="retry-btn">
            Tentar novamente
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="my-articles-status-box empty">
          <h3>Você ainda não possui publicações</h3>
          <p>Compartilhe suas ideias e conhecimentos criando seu primeiro artigo hoje mesmo!</p>
          <Link to="/create-article" className="cta-create-btn">
            Criar meu primeiro artigo
          </Link>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              isEditable={true}
              onEditClick={handleEditArticle}
              onDeleteClick={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={selectedArticleId !== null}
        title="Excluir Artigo"
        message="Tem certeza que deseja excluir este artigo? Esta ação é definitiva."
        confirmText="Sim, excluir"
        isDanger={true}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedArticleId(null)}
      />
    </div>
  );
};

export default MyArticlesPage;