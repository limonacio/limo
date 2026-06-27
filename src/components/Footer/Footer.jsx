import LimonacioIcon from '../LimonacioIcon/LimonacioIcon'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <LimonacioIcon size={28} spin={false} pulse={false} dots={false} />
      <span className={styles.text}>
        <span className={styles.brand}>limonacio</span> · {new Date().getFullYear()}
      </span>
    </footer>
  )
}
