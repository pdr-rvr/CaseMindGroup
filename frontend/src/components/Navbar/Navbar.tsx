import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ArticleIcon, SettingsIcon, LogoutIcon } from '../Icons/Icons';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.info('Você foi desconectado.');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <span className="brand-logo-letter">M</span>
            <span className="brand-text">MindBlog</span>
          </Link>
        </div>

        <nav className="navbar-center">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`}>
            Artigos
          </Link>
        </nav>

        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <Link to="/create-article" className="publish-cta-btn">
                <span>+</span> Publicar
              </Link>

              <div className="profile-dropdown-container" ref={dropdownMenuRef}>
                <div
                  className="profile-avatar-trigger"
                  onClick={toggleDropdown}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.name}
                      className="navbar-avatar-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="navbar-avatar-fallback">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">{user?.name}</p>
                      <p className="dropdown-user-email">{user?.email}</p>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link
                      to="/my-articles"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ArticleIcon size={16} /> Meus Artigos
                    </Link>
                    <Link
                      to="/edit-profile/me"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <SettingsIcon size={16} /> Configurações de Perfil
                    </Link>
                    <hr className="dropdown-divider" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item dropdown-logout-btn"
                    >
                      <LogoutIcon size={16} /> Desconectar
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="login-link">
                Entrar
              </Link>
              <Link to="/register" className="register-cta-btn">
                Registrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;