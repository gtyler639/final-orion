import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Copy PDF.js worker to public folder
    {
      name: 'copy-pdfjs-worker',
      buildStart() {
        try {
          mkdirSync('public', { recursive: true })
          const workerPath = resolve('node_modules/pdfjs-dist/build/pdf.worker.min.js')
          const destPath = resolve('public/pdf.worker.min.js')
          copyFileSync(workerPath, destPath)
          console.log('✅ PDF.js worker copied to public folder')
        } catch (error) {
          console.error('⚠️  Failed to copy PDF.js worker:', error.message)
        }
      }
    }
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
    minify: 'terser',
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
