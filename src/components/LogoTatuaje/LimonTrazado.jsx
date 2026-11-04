/*
  El limon solo, calcado del diseno original en papel del tatuaje: la linea
  negra del dibujo pintada en verde, un unico <path> con fill-rule evenodd.
  Girado -35 grados como en el tatuaje.

  Es la misma moneda que el logo de mobile (LogoTatuaje) pero SIN el nombre:
  limon + aro + inscripcion latina. Se usa en el boton a miscelaneos del
  desktop.

  Las medidas NO estan a ojo. El aro es el circulo minimo que contiene al
  limon ya girado (centro 50.53, 22.85, radio 60.02) escalado por los mismos factores
  que la moneda de mobile, para que las dos se vean de la misma familia:
    aro   = rmin * 1.0997  -> 66.01
    texto = aro  * 1.0976  -> 72.45
    letra = aro  * 0.0865  -> 5.71
  El letter-spacing de 3.69 sale de: perimetro (455.22) / caracteres (64) - ancho
  de un caracter. Por eso el texto cierra exacto. Si cambia la frase o el
  radio, recalcular.

  El path del texto ARRANCA ARRIBA y va horario, con textAnchor="start" y
  startOffset 0. Con anchor middle la mitad cae antes del arranque y se
  recorta.

  Hueco en reposo y relleno al pasar el mouse: lo decide el CSS del Hero,
  por eso cada parte lleva un data-p y no una clase propia.
*/
import { LIMON_PATH } from './limonPath'

export default function LimonTrazado({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-31.31 -58.99 163.68 163.68"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <path id="aroLimon" d="M50.53 -49.6 a 72.45 72.45 0 1 1 0 144.9 a 72.45 72.45 0 1 1 0 -144.9" />
      </defs>
      <text data-p="inscripcion" fontSize="5.71" letterSpacing="3.69">
        <textPath href="#aroLimon" startOffset="0" textAnchor="start">
          LABOR IMPROBUS OMNIA VINCIT · DESIGNARE · AEDIFICARE · MOVERE ·{' '}
        </textPath>
      </text>
      <circle data-p="moneda" cx="50.53" cy="22.85" r="66.01" />
      {/* El CANTO: el borde de afuera, el que cierra la moneda. Sin el, la
          inscripcion flota y el dibujo se desarma hacia afuera.
          Las letras llegan hasta un radio de 78.2 y el viewBox permite
          81.84, asi que 81 es casi todo el aire disponible: mas cerca queda
          pegado al texto, mas lejos se sale del cuadro.
          Lleva el MISMO data-p que el aro interno a proposito: asi hereda
          color, transicion y el engorde al tocarlo sin una sola linea de
          CSS nueva, y los dos circulos reaccionan juntos. */}
      <circle data-p="moneda" cx="50.53" cy="22.85" r="81" />
      <g transform="rotate(-35 53 26.38)">
        <path data-p="limon" d={LIMON_PATH} />
      </g>
    </svg>
  )
}
