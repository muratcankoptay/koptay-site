import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Building,
  Heart,
  Shield,
  Home,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react'
import { PRACTICE_AREAS } from '../data/services'

const ICONS = { Briefcase, Building, Heart, Shield, Home }

const Services = () => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10)
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.2 }
    )

    const serviceCards = sectionRef.current?.querySelectorAll('[data-index]')
    serviceCards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-lawDark mb-4 font-serif">
            Çalışma Alanları
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Her alan için süreç, sık sorulan sorular ve detaylı bilgi sayfalarına
            aşağıdaki kartlardan ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {PRACTICE_AREAS.map((service, index) => {
            const Icon = ICONS[service.icon] || Briefcase
            return (
              <Link
                key={service.slug}
                to={`/hizmetler/${service.slug}`}
                data-index={index}
                className={`group block text-left bg-white border border-gray-200 rounded-md p-6 transition-all duration-300 hover:border-lawSecondary hover:shadow-md ${
                  visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-11 h-11 rounded-md bg-lawSecondary/10 text-lawSecondary flex items-center justify-center mb-4 group-hover:bg-lawSecondary group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-lawDark mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.shortDescription}</p>
                <span className="inline-flex items-center text-sm font-medium text-lawSecondary gap-1">
                  Detaylı incele
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="max-w-3xl mx-auto pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-sm text-gray-600 sm:mr-4">Çalışma alanlarınız hakkında ön görüşme:</p>
          <Link
            to="/iletisim"
            className="inline-flex items-center justify-center gap-2 bg-lawPrimary text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-lawSecondary transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            İletişim Formu
          </Link>
          <a
            href="tel:+905307111864"
            className="inline-flex items-center justify-center gap-2 border border-lawPrimary text-lawPrimary px-5 py-2.5 rounded-md font-medium text-sm hover:bg-lawPrimary hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Hemen Ara
          </a>
        </div>
      </div>
    </section>
  )
}

export default Services
