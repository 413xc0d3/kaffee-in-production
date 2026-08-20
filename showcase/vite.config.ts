import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages hostet unter /<repo-name>/, lokaler Dev-Server bleibt auf "/"
  base: command === 'build' ? '/kaffee-in-production/' : '/',
  plugins: [react()],
}))
