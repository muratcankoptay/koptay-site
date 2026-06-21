import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Calendar, Clock, ArrowRight, Building2, ChevronRight, Landmark, Home } from 'lucide-react'
import SEO from '../components/SEO'

const DATA_URL = '/data/kamulastirma.json'

const KamulastirmaIlPage = () => {
  const { il: ilSlug, ilce: ilceSlug } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData({ ilanlar: [], iller: [] }))
  }, [])

  const formatDate = (s) => {
    if (!s) return ''
    try { return new Date(s).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return s }
  }

  const ilanlar = (data?.ilanlar || []).filter(i =>
    i.il_slug === ilSlug && (!ilceSlug || i.ilce_slug === ilceSlug)
  )
  const ilBilgi = (data?.iller || []).find(x => x.il_slug === ilSlug)
  const ilAdi = ilBilgi?.il || ilanlar[0]?.il || ilSlug
  const ilceAdi = ilceSlug ? (ilanlar[0]?.ilce || ilceSlug) : null

  const baslik = ilceAdi
    ? `${ilAdi} / ${ilceAdi} Kamulaştırma İlanları`
    : `${ilAdi} Kamulaştırma İlanları`
  const aciklama = ilceAdi
    ? `${ilAdi} ${ilceAdi} ilçesinde Resmî Gazete'de yayımlanan güncel kamulaştırma, acele kamulaştırma ve irtifak ilanları, parsel bilgileri ve dava süreleri.`
    : `${ilAdi} ilinde Resmî Gazete'de yayımlanan güncel kamulaştırma, acele kamulaştırma ve irtifak ilanları. İlçe bazında parsel ve dava süresi bilgileri.`

  const url = ilceSlug
    ? `/kamulastirma-haritasi/${ilSlug}/${ilceSlug}`
    : `/kamulastirma-haritasi/${ilSlug}`

  return (
    <>
      <SEO title={`${baslik} | Koptay Hukuk Bürosu`} description={aciklama} url={url} />

      <section className="page-hero">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="text-white/70 text-xs mb-3 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-white inline-flex items-center gap-1"><Home className="w-3 h-3" />Ana Sayfa</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/kamulastirma-haritasi" className="hover:text-white">Kamulaştırma Haritası</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/kamulastirma-haritasi/${ilSlug}`} className="hover:text-white">{ilAdi}</Link>
            {ilceAdi && (<><ChevronRight className="w-3 h-3" /><span className="text-white">{ilceAdi}</span></>)}
          </nav>
          <h1 className="page-hero-title">{baslik}</h1>
          <p className="page-hero-subtitle">{aciklama}</p>
        </div>
      </section>

      {/* İlçe kısayolları (sadece il sayfasında) */}
      {!ilceSlug && ilBilgi?.ilceler?.length > 0 && (
        <section className="bg-white border-b py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              {ilBilgi.ilceler.map(ic => (
                <Link key={ic.ilce_slug} to={`/kamulastirma-haritasi/${ilSlug}/${ic.ilce_slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-800 rounded-full text-sm font-medium hover:bg-cyan-100 transition-colors">
                  <MapPin className="w-3.5 h-3.5" />{ic.ilce} <span className="text-cyan-500">({ic.sayi})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 bg-gray-50 min-h-[40vh]">
        <div className="container mx-auto px-4">
          {data === null ? (
            <p className="text-center text-gray-400 py-20">Yükleniyor...</p>
          ) : ilanlar.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ilanlar.map((ilan, index) => (
                <article key={ilan.id || index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className="relative h-28 overflow-hidden" style={{
                    background: ilan.acele
                      ? 'linear-gradient(135deg, #92400e 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #065f46 0%, #059669 100%)'
                  }}>
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <span className="text-sm font-semibold">{[ilan.koy, ilan.ilce].filter(Boolean).join(' / ') || ilan.il}</span>
                    </div>
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700">{ilan.karar_etiket}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(ilan.tarih)}</span>
                      {ilan.son_dava_tarihi && (
                        <span className="flex items-center gap-1 text-amber-700"><Clock className="w-3.5 h-3.5" />{formatDate(ilan.son_dava_tarihi)}</span>
                      )}
                    </div>
                    {ilan.kurum && (
                      <div className="flex items-center gap-1.5 text-sm text-cyan-700 mb-2">
                        <Landmark className="w-3.5 h-3.5" /><span className="font-medium line-clamp-1">{ilan.kurum}</span>
                      </div>
                    )}
                    <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug font-serif line-clamp-2">{ilan.baslik}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{ilan.ozet}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Bu bölge için henüz ilan yok</h2>
              <p className="text-gray-500 mb-6">{ilAdi} için güncel kamulaştırma ilanları eklendikçe burada listelenecek.</p>
              <Link to="/kamulastirma-haritasi" className="inline-flex items-center gap-2 bg-cyan-700 text-white px-6 py-3 rounded-xl hover:bg-cyan-800 transition-colors font-medium">
                Tüm Haritaya Dön<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-14" style={{ background: 'linear-gradient(135deg, #164e63 0%, #134e4a 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-10 h-10 text-emerald-300 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-light text-white mb-3 font-serif">{ilAdi}'de kamulaştırma davası</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">Kamulaştırma bedeline itiraz ve bedel artırım davalarında 30 günlük süre kritiktir. Uzman hukuki destek için bizimle iletişime geçin.</p>
          <Link to="/iletisim" className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-300 shadow-lg">
            İletişime Geç<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}

export default KamulastirmaIlPage
