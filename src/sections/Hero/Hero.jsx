import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react'
import LimonacioIcon from '../../components/LimonacioIcon/LimonacioIcon'
import LogoTatuaje from '../../components/LogoTatuaje/LogoTatuaje'
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

// Un unico AudioContext para toda la pagina. Crear uno nuevo en cada clic
// falla en mobile: los navegadores limitan cuantos se pueden abrir (Safari
// corta a los pocos) y por eso el sonido dejaba de salir despues de un rato.
let audioCtx = null
function getAudioCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!audioCtx || audioCtx.state === 'closed') audioCtx = new Ctx()
  if (audioCtx.state === 'suspended') audioCtx.resume()   // mobile lo deja dormido hasta el primer gesto
  return audioCtx
}

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
const FUNDIDO = 1200   // ms que dura el fundido entre fotos (ver .imgCover/.imgCentered)

export default function Hero() {
  const { t } = useTranslation()
  const videoRef   = useRef(null)
  const timerRef   = useRef(null)
  const heroRef    = useRef(null)
  const slotIdxRef = useRef(getTimeSlotIndex())

  const [slotIdx,    setSlotIdx]    = useState(getTimeSlotIndex)
  const [imgIdx,     setImgIdx]     = useState(0)
  const [salIdx,     setSalIdx]     = useState(null)   // foto que se esta yendo durante el fundido
  const [posterOn,   setPosterOn]   = useState(true)   // imagen quieta encima del video del glaciar
  const [loadedSrc,  setLoadedSrc]  = useState(null)   // primera foto de la franja que ya terminó de bajar
  const [onda,       setOnda]       = useState(0)      // contador: cada clic en el limón dispara una onda nueva
  const [ahora,      setAhora]      = useState(() => new Date())
  const [logoOn,     setLogoOn]     = useState(false)  // logo mobile encendido mientras dura el clic
  const [logoOnda,   setLogoOnda]   = useState(0)      // contador de halos del logo mobile
  const [logoDesp,   setLogoDesp]   = useState(false)  // logo mobile a medio encender mientras se scrollea
  const [manual,     setManual]     = useState(false)  // true si el visitante eligio la franja con el ◎

  // Reloj del hero: se refresca cada 30 s (suficiente para mostrar hora y minutos).
  // Aprovechamos el mismo intervalo para re-evaluar la FRANJA: la inicial se
  // calcula una sola vez al montar, asi que sin esto una pestania abierta se
  // quedaba clavada en la franja de cuando se cargo (p. ej. seguia en el
  // glaciar a las 16:05). No se toca nada si el visitante eligio con el ◎.
  useEffect(() => {
    const id = setInterval(() => {
      setAhora(new Date())
      if (!manual) {
        const i = getTimeSlotIndex()
        setSlotIdx(prev => (prev === i ? prev : i))
      }
    }, 30000)
    return () => clearInterval(id)
  }, [manual])

  useEffect(() => { slotIdxRef.current = slotIdx }, [slotIdx])
  const imgIdxRef = useRef(0)
  useEffect(() => { imgIdxRef.current = imgIdx }, [imgIdx])

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

  // Avanzar frame con fundido encadenado (crossfade), igual que el glaciar:
  // la foto nueva aparece DEBAJO ya opaca y la vieja se disuelve ENCIMA.
  // Nunca hay un momento en negro, que era lo que pasaba antes.
  const advance = useCallback(() => {
    const frames = SLOTS[slotIdxRef.current]?.frames
    if (!frames) return
    const actual = imgIdxRef.current
    setSalIdx(actual)
    setImgIdx((actual + 1) % frames.length)
    setTimeout(() => setSalIdx(null), FUNDIDO + 100)   // se desmonta ya invisible
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
    setSalIdx(null)
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

  // Logo mobile, etapa intermedia: apenas el usuario empieza a scrollear el
  // contorno se enciende, y vuelve a apagarse cuando el scroll se queda quieto.
  useEffect(() => {
    if (REDUCE_MOTION) return
    let apagar
    const onScroll = () => {
      setLogoDesp(true)
      clearTimeout(apagar)
      apagar = setTimeout(() => setLogoDesp(false), 2200)
    }
    // Tambien despierta al apoyar el dedo: en mobile el gesto de scrollear
    // empieza con el touch, antes de que la pagina se mueva un solo pixel.
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onScroll)
      clearTimeout(apagar)
    }
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

  // Golpe de tecla de maquina de escribir al apretar el logo. No hay archivo
  // de audio: se sintetiza con Web Audio, en tres capas, como suena de verdad:
  //   1. el "clack" -> ruido blanco muy corto y brillante (filtro pasa-altos)
  //   2. el timbre metalico de la varilla -> dos senos agudos que mueren rapido
  //   3. el golpe del rodillo -> un seno grave y seco
  // Si el navegador no deja sonar, no pasa nada y el resto sigue igual.
  const click = () => {
    try {
      const ctx = getAudioCtx()
      if (!ctx) return
      const t = ctx.currentTime
      const out = ctx.createGain()
      out.gain.value = 0.55
      out.connect(ctx.destination)

      // 1. clack
      const n = Math.floor(ctx.sampleRate * 0.03)
      const buf = ctx.createBuffer(1, n, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let k = 0; k < n; k++) {
        const caida = Math.pow(1 - k / n, 3)       // ataque instantaneo, cola muy corta
        data[k] = (Math.random() * 2 - 1) * caida
      }
      const ruido = ctx.createBufferSource()
      ruido.buffer = buf
      const altos = ctx.createBiquadFilter()
      altos.type = 'highpass'
      altos.frequency.value = 3200
      const gRuido = ctx.createGain()
      gRuido.gain.setValueAtTime(0.5, t)
      gRuido.gain.exponentialRampToValueAtTime(0.0001, t + 0.035)
      ruido.connect(altos).connect(gRuido).connect(out)

      // 2. timbre metalico (dos parciales desafinados entre si)
      const metal = ctx.createGain()
      metal.gain.setValueAtTime(0.0001, t)
      metal.gain.exponentialRampToValueAtTime(0.09, t + 0.003)
      metal.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
      metal.connect(out)
      const parciales = []
      for (const hz of [1870, 2630]) {
        const o = ctx.createOscillator()
        o.type = 'triangle'
        o.frequency.value = hz
        o.connect(metal)
        parciales.push(o)
      }

      // 3. golpe grave del rodillo
      const grave = ctx.createOscillator()
      grave.type = 'sine'
      grave.frequency.setValueAtTime(240, t)
      grave.frequency.exponentialRampToValueAtTime(90, t + 0.06)
      const gGrave = ctx.createGain()
      gGrave.gain.setValueAtTime(0.0001, t)
      gGrave.gain.exponentialRampToValueAtTime(0.2, t + 0.004)
      gGrave.gain.exponentialRampToValueAtTime(0.0001, t + 0.075)
      grave.connect(gGrave).connect(out)

      ruido.start(t)
      parciales.forEach(o => { o.start(t); o.stop(t + 0.12) })
      grave.start(t)
      grave.stop(t + 0.09)
    } catch { /* sin sonido */ }
  }

  // Logo mobile: se prende, tira el halo, y recien despues baja a work
  const handleLogoClick = (e) => {
    e.preventDefault()
    e.currentTarget.blur()
    const irAWork = () => document.getElementById('trabajos')?.scrollIntoView({ behavior: REDUCE_MOTION ? 'auto' : 'smooth' })
    if (REDUCE_MOTION) { irAWork(); return }
    click()
    setLogoOn(true)
    setLogoOnda(n => n + 1)
    setTimeout(irAWork, 620)                    // tiempo para ver el encendido y el halo
    setTimeout(() => setLogoOn(false), 1100)    // se apaga una vez que ya esta bajando
  }

  // El toggle nunca entra a madrugada (índice 0): solo aparece a las 4 AM reales
  const handleToggle = () => {
    setManual(true)          // desde ahora manda el visitante, no el reloj
    setSlotIdx(i => {
      const next = (i + 1) % SLOTS.length
      return next === 0 ? 1 : next
    })
  }

  // Hora que se muestra a la derecha (desktop). El lugar de la foto no se muestra:
  // Limo no quiere que se sepa dónde ni en qué momento del día está cada imagen.
  const horaTexto = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  // ── Render del fondo ──────────────────────────────────────
  // Dibuja UNA capa: una foto sola, un par lado a lado, o una vertical con
  // su blur de relleno. `saliendo` marca la que se esta disolviendo encima.
  const renderFrame = (fr, saliendo) => {
    if (!fr || !fr.length) return null

    // Par: dos imagenes lado a lado
    if (fr.length === 2) {
      return (
        <div key={fr[0]} className={`${styles.imgPair} ${saliendo ? '' : styles.imgVisible}`}>
          <img src={fr[0]} alt="" className={styles.imgPairItem} />
          <img src={fr[1]} alt="" className={styles.imgPairItem} />
        </div>
      )
    }

    const img = fr[0]
    // La primera foto de la franja aparece recien cuando termino de bajar
    const isFirst     = img === firstSrc
    const onFirstDone = isFirst ? () => setLoadedSrc(img) : undefined
    const visible     = !saliendo && !(isFirst && firstPending)

    // Vertical: blur de relleno + foto centrada
    if (VERTICAL.has(img)) {
      return (
        <Fragment key={img}>
          <div
            className={styles.imgBlur}
            style={{ backgroundImage: `url(${img})`, opacity: visible ? 1 : 0 }}
          />
          <img
            src={img}
            alt=""
            onLoad={onFirstDone}
            onError={onFirstDone}
            className={`${styles.imgCentered} ${visible ? styles.imgVisible : ''}`}
          />
        </Fragment>
      )
    }

    // Horizontal: foto a full, sin blur
    return (
      <img
        key={img}
        src={img}
        alt=""
        onLoad={onFirstDone}
        onError={onFirstDone}
        className={`${styles.imgCover} ${visible ? styles.imgVisible : ''}`}
      />
    )
  }

  // Las capas van en un array para que React las reconozca por su `key`:
  // asi la foto que sale conserva su nodo del DOM y puede hacer la
  // transicion de opacidad 1 -> 0. Si fueran posiciones fijas, React
  // reusaria el nodo para la foto nueva y no habria fundido.
  const renderBackground = () => {
    if (slot.type === 'video') return null
    const saliente = (salIdx !== null && salIdx !== imgIdx) ? frames[salIdx] : null
    const capas = [{ fr: frame, saliendo: false }]
    if (saliente) capas.push({ fr: saliente, saliendo: true })   // encima, disolviendose
    return capas.map(c => renderFrame(c.fr, c.saliendo))
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
        {/* Mobile: el logo entero (limon + nombre) es un solo boton a work */}
        <a
          href="#trabajos"
          className={`${styles.logoBtn} ${logoDesp ? styles.logoBtnDesp : ''} ${logoOn ? styles.logoBtnOn : ''} ${slot.name === 'noche' ? styles.logoBtnNoche : ''}`}
          aria-label={t('hero.cta_work')}
          onClick={handleLogoClick}
        >
          <LogoTatuaje className={styles.logoTatuaje} />
          {logoOnda > 0 && <span key={logoOnda} className={styles.logoRipple} />}
        </a>
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
