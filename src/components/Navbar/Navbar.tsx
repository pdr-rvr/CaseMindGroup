import React from 'react';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={handleLogoClick}>
        M.
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/" className={styles.navLink}>Home</a>
        </li>
        <li className={styles.navItem}>
          <a href="/articles" className={styles.navLink}>Artigos</a>
        </li>
        <li className={styles.navItem}>
          <a href="/login" className={styles.navLink}>Entrar</a>
        </li>
        <li className={styles.navItem}>
          <a href="/register" className={`${styles.navLink} ${styles.registerButton}`}>Registrar</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;