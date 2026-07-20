import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignorar archivos de video y audio grandes — evita que Vite se trabe
      ignored: ['**/*.mp4', '**/*.webm', '**/*.mov', '**/*.avi', '**/*.mkv'],
    },
  },
})
