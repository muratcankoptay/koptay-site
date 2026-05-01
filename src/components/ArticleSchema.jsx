import { Helmet } from 'react-helmet-async'

const ArticleSchema = ({ article }) => {
  const imageUrl = (article.image && typeof article.image === 'object')
    ? article.image.url
    : article.image
  const absoluteImage = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : `https://koptay.av.tr${imageUrl}`)
    : 'https://koptay.av.tr/images/hero-bg-1.jpg'

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.seoTitle || article.title,
    "description": article.seoDescription || article.excerpt,
    "image": absoluteImage,
    "datePublished": article.publishedAt || article.publishDate,
    "dateModified": article.updatedAt || article.updatedDate || article.publishedAt || article.publishDate,
    "author": {
      "@type": "Person",
      "name": article.author || "Av. Murat Can Koptay",
      "url": "https://koptay.av.tr/ekibimiz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Koptay Hukuk Bürosu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://koptay.av.tr/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://koptay.av.tr/makale/${article.slug}`
    },
    "inLanguage": "tr-TR",
    "keywords": article.keywords || (article.tags ? article.tags.join(", ") : "")
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

export default ArticleSchema
