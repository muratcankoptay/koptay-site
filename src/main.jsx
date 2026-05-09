import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { initWebVitals } from './utils/webVitals'
import { initAnalytics } from './utils/analyticsTracker.js'

// === Bir defalik temizlik: eski Service Worker + cache kaliplari ===
// Onceden main.jsx her ziyarette SW unregister + cache silme yapiyordu
// (1+ MB JS'in yeniden indirilmesine yol aciyordu).
// Yeni surumde bu islem TEK SEFER calisir; localStorage flag'i ile isaretlenir.
// Boylece eski cache'lere takili kalmis ziyaretciler temiz baslangic yapar,
// sonraki ziyaretlerde tarayici onbellegi normal sekilde calisir.
(function bootstrapCleanup() {
  try {
    if (localStorage.getItem('__koptay_cache_purged_v1') === '1') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      }).catch(() => {});
    }

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((k) => caches.delete(k));
      }).catch(() => {});
    }

    localStorage.setItem('__koptay_cache_purged_v1', '1');
  } catch (e) {
    // localStorage erisilemiyorsa sessizce gec
  }
})();

// Anasayfaya ozel hero gorseli preload — diger sayfalarda gereksiz uyari
// vermesini engellemek icin pathname'e bagli olarak dinamik ekleniyor.
(function preloadHeroOnHome() {
  try {
    const p = window.location.pathname;
    if (p === '/' || p === '') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = '/images/hero-bg-1.webp';
      link.type = 'image/webp';
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }
  } catch (e) { /* yoksay */ }
})();

// Gercek zamanli analytics tracking'i baslat (admin paneli haric)
if (!window.location.pathname.startsWith('/admin')) {
  setTimeout(() => {
    initAnalytics()
  }, 1000)
}

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
