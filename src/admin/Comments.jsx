import { useState } from 'react'
import {
  MessageSquare,
  User,
  Calendar,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  ThumbsUp,
  MessageCircle,
  Mail,
  Clock
} from 'lucide-react'

const Comments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [comments, setComments] = useState([])
  const [selectedComment, setSelectedComment] = useState(null)

  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'pending', label: 'Bekleyenler' },
    { value: 'approved', label: 'Onaylananlar' },
    { value: 'rejected', label: 'Reddedilenler' },
    { value: 'spam', label: 'Spam' }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      spam: 'bg-gray-100 text-gray-700'
    }

    const labels = {
      pending: 'Bekliyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      spam: 'Spam'
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleApprove = (id) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, status: 'approved' } : c
    ))
  }

  const handleReject = (id) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, status: 'rejected' } : c
    ))
  }

  const handleMarkAsSpam = (id) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, status: 'spam', isSpam: true } : c
    ))
  }

  const handleDelete = (id) => {
    setComments(comments.filter(c => c.id !== id))
    setSelectedComment(null)
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.article.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    spam: comments.filter(c => c.status === 'spam').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Yorum Yönetimi</h1>
          <p className="text-gray-600 mt-1">{stats.total} yorum mevcut</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Toplam Yorum</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600">Bekleyen</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="text-green-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-green-600">{stats.approved}</span>
          </div>
          <p className="text-sm text-gray-600">Onaylanan</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.spam}</span>
          </div>
          <p className="text-sm text-gray-600">Spam</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Yorum ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {filteredComments.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Yorum bulunamadı</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{comment.author}</h3>
                          {getStatusBadge(comment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {comment.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(comment.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Makale: <span className="font-medium text-gray-800">{comment.article}</span>
                      </p>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>

                    {/* Rating */}
                    {comment.rating > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <ThumbsUp
                            key={i}
                            size={14}
                            className={i < comment.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          >
                            <Check size={16} />
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(comment.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <X size={16} />
                            Reddet
                          </button>
                        </>
                      )}
                      
                      {!comment.isSpam && (
                        <button
                          onClick={() => handleMarkAsSpam(comment.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          <AlertTriangle size={16} />
                          Spam İşaretle
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Comments
