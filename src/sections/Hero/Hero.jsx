import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef, useCallback } from 'react'
import LimonacioIcon from '../../components/LimonacioIcon/LimonacioIcon'
import styles from './Hero.module.css'

// ── Franjas horarias ──────────────────────────────────────────
// Cada "frame" es un array: 1 imagen sola, o 2 para mostrar lado a lado
const SLOTS = [
  {
    name: 'madrugada',
    range: [4, 5],
    type: 'images',
    frames: [
      ['/assets/img/hero/trasnochada1.webp'],
      ['/assets/img/hero/trasnochada2.webp'],
      ['/assets/img/hero/trasnochada3.webp'],
    ],
  },
  {
    name: 'amanecer',
    range: [5, 9],
    type: 'images',
    frames: [
      ['/assets/img/hero/natal-amanecer-fuego.webp'],
      ['/assets/img/hero/natal-amanecer-sol.webp'],
      ['/assets/img/hero/natal-amanecer-sol3.webp'],
      ['/assets/img/hero/natal-amanecer-sol4.webp'],
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
    frames: [
      // Mezcladas por lugar para no mostrar seguidas del mismo sitio
      ['/assets/img/hero/pipa-tarde-arcoiris.webp'],
      ['/assets/img/hero/floripa-avion-bahia.webp'],
      ['/assets/img/hero/natal-tarde-ciudad.webp'],
      ['/assets/img/hero/maceio-tarde-olas.webp'],
      ['/assets/img/hero/pipa-tarde-playa.webp'],
      ['/assets/img/hero/floripa-manha-ondas3.webp'],
      ['/assets/img/hero/pernambuco-tarde-laguna.webp'],
      ['/assets/img/hero/natal-atardecer-barcos.webp'],
      ['/assets/img/hero/maceio-tarde-praia.webp'],
      ['/assets/img/hero/pipa-tarde-barcos.webp'],
      ['/assets/img/hero/ruta-tarde-kombi.webp'],
      ['/assets/img/hero/floripa-tarde-morro.webp'],
      ['/assets/img/hero/avion-atardecer.webp'],
      ['/assets/img/hero/pernambuco-tarde-campos.webp'],
      ['/assets/img/hero/natal-atardecer-ciudad.webp'],
      ['/assets/img/hero/porto-tarde-jangada.webp'],
      ['/assets/img/hero/floripa-manha-ondas.webp'],
      ['/assets/img/hero/maceio-tarde-mar.webp'],
      ['/assets/img/hero/pipa-tarde-acantilado.webp'],
      ['/assets/img/hero/ruta-tarde-puente.webp'],
      ['/assets/img/hero/floripa-avion-bahia2.webp'],
      ['/assets/img/hero/porto-tarde-acai.webp'],
      ['/assets/img/hero/rio-santa-cruz-tarde.webp'],
      ['/assets/img/hero/floripa-tarde-morro2.webp'],
      ['/assets/img/hero/pernambuco-tarde-campos2.webp'],
      ['/assets/img/hero/maceio-tarde-orla.webp'],
      ['/assets/img/hero/pipa-tarde-restaurantes.webp'],
      ['/assets/img/hero/ruta-tarde-campos.webp'],
      ['/assets/img/hero/floripa-manha-ondas2.webp'],
      ['/assets/img/hero/maceio-tarde-avenida.webp'],
      ['/assets/img/hero/ruta-tarde-campos2.webp'],
      ['/assets/img/hero/floripa-tarde-avenida.webp'],
      ['/assets/img/hero/floripa-manha-pescador.webp'],
      ['/assets/img/hero/ruta-tarde-colinas.webp'],
    ],
  },
  {
    name: 'noche',
    range: [20, 4],
    type: 'images',
    frames: [
      ['/assets/img/hero/avion-gol-noche.webp'],
      ['/assets/img/hero/avion-bsas-noche1.webp'],
      ['/assets/img/hero/avion-smiles-noche2.webp'],
    ],
  },
]

// Solo las verticales solitarias necesitan blur de fondo
const VERTICAL = new Set([
  '/assets/img/hero/avion-gol-noche.webp',
  '/assets/img/hero/avion-bsas-noche1.webp',
  '/assets/img/hero/avion-smiles-noche2.webp',
  '/assets/img/hero/rio-santa-cruz-tarde.webp',
])

function getTimeSlotIndex() {
  const h = new Date().getHours()
  if (h >= 4  && h < 5)  return 0 // madrugada
  if (h >= 5  && h < 9)  return 1 // amanecer
  if (h >= 9  && h < 16) return 2 // glaciar
  if (h >= 16 && h < 20) return 3 // tarde
  return 4                         // noche
}

const DEFAULT_INTERVAL = 18000

export default function Hero() {
  const { t } = useTranslation()
  const videoRef   = useRef(null)
  const timerRef   = useRef(null)
  const slotIdxRef = useRef(getTimeSlotIndex())

  const [slotIdx,    setSlotIdx]    = useState(getTimeSlotIndex)
  const [imgIdx,     setImgIdx]     = useState(0)
  const [visible,    setVisible]    = useState(true)
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL)

  useEffect(() => { slotIdxRef.current = slotIdx }, [slotIdx])

  const slot  = SLOTS[slotIdx]
  const frame = slot.type === 'images' ? (slot.frames[imgIdx] ?? []) : []

  // Calibrar intervalo con la duración del video
  const handleVideoMeta = () => {
    if (videoRef.current?.duration) {
      setIntervalMs(Math.round(videoRef.current.duration * 500))
    }
  }

  // Play / pause del video
  useEffect(() => {
    if (!videoRef.current) return
    if (slot.type === 'video') {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [slot])

  // Avanzar frame con crossfade
  const advance = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setImgIdx(i => {
        const frames = SLOTS[slotIdxRef.current]?.frames
        return frames ? (i + 1) % frames.length : 0
      })
      setVisible(true)
    }, 500)
  }, [])

  // Timer del carousel
  useEffect(() => {
    clearInterval(timerRef.current)
    if (slot.type === 'video') return
    timerRef.current = setInterval(advance, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [slot, advance, intervalMs])

  // Reset al cambiar slot
  useEffect(() => {
    setImgIdx(0)
    setVisible(true)
  }, [slotIdx])

  // Precargar las próximas 2 imágenes para evitar el freeze al cambiar
  useEffect(() => {
    if (slot.type !== 'images') return
    const frames = slot.frames
    for (let i = 1; i <= 2; i++) {
      const nextFrame = frames[(imgIdx + i) % frames.length]
      nextFrame?.forEach(src => { new Image().src = src })
    }
  }, [imgIdx, slot])

  // El toggle nunca entra a madrugada (índice 0): solo aparece a las 4 AM reales
  const handleToggle = () => setSlotIdx(i => {
    const next = (i + 1) % SLOTS.length
    return next === 0 ? 1 : next
  })

  // ── Render del fondo ──────────────────────────────────────
  const renderBackground = () => {
    if (slot.type === 'video') return null

    // Par: dos imágenes lado a lado
    if (frame.length === 2) {
      return (
        <div className={`${styles.imgPair} ${visible ? styles.imgVisible : ''}`}>
          <img src={frame[0]} alt="" className={styles.imgPairItem} />
          <img src={frame[1]} alt="" className={styles.imgPairItem} />
        </div>
      )
    }

    // Imagen sola
    const img = frame[0]
    if (!img) return null
    const isV = VERTICAL.has(img)

    if (isV) {
      // Vertical: blur de relleno + foto centrada
      return (
        <>
          <div
            className={styles.imgBlur}
            style={{ backgroundImage: `url(${img})`, opacity: visible ? 1 : 0 }}
          />
          <img
            src={img}
            alt=""
            className={`${styles.imgCentered} ${visible ? styles.imgVisible : ''}`}
          />
        </>
      )
    }

    // Horizontal: foto a full, sin blur
    return (
      <img
        src={img}
        alt=""
        className={`${styles.imgCover} ${visible ? styles.imgVisible : ''}`}
      />
    )
  }

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

      {renderBackground()}

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
