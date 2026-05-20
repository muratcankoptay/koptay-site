import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  Briefcase,
  Building,
  Heart,
  Shield,
  Home,
  CheckCircle,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import SEO from '../components/SEO'
import { getServiceBySlug, PRACTICE_AREAS } from '../data/services'
import { SITE_URL } from '../config/site'

const ICONS = { Briefcase, Building, Heart, Shield, Home }

const ServiceDetailPage = () => {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!service) {
    return <Navigate to="/hizmetlerimiz" replace />
  }

  const Icon = ICONS[service.icon] || Briefcase
  const pageUrl = `${SITE_URL}/hizmetler/${service.slug}`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Çalışma Alanları', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: service.title, item: pageUrl }
    ]
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.seoDescription,
    provider: { '@id': `${SITE_URL}/#legal-service` },
    areaServed: { '@type': 'City', name: 'Ankara' },
    url: pageUrl
  }

  return (
    <>
      <SEO
        title={service.seoTitle}
        description={service.seoDescription}
        image={service.ogImage}
        url={`/hizmetler/${service.slug}`}
        imageAlt={`${service.title} — Koptay Hukuk Bürosu`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <section className="page-hero">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-lawSecondary">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link to="/hizmetlerimiz" className="hover:text-lawSecondary">Çalışma Alanları</Link>
            <span className="mx-2">/</span>
            <span className="text-lawDark">{service.title}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-md bg-lawSecondary/10 text-lawSecondary flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="page-hero-eyebrow">Koptay Hukuk Bürosu</p>
              <h1 className="page-hero-title">{service.title}</h1>
              <p className="page-hero-subtitle">{service.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-gray-700 leading-relaxed mb-10">{service.description}</p>

          <h2 className="text-2xl font-serif text-lawDark mb-6">Sunduğumuz Hizmetler</h2>
          <ul className="grid md:grid-cols-2 gap-4 mb-14">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-lawSecondary mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-serif text-lawDark mb-6">Süreç Nasıl İşler?</h2>
          <ol className="space-y-6 mb-14">
            {service.process.map((step) => (
              <li key={step.step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lawSecondary text-white font-semibold text-sm">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-semibold text-lawDark mb-1">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {service.relatedCalculators.length > 0 && (
            <>
              <h2 className="text-2xl font-serif text-lawDark mb-4">İlgili Hesaplama Araçları</h2>
              <ul className="flex flex-wrap gap-3 mb-14">
                {service.relatedCalculators.map((calc) => (
                  <li key={calc.href}>
                    <Link
                      to={calc.href}
                      className="inline-flex items-center px-4 py-2 rounded-md border border-lawSecondary/30 text-lawPrimary hover:bg-lawSecondary/10 text-sm font-medium transition-colors"
                    >
                      {calc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="text-2xl font-serif text-lawDark mb-6">Sık Sorulan Sorular</h2>
          <div className="space-y-3 mb-14">
            {service.faq.map((item, index) => (
              <details
                key={item.question}
                className="group border border-gray-200 rounded-md bg-lawLight/50"
                {...(index === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-lawDark">
                  {item.question}
                  <ChevronDown className="w-5 h-5 shrink-0 text-lawSecondary transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-4 text-gray-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="rounded-md border border-gray-200 bg-lawLight p-8 text-center">
            <p className="text-gray-700 mb-6">
              {service.title} konusunda ön görüşme için iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-lawPrimary text-white px-6 py-3 rounded-md font-medium hover:bg-lawSecondary transition-colors"
              >
                <Mail className="w-4 h-4" />
                İletişim Formu
              </Link>
              <a
                href="tel:+905307111864"
                className="inline-flex items-center gap-2 border border-lawPrimary text-lawPrimary px-6 py-3 rounded-md font-medium hover:bg-lawPrimary hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                0530 711 18 64
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-xl font-serif text-lawDark mb-6 text-center">Diğer Çalışma Alanları</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICE_AREAS.filter((s) => s.slug !== service.slug).map((other) => {
              const OtherIcon = ICONS[other.icon] || Briefcase
              return (
                <Link
                  key={other.slug}
                  to={`/hizmetler/${other.slug}`}
                  className="block p-5 bg-white border border-gray-200 rounded-md hover:border-lawSecondary hover:shadow-sm transition-all"
                >
                  <OtherIcon className="w-5 h-5 text-lawSecondary mb-2" aria-hidden="true" />
                  <span className="font-medium text-lawDark">{other.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServiceDetailPage
