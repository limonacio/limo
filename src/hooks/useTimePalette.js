import { useEffect } from 'react'

const PALETTES = {
  // Lunes–Viernes 08:00–20:00
  weekday: {
    '--teal':  '#C9853A',
    '--coral': '#942038',
    '--bg':    '#1b1714',
    '--bg2':   '#221e1a',
    '--bg3':   '#2a2620',
    '--text':  '#F0EDE8',
  },
  // Sábado–Domingo 08:00–20:00
  weekend: {
    '--teal':  '#5E9E70',
    '--coral': '#C46B3A',
    '--bg':    '#161a17',
    '--bg2':   '#1d221e',
    '--bg3':   '#242b25',
    '--text':  '#EFF2EE',
  },
  // Todas las noches 20:00–08:00
  night: {
    '--teal':  '#7B74E0',
    '--coral': '#F0526A',
    '--bg':    '#17171e',
    '--bg2':   '#1e1e28',
    '--bg3':   '#252532',
    '--text':  '#F0F0F0',
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