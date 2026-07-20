import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Nav.module.css'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const raw = i18n.language || 'en'
  const lang = raw.startsWith('pt') ? 'pt' : raw.startsWith('es') ? 'es' : 'en'
  const [active, setActive] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const ids = ['trabajos', 'miscelaneas', 'about']

    const handleScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.5
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mid) current = id
      }
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

  const atHero = active === ''

  return (
    <nav className={styles.nav}>
      <a href="#hero" className={`${styles.logo} ${atHero ? styles.logoHidden : ''}`}>
        <LimonacioIcon size={34} spin={false} pulse={false} dots={false} />
        <span className={styles.logoText}>limonacio</span>
      </a>
      <div className={styles.right}>
        <ul className={styles.links}>
          <li><a href="#trabajos"    className={linkClass('trabajos')}>{t('nav.work')}</a></li>
          <li><a href="#miscelaneas" className={linkClass('miscelaneas')}>{t('nav.misc')}</a></li>
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
