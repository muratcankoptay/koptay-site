import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const WEB_AUTH_API = '/api/admin-auth'

const WebAdminProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('webAdminToken')
    const auth = localStorage.getItem('webAdminAuth')

    if (!token || !auth) {
      setChecking(false)
      return
    }

    try {
      const res = await fetch(WEB_AUTH_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'verify' })
      })

      if (res.ok) {
        const data = await res.json()
        setAuthenticated(data.valid)
        if (!data.valid) {
          localStorage.removeItem('webAdminToken')
          localStorage.removeItem('webAdminAuth')
        }
      } else {
        localStorage.removeItem('webAdminToken')
        localStorage.removeItem('webAdminAuth')
      }
    } catch {
      // Offline durumunda localStorage kontrolü yeterli
      setAuthenticated(true)
    } finally {
      setChecking(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Doğrulanıyor...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/web-admin/login" replace />
  }

  return children
}

export default WebAdminProtectedRoute
