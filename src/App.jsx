import Nav          from './components/Nav/Nav'
import Footer       from './components/Footer/Footer'
import Hero         from './sections/Hero/Hero'
import Trabajos     from './sections/Trabajos/Trabajos'
import Miscelaneas  from './sections/Miscelaneas/Miscelaneas'
import About        from './sections/About/About'
import { useTimePalette } from './hooks/useTimePalette'

export default function App() {
  useTimePalette()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trabajos />
        <Miscelaneas />
        <About />
      </main>
      <Footer />
    </>
  )
}
