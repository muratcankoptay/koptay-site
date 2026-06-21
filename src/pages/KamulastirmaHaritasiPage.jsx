import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Clock, ArrowRight, Building2, ChevronRight, Tag, Landmark, Gavel, Layers } from 'lucide-react'
import SEO from '../components/SEO'

const DATA_URL = '/data/kamulastirma.json'

// Leaflet'i (harita kütüphanesi) yalnızca tarayıcıda, CDN'den yükle.
function leafletYukle() {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L)
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(css)
    const js = document.createElement('script')
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    js.async = true
    js.onload = () => resolve(window.L)
    js.onerror = reject
    document.body.appendChild(js)
  })
}

const KamulastirmaHaritasiPage = () => {
  const [ilanlar, setIlanlar] = useState([])
  const [iller, setIller] = useState([])
  const [guncelleme, setGuncelleme] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIl, setSelectedIl] = useState('Tümü')
  const [selectedTur, setSelectedTur] = useState('Tümü')

  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerLayer = useRef(null)

  // Veriyi çek
  useEffect(() => {
    fetch(DATA_URL)
      .then(r => (r.ok ? r.json() : { ilanlar: [], iller: [] }))
      .then(d => {
        setIlanlar(d.ilanlar || [])
        setIller(d.iller || [])
        setGuncelleme(d.guncelleme || null)
      })
      .catch(() => { setIlanlar([]); setIller([]) })
  }, [])

  const turler = ['Tümü', ...Array.from(new Set(ilanlar.map(i => i.karar_etiket).filter(Boolean)))]

  const filtreli = ilanlar.filter(i => {
    if (selectedIl !== 'Tümü' && i.il !== selectedIl) return false
    if (selectedTur !== 'Tümü' && i.karar_etiket !== selectedTur) return false
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      const hav = `${i.baslik} ${i.ozet} ${i.il} ${i.ilce} ${i.koy} ${i.kurum} ${i.amac}`.toLowerCase()
      if (!hav.includes(t)) return false
    }
    return true
  })

  // Haritayı kur
  useEffect(() => {
    let iptal = false
    leafletYukle().then(L => {
      if (iptal || !mapRef.current) return
      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, { scrollWheelZoom: false })
          .setView([39.0, 35.2], 6)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap', maxZoom: 18,
        }).addTo(mapInstance.current)
        markerLayer.current = L.layerGroup().addTo(mapInstance.current)
      }
    }).catch(() => {})
    return () => { iptal = true }
  }, [])

  // İşaretçileri filtreye göre güncelle
  useEffect(() => {
    const L = window.L
    if (!L || !markerLayer.current) return
    markerLayer.current.clearLayers()
    filtreli.forEach(i => {
      if (typeof i.lat !== 'number' || typeof i.lng !== 'number') return
      const m = L.marker([i.lat, i.lng])
      const yer = [i.ilce, i.il].filter(Boolean).join(', ')
      m.bindPopup(
        `<strong>${i.baslik || 'Kamulaştırma'}</strong><br/>` +
        `<span style="color:#0e7490">${yer}</span><br/>` +
        `${i.amac ? 'Amaç: ' + i.amac + '<br/>' : ''}` +
        `<a href="/kamulastirma-haritasi/${i.il_slug}" style="color:#0891b2;font-weight:600">${i.il} ilanlarını gör →</a>`
      )
      markerLayer.current.addLayer(m)
    })
  }, [filtreli])

  const formatDate = (s) => {
    if (!s) return ''
    try { return new Date(s).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return s }
  }

  const stats = [
    { label: 'Toplam İlan', value: ilanlar.length, icon: Layers, color: 'text-blue-600 bg-blue-50' },
    { label: 'İl Sayısı', value: iller.length, icon: MapPin, color: 'text-red-600 bg-red-50' },
    { label: 'Acele Kamulaştırma', value: ilanlar.filter(i => i.acele).length, icon: Gavel, color: 'text-amber-600 bg-amber-50' },
    { label: 'Kurum', value: new Set(ilanlar.map(i => i.kurum).filter(Boolean)).size, icon: Landmark, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <>
      <SEO
        title="Kamulaştırma Haritası — Güncel İlanlar | Koptay Hukuk Bürosu"
        description="Resmî Gazete'de yayımlanan güncel kamulaştırma, acele kamulaştırma ve irtifak ilanlarının il/ilçe bazında interaktif haritası. Taşınmazınız etkileniyor mu, dava süresi ne zaman doluyor?"
        url="/kamulastirma-haritasi"
      />

      {/* Hero */}
      <section className="page-hero">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-lawSecondary" />
              <span className="text-white/85 text-xs font-medium tracking-wide">Resmî Gazete'den Otomatik Güncellenir</span>
            </div>
            <h1 className="page-hero-title">
              Kamulaştırma <span className="text-lawSecondary italic">Haritası</span>
            </h1>
            <p className="page-hero-subtitle">
              Resmî Gazete'de yayımlanan kamulaştırma, acele kamulaştırma ve irtifak ilanları —
              il/ilçe bazında, harita üzerinde. Yalnızca bilgilendirme amaçlıdır.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b shadow-sm -mt-1 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Harita */}
      <section className="bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <div ref={mapRef} style={{ height: '460px', width: '100%' }} aria-label="Kamulaştırma ilanları haritası" />
          </div>
          {guncelleme && (
            <p className="text-xs text-gray-400 mt-2 text-right">
              Son güncelleme: {formatDate(guncelleme)}
            </p>
          )}
        </div>
      </section>

      {/* Filtreler */}
      <section className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="İl, ilçe, köy, kurum veya amaç ara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm"
              />
            </div>
            <select value={selectedIl} onChange={e => setSelectedIl(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500">
              <option value="Tümü">Tüm İller</option>
              {iller.map(il => <option key={il.il} value={il.il}>{il.il} ({il.sayi})</option>)}
            </select>
            <select value={selectedTur} onChange={e => setSelectedTur(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500">
              {turler.map(t => <option key={t} value={t}>{t === 'Tümü' ? 'Tüm Türler' : t}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Liste */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {filtreli.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtreli.map((ilan, index) => (
                <article key={ilan.id || index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
                  <div className="relative h-32 overflow-hidden" style={{
                    background: ilan.acele
                      ? 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)'
                      : 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
                  }}>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                      <div>
                        <MapPin className="w-8 h-8 mx-auto mb-1 opacity-80" />
                        <div className="text-sm font-semibold opacity-90">{[ilan.ilce, ilan.il].filter(Boolean).join(' / ')}</div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700">
                        {ilan.karar_etiket}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(ilan.tarih)}</span>
                      {ilan.son_dava_tarihi && (
                        <span className="flex items-center gap-1 text-amber-700" title="Son dava tarihi">
                          <Clock className="w-3.5 h-3.5" />{formatDate(ilan.son_dava_tarihi)}
                        </span>
                      )}
                    </div>
                    {ilan.kurum && (
                      <div className="flex items-center gap-1.5 text-sm text-cyan-700 mb-2">
                        <Landmark className="w-3.5 h-3.5" /><span className="font-medium line-clamp-1">{ilan.kurum}</span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug font-serif group-hover:text-cyan-700 transition-colors line-clamp-2">
                      {ilan.baslik}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{ilan.ozet}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(ilan.etiketler || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                    <Link to={`/kamulastirma-haritasi/${ilan.il_slug}`}
                      className="flex items-center text-cyan-700 font-semibold text-sm group-hover:text-cyan-800 transition-colors">
                      {ilan.il} ilanlarını gör
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">İlan bulunamadı</h3>
              <p className="text-gray-500 mb-6">Filtreleri değiştirerek tekrar deneyin veya yakında eklenecek güncel ilanları takip edin.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedIl('Tümü'); setSelectedTur('Tümü') }}
                className="bg-cyan-700 text-white px-6 py-3 rounded-xl hover:bg-cyan-800 transition-colors font-medium">
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #164e63 0%, #134e4a 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-12 h-12 text-emerald-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-light text-white mb-3 font-serif">Taşınmazınız mı kamulaştırıldı?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Kamulaştırma bedelinin artırılması ve dava süreçleri için 30 günlük dava açma süresi kritiktir. Uzman hukuki destek için bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/iletisim" className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-300 shadow-lg">
              İletişime Geç<ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+905307111864" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
              Telefon
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default KamulastirmaHaritasiPage
