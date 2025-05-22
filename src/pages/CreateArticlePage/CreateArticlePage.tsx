// src/pages/CreateArticlePage/CreateArticlePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreateArticlePage.css'; // Seu CSS para esta página

const CreateArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const token = getToken();
    if (!token) {
      setError('Você precisa estar logado para publicar um artigo.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (imageFile) {
      formData.append('featured_image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:3000/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar artigo.');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Artigo criado com sucesso!');

      setTitle('');
      setContent('');
      setImageFile(null);
      setTimeout(() => {
        navigate('/articles');
      }, 1500);

    } catch (err: any) {
      console.error('Erro ao salvar artigo:', err);
      setError(err.message || 'Ocorreu um erro desconhecido ao publicar o artigo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="create-article-container">
      <h1>Novo Artigo</h1> {/* Título conforme a imagem */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSave} className="article-form">
        <div className="form-section">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            placeholder="Adicione um título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-section image-upload-section">
          <label>Inserir imagem</label>
          <div className="image-input-group">
            <input
              type="text"
              readOnly
              value={imageFile ? imageFile.name : 'Adicione uma imagem'}
              placeholder="Adicione uma imagem"
            />
            <label htmlFor="image-upload" className="select-button">
              Selecionar
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="image-preview">
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" />
            ) : (
              <div className="image-placeholder">
                {/* Ícone de galeria conforme a imagem */}
                {/* Você pode usar um SVG inline ou uma imagem PNG/JPG para este ícone */}
                {/* Exemplo com SVG simples: */}
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
          <label htmlFor="content">Texto</label>
          <textarea
            id="content"
            placeholder="Escreva seu artigo" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel} disabled={loading}>Cancelar</button> {/* Estilo conforme imagem */}
          <button type="submit" className="save-button" disabled={loading}> {/* Estilo conforme imagem */}
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;