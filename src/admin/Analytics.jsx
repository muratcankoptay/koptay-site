import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Clock,
  MousePointer,
  RefreshCw,
  Download
} from 'lucide-react'
import API_CONFIG from '../config/api'

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days')
  const [loading, setLoading] = useState(true)
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [analytics, setAnalytics] = useState({
    visitors: { total: 0, change: 0 },
    pageViews: { total: 0, change: 0 },
    avgDuration: { total: '0:00', change: 0 },
    bounceRate: { total: 0, change: 0 }
  })

  useEffect(() => {
    fetchAnalytics()
    
    // Canlı ziyaretçi sayısını güncelle
    const interval = setInterval(() => {
      fetchLiveVisitors()
    }, 5000)

    return () => clearInterval(interval)
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_CONFIG.ANALYTICS_API}/analytics/stats?period=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics({
          visitors: { total: data.uniqueVisitors || 0, change: data.visitorChange || 0 },
          pageViews: { total: data.totalPageViews || 0, change: data.pageViewChange || 0 },
          avgDuration: { total: data.avgSessionDuration || '0:00', change: data.durationChange || 0 },
          bounceRate: { total: data.bounceRate || 0, change: data.bounceRateChange || 0 }
        })
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLiveVisitors = async () => {
    try {
      const response = await fetch(`${API_CONFIG.ANALYTICS_API}/analytics/live`)
      if (response.ok) {
        const data = await response.json()
        setLiveVisitors(data.activeVisitors || 0)
      }
    } catch (error) {
      console.error('Live visitors fetch error:', error)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600 mt-1">Site trafik ve performans analizi</p>
        </div>
        
        <div className="flex items-center gap-3">
          {liveVisitors > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">
                {liveVisitors} Canlı Ziyaretçi
              </span>
            </div>
          )}

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="today">Bugün</option>
            <option value="7days">Son 7 Gün</option>
            <option value="30days">Son 30 Gün</option>
            <option value="90days">Son 90 Gün</option>
            <option value="year">Bu Yıl</option>
          </select>
          
          <button 
            onClick={fetchAnalytics}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            <Download size={20} />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Ana İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Ziyaretçi"
          value={analytics.visitors.total.toLocaleString()}
          change={analytics.visitors.change}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Sayfa Görüntüleme"
          value={analytics.pageViews.total.toLocaleString()}
          change={analytics.pageViews.change}
          icon={Eye}
          color="bg-green-500"
        />
        <StatCard
          title="Ort. Süre"
          value={analytics.avgDuration.total}
          change={analytics.avgDuration.change}
          icon={Clock}
          color="bg-purple-500"
        />
        <StatCard
          title="Hemen Çıkma"
          value={`${analytics.bounceRate.total}%`}
          change={analytics.bounceRate.change}
          icon={MousePointer}
          color="bg-orange-500"
        />
      </div>

      {/* Boş Durum Mesajı */}
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="text-blue-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Analytics Sistemi Hazır
          </h3>
          <p className="text-gray-600 mb-6">
            Gerçek zamanlı veri takibi başlamak üzere. Backend API bağlantısı kurulduğunda veriler otomatik olarak gösterilecek.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Kurulum Adımları:</strong>
            </p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Analytics tracker'ı sitenize ekleyin</li>
              <li>Backend API başlatılıyor...</li>
              <li>Veriler otomatik toplanacak</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Not */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Not:</strong> Analytics API bağlantısı kurulduğunda, bu sayfa grafikler, 
          cihaz dağılımı, trafik kaynakları ve diğer detaylı metrikleri gösterecektir.
        </p>
      </div>
    </div>
  )
}

export default Analytics
