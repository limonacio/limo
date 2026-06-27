// lang prop viene de la sección padre (i18n.language)
import styles from './ProjectCard.module.css'

export default function ProjectCard({ proyecto, lang = 'en' }) {
  const { titulo, subtitulo, descripcion, imagen, link, featured } = proyecto

  // subtitulo y descripcion pueden ser string o { en, es }
  const sub  = typeof subtitulo   === 'object' ? subtitulo[lang]   || subtitulo.en : subtitulo
  const desc = typeof descripcion === 'object' ? descripcion[lang] || descripcion.en : descripcion

  const imgSrc = imagen ? `/assets/img/${imagen}` : null

  const Wrapper = link ? 'a' : 'div'
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      {...wrapperProps}
    >
      <div className={styles.thumb}>
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
