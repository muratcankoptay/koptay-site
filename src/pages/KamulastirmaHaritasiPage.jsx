import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, Calendar, Clock, ArrowRight, Newspaper, BookOpen, TrendingUp, Building2, ChevronRight, Tag } from 'lucide-react'
import SEO from '../components/SEO'

// Başlangıç verileri boş olarak ayarlandı, ileride admin panelden veya API'den çekilecek
const samplePosts = []

const KamulastirmaHaritasiPage = () => {
  const [posts, setPosts] = useState(samplePosts)
  const [filteredPosts, setFilteredPosts] = useState(samplePosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('Tümü')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')

  const types = ['Tümü', 'Blog', 'Haber']
  const categories = ['Tümü', 'Rehber', 'Güncel Haber', 'Hukuki Analiz', 'Mevzuat']

  useEffect(() => {
    let filtered = [...posts]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term)) ||
        post.location.toLowerCase().includes(term)
      )
    }

    if (selectedType !== 'Tümü') {
      filtered = filtered.filter(post => 
        selectedType === 'Blog' ? post.type === 'blog' : post.type === 'haber'
      )
    }

    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedType, selectedCategory])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getTypeIcon = (type) => {
    return type === 'blog' ? <BookOpen className="w-4 h-4" /> : <Newspaper className="w-4 h-4" />
  }

  const getTypeColor = (type) => {
    return type === 'blog' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
      : 'bg-amber-100 text-amber-700 border-amber-200'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Rehber': 'bg-blue-50 text-blue-700',
      'Güncel Haber': 'bg-orange-50 text-orange-700',
      'Hukuki Analiz': 'bg-purple-50 text-purple-700',
      'Mevzuat': 'bg-teal-50 text-teal-700',
    }
    return colors[category] || 'bg-gray-50 text-gray-700'
  }

  // İstatistikler
  const stats = [
    { label: 'Toplam Yazı', value: posts.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Blog Yazısı', value: posts.filter(p => p.type === 'blog').length, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Haber', value: posts.filter(p => p.type === 'haber').length, icon: Newspaper, color: 'text-amber-600 bg-amber-50' },
    { label: 'İl/İlçe', value: new Set(posts.map(p => p.location)).size, icon: MapPin, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <>
      <SEO 
        title="Kamulaştırma Haritası | Kamulaştırma Haberleri ve Blog | Koptay Hukuk"
        description="Güncel kamulaştırma haberleri, blog yazıları ve hukuki rehberler. Kamulaştırma süreçleri, bedel tespiti, dava süreçleri hakkında uzman görüşleri."
        keywords="kamulaştırma, kamulaştırma haberleri, kamulaştırma blog, bedel tespiti, acele kamulaştırma, kamulaştırmasız el atma"
        url="/kamulastirma-haritasi"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0c4a6e 0%, #155e75 30%, #164e63 60%, #134e4a 100%)',
        minHeight: '380px'
      }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #67e8f9, transparent)' }}></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a7f3d0, transparent)' }}></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 flex items-center justify-center" style={{ minHeight: '380px' }}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-100 text-sm font-medium">Güncel Kamulaştırma Bilgileri</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-serif text-white">
              Kamulaştırma <span className="text-emerald-300">Haritası</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-cyan-100/80">
              Kamulaştırma haberleri, uzman blog yazıları ve hukuki rehberler.
              Her gün güncellenen içeriklerle kamulaştırma süreçleri hakkında bilgi edinin.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b shadow-sm -mt-1 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Konu, il veya anahtar kelime ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm transition-shadow hover:shadow-md"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedType === type
                      ? 'bg-cyan-700 text-white shadow-lg shadow-cyan-700/25'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-sm shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {filteredPosts.length} içerik bulundu
            {searchTerm && <span> — "<strong>{searchTerm}</strong>" için</span>}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header - Image placeholder */}
                  <div className="relative h-48 overflow-hidden" style={{
                    background: post.type === 'blog'
                      ? 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
                      : 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)'
                  }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center p-6">
                        {post.type === 'blog' 
                          ? <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-80" />
                          : <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-80" />
                        }
                        <div className="text-sm opacity-60 font-medium">{post.type === 'blog' ? 'Blog Yazısı' : 'Güncel Haber'}</div>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(post.type)}`}>
                        {getTypeIcon(post.type)}
                        {post.type === 'blog' ? 'Blog' : 'Haber'}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm text-cyan-700 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-medium">{post.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug font-serif group-hover:text-cyan-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-cyan-700 font-semibold text-sm group-hover:text-cyan-800 transition-colors">
                      Devamını Oku
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">İçerik bulunamadı</h3>
              <p className="text-gray-500 mb-6">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedType('Tümü')
                  setSelectedCategory('Tümü')
                }}
                className="bg-cyan-700 text-white px-6 py-3 rounded-xl hover:bg-cyan-800 transition-colors font-medium"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #164e63 0%, #134e4a 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-12 h-12 text-emerald-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 font-serif">
            Kamulaştırma Sürecinizde Yanınızdayız
          </h2>
          <p className="text-lg text-cyan-100/80 max-w-2xl mx-auto mb-8">
            Kamulaştırma davalarında uzman avukat kadromuzla hukuki haklarınızı koruyoruz.
            Bedel tespiti, dava süreçleri ve itiraz başvuruları için bize ulaşın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
            >
              İletişime Geç
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="tel:+905307111864"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Hemen Ara
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default KamulastirmaHaritasiPage
