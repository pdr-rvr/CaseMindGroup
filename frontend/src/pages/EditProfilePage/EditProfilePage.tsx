import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { UserIcon } from '../../components/Icons/Icons';
import './EditProfilePage.css';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Alteração de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setPageLoading(true);
        const data = await userService.getProfile();
        setName(data.name || '');
        setEmail(data.email || '');
        if (data.profilePictureUrl) {
          setProfileImageUrl(data.profilePictureUrl);
        }
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err);
        toast.error('Erro ao carregar dados do perfil.');
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, [authLoading, user, navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('O nome não pode estar em branco.');
      return;
    }

    setSavingProfile(true);
    const formData = new FormData();
    formData.append('name', name.trim());

    if (profileImageFile) {
      formData.append('profile_picture', profileImageFile);
    }

    try {
      const result = await userService.updateProfile(formData);
      toast.success(result.message || 'Perfil atualizado com sucesso!');
      await refreshUser();
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      const msg = err.response?.data?.message || 'Erro ao atualizar perfil.';
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error('Preencha a senha atual e a nova senha.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('A confirmação da nova senha não confere.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await userService.changePassword(currentPassword, newPassword);
      toast.success(res.message || 'Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Erro ao trocar senha:', err);
      const msg = err.response?.data?.message || 'Erro ao alterar a senha.';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (pageLoading) {
    return <div className="edit-profile-container loading-state">Carregando perfil...</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="header-bar">
        <div>
          <h1 className="page-title">Configurações do Perfil</h1>
          <p className="page-subtitle">Gerencie suas informações pessoais e credenciais de acesso</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Bloco 1: Dados Pessoais e Avatar */}
        <div className="profile-card">
          <h3 className="card-title">Informações Pessoais</h3>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="avatar-section">
              <div className="avatar-preview-box">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Avatar"
                    className="profile-avatar-img"
                    onError={() => setProfileImageUrl(null)}
                  />
                ) : (
                  <div className="avatar-fallback-box">
                    <UserIcon size={32} color="#64748b" />
                  </div>
                )}
              </div>
              <div className="avatar-actions">
                <label htmlFor="avatar-upload" className="select-avatar-btn">
                  Alterar Foto
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={savingProfile}
                />
                <span className="avatar-hint">JPG ou PNG de até 3MB</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">Nome Completo</label>
              <input
                type="text"
                id="name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={savingProfile}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="email"
                id="email"
                className="input-field disabled-input"
                value={email}
                disabled
                title="O e-mail cadastrado não pode ser alterado"
              />
            </div>

            <button type="submit" className="save-btn" disabled={savingProfile}>
              {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>

        {/* Bloco 2: Segurança / Alterar Senha */}
        <div className="profile-card">
          <h3 className="card-title">Segurança e Senha</h3>
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                className="input-field"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={savingPassword}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={savingPassword}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword" className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmNewPassword"
                className="input-field"
                placeholder="Repita a nova senha"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={savingPassword}
              />
            </div>

            <button type="submit" className="save-btn" disabled={savingPassword}>
              {savingPassword ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;