import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { articleService } from '../../services/articleService';
import { Article } from '../../types/article'; 
import './EditArticlePage.css';

const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken, user } = useAuth();

  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [originalArticle, setOriginalArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticleForEdit = async () => {
      if (!id) {
        setError("ID do artigo não fornecido.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedArticle = await articleService.getArticleById(Number(id));
        if (fetchedArticle) {
          if (user?.id !== fetchedArticle.author_id) {
            setError("Você não tem permissão para editar este artigo.");
            setLoading(false);
            return;
          }
          setOriginalArticle(fetchedArticle);
          setTitle(fetchedArticle.title);
          let base64ImageData: string | null = null;
          if (fetchedArticle.featured_image) {
            if (typeof fetchedArticle.featured_image === 'string') {
              base64ImageData = fetchedArticle.featured_image;
            } else if (typeof fetchedArticle.featured_image === 'object' && fetchedArticle.featured_image !== null && 'data' in fetchedArticle.featured_image) {
              base64ImageData = (fetchedArticle.featured_image as any).data;
            }
          }
          if (base64ImageData && fetchedArticle.image_mime_type) {
            setImageUrlPreview(`data:${fetchedArticle.image_mime_type};base64,${base64ImageData}`);
          } else {
            setImageUrlPreview(null);
          }
          setContent(fetchedArticle.content);
        } else {
          setError("Artigo não encontrado para edição.");
        }
      } catch (err) {
        console.error("Failed to fetch article for edit:", err);
        setError("Erro ao carregar artigo para edição.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleForEdit();
  }, [id, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      let originalBase64ImageData: string | null = null;
      if (originalArticle?.featured_image) {
        if (typeof originalArticle.featured_image === 'string') {
          originalBase64ImageData = originalArticle.featured_image;
        } else if (typeof originalArticle.featured_image === 'object' && originalArticle.featured_image !== null && 'data' in originalArticle.featured_image) {
          originalBase64ImageData = (originalArticle.featured_image as any).data;
        }
      }
      if (originalBase64ImageData && originalArticle?.image_mime_type) {
        setImageUrlPreview(`data:${originalArticle.image_mime_type};base64,${originalBase64ImageData}`);
      } else {
        setImageUrlPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user?.id) {
      setError("ID do artigo ou usuário não disponível.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const token = getToken();

    if (!token) {
      setError("Você precisa estar logado para editar um artigo.");
      setSubmitting(false);
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
      formData.append('featured_image', imageFile);
    } else {
    }

    try {
      const updatedArticle = await articleService.updateArticle(Number(id), formData, token);
      if (updatedArticle) {
        alert('Artigo atualizado com sucesso!');
        navigate('/my-articles');
      } else {
        setError('Falha ao atualizar o artigo.');
      }
    } catch (err: any) {
      console.error('Erro ao atualizar artigo:', err);
      const apiErrorMessage = err.response?.data?.message || 'Erro ao atualizar o artigo. Verifique os dados e tente novamente.';
      setError(apiErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="edit-article-container">Carregando artigo para edição...</div>;
  }

  if (error && !originalArticle) {
    return <div className="edit-article-container error-message">{error}</div>;
  }

  return (
    <div className="edit-article-container">
      <div className="header-bar">
        <h1 className="page-title">Editar Artigo</h1>
        <div className="action-buttons">
          <button type="button" className="cancel-button" onClick={handleCancel} disabled={submitting}>Cancelar</button>
          <button type="submit" className="save-button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <form className="article-form">
        <div className="form-content">
          <div className="left-column">
            <div className="form-section">
              <label htmlFor="title" className="label">Título</label>
              <input
                type="text"
                id="title"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Adicione um título"
                disabled={submitting}
              />
            </div>

            <div className="form-section image-section">
              <div className="image-input-area">
                <label htmlFor="image-upload" className="label">Inserir imagem</label>
                <div className="image-input-group">
                  <input
                    type="text"
                    readOnly
                    className="input-field"
                    value={imageFile ? imageFile.name : (imageUrlPreview ? "Imagem atual selecionada" : "")}
                    placeholder="Adicione uma imagem"
                    disabled={submitting}
                  />
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="select-button">
                    SELECIONAR
                  </label>
                </div>
                {originalArticle?.featured_image && !imageFile && (
                  <button type="button" className="remove-image-button" onClick={() => {
                    setImageFile(null);
                    setImageUrlPreview(null);
                  }} disabled={submitting}>
                    Remover Imagem Atual
                  </button>
                )}
              </div>
              <div className="image-preview-area">
                {imageUrlPreview ? (
                  <img src={imageUrlPreview} alt="Pré-visualização" className="preview-image" />
                ) : (
                  <div className="placeholder-icon-container">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <label htmlFor="content" className="label">Texto</label>
              <textarea
                id="content"
                className="input-field textarea-field"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Escreva seu artigo"
                disabled={submitting}
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditArticlePage;