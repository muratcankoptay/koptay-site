import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks for better caching
          if (id.includes('node_modules')) {
            // Core React - load immediately
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            // Helmet for SEO
            if (id.includes('react-helmet-async')) {
              return 'react-vendor';
            }
            // UI icons - used everywhere
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Heavy libraries - lazy load on demand
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'chart-vendor';
            }
            if (id.includes('jspdf')) {
              return 'pdf-vendor';
            }
            if (id.includes('html2canvas')) {
              return 'html2canvas-vendor';
            }
            // Flatpickr - only for date pickers
            if (id.includes('flatpickr')) {
              return 'flatpickr-vendor';
            }
            // Google Generative AI - only for AI features
            if (id.includes('@google/generative-ai')) {
              return 'ai-vendor';
            }
            // All other node_modules
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2 // Multiple passes for better compression
      },
      format: {
        comments: false // Remove comments
      },
      mangle: {
        safari10: true // Better Safari compatibility
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    reportCompressedSize: false // Faster builds
  }
})