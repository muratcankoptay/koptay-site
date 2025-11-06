import { Helmet } from 'react-helmet-async'

const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Av. Murat Can Koptay - Koptay Hukuk Bürosu",
    "image": "https://koptay.av.tr/logo.png",
    "description": "Ankara merkezli hukuk bürosu. İş Hukuku, Ceza Hukuku, Aile Hukuku ve daha fazlası için profesyonel avukatlık hizmetleri.",
    "@id": "https://koptay.av.tr",
    "url": "https://koptay.av.tr",
    "telephone": "+905307111864",
    "email": "info@koptay.av.tr",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Adresiniz Buraya",
      "addressLocality": "Ankara",
      "addressRegion": "Ankara",
      "postalCode": "06xxx",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 39.9334,
      "longitude": 32.8597
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "10"
    },
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://www.linkedin.com/in/yourprofile",
      "https://www.instagram.com/yourpage"
    ]
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

export default LocalBusinessSchema
