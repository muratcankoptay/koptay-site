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
    sourcemap: false,
    // modulePreload tamamen kapatıldı (Vite 4+ varsayılanı agresif preload yapıyor).
    // resolveDependencies filtresi yetmiyordu — tarayıcı preload scanner yine de
    // dynamic import path'lerini görüp arka planda fetch ediyordu.
    // Bu sayede chart-vendor (~67 KiB) ana bundle'ın kritik yolundan tamamen çıkar;
    // sadece ilgili hesaplama sayfası açıldığında, gerçekten ihtiyaç olduğunda yüklenir.
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-helmet-async')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'chart-vendor';
            }
            if (id.includes('jspdf')) {
              return 'pdf-vendor';
            }
            if (id.includes('html2canvas')) {
              return 'html2canvas-vendor';
            }
            if (id.includes('flatpickr')) {
              return 'flatpickr-vendor';
            }
            if (id.includes('@google/generative-ai')) {
              return 'ai-vendor';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      format: {
        comments: false
      },
      mangle: {
        safari10: true
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false
  }
})
