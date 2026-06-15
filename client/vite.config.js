/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Under Vitest (mode 'test') JSX is transformed by esbuild, which defaults to the
  // classic runtime; force the automatic runtime so source/test JSX needs no React
  // import. Scoped to test mode so the production (oxc) build isn't affected.
  ...(mode === 'test' ? { esbuild: { jsx: 'automatic' } } : {}),
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: './vitest.setup.js',
  },
}))
