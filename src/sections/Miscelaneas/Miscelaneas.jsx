import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { miscelaneas } from '../../data/projects.js'
import MiscCard from '../../components/MiscCard/MiscCard'
import styles from './Miscelaneas.module.css'

export default function Miscelaneas() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [mobile, setMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const itemsPerPage = mobile ? 1 : 2
  const pages = useMemo(() => {
    const result = []
    for (let i = 0; i < miscelaneas.length; i += itemsPerPage) {
      result.push(miscelaneas.slice(i, i + itemsPerPage))
    }
    return result
  }, [itemsPerPage])

  const [idx, setIdx] = useState(0)
  const n = pages.length
  useEffect(() => { setIdx(i => Math.min(i, n - 1)) }, [n])

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(n - 1, i + 1))

  const touchStartX = useRef(null)
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <section id="miscelaneas" className={styles.section}>

      <div className={styles.header}>
        <span className={styles.tag}>{t('misc.tag')}</span>
        <h2 className={styles.title}>{t('misc.title')}</h2>
        <div className={styles.line} />
      </div>

      <div className={styles.carouselWrap}>

        {idx > 0 && (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">
            &#8249;
          </button>
        )}

        <div
          className={styles.slideArea}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {pages.map((group, i) => (
            <div
              key={i}
              className={styles.slide}
              style={{
                opacity: i === idx ? 1 : 0,
                pointerEvents: i === idx ? 'auto' : 'none',
              }}
            >
              <div className={styles.grid}>
                {group.map(proyecto => (
                  <MiscCard key={proyecto.id} proyecto={proyecto} lang={lang} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {idx < n - 1 && (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">
            &#8250;
          </button>
        )}

      </div>

      <div className={styles.dotsRow}>
        {pages.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Pagina ${i + 1}`}
          />
        ))}
      </div>

    </section>
  )
}
