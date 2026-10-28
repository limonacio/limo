import Nav          from './components/Nav/Nav'
import Footer       from './components/Footer/Footer'
import Hero         from './sections/Hero/Hero'
import Trabajos     from './sections/Trabajos/Trabajos'
import Lab          from './sections/Lab/Lab'
import Miscelaneas  from './sections/Miscelaneas/Miscelaneas'
import About        from './sections/About/About'
import { useTimePalette } from './hooks/useTimePalette'
// Vercel Web Analytics: cuenta las visitas del lado del servidor de Vercel.
// El numero NO se muestra en la pagina, se mira en el panel de Vercel
// (pestania Analytics del proyecto). Plan Hobby: 50.000 eventos/mes gratis,
// con ventana de reporte de 1 mes. Hay que habilitarlo ademas desde el panel;
// con el paquete solo no alcanza. El import es '/react' porque esto es Vite,
// no Next.js.
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  useTimePalette()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trabajos />
        <Lab />
        <Miscelaneas />
        <About />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
