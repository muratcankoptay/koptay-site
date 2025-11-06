import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { formatDate } from '../utils/api'
import { optimizeImage } from '../utils/imageOptimizer'

const ArticleCard = ({ article, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

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
    <article
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Article Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
        {article.image ? (
          <img
            src={optimizeImage(article.image, 640, 75)}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Fallback to gradient background if image fails to load
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-center p-6">
              <div className="text-6xl mb-2">⚖️</div>
              <div className="text-sm opacity-75">Hukuk Makalesi</div>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Article Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Article Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight font-serif line-clamp-2">
          {article.title}
        </h3>

        {/* Article Excerpt */}
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <Link
          to={`/makale/${article.slug}`}
          className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200 group"
        >
          Devamını Oku
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  )
}

export default ArticleCard