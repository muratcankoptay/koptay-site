import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { api, formatDate } from '../utils/api'
import ArticleCard from './ArticleCard'

const Insights = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await api.getArticles()
        if (response.success) {
          // Show only the latest 3 articles
          setArticles(response.data.slice(0, 3))
        } else {
          setError('Makaleler yüklenirken bir hata oluştu.')
        }
      } catch (err) {
        setError('Makaleler yüklenirken bir hata oluştu.')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) {
    return (
      <section id="insights" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Makaleler yükleniyor...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="insights" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="insights" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
            <span className="text-primary-600 font-semibold text-lg">Hukuki Makaleler</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Güncel Hukuki Gelişmeler
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hukuk dünyasındaki son gelişmeler, yasal değişiklikler ve uzman görüşlerimizi 
            makalelerimizde paylaşıyoruz.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index}
                />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button 
                onClick={() => {
                  // Scroll to show more articles or implement pagination
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                Tüm Makaleleri Görüntüle
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Henüz makale bulunmuyor.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Hukuki Gelişmelerden Haberdar Olun
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Yeni makalelerimiz ve hukuki güncellemeler hakkında bilgi almak için 
              e-posta adresinizi bırakın.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                required
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
              >
                Abone Ol
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              E-posta adresiniz güvendedir. Spam göndermiyoruz.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Insights