// src/components/Navbar/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

  const profilePicture = user?.profilePictureUrl || '/images/default_profile.png';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">M.</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item separator">
          <Link to="/articles" className="nav-link">Artigos</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/create-article" className="nav-link">Publicar</Link>
            </li>
            <li className="nav-item profile-dropdown-container">
              <div className="profile-avatar" onClick={toggleDropdown}>
                <img src={profilePicture} alt="Profile" />
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu" ref={dropdownMenuRef}>
                  <Link to={`/edit-profile/${user?.id}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Perfil
                  </Link>
                  {/* NOVO ITEM: Meus Artigos */}
                  <Link to={`/my-articles`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Meus Artigos
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Desconectar
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li className="nav-item separator">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link register-button">Registrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;