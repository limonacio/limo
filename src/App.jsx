import Nav          from './components/Nav/Nav'
import Footer       from './components/Footer/Footer'
import Hero         from './sections/Hero/Hero'
import Trabajos     from './sections/Trabajos/Trabajos'
import Miscelaneas  from './sections/Miscelaneas/Miscelaneas'
import LimonacioIcon from './components/LimonacioIcon/LimonacioIcon'
import styles       from './App.module.css'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trabajos />

        {/* Separador */}
        <div className={styles.divider}>
          <span /><span className={styles.dividerMid} /><span />
        </div>

        <Miscelaneas />

        {/* Strip "Sobre mí" */}
        <section id="about" className={styles.about}>
          <div className={styles.aboutInner}>
            <LimonacioIcon size={90} spin={false} pulse={false} dots={false} />
            <div>
              <h2 className={styles.aboutTitle}>sobre <span>limonacio</span></h2>
              <p className={styles.aboutText}>
                Portfolio personal de trabajos, proyectos y pasiones.
                Desde diseño y desarrollo hasta música y baile —
                todo lo que me mueve va acá.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
