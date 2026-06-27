// ─────────────────────────────────────────────────────────────
//  LIMO · src/data/projects.js
//
//  ÚNICO ARCHIVO que necesitás tocar para agregar/editar proyectos.
//  Los campos de texto tienen versión EN y ES.
//  Las secciones leen de acá automáticamente.
//
//  TIPOS:  "trabajo" → sección Work   |   "misc" → sección Miscellaneous
// ─────────────────────────────────────────────────────────────

export const proyectos = [

  // ── WORK / TRABAJOS ───────────────────────────────────────

  {
    id:       "zeta-sports",
    tipo:     "trabajo",
    titulo:   "Zeta Sports",
    subtitulo: {
      en: "web · design · sports",
      es: "web · diseño · deportes",
    },
    descripcion: {
      en: "Sports web platform built for FIFA World Cup 2026. Real-time fixtures, standings, and knockout bracket — designed to be fast, clean, and mobile-first.",
      es: "Plataforma web deportiva para el Mundial FIFA 2026. Fixtures, posiciones y bracket de eliminación en tiempo real, con diseño limpio y mobile-first.",
    },
    imagen:   "zeta-sports-cover.png",
    link:     "https://www.zeta-sports.com",
    featured: true,
  },

  {
    id:       "limodoro",
    tipo:     "trabajo",
    titulo:   "Limodoro",
    subtitulo: {
      en: "app · productivity · windows",
      es: "app · productividad · windows",
    },
    descripcion: {
      en: "Windows desktop app based on the Pomodoro technique. Supports FREE and POMO modes, daily goal tracking, and a full session history — built to stay out of your way.",
      es: "App de escritorio para Windows basada en la técnica Pomodoro. Modo libre y modo Pomodoro, seguimiento de meta diaria e historial completo de sesiones.",
    },
    imagen:   "limodoro-cover.png",
    link:     "",
    featured: false,
  },

  // ── Para agregar un trabajo: copiá este bloque ────────────
  // {
  //   id:       "nuevo-proyecto",
  //   tipo:     "trabajo",
  //   titulo:   "Nombre del Proyecto",
  //   subtitulo: { en: "category · tag", es: "categoría · etiqueta" },
  //   descripcion: { en: "Short description.", es: "Descripción breve." },
  //   imagen:   "nombre-cover.jpg",
  //   link:     "https://...",
  //   featured: false,
  // },

  // ── MISC / MISCELÁNEAS ────────────────────────────────────

  {
    id:       "misc-01",
    tipo:     "misc",
    titulo:   "Music Video 01",
    subtitulo: {
      en: "music video",
      es: "video musical",
    },
    descripcion: {
      en: "Video description. Paste the YouTube or Vimeo link below.",
      es: "Descripción del video. Pegá el link de YouTube o Vimeo abajo.",
    },
    imagen:   "",
    video:    "",
    link:     "",
    featured: false,
  },

  {
    id:       "misc-02",
    tipo:     "misc",
    titulo:   "Dance Video 01",
    subtitulo: {
      en: "dance",
      es: "baile",
    },
    descripcion: {
      en: "Video description.",
      es: "Descripción del video.",
    },
    imagen:   "",
    video:    "",
    link:     "",
    featured: false,
  },

  // ── Para agregar una miscelánea: copiá este bloque ────────
  // {
  //   id:       "misc-03",
  //   tipo:     "misc",
  //   titulo:   "Title",
  //   subtitulo: { en: "music video | dance | other", es: "video musical | baile | otro" },
  //   descripcion: { en: "Description.", es: "Descripción." },
  //   imagen:   "",
  //   video:    "https://www.youtube.com/embed/VIDEO_ID",
  //   link:     "",
  //   featured: false,
  // },

]

// ── Helpers ───────────────────────────────────────────────
export const trabajos    = proyectos.filter(p => p.tipo === "trabajo")
export const miscelaneas = proyectos.filter(p => p.tipo === "misc")
export const destacados  = proyectos.filter(p => p.featured)