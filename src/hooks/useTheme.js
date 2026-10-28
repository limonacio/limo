import { useState, useEffect, useCallback, useRef } from 'react'

const CLAVE = 'limonacio-tema'

function leerGuardado() {
  try {
    const v = localStorage.getItem(CLAVE)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    // localStorage puede tirar error en incognito o con cookies bloqueadas.
    // No es motivo para romper la pagina: se sigue de largo sin memoria.
    return null
  }
}

/* Tema inicial. El orden importa:
     1. lo que el visitante eligio antes (localStorage)
     2. si nunca eligio, lo que tenga su sistema operativo
   Una eleccion explicita siempre le gana al sistema. */
export function temaInicial() {
  return (
    leerGuardado() ??
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  )
}

export function useTheme() {
  const [theme, setTheme] = useState(temaInicial)

  // ⚠️ Se mide UNA sola vez, en el primer render. Si se consultara dentro de
  // un efecto, ya estaria contaminado: el efecto de abajo escribe en
  // localStorage y entonces toda primera visita pareceria una eleccion.
  const yaHabiaElegido = useRef(leerGuardado() !== null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    // La barra del navegador en mobile acompania al tema.
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#F2F0EA' : '#161a17')
    }
  }, [theme])

  // Mientras el visitante no haya elegido, seguimos su sistema en vivo: si
  // el celular pasa solo a modo oscuro al atardecer, el sitio lo acompania.
  // Una vez que elige, no lo pisamos nunca mas.
  useEffect(() => {
    if (yaHabiaElegido.current) return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const alCambiar = (e) => setTheme(e.matches ? 'light' : 'dark')
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  // Solo una eleccion EXPLICITA se guarda. Asi la primera visita sigue al
  // sistema en vez de quedar congelada en lo que se vio la primera vez.
  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const nuevo = t === 'light' ? 'dark' : 'light'
      try { localStorage.setItem(CLAVE, nuevo) } catch { /* ver leerGuardado */ }
      yaHabiaElegido.current = true
      return nuevo
    })
  }, [])

  return { theme, toggleTheme }
}
