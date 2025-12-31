import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Image, PlusCircle, TrendingUp, Clock, Eye } from 'lucide-react'

const API_URL = 'http://localhost:3002/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalImages: 0,
    recentArticles: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [articlesRes, imagesRes] = await Promise.all([
        fetch(`${API_URL}/articles`),
        fetch(`${API_URL}/images`)
      ])
      
      const articlesData = await articlesRes.json()
      const imagesData = await imagesRes.json()
      
      setStats({
        totalArticles: articlesData.data?.length || 0,
        totalImages: imagesData?.length || 0,
        recentArticles: articlesData.data?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Stats fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Hoş geldiniz! Site yönetim panelinize genel bakış.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Toplam Makale</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalArticles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Yüklenen Görsel</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalImages}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Image className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <Link 
          to="/admin/makale/yeni"
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-sm p-6 text-white hover:from-amber-600 hover:to-amber-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-100">Hızlı İşlem</p>
              <p className="text-xl font-bold mt-1">Yeni Makale</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
            </div>
          </div>
        </Link>

        <a 
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-sm p-6 text-white hover:from-gray-800 hover:to-gray-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Canlı Site</p>
              <p className="text-xl font-bold mt-1">Görüntüle</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye size={24} />
            </div>
          </div>
        </a>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Son Makaleler</h2>
            <Link 
              to="/admin/makaleler"
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {stats.recentArticles.length > 0 ? (
            stats.recentArticles.map((article) => (
              <Link
                key={article.id}
                to={`/admin/makale/${article.id}`}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {article.image?.url ? (
                    <img 
                      src={article.image.url} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="text-gray-400" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{article.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {article.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Henüz makale yok</p>
              <Link 
                to="/admin/makale/yeni"
                className="text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block"
              >
                İlk makaleyi oluştur →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">💡 Hızlı İpuçları</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Makale içeriğinde <strong>Markdown</strong> formatını kullanabilirsiniz</li>
          <li>• Görselleri yükledikten sonra URL'lerini kopyalayıp makaleye ekleyebilirsiniz</li>
          <li>• Değişiklikler kaydedilince <code className="bg-blue-100 px-1 rounded">articles.json</code> otomatik güncellenir</li>
          <li>• Siteyi yayınlamak için <code className="bg-blue-100 px-1 rounded">git push</code> yapmanız yeterli</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
