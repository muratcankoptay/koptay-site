import { Helmet } from 'react-helmet-async'
import { SITE_URL, DEFAULT_OG_IMAGE, OG_SIZE, toAbsoluteUrl } from '../config/site'

/**
 * SEO bileşeni — TBB Reklam Yasağı Yönetmeliği Madde 7/e ile uyumlu,
 * teknik meta ve sosyal paylaşım etiketleri.
 */
const SEO = ({
  title = 'Koptay Hukuk Bürosu — Ankara',
  description = 'Av. Murat Can Koptay - Koptay Hukuk Bürosu. Çankaya/Ankara.',
  image = DEFAULT_OG_IMAGE,
  url = SITE_URL,
  type = 'website',
  author = null,
  publishedTime = null,
  modifiedTime = null,
  preloadImage = false,
  preloadImageSrcSet = null,
  preloadImageSizes = null,
  imageAlt = null
}) => {
  const canonicalUrl = url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
  const absoluteImage = toAbsoluteUrl(image)
  const ogAlt = imageAlt || title

  let structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    name: title,
    description,
    url: canonicalUrl
  }

  if (type === 'article') {
    structuredData = {
      ...structuredData,
      '@type': 'Article',
      headline: title,
      author: {
        '@type': 'Person',
        name: author || 'Av. Murat Can Koptay'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Koptay Hukuk Bürosu'
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      image: absoluteImage
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:site_name" content="Koptay Hukuk Bürosu" />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:width" content={String(OG_SIZE.width)} />
      <meta property="og:image:height" content={String(OG_SIZE.height)} />
      <meta property="og:image:alt" content={ogAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={ogAlt} />

      <meta name="robots" content="index, follow" />
      <meta name="language" content="Turkish" />

      {type === 'article' && publishedTime && (
        <meta name="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta name="article:modified_time" content={modifiedTime} />
      )}

      <link rel="canonical" href={canonicalUrl} />

      {preloadImage && image && !preloadImageSrcSet && (
        <link rel="preload" as="image" href={absoluteImage} fetchPriority="high" />
      )}
      {preloadImage && preloadImageSrcSet && (
        <link
          rel="preload"
          as="image"
          href={absoluteImage}
          imageSrcSet={preloadImageSrcSet}
          imageSizes={preloadImageSizes || '100vw'}
          fetchPriority="high"
        />
      )}

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  )
}

export default SEO
