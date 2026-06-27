// Lee del array `trabajos` en data/projects.js
// Para agregar un trabajo nuevo: solo editá projects.js
import { trabajos } from '../../data/projects.js'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './Trabajos.module.css'

export default function Trabajos() {
  return (
    <section id="trabajos" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>trabajos</span>
        <h2 className={styles.title}>mis proyectos</h2>
        <div className={styles.line} />
      </div>

      <div className={styles.grid}>
        {trabajos.map(proyecto => (
          <ProjectCard key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>
    </section>
  )
}
