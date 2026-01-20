import { useState, useEffect, useRef } from 'react'
import { 
  Briefcase, 
  Building, 
  Heart, 
  Shield, 
  Home, 
  Scale,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const Services = () => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [activeService, setActiveService] = useState(null)
  const sectionRef = useRef(null)

  const services = [
    {
      id: 1,
      title: 'İş Hukuku',
      description: 'İşçi-işveren ilişkileri, iş sözleşmeleri, tazminat davaları ve işe iade davaları',
      icon: Briefcase,
      features: [
        'İş sözleşmesi hazırlama ve inceleme',
        'İşe iade davaları',
        'Kıdem ve ihbar tazminatı',
        'İş kazası ve meslek hastalığı',
        'Fazla mesai alacağı',
        'Mobbing davaları'
      ],
      bgColor: 'bg-lawPrimary'
    },
    {
      id: 2,
      title: 'Ticaret Hukuku',
      description: 'Şirket kurulumu, ticari sözleşmeler, ticari uyuşmazlıklar ve ticaret hukuku danışmanlığı',
      icon: Building,
      features: [
        'Şirket kuruluş işlemleri',
        'Ticari sözleşme hazırlama',
        'Ortaklık uyuşmazlıkları',
        'Ticari alacak takibi',
        'Rekabet hukuku',
        'Marka ve patent işlemleri'
      ],
      bgColor: 'bg-lawSecondary'
    },
    {
      id: 3,
      title: 'Aile Hukuku',
      description: 'Boşanma, velayet, nafaka, miras hukuku ve aile içi uyuşmazlıklar',
      icon: Heart,
      features: [
        'Boşanma davaları',
        'Velayet ve kişisel ilişki',
        'Nafaka davaları',
        'Mal paylaşımı',
        'Evlilik sözleşmesi',
        'Nişan ve süt hakkı'
      ],
      bgColor: 'bg-lawGreen'
    },
    {
      id: 4,
      title: 'Ceza Hukuku',
      description: 'Ceza davaları, müdafilik hizmetleri ve ceza hukuku danışmanlığı',
      icon: Shield,
      features: [
        'Ceza davalarında müdafilik',
        'Soruşturma aşaması danışmanlık',
        'İddianame hazırlama',
        'Temyiz başvuruları',
        'Uzlaştırma süreçleri',
        'Adli kontrol işlemleri'
      ],
      bgColor: 'bg-lawGray'
    },
    {
      id: 5,
      title: 'Gayrimenkul Hukuku',
      description: 'Tapu işlemleri, kira sözleşmeleri, gayrimenkul uyuşmazlıkları ve emlak hukuku',
      icon: Home,
      features: [
        'Tapu devir işlemleri',
        'Kira sözleşmeleri',
        'Gayrimenkul satış sözleşmeleri',
        'Kat mülkiyeti uyuşmazlıkları',
        'İmar hukuku',
        'Kamulaştırma işlemleri'
      ],
      bgColor: 'bg-lawDark'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleItems(prev => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.3 }
    )

    const serviceCards = sectionRef.current?.querySelectorAll('[data-index]')
    serviceCards?.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-light text-lawDark mb-6 font-serif">
            Uygulama Alanlarımız
          </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Geniş bir yelpazede profesyonel hukuki hizmet sunuyoruz. 
            Her alanda uzmanlaşmış deneyimli kadromuzla yanınızdayız.
          </p>
        </div>

        {/* Practice Boxes - Bick Law Style */}
        <div className="flex flex-wrap -mx-0 mb-16">
          {services.map((service, index) => (
            <a
              key={service.id}
              href="#"
              className={`block w-full md:w-1/2 lg:w-1/5 ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } transition-all duration-700`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onClick={(e) => {
                e.preventDefault()
                setActiveService(activeService === service.id ? null : service.id)
              }}
            >
              <div className={`${service.bgColor} h-48 flex items-center justify-center transition-opacity duration-300 hover:opacity-70`}>
                <div className="text-center px-6">
                  <service.icon className="w-8 h-8 text-white mx-auto mb-4" />
                  <h3 className="text-white font-serif text-xl md:text-2xl font-normal text-center">
                    {service.title}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Service Details Accordion */}
        {activeService && (
          <div className="bg-gray-50 rounded-lg p-8 mb-16 transition-all duration-500">
            {services
              .filter(service => service.id === activeService)
              .map(service => (
                <div key={service.id}>
                  <div className="flex items-center mb-6">
                    <service.icon className="w-8 h-8 text-lawPrimary mr-4" />
                    <h3 className="text-3xl font-serif text-lawDark">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-8 font-sans leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-serif text-xl text-lawDark mb-4">
                        Sunduğumuz Hizmetler:
                      </h4>
                      <ul className="space-y-3">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-lawSecondary mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-sans">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-lawDark mb-4">
                        Ek Hizmetler:
                      </h4>
                      <ul className="space-y-3">
                        {service.features.slice(3).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-lawSecondary mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-sans">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Call to Action - Bick Law Style */}
        <div className="bg-lawPrimary text-white py-16 px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-serif mb-4 uppercase font-normal">
            Hukuki Danışmanlığa İhtiyacınız mı Var?
          </h3>
          <p className="text-xl mb-8 font-sans max-w-2xl mx-auto">
            Uzman avukat kadromuzla görüşmek için hemen iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact')
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-lawSecondary text-white px-8 py-4 font-sans font-medium uppercase tracking-wide hover:bg-lawPrimary hover:text-white transition-all duration-300"
            >
              İletişime Geç
            </button>
            <a 
              href={`tel:${import.meta.env.VITE_PHONE || '+90 530 711 18 64'}`}
              className="border-2 border-white text-white px-8 py-4 font-sans font-medium uppercase tracking-wide hover:bg-white hover:text-lawPrimary transition-all duration-300"
            >
              Hemen Ara
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services