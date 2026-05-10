import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Building,
  Heart,
  Shield,
  Home,
  CheckCircle,
  ChevronDown,
  Phone,
  Mail
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
      ]
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
      ]
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
        'Miras davaları'
      ]
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
      ]
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
      ]
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
      { threshold: 0.2 }
    )

    const serviceCards = sectionRef.current?.querySelectorAll('[data-index]')
    serviceCards?.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-lawDark mb-4 font-serif">
            Çalışma Alanları
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Büromuzun çalışma alanları aşağıda yer almaktadır.
            Detaylı bilgi için kart üzerine tıklayabilirsiniz.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {services.map((service, index) => {
            const isActive = activeService === service.id
            return (
              <button
                key={service.id}
                type="button"
                data-index={index}
                onClick={() => setActiveService(isActive ? null : service.id)}
                aria-expanded={isActive}
                aria-controls={`service-detail-${service.id}`}
                className={`group text-left bg-white border rounded-md p-6 transition-all duration-300 ${
                  isActive
                    ? 'border-lawSecondary shadow-md'
                    : 'border-gray-200 hover:border-lawSecondary hover:shadow-md'
                } ${
                  visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-11 h-11 rounded-md flex items-center justify-center mb-4 transition-colors ${
                  isActive
                    ? 'bg-lawSecondary text-white'
                    : 'bg-lawSecondary/10 text-lawSecondary group-hover:bg-lawSecondary group-hover:text-white'
                }`}>
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-lawDark mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-lawSecondary gap-1">
                  {isActive ? 'Kapat' : 'Detay'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                </span>
              </button>
            )
          })}
        </div>

        {/* Service Details Panel */}
        {activeService && (
          <div
            id={`service-detail-${activeService}`}
            className="bg-lawLight border border-gray-200 rounded-md p-8 mb-12 animate-fade-in"
          >
            {services
              .filter(service => service.id === activeService)
              .map(service => (
                <div key={service.id}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-md bg-lawSecondary/10 text-lawSecondary flex items-center justify-center">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-lawDark">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-base text-gray-700 mb-8 leading-relaxed max-w-3xl">
                    {service.description}
                  </p>

                  <h4 className="text-xs font-semibold uppercase tracking-wider text-lawSecondary mb-4">
                    Sunduğumuz Hizmetler
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-lawSecondary mt-1 shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        {/* Slim CTA — Home iletişim şeridi ile uyumlu */}
        <div className="max-w-3xl mx-auto pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-sm text-gray-600 sm:mr-4">
            Çalışma alanlarınız hakkında ön görüşme:
          </p>
          <Link
            to="/iletisim"
            className="inline-flex items-center justify-center gap-2 bg-lawPrimary text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-lawSecondary transition-colors"
          >
            <Mail className="w-4 h-4" />
            İletişim Formu
          </Link>
          <a
            href={`tel:${import.meta.env.VITE_PHONE || '+90 530 711 18 64'}`}
            className="inline-flex items-center justify-center gap-2 border border-lawPrimary text-lawPrimary px-5 py-2.5 rounded-md font-medium text-sm hover:bg-lawPrimary hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            Hemen Ara
          </a>
        </div>
      </div>
    </section>
  )
}

export default Services