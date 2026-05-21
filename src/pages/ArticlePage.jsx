import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Eye } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { api, formatDate } from '../utils/api'
import { optimizeImage, generateSrcSet, generateSizes, generateResponsivePictureSources } from '../utils/imageOptimizer'
import { getCustomArticleSchema, hasCustomSchema } from '../utils/articleSchemas'
import { incrementArticleViews, getArticleViews } from '../services/articleViewsService'
import SEO from '../components/SEO'
import ArticleCard from '../components/ArticleCard'
import ArticleTLDR from '../components/ArticleTLDR'
import ArticleCTA from '../components/ArticleCTA'

let markedParser = null
const getMarkedHtml = async (content) => {
  if (!markedParser) {
    const { marked } = await import('marked')
    marked.setOptions({
      breaks: false,
      gfm: true,
      headerIds: false,
      mangle: false
    })
    markedParser = marked
  }
  return markedParser.parse(content)
}

// Function to clean up content - remove single line breaks in paragraphs only
const cleanContent = (content) => {
  if (!content) return ''
  
  // Split content into lines
  const lines = content.split('\n')
  const result = []
  let inCodeBlock = false
  let inTable = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Check for code blocks
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      result.push(line)
      continue
    }
    
    // If in code block, keep as is
    if (inCodeBlock) {
      result.push(line)
      continue
    }
    
    // Check for tables (lines with |)
    if (trimmedLine.includes('|')) {
      inTable = true
      result.push(line)
      continue
    } else if (inTable && trimmedLine === '') {
      inTable = false
      result.push(line)
      continue
    } else if (inTable) {
      result.push(line)
      continue
    }
    
    // Check for headings, lists, or special markdown
    if (
      trimmedLine.startsWith('#') ||      // Headings
      trimmedLine.startsWith('*') ||      // Lists
      trimmedLine.startsWith('-') ||      // Lists or horizontal rule
      trimmedLine.startsWith('+') ||      // Lists
      trimmedLine.match(/^\d+\./) ||      // Numbered lists
      trimmedLine.startsWith('>') ||      // Blockquotes
      trimmedLine === '' ||               // Empty lines
      trimmedLine.startsWith('![')        // Images
    ) {
      result.push(line)
      continue
    }
    
    // For regular text lines, check if next line should be merged
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1].trim()
      
      // Don't merge if next line is special markdown or empty
      if (
        nextLine === '' ||
        nextLine.startsWith('#') ||
        nextLine.startsWith('*') ||
        nextLine.startsWith('-') ||
        nextLine.startsWith('+') ||
        nextLine.match(/^\d+\./) ||
        nextLine.startsWith('>') ||
        nextLine.includes('|') ||
        nextLine.startsWith('```')
      ) {
        result.push(line)
      } else {
        // Merge with next line
        result.push(line + ' ' + nextLine)
        i++ // Skip next line since we merged it
      }
    } else {
      result.push(line)
    }
  }
  
  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewCount, setViewCount] = useState(0)
  const [contentHtml, setContentHtml] = useState('')

  // Görüntülenme sayacı — LCP sonrası (idle)
  useEffect(() => {
    if (!slug) return
    const run = () => {
      incrementArticleViews(slug).then((newViews) => {
        if (newViews !== null) setViewCount(newViews)
        else getArticleViews(slug).then((views) => setViewCount(views))
      })
    }
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(run, { timeout: 2500 })
    } else {
      setTimeout(run, 1500)
    }
  }, [slug])

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)

        const [articleResponse, indexResponse] = await Promise.all([
          api.getArticle(slug),
          api.getArticlesIndex()
        ])

        if (!articleResponse.success || !articleResponse.data) {
          setError('Makale bulunamadı')
          return
        }

        const current = articleResponse.data
        setArticle(current)

        const indexList = indexResponse.success ? indexResponse.data : []
        const related = indexList
          .filter((a) => a.slug !== slug && a.category === current.category)
          .slice(0, 3)
        setRelatedArticles(related)
      } catch (err) {
        setError('Makale yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  useEffect(() => {
    if (!article?.content) {
      setContentHtml('')
      return
    }
    let cancelled = false
    getMarkedHtml(cleanContent(article.content)).then((html) => {
      if (!cancelled) setContentHtml(html)
    })
    return () => { cancelled = true }
  }, [article?.content])

  const shareArticle = (platform) => {
    if (!article) return
    
    const url = window.location.href
    const title = article.title
    const text = article.excerpt
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link kopyalandı!')
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Makale yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Makale Bulunamadı</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-lawPrimary text-white px-6 py-3 rounded-md hover:bg-lawSecondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  // Tüm kategoriler tek tip nötr rozet — tutarlı marka dili
  const getCategoryColor = () => {
    return 'bg-lawSecondary/10 text-lawSecondary border border-lawSecondary/20'
  }

  // Image can be either a string URL or an object {url, alternativeText, responsive?}
  const articleImageUrl = (article.image && typeof article.image === 'object')
    ? article.image.url
    : article.image
  const articleImageAlt = (article.image && typeof article.image === 'object' && article.image.alternativeText)
    ? article.image.alternativeText
    : article.title
  // Yeni makaleler için responsive flag — varsa <picture> ile WebP/JPG fallback srcset üret
  const isResponsive = !!(article.image && typeof article.image === 'object' && article.image.responsive)
  const pictureSources = isResponsive ? generateResponsivePictureSources(articleImageUrl) : []
  const webpPicture = pictureSources.find((s) => s.type === 'image/webp')
  const coverFallbackSrc =
    webpPicture?.srcSet?.split(',')[0]?.trim()?.split(' ')[0] || articleImageUrl
  // Build absolute URL for OG/Twitter image (required by social platforms)
  const absoluteImageUrl = articleImageUrl
    ? (articleImageUrl.startsWith('http') ? articleImageUrl : `https://koptay.av.tr${articleImageUrl}`)
    : 'https://koptay.av.tr/images/hero-bg-1.jpg'

  return (
    <>
      <SEO
        title={article.seoTitle || `${article.title} | Koptay Hukuk Bürosu`}
        description={article.seoDescription || article.metaDescription || article.excerpt}
        keywords={article.keywords || article.metaKeywords || (article.tags ? article.tags.join(', ') : '')}
        url={`https://koptay.av.tr/makale/${article.slug}`}
        type="article"
        image={absoluteImageUrl}
        author={article.author}
        publishedTime={article.publishedAt || article.publishDate}
        modifiedTime={article.updatedAt || article.updatedDate || article.publishedAt || article.publishDate}
        preloadImage={true}
        preloadImageSrcSet={isResponsive ? pictureSources.find(s => s.type === 'image/webp')?.srcSet : null}
        preloadImageSizes={isResponsive ? pictureSources[0]?.sizes : null}
      />

      {/* JSON-LD Structured Data Schemas */}
      <Helmet>
        {/* Custom JSON-LD Schema (if available for this article - includes BlogPosting + FAQPage) */}
        {hasCustomSchema(article.slug) && (
          <script type="application/ld+json">
            {JSON.stringify(getCustomArticleSchema(article.slug))}
          </script>
        )}

        {/* Default JSON-LD Structured Data - Article Schema */}
        {!hasCustomSchema(article.slug) && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.title,
              "description": article.seoDescription || article.metaDescription || article.excerpt,
              "image": absoluteImageUrl,
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
                  "url": "https://koptay.av.tr/logo.svg",
                  "width": 250,
                  "height": 60
                },
                "url": "https://koptay.av.tr",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+90-530-711-18-64",
                  "contactType": "customer service",
                  "areaServed": "TR",
                  "availableLanguage": "Turkish"
                }
              },
              "datePublished": article.publishedAt || article.publishDate,
              "dateModified": article.updatedAt || article.updatedDate || article.publishedAt || article.publishDate,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://koptay.av.tr/makale/${article.slug}`
              },
              "articleSection": article.category || "Hukuk",
              "keywords": article.keywords || (article.tags ? article.tags.join(", ") : ""),
              "inLanguage": "tr-TR",
              "wordCount": article.content ? article.content.split(/\s+/).length : 0,
              "timeRequired": article.readTime || "5 dakika"
            })}
          </script>
        )}

        {/* JSON-LD Structured Data - BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": "https://koptay.av.tr/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Makaleler",
                "item": "https://koptay.av.tr/makaleler"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.category || "Hukuk",
                "item": `https://koptay.av.tr/makaleler?kategori=${encodeURIComponent(article.category || "")}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": article.title,
                "item": `https://koptay.av.tr/makale/${article.slug}`
              }
            ]
          })}
        </script>

        {/* JSON-LD Structured Data - Organization/LegalService Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "@id": "https://koptay.av.tr/#organization",
            "name": "Koptay Hukuk Bürosu",
            "alternateName": "Av. Murat Can Koptay",
            "url": "https://koptay.av.tr",
            "logo": "https://koptay.av.tr/logo.png",
            "image": "https://koptay.av.tr/images/hero.jpg",
            "description": "Ankara merkezli hukuk bürosu.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ankara",
              "addressCountry": "TR"
            },
            "telephone": "+90-530-711-18-64",
            "email": "info@koptay.av.tr",
            "priceRange": "$$",
            "areaServed": {
              "@type": "Country",
              "name": "Türkiye"
            }
          })}
        </script>
      </Helmet>

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/makaleler"
              className="inline-flex items-center text-gray-600 hover:text-lawSecondary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tüm Makaleler
            </Link>
          </div>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              {/* Category */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(article.publishedAt || article.publishDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Share Buttons — sade nötr stil */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <span className="text-gray-500 text-sm font-medium mr-1">Paylaş:</span>
                <button
                  onClick={() => shareArticle('facebook')}
                  className="p-2 text-gray-500 border border-gray-200 rounded-md hover:text-lawSecondary hover:border-lawSecondary transition-colors"
                  aria-label="Facebook'ta paylaş"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareArticle('twitter')}
                  className="p-2 text-gray-500 border border-gray-200 rounded-md hover:text-lawSecondary hover:border-lawSecondary transition-colors"
                  aria-label="Twitter'da paylaş"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareArticle('linkedin')}
                  className="p-2 text-gray-500 border border-gray-200 rounded-md hover:text-lawSecondary hover:border-lawSecondary transition-colors"
                  aria-label="LinkedIn'de paylaş"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareArticle('copy')}
                  className="p-2 text-gray-500 border border-gray-200 rounded-md hover:text-lawSecondary hover:border-lawSecondary transition-colors"
                  aria-label="Linki kopyala"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Article Image — yeni makaleler için <picture> ile responsive WebP/JPG */}
            {articleImageUrl && (
              <div className="mb-8 relative overflow-hidden rounded-xl bg-gray-100">
                {isResponsive ? (
                  <picture>
                    {pictureSources.map((s) => (
                      <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                    ))}
                    <img
                      src={coverFallbackSrc}
                      srcSet={webpPicture?.srcSet}
                      sizes={webpPicture?.sizes}
                      alt={articleImageAlt}
                      className="w-full h-64 md:h-96 object-cover rounded-xl"
                      width="768"
                      height="400"
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <img
                    src={optimizeImage(articleImageUrl, 1280, 85)}
                    srcSet={generateSrcSet(articleImageUrl)}
                    sizes={generateSizes()}
                    alt={articleImageAlt}
                    className="w-full h-64 md:h-96 object-cover rounded-xl"
                    width="1024"
                    height="690"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = articleImageUrl
                    }}
                  />
                )}
              </div>
            )}

            {/* Makale Ozeti (TL;DR) */}
            <ArticleTLDR excerpt={article.excerpt} />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-strong:font-bold prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-a:text-primary-600 prose-a:underline hover:prose-a:text-primary-700 prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-thead:bg-gradient-to-r prose-thead:from-primary-600 prose-thead:to-primary-700 prose-th:text-white prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-primary-500 prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-gray-300 prose-tr:even:bg-gray-50 prose-tr:hover:bg-gray-100 prose-tr:transition-colors prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto">
              <div
                dangerouslySetInnerHTML={{ __html: contentHtml }}
                className="text-gray-700"
              />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiketler:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Makale sonu — avukata danisma CTA'si */}
          <div className="max-w-4xl mx-auto">
            <ArticleCTA category={article.category} slug={article.slug} />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="max-w-6xl mx-auto mt-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center font-serif">
                İlgili Makaleler
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle, index) => (
                  <ArticleCard 
                    key={relatedArticle.id} 
                    article={relatedArticle} 
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ArticlePage