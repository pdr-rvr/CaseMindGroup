// src/components/Navbar/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'; // Importe os estilos como um módulo
import { useAuth } from '../../context/AuthContext'; // Importe o hook de autenticação

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Pega o estado e funções do contexto
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Usar navigate('/') é mais idiomático com React Router do que window.location.reload()
    navigate('/');
    // Se você realmente precisa de um refresh completo para recarregar dados iniciais,
    // window.location.reload() pode ser usado, mas é menos performático.
  };

  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    setShowDropdown(false); // Fecha o dropdown ao desconectar
    navigate('/login'); // Redireciona para login após o logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={handleLogoClick}>
        M.
      </div>
      {/* Container para a lista de navegação e o dropdown/botões de auth */}
      <ul className={styles.navList}>
        {/* Itens sempre visíveis (Home, Artigos) */}
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/articles" className={styles.navLink}>Artigos</Link>
        </li>

        {isAuthenticated ? (
          // Opções para usuário logado
          <>
            <li className={styles.navItem}>
              <Link to="/article/new" className={`${styles.navLink} ${styles.mainButton}`}>Publicar</Link> {/* Botão "Publicar" */}
            </li>
            <li className={styles.navItem}> {/* Este li é para o dropdown */}
              <div className={styles.userDropdownContainer} onClick={() => setShowDropdown(!showDropdown)}>
                <img
                  //src={user?.profilePictureUrl || 'https://via.placeholder.com/40'} // Use a URL da imagem do usuário ou um placeholder
                  alt={user?.name || 'User'}
                  className={styles.userAvatar}
                />
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <Link to={`/user/${user?.id}`} className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>Perfil</Link>
                    <button onClick={handleLogout} className={styles.dropdownItem}>Desconectar</button>
                  </div>
                )}
              </div>
            </li>
          </>
        ) : (
          // Opções para usuário não logado
          <>
            <li className={styles.navItem}>
              <Link to="/login" className={styles.navLink}>Entrar</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/register" className={`${styles.navLink} ${styles.mainButton}`}>Registrar</Link> {/* Botão "Registrar" */}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;