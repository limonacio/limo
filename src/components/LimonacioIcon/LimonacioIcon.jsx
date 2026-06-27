// ─── LimonacioIcon ───────────────────────────────────────────
// Props:
//   size     number  — tamaño en px (default 120)
//   spin     bool    — si rota (default true)
//   pulse    bool    — si tiene efecto de pulso (default true)
//   dots     bool    — muestra los puntitos internos (default true)
// ─────────────────────────────────────────────────────────────
import styles from './LimonacioIcon.module.css'

export default function LimonacioIcon({
  size  = 120,
  spin  = true,
  pulse = true,
  dots  = true,
}) {
  return (
    <div
      className={styles.wrapper}
      style={{ width: size, height: size }}
    >
      {pulse && <div className={styles.pulse} />}

      <svg
        className={spin ? styles.svgSpin : styles.svg}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mitad turquesa (izquierda) */}
        <path
          d="M50 6 A44 44 0 0 0 50 94"
          stroke="#3DDBD9"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        {/* Mitad coral (derecha) */}
        <path
          d="M50 6 A44 44 0 0 1 50 94"
          stroke="#F0526A"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        {/* Punto conector arriba */}
        <circle className={styles.dotBlink}  cx="50" cy="6"  r="4.5" fill="white" />
        {/* Punto conector abajo */}
        <circle className={styles.dotBlink2} cx="50" cy="94" r="4.5" fill="white" />
        {/* Puntitos internos del eje (como en la preview dark) */}
        {dots && <>
          <circle cx="50" cy="30" r="2" fill="white" opacity="0.2" />
          <circle cx="50" cy="42" r="2" fill="white" opacity="0.2" />
          <circle cx="50" cy="54" r="2" fill="white" opacity="0.2" />
          <circle cx="50" cy="66" r="2" fill="white" opacity="0.2" />
        </>}
      </svg>
    </div>
  )
}
