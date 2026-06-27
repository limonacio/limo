import { useTranslation } from 'react-i18next'
import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Nav.module.css'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const isEN = i18n.language === 'en'

  const toggleLang = () => {
    i18n.changeLanguage(isEN ? 'es' : 'en')
  }

  return (
    <nav className={styles.nav}>
      <a href="#hero" className={styles.logo}>
        <LimonacioIcon size={34} spin={false} pulse={false} dots={false} />
        <span className={styles.logoText}>limonacio</span>
      </a>

      <div className={styles.right}>
        <ul className={styles.links}>
          <li><a href="#trabajos">{t('nav.work')}</a></li>
          <li><a href="#miscelaneas">{t('nav.misc')}</a></li>
          <li><a href="#about">{t('nav.about')}</a></li>
        </ul>

        {/* Language toggle */}
        <button className={styles.langToggle} onClick={toggleLang} aria-label="Switch language">
          <span className={isEN ? styles.langActive : styles.langInactive}>EN</span>
          <span className={styles.langSep}>·</span>
          <span className={!isEN ? styles.langActive : styles.langInactive}>ES</span>
        </button>
      </div>
    </nav>
  )
}
