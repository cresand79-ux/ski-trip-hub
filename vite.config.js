import { defineConfig } from 'vite'
import react from '@vitejs/react-swc' // or '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ski-trip-hub/', // This must match your GitHub repo name exactly
})