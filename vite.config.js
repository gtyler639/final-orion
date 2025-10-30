import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
    // PDF.js worker is now bundled automatically via ?url import in pdfParser.js
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',  // Use esbuild (faster, no extra dependency needed)
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'pdfjs': ['pdfjs-dist']
        }
      }
    }
  }
})
