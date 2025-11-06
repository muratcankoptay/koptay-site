import { Helmet } from 'react-helmet-async'

const ArticleSchema = ({ article }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.publishDate,
    "dateModified": article.updatedDate || article.publishDate,
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": "https://koptay.av.tr/ekibimiz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Koptay Hukuk Bürosu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://koptay.av.tr/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://koptay.av.tr/makale/${article.slug}`
    }
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
