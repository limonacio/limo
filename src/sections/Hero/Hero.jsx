import { useTranslation } from 'react-i18next'
import LimonacioIcon from '../../components/LimonacioIcon/LimonacioIcon'
import styles from './Hero.module.css'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.glow} />

      <LimonacioIcon size={160} spin pulse dots />

      <h1 className={styles.title}>limonacio</h1>

      <p className={styles.subtitle}>
        {t('hero.tagline')}<br/>
        {t('hero.subtitle')}
      </p>

      <div className={styles.dots}>
        <span className={`${styles.dot} ${styles.dot1}`} />
        <span className={`${styles.dot} ${styles.dot2}`} />
        <span className={`${styles.dot} ${styles.dot3}`} />
      </div>

      <div className={styles.cta}>
        <a href="#trabajos"   className={`${styles.btn} ${styles.btnPrimary}`}>{t('hero.cta_work')}</a>
        <a href="#miscelaneas" className={`${styles.btn} ${styles.btnSecondary}`}>{t('hero.cta_misc')}</a>
      </div>

      <div className={styles.scrollHint}>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#555" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2.5" fill="#555">
            <animate attributeName="cy" values="8;14;8" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
        {t('hero.scroll')}
      </div>
    </section>
  )
}
