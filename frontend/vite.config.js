import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['dry-weeks-build.loca.lt'],
    hmr: {
      clientPort: 443,
    },
  },
})
