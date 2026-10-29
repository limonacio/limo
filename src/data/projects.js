// ─────────────────────────────────────────────────────────────
//  LIMO · src/data/projects.js
//
//  ÚNICO ARCHIVO que necesitás tocar para agregar/editar proyectos.
//  Los campos de texto tienen versión EN, ES y PT.
//  Las secciones leen de acá automáticamente.
//
//  TIPOS:  "trabajo" → Work (sitios para clientes)
//          "lab"     → Lab (software propio de Limo)
//          "misc"    → Miscellaneous
//
//  imagen: puede ser nombre local (ej: "cover.png") o URL externa (ej: "https://...")
// ─────────────────────────────────────────────────────────────

export const proyectos = [

  // ── LO ÚLTIMO QUE CREÓ LIMO VA PRIMERO ────────────────────

  {
    id:       "habilidades",
    tipo:     "lab",
    titulo:   "Habilidades para la Vida",
    subtitulo: {
      en: "guide · therapeutic · trilingual",
      es: "guía · terapéutica · trilingüe",
      pt: "guia · terapêutica · trilíngue",
    },
    descripcion: {
      en: "Open guide on emotions, bonds, gender and rights, in three languages and written plainly. Nothing is made up — every idea names its author or the law it comes from. Static site built with Astro, content in Markdown, released under CC BY-SA.",
      es: "Guía abierta sobre emociones, vínculos, género y derechos, en tres idiomas y explicada en simple. Nada está inventado: cada idea lleva su autor o la norma de donde sale. Sitio estático hecho con Astro, contenido en Markdown, publicado bajo CC BY-SA.",
      pt: "Guia aberto sobre emoções, vínculos, gênero e direitos, em três idiomas e explicado de forma simples. Nada é inventado: cada ideia traz seu autor ou a norma de onde vem. Site estático feito com Astro, conteúdo em Markdown, publicado sob CC BY-SA.",
    },
    imagen:   "habilidades-cover.webp",
    link:     "https://habilidades-para-la-vida.vercel.app",
    featured: false,
  },

  // ── WORK / TRABAJOS ───────────────────────────────────────

  {
    id:       "intycaren",
    tipo:     "trabajo",
    titulo:   "Transfers Inty Caren",
    subtitulo: {
      en: "web · transfers · patagonia",
      es: "web · traslados · patagonia",
      pt: "web · traslados · patagonia",
    },
    descripcion: {
      en: "Site for a private transfer service out of El Calafate. Static, trilingual, with destinations, vehicles, map and FAQ; bookings go through WhatsApp.",
      es: "Sitio para un servicio de remis privado desde El Calafate. Estatico, en tres idiomas, con destinos, vehiculos, mapa y preguntas frecuentes; las reservas van por WhatsApp.",
      pt: "Site para um servico de traslado privado saindo de El Calafate. Estatico, em tres idiomas, com destinos, veiculos, mapa e perguntas frequentes; as reservas vao pelo WhatsApp.",
    },
    imagen:   "intycaren-cover.webp",
    link:     "https://transfersintycaren.vercel.app",
    featured: false,
  },



  {
    id:       "siria",
    tipo:     "trabajo",
    titulo:   "Siria",
    subtitulo: {
      en: "web · beauty salon · booking",
      es: "web · peluqueria · turnos",
      pt: "web · salao de beleza · agendamentos",
    },
    descripcion: {
      en: "Site for a unisex beauty salon in El Calafate. Services, a gallery of real work, online booking and local SEO so it shows up in searches from the area.",
      es: "Sitio para un salon unisex de El Calafate. Servicios, galeria de trabajos reales, reserva de turnos online y SEO local para aparecer en las busquedas de la zona.",
      pt: "Site para um salao unissex em El Calafate. Servicos, galeria de trabalhos reais, agendamento online e SEO local para aparecer nas buscas da regiao.",
    },
    imagen:   "siria-cover.webp",
    link:     "https://siria-sigma.vercel.app",
    featured: false,
  },



  {
    id:       "limonario",
    tipo:     "lab",
    titulo:   "Limonario",
    subtitulo: {
      en: "web app · booking · payments",
      es: "web app · turnos · pagos",
      pt: "web app · agendamentos · pagamentos",
    },
    descripcion: {
      en: "Booking platform with up-front deposits. The professional sets the session price and the deposit from their own panel; the client never sends a price — it is calculated on the server and frozen into each booking. Payments through Mercado Pago, confirmed by webhook.",
      es: "Plataforma de turnos con seña. El profesional fija el precio de la sesión y la seña desde su panel; el cliente nunca manda un precio: se calcula en el servidor y queda congelado en cada reserva. Cobro por Mercado Pago, confirmado por webhook.",
      pt: "Plataforma de agendamentos com sinal. O profissional define o preço da sessão e o sinal no seu painel; o cliente nunca envia um preço: é calculado no servidor e fica congelado em cada reserva. Pagamento por Mercado Pago, confirmado por webhook.",
    },
    imagen:   "limonario-cover.webp",
    link:     "https://limonario.limonacio.com",
    featured: false,
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
    link:     "https://martin-dun.vercel.app",
    featured: false,
  },



  {
    id:       "ecomassages",
    tipo:     "trabajo",
    titulo:   "Ecomassages",
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
    id:       "limodoro",
    tipo:     "lab",
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
export const lab         = proyectos.filter(p => p.tipo === "lab")
export const miscelaneas = proyectos.filter(p => p.tipo === "misc")
export const destacados  = proyectos.filter(p => p.featured)