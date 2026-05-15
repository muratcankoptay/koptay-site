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
            // chart.js, jspdf, html2canvas, flatpickr, @google/generative-ai için
            // manualChunks rule'u BİLEREK kaldırıldı.
            // Sebep: bu kütüphaneler ayrı vendor chunk yapılınca, dynamic import
            // yapan sayfaların import map'i ana bundle'a yazılıyor ve tarayıcı
            // preload scanner bunları arka planda fetch ediyordu (PageSpeed:
            // chart-vendor 67 KiB, kıdem makalesinde %90 kullanılmıyor).
            // Şimdi Vite, her birini sadece kullanan async chunk'a inline eder;
            // ana bundle'da hiçbir referans kalmaz.
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
