import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { initWebVitals } from './utils/webVitals'
import { initAnalytics } from './utils/analyticsTracker.js'

// Gerçek zamanlı analytics tracking'i başlat (admin paneli hariç)
if (!window.location.pathname.startsWith('/admin')) {
  setTimeout(() => {
    initAnalytics()
    console.log('Analytics tracking aktif')
  }, 1000)
}

// NOT: Tarayıcı önbelleğini her ziyarette temizleyen bloklar kaldırıldı.
// Önceden burada tüm SW kaydı ve Cache Storage siliniyordu; bu, dönen
// ziyaretçilerin her seferinde 1+ MB JS bundle'ı yeniden indirmesine yol
// açıyordu. Asset hash'leri (Vite [hash].js) zaten cache busting sağlar.

// Initialize Web Vitals monitoring
if (typeof window !== 'undefined') {
  initWebVitals();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
