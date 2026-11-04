// ─── MonedaIcon ──────────────────────────────────────────────────────────
// La moneda de Limonacio en version CHICA: nav, footer y favicon.
// Mismo dibujo que LimonTrazado, con tres adaptaciones medidas.
//
// 1. EL GROSOR SE CALCULA EN PIXELES, NO EN UNIDADES DEL viewBox.
//    ⚠️ Esta es la trampa. El viewBox mide 163.68, asi que un trazo de 1.4
//    a 16px de tamanio final mide 1.4 * 16/163.68 = 0.14 PIXELES: no se ve.
//    A 34px mide 0.29 y se ve lavado. Por eso el grosor se pide en pixeles
//    y la funcion px() lo convierte segun el tamanio. Si alguna vez se
//    escribe un stroke-width fijo aca, el icono se rompe en chico.
//
// 2. EL DETALLE BAJA CON EL TAMANIO. La inscripcion latina real se vuelve
//    un manchon por debajo de 48px, y amontonar tres aros concentricos en
//    32px tapa el limon. Entonces:
//      >= 48  completa  canto + marcas + aro interno
//      28-47  media     canto + marcas          (el nav, 34)
//      < 28   simple    canto solo              (el footer, 22; favicon 16)
//    Las MARCAS son 64 rayitas, una por caracter del lema. No son un
//    adorno: un texto chiquito, al achicarse, se degrada justo asi. Lo que
//    da cara de moneda no es leer las letras, es que se note que hay.
//
// 3. EL LIMON VA RELLENO. Hueco se deshace: el calco tiene tanto detalle
//    interno que en chico las lineas caen todas en el mismo pixel.
//
// Colores: var(--marca-1) el limon, var(--marca-2) los aros y las marcas.
// Rotan solos con la franja y con el tema (menta+coral de dia, terracota+
// verde los findes, coral+lila de noche, verde profundo+vino en claro).
// ⚠️ Nunca escribir un color fijo aca: al reves que el logo del Hero, la
// gracia de este es seguir la paleta.
// ─────────────────────────────────────────────────────────────────────────
import { LIMON_PATH } from '../LogoTatuaje/limonPath'

// Geometria heredada de LimonTrazado: mismo centro, mismos radios.
const CX = 50.53
const CY = 22.85
const R_ARO   = 66.01   // aro interno
const R_TEXTO = 72.45   // donde apoya la inscripcion en la version grande
const R_CANTO = 81      // el borde de afuera
const LADO    = 163.68  // el viewBox es cuadrado de este lado
const VIEWBOX = '-31.31 -58.99 163.68 163.68'

// 64 marcas, una por caracter de
// "LABOR IMPROBUS OMNIA VINCIT · DESIGNARE · AEDIFICARE · MOVERE · ".
// Mismo truco que las luces del boton "see work": un guion sobre un
// circulo da una rayita. El paso sale del perimetro dividido los
// caracteres, asi que si cambia el lema o el radio, se reacomoda solo.
const MARCAS = 64
const PASO = (2 * Math.PI * R_TEXTO) / MARCAS
const RAYA = 2.6

export default function MonedaIcon({ size = 34, className }) {
  // grosor pedido en PIXELES reales -> unidades del viewBox
  const px = (p) => (p * LADO) / size

  const nivel = size >= 48 ? 'completa' : size >= 28 ? 'media' : 'simple'
  const simple = nivel === 'simple'

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {!simple && (
        <circle
          data-p="marcas"
          cx={CX} cy={CY} r={R_TEXTO}
          fill="none"
          strokeWidth={px(1.9)}
          strokeDasharray={`${RAYA} ${PASO - RAYA}`}
        />
      )}
      {nivel === 'completa' && (
        <circle data-p="aro" cx={CX} cy={CY} r={R_ARO} fill="none" strokeWidth={px(1.3)} />
      )}
      {/* Sin marcas el canto se mete un poco para adentro y engorda: es lo
          unico que queda, asi que tiene que sostener la forma el solo. */}
      <circle
        data-p="canto"
        cx={CX} cy={CY} r={simple ? R_CANTO - 4 : R_CANTO}
        fill="none"
        strokeWidth={px(simple ? 1.8 : 1.4)}
      />
      <g transform="rotate(-35 53 26.38)">
        <path data-p="limon" d={LIMON_PATH} fillRule="evenodd" />
      </g>
    </svg>
  )
}
