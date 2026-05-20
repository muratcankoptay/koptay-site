import { SITE, SITE_URL } from './site'

/**
 * TBB Reklam Yasağı Yönetmeliği Madde 7/e ile uyumlu minimal yapılandırılmış veri.
 * Yasak kapsamındaki unsurlar (priceRange, knowsAbout, sahte yorum, agresif keyword) yoktur.
 */
export function getLegalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${SITE_URL}/#legal-service`,
    name: SITE.name,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE_URL}/images/og/og-default.jpg`,
    logo: `${SITE_URL}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.9208,
      longitude: 32.8541
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    areaServed: {
      '@type': 'City',
      name: 'Ankara'
    },
    inLanguage: 'tr-TR'
  }
}
