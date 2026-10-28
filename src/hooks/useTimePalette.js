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
  // Lunes–Viernes 08:00–20:00
  weekday: {
    '--marca-1': '#2ECC80',   // menta
    '--marca-2': '#900030',   // vino  ⚠️ 1,87:1 — ilegible sobre el fondo
    '--bg':      '#161a17',
    '--bg2':     '#1c211d',
    '--bg3':     '#232a24',
    '--text':    '#F0EDE8',
  },
  // Sábado–Domingo 08:00–20:00
  weekend: {
    '--marca-1': '#C46B3A',   // terracota
    '--marca-2': '#5E9E70',   // verde apagado
    '--bg':      '#161a17',
    '--bg2':     '#1d221e',
    '--bg3':     '#242b25',
    '--text':    '#EFF2EE',
  },
  // Todas las noches 20:00–08:00
  night: {
    '--marca-1': '#F0526A',   // coral
    '--marca-2': '#7B74E0',   // lila
    '--bg':      '#17171e',
    '--bg2':     '#1e1e28',
    '--bg3':     '#252532',
    '--text':    '#F0F0F0',
  },
}

function getCurrentPalette() {
  const now  = new Date()
  const hour = now.getHours()
  const day  = now.getDay() // 0=Dom, 6=Sáb

  const isNight   = hour < 8 || hour >= 20
  const isWeekend = day === 0 || day === 6

  if (isNight)   return PALETTES.night
  if (isWeekend) return PALETTES.weekend
  return PALETTES.weekday
}

function applyPalette() {
  const palette = getCurrentPalette()
  const root = document.documentElement
  Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v))
}

export function useTimePalette() {
  useEffect(() => {
    applyPalette()

    // recalcular al inicio de cada hora nueva
    const now = new Date()
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000

    const timeout = setTimeout(() => {
      applyPalette()
      const interval = setInterval(applyPalette, 3_600_000)
      return () => clearInterval(interval)
    }, msUntilNextHour)

    return () => clearTimeout(timeout)
  }, [])
}