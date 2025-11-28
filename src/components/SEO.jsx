import { Helmet } from 'react-helmet-async'

const SEO = ({ 
  title = 'Koptay Hukuk Bürosu - Ücretsiz Ön Görüşme',
  description = 'Koptay Hukuk Bürosu olarak 15+ yıllık deneyimimizle İş Hukuku, Ticaret Hukuku, Aile Hukuku ve daha birçok alanda profesyonel avukatlık hizmeti sunuyoruz.',
  keywords = 'avukat, hukuk bürosu, iş hukuku, ticaret hukuku, aile hukuku, ceza hukuku, gayrimenkul hukuku, ücretsiz ön görüşme, ankara avukat',
  image = '/images/hero.jpg',
  url = 'https://koptay.av.tr',
  type = 'website',
  author = null,
  publishedTime = null,
  modifiedTime = null,
  preloadImage = false
}) => {
  // Create structured data based on type
  let structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'LegalService',
    "name": type === 'article' ? title : "Koptay Hukuk Bürosu",
    "headline": type === 'article' ? title : undefined,
    "description": description,
    "url": url,
    "image": image
  }

  if (type === 'article') {
    structuredData = {
      ...structuredData,
      "author": {
        "@type": "Person",
        "name": author || "Av. Koptay"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Koptay Hukuk Bürosu",
        "logo": {
          "@type": "ImageObject",
          "url": "https://koptay.av.tr/logo.svg"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    }
  } else {
    structuredData = {
      ...structuredData,
      "telephone": "+90 530 711 18 64",
      "email": "info@koptay.av.tr",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ankara",
        "addressCountry": "TR"
      },
      "areaServed": "Ankara",
      "serviceType": [
        "İş Hukuku",
        "Ticaret Hukuku", 
        "Aile Hukuku",
        "Ceza Hukuku",
        "Gayrimenkul Hukuku",
        "İcra ve İflas Hukuku"
      ],
      "priceRange": "$$",
      "openingHours": "Mo-Fr 09:00-18:00"
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Koptay Hukuk Bürosu" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={author || "Av. Koptay"} />
      <meta name="language" content="Turkish" />
      <meta name="geo.region" content="TR-06" />
      <meta name="geo.placename" content="Ankara" />
      
      {/* Article specific meta tags */}
      {type === 'article' && author && <meta name="article:author" content={author} />}
      {type === 'article' && publishedTime && <meta name="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta name="article:modified_time" content={modifiedTime} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preload critical image for LCP optimization */}
      {preloadImage && image && (
        <link 
          rel="preload" 
          as="image" 
          href={image}
          fetchpriority="high"
        />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default SEO