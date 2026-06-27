import { useTranslation } from 'react-i18next'
import Nav          from './components/Nav/Nav'
import Footer       from './components/Footer/Footer'
import Hero         from './sections/Hero/Hero'
import Trabajos     from './sections/Trabajos/Trabajos'
import Miscelaneas  from './sections/Miscelaneas/Miscelaneas'
import LimonacioIcon from './components/LimonacioIcon/LimonacioIcon'
import styles       from './App.module.css'

export default function App() {
  const { t } = useTranslation()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trabajos />

        <div className={styles.divider}>
          <span /><span className={styles.dividerMid} /><span />
        </div>

        <Miscelaneas />

        <section id="about" className={styles.about}>
          <div className={styles.aboutInner}>
            <LimonacioIcon size={90} spin={false} pulse={false} dots={false} />
            <div>
              <h2 className={styles.aboutTitle}>
                {t('about.heading')} <span>{t('about.brand')}</span>
              </h2>
              <p className={styles.aboutText}>{t('about.text')}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
