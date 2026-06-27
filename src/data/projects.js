// ─────────────────────────────────────────────────────────────
//  LIMO · src/data/projects.js
//
//  ESTE ES EL ÚNICO ARCHIVO QUE NECESITÁS TOCAR para:
//    ✔ agregar un proyecto nuevo
//    ✔ editar título, descripción, imagen o links
//    ✔ cambiar el orden en que aparecen
//    ✔ marcar algo como destacado (featured: true)
//
//  Las secciones Trabajos y Misceláneas leen de acá
//  y se renderizan solas automáticamente.
//
//  TIPOS disponibles:
//    "trabajo"    → aparece en la sección Trabajos
//    "misc"       → aparece en la sección Misceláneas
//
//  CAMPOS:
//    id          string   identificador único (sin espacios)
//    tipo        string   "trabajo" | "misc"
//    titulo      string   nombre del proyecto
//    subtitulo   string   categoría / tags cortos
//    descripcion string   texto breve que aparece en la card
//    imagen      string   ruta relativa desde /public/assets/img/
//                         (dejar "" para mostrar placeholder)
//    link        string   URL externa o ruta interna (dejar "" si no hay)
//    video       string   (solo misc) URL de YouTube / Vimeo embed
//    featured    bool     si es true → aparece primero y más grande
// ─────────────────────────────────────────────────────────────

export const proyectos = [

  // ── TRABAJOS ──────────────────────────────────────────────

  {
    id:          "zeta-sports",
    tipo:        "trabajo",
    titulo:      "Zeta Sports",
    subtitulo:   "branding · identidad visual",
    descripcion: "Identidad visual completa para Zeta Sports. Agrega acá más detalles del proyecto.",
    imagen:      "zeta-sports-cover.jpg",   // /public/assets/img/zeta-sports-cover.jpg
    link:        "",
    featured:    true,
  },

  {
    id:          "limodoro",
    tipo:        "trabajo",
    titulo:      "Limodoro",
    subtitulo:   "app · diseño · productividad",
    descripcion: "Descripción del proyecto Limodoro. Agrega contexto, herramientas y resultado.",
    imagen:      "limodoro-cover.jpg",      // /public/assets/img/limodoro-cover.jpg
    link:        "",
    featured:    false,
  },

  // ── Para agregar un trabajo nuevo, copiá este bloque: ──
  // {
  //   id:          "nombre-del-proyecto",
  //   tipo:        "trabajo",
  //   titulo:      "Nombre del Proyecto",
  //   subtitulo:   "categoría · etiqueta",
  //   descripcion: "Descripción breve.",
  //   imagen:      "nombre-cover.jpg",
  //   link:        "https://...",
  //   featured:    false,
  // },

  // ── MISCELÁNEAS ───────────────────────────────────────────

  {
    id:          "misc-01",
    tipo:        "misc",
    titulo:      "Video Musical 01",
    subtitulo:   "video musical",
    descripcion: "Descripción del video. Podés pegar el link de YouTube o Vimeo.",
    imagen:      "",
    video:       "",   // ej: "https://www.youtube.com/embed/VIDEO_ID"
    link:        "",
    featured:    false,
  },

  {
    id:          "misc-02",
    tipo:        "misc",
    titulo:      "Video de Baile 01",
    subtitulo:   "baile",
    descripcion: "Descripción del video.",
    imagen:      "",
    video:       "",
    link:        "",
    featured:    false,
  },

  // ── Para agregar una miscelánea nueva, copiá este bloque: ──
  // {
  //   id:          "misc-03",
  //   tipo:        "misc",
  //   titulo:      "Nombre",
  //   subtitulo:   "video musical | baile | otro",
  //   descripcion: "Descripción.",
  //   imagen:      "",
  //   video:       "https://www.youtube.com/embed/VIDEO_ID",
  //   link:        "",
  //   featured:    false,
  // },

]

// ── Helpers para filtrar por tipo ─────────────────────────
export const trabajos    = proyectos.filter(p => p.tipo === "trabajo")
export const miscelaneas = proyectos.filter(p => p.tipo === "misc")
export const destacados  = proyectos.filter(p => p.featured)
