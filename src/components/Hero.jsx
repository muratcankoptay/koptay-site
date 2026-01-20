import { useState, useEffect } from 'react'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(141, 27, 84, 0.2), rgba(53, 52, 65, 0.7)), 
                           url('/images/hero-bg-1.jpg'), 
                           url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23353441" width="1200" height="800"/><polygon fill="%23548c8d" points="0,800 400,600 800,700 1200,500 1200,800"/><polygon fill="%238d1b54" points="0,800 300,650 600,750 900,550 1200,600 1200,800"/></svg>')`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Main Tagline - Bick Law Style */}
              <div className="text-left mb-8">
                <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-light text-white uppercase leading-none mb-4">
                  <span className="block">AVUKATLIK <span className="text-lawSecondary italic">&</span></span>
                  <span className="block">HUKUK HİZMETLERİ</span>
                </h1>
              </div>

              {/* Phone & Hours Info */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <a 
                  href="tel:+905307111864" 
                  className="flex items-center gap-3 text-white hover:text-lawSecondary transition-colors group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-lawSecondary transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-medium">0530 711 18 64</p>
                    <p className="text-sm text-white/70">Hemen Arayın</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">Hafta içi 09:00 - 18:00</p>
                    <p className="text-xs text-white/60">Cumartesi randevu ile</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={scrollToContact}
                  className="group relative bg-lawSecondary px-8 py-4 font-sans font-medium text-white uppercase tracking-wide overflow-hidden transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {/* Shine effect on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    İletişime Geç
                  </span>
                </button>
                <button 
                  onClick={scrollToServices}
                  className="group relative border-2 border-white px-8 py-4 font-sans font-medium text-white uppercase tracking-wide overflow-hidden transition-all duration-300"
                >
                  {/* Background fill on hover */}
                  <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="relative flex items-center justify-center gap-2 group-hover:text-lawPrimary transition-colors duration-300">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Hizmetlerimizi İncele
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Bick Law Style */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className={`text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="bg-white text-lawGray p-8 h-40 flex flex-col justify-center transition-all duration-300 hover:opacity-90 shadow-lg">
                <p className="text-2xl md:text-3xl font-light mb-2">Güvenilir</p>
                <p className="font-serif text-sm uppercase tracking-wide">Avukatlık Hizmeti</p>
              </div>
            </div>
            <div className={`text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="bg-white text-lawGray p-8 h-40 flex flex-col justify-center transition-all duration-300 hover:opacity-90 shadow-lg">
                <p className="text-2xl md:text-3xl font-light mb-2">Deneyimli</p>
                <p className="font-serif text-sm uppercase tracking-wide">Hukuk Ekibi</p>
              </div>
            </div>
            <div className={`text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`} style={{ transitionDelay: '1000ms' }}>
              <div className="bg-white text-lawGray p-8 h-40 flex flex-col justify-center transition-all duration-300 hover:opacity-90 shadow-lg">
                <p className="text-2xl md:text-3xl font-light mb-2">Etik</p>
                <p className="font-serif text-sm uppercase tracking-wide">Hukuk Hizmeti</p>
              </div>
            </div>
            <div className={`text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`} style={{ transitionDelay: '1200ms' }}>
              <div className="bg-white text-lawGray p-8 h-40 flex flex-col justify-center transition-all duration-300 hover:opacity-90 shadow-lg">
                <p className="text-2xl md:text-3xl font-light mb-2">Ulaşılabilir</p>
                <p className="font-serif text-sm uppercase tracking-wide">Avukatlık Hizmeti</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero