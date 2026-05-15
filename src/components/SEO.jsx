import { Helmet } from 'react-helmet-async'

/**
 * SEO bileşeni — TBB Reklam Yasağı Yönetmeliği Madde 7/e gereği
 * arama motoru optimizasyonu odaklı keyword/sıfat kullanımı bilinçli olarak çıkarıldı.
 * Sadece teknik olarak gerekli minimum meta verileri yer alır.
 */
const SEO = ({
  title = 'Koptay Hukuk Bürosu — Ankara',
  description = 'Av. Murat Can Koptay - Koptay Hukuk Bürosu. Çankaya/Ankara.',
  image = '/logo.svg',
  url = 'https://koptay.av.tr',
  type = 'website',
  author = null,
  publishedTime = null,
  modifiedTime = null,
  preloadImage = false,
  // Responsive preload (LCP için): srcset + sizes verilirse tarayıcı doğru varyantı çeker
  preloadImageSrcSet = null,
  preloadImageSizes = null
}) => {
  // Minimal structured data (sadece kuruluş tanımı)
  let structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'Organization',
    "name": "Koptay Hukuk Bürosu",
    "url": url
  }

  if (type === 'article') {
    structuredData = {
      ...structuredData,
      "headline": title,
      "author": {
        "@type": "Person",
        "name": author || "Av. Murat Can Koptay"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Koptay Hukuk Bürosu"
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph (sosyal paylaşımda title/desc gösterimi için minimal) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="tr_TR" />

      {/* Indexleme — robots.txt ve site yapısı zaten kontrol ediyor */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Turkish" />

      {/* Article zaman damgaları (yayıncılık standardı) */}
      {type === 'article' && publishedTime && <meta name="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta name="article:modified_time" content={modifiedTime} />}

      <link rel="canonical" href={url} />

      {preloadImage && image && !preloadImageSrcSet && (
        <link rel="preload" as="image" href={image} fetchpriority="high" />
      )}
      {preloadImage && preloadImageSrcSet && (
        <link
          rel="preload"
          as="image"
          href={image}
          imageSrcSet={preloadImageSrcSet}
          imageSizes={preloadImageSizes || '100vw'}
          fetchpriority="high"
        />
      )}

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default SEO
