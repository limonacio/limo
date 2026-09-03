// ─────────────────────────────────────────────────────────────
//  LIMO · src/data/projects.js
//
//  ÚNICO ARCHIVO que necesitás tocar para agregar/editar proyectos.
//  Los campos de texto tienen versión EN, ES y PT.
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
      pt: "web · design · esportes",
    },
    descripcion: {
      en: "Sports web platform built for FIFA World Cup 2026. Real-time fixtures, standings, and knockout bracket — designed to be fast, clean, and mobile-first.",
      es: "Plataforma web deportiva para el Mundial FIFA 2026. Fixtures, posiciones y bracket de eliminación en tiempo real, con diseño limpio y mobile-first.",
      pt: "Plataforma web esportiva para a Copa do Mundo FIFA 2026. Fixtures, classificações e chave eliminatória em tempo real — design limpo e mobile-first.",
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
      pt: "app · produtividade · windows",
    },
    descripcion: {
      en: "Windows desktop app based on the Pomodoro technique. Supports FREE and POMO modes, daily goal tracking, and a full session history — built to stay out of your way.",
      es: "App de escritorio para Windows basada en la técnica Pomodoro. Modo libre y modo Pomodoro, seguimiento de meta diaria e historial completo de sesiones.",
      pt: "App de desktop para Windows baseado na técnica Pomodoro. Modos livre e Pomodoro, acompanhamento de meta diária e histórico completo de sessões.",
    },
    imagen:   "limodoro-cover.png",
    link:     "/limodoro/index.html",
    featured: false,
  },

  {
    id:       "ecomassages",
    tipo:     "trabajo",
    titulo:   "EcoMassages",
    subtitulo: {
      en: "web · wellness · booking",
      es: "web · bienestar · reservas",
      pt: "web · bem-estar · reservas",
    },
    descripcion: {
      en: "Website for a massage therapy center. Services, WhatsApp booking, embedded map, and Google reviews.",
      es: "Sitio web para un centro de masajes. Servicios, reservas por WhatsApp, mapa integrado y reseñas de Google.",
      pt: "Site para um centro de massagens. Serviços, reservas pelo WhatsApp, mapa integrado e avaliações do Google.",
    },
    imagen:   "ecomassages-cover.jpg",
    link:     "https://ecomassagesweb.com//",
    featured: false,
    glow: '#ffffff',
  },

  {
    id:       "martin-brooks",
    tipo:     "trabajo",
    titulo:   "Martín Brooks",
    subtitulo: {
      en: "web · psychology · wellness",
      es: "web · psicología · bienestar",
      pt: "web · psicologia · bem-estar",
    },
    descripcion: {
      en: "Personal site for a psychologist. Individual therapy sessions, appointment booking, and a clean bilingual design that reflects the professional's approach.",
      es: "Sitio personal para un psicólogo. Sesiones individuales, reserva de turnos y diseño bilingüe que refleja el estilo profesional del terapeuta.",
      pt: "Site pessoal para um psicólogo. Sessões individuais, agendamento de consultas e design bilíngue que reflete a abordagem do profissional.",
    },
    imagen:   "martin-brooks-cover.png",
    link:     "https://martin-ebon.vercel.app/martinbrookspsi",
    featured: false,
  },


  // ── Para agregar un trabajo: copiá este bloque ────────────
  // {
  //   id:       "nuevo-proyecto",
  //   tipo:     "trabajo",
  //   titulo:   "Nombre del Proyecto",
  //   subtitulo: { en: "category · tag", es: "categoría · etiqueta", pt: "categoria · etiqueta" },
  //   descripcion: { en: "Short description.", es: "Descripción breve.", pt: "Descrição breve." },
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
      pt: "música",
    },
    descripcion: {
      en: "Watch the video on YouTube.",
      es: "Ver el video en YouTube.",
      pt: "Assista ao vídeo no YouTube.",
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
      pt: "dança",
    },
    descripcion: {
      en: "Watch the video on YouTube.",
      es: "Ver el video en YouTube.",
      pt: "Assista ao vídeo no YouTube.",
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
  //   subtitulo: { en: "music video | dance | other", es: "video musical | baile | otro", pt: "videoclipe | dança | outro" },
  //   descripcion: { en: "Description.", es: "Descripción.", pt: "Descrição." },
  //   imagen:   "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  //   link:     "https://www.youtube.com/watch?v=VIDEO_ID",
  //   featured: false,
  // },

]

// ── Helpers ───────────────────────────────────────────────
export const trabajos    = proyectos.filter(p => p.tipo === "trabajo")
export const miscelaneas = proyectos.filter(p => p.tipo === "misc")
export const destacados  = proyectos.filter(p => p.featured)