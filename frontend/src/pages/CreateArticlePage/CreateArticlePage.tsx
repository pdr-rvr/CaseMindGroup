import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { useToast } from '../../context/ToastContext';
import { UploadIcon } from '../../components/Icons/Icons';
import './CreateArticlePage.css';

const CreateArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('O título do artigo é obrigatório.');
      return;
    }

    if (!content.trim()) {
      toast.error('O conteúdo do artigo não pode estar vazio.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());

    if (imageFile) {
      formData.append('featured_image', imageFile);
    }

    try {
      const result = await articleService.createArticle(formData);
      toast.success(result.message || 'Artigo publicado com sucesso!');
      navigate('/my-articles');
    } catch (err: any) {
      console.error('Erro ao salvar artigo:', err);
      const errorMsg = err.response?.data?.message || 'Ocorreu um erro ao publicar o artigo.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article-container">
      <div className="header-bar">
        <div>
          <h1 className="page-title">Novo Artigo</h1>
          <p className="page-subtitle">Preencha os campos abaixo para publicar sua matéria</p>
        </div>
        <div className="action-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="save-button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar Artigo'}
          </button>
        </div>
      </div>

      <form className="article-form" onSubmit={handleSave}>
        <div className="form-section">
          <label htmlFor="title" className="form-label">Título do Artigo</label>
          <input
            type="text"
            id="title"
            className="input-field title-input"
            placeholder="Ex: Como arquitetar microsserviços modernos..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-section image-section">
          <label className="form-label">Imagem de Capa</label>
          <div className="image-upload-box">
            {imageUrlPreview ? (
              <div className="preview-container">
                <img src={imageUrlPreview} alt="Preview da capa" className="preview-image" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-img-btn"
                  disabled={loading}
                >
                  Remover Imagem
                </button>
              </div>
            ) : (
              <label htmlFor="image-upload" className="upload-dropzone">
                <div className="upload-icon">
                  <UploadIcon size={32} color="#64748b" />
                </div>
                <p className="upload-title">Clique para selecionar uma imagem de capa</p>
                <span className="upload-hint">PNG, JPG ou WEBP de até 5MB</span>
              </label>
            )}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="content" className="form-label">Conteúdo</label>
          <textarea
            id="content"
            className="input-field textarea-field"
            placeholder="Escreva seu artigo aqui. Quebre em parágrafos para uma leitura agradável..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;