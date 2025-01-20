import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        widget: 'public/widget.js'
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  publicDir: 'public'
})