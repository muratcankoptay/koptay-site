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
            <div className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Main Tagline - Bick Law Style */}
              <div className="text-left mb-12">
                <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-light text-white uppercase leading-none mb-4">
                  <span className="block">AVUKATLIK <span className="text-lawSecondary italic">&</span></span>
                  <span className="block">HUKUK HİZMETLERİ</span>
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={scrollToContact}
                  className="bg-lawSecondary px-8 py-4 font-sans font-medium text-white uppercase tracking-wide hover:bg-lawPrimary transition-all duration-300 transform hover:scale-105"
                >
                  İletişime Geç
                </button>
                <button 
                  onClick={scrollToServices}
                  className="border-2 border-white px-8 py-4 font-sans font-medium text-white uppercase tracking-wide hover:bg-white hover:text-lawPrimary transition-all duration-300"
                >
                  Hizmetlerimizi İncele
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