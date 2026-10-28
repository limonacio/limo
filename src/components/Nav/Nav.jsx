import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Nav.module.css'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const raw = i18n.language || 'en'
  const lang = raw.startsWith('pt') ? 'pt' : raw.startsWith('es') ? 'es' : 'en'
  const [active, setActive] = useState('')
  // atHero es estado propio, NO se deriva de active. Antes era
  // `active === ''`, y eso ataba dos cosas distintas: "que seccion marco en
  // el header" y "el visitante sigue en el Hero". Como miscelaneas no esta
  // en el header, al pasar por esa seccion no hay ninguna activa, y con la
  // formula vieja el nav mobile se habria escondido en medio del sitio.
  const [atHero, setAtHero] = useState(true)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const ids = ['trabajos', 'lab', 'about']   // miscelaneas no esta en el header a proposito

    const handleScroll = () => {
      // Linea imaginaria a media pantalla: la seccion que la cruza es la
      // activa. Se mide con getBoundingClientRect, que da la posicion real
      // en pantalla.
      // ❌ Antes se usaba `el.offsetTop <= mid` y se guardaba la ULTIMA que
      // cumplia. Eso marcaba una seccion por el solo hecho de haberla
      // pasado, aunque ya estuvieras lejos: en miscelaneas (que no esta en
      // el header) seguia encendida lab.
      const alto = window.innerHeight
      const linea = alto * 0.5

      const hero = document.getElementById('hero')
      const enHero = hero ? hero.getBoundingClientRect().bottom > linea : false
      setAtHero(enHero)

      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= linea && r.bottom > linea) { current = id; break }
      }

      // Al llegar al fondo la pagina ya no scrollea mas, asi que la ULTIMA
      // seccion puede no alcanzar nunca a cruzar la linea y quedaba
      // encendida la anterior. Si estamos al fondo, gana la ultima.
      const fondo =
        window.scrollY + alto >= document.documentElement.scrollHeight - 2
      if (fondo && !enHero) current = ids[ids.length - 1]

      setActive(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const linkClass = (id) => {
    if (id === 'trabajos') {
      return active === id
        ? `${styles.link} ${styles.linkWork} ${styles.linkActiveWork}`
        : `${styles.link} ${styles.linkWork}`
    }
    return active === id
      ? `${styles.link} ${styles.linkActive}`
      : styles.link
  }

  return (
    <nav className={styles.nav}>
      <a href="#hero" className={`${styles.logo} ${atHero ? styles.logoHidden : ''}`}>
        <LimonacioIcon size={34} spin={false} pulse={false} dots={true} />
        <span className={styles.logoText}>limonacio</span>
      </a>
      <div className={styles.right}>
        {/* Los links SIEMPRE estan en el DOM; en mobile se esconden mientras
            el visitante esta en el Hero y aparecen al scrollear, igual que el
            logo de la izquierda. En desktop se ven siempre. */}
        <ul className={`${styles.links} ${atHero ? styles.linksHidden : ''}`}>
          <li><a href="#trabajos"    className={linkClass('trabajos')}>{t('nav.work')}</a></li>
          <li><a href="#lab"         className={linkClass('lab')}>{t('nav.lab')}</a></li>
          <li><a href="#about"       className={linkClass('about')}>{t('nav.about')}</a></li>
        </ul>

        <div className={styles.langDropdown} ref={langRef}>
          <button
            className={styles.langTrigger}
            onClick={() => setLangOpen(o => !o)}
            aria-expanded={langOpen}
            aria-haspopup="listbox"
          >
            {lang.toUpperCase()}
            <span className={`${styles.langCaret} ${langOpen ? styles.langCaretOpen : ''}`}>▾</span>
          </button>
          {langOpen && (
            <div className={styles.langMenu} role="listbox">
              {['en', 'es', 'pt'].map(l => (
                <button
                  key={l}
                  className={l === lang ? styles.langMenuItemActive : styles.langMenuItem}
                  onClick={() => { i18n.changeLanguage(l); setLangOpen(false) }}
                  role="option"
                  aria-selected={l === lang}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
