import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <LimonacioIcon size={22} spin={false} pulse={false} dots={false} />
      <span className={styles.text}>
        <span className={styles.brand}>limonacio</span>
        <sup className={styles.tm}>™</sup>
        <span className={styles.sep}> · © {new Date().getFullYear()}</span>
      </span>
    </footer>
  )
}
