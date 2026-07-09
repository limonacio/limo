// lang prop viene de la sección padre (i18n.language)
import { useState } from 'react'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ proyecto, lang = 'en' }) {
  const { titulo, subtitulo, descripcion, imagen, link, featured, glow } = proyecto
  const [hovered, setHovered] = useState(false)

  const sub  = typeof subtitulo   === 'object' ? subtitulo[lang]   || subtitulo.en : subtitulo
  const desc = typeof descripcion === 'object' ? descripcion[lang] || descripcion.en : descripcion

  const imgSrc = imagen
    ? (imagen.startsWith('http') ? imagen : `/assets/img/${imagen}`)
    : null

  const isExternal = link && (link.startsWith('http://') || link.startsWith('https://'))
  const Wrapper = link ? 'a' : 'div'
  const wrapperProps = link
    ? isExternal
      ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
      : { href: link }
    : {}

  return (
    <Wrapper
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      style={glow ? {
        boxShadow: hovered ? `0 0 40px 8px ${glow}22` : `0 0 20px 3px ${glow}08`,
        transition: 'box-shadow 0.35s ease',
      } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...wrapperProps}
    >
      <div className={styles.thumb}>
        {imgSrc && (
          <div className={styles.blur} style={{ backgroundImage: `url(${imgSrc})` }} />
        )}
        {imgSrc
          ? <img src={imgSrc} alt={titulo} className={styles.img} />
          : <PlaceholderThumb />
        }
        <div className={styles.overlay} />
      </div>

      <div className={styles.body}>
        <span className={styles.subtitulo}>{sub}</span>
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.desc}>{desc}</p>
      </div>
    </Wrapper>
  )
}

function PlaceholderThumb() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.18">
      <rect x="4" y="4" width="40" height="40" rx="6" stroke="#3DDBD9" strokeWidth="2"/>
      <path d="M14 34 L22 22 L30 30 L36 24" stroke="#3DDBD9" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="34" cy="18" r="3" fill="#F0526A"/>
    </svg>
  )
}