import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, AlertCircle, Globe, Shield } from 'lucide-react'

const WEB_AUTH_API = '/api/admin-auth'

const WebAdminLogin = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(WEB_AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (res.ok && data.token) {
        localStorage.setItem('webAdminToken', data.token)
        localStorage.setItem('webAdminAuth', 'true')
        navigate('/web-admin')
      } else {
        setError(data.error || 'Giriş başarısız')
      }
    } catch (err) {
      setError('Sunucuya bağlanılamıyor. Vercel ortam değişkenlerini kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Globe size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Koptay Hukuk</h1>
            <p className="text-blue-200 mt-1 flex items-center justify-center gap-2">
              <Shield size={14} />
              Web Admin Paneli
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Şifresi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Doğrulanıyor...
              </>
            ) : (
              <>
                <Shield size={18} />
                Güvenli Giriş
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-400">
              Bu panel Vercel üzerinde çalışır. Şifre ortam değişkenlerinden kontrol edilir.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WebAdminLogin
