import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CookieConsent from './components/CookieConsent'

// Critical pages - load immediately
import Home from './pages/Home'
import ArticlePage from './pages/ArticlePage'

// Non-critical pages - lazy load
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const HizmetlerimizPage = lazy(() => import('./pages/HizmetlerimizPage'))
const EkibimizPage = lazy(() => import('./pages/EkibimizPage'))
const HesaplamaAraclariPage = lazy(() => import('./pages/HesaplamaAraclariPage'))
const InfazYatarPage = lazy(() => import('./pages/InfazYatarPage'))
const TazminatHesaplamaPage = lazy(() => import('./pages/TazminatHesaplamaPage'))
const VekaletUcretiPage = lazy(() => import('./pages/VekaletUcretiPage'))
const AracDegerKaybiPage = lazy(() => import('./pages/AracDegerKaybiPage'))
const MeslekHastaligiPage = lazy(() => import('./pages/MeslekHastaligiPage'))
const IscilikAlacaklariPage = lazy(() => import('./pages/IscilikAlacaklariPage'))
const TrafikKazasiPage = lazy(() => import('./pages/TrafikKazasiPage'))
const MakalelerPage = lazy(() => import('./pages/MakalelerPage'))
const IletisimPage = lazy(() => import('./pages/IletisimPage'))
const MuvekkilPaneliPage = lazy(() => import('./pages/MuvekkilPaneliPage'))
const KvkkPage = lazy(() => import('./pages/KvkkPage'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
  </div>
)

function App() {
  // Handle Global Loader removal
  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      // Small delay to ensure smooth transition and prevent flash
      setTimeout(() => {
        loader.classList.add('loader-hidden');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500); // Match CSS transition duration
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hizmetlerimiz" element={<HizmetlerimizPage />} />
            <Route path="/ekibimiz" element={<EkibimizPage />} />
            <Route path="/hesaplama-araclari" element={<HesaplamaAraclariPage />} />
            <Route path="/hesaplama-araclari/infaz-yatar" element={<InfazYatarPage />} />
            <Route path="/hesaplama-araclari/tazminat-hesaplama" element={<TazminatHesaplamaPage />} />
            <Route path="/hesaplama-araclari/vekalet-ucreti" element={<VekaletUcretiPage />} />
            <Route path="/hesaplama-araclari/arac-deger-kaybi" element={<AracDegerKaybiPage />} />
            <Route path="/hesaplama-araclari/deger-kaybi" element={<AracDegerKaybiPage />} />
            <Route path="/hesaplama-araclari/meslek-hastaligi" element={<MeslekHastaligiPage />} />
            <Route path="/hesaplama-araclari/iscilik-alacaklari" element={<IscilikAlacaklariPage />} />
            <Route path="/hesaplama-araclari/trafik-kazasi" element={<TrafikKazasiPage />} />
            <Route path="/makaleler" element={<ArticlesPage />} />
            <Route path="/makaleler/:slug" element={<ArticlePage />} />
            <Route path="/makale/:slug" element={<ArticlePage />} />
            <Route path="/iletisim" element={<IletisimPage />} />
            <Route path="/muvekkil-paneli" element={<MuvekkilPaneliPage />} />
            <Route path="/kvkk" element={<KvkkPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  )
}

export default App