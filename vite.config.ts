import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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