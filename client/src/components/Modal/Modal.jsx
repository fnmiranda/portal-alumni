import React from 'react';
import { X, GraduationCap, MapPin, Briefcase, Mail, Linkedin, User } from 'lucide-react';
import styles from './Modal.module.css';

const Modal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        {/* Cabeçalho do Perfil */}
        <header className={styles.header}>
          <img src={data.foto} alt={data.nome} className={styles.avatar} />
          <div className={styles.titleInfo}>
            <h1>{data.nome}</h1>
            <p className={styles.headline}>{data.cargo} na {data.empresa}</p>
          </div>
        </header>

        <div className={styles.content}>
          {/* Coluna Esquerda */}
          <div className={styles.mainInfo}>
            <section>
              <h3><User size={18} /> Informações Pessoais</h3>
              <ul>
                <li><GraduationCap size={16} /> {data.curso} • Turma de {data.ano}</li>
                <li><MapPin size={16} /> {data.cidade}, {data.estado}</li>
                <li><Briefcase size={16} /> {data.tempoExperiencia} de experiência</li>
              </ul>
            </section>

            <section>
              <h3>Sobre</h3>
              <p className={styles.description}>{data.sobre}</p>
            </section>

            <section>
              <h3>Habilidades</h3>
              <div className={styles.tags}>
                {data.habilidades?.map((skill, index) => (
                  <span key={index} className={styles.tag}>{skill}</span>
                ))}
              </div>
            </section>
          </div>

          {/* Coluna Direita */}
          <div className={styles.sideInfo}>
            <section>
              <h3>Informações de Contato</h3>
              <div className={styles.contactItem}>
                <div className={styles.iconBox}><Mail size={16} /></div>
                <div><span>Email</span><p>{data.email}</p></div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.iconBox}><Linkedin size={16} /></div>
                <div><span>LinkedIn</span><p>{data.linkedin}</p></div>
              </div>
            </section>

            <section>
              <h3>Informações Profissionais</h3>
              <div className={styles.contactItem}>
                <div className={styles.iconBox}><Briefcase size={16} /></div>
                <div><span>Empresa</span><p>{data.empresa}</p></div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.iconBox}><Briefcase size={16} /></div>
                <div><span>Cargo</span><p>{data.cargo}</p></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
