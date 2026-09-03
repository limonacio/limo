import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef, useCallback } from 'react'
import LimonacioIcon from '../../components/LimonacioIcon/LimonacioIcon'
import styles from './Hero.module.css'

// ── Franjas horarias ──────────────────────────────────────────
const SLOTS = [
  {
    name: 'amanecer',
    range: [6, 9],
    type: 'images',
    images: [
      '/assets/img/hero/amanecer-joao-pessoa.png',
      '/assets/img/hero/amanecer-joao-pessoa2.png',
      '/assets/img/hero/amanecer-joao-pessoa3.png',
      '/assets/img/hero/amanecer-joao-pessoa4.png',
    ],
  },
  {
    name: 'glaciar',
    range: [9, 16],
    type: 'video',
  },
  {
    name: 'tarde',
    range: [16, 20],
    type: 'images',
    images: [
      '/assets/img/hero/atardecer-pipa.png',
      '/assets/img/hero/atardecer-pipa2.png',
      '/assets/img/hero/atardecer-pipa3.png',
      '/assets/img/hero/atardecer-pipa4.png',
      '/assets/img/hero/floripa-siesta.png',
      '/assets/img/hero/joao-pessoa-siesta.png',
      '/assets/img/hero/maceio.png',
      '/assets/img/hero/maceio-estatua-graciliano-ramos.png',
      '/assets/img/hero/porto-de-galinhas-siesta.png',
      '/assets/img/hero/porto-de-galinhas-siesta2.png',
      '/assets/img/hero/yendo-sao-paulo-siesta.png',
      '/assets/img/hero/yendo-sao-paulo-siesta2.png',
    ],
  },
  {
    name: 'noche',
    range: [20, 6],
    type: 'images',
    images: [
      '/assets/img/hero/bsas-llegando-noche.png',
      '/assets/img/hero/bsas-llegando-noche2.png',
      '/assets/img/hero/natal-noche-llegada.png',
    ],
  },
]

// Fotos verticales — reciben tratamiento blur + centrado
const VERTICAL = new Set([
  '/assets/img/hero/bsas-llegando-noche.png',
  '/assets/img/hero/natal-noche-llegada.png',
  '/assets/img/hero/yendo-sao-paulo-siesta.png',
  '/assets/img/hero/yendo-sao-paulo-siesta2.png',
])

function getTimeSlotIndex() {
  const h = new Date().getHours()
  if (h >= 6  && h < 9)  return 0 // amanecer
  if (h >= 9  && h < 16) return 1 // glaciar
  if (h >= 16 && h < 20) return 2 // tarde
  return 3                         // noche
}

const DEFAULT_INTERVAL = 18000 // ms — fallback antes de detectar duración del video

export default function Hero() {
  const { t } = useTranslation()
  const videoRef    = useRef(null)
  const timerRef    = useRef(null)
  const slotIdxRef  = useRef(getTimeSlotIndex())

  const [slotIdx,     setSlotIdx]     = useState(getTimeSlotIndex)
  const [imgIdx,      setImgIdx]      = useState(0)
  const [visible,     setVisible]     = useState(true)
  const [intervalMs,  setIntervalMs]  = useState(DEFAULT_INTERVAL)

  // mantener ref sincronizada para closures del timer
  useEffect(() => { slotIdxRef.current = slotIdx }, [slotIdx])

  const slot       = SLOTS[slotIdx]
  const currentImg = slot.type === 'images' ? slot.images[imgIdx] : null
  const isVertical = currentImg ? VERTICAL.has(currentImg) : false

  // Detectar duración del video y calibrar el intervalo (½ duración)
  const handleVideoMeta = () => {
    if (videoRef.current?.duration) {
      setIntervalMs(Math.round(videoRef.current.duration * 500))
    }
  }

  // Play/pause del video según slot activo
  useEffect(() => {
    if (!videoRef.current) return
    if (slot.type === 'video') {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [slot])

  // Avanzar imagen con crossfade
  const advance = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setImgIdx(i => {
        const imgs = SLOTS[slotIdxRef.current]?.images
        return imgs ? (i + 1) % imgs.length : 0
      })
      setVisible(true)
    }, 500)
  }, [])

  // Timer del carousel (solo franjas de imagen)
  useEffect(() => {
    clearInterval(timerRef.current)
    if (slot.type === 'video') return
    timerRef.current = setInterval(advance, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [slot, advance, intervalMs])

  // Reset al cambiar de slot
  useEffect(() => {
    setImgIdx(0)
    setVisible(true)
  }, [slotIdx])

  // Toggle misterioso: cicla entre los 4 slots
  const handleToggle = () => setSlotIdx(i => (i + 1) % SLOTS.length)

  return (
    <section id="hero" className={styles.hero}>

      {/* Video — siempre en el DOM para detectar duración */}
      <video
        ref={videoRef}
        className={`${styles.videoBg} ${slot.type !== 'video' ? styles.videoHidden : ''}`}
        autoPlay muted loop playsInline preload="auto"
        onLoadedMetadata={handleVideoMeta}
      >
        <source src="/rompimiento-glaciar.webm" type="video/webm" />
        <source src="/rompimiento-glaciar.mp4"  type="video/mp4" />
      </video>

      {/* Fondo imagen: blur expandido (siempre) + foto centrada (solo verticales) */}
      {slot.type === 'images' && currentImg && (
        <>
          <div
            className={styles.imgBlur}
            style={{
              backgroundImage: `url(${currentImg})`,
              opacity: visible ? 1 : 0,
            }}
          />
          {isVertical && (
            <img
              src={currentImg}
              alt=""
              className={`${styles.imgCentered} ${visible ? styles.imgVisible : ''}`}
            />
          )}
        </>
      )}

      {/* Overlay oscuro */}
      <div className={styles.videoOverlay} />

      {/* Contenido */}
      <div className={styles.heroContent}>
        <div className={styles.glow} />
        <LimonacioIcon size={160} spin pulse dots />
        <h1 className={styles.title}>limonacio</h1>
        <p className={styles.subtitle}>
          {t('hero.tagline')}<br/>
          {t('hero.subtitle')}
        </p>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dot1}`} />
          <span className={`${styles.dot} ${styles.dot2}`} />
          <span className={`${styles.dot} ${styles.dot3}`} />
        </div>
        <div className={styles.cta}>
          <a href="#trabajos"    className={`${styles.btn} ${styles.btnPrimary}`}>{t('hero.cta_work')}</a>
          <a href="#miscelaneas" className={`${styles.btn} ${styles.btnSecondary}`}>{t('hero.cta_misc')}</a>
        </div>
      </div>

      {/* Toggle misterioso */}
      <button className={styles.toggleBtn} onClick={handleToggle} aria-label="cambiar vista" title="">
        ◎
      </button>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#555" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2.5" fill="#555">
            <animate attributeName="cy" values="8;14;8" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
        {t('hero.scroll')}
      </div>

    </section>
  )
}
