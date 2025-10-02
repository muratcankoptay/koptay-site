import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import ArticlePage from './pages/ArticlePage'
import ArticlesPage from './pages/ArticlesPage'
import HizmetlerimizPage from './pages/HizmetlerimizPage'
import HesaplamaAraclariPage from './pages/HesaplamaAraclariPage'
import InfazYatarPage from './pages/InfazYatarPage'
import TazminatHesaplamaPage from './pages/TazminatHesaplamaPage'
import MakalelerPage from './pages/MakalelerPage'
import IletisimPage from './pages/IletisimPage'
import MuvekkilPaneliPage from './pages/MuvekkilPaneliPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hizmetlerimiz" element={<HizmetlerimizPage />} />
          <Route path="/hesaplama-araclari" element={<HesaplamaAraclariPage />} />
          <Route path="/hesaplama-araclari/infaz-yatar" element={<InfazYatarPage />} />
          <Route path="/hesaplama-araclari/tazminat-hesaplama" element={<TazminatHesaplamaPage />} />
          <Route path="/makaleler" element={<ArticlesPage />} />
          <Route path="/makaleler/:slug" element={<ArticlePage />} />
          <Route path="/makale/:slug" element={<ArticlePage />} />
          <Route path="/iletisim" element={<IletisimPage />} />
          <Route path="/muvekkil-paneli" element={<MuvekkilPaneliPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App