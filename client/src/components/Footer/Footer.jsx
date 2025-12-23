import React from 'react';
import { Linkedin, Facebook, Youtube, Instagram } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Lado Esquerdo: Informações Institucionais */}
        <div className={styles.leftSection}>
          <h3 className={styles.title}>
            Associação dos ex-alunos do Instituto Militar de Engenharia
          </h3>
          <p className={styles.slogan}>Apoiando o IME e a comunidade IMEana.</p>

          <div className={styles.legalInfo}>
            <p>© 2024 Alumni IME. Todos os direitos reservados.</p>
            <p>CNPJ: 19.335.957/0001-17</p>
          </div>
        </div>

        {/* Lado Direito: Social e Links */}
        <div className={styles.rightSection}>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.iconCircle}><Linkedin size={20} fill="currentColor" /></a>
            <a href="#" className={styles.iconCircle}><Facebook size={20} fill="currentColor" /></a>
            <a href="#" className={styles.iconCircle}><Youtube size={20} fill="currentColor" /></a>
            <a href="#" className={styles.iconCircle}><Instagram size={20} /></a>
          </div>

          <a href="#" className={styles.legalLink}>
            Termos de Uso e Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
