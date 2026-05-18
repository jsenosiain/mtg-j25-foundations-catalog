import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/mtg-j25-foundations-catalog/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utilities': path.resolve(__dirname, 'src/utilities'),
    },
  },
})
