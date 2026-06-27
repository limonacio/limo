import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#hero" className={styles.logo}>
        <LimonacioIcon size={34} spin={false} pulse={false} dots={false} />
        <span className={styles.logoText}>limonacio</span>
      </a>

      <ul className={styles.links}>
        <li><a href="#trabajos">trabajos</a></li>
        <li><a href="#miscelaneas">misceláneas</a></li>
        <li><a href="#about">sobre mí</a></li>
      </ul>
    </nav>
  )
}
