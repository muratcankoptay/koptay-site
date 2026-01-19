import { useState } from 'react'
import {
  Settings as SettingsIcon,
  Save,
  Globe,
  Mail,
  Shield,
  Palette,
  Bell,
  Database,
  Code,
  Key,
  Image as ImageIcon,
  FileText,
  CheckCircle
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [notification, setNotification] = useState(null)
  const [settings, setSettings] = useState({
    // Genel Ayarlar
    siteName: 'Koptay Hukuk Bürosu',
    siteTagline: 'İş Hukuku Alanında Uzman Avukatlar',
    siteUrl: 'https://koptay.av.tr',
    adminEmail: 'admin@koptay.av.tr',
    contactEmail: 'iletisim@koptay.av.tr',
    phone: '+90 532 123 4567',
    address: 'İstanbul, Türkiye',
    
    // SEO Ayarları
    metaDescription: 'İş hukuku alanında uzman avukatlar. Tazminat hesaplama, işçi hakları ve daha fazlası.',
    metaKeywords: 'iş hukuku, avukat, tazminat, işçi hakları',
    googleAnalyticsId: 'UA-XXXXXXXXX-X',
    googleSearchConsole: '',
    
    // Sosyal Medya
    facebookUrl: 'https://facebook.com/koptayhukuk',
    twitterUrl: 'https://twitter.com/koptayhukuk',
    linkedinUrl: 'https://linkedin.com/company/koptay',
    instagramUrl: 'https://instagram.com/koptayhukuk',
    
    // E-posta Ayarları
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@koptay.av.tr',
    smtpPassword: '••••••••',
    
    // Tema Ayarları
    primaryColor: '#d97706',
    secondaryColor: '#1f2937',
    accentColor: '#3b82f6',
    
    // Bildirim Ayarları
    emailNotifications: true,
    newArticleNotification: true,
    commentNotification: false,
    userActivityNotification: true,
    
    // Güvenlik Ayarları
    twoFactorAuth: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    ipWhitelist: '',
    
    // API Ayarları
    apiRateLimit: '100',
    apiCacheEnabled: true,
    apiCacheDuration: '3600',
    
    // Yedekleme
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: '30'
  })

  const tabs = [
    { id: 'general', label: 'Genel', icon: SettingsIcon },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'email', label: 'E-posta', icon: Mail },
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'api', label: 'API', icon: Code },
    { id: 'backup', label: 'Yedekleme', icon: Database }
  ]

  const handleSave = () => {
    // Ayarları kaydet
    setNotification('Ayarlar başarıyla kaydedildi!')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ayarlar</h1>
          <p className="text-gray-600 mt-1">Site yapılandırması ve tercihler</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Save size={20} />
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* Success Notification */}
      {notification && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-800 font-semibold">{notification}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Genel Ayarlar */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Genel Ayarlar</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site Adı
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site Sloganı
                      </label>
                      <input
                        type="text"
                        value={settings.siteTagline}
                        onChange={(e) => handleChange('siteTagline', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => handleChange('siteUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Admin E-posta
                        </label>
                        <input
                          type="email"
                          value={settings.adminEmail}
                          onChange={(e) => handleChange('adminEmail', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          İletişim E-posta
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => handleChange('contactEmail', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={settings.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Adres
                        </label>
                        <input
                          type="text"
                          value={settings.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Ayarları */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">SEO Ayarları</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={settings.metaDescription}
                        onChange={(e) => handleChange('metaDescription', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {settings.metaDescription.length}/160 karakter
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={settings.metaKeywords}
                        onChange={(e) => handleChange('metaKeywords', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="virgülle ayırın"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={settings.googleAnalyticsId}
                        onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="UA-XXXXXXXXX-X"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Google Search Console Kodu
                      </label>
                      <input
                        type="text"
                        value={settings.googleSearchConsole}
                        onChange={(e) => handleChange('googleSearchConsole', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>İpucu:</strong> SEO ayarlarınızı düzenli olarak gözden geçirin ve 
                        meta description'larınızı her sayfa için özelleştirin.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Sosyal Medya</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.facebookUrl}
                        onChange={(e) => handleChange('facebookUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={settings.twitterUrl}
                        onChange={(e) => handleChange('twitterUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={settings.linkedinUrl}
                        onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => handleChange('instagramUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* E-posta Ayarları */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">SMTP Ayarları</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={settings.smtpHost}
                          onChange={(e) => handleChange('smtpHost', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="text"
                          value={settings.smtpPort}
                          onChange={(e) => handleChange('smtpPort', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SMTP Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        value={settings.smtpUser}
                        onChange={(e) => handleChange('smtpUser', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SMTP Şifre
                      </label>
                      <input
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Test E-postası Gönder
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tema Ayarları */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Renk Ayarları</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ana Renk
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                            className="w-16 h-10 border border-gray-200 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          İkincil Renk
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                            className="w-16 h-10 border border-gray-200 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.secondaryColor}
                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Vurgu Rengi
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={settings.accentColor}
                            onChange={(e) => handleChange('accentColor', e.target.value)}
                            className="w-16 h-10 border border-gray-200 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.accentColor}
                            onChange={(e) => handleChange('accentColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-4">Önizleme</h3>
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg shadow-md" style={{ backgroundColor: settings.primaryColor }}></div>
                        <div className="w-24 h-24 rounded-lg shadow-md" style={{ backgroundColor: settings.secondaryColor }}></div>
                        <div className="w-24 h-24 rounded-lg shadow-md" style={{ backgroundColor: settings.accentColor }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bildirim Ayarları */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bildirim Tercihleri</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">E-posta Bildirimleri</p>
                        <p className="text-sm text-gray-600">Tüm e-posta bildirimlerini aktifleştir</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">Yeni Makale Bildirimi</p>
                        <p className="text-sm text-gray-600">Yeni makale yayınlandığında bildir</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.newArticleNotification}
                        onChange={(e) => handleChange('newArticleNotification', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">Yorum Bildirimi</p>
                        <p className="text-sm text-gray-600">Yeni yorum eklendiğinde bildir</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.commentNotification}
                        onChange={(e) => handleChange('commentNotification', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">Kullanıcı Aktivite Bildirimi</p>
                        <p className="text-sm text-gray-600">Kullanıcı işlemlerini bildir</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.userActivityNotification}
                        onChange={(e) => handleChange('userActivityNotification', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Güvenlik Ayarları */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Güvenlik Ayarları</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">İki Faktörlü Doğrulama (2FA)</p>
                        <p className="text-sm text-gray-600">Giriş için ekstra güvenlik katmanı</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Oturum Zaman Aşımı (dakika)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Maksimum Giriş Denemesi
                      </label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IP Beyaz Liste
                      </label>
                      <textarea
                        value={settings.ipWhitelist}
                        onChange={(e) => handleChange('ipWhitelist', e.target.value)}
                        rows="4"
                        placeholder="Her satıra bir IP adresi"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Ayarları */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">API Ayarları</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rate Limit (istek/dakika)
                      </label>
                      <input
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => handleChange('apiRateLimit', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">Cache Sistemi</p>
                        <p className="text-sm text-gray-600">API yanıtlarını önbellekle</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.apiCacheEnabled}
                        onChange={(e) => handleChange('apiCacheEnabled', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cache Süresi (saniye)
                      </label>
                      <input
                        type="number"
                        value={settings.apiCacheDuration}
                        onChange={(e) => handleChange('apiCacheDuration', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        disabled={!settings.apiCacheEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Yedekleme Ayarları */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Yedekleme Ayarları</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">Otomatik Yedekleme</p>
                        <p className="text-sm text-gray-600">Düzenli aralıklarla otomatik yedek al</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleChange('autoBackup', e.target.checked)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </label>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Yedekleme Sıklığı
                      </label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleChange('backupFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        disabled={!settings.autoBackup}
                      >
                        <option value="hourly">Saatlik</option>
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="monthly">Aylık</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Yedek Saklama Süresi (gün)
                      </label>
                      <input
                        type="number"
                        value={settings.backupRetention}
                        onChange={(e) => handleChange('backupRetention', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        Manuel Yedek Al
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Yedekleri Görüntüle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
