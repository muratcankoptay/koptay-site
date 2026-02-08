import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, BookOpen } from 'lucide-react'
import { api } from '../utils/api'
import SEO from '../components/SEO'
import ArticleCard from '../components/ArticleCard'

const ArticlesPage = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [sortBy, setSortBy] = useState('latest')

  const categories = [
    'Tümü',
    'İş Hukuku',
    'Ticaret Hukuku',
    'Aile Hukuku',
    'Ceza Hukuku',
    'Gayrimenkul Hukuku',
    'İcra ve İflas Hukuku'
  ]

  const sortOptions = [
    { value: 'latest', label: 'En Yeni' },
    { value: 'oldest', label: 'En Eski' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const articlesResponse = await api.getArticles()
        
        if (articlesResponse.success) {
          setArticles(articlesResponse.data)
          setFilteredArticles(articlesResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...articles]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
        break
      default:
        break
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory, sortBy])

  const getCategoryColor = (category) => {
    const colors = {
      'İş Hukuku': 'bg-blue-100 text-blue-800 border-blue-200',
      'Ticaret Hukuku': 'bg-green-100 text-green-800 border-green-200',
      'Aile Hukuku': 'bg-pink-100 text-pink-800 border-pink-200',
      'Ceza Hukuku': 'bg-red-100 text-red-800 border-red-200',
      'Gayrimenkul Hukuku': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'İcra ve İflas Hukuku': 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <>
      <SEO 
        title="Hukuki Makaleler ve Rehberler | Av. Koptay"
        description="Güncel hukuki gelişmeler, uzman görüşleri ve pratik rehberler. İş hukuku, ticaret hukuku, aile hukuku ve daha fazlası."
        keywords="hukuk makaleleri, hukuki rehber, iş hukuku, ticaret hukuku, aile hukuku, ceza hukuku, gayrimenkul hukuku"
      />

      {/* Hero Section */}
      <section className="page-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light mb-6 font-serif">
              Hukuki Makaleler
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Güncel hukuki gelişmeler, uzman görüşleri ve pratik rehberlerle bilgili kalın
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Makalelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-lawPrimary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            {filteredArticles.length} makale bulundu
            {searchTerm && ` "${searchTerm}" için`}
            {selectedCategory !== 'Tümü' && ` ${selectedCategory} kategorisinde`}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Makale bulunamadı
              </h3>
              <p className="text-gray-500 mb-6">
                Arama kriterlerinizi değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('Tümü')
                  setSortBy('latest')
                }}
                className="bg-lawPrimary text-white px-6 py-3 rounded-lg hover:bg-lawSecondary transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-lawDark mb-4 font-serif">
              Popüler Kategoriler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En çok okunan hukuk alanlarındaki makalelerimizi keşfedin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(1).map((category) => {
              const categoryArticles = articles.filter(article => article.category === category)
              
              return (
                <div
                  key={category}
                  className={`p-6 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer ${getCategoryColor(category)}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <h3 className="text-lg font-semibold mb-2">{category}</h3>
                  <span className="text-sm">{categoryArticles.length} makale</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-lawDark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 font-serif">
            Hukuki Gelişmeleri Kaçırmayın
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Yeni makalelerimiz ve hukuki güncellemeler hakkında bilgi almak için bültenimize katılın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-lawSecondary"
            />
            <button className="bg-lawSecondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-lawPrimary transition-colors">
              Katıl
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default ArticlesPage