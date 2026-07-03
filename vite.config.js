import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Si vous déployez sur GitHub Pages, remplacez base par '/<nom-du-repo>/'
export default defineConfig({
  plugins: [react()],
  base: './',
})
