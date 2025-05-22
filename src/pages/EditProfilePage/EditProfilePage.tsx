// src/pages/EditProfilePage/EditProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EditProfilePage.css'; // Seu CSS para esta página

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, getToken } = useAuth();

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('/images/default_profile.png');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setError(null);
      setSuccessMessage(null);

      if (authLoading) return; // Espera o AuthContext carregar

      const token = getToken();

      if (!token || !user) {
        setError('Você precisa estar logado para editar seu perfil.');
        setPageLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao carregar perfil.');
        }

        const data = await response.json();
        setName(data.name || '');
        setLastName(data.lastName || '');
        setProfileImageUrl(data.profilePictureUrl || '/images/default_profile.png'); //
      } catch (err: any) {
        console.error('Erro ao buscar perfil:', err);
        setError(err.message || 'Ocorreu um erro ao carregar o perfil.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserProfile();
  }, [authLoading, user, navigate, getToken]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setPageLoading(true);
    setError(null);
    setSuccessMessage(null);

    const token = getToken();
    if (!token) {
      setError('Sessão expirada. Faça login novamente.');
      setPageLoading(false);
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastName', lastName); // Incluindo o sobrenome

    if (profileImageFile) {
      formData.append('profile_picture', profileImageFile);
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil.');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Perfil atualizado com sucesso!');
      // TODO: Se seu AuthContext tem um método para atualizar o usuário, chame-o aqui
      // para que a Navbar reflita as mudanças imediatamente sem refresh.
      // Ex: updateUserInContext(result.user);

    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      setError(err.message || 'Ocorreu um erro desconhecido ao salvar o perfil.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (pageLoading || authLoading) {
    return <div className="loading-message">Carregando perfil...</div>;
  }

  if (!user && !pageLoading) {
    return <div className="error-message">Você não está logado. Redirecionando...</div>;
  }

  return (
    <div className="edit-profile-container"> {/* Container principal do seu CSS */}
      <h1>Editar Perfil</h1> {/* Título conforme a imagem */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSave} className="profile-form"> {/* Formulário do seu CSS */}
        <div className="left-column"> {/* Coluna esquerda para campos do formulário */}
            <div className="form-section image-upload-section">
                <label htmlFor="avatar-upload">Inserir avatar</label>
                <div className="image-input-group">
                    <input
                        type="text"
                        readOnly
                        value={profileImageFile ? profileImageFile.name : (profileImageUrl && profileImageUrl !== '/images/default_profile.png' ? 'Imagem atual' : 'Adicione um avatar')}
                        placeholder="Adicione um avatar"
                    />
                    <label htmlFor="avatar-upload" className="select-button">
                        Selecionar
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className="form-section">
                <label htmlFor="name">Nome</label>
                <input
                    type="text"
                    id="name"
                    placeholder="John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={pageLoading}
                />
            </div>

            <div className="form-section">
                <label htmlFor="lastName">Sobrenome</label>
                <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={pageLoading}
                />
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCancel} disabled={pageLoading}>Cancelar</button> {/* Estilo conforme imagem */}
                <button type="submit" className="save-button" disabled={pageLoading}> {/* Estilo conforme imagem */}
                    {pageLoading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </div>
        <div className="right-column"> {/* Coluna direita para a imagem de perfil */}
            <div className="profile-image-preview large-preview"> {/* Adicionei 'large-preview' para ter uma imagem maior */}
                <img src={profileImageUrl} alt="Profile Preview" />
            </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;