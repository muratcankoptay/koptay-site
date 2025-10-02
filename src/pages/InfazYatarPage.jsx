import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, Home, ChevronRight, Info, Phone, ArrowLeft, Clock, Calendar, AlertTriangle } from 'lucide-react'
import SEO from '../components/SEO'

const InfazYatarPage = () => {
  const [formData, setFormData] = useState({
    crimeType: 'general_yaralama',
    years: '',
    months: '',
    days: '',
    crimeDate: '',
    startDate: '',
    mahsup: '0',
    discipline: '0'
  })
  
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateInfaz = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const { crimeType, years, months, days, crimeDate, startDate, mahsup, discipline } = formData
      
      let y = parseInt(years || 0)
      let m = parseInt(months || 0)
      let d = parseInt(days || 0)
      let mahsupDays = parseInt(mahsup || 0)
      let disciplineDays = parseInt(discipline || 0)

      // Toplam gün hesaplama
      let totalDays = y * 365 + m * 30 + d

      // Suç tipine göre koşullu salıverilme oranı
      let fraction = 1/2 // varsayılan genel suçlar oranı
      let denetimli = 365 // varsayılan 1 yıl

      // Suç tarihine göre denetimli serbestlik farkı
      const crimeDateObj = new Date(crimeDate)
      const cutoffDate = new Date("2020-03-30")
      if(crimeDateObj < cutoffDate) { 
        denetimli = 3 * 365 // 2020 öncesi → 3 yıl
      }

      // Suç tipine göre hesaplama
      if(crimeType.startsWith('serious_')){
        fraction = 3/4
        denetimli = (crimeDateObj < cutoffDate ? 3*365 : 1*365)
      }
      if(crimeType === 'life'){
        totalDays = 30 * 365
        fraction = 1
      }
      if(crimeType === 'lifeAggravated'){
        totalDays = 36 * 365
        fraction = 1
      }

      // Tarih hesaplamaları
      let fullTerm = totalDays // hakederek tahliye
      let kosullu = Math.ceil(totalDays * fraction) + disciplineDays - mahsupDays
      let denetimliS = kosullu - denetimli

      const startDateObj = new Date(startDate + "T00:00:00")
      const tahliyeDate = new Date(startDateObj.getTime() + fullTerm * 24 * 60 * 60 * 1000)
      const kosulluDate = new Date(startDateObj.getTime() + kosullu * 24 * 60 * 60 * 1000)
      const dsDate = new Date(startDateObj.getTime() + denetimliS * 24 * 60 * 60 * 1000)

      setResult({
        fullTerm,
        kosullu,
        denetimliS,
        mahsupDays,
        tahliyeDate: tahliyeDate.toLocaleDateString("tr-TR"),
        kosulluDate: kosulluDate.toLocaleDateString("tr-TR"),
        dsDate: dsDate.toLocaleDateString("tr-TR"),
        crimeTypeText: getCrimeTypeText(crimeType),
        fraction: Math.round(fraction * 100),
        denetimliYears: denetimli / 365
      })
      
      setIsCalculating(false)
    }, 1000)
  }

  const getCrimeTypeText = (type) => {
    switch(type) {
      case 'general_yaralama': return 'Kasten Yaralama'
      case 'general_hirsizlik': return 'Hırsızlık'
      case 'general_dolandiricilik': return 'Dolandırıcılık'
      case 'general_tehdit': return 'Tehdit'
      case 'general_zimmet': return 'Zimmet'
      case 'serious_uyusturucu': return 'Uyuşturucu İmal ve Ticareti'
      case 'serious_teror': return 'Terör Suçları'
      case 'serious_orgutlu': return 'Örgütlü Suçlar'
      case 'serious_cinsel': return 'Cinsel Saldırı / Cinsel Dokunulmazlığa Karşı Suçlar'
      case 'life': return 'Müebbet (30 yıl)'
      case 'lifeAggravated': return 'Ağırlaştırılmış Müebbet (36 yıl)'
      default: return 'Genel Suçlar'
    }
  }

  const clearForm = () => {
    setFormData({
      crimeType: 'general_yaralama',
      years: '',
      months: '',
      days: '',
      crimeDate: '',
      startDate: '',
      mahsup: '0',
      discipline: '0'
    })
    setResult(null)
  }

  return (
    <>
      <SEO 
        title="İnfaz Süresi Hesaplama - Ceza İnfaz Hesaplayıcısı | Koptay Hukuk"
        description="Ceza infazı süresi hesaplama aracı. Koşullu salıverme, denetimli serbestlik hesaplaması. CGTİK m.107 ve m.105/A esas alınmıştır. Ücretsiz hukuki hesaplama."
        keywords="infaz süresi hesaplama, koşullu salıverme hesaplama, denetimli serbestlik, ceza infazı, CGTİK, infaz hesaplayıcısı, ceza süresi hesaplama"
        url="/hesaplama-araclari/infaz-yatar"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 mt-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-blue-100 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/hesaplama-araclari" className="hover:text-white transition-colors">
              Hesaplama Araçları
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">İnfaz Süresi Hesaplama</span>
          </nav>

          <div className="max-w-4xl">
            <Clock className="w-16 h-16 mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              İnfaz Süresi Hesaplama
            </h1>
            <p className="text-xl mb-8 max-w-3xl leading-relaxed">
              Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun'a göre 
              infaz süresi, koşullu salıverme ve denetimli serbestlik hesaplaması yapın.
            </p>
          </div>
        </div>
      </section>

      {/* Bilgilendirme Bölümü */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start space-x-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ceza İnfaz Süresi Hesaplama</h2>
                  <div className="prose max-w-none text-gray-700 space-y-4">
                    <p className="text-lg font-medium text-blue-800 bg-blue-100 p-4 rounded-lg">
                      Bu araç <strong>Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun m.107 ve m.105/A</strong> esas alınarak geliştirilmiştir.
                      <br />
                      <strong>Bilgi amaçlıdır, kesin sonuç için infaz hâkimliği ve avukatınıza başvurun.</strong>
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Suç Türlerine Göre Oranlar:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Genel Suçlar (1/2 oranı):</strong> Kasten yaralama, hırsızlık, dolandırıcılık, tehdit, zimmet</li>
                      <li><strong>Ağır Suçlar (3/4 oranı):</strong> Terör, örgütlü, uyuşturucu, cinsel suçlar</li>
                      <li><strong>Müebbet Hapis:</strong> 30 yıl infaz süresi</li>
                      <li><strong>Ağırlaştırılmış Müebbet:</strong> 36 yıl infaz süresi</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Denetimli Serbestlik Süreleri:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>30 Mart 2020 sonrası suçlar:</strong> Son 1 yıl denetimli serbestlik</li>
                      <li><strong>30 Mart 2020 öncesi suçlar:</strong> Son 3 yıl denetimli serbestlik</li>
                      <li><strong>Müebbet cezalar:</strong> Son 3 yıl denetimli serbestlik</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Mahsup Günleri:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Tutukluluk süresi</li>
                      <li>Gözaltı süresi</li>
                      <li>Diğer yasal mahsup sebepleri</li>
                    </ul>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                  Hesaplama Formu
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suç Türü *
                    </label>
                    <select
                      name="crimeType"
                      value={formData.crimeType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <optgroup label="Genel Suçlar (1/2 oranı)">
                        <option value="general_yaralama">Kasten Yaralama</option>
                        <option value="general_hirsizlik">Hırsızlık</option>
                        <option value="general_dolandiricilik">Dolandırıcılık</option>
                        <option value="general_tehdit">Tehdit</option>
                        <option value="general_zimmet">Zimmet</option>
                      </optgroup>
                      <optgroup label="Ağır Suçlar (3/4 oranı)">
                        <option value="serious_uyusturucu">Uyuşturucu İmal ve Ticareti</option>
                        <option value="serious_teror">Terör Suçları</option>
                        <option value="serious_orgutlu">Örgütlü Suçlar</option>
                        <option value="serious_cinsel">Cinsel Saldırı / Cinsel Dokunulmazlığa Karşı Suçlar</option>
                      </optgroup>
                      <optgroup label="Müebbet Cezalar">
                        <option value="life">Müebbet (30 yıl)</option>
                        <option value="lifeAggravated">Ağırlaştırılmış Müebbet (36 yıl)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Ceza Süresi
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          name="years"
                          value={formData.years}
                          onChange={handleInputChange}
                          placeholder="Yıl"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Yıl</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          name="months"
                          value={formData.months}
                          onChange={handleInputChange}
                          placeholder="Ay"
                          min="0"
                          max="11"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Ay</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          name="days"
                          value={formData.days}
                          onChange={handleInputChange}
                          placeholder="Gün"
                          min="0"
                          max="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Gün</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Müebbet cezaları için süre girmenize gerek yok.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suç Tarihi *
                    </label>
                    <input
                      type="date"
                      name="crimeDate"
                      value={formData.crimeDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      30 Mart 2020 öncesi suçlarda denetimli serbestlik süresi 3 yıldır.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İnfaz Başlangıç Tarihi *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mahsup Edilecek Günler (tutukluluk vb.)
                    </label>
                    <input
                      type="number"
                      name="mahsup"
                      value={formData.mahsup}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Tutukluluk süresini ve diğer mahsup edilebilir günleri girin.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disiplin Cezası (gün)
                    </label>
                    <input
                      type="number"
                      name="discipline"
                      value={formData.discipline}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Varsa disiplin cezası gün sayısını girin.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={calculateInfaz}
                      disabled={isCalculating || !formData.startDate || !formData.crimeDate}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCalculating ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Hesaplanıyor...
                        </span>
                      ) : (
                        'Hesapla'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Temizle
                    </button>
                  </div>
                </div>
              </div>

              {/* Sonuç Bölümü */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-green-600" />
                  Hesaplama Sonucu
                </h2>

                {!result ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                      Hesaplama yapmak için formu doldurun ve "Hesapla" butonuna tıklayın.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Hesaplama Detayları</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Suç Türü:</span>
                          <span className="font-medium text-gray-900">{result.crimeTypeText}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Koşullu salıverilme oranı:</span>
                          <span className="font-medium text-gray-900">%{result.fraction}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Denetimli serbestlik süresi:</span>
                          <span className="font-medium text-gray-900">{result.denetimliYears} yıl</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Mahsup edilen günler:</span>
                          <span className="font-medium text-green-600">{result.mahsupDays} gün</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">Tahmini Tarihler</h3>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Hakederek Tahliye Tarihi:</span>
                            <span className="font-bold text-red-900 text-lg">{result.tahliyeDate}</span>
                          </div>
                          <span className="text-sm text-gray-500">({result.fullTerm} gün - Ceza süresinin tamamı)</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Koşullu Salıverilme Tarihi:</span>
                            <span className="font-bold text-blue-900 text-lg">{result.kosulluDate}</span>
                          </div>
                          <span className="text-sm text-gray-500">({result.kosullu} gün - %{result.fraction} oranında)</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Denetimli Serbestlik Tarihi:</span>
                            <span className="font-bold text-green-900 text-lg">{result.dsDate}</span>
                          </div>
                          <span className="text-sm text-gray-500">({result.denetimliS} gün - Fiilen cezaevinde)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800 mb-1">Önemli Uyarı</h4>
                          <p className="text-sm text-amber-700">
                            Bu hesaplama genel esaslara göre yapılmıştır. Suç türüne, mükerrirlik, 
                            disiplin cezası, infaz hakimliği kararları gibi faktörlere göre değişebilir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sıkça Sorulan Sorular</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Koşullu salıverme nedir?</h3>
                <p className="text-gray-700">
                  Koşullu salıverme, hükümlünün cezasının belirli bir kısmını çektikten sonra, 
                  iyi halini göstermesi halinde geri kalan cezasını cezaevi dışında geçirmesine 
                  imkan veren bir infaz kurumudur.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Denetimli serbestlik nedir?</h3>
                <p className="text-gray-700">
                  Denetimli serbestlik, hükümlünün toplumsal yaşama uyumunu sağlamak amacıyla, 
                  cezasının son kısmını belirli denetim ve yükümlülükler altında geçirmesini sağlar.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mahsup nedir?</h3>
                <p className="text-gray-700">
                  Mahsup, tutukluluk süresi, gözaltı süresi gibi özgürlüğü kısıtlayan tedbirlerin 
                  ceza süresinden düşülmesi işlemidir. Bu süreler infaz süresini kısaltır.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">30 Mart 2020 tarihi neden önemli?</h3>
                <p className="text-gray-700">
                  Bu tarihte yapılan yasal düzenleme ile denetimli serbestlik süreleri değişmiştir. 
                  Bu tarih öncesi suçlarda 3 yıl, sonrasında ise 1 yıl denetimli serbestlik uygulanır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Hukuki Destek İhtiyacınız mı Var?</h2>
            <p className="text-xl mb-8 leading-relaxed">
              Ceza hukuku konularında uzman avukatlarımızdan professional destek alın. 
              Ücretsiz ön görüşme için hemen iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/iletisim"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Ücretsiz Görüşme
              </Link>
              <Link 
                to="/hesaplama-araclari"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Diğer Hesaplama Araçları
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Bu hesaplama aracı CGTİK m.107 ve m.105/A hükümlerine göre hazırlanmıştır. 
            Güncel mevzuat değişiklikleri için avukatınıza danışın.
          </p>
        </div>
      </section>
    </>
  )
}

export default InfazYatarPage