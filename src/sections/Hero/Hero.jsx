import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import LimonacioIcon from '../../components/LimonacioIcon/LimonacioIcon'
import styles from './Hero.module.css'
import { PLACEHOLDERS } from './placeholders'

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
    shuffle: true,
    frames: [
      ['/assets/img/hero/natal-amanecer-fuego.webp'],
      ['/assets/img/hero/natal-amanecer-sol.webp'],
      ['/assets/img/hero/natal-amanecer-sol3.webp'],
    ],
  },
  {
    name: 'glaciar',
    range: [9, 16],
    type: 'video',
  },
  {
    name: 'tarde',
    range: [16, 21],
    type: 'images',
    shuffle: true,
    frames: [
      // El orden se sortea en cada visita (ver buildOrder), evitando dos seguidas del mismo lugar
      ['/assets/img/hero/pipa-tarde-arcoiris.webp'],
      ['/assets/img/hero/floripa-avion-bahia.webp'],
      ['/assets/img/hero/maceio-tarde-olas.webp'],
      ['/assets/img/hero/pipa-tarde-playa.webp'],
      ['/assets/img/hero/floripa-manha-ondas3.webp'],
      ['/assets/img/hero/pernambuco-tarde-laguna.webp'],
      ['/assets/img/hero/natal-atardecer-barcos.webp'],
      ['/assets/img/hero/maceio-tarde-praia.webp'],
      ['/assets/img/hero/pipa-tarde-barcos.webp'],
      ['/assets/img/hero/ruta-tarde-kombi.webp'],
      ['/assets/img/hero/floripa-tarde-morro.webp'],
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
      ['/assets/img/hero/ruta-tarde-rio.webp'],
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
    range: [21, 4],   // cruza la medianoche
    type: 'images',
    shuffle: true,
    frames: [
      ['/assets/img/hero/avion-atarmanecer.webp'],
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

const MOBILE_QUERY = '(max-width: 640px)'   // mismo corte que el CSS

// El usuario pidió "reducir movimiento" en su sistema operativo (accesibilidad):
// sin video en movimiento, sin parallax y sin animaciones en bucle.
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isVerticalFrame = (frame) => frame.length === 1 && VERTICAL.has(frame[0])
const lugarDe = (frame) => frame[0].split('/').pop().split('-')[0]   // 'pipa-tarde-playa.webp' → 'pipa'

// Orden al azar, intentando no poner dos fotos seguidas del mismo lugar
function shuffleSinRepetirLugar(frames) {
  const resto = [...frames]
  const orden = []
  while (resto.length) {
    const ultimo = orden.length ? lugarDe(orden[orden.length - 1]) : null
    const candidatos = resto.filter(f => lugarDe(f) !== ultimo)
    const pool = candidatos.length ? candidatos : resto
    const elegido = pool[Math.floor(Math.random() * pool.length)]
    orden.push(elegido)
    resto.splice(resto.indexOf(elegido), 1)
  }
  return orden
}

// Orden final de una franja:
//  - desktop: primero las horizontales, las verticales al final
//  - mobile:  primero las verticales (se ven mejor), las horizontales al final
function buildOrder(slot) {
  if (slot.type !== 'images') return []
  if (!slot.shuffle) return slot.frames
  const verticales   = shuffleSinRepetirLugar(slot.frames.filter(isVerticalFrame))
  const horizontales = shuffleSinRepetirLugar(slot.frames.filter(f => !isVerticalFrame(f)))
  const esMobile = window.matchMedia(MOBILE_QUERY).matches
  return esMobile ? [...verticales, ...horizontales] : [...horizontales, ...verticales]
}

// ¿La hora h cae dentro de [desde, hasta)? Soporta rangos que cruzan medianoche (ej. 21 → 4)
function inRange(h, [desde, hasta]) {
  return desde < hasta
    ? h >= desde && h < hasta
    : h >= desde || h < hasta
}

// Los horarios salen de SLOTS[].range: única fuente de verdad
function getTimeSlotIndex(now = new Date()) {
  const h   = now.getHours()
  const day = now.getDay()             // 0 = domingo, 6 = sábado
  const esFinDeSemana = day === 0 || day === 6

  const idx = SLOTS.findIndex(slot => inRange(h, slot.range))

  // Fines de semana no hay glaciar: se pasa a la tarde
  if (esFinDeSemana && SLOTS[idx].name === 'glaciar') {
    return SLOTS.findIndex(slot => slot.name === 'tarde')
  }
  return idx
}

const DEFAULT_INTERVAL = 18000

export default function Hero() {
  const { t } = useTranslation()
  const videoRef   = useRef(null)
  const timerRef   = useRef(null)
  const heroRef    = useRef(null)
  const slotIdxRef = useRef(getTimeSlotIndex())

  const [slotIdx,    setSlotIdx]    = useState(getTimeSlotIndex)
  const [imgIdx,     setImgIdx]     = useState(0)
  const [visible,    setVisible]    = useState(true)
  const [posterOn,   setPosterOn]   = useState(true)   // imagen quieta encima del video del glaciar
  const [loadedSrc,  setLoadedSrc]  = useState(null)   // primera foto de la franja que ya terminó de bajar
  const [onda,       setOnda]       = useState(0)      // contador: cada clic en el limón dispara una onda nueva
  const [ahora,      setAhora]      = useState(() => new Date())

  // Reloj del hero: se refresca cada 30 s (suficiente para mostrar hora y minutos)
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { slotIdxRef.current = slotIdx }, [slotIdx])

  const slot  = SLOTS[slotIdx]
  // El orden de las fotos se sortea una vez cada vez que se entra a la franja
  const frames = useMemo(() => buildOrder(slot), [slot])
  const frame  = frames[imgIdx] ?? []

  // Mientras baja la primera foto de la franja se ve su miniatura borrosa
  const firstSrc     = frames.length ? frames[0][0] : null
  const firstPending = firstSrc !== null && loadedSrc !== firstSrc

  // Play / pause del video
  // Al entrar al glaciar: la imagen quieta se ve solo mientras el video carga.
  // Apenas el video puede arrancar, arranca y la imagen se funde.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (slot.type !== 'video') {
      video.pause()
      return
    }
    video.pause()
    if (video.readyState > 0) video.currentTime = 0   // volver al primer cuadro (= póster)
    setPosterOn(true)
    if (REDUCE_MOTION) return          // queda la imagen quieta del glaciar

    // Fundido: el video arranca a velocidad normal por debajo y la imagen quieta se disuelve encima.
    // Si el video no puede arrancar, la imagen queda (nunca se ve fondo vacío).
    let cancelado = false
    video.play()                                        // se resuelve cuando el video realmente arranca
      .then(() => { if (!cancelado) setPosterOn(false) })
      .catch(() => {})
    return () => { cancelado = true }
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
    timerRef.current = setInterval(advance, DEFAULT_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [slot, advance])

  // Reset al cambiar slot
  useEffect(() => {
    setImgIdx(0)
    setVisible(true)
    heroRef.current?.style.setProperty('--parallax-y', '0px')
  }, [slotIdx])

  // Parallax en mobile: fondo baja mientras scrolleás (solo imágenes, no video)
  useEffect(() => {
    if (REDUCE_MOTION) return
    const onScroll = () => {
      if (SLOTS[slotIdxRef.current]?.type === 'video') {
        heroRef.current?.style.setProperty('--parallax-y', '0px')
        return
      }
      heroRef.current?.style.setProperty('--parallax-y', `${window.scrollY * 0.45}px`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Precargar las próximas 2 imágenes para evitar el freeze al cambiar
  useEffect(() => {
    if (slot.type !== 'images') return
    for (let i = 1; i <= 2; i++) {
      const nextFrame = frames[(imgIdx + i) % frames.length]
      nextFrame?.forEach(src => { new Image().src = src })
    }
  }, [imgIdx, slot, frames])

  // Limón: al clic, onda expansiva y recién después baja a misceláneas
  const handleLimonClick = (e) => {
    e.preventDefault()
    const irAMisc = () => document.getElementById('miscelaneas')?.scrollIntoView({ behavior: REDUCE_MOTION ? 'auto' : 'smooth' })
    if (REDUCE_MOTION) { irAMisc(); return }
    setOnda(n => n + 1)
    setTimeout(irAMisc, 450)
  }

  // El toggle nunca entra a madrugada (índice 0): solo aparece a las 4 AM reales
  const handleToggle = () => setSlotIdx(i => {
    const next = (i + 1) % SLOTS.length
    return next === 0 ? 1 : next
  })

  // Hora que se muestra a la derecha (desktop). El lugar de la foto no se muestra:
  // Limo no quiere que se sepa dónde ni en qué momento del día está cada imagen.
  const horaTexto = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

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

    // La primera foto de la franja aparece con fundido recién cuando terminó de bajar
    const isFirst = img === firstSrc
    const waiting = isFirst && firstPending
    const onFirstDone = isFirst ? () => setLoadedSrc(img) : undefined

    if (isV) {
      // Vertical: blur de relleno + foto centrada
      return (
        <>
          <div
            className={styles.imgBlur}
            style={{ backgroundImage: `url(${img})`, opacity: visible && !waiting ? 1 : 0 }}
          />
          <img
            src={img}
            alt=""
            onLoad={onFirstDone}
            onError={onFirstDone}
            className={`${styles.imgCentered} ${visible && !waiting ? styles.imgVisible : ''}`}
          />
        </>
      )
    }

    // Horizontal: foto a full, sin blur
    return (
      <img
        src={img}
        alt=""
        onLoad={onFirstDone}
        onError={onFirstDone}
        className={`${styles.imgCover} ${visible && !waiting ? styles.imgVisible : ''}`}
      />
    )
  }

  return (
    <section id="hero" className={styles.hero} ref={heroRef}>

      {/* Video — solo se descarga en la franja glaciar (pesa ~17 MB) */}
      <video
        ref={videoRef}
        className={`${styles.videoBg} ${slot.type !== 'video' ? styles.videoHidden : ''}`}
        muted loop playsInline
        preload={slot.type === 'video' ? 'auto' : 'none'}
      >
        <source src="/rompimiento-glaciar.webm" type="video/webm" />
        <source src="/rompimiento-glaciar.mp4"  type="video/mp4" />
      </video>

      {/* Imagen quieta del glaciar: tapa el video mientras carga y se funde cuando arranca */}
      {slot.type === 'video' && (
        <img
          src="/assets/img/hero/glaciar-poster.webp"
          alt=""
          className={`${styles.videoPoster} ${posterOn ? '' : styles.videoPosterHidden}`}
        />
      )}

      {/* Miniatura borrosa de la primera foto: se ve al instante y se funde cuando llega la real */}
      {firstSrc && PLACEHOLDERS[firstSrc] && (
        <div
          className={`${styles.imgPlaceholder} ${firstPending ? '' : styles.imgPlaceholderHidden}`}
          style={{ backgroundImage: `url(${PLACEHOLDERS[firstSrc]})` }}
        />
      )}

      {renderBackground()}

      {/* Overlay oscuro */}
      <div className={styles.videoOverlay} />

      {/* Contenido */}
      <div className={styles.heroContent}>
        <div className={styles.glow} />
        <span className={styles.iconWrap}><LimonacioIcon size={160} spin pulse dots /></span>
        <h1 className={styles.title} aria-label="limonacio">
          <span className={styles.titleTexto} aria-hidden="true">limonacio</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -36 494.2 231" className={styles.firma} aria-hidden="true">
            <defs>
              {/* Letras huecas: el trazo grueso menos uno mas fino por dentro */}
              <mask id="firmaHueca" maskUnits="userSpaceOnUse" x="-40" y="-56" width="534" height="271">
                <g fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="0.0,-26 0.0,100" />
                  <polyline points="30.0,0 30.0,100" />
                  <polyline points="60.0,0 60.0,100" />
                  <polyline points="60.0,27 83.0,0 95.1,22 116.7,0 116.7,100" />
                  <polyline points="159.0,0 183.3,44 159.0,100 134.7,44 159.0,0 183.3,44" />
                  <polyline points="201.3,0 201.3,100" />
                  <polyline points="201.3,24 220.2,0 239.1,26 239.1,185" />
                  <polyline points="307.1,4 280.1,100 257.1,50 277.3,0 316.5,96" />
                  <polyline points="369.6,4 334.5,50 369.6,96" />
                  <polyline points="387.6,0 387.6,100" />
                  <polyline points="429.9,0 454.2,44 429.9,100 405.6,44 429.9,0 454.2,44" />
                </g>
                <g fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="0.0,-26 0.0,100" />
                  <polyline points="30.0,0 30.0,100" />
                  <polyline points="60.0,0 60.0,100" />
                  <polyline points="60.0,27 83.0,0 95.1,22 116.7,0 116.7,100" />
                  <polyline points="159.0,0 183.3,44 159.0,100 134.7,44 159.0,0 183.3,44" />
                  <polyline points="201.3,0 201.3,100" />
                  <polyline points="201.3,24 220.2,0 239.1,26 239.1,185" />
                  <polyline points="307.1,4 280.1,100 257.1,50 277.3,0 316.5,96" />
                  <polyline points="369.6,4 334.5,50 369.6,96" />
                  <polyline points="387.6,0 387.6,100" />
                  <polyline points="429.9,0 454.2,44 429.9,100 405.6,44 429.9,0 454.2,44" />
                </g>
              </mask>
            </defs>
            <line x1="-16" y1="50" x2="470.20000000000005" y2="50" className={styles.firmaLinea} />
            <g className={styles.firmaHueca} mask="url(#firmaHueca)">
              <polyline points="0.0,-26 0.0,100" />
              <polyline points="30.0,0 30.0,100" />
              <polyline points="60.0,0 60.0,100" />
              <polyline points="60.0,27 83.0,0 95.1,22 116.7,0 116.7,100" />
              <polyline points="159.0,0 183.3,44 159.0,100 134.7,44 159.0,0 183.3,44" />
              <polyline points="201.3,0 201.3,100" />
              <polyline points="201.3,24 220.2,0 239.1,26 239.1,185" />
              <polyline points="307.1,4 280.1,100 257.1,50 277.3,0 316.5,96" />
              <polyline points="369.6,4 334.5,50 369.6,96" />
              <polyline points="387.6,0 387.6,100" />
              <polyline points="429.9,0 454.2,44 429.9,100 405.6,44 429.9,0 454.2,44" />
            </g>
            <g className={styles.firmaSolida}>
              <polyline points="0.0,-26 0.0,100" />
              <polyline points="30.0,0 30.0,100" />
              <polyline points="60.0,0 60.0,100" />
              <polyline points="60.0,27 83.0,0 95.1,22 116.7,0 116.7,100" />
              <polyline points="159.0,0 183.3,44 159.0,100 134.7,44 159.0,0 183.3,44" />
              <polyline points="201.3,0 201.3,100" />
              <polyline points="201.3,24 220.2,0 239.1,26 239.1,185" />
              <polyline points="307.1,4 280.1,100 257.1,50 277.3,0 316.5,96" />
              <polyline points="369.6,4 334.5,50 369.6,96" />
              <polyline points="387.6,0 387.6,100" />
              <polyline points="429.9,0 454.2,44 429.9,100 405.6,44 429.9,0 454.2,44" />
            </g>
          </svg>
        </h1>
        {/* Subtitulo y boton: en desktop comparten ancho para poder alinearlos */}
        <div className={styles.bloqueIzq}>
          <p className={styles.subtitle}>
            <span className={styles.tagline}>{t('hero.tagline')}<br/></span>
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

      </div>

      {/* Columna derecha (solo desktop): limón (a misceláneas) y la hora */}
      <div className={styles.colDerecha}>
          {/* Limón: botón a misceláneas (solo desktop). Quieto; onda expansiva al clic */}
          <a href="#miscelaneas" className={styles.limonBtn} onClick={handleLimonClick}>
            <span className={styles.limonIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 156 120" className={styles.limonSvg} aria-hidden="true"><g transform="rotate(-40 68 50)"><defs><mask id="ahC" maskUnits="userSpaceOnUse" x="-30" y="-30" width="200" height="170"><rect x="-30" y="-30" width="200" height="170" fill="#fff"/><path d="M53 21 L66 21 A9 29 0 0 1 66 79 L53 79Z" fill="#000" stroke="#000" strokeWidth="3"/><ellipse cx="53" cy="50" rx="9" ry="29" fill="#000" stroke="#000" strokeWidth="3"/><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="#000" stroke="#000" strokeWidth="3"/></mask><mask id="bhC" maskUnits="userSpaceOnUse" x="-30" y="-30" width="200" height="170"><rect x="-30" y="-30" width="200" height="170" fill="#fff"/><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="#000" stroke="#000" strokeWidth="3"/></mask><mask id="ahC2" maskUnits="userSpaceOnUse" x="-30" y="-30" width="200" height="170"><rect x="-30" y="-30" width="200" height="170" fill="#fff"/><path d="M53 21 L66 21 A9 29 0 0 1 66 79 L53 79Z" fill="#000" stroke="#000" strokeWidth="3"/><ellipse cx="53" cy="50" rx="9" ry="29" fill="#000" stroke="#000" strokeWidth="3"/><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="#000" stroke="#000" strokeWidth="3"/></mask><mask id="bhC2" maskUnits="userSpaceOnUse" x="-30" y="-30" width="200" height="170"><rect x="-30" y="-30" width="200" height="170" fill="#fff"/><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="#000" stroke="#000" strokeWidth="3"/></mask><mask id="limonHueco" maskUnits="userSpaceOnUse" x="-60" y="-60" width="300" height="260"><g mask="url(#ahC)"><path d="M103 49 L107 46" stroke="#fff" strokeWidth="3.0" strokeLinecap="round" fill="none"/><path d="M106 45 C100 30 105 16 117 10 C121 24 116 39 106 45Z" fill="none" stroke="#fff" strokeWidth="3.0" strokeLinejoin="round"/><path d="M107 43 L116 13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><path d="M107 48 C119 45 131 51 135 62 C123 65 112 60 107 48Z" fill="none" stroke="#fff" strokeWidth="3.0" strokeLinejoin="round"/><path d="M109 49 L133 61" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><path d="M76 25 C88 25 100 40 103 50 C100 60 88 75 76 75" fill="none" stroke="#fff" strokeWidth="3.0" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="76" cy="50" rx="8" ry="25" fill="none" stroke="#fff" strokeWidth="3.0"/><ellipse cx="76" cy="50" rx="5.9" ry="20.0" fill="none" stroke="#fff" strokeWidth="2.0"/><line x1="76" y1="50" x2="81.5" y2="57.5" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="78.3" y2="68.4" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="73.8" y2="68.5" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="70.6" y2="57.8" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="70.5" y2="42.5" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="73.7" y2="31.6" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="78.2" y2="31.5" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="81.4" y2="42.2" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/></g><g mask="url(#bhC)"><path d="M53 21 L66 21 A9 29 0 0 1 66 79 L53 79" fill="none" stroke="#fff" strokeWidth="3.0" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="53" cy="50" rx="9" ry="29" fill="none" stroke="#fff" strokeWidth="3.0"/><ellipse cx="53" cy="50" rx="6.7" ry="23.2" fill="none" stroke="#fff" strokeWidth="2.0"/><line x1="53" y1="50" x2="59.2" y2="58.7" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="55.6" y2="71.4" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="50.5" y2="71.5" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="46.9" y2="59.1" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="46.8" y2="41.3" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="50.4" y2="28.6" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="55.5" y2="28.5" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="59.1" y2="40.9" stroke="#fff" strokeWidth="2.0" strokeLinecap="round"/></g><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="none" stroke="#fff" strokeWidth="3.0" strokeLinejoin="round" strokeLinecap="round"/><g mask="url(#ahC)"><path d="M103 49 L107 46" stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M106 45 C100 30 105 16 117 10 C121 24 116 39 106 45Z" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/><path d="M107 43 L116 13" stroke="#000" strokeWidth="0.3" strokeLinecap="round"/><path d="M107 48 C119 45 131 51 135 62 C123 65 112 60 107 48Z" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/><path d="M109 49 L133 61" stroke="#000" strokeWidth="0.3" strokeLinecap="round"/><path d="M76 25 C88 25 100 40 103 50 C100 60 88 75 76 75" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="76" cy="50" rx="8" ry="25" fill="none" stroke="#000" strokeWidth="1.5"/><ellipse cx="76" cy="50" rx="5.9" ry="20.0" fill="none" stroke="#000" strokeWidth="0.5"/><line x1="76" y1="50" x2="81.5" y2="57.5" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="78.3" y2="68.4" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="73.8" y2="68.5" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="70.6" y2="57.8" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="70.5" y2="42.5" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="73.7" y2="31.6" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="78.2" y2="31.5" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="76" y1="50" x2="81.4" y2="42.2" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/></g><g mask="url(#bhC)"><path d="M53 21 L66 21 A9 29 0 0 1 66 79 L53 79" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="53" cy="50" rx="9" ry="29" fill="none" stroke="#000" strokeWidth="1.5"/><ellipse cx="53" cy="50" rx="6.7" ry="23.2" fill="none" stroke="#000" strokeWidth="0.5"/><line x1="53" y1="50" x2="59.2" y2="58.7" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="55.6" y2="71.4" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="50.5" y2="71.5" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="46.9" y2="59.1" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="46.8" y2="41.3" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="50.4" y2="28.6" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="55.5" y2="28.5" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/><line x1="53" y1="50" x2="59.1" y2="40.9" stroke="#000" strokeWidth="0.5" strokeLinecap="round"/></g><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/></mask></defs><g className={styles.limonHueco} mask="url(#limonHueco)"><g mask="url(#ahC)"><path d="M103 49 L107 46" stroke="#900030" strokeWidth="3" strokeLinecap="round" fill="none"/><path d="M106 45 C100 30 105 16 117 10 C121 24 116 39 106 45Z" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round"/><path d="M107 43 L116 13" stroke="#900030" strokeWidth="1.8" strokeLinecap="round"/><path d="M107 48 C119 45 131 51 135 62 C123 65 112 60 107 48Z" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round"/><path d="M109 49 L133 61" stroke="#900030" strokeWidth="1.8" strokeLinecap="round"/><path d="M76 25 C88 25 100 40 103 50 C100 60 88 75 76 75" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="76" cy="50" rx="8" ry="25" fill="none" stroke="#2ECC80" strokeWidth="3"/><ellipse cx="76" cy="50" rx="5.9" ry="20.0" fill="none" stroke="#900030" strokeWidth="2.0"/><line x1="76" y1="50" x2="81.5" y2="57.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="78.3" y2="68.4" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="73.8" y2="68.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="70.6" y2="57.8" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="70.5" y2="42.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="73.7" y2="31.6" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="78.2" y2="31.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="81.4" y2="42.2" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/></g><g mask="url(#bhC)"><path d="M53 21 L66 21 A9 29 0 0 1 66 79 L53 79" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="53" cy="50" rx="9" ry="29" fill="none" stroke="#2ECC80" strokeWidth="3"/><ellipse cx="53" cy="50" rx="6.7" ry="23.2" fill="none" stroke="#900030" strokeWidth="2.0"/><line x1="53" y1="50" x2="59.2" y2="58.7" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="55.6" y2="71.4" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="50.5" y2="71.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="46.9" y2="59.1" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="46.8" y2="41.3" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="50.4" y2="28.6" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="55.5" y2="28.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="59.1" y2="40.9" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/></g><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/></g><g className={styles.limonSolido}><g mask="url(#ahC2)"><path d="M103 49 L107 46" stroke="#900030" strokeWidth="3" strokeLinecap="round" fill="none"/><path d="M106 45 C100 30 105 16 117 10 C121 24 116 39 106 45Z" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round"/><path d="M107 43 L116 13" stroke="#900030" strokeWidth="1.8" strokeLinecap="round"/><path d="M107 48 C119 45 131 51 135 62 C123 65 112 60 107 48Z" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round"/><path d="M109 49 L133 61" stroke="#900030" strokeWidth="1.8" strokeLinecap="round"/><path d="M76 25 C88 25 100 40 103 50 C100 60 88 75 76 75" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="76" cy="50" rx="8" ry="25" fill="none" stroke="#2ECC80" strokeWidth="3"/><ellipse cx="76" cy="50" rx="5.9" ry="20.0" fill="none" stroke="#900030" strokeWidth="2.0"/><line x1="76" y1="50" x2="81.5" y2="57.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="78.3" y2="68.4" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="73.8" y2="68.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="70.6" y2="57.8" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="70.5" y2="42.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="73.7" y2="31.6" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="78.2" y2="31.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="76" y1="50" x2="81.4" y2="42.2" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/></g><g mask="url(#bhC2)"><path d="M53 21 L66 21 A9 29 0 0 1 66 79 L53 79" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/><ellipse cx="53" cy="50" rx="9" ry="29" fill="none" stroke="#2ECC80" strokeWidth="3"/><ellipse cx="53" cy="50" rx="6.7" ry="23.2" fill="none" stroke="#900030" strokeWidth="2.0"/><line x1="53" y1="50" x2="59.2" y2="58.7" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="55.6" y2="71.4" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="50.5" y2="71.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="46.9" y2="59.1" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="46.8" y2="41.3" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="50.4" y2="28.6" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="55.5" y2="28.5" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/><line x1="53" y1="50" x2="59.1" y2="40.9" stroke="#900030" strokeWidth="2.0" strokeLinecap="round"/></g><path d="M0 50 C2 46 6 44 9 40 C16 27 27 20 38 20 C44 29 47 41 47 50 C47 59 44 71 38 80 C27 80 16 73 9 60 C6 56 2 54 0 50Z" fill="none" stroke="#2ECC80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/></g></g></svg>
              {onda > 0 && <span key={onda} className={styles.limonRipple} />}
            </span>
            <span>{t('hero.cta_misc')} ↓</span>
          </a>
        <span className={styles.hora}>{horaTexto}</span>
      </div>

      {/* Toggle misterioso */}
      <button className={styles.toggleBtn} onClick={handleToggle} aria-label={t('hero.toggle')}>
        ◎
      </button>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#555" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2.5" fill="#555">
            {!REDUCE_MOTION && (
              <>
                <animate attributeName="cy" values="8;14;8" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/>
              </>
            )}
          </circle>
        </svg>
        {t('hero.scroll')}
      </div>

    </section>
  )
}
