import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Base public path. Defaults to '/' for local dev and root-domain hosting.
  // The GitHub Pages workflow sets VITE_BASE to '/<repo>/' for project sites.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
