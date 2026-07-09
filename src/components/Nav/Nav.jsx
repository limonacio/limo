import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Nav.module.css'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const raw = i18n.language || 'en'
  const lang = raw.startsWith('pt') ? 'pt' : raw.startsWith('es') ? 'es' : 'en'
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = ['trabajos', 'miscelaneas', 'about']
    const observers = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const linkClass = (id) => `${styles.link} ${active === id ? styles.linkActive : ''}`

  return (
    <nav className={styles.nav}>
      <a href="#hero" className={styles.logo}>
        <LimonacioIcon size={34} spin={false} pulse={false} dots={false} />
        <span className={styles.logoText}>limonacio</span>
      </a>
      <div className={styles.right}>
        <ul className={styles.links}>
          <li><a href="#trabajos"    className={linkClass('trabajos')}>{t('nav.work')}</a></li>
          <li><a href="#miscelaneas" className={linkClass('miscelaneas')}>{t('nav.misc')}</a></li>
          <li><a href="#about"       className={linkClass('about')}>{t('nav.about')}</a></li>
        </ul>
        <div className={styles.langToggle} role="group" aria-label="Switch language">
          <span className={lang === 'en' ? styles.langActive : styles.langInactive} onClick={() => i18n.changeLanguage('en')}>EN</span>
          <span className={styles.langSep}>·</span>
          <span className={lang === 'es' ? styles.langActive : styles.langInactive} onClick={() => i18n.changeLanguage('es')}>ES</span>
          <span className={styles.langSep}>·</span>
          <span className={lang === 'pt' ? styles.langActive : styles.langInactive} onClick={() => i18n.changeLanguage('pt')}>PT</span>
        </div>
      </div>
    </nav>
  )
}