import React from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({
  onAddClick,
  isLoggedIn,
  setIsLoggedIn,
  addLabel = 'Adicionar Perfil',
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
    localStorage.removeItem('token');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.titleLogo} onClick={() => navigate('/')}>
          <div className={styles.logoWrapper}>
            <img src="https://optim.tildacdn.one/tild6638-3331-4435-b761-623064663465/-/resize/90x/-/format/webp/AlumniIME_Logo.png.webp" alt="Logo alumni" width={80} height={100} />
          </div>
          <div className={styles.titleAlum}>ALUMNI</div>
          
        </h1>

        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <button className={styles.addBtn} onClick={onAddClick}>
                <Plus size={18} /> {addLabel}
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={18} /> Sair
              </button>
            </>
          ) : (
            <button
              className={styles.loginBtn}
              onClick={() => navigate('/login')}
            >
              Entrar
            </button>
          )}
        </div>
      </div>
      <div className={styles.subtitle}>
        <strong>ENCONTRE EX-ALUNOS DO IME</strong>
      </div>
    </header>
  );
};

export default Header;
