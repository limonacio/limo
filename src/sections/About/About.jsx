import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './About.module.css'

export default function About() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const paragraphs = t('about.extended').split('\n\n')

  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t('about.heading')}</h2>
        <p className={styles.text}>{t('about.text')}</p>

        {expanded && (
          <div className={styles.extended}>
            {paragraphs.map((p, i) => (
              <p key={i} className={styles.bodyText}>{p}</p>
            ))}
          </div>
        )}

        <button
          className={styles.seeMore}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? t('about.see_less') : t('about.see_more')}
        </button>
      </div>
    </section>
  )
}
