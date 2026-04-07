import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  FileText, PlusCircle, LogOut, Home, Menu, X, 
  BarChart3, Globe, ChevronRight, ExternalLink
} from 'lucide-react'

const WebAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('webAdminToken')
    localStorage.removeItem('webAdminAuth')
    navigate('/web-admin/login')
  }

  const menuItems = [
    { path: '/web-admin', icon: Home, label: 'Dashboard', exact: true },
    { path: '/web-admin/makaleler', icon: FileText, label: 'Makaleler' },
    { path: '/web-admin/makale/yeni', icon: PlusCircle, label: 'Yeni Makale', highlight: true },
  ]

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Koptay Hukuk
              </h1>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Globe size={10} />
                Web Admin Paneli
              </p>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hidden lg:block"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
              isActive(item.path, item.exact)
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : item.highlight
                  ? 'text-amber-300 hover:bg-amber-500/10 border border-transparent'
                  : 'text-slate-300 hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <item.icon size={18} />
            {sidebarOpen && (
              <>
                <span className="flex-1">{item.label}</span>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive(item.path, item.exact) ? 'opacity-100' : ''}`} />
              </>
            )}
          </Link>
        ))}

        {/* Site link */}
        {sidebarOpen && (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700/50 transition-all text-sm mt-4 border border-slate-700/30"
          >
            <ExternalLink size={18} />
            <span className="flex-1">Siteyi Görüntüle</span>
          </a>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm"
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Çıkış Yap</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-900 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-[68px]'} min-h-screen fixed left-0 top-0 z-50`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-[68px]'}`}>
        {/* Top bar for mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-800">Koptay Web Admin</span>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default WebAdminLayout
