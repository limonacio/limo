// Lee del array `miscelaneas` en data/projects.js
import { miscelaneas } from '../../data/projects.js'
import MiscCard from '../../components/MiscCard/MiscCard'
import styles from './Miscelaneas.module.css'

export default function Miscelaneas() {
  return (
    <section id="miscelaneas" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>misceláneas</span>
        <h2 className={styles.title}>videos · música · baile</h2>
        <div className={styles.line} />
      </div>

      <div className={styles.grid}>
        {miscelaneas.map(proyecto => (
          <MiscCard key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>
    </section>
  )
}
