// vite.config.js
import { defineConfig } from "file:///sessions/clever-gifted-darwin/mnt/koptay-site/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/clever-gifted-darwin/mnt/koptay-site/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///sessions/clever-gifted-darwin/mnt/koptay-site/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///sessions/clever-gifted-darwin/mnt/koptay-site/node_modules/autoprefixer/lib/autoprefixer.js";
var vite_config_default = defineConfig({
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
    port: 3e3,
    open: true
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // Disable sourcemaps in production for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "react-vendor";
            }
            if (id.includes("react-helmet-async")) {
              return "react-vendor";
            }
            if (id.includes("lucide-react")) {
              return "ui-vendor";
            }
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "chart-vendor";
            }
            if (id.includes("jspdf")) {
              return "pdf-vendor";
            }
            if (id.includes("html2canvas")) {
              return "html2canvas-vendor";
            }
            if (id.includes("flatpickr")) {
              return "flatpickr-vendor";
            }
            if (id.includes("@google/generative-ai")) {
              return "ai-vendor";
            }
            return "vendor";
          }
        }
      }
    },
    chunkSizeWarningLimit: 1e3,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2
        // Multiple passes for better compression
      },
      format: {
        comments: false
        // Remove comments
      },
      mangle: {
        safari10: true
        // Better Safari compatibility
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Inline assets smaller than 4kb
    reportCompressedSize: false
    // Faster builds
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvY2xldmVyLWdpZnRlZC1kYXJ3aW4vbW50L2tvcHRheS1zaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvY2xldmVyLWdpZnRlZC1kYXJ3aW4vbW50L2tvcHRheS1zaXRlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9jbGV2ZXItZ2lmdGVkLWRhcndpbi9tbnQva29wdGF5LXNpdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcydcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHRhaWx3aW5kY3NzLFxyXG4gICAgICAgIGF1dG9wcmVmaXhlclxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBvcGVuOiB0cnVlXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBzb3VyY2VtYXA6IGZhbHNlLCAvLyBEaXNhYmxlIHNvdXJjZW1hcHMgaW4gcHJvZHVjdGlvbiBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XHJcbiAgICAgICAgICAvLyBTcGxpdCB2ZW5kb3IgY2h1bmtzIGZvciBiZXR0ZXIgY2FjaGluZ1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAvLyBDb3JlIFJlYWN0IC0gbG9hZCBpbW1lZGlhdGVseVxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWRvbScpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXItZG9tJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSGVsbWV0IGZvciBTRU9cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdC1oZWxtZXQtYXN5bmMnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBVSSBpY29ucyAtIHVzZWQgZXZlcnl3aGVyZVxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICd1aS12ZW5kb3InO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEhlYXZ5IGxpYnJhcmllcyAtIGxhenkgbG9hZCBvbiBkZW1hbmRcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdjaGFydC5qcycpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1jaGFydGpzLTInKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnY2hhcnQtdmVuZG9yJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2pzcGRmJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ3BkZi12ZW5kb3InO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnaHRtbDJjYW52YXMnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnaHRtbDJjYW52YXMtdmVuZG9yJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBGbGF0cGlja3IgLSBvbmx5IGZvciBkYXRlIHBpY2tlcnNcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdmbGF0cGlja3InKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnZmxhdHBpY2tyLXZlbmRvcic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gR29vZ2xlIEdlbmVyYXRpdmUgQUkgLSBvbmx5IGZvciBBSSBmZWF0dXJlc1xyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0Bnb29nbGUvZ2VuZXJhdGl2ZS1haScpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICdhaS12ZW5kb3InO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEFsbCBvdGhlciBub2RlX21vZHVsZXNcclxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLCAvLyBSZW1vdmUgY29uc29sZS5sb2dzIGluIHByb2R1Y3Rpb25cclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICAgIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJywgJ2NvbnNvbGUuZGVidWcnXSxcclxuICAgICAgICBwYXNzZXM6IDIgLy8gTXVsdGlwbGUgcGFzc2VzIGZvciBiZXR0ZXIgY29tcHJlc3Npb25cclxuICAgICAgfSxcclxuICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgY29tbWVudHM6IGZhbHNlIC8vIFJlbW92ZSBjb21tZW50c1xyXG4gICAgICB9LFxyXG4gICAgICBtYW5nbGU6IHtcclxuICAgICAgICBzYWZhcmkxMDogdHJ1ZSAvLyBCZXR0ZXIgU2FmYXJpIGNvbXBhdGliaWxpdHlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LCAvLyBJbmxpbmUgYXNzZXRzIHNtYWxsZXIgdGhhbiA0a2JcclxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSAvLyBGYXN0ZXIgYnVpbGRzXHJcbiAgfVxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxvQkFBb0I7QUFDelYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBR3pCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWMsQ0FBQyxPQUFPO0FBRXBCLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUUvQixnQkFBSSxHQUFHLFNBQVMsT0FBTyxLQUFLLEdBQUcsU0FBUyxXQUFXLEtBQUssR0FBRyxTQUFTLGtCQUFrQixHQUFHO0FBQ3ZGLHFCQUFPO0FBQUEsWUFDVDtBQUVBLGdCQUFJLEdBQUcsU0FBUyxvQkFBb0IsR0FBRztBQUNyQyxxQkFBTztBQUFBLFlBQ1Q7QUFFQSxnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLHFCQUFPO0FBQUEsWUFDVDtBQUVBLGdCQUFJLEdBQUcsU0FBUyxVQUFVLEtBQUssR0FBRyxTQUFTLGlCQUFpQixHQUFHO0FBQzdELHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxPQUFPLEdBQUc7QUFDeEIscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGFBQWEsR0FBRztBQUM5QixxQkFBTztBQUFBLFlBQ1Q7QUFFQSxnQkFBSSxHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQzVCLHFCQUFPO0FBQUEsWUFDVDtBQUVBLGdCQUFJLEdBQUcsU0FBUyx1QkFBdUIsR0FBRztBQUN4QyxxQkFBTztBQUFBLFlBQ1Q7QUFFQSxtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBLElBQ3ZCLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2YsWUFBWSxDQUFDLGVBQWUsZ0JBQWdCLGVBQWU7QUFBQSxRQUMzRCxRQUFRO0FBQUE7QUFBQSxNQUNWO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNaO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsbUJBQW1CO0FBQUE7QUFBQSxJQUNuQixzQkFBc0I7QUFBQTtBQUFBLEVBQ3hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
