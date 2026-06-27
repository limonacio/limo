import styles from './MiscCard.module.css'

export default function MiscCard({ proyecto, lang = 'en' }) {
  const { titulo, subtitulo, descripcion, imagen, video, link } = proyecto

  const sub  = typeof subtitulo   === 'object' ? subtitulo[lang]   || subtitulo.en : subtitulo
  const desc = typeof descripcion === 'object' ? descripcion[lang] || descripcion.en : descripcion

  const imgSrc = imagen ? `/assets/img/${imagen}` : null

  const handleClick = () => {
    if (video) window.open(video, '_blank')
    else if (link) window.open(link, '_blank')
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.thumb}>
        {imgSrc
          ? <img src={imgSrc} alt={titulo} className={styles.img} />
          : <div className={styles.thumbBg} />
        }
        <div className={styles.overlay} />
        {(video || link) && (
          <div className={styles.playBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3 L15 9 L5 15 Z" fill="white"/>
            </svg>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <span className={styles.subtitulo}>{sub}</span>
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.desc}>{desc}</p>
      </div>
    </div>
  )
}
