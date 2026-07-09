// ─────────────────────────────────────────────────────────────
//  LIMO · src/data/projects.js
//
//  ÚNICO ARCHIVO que necesitás tocar para agregar/editar proyectos.
//  Los campos de texto tienen versión EN y ES.
//  Las secciones leen de acá automáticamente.
//
//  TIPOS:  "trabajo" → sección Work   |   "misc" → sección Miscellaneous
//
//  imagen: puede ser nombre local (ej: "cover.png") o URL externa (ej: "https://...")
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
    link:     "/limodoro/index.html",
    featured: false,
  },

  {
  id:       "ecomassages",
  tipo:     "trabajo",
  titulo:   "Eco Massages",
  subtitulo: {
    en: "web · wellness · booking",
    es: "web · bienestar · reservas",
  },
  descripcion: {
    en: "Website for a massage therapy center. Services, WhatsApp booking, embedded map, and Google reviews.",
    es: "Sitio web para un centro de masajes. Servicios, reservas por WhatsApp, mapa integrado y reseñas de Google.",
  },
  imagen:   "ecomassages-cover.jpg",
  link:     "https://ecomassagesweb.com//",
  featured: false,
  glow: '#ffffff',
},


  // ── Para agregar un trabajo: copiá este bloque ────────────
  // {
  //   id:       "nuevo-proyecto",
  //   tipo:     "trabajo",
  //   titulo:   "Nombre del Proyecto",
  //   subtitulo: { en: "category · tag", es: "categoría · etiqueta" },
  //   descripcion: { en: "Short description.", es: "Descripción breve." },
  //   imagen:   "nombre-cover.jpg",   // o URL externa: "https://..."
  //   link:     "https://...",
  //   featured: false,
  // },

  // ── MISC / MISCELÁNEAS ────────────────────────────────────

  {
    id:       "misc-01",
    tipo:     "misc",
    titulo:   "Música",
    subtitulo: {
      en: "music",
      es: "música",
    },
    descripcion: {
      en: "Watch the video on YouTube.",
      es: "Ver el video en YouTube.",
    },
    imagen:   "musica-cover.jpg",
    link:     "https://www.youtube.com/watch?v=TiyPCmciZMc",
    featured: false,
  },

  {
    id:       "misc-02",
    tipo:     "misc",
    titulo:   "Baile",
    subtitulo: {
      en: "dance",
      es: "baile",
    },
    descripcion: {
      en: "Watch the video on YouTube.",
      es: "Ver el video en YouTube.",
    },
    imagen:   "baile-cover.jpg",
    link:     "https://www.youtube.com/watch?v=s35t1V0FWjw",
    featured: false,
  },

  // ── Para agregar una miscelánea: copiá este bloque ────────
  // {
  //   id:       "misc-03",
  //   tipo:     "misc",
  //   titulo:   "Title",
  //   subtitulo: { en: "music video | dance | other", es: "video musical | baile | otro" },
  //   descripcion: { en: "Description.", es: "Descripción." },
  //   imagen:   "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  //   link:     "https://www.youtube.com/watch?v=VIDEO_ID",
  //   featured: false,
  // },

]

// ── Helpers ───────────────────────────────────────────────
export const trabajos    = proyectos.filter(p => p.tipo === "trabajo")
export const miscelaneas = proyectos.filter(p => p.tipo === "misc")
export const destacados  = proyectos.filter(p => p.featured)
