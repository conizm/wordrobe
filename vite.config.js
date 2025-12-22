export default defineConfig({
  plugins: [react()],
  base: '/',  // ★ここを '/wordrobe/' から '/' に変更！
  build: {
    outDir: 'dist',
  },
})