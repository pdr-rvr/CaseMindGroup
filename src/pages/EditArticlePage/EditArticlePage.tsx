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
          if (fetchedArticle.featured_image && fetchedArticle.image_mime_type) {
            setImageUrlPreview(`data:${fetchedArticle.image_mime_type};base64,${fetchedArticle.featured_image}`);
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
      if (originalArticle?.featured_image && originalArticle?.image_mime_type) {
        setImageUrlPreview(`data:${originalArticle.image_mime_type};base64,${originalArticle.featured_image}`);
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
        navigate(`/articles/${updatedArticle.id}`);
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

  if (loading) {
    return <div className="edit-article-container">Carregando artigo para edição...</div>;
  }

  if (error && !originalArticle) {
    return <div className="edit-article-container error-message">{error}</div>;
  }

  return (
    <div className="edit-article-container">
      <h1>Editar Artigo</h1>
      {error && <div className="form-error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="edit-article-form">
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Adicione um título"
          />
        </div>

        <div className="form-group image-upload-group">
          <label htmlFor="image">Inserir imagem</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <div className="image-input-display">
            <input
              type="text"
              value={imageFile ? imageFile.name : (imageUrlPreview ? "Imagem atual selecionada" : "")}
              readOnly
              placeholder="Adicione uma imagem"
            />
            <button
              type="button"
              onClick={() => document.getElementById('image')?.click()}
              className="select-image-button"
            >
              SELECIONAR
            </button>
          </div>
          {imageUrlPreview && (
            <div className="image-preview-container">
              <img src={imageUrlPreview} alt="Pré-visualização" className="image-preview" />
            </div>
          )}
          {originalArticle?.featured_image && !imageFile && (
             <button type="button" className="remove-image-button" onClick={() => {
                setImageFile(null);
                setImageUrlPreview(null);
             }}>
                Remover Imagem Atual
             </button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content">Texto</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Escreva seu artigo"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="save-button" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticlePage;