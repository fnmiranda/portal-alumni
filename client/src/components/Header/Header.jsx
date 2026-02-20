import React from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({
  onAddClick,
  isLoggedIn,
  setIsLoggedIn,
  addLabel = 'ADICIONAR PERFIL',
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
    localStorage.removeItem('token');
  };

  const links = [
    {
      src: 'https://alumniime.com.br/',
      label: 'ASSOCIAÇÃO',
    },
    {
      src: 'https://alumniime.com.br/eventos',
      label: 'EVENTOS',
    },
    {
      src: 'https://alumniime.com.br/projetos',
      label: 'PROJETOS',
    },
    {
      src: 'http://localhost:5173/',
      label: 'PORTAL DE ALUNOS',
    },
    {
      src: 'https://www.reserva.ink/alumniime#',
      label: 'LOJA ALUMNIIME',
    },
    {
      src: 'https://alumniime.com.br/',
      label: 'VAGAS',
    },
    {
      src: 'https://alumniime.com.br/transparencia',
      label: 'TRANSPARÊNCIA',
    },
    {
      src: 'https://alumniime.com.br/doe',
      label: 'DOAR',
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.titleLogo} onClick={() => navigate('/')}>
          <div className={styles.logoWrapper}>
            <img
              src="https://optim.tildacdn.one/tild6638-3331-4435-b761-623064663465/-/resize/90x/-/format/webp/AlumniIME_Logo.png.webp"
              alt="Logo alumni"
              width={96}
              height={120}
            />
          </div>
        </h1>
        <div className={styles.linksContainer}>
          {links.map((path, index) =>
            path.label === 'PORTAL DE ALUNOS' ? (
              <a key={index} className={styles.linkPortal} href={path.src}>
                {path.label}
              </a>
            ) : (
              <a key={index} className={styles.links} href={path.src}>
                {path.label}
              </a>
            ),
          )}
        </div>
        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <button className={styles.addBtn} onClick={onAddClick}>
                <Plus size={16} /> {addLabel}
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} /> SAIR
              </button>
            </>
          ) : (
            <button
              className={styles.loginBtn}
              onClick={() => navigate('/login')}
            >
              ENTRAR
            </button>
          )}
        </div>
      </div>
      <div className={styles.subtitle}>
        <strong>ENCONTRE EX-ALUNOS DO IME</strong>
      </div>
      <div className={styles.inferiorBar}></div>
    </header>
  );
};

export default Header;
