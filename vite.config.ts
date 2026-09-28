import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages: https://<user>.github.io/<repo>/
  base: process.env.GITHUB_PAGES === 'true' ? '/green-api-telegram-chat/' : '/',
  server: {
    proxy: {
      '/green-api': {
        target: 'https://api.green-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/green-api/, ''),
      },
    },
  },
})
