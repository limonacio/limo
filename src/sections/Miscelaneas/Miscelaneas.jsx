import { useTranslation } from 'react-i18next'
import { miscelaneas } from '../../data/projects.js'
import MiscCard from '../../components/MiscCard/MiscCard'
import styles from './Miscelaneas.module.css'

export default function Miscelaneas() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <section id="miscelaneas" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>{t('misc.tag')}</span>
        <h2 className={styles.title}>{t('misc.title')}</h2>
        <div className={styles.line} />
      </div>

      <div className={styles.grid}>
        {miscelaneas.map(proyecto => (
          <MiscCard key={proyecto.id} proyecto={proyecto} lang={lang} />
        ))}
      </div>
    </section>
  )
}
