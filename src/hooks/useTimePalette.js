import { useEffect } from 'react'

/* Los acentos de la marca ROTAN segun el dia y la hora. Son dos y siempre
   son dos; lo que cambia es que color les toca en cada franja.
     --marca-1  acento dominante: el que lleva el logo, los links activos de
                work y los titulos destacados.
     --marca-2  acento secundario: bordes, hovers, detalles.

   ⚠️ ANTES SE LLAMABAN --teal Y --coral, Y ESOS NOMBRES MENTIAN (renombrado
   el 28/10/2026). --teal valia vino, verde o lila segun el momento, y
   --coral valia menta, terracota o coral. Esa mentira fue la causa de casi
   todos los bugs de color del proyecto: el aro de la moneda salia VERDE
   justo de noche, que es cuando mas falta hacia el contraste, porque
   var(--coral) ahi valia #2ECC80. Regla: ningun archivo debe asumir que
   estas variables tienen un color concreto. Si un elemento necesita un
   color fijo, se escribe literal, como hace el logo del Hero.

   📏 Contraste medido sobre el fondo oscuro (minimo legible: 4,5:1):
     #1EFFE0 turquesa 13,8 · #FFD93D dorado 12,8 · #2ECC80 menta 8,5
     #B794FF violeta 7,4 · #F0526A coral 5,3 · #900030 vino 1,87 ❌
   El fin de semana paso de terracota + verde (4,6 y 5,6, los dos mas
   apagados que habia) a dorado + turquesa el 14/11/2026: Limo queria que
   el finde tuviera magia y esos dos no se despegaban del resto. Son los
   acentos mas brillantes del sitio, a proposito.
   El vino es el unico que falla, y por mas de la mitad. No es un color
   malo: sobre fondo claro (#F0EDE8) mide 8:1. Es un color de modo CLARO,
   y ahi deberia mudarse cuando exista ese modo. */
/* ── DEGRADADOS ───────────────────────────────────────────────────────
   Ademas de los dos colores planos, cada franja define --marca-1-grad y
   --marca-2-grad. Son para los elementos con SUPERFICIE: hoy la pastilla
   de seccion (WORK / LAB / MISCELLANEOUS).
   ⚠️ NO reemplazan a los colores planos: un degradado no sirve como
   `stroke`, `fill` ni `color`, que es como se usa --marca-1 en la mayoria
   de los lugares. Son una variable APARTE, no un cambio de las otras.
   ⚠️ Tampoco funcionan en lineas finas: en el aro de la moneda (0.55 de
   trazo) un degradado solo se lee como "un lado esta mas oscuro". Para
   lineas, color plano.
   En las franjas que no son fin de semana el degradado es el color plano
   repetido: asi el mecanismo es uno solo y no cambia nada visualmente.
   El fin de semana si lleva oro metalico y esmeralda tipo gema: bordes
   profundos y un destello claro cruzando el medio, que es lo que hace que
   el ojo lea metal y piedra en vez de un color. */
const plano = (c) => `linear-gradient(135deg, ${c} 0%, ${c} 100%)`

const ORO =
  'linear-gradient(135deg, #8a6616 0%, #e0b64a 22%, #fff0b8 44%,' +
  ' #e0b64a 62%, #8a6616 84%, #c99b2c 100%)'
const GEMA =
  'linear-gradient(135deg, #043a2b 0%, #0a7d58 16%, #12c57c 34%,' +
  ' #9FFFD8 50%, #12c57c 66%, #0a7d58 84%, #05533b 100%)'

const PALETTES = {
  /* ── OSCURO ─────────────────────────────────────────────────────────── */
  dark: {
    // Lunes–Viernes 08:00–20:00
    weekday: {
      '--marca-1': '#2ECC80',   // menta          8,5:1
      '--marca-2': '#F0526A',   // coral          5,3:1
      '--marca-1-grad': plano('#2ECC80'),
      '--marca-2-grad': plano('#F0526A'),
      // ❌ Aca vivia el vino #900030 hasta el 28/10/2026. Daba 1,87:1 y era
      //    el unico acento del sistema que no llegaba al minimo de 4,5:1:
      //    de dia 'miscellaneous' y las etiquetas de las tarjetas casi no se
      //    leian. No se perdio: se mudo al modo claro, donde da 8,3:1.
      '--bg':      '#161a17',
      '--bg2':     '#1c211d',
      '--bg3':     '#232a24',
      '--text':    '#F0EDE8',
    },
    // Sábado–Domingo 08:00–20:00
    weekend: {
      // Oro y esmeralda. Los planos son para trazos y textos; los degradados
      // para las superficies. El esmeralda esta en tono 162 y NO en 151 a
      // proposito: a 151 es el mismo tono que la menta de lunes a viernes y
      // el sabado se veria igual que el martes.
      '--marca-1': '#E0A82E',   // oro            8,2:1
      '--marca-2': '#00E5A0',   // esmeralda     10,6:1
      '--marca-1-grad': ORO,
      '--marca-2-grad': GEMA,
      '--bg':      '#161a17',
      '--bg2':     '#1d221e',
      '--bg3':     '#242b25',
      '--text':    '#EFF2EE',
    },
    // Todas las noches 20:00–08:00
    night: {
      '--marca-1': '#F0526A',   // coral          5,3:1
      // ❌ Era lila #7B74E0, 4,6:1: el acento mas apagado que quedaba. Se
      //    cambio el 15/11/2026 por un violeta neon, mismo motivo que el
      //    fin de semana.
      '--marca-2': '#B794FF',   // violeta        7,4:1
      '--marca-1-grad': plano('#F0526A'),
      '--marca-2-grad': plano('#B794FF'),
      '--bg':      '#17171e',
      '--bg2':     '#1e1e28',
      '--bg3':     '#252532',
      '--text':    '#F0F0F0',
    },
  },

  /* ── CLARO (28/10/2026) ──────────────────────────────────────────────
     Cada franja conserva su FAMILIA DE TONO, oscurecida hasta que se lea
     sobre fondo claro. No son colores nuevos: son los mismos con menos luz.
     ⚠️ NO reutilizar los acentos del modo oscuro: la menta #2ECC80 sobre
     hueso da 1,77:1, la imagen espejada del problema del vino. Un acento
     pensado para brillar sobre negro no sirve sobre blanco, y al reves.
     Los contrastes de al lado estan medidos contra el --bg de su franja. */
  light: {
    weekday: {
      '--marca-1': '#0E7A45',   // verde profundo  4,8:1
      '--marca-2': '#900030',   // vino            8,3:1  ← su lugar natural
      '--marca-1-grad': plano('#0E7A45'),
      '--marca-2-grad': plano('#900030'),
      '--bg':      '#F2F0EA',
      '--bg2':     '#E9E6DE',
      '--bg3':     '#DEDAD0',
      '--text':    '#161A17',
    },
    weekend: {
      // El oro y la gema oscurecidos para fondo claro. El degradado tambien
      // se oscurece: el metalico de modo oscuro sobre hueso no se lee.
      '--marca-1': '#7E5406',   // oro oscuro      5,8:1
      '--marca-2': '#05604A',   // esmeralda osc.  6,6:1
      '--marca-1-grad':
        'linear-gradient(135deg, #4a3103 0%, #8a5f0a 24%, #c99b2c 48%,' +
        ' #8a5f0a 72%, #4a3103 100%)',
      '--marca-2-grad':
        'linear-gradient(135deg, #022f24 0%, #05604A 26%, #0a8a68 50%,' +
        ' #05604A 74%, #022f24 100%)',
      '--bg':      '#F3F0E9',
      '--bg2':     '#EAE5DB',
      '--bg3':     '#DFD9CC',
      '--text':    '#161A17',
    },
    night: {
      '--marca-1': '#B0203C',   // carmin          5,9:1
      // Mismo tono que el violeta de oscuro (260) para que sean el mismo
      // color con mas y con menos luz. El anterior estaba en 245.
      '--marca-2': '#5B2FBF',   // violeta         7,1:1
      '--marca-1-grad': plano('#B0203C'),
      '--marca-2-grad': plano('#5B2FBF'),
      '--bg':      '#F0EFF4',
      '--bg2':     '#E6E5EE',
      '--bg3':     '#DBDAE6',
      '--text':    '#17171E',
    },
  },
}

/* Exportada porque el Hero tambien la necesita: es el unico dueño del
   atributo data-franja del <html>. Ver la nota de abajo. */
export function getSlotName() {
  const now  = new Date()
  const hour = now.getHours()
  const day  = now.getDay() // 0=Dom, 6=Sáb

  const isNight   = hour < 8 || hour >= 20
  const isWeekend = day === 0 || day === 6

  if (isNight)   return 'night'
  if (isWeekend) return 'weekend'
  return 'weekday'
}

function applyPalette(theme) {
  const modo = PALETTES[theme] ?? PALETTES.dark
  const slot = getSlotName()
  const palette = modo[slot]
  const root = document.documentElement
  Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v))

  /* Ademas de la franja que toca por reloj, publicamos los dos acentos de
     LAS TRES franjas, del tema activo. Esto es lo que le permite a la
     moneda chica (MonedaMini) seguir al boton secreto sin que nadie
     duplique un color: el CSS elige con :root[data-franja='…'] y los
     valores siguen saliendo de PALETTES, aca arriba.
     Se republican con el tema porque claro y oscuro NO comparten acentos. */
  Object.keys(modo).forEach((nombre) => {
    root.style.setProperty(`--m1-${nombre}`, modo[nombre]['--marca-1'])
    root.style.setProperty(`--m2-${nombre}`, modo[nombre]['--marca-2'])
  })
  /* ⚠️ ACA NO SE TOCA data-franja. Lo pone el Hero y solo el Hero.
     Motivo: el ◎ deja que el visitante elija la franja a mano, y si este
     hook tambien escribiera el atributo se lo pisaria al cambiar de hora.
     Un atributo, un dueño. */
}

/* Recibe el tema para poder elegir entre el set claro y el oscuro.
   ⚠️ `theme` va en las dependencias del efecto: sin eso, al tocar el boton
   cambiaria data-theme pero las variables seguirian siendo las del tema
   anterior, porque las escribe este hook como estilo inline en <html>. */
export function useTimePalette(theme = 'dark') {
  useEffect(() => {
    applyPalette(theme)

    // recalcular al inicio de cada hora nueva
    const now = new Date()
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000

    let interval
    const timeout = setTimeout(() => {
      applyPalette(theme)
      interval = setInterval(() => applyPalette(theme), 3_600_000)
    }, msUntilNextHour)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [theme])
}
