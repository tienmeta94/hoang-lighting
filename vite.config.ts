import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://tienmeta94.github.io/hoang-lighting/
export default defineConfig({
  base: '/hoang-lighting/',
  plugins: [react(), tailwindcss()],
})
