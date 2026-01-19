import { useState } from 'react'
import {
  Activity,
  User,
  FileText,
  Image as ImageIcon,
  Trash2,
  Edit,
  PlusCircle,
  Save,
  LogIn,
  LogOut,
  Settings,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'article_created',
      user: 'Admin User',
      action: 'Yeni makale oluşturdu',
      details: 'İş Hukuku ve Çalışan Hakları',
      timestamp: '2026-01-20T14:30:00',
      severity: 'info'
    },
    {
      id: 2,
      type: 'user_login',
      user: 'Editör Kullanıcı',
      action: 'Sisteme giriş yaptı',
      details: 'IP: 192.168.1.100',
      timestamp: '2026-01-20T13:15:00',
      severity: 'success'
    },
    {
      id: 3,
      type: 'article_updated',
      user: 'Admin User',
      action: 'Makale güncelledi',
      details: 'Tazminat Hesaplama Yöntemleri',
      timestamp: '2026-01-20T12:45:00',
      severity: 'info'
    },
    {
      id: 4,
      type: 'image_deleted',
      user: 'Admin User',
      action: 'Görsel sildi',
      details: 'old-banner.jpg',
      timestamp: '2026-01-20T11:20:00',
      severity: 'warning'
    },
    {
      id: 5,
      type: 'settings_updated',
      user: 'Admin User',
      action: 'Site ayarlarını güncelledi',
      details: 'SEO ayarları değiştirildi',
      timestamp: '2026-01-20T10:05:00',
      severity: 'info'
    },
    {
      id: 6,
      type: 'user_created',
      user: 'Admin User',
      action: 'Yeni kullanıcı ekledi',
      details: 'yazar@koptay.av.tr',
      timestamp: '2026-01-20T09:30:00',
      severity: 'success'
    },
    {
      id: 7,
      type: 'article_deleted',
      user: 'Admin User',
      action: 'Makale sildi',
      details: 'Eski İçerik - 2024',
      timestamp: '2026-01-19T16:50:00',
      severity: 'warning'
    },
    {
      id: 8,
      type: 'login_failed',
      user: 'Bilinmeyen',
      action: 'Başarısız giriş denemesi',
      details: 'IP: 45.123.45.67',
      timestamp: '2026-01-19T15:22:00',
      severity: 'error'
    },
    {
      id: 9,
      type: 'image_uploaded',
      user: 'Editör Kullanıcı',
      action: 'Yeni görseller yükledi',
      details: '5 adet görsel',
      timestamp: '2026-01-19T14:10:00',
      severity: 'success'
    },
    {
      id: 10,
      type: 'user_logout',
      user: 'Admin User',
      action: 'Sistemden çıkış yaptı',
      details: '',
      timestamp: '2026-01-19T13:00:00',
      severity: 'info'
    }
  ])

  const activityTypes = [
    { value: 'all', label: 'Tüm Aktiviteler' },
    { value: 'article', label: 'Makale İşlemleri' },
    { value: 'user', label: 'Kullanıcı İşlemleri' },
    { value: 'image', label: 'Görsel İşlemleri' },
    { value: 'settings', label: 'Ayar Değişiklikleri' },
    { value: 'security', label: 'Güvenlik Olayları' }
  ]

  const getActivityIcon = (type) => {
    if (type.includes('article')) return FileText
    if (type.includes('user')) return User
    if (type.includes('image')) return ImageIcon
    if (type.includes('settings')) return Settings
    if (type.includes('login') || type.includes('logout')) return LogIn
    return Activity
  }

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 border-green-200'
      case 'warning':
        return 'bg-orange-100 border-orange-200'
      case 'error':
        return 'bg-red-100 border-red-200'
      default:
        return 'bg-blue-100 border-blue-200'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />
      case 'warning':
        return <AlertCircle className="text-orange-600" size={20} />
      case 'error':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <Info className="text-blue-600" size={20} />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays < 7) return `${diffDays} gün önce`

    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || activity.type.includes(typeFilter)

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Aktivite Günlüğü</h1>
          <p className="text-gray-600 mt-1">Sistem aktiviteleri ve kullanıcı işlemleri</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Aktivite ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {activities.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Toplam Aktivite</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.severity === 'success').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Başarılı İşlem</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {activities.filter(a => a.severity === 'warning').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Uyarı</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-red-600">
              {activities.filter(a => a.severity === 'error').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Hata</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Aktivite Akışı</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Aktivite bulunamadı</p>
            </div>
          ) : (
            filteredActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              
              return (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${getSeverityStyle(activity.severity)}`}>
                      {getSeverityIcon(activity.severity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">{activity.user}</span>
                            {activity.details && (
                              <>
                                {' • '}
                                <span>{activity.details}</span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                          <Clock size={14} />
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityLog
