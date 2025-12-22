import { defineConfig } from 'vite' // ★ここが抜けていました！
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // ★ここを '/wordrobe/' から '/' に変更！
  build: {
    outDir: 'dist',
  },
})