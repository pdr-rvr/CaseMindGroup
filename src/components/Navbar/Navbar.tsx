// src/components/Navbar/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // O CSS da Navbar será adaptado ao seu visual

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null); // Ref para o menu dropdown em si

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Fecha o dropdown ao desconectar
    navigate('/login'); // Redireciona para login após logout
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Efeito para fechar o dropdown ao clicar fora
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

  // URL da imagem de perfil: usa a do usuário se existir, senão um placeholder
  // Assumo que 'user.profilePictureUrl' virá do backend e será o caminho completo ou URL
  const profilePicture = user?.profilePictureUrl || '/images/default_profile.png'; //

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">M.</Link> {/* Logo "M." conforme suas imagens */}
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link> {/* */}
        </li>
        <li className="nav-item separator"> {/* Adicionei a classe 'separator' para o '|' */}
          <Link to="/articles" className="nav-link">Artigos</Link> {/* */}
        </li>
        {isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/create-article" className="nav-link">Publicar</Link>
            </li>
            <li className="nav-item profile-dropdown-container">
              <div className="profile-avatar" onClick={toggleDropdown}>
                <img src={profilePicture} alt="Profile" /> {/* Imagem de perfil na bola */}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu" ref={dropdownMenuRef}>
                  <Link to={`/edit-profile/${user?.id}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Perfil
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Desconectar
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <li className="nav-item">
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;