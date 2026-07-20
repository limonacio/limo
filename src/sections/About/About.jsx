import { useTranslation } from 'react-i18next'
import styles from './About.module.css'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t('about.heading')}</h2>
        <p className={styles.text}>{t('about.text')}</p>
      </div>
    </section>
  )
}
