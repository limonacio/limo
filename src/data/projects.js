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
      en: "branding · visual identity",
      es: "branding · identidad visual",
    },
    descripcion: {
      en: "Full visual identity for Zeta Sports. Add context, tools used and outcome here.",
      es: "Identidad visual completa para Zeta Sports. Agrega contexto, herramientas y resultado.",
    },
    imagen:   "zeta-sports-cover.jpg",
    link:     "",
    featured: true,
  },

  {
    id:       "limodoro",
    tipo:     "trabajo",
    titulo:   "Limodoro",
    subtitulo: {
      en: "app · design · productivity",
      es: "app · diseño · productividad",
    },
    descripcion: {
      en: "Description of the Limodoro project. Add context, tools and outcome here.",
      es: "Descripción del proyecto Limodoro. Agrega contexto, herramientas y resultado.",
    },
    imagen:   "limodoro-cover.jpg",
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
