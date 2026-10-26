import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Calls to /api and /u are forwarded to the Express server (port 3000)
    proxy: {
      '/api': 'http://localhost:3000',
      '/u': 'http://localhost:3000',
    },
  },
})
