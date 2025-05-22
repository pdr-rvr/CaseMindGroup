// src/pages/CreateArticlePage/CreateArticlePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreateArticlePage.module.css';

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
    <div className="create-article-container"> {/* Usando a classe do seu CSS */}
      <h1>Publicar Avaliação</h1>
      {error && <div className="error-message">{error}</div>} {/* Use uma classe genérica para erro */}
      {successMessage && <div className="success-message">{successMessage}</div>} {/* Use uma classe genérica para sucesso */}
      <form onSubmit={handleSave} className="article-form"> {/* Usando a classe do seu CSS */}
        <div className="form-section"> {/* Usando a classe do seu CSS */}
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

        <div className="form-section image-upload-section"> {/* Usando as classes do seu CSS */}
          <label>Inserir imagem</label>
          <div className="image-input-group"> {/* Usando a classe do seu CSS */}
            <input
              type="text"
              readOnly
              value={imageFile ? imageFile.name : 'Adicione uma imagem'}
              placeholder="Adicione uma imagem"
            />
            <label htmlFor="image-upload" className="select-button"> {/* Usando a classe do seu CSS */}
              Selecionar
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }} // Oculta o input de arquivo nativo
            />
          </div>
          <div className="image-preview"> {/* Usando a classe do seu CSS */}
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" />
            ) : (
              <div className="image-placeholder"> {/* Usando a classe do seu CSS */}
                 {/* Você pode adicionar um ícone ou texto aqui */}
                 Nenhuma imagem selecionada
              </div>
            )}
          </div>
        </div>

        <div className="form-section"> {/* Usando a classe do seu CSS */}
          <label htmlFor="content">Texto</label>
          <textarea
            id="content"
            placeholder="Escreva sua avaliação"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-actions"> {/* Usando a classe do seu CSS */}
          <button type="button" className="cancel-button" onClick={handleCancel} disabled={loading}>Cancelar</button> {/* Usando a classe do seu CSS */}
          <button type="submit" className="save-button" disabled={loading}> {/* Usando a classe do seu CSS */}
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;