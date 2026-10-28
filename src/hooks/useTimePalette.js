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
     #2ECC80 menta 8,5 · #5E9E70 verde 5,6 · #F0526A coral 5,3
     #C46B3A terracota 4,6 · #7B74E0 lila 4,6 · #900030 vino 1,87 ❌
   El vino es el unico que falla, y por mas de la mitad. No es un color
   malo: sobre fondo claro (#F0EDE8) mide 8:1. Es un color de modo CLARO,
   y ahi deberia mudarse cuando exista ese modo. */
const PALETTES = {
  /* ── OSCURO ─────────────────────────────────────────────────────────── */
  dark: {
    // Lunes–Viernes 08:00–20:00
    weekday: {
      '--marca-1': '#2ECC80',   // menta          8,5:1
      '--marca-2': '#900030',   // vino           1,87:1  ⚠️ ver nota arriba
      '--bg':      '#161a17',
      '--bg2':     '#1c211d',
      '--bg3':     '#232a24',
      '--text':    '#F0EDE8',
    },
    // Sábado–Domingo 08:00–20:00
    weekend: {
      '--marca-1': '#C46B3A',   // terracota      4,6:1
      '--marca-2': '#5E9E70',   // verde apagado  5,6:1
      '--bg':      '#161a17',
      '--bg2':     '#1d221e',
      '--bg3':     '#242b25',
      '--text':    '#EFF2EE',
    },
    // Todas las noches 20:00–08:00
    night: {
      '--marca-1': '#F0526A',   // coral          5,3:1
      '--marca-2': '#7B74E0',   // lila           4,6:1
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
      '--bg':      '#F2F0EA',
      '--bg2':     '#E9E6DE',
      '--bg3':     '#DEDAD0',
      '--text':    '#161A17',
    },
    weekend: {
      '--marca-1': '#9A4A1C',   // terracota       5,5:1
      '--marca-2': '#2F6B45',   // verde           5,6:1
      '--bg':      '#F3F0E9',
      '--bg2':     '#EAE5DB',
      '--bg3':     '#DFD9CC',
      '--text':    '#161A17',
    },
    night: {
      '--marca-1': '#B0203C',   // carmin          5,9:1
      '--marca-2': '#4A3FBF',   // lila            6,7:1
      '--bg':      '#F0EFF4',
      '--bg2':     '#E6E5EE',
      '--bg3':     '#DBDAE6',
      '--text':    '#17171E',
    },
  },
}

function getSlotName() {
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
  const palette = modo[getSlotName()]
  const root = document.documentElement
  Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v))
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
