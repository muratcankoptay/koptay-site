import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { marked } from 'marked'
import { api, formatDate } from '../utils/api'
import SEO from '../components/SEO'
import ArticleCard from '../components/ArticleCard'

// Configure marked to handle line breaks properly
marked.setOptions({
  breaks: false,
  gfm: true,
  headerIds: false,
  mangle: false
})

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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.getArticle(slug)
        if (response.success) {
          setArticle(response.data)
          
          // Fetch related articles
          const allArticlesResponse = await api.getArticles()
          if (allArticlesResponse.success) {
            const related = allArticlesResponse.data
              .filter(a => a.slug !== slug && a.category === response.data.category)
              .slice(0, 3)
            setRelatedArticles(related)
          }
        } else {
          setError(response.error || 'Makale bulunamadı')
        }
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
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category) => {
    const colors = {
      'İş Hukuku': 'bg-blue-100 text-blue-800',
      'Ticaret Hukuku': 'bg-green-100 text-green-800',
      'Aile Hukuku': 'bg-pink-100 text-pink-800',
      'Ceza Hukuku': 'bg-red-100 text-red-800',
      'Gayrimenkul Hukuku': 'bg-yellow-100 text-yellow-800',
      'İcra ve İflas Hukuku': 'bg-purple-100 text-purple-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <SEO
        title={`${article.title} | Av. Koptay Hukuk Bürosu`}
        description={article.metaDescription || article.excerpt}
        keywords={article.metaKeywords || (article.tags ? article.tags.join(', ') : '')}
        url={`https://koptayhukuk.com/makaleler/${article.slug}`}
        type="article"
        image={article.image}
        author={article.author}
        publishedTime={article.publishDate}
        modifiedTime={article.updatedDate || article.publishDate}
        preloadImage={true}
      />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Ana Sayfaya Dön
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
                  <span>{formatDate(article.publishDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Paylaş:</span>
                <button
                  onClick={() => shareArticle('facebook')}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Facebook'ta paylaş"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareArticle('twitter')}
                  className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  aria-label="Twitter'da paylaş"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareArticle('linkedin')}
                  className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                  aria-label="LinkedIn'de paylaş"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareArticle('copy')}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label="Linki kopyala"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Article Image */}
            {article.image && (
              <div className="mb-8 relative overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-strong:font-bold prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-a:text-primary-600 prose-a:underline hover:prose-a:text-primary-700 prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-thead:bg-gradient-to-r prose-thead:from-primary-600 prose-thead:to-primary-700 prose-th:text-white prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-primary-500 prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-gray-300 prose-tr:even:bg-gray-50 prose-tr:hover:bg-gray-100 prose-tr:transition-colors prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto">
              <div 
                dangerouslySetInnerHTML={{ __html: marked.parse(cleanContent(article.content || '')) }}
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

          {/* Contact CTA */}
          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
              Bu Konuda Hukuki Desteğe İhtiyacınız mı Var?
            </h3>
            <p className="text-xl mb-6 text-blue-100">
              Uzman avukat kadromuzla ücretsiz ön görüşme için hemen iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setTimeout(() => {
                    window.location.href = '/#contact'
                  }, 500)
                }}
                className="bg-lawSecondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-lawPrimary transition-colors"
              >
                Ücretsiz Görüşme
              </button>
              <a 
                href={`tel:${import.meta.env.VITE_PHONE || '+90 530 711 18 64'}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Hemen Ara
              </a>
            </div>
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