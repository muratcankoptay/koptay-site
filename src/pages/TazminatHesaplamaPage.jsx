import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Home, ChevronRight, Info, Phone, ArrowLeft, Shield } from 'lucide-react'
import SEO from '../components/SEO'

const TazminatHesaplamaPage = () => {
  const [formData, setFormData] = useState({
    netMaas: '',
    calismaYili: '',
    yas: '',
    maddiHasar: '',
    kazaTipi: 'is-kazasi'
  })
  
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateTazminat = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const netMaas = parseFloat(formData.netMaas) || 0
      const calismaYili = parseInt(formData.calismaYili) || 0
      const yas = parseInt(formData.yas) || 0
      const maddiHasar = parseFloat(formData.maddiHasar) || 0
      
      if (netMaas > 0 && calismaYili > 0 && yas > 0) {
        // Basit tazminat hesaplama örneği
        const emeklilikYasi = 65
        const kalanCalismaYili = Math.max(0, emeklilikYasi - yas)
        const yillikGelir = netMaas * 12
        const gelirKaybi = yillikGelir * Math.min(kalanCalismaYili, 20) * 0.7 // %70 oranında
        const maneviTazminat = netMaas * 24 // 24 aylık maaş
        const toplamTazminat = gelirKaybi + maneviTazminat + maddiHasar
        
        setResult({
          gelirKaybi: gelirKaybi.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
          maneviTazminat: maneviTazminat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
          maddiHasar: maddiHasar.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
          toplamTazminat: toplamTazminat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
          kalanCalismaYili: kalanCalismaYili
        })
      }
      setIsCalculating(false)
    }, 1000)
  }

  const clearForm = () => {
    setFormData({
      netMaas: '',
      calismaYili: '',
      yas: '',
      maddiHasar: '',
      kazaTipi: 'is-kazasi'
    })
    setResult(null)
  }

  return (
    <>
      <SEO 
        title="Tazminat Hesaplama - İş Kazası ve Meslek Hastalığı Tazminat Hesaplama | Koptay Hukuk"
        description="İş kazası ve meslek hastalığı tazminat hesaplama aracı. Ücretsiz tazminat hesaplama ile haklarınızı öğrenin. Uzman avukat desteği ile güvenilir hesaplama."
        keywords="tazminat hesaplama, iş kazası tazminat, meslek hastalığı tazminat, tazminat miktarı hesaplama, işçi tazminat hesaplama, avukat tazminat"
        url="/hesaplama-araclari/tazminat-hesaplama"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 mt-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-green-100 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/hesaplama-araclari" className="hover:text-white transition-colors">
              Hesaplama Araçları
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Tazminat Hesaplama</span>
          </nav>

          <div className="max-w-4xl">
            <TrendingUp className="w-16 h-16 mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Tazminat Hesaplama
            </h1>
            <p className="text-xl mb-8 max-w-3xl leading-relaxed">
              İş kazası ve meslek hastalığı tazminat hesaplama aracımızla, 
              hak ettiğiniz tazminat miktarını öğrenin. Ücretsiz ve güvenilir hesaplama.
            </p>
          </div>
        </div>
      </section>

      {/* Bilgilendirme Bölümü */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start space-x-4 mb-6">
                <Info className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tazminat Hesaplama Nedir?</h2>
                  <div className="prose max-w-none text-gray-700 space-y-4">
                    <p>
                      İş kazası veya meslek hastalığı nedeniyle çalışma gücünü kaybeden işçilerin, 
                      gelir kaybı ve manevi zararları için talep edebileceği tazminat miktarının hesaplanmasıdır.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Tazminat Türleri:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Gelir Kaybı Tazminatı:</strong> Çalışamama nedeniyle kaybedilen gelir</li>
                      <li><strong>Manevi Tazminat:</strong> Yaşanan acı, üzüntü ve sıkıntılar için</li>
                      <li><strong>Maddi Hasar:</strong> Tedavi giderleri ve diğer masraflar</li>
                      <li><strong>Destekten Yoksun Kalma:</strong> Vefat halinde aile mensupları için</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Hesaplama Faktörleri:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>İşçinin yaşı ve emekliliğe kalan süre</li>
                      <li>Aylık net maaş tutarı</li>
                      <li>Çalışma gücü kaybı oranı</li>
                      <li>Çalışma yılı ve deneyim</li>
                      <li>Maddi hasar ve tedavi giderleri</li>
                    </ul>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                      <p className="text-yellow-800 text-sm">
                        <strong>Önemli:</strong> Her dava kendine özgüdür. Bu hesaplama genel bir fikir vermek içindir. 
                        Kesin tazminat miktarı mahkeme kararı ile belirlenir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hesaplama Formu */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hesaplama Formu</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kaza Tipi *
                    </label>
                    <select
                      name="kazaTipi"
                      value={formData.kazaTipi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="is-kazasi">İş Kazası</option>
                      <option value="meslek-hastaligi">Meslek Hastalığı</option>
                      <option value="yol-kazasi">İşe Gidiş-Geliş Kazası</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aylık Net Maaş (TL) *
                    </label>
                    <input
                      type="number"
                      name="netMaas"
                      value={formData.netMaas}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Örn: 15000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Çalışma Yılı *
                    </label>
                    <input
                      type="number"
                      name="calismaYili"
                      value={formData.calismaYili}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Örn: 10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yaş *
                    </label>
                    <input
                      type="number"
                      name="yas"
                      value={formData.yas}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Örn: 35"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maddi Hasar/Tedavi Giderleri (TL)
                    </label>
                    <input
                      type="number"
                      name="maddiHasar"
                      value={formData.maddiHasar}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Örn: 25000"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={calculateTazminat}
                      disabled={isCalculating}
                      className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isCalculating ? 'Hesaplanıyor...' : 'Hesapla'}
                    </button>
                    
                    <button
                      onClick={clearForm}
                      className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Temizle
                    </button>
                  </div>
                </div>
              </div>

              {/* Sonuç */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tahmini Tazminat</h2>
                
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Gelir Kaybı:</span>
                        <span className="font-semibold text-gray-900">{result.gelirKaybi}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Manevi Tazminat:</span>
                        <span className="font-semibold text-blue-600">{result.maneviTazminat}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Maddi Hasar:</span>
                        <span className="font-semibold text-red-600">{result.maddiHasar}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Kalan Çalışma Yılı:</span>
                        <span className="font-semibold text-gray-900">{result.kalanCalismaYili} yıl</span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Toplam Tazminat:</span>
                        <span className="text-xl font-bold text-green-600">{result.toplamTazminat}</span>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-orange-800 text-sm font-medium mb-1">Önemli Uyarı</p>
                          <p className="text-orange-700 text-sm">
                            Bu hesaplama tahminidir. Gerçek tazminat miktarı mahkeme kararı, 
                            çalışma gücü kaybı raporu ve diğer faktörlere göre değişebilir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Tazminat hesaplama yapmak için formu doldurun</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SSS Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sıkça Sorulan Sorular</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Tazminat davası açmak için süre sınırı var mı?",
                  answer: "İş kazası ve meslek hastalığı tazminat davaları için 10 yıllık zamanaşımı süresi vardır. Bu süre kaza tarihinden itibaren başlar."
                },
                {
                  question: "SGK'dan aldığım ödemeler tazminattan düşülür mü?",
                  answer: "SGK'dan alınan geçici iş göremezlik ödeneği ve sürekli iş göremezlik geliri, tazminat miktarından mahsup edilebilir."
                },
                {
                  question: "Manevi tazminat miktarı nasıl belirlenir?",
                  answer: "Manevi tazminat, kişinin yaşadığı acı ve üzüntü dikkate alınarak mahkeme tarafından belirlenir. Genellikle 24-36 aylık maaş tutarı kadar olur."
                },
                {
                  question: "İşverenin kusuru nasıl belirlenir?",
                  answer: "İş güvenliği tedbirlerinin alınmaması, eğitim verilmemesi gibi durumlar işverenin kusuru olarak değerlendirilir. Kusur oranı tazminat miktarını etkiler."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Tazminat Davanız İçin Uzman Destek</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            İş kazası ve meslek hastalığı tazminat davalarında deneyimli avukatlarımızdan 
            ücretsiz ön görüşme alabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+905307111864"
              className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Hemen Ara
            </a>
            <Link 
              to="/iletisim"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

      {/* Geri Dön */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link 
            to="/hesaplama-araclari"
            className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tüm Hesaplama Araçlarına Dön
          </Link>
        </div>
      </section>
    </>
  )
}

export default TazminatHesaplamaPage