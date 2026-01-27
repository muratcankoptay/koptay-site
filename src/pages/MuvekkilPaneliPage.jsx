import { useEffect } from 'react'
import SEO from '../components/SEO'
import { ExternalLink, Shield, FileText, Bell, CreditCard, Lock } from 'lucide-react'

const MuvekkilPaneliPage = () => {
  // Harici panel URL'i
  const PANEL_URL = 'https://muvekkil-paneli.vercel.app/login'

  // Otomatik yönlendirme (isteğe bağlı - 5 saniye sonra)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(PANEL_URL, '_blank')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handlePanelAccess = () => {
    window.open(PANEL_URL, '_blank')
  }

  const features = [
    {
      icon: FileText,
      title: 'Dosya Takibi',
      description: 'Davalarınızın güncel durumunu anlık olarak takip edin'
    },
    {
      icon: Bell,
      title: 'Bildirimler',
      description: 'Önemli gelişmelerden anında haberdar olun'
    },
    {
      icon: CreditCard,
      title: 'Ödeme Yönetimi',
      description: 'Ödeme planlarınızı görüntüleyin ve yönetin'
    },
    {
      icon: Lock,
      title: 'Güvenli Erişim',
      description: 'Verileriniz şifreli ve güvenli ortamda saklanır'
    }
  ]

  return (
    <>
      <SEO 
        title="Müvekkil Paneli - Koptay Hukuk Bürosu"
        description="Müvekkillerimizin dava takibi, belge paylaşımı ve hukuki süreçlerin yönetimi için güvenli müvekkil paneli."
        keywords="müvekkil paneli, dava takibi, hukuki süreç yönetimi, belge paylaşımı, avukat müvekkil iletişimi"
        url="/muvekkil-paneli"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lawPrimary to-lawSecondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-20 h-20 text-white opacity-90" />
          </div>
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">
            Müvekkil Paneli
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
            Davalarınızı takip edin, belgelerinizi görüntüleyin ve hukuki süreçlerinizi yönetin
          </p>
          
          {/* Ana Giriş Butonu */}
          <div className="flex flex-col items-center gap-4 mt-10">
            <button
              onClick={handlePanelAccess}
              className="group bg-white text-lawPrimary px-10 py-4 rounded-lg font-semibold text-lg hover:bg-lawSecondary hover:text-white transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-3"
            >
              <Shield className="w-6 h-6" />
              Müvekkil Paneline Git
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-white/80 text-sm">
              🔒 Güvenli bağlantı ile yeni sekmede açılacaktır
            </p>
            
            <p className="text-white/60 text-xs mt-2">
              (5 saniye sonra otomatik olarak yönlendirileceksiniz)
            </p>
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 font-serif text-lawPrimary">
            Müvekkil Paneli Özellikleri
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-lawPrimary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-lawPrimary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-lawPrimary">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bilgilendirme Bölümü */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-900 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Giriş Bilgileriniz
            </h3>
            <p className="text-blue-800 mb-4">
              Müvekkil paneline ilk kez giriş yapacaksanız, giriş bilgileriniz büromuz tarafından tarafınıza iletilmiştir.
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Müvekkil kimlik numaranız ve şifreniz ile giriş yapabilirsiniz</li>
              <li>Şifrenizi unuttuysanız, "Şifremi Unuttum" bağlantısını kullanabilirsiniz</li>
              <li>Giriş sorunu yaşıyorsanız, lütfen büromuz ile iletişime geçin</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handlePanelAccess}
              className="bg-lawPrimary text-white px-8 py-3 rounded-lg font-semibold hover:bg-lawSecondary transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Panele Git
            </button>
          </div>
        </div>
      </section>

      {/* İletişim Bilgileri */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-lawPrimary">
            Destek mi Gerekiyor?
          </h3>
          <p className="text-gray-700 mb-6">
            Müvekkil paneline erişimde sorun yaşıyorsanız, bizimle iletişime geçin
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a 
              href="tel:+903122221111" 
              className="bg-white text-lawPrimary px-6 py-3 rounded-lg font-semibold hover:bg-lawPrimary hover:text-white transition-all duration-300 shadow-md"
            >
              📞 0 (312) 222 11 11
            </a>
            <a 
              href="mailto:info@koptay.av.tr" 
              className="bg-white text-lawPrimary px-6 py-3 rounded-lg font-semibold hover:bg-lawPrimary hover:text-white transition-all duration-300 shadow-md"
            >
              ✉️ info@koptay.av.tr
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default MuvekkilPaneliPage