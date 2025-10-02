import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react'
import SEO from '../components/SEO'
import { api, formatDate } from '../utils/api'

const MakalelerPage = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.getArticles()
        if (response.success) {
          setArticles(response.data)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category))]

  return (
    <>
      <SEO 
        title="Makaleler - Koptay Hukuk Bürosu"
        description="Hukuk alanındaki güncel gelişmeler, yargıtay kararları, mevzuat değişiklikleri ve uzman görüşlerimizi içeren makalelerimiz."
        keywords="hukuk makaleleri, yargıtay kararları, mevzuat, iş hukuku makaleleri, ticaret hukuku, aile hukuku, ceza hukuku"
        url="/makaleler"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lawPrimary to-lawSecondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">
            Makaleler
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Hukuk alanındaki güncel gelişmeler, yargıtay kararları ve uzman görüşlerimiz
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Makalelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-lawPrimary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'Tümü' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lawPrimary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Makaleler yükleniyor...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Arama kriterlerinize uygun makale bulunamadı.' 
                  : 'Henüz makale bulunmuyor.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <article 
                  key={article.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {article.image && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime || '5'} dk</span>
                    </div>
                  </div>

                  {article.category && (
                    <span className="inline-block px-3 py-1 bg-lawSecondary text-white text-xs font-medium rounded-full mb-4">
                      {article.category}
                    </span>
                  )}

                  <h2 className="text-xl font-serif text-lawDark mb-4 leading-tight">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{article.author || 'Av. Koptay'}</span>
                    </div>
                    
                    <Link 
                      to={`/makale/${article.slug}`}
                      className="inline-flex items-center gap-2 text-lawPrimary hover:text-lawSecondary font-medium transition-colors duration-300"
                    >
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lawPrimary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-serif mb-4">
            Hukuki Danışmanlığa İhtiyacınız mı Var?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Uzman avukat kadromuzla ücretsiz ön görüşme için hemen iletişime geçin.
          </p>
          <Link 
            to="/iletisim"
            className="inline-block bg-lawSecondary text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-white hover:text-lawPrimary transition-all duration-300"
          >
            İletişime Geç
          </Link>
        </div>
      </section>
    </>
  )
}

export default MakalelerPage