import { useTranslation } from 'react-i18next'
import { trabajos } from '../../data/projects.js'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './Trabajos.module.css'

export default function Trabajos() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <section id="trabajos" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>{t('work.tag')}</span>
        <h2 className={styles.title}>{t('work.title')}</h2>
        <div className={styles.line} />
      </div>

      <div className={styles.grid}>
        {trabajos.map(proyecto => (
          <ProjectCard key={proyecto.id} proyecto={proyecto} lang={lang} />
        ))}
      </div>
    </section>
  )
}
