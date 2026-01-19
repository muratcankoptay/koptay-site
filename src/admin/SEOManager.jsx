import { useState } from 'react'
import {
  Search,
  TrendingUp,
  FileText,
  Globe,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Save,
  RefreshCw,
  Target,
  BarChart3
} from 'lucide-react'

const SEOManager = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [seoScores, setSeoScores] = useState({
    overall: 87,
    technical: 92,
    content: 85,
    mobile: 89,
    performance: 84
  })

  const [pages, setPages] = useState([
    {
      id: 1,
      url: '/',
      title: 'Ana Sayfa - Koptay Hukuk',
      metaDescription: 'İş hukuku alanında uzman avukatlar. Tazminat hesaplama, işçi hakları ve daha fazlası.',
      keywords: ['iş hukuku', 'avukat', 'tazminat'],
      score: 95,
      issues: 0,
      status: 'excellent'
    },
    {
      id: 2,
      url: '/hizmetlerimiz',
      title: 'Hizmetlerimiz',
      metaDescription: '',
      keywords: ['hukuk hizmetleri'],
      score: 68,
      issues: 2,
      status: 'warning'
    },
    {
      id: 3,
      url: '/makaleler',
      title: 'Hukuk Makaleleri - Koptay Hukuk',
      metaDescription: 'İş hukuku ve tazminat konularında detaylı makaleler.',
      keywords: ['makale', 'iş hukuku', 'hukuk yazıları'],
      score: 88,
      issues: 1,
      status: 'good'
    }
  ])

  const [sitemapStatus, setSitemapStatus] = useState({
    lastUpdate: '2026-01-20T08:00:00',
    totalUrls: 156,
    status: 'active'
  })

  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://koptay.av.tr/sitemap.xml`)

  const [editingRobots, setEditingRobots] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
    { id: 'pages', label: 'Sayfa Analizi', icon: FileText },
    { id: 'sitemap', label: 'Sitemap', icon: Globe },
    { id: 'robots', label: 'Robots.txt', icon: Target }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-orange-600 bg-orange-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const ScoreCircle = ({ score, label }) => {
    const color = getScoreColor(score)
    const circumference = 2 * Math.PI * 36

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${color}`}>{score}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{label}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SEO Yönetimi</h1>
          <p className="text-gray-600 mt-1">Site SEO performansı ve optimizasyon</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
          <RefreshCw size={20} />
          Yeniden Tara
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* SEO Scores */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">SEO Skorları</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <ScoreCircle score={seoScores.overall} label="Genel" />
              <ScoreCircle score={seoScores.technical} label="Teknik" />
              <ScoreCircle score={seoScores.content} label="İçerik" />
              <ScoreCircle score={seoScores.mobile} label="Mobil" />
              <ScoreCircle score={seoScores.performance} label="Performans" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-green-600">142</span>
              </div>
              <p className="text-sm text-gray-600">Optimizasyon Başarılı</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-orange-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-orange-600">8</span>
              </div>
              <p className="text-sm text-gray-600">Uyarı</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-red-600">3</span>
              </div>
              <p className="text-sm text-gray-600">Hata</p>
            </div>
          </div>

          {/* SEO Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Öneriler</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-green-900">Tüm sayfalar SSL ile korunuyor</p>
                  <p className="text-sm text-green-700 mt-1">HTTPS protokolü aktif ve çalışıyor.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-orange-900">3 sayfa meta description eksik</p>
                  <p className="text-sm text-orange-700 mt-1">Tüm sayfalara unique meta description ekleyin.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">Bazı görsellerde alt text eksik</p>
                  <p className="text-sm text-red-700 mt-1">12 görselde alt attribute bulunmuyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Sayfa</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Başlık</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Meta Description</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">SEO Skoru</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Sorunlar</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-gray-400" />
                        <code className="text-sm text-gray-800">{page.url}</code>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-sm text-gray-800 truncate">{page.title}</p>
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <p className="text-sm text-gray-600 truncate">
                        {page.metaDescription || <span className="text-red-600">Eksik</span>}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-lg font-bold ${getScoreColor(page.score)}`}>
                        {page.score}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {page.issues > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          <AlertCircle size={12} />
                          {page.issues}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle size={12} />
                          OK
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sitemap Tab */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Sitemap Durumu</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                <RefreshCw size={18} />
                Yeniden Oluştur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Toplam URL</p>
                <p className="text-2xl font-bold text-gray-800">{sitemapStatus.totalUrls}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Son Güncelleme</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(sitemapStatus.lastUpdate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Durum</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <CheckCircle size={14} />
                  Aktif
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <LinkIcon className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-blue-900">Sitemap URL</p>
                  <a 
                    href="https://koptay.av.tr/sitemap.xml" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 block"
                  >
                    https://koptay.av.tr/sitemap.xml
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Robots.txt Tab */}
      {activeTab === 'robots' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">robots.txt Dosyası</h2>
            {!editingRobots ? (
              <button
                onClick={() => setEditingRobots(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Edit size={18} />
                Düzenle
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingRobots(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => setEditingRobots(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Kaydet
                </button>
              </div>
            )}
          </div>

          <textarea
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            disabled={!editingRobots}
            className="w-full h-64 px-4 py-3 font-mono text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50"
          />

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <LinkIcon className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-blue-900">Robots.txt URL</p>
                <a 
                  href="https://koptay.av.tr/robots.txt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                >
                  https://koptay.av.tr/robots.txt
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SEOManager
