import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, PlusCircle, Clock, Eye, TrendingUp, Globe, AlertTriangle } from 'lucide-react'

const API_URL = '/api/admin-articles'

const WebAdminDashboard = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('webAdminToken')
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setArticles(data.data || [])
    } catch (err) {
      setError('Makaleler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: articles.filter(a => a.category === cat).length
  })).sort((a, b) => b.count - a.count)

  // SEO skoru hesapla
  const articlesWithSeoIssues = articles.filter(a => {
    const issues = []
    if (!a.seoTitle || a.seoTitle.length < 30) issues.push('title')
    if (!a.seoDescription || a.seoDescription.length < 100) issues.push('desc')
    if (!a.keywords) issues.push('keywords')
    if (!a.image) issues.push('image')
    return issues.length > 1
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Web Admin Paneli - Genel Bakış</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Toplam Makale</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{articles.length}</p>
            </div>
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Kategori</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{categories.length}</p>
            </div>
            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">SEO Uyarısı</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{articlesWithSeoIssues.length}</p>
            </div>
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-amber-600" size={22} />
            </div>
          </div>
        </div>

        <Link 
          to="/web-admin/makale/yeni"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-5 text-white hover:from-blue-700 hover:to-indigo-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-200 uppercase tracking-wider">Hızlı İşlem</p>
              <p className="text-lg font-bold mt-1">Yeni Makale</p>
            </div>
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={22} />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Son Makaleler</h2>
            <Link to="/web-admin/makaleler" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Tümü →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {articles.slice(0, 8).map((article) => (
              <Link
                key={article.id}
                to={`/web-admin/makale/${article.id}`}
                className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {article.image?.url ? (
                    <img src={article.image.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="text-gray-300" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{article.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{article.category}</span>
                  </div>
                </div>
              </Link>
            ))}
            {articles.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <FileText size={40} className="mx-auto mb-3 text-gray-200" />
                <p>Henüz makale yok</p>
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Kategoriler</h2>
          </div>
          <div className="p-4 space-y-3">
            {categoryCounts.map(({ name, count }) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${(count / articles.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Setup info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Globe size={18} />
          Web Admin Bilgileri
        </h3>
        <ul className="space-y-1.5 text-sm text-blue-700">
          <li>• Bu panel Netlify Functions üzerinden çalışır</li>
          <li>• Makale oluşturma/düzenleme için <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">GITHUB_TOKEN</code> ve <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">GITHUB_REPO</code> env değişkenleri gereklidir</li>
          <li>• Her değişiklik GitHub'a commit olarak kaydedilir ve site otomatik yeniden deploy edilir</li>
          <li>• Gelişmiş SEO editörü ile makalelerinizi Google'da üst sıralara taşıyın</li>
        </ul>
      </div>
    </div>
  )
}

export default WebAdminDashboard
