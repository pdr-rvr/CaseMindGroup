import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { articleService } from '../../services/articleService';
import { UploadIcon } from '../../components/Icons/Icons';
import './EditArticlePage.css';

const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || isNaN(Number(id))) {
        toast.error('ID do artigo inválido.');
        navigate('/my-articles');
        return;
      }

      try {
        setLoading(true);
        const article = await articleService.getArticleById(Number(id));
        if (!article) {
          toast.error('Artigo não encontrado.');
          navigate('/my-articles');
          return;
        }

        if (user?.id && article.author_id !== user.id) {
          toast.error('Você não tem permissão para editar este artigo.');
          navigate('/articles');
          return;
        }

        setTitle(article.title);
        setContent(article.content);

        if (article.image_url) {
          setImageUrlPreview(`http://localhost:4000${article.image_url}`);
        } else if (article.featured_image && article.image_mime_type) {
          setImageUrlPreview(`data:${article.image_mime_type};base64,${article.featured_image}`);
        }
      } catch (err) {
        console.error('Erro ao carregar artigo para edição:', err);
        toast.error('Erro ao carregar artigo para edição.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, user, navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrlPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!title.trim()) {
      toast.error('O título não pode estar vazio.');
      return;
    }

    if (!content.trim()) {
      toast.error('O conteúdo não pode estar vazio.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());

    if (imageFile) {
      formData.append('featured_image', imageFile);
    }

    try {
      const result = await articleService.updateArticle(Number(id), formData);
      toast.success(result.message || 'Artigo atualizado com sucesso!');
      navigate(`/articles/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar artigo:', err);
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar o artigo.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="edit-article-container loading-state">Carregando dados do artigo...</div>;
  }

  return (
    <div className="edit-article-container">
      <div className="header-bar">
        <div>
          <h1 className="page-title">Editar Artigo</h1>
          <p className="page-subtitle">Atualize as informações da sua publicação</p>
        </div>
        <div className="action-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="save-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      <form className="article-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor="title" className="form-label">Título</label>
          <input
            type="text"
            id="title"
            className="input-field title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-section image-section">
          <label className="form-label">Imagem de Capa</label>
          <div className="image-upload-box">
            {imageUrlPreview ? (
              <div className="preview-container">
                <img src={imageUrlPreview} alt="Pré-visualização" className="preview-image" />
                <div className="image-edit-actions">
                  <label htmlFor="edit-image-upload" className="change-img-btn">
                    Trocar Imagem
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-img-btn"
                    disabled={submitting}
                  >
                    Remover Imagem
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="edit-image-upload" className="upload-dropzone">
                <div className="upload-icon">
                  <UploadIcon size={32} color="#64748b" />
                </div>
                <p className="upload-title">Clique para selecionar uma nova imagem de capa</p>
                <span className="upload-hint">PNG, JPG ou WEBP de até 5MB</span>
              </label>
            )}
            <input
              type="file"
              id="edit-image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={submitting}
            />
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="content" className="form-label">Texto do Artigo</label>
          <textarea
            id="content"
            className="input-field textarea-field"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            disabled={submitting}
          />
        </div>
      </form>
    </div>
  );
};

export default EditArticlePage;