import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FileText, Edit, Trash2, Eye, Search, PlusCircle,
  Clock, AlertCircle, CheckCircle, XCircle, Filter
} from 'lucide-react'

const API_URL = '/api/admin-articles'

const WebAdminArticleList = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteModal, setDeleteModal] = useState({ open: false, article: null })
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('webAdminToken')
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setArticles(data.data || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.article) return
    setDeleting(true)
    try {
      const token = localStorage.getItem('webAdminToken')
      const res = await fetch(`${API_URL}?id=${deleteModal.article.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== deleteModal.article.id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleting(false)
      setDeleteModal({ open: false, article: null })
    }
  }

  // SEO skor hesapla (basit)
  const getSeoScore = (article) => {
    let score = 0
    if (article.seoTitle && article.seoTitle.length >= 30 && article.seoTitle.length <= 65) score += 20
    else if (article.seoTitle) score += 10
    if (article.seoDescription && article.seoDescription.length >= 100 && article.seoDescription.length <= 160) score += 20
    else if (article.seoDescription) score += 10
    if (article.keywords) score += 15
    if (article.image) score += 15
    if (article.slug) score += 10
    if (article.excerpt) score += 10
    if (article.content && article.content.length > 2000) score += 10
    return score
  }

  const getSeoColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 50) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || article.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Makaleler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{articles.length} makale mevcut</p>
        </div>
        <Link
          to="/web-admin/makale/yeni"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
        >
          <PlusCircle size={18} />
          Yeni Makale
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Makale ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Makale</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">SEO</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tarih</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredArticles.map((article) => {
                const seoScore = getSeoScore(article)
                return (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {article.image?.url ? (
                            <img src={article.image.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="text-gray-300" size={16} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{article.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">/makale/{article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getSeoColor(seoScore)}`}>
                        {seoScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/makale/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Önizle"
                        >
                          <Eye size={16} />
                        </a>
                        <Link
                          to={`/web-admin/makale/${article.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, article })}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Search size={40} className="mx-auto mb-3 text-gray-200" />
            <p>Sonuç bulunamadı</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Makaleyi Sil</h3>
              <p className="text-sm text-gray-500 mb-1">Bu işlem geri alınamaz!</p>
              <p className="text-sm font-medium text-gray-700 mb-6">"{deleteModal.article?.title}"</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, article: null })}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium"
                  disabled={deleting}
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                >
                  {deleting ? 'Siliniyor...' : 'Evet, Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WebAdminArticleList
