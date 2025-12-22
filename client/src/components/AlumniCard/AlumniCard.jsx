import React from 'react';
import { GraduationCap, Calendar, MapPin, Building, Mail, Phone, Linkedin } from 'lucide-react';
import styles from './AlumniCard.module.css';

const AlumniCard = ({ data, onClick }) => {
  return (
    <div className={styles.card} onClick={() => onClick(data)}>
      <img src={data.foto} alt={data.nome} className={styles.profilePic} />
      <h3>{data.nome}</h3>
      <p><GraduationCap size={16} /> {data.curso}</p>
      <p><Calendar size={16} /> Turma de {data.ano}</p>
      <p><MapPin size={16} /> {data.cidade}, {data.estado}</p>
      <p><Building size={16} /> {data.empresa}</p>

      <div className={styles.icons}>
        <button title="Email"><Mail size={18} /></button>
        <button title="Telefone"><Phone size={18} /></button>
        <button title="LinkedIn"><Linkedin size={18} /></button>
      </div>
    </div>
  );
};

export default AlumniCard;
