import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// `base` must match the path the site is served from.
// - Vercel (and local dev): served from `/`, so base defaults to `/`
// - GitHub Pages: served from `/<repo-name>/`. The Pages deploy workflow sets
//   VITE_BASE to the correct value so renames don't silently break asset URLs.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? (process.env.VITE_BASE || '/') : '/',
}))
