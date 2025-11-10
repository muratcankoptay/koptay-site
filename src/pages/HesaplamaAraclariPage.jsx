import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Car, HeartHandshake, Building, Users, ArrowRight, Scale } from 'lucide-react'
import SEO from '../components/SEO'

const HesaplamaAraclariPage = () => {
  const [activeCalculator, setActiveCalculator] = useState('infaz')

  // İnfaz Yatar Hesaplama
  const [infazData, setInfazData] = useState({
    anaParaTutari: '',
    faizOrani: '',
    baslamaTarihi: '',
    bitisTarihi: ''
  })

  // Tazminat Hesaplama
  const [tazminatData, setTazminatData] = useState({
    netMaas: '',
    calismaYili: '',
    yas: '',
    maddiHasar: ''
  })

  // Değer Kaybı Hesaplama
  const [degerKaybiData, setDegerKaybiData] = useState({
    aracDegeri: '',
    hasarTutari: '',
    aracYasi: '',
    aracTipi: 'otomobil'
  })

  const calculators = [
    {
      id: 'infaz',
      title: 'İnfaz Süresi Hesaplama',
      description: 'Ceza infazı süresi, koşullu salıverme ve denetimli serbestlik hesaplama',
      icon: Calculator,
      color: 'bg-blue-100 text-blue-600',
      link: '/hesaplama-araclari/infaz-yatar'
    },
    {
      id: 'vekalet-ucreti',
      title: 'Vekalet Ücreti Hesaplama',
      description: '2026 AAÜT\'ye göre güncel vekalet ücreti hesaplama (maktu ve nispi)',
      icon: Scale,
      color: 'bg-indigo-100 text-indigo-600',
      link: '/hesaplama-araclari/vekalet-ucreti'
    },
    {
      id: 'tazminat',
      title: 'Tazminat Hesaplama',
      description: 'İş kazası ve meslek hastalığı tazminat hesaplama',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      link: '/hesaplama-araclari/tazminat-hesaplama'
    },
    {
      id: 'deger-kaybi',
      title: 'Değer Kaybı Hesaplama',
      description: 'Araç kazalarında değer kaybı tazminat hesaplama',
      icon: Car,
      color: 'bg-red-100 text-red-600',
      link: '/hesaplama-araclari/deger-kaybi'
    },
    {
      id: 'bedeni-hasar',
      title: 'Bedeni Hasar Hesaplama',
      description: 'Trafik kazalarında bedeni hasar tazminat hesaplama',
      icon: HeartHandshake,
      color: 'bg-purple-100 text-purple-600',
      link: '/hesaplama-araclari/bedeni-hasar'
    }
  ]

  const handleInfazCalculate = () => {
    // İnfaz hesaplama mantığı burada olacak
    alert('İnfaz hesaplama fonksiyonu yakında aktif olacak!')
  }

  const handleTazminatCalculate = () => {
    // Tazminat hesaplama mantığı burada olacak
    alert('Tazminat hesaplama fonksiyonu yakında aktif olacak!')
  }

  const handleDegerKaybiCalculate = () => {
    // Değer kaybı hesaplama mantığı burada olacak
    alert('Değer kaybı hesaplama fonksiyonu yakında aktif olacak!')
  }

  const renderCalculatorForm = () => {
    switch(activeCalculator) {
      case 'infaz':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-lawDark mb-4">İnfaz Süresi Hesaplama - Önizleme</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm font-medium">
                ℹ️ Bu sadece bir önizlemedir. Detaylı hesaplama için "Hesaplama Aracına Git" butonunu kullanın.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suç Türü
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100" disabled>
                  <option>Kasten Yaralama</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam Ceza Süresi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Yıl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                  <input
                    type="number"
                    placeholder="Ay"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                  <input
                    type="number"
                    placeholder="Gün"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suç Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İnfaz Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  disabled
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/hesaplama-araclari/infaz-yatar"
                className="w-full bg-lawPrimary text-white py-4 px-6 rounded-lg font-semibold hover:bg-lawSecondary transition-colors inline-block text-center"
              >
                Detaylı Hesaplama Aracına Git →
              </Link>
            </div>
          </div>
        )
        
      case 'tazminat':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-lawDark mb-4">Tazminat Hesaplama</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net Maaş (TL)
                </label>
                <input
                  type="number"
                  value={tazminatData.netMaas}
                  onChange={(e) => setTazminatData({...tazminatData, netMaas: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 15000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışma Yılı
                </label>
                <input
                  type="number"
                  value={tazminatData.calismaYili}
                  onChange={(e) => setTazminatData({...tazminatData, calismaYili: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yaş
                </label>
                <input
                  type="number"
                  value={tazminatData.yas}
                  onChange={(e) => setTazminatData({...tazminatData, yas: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 35"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maddi Hasar (TL)
                </label>
                <input
                  type="number"
                  value={tazminatData.maddiHasar}
                  onChange={(e) => setTazminatData({...tazminatData, maddiHasar: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 25000"
                />
              </div>
            </div>
            
            <button
              onClick={handleTazminatCalculate}
              className="w-full bg-lawPrimary text-white py-4 px-6 rounded-lg font-semibold hover:bg-lawSecondary transition-colors"
            >
              Hesapla
            </button>
          </div>
        )
        
      case 'deger-kaybi':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-lawDark mb-4">Değer Kaybı Hesaplama</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Değeri (TL)
                </label>
                <input
                  type="number"
                  value={degerKaybiData.aracDegeri}
                  onChange={(e) => setDegerKaybiData({...degerKaybiData, aracDegeri: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 300000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasar Tutarı (TL)
                </label>
                <input
                  type="number"
                  value={degerKaybiData.hasarTutari}
                  onChange={(e) => setDegerKaybiData({...degerKaybiData, hasarTutari: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 50000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Yaşı
                </label>
                <input
                  type="number"
                  value={degerKaybiData.aracYasi}
                  onChange={(e) => setDegerKaybiData({...degerKaybiData, aracYasi: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                  placeholder="Örn: 3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Tipi
                </label>
                <select
                  value={degerKaybiData.aracTipi}
                  onChange={(e) => setDegerKaybiData({...degerKaybiData, aracTipi: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                >
                  <option value="otomobil">Otomobil</option>
                  <option value="ticari">Ticari Araç</option>
                  <option value="motosiklet">Motosiklet</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleDegerKaybiCalculate}
              className="w-full bg-lawPrimary text-white py-4 px-6 rounded-lg font-semibold hover:bg-lawSecondary transition-colors"
            >
              Hesapla
            </button>
          </div>
        )
        
      case 'bedeni-hasar':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-lawDark mb-4">Bedeni Hasar Hesaplama</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Not:</strong> Bedeni hasar hesaplamaları karmaşık olup, her vaka özeldir. 
                Bu hesaplama sadece tahmini bir değer verir. Kesin hesaplama için hukuki danışmanlık alınız.
              </p>
            </div>
            
            <div className="text-center py-12">
              <HeartHandshake className="w-16 h-16 text-lawPrimary mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-lawDark mb-2">Yakında Aktif Olacak</h4>
              <p className="text-gray-600 mb-6">
                Bedeni hasar hesaplama aracımız üzerinde çalışmaktayız. 
                Detaylı bilgi için bizimle iletişime geçin.
              </p>
              <a 
                href="tel:+905307111864" 
                className="bg-lawPrimary text-white px-6 py-3 rounded-lg font-semibold hover:bg-lawSecondary transition-colors"
              >
                Hemen Ara
              </a>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <>
      <SEO 
        title="Hesaplama Araçları - Koptay Hukuk Bürosu"
        description="İnfaz yatar, tazminat, değer kaybı ve bedeni hasar hesaplama araçları. Ücretsiz hukuki hesaplama araçları ile haklarınızı öğrenin."
        keywords="infaz yatar hesaplama, tazminat hesaplama, değer kaybı hesaplama, bedeni hasar hesaplama, hukuki hesaplama araçları"
        url="/hesaplama-araclari"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lawPrimary to-lawSecondary text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Hesaplama Araçları
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Hukuki süreçlerinizde ihtiyaç duyabileceğiniz hesaplamaları kolayca yapın. 
            Ücretsiz hesaplama araçlarımızla haklarınızı öğrenin.
          </p>
        </div>
      </section>

      {/* Calculator Selection */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {calculators.map((calc) => {
              const Icon = calc.icon
              return (
                <Link
                  key={calc.id}
                  to={calc.link}
                  className="block p-6 rounded-xl bg-white border border-gray-200 hover:border-lawPrimary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-lg ${calc.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-lawDark mb-2">{calc.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{calc.description}</p>
                  <div className="flex items-center text-lawPrimary font-medium text-sm">
                    Hesapla
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {renderCalculatorForm()}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 border-l-4 border-lawPrimary">
            <h3 className="text-lg font-semibold text-lawDark mb-3">Önemli Uyarı</h3>
            <p className="text-gray-700 mb-3">
              Bu hesaplama araçları genel bilgilendirme amaçlıdır ve kesin sonuçlar vermeyebilir. 
              Her hukuki durum özeldir ve profesyonel değerlendirme gerektirir.
            </p>
            <p className="text-gray-700">
              Kesin hesaplamalar ve hukuki süreçler için mutlaka uzman avukat desteği alınız. 
              Ücretsiz ön görüşme için bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default HesaplamaAraclariPage