import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Image as ImageIcon,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react'

const API_URL = 'http://localhost:3001/api'

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true
})

const ArticleEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'yeni'
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)

  const [article, setArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'İş Hukuku',
    author: 'Av. Murat Can Koptay',
    seoTitle: '',
    seoDescription: '',
    keywords: '',
    readTime: '5 dk',
    image: null
  })

  const categories = [
    'İş Hukuku',
    'Sigorta Hukuku',
    'Trafik Hukuku',
    'Avukatlık Ücretleri',
    'Ceza Hukuku',
    'Aile Hukuku',
    'Miras Hukuku',
    'Ticaret Hukuku',
    'Genel Hukuk'
  ]

  useEffect(() => {
    if (!isNew) {
      fetchArticle()
    }
  }, [id])

  const fetchArticle = async () => {
    try {
      const res = await fetch(`${API_URL}/articles/${id}`)
      if (res.ok) {
        const data = await res.json()
        setArticle(data)
      } else {
        showNotification('Makale bulunamadı', 'error')
        navigate('/admin/makaleler')
      }
    } catch (error) {
      showNotification('Bağlantı hatası', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setArticle(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: prev.seoTitle || title
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setArticle(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const data = await res.json()
        setArticle(prev => ({
          ...prev,
          image: {
            url: data.url,
            name: data.filename,
            alternativeText: prev.title
          }
        }))
        showNotification('Görsel yüklendi!')
      } else {
        showNotification('Görsel yüklenemedi', 'error')
      }
    } catch (error) {
      showNotification('Bağlantı hatası', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!article.title || !article.content) {
      showNotification('Başlık ve içerik zorunludur', 'error')
      return
    }

    setSaving(true)

    try {
      const url = isNew ? `${API_URL}/articles` : `${API_URL}/articles/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      })

      if (res.ok) {
        showNotification(isNew ? 'Makale oluşturuldu!' : 'Makale güncellendi!')
        if (isNew) {
          const data = await res.json()
          navigate(`/admin/makale/${data.id}`)
        }
      } else {
        showNotification('Kaydetme hatası', 'error')
      }
    } catch (error) {
      showNotification('Bağlantı hatası', 'error')
    } finally {
      setSaving(false)
    }
  }

  const insertMarkdown = (syntax, placeholder = '') => {
    const textarea = document.querySelector('textarea[name="content"]')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = article.content.substring(start, end) || placeholder
    
    let newText = ''
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText}**`
        break
      case 'italic':
        newText = `*${selectedText}*`
        break
      case 'h2':
        newText = `\n## ${selectedText}\n`
        break
      case 'h3':
        newText = `\n### ${selectedText}\n`
        break
      case 'link':
        newText = `[${selectedText}](url)`
        break
      case 'image':
        newText = `![${selectedText}](görsel-url)`
        break
      case 'list':
        newText = `\n- ${selectedText}\n- Madde 2\n- Madde 3\n`
        break
      case 'quote':
        newText = `\n> ${selectedText}\n`
        break
      default:
        newText = selectedText
    }
    
    const newContent = article.content.substring(0, start) + newText + article.content.substring(end)
    setArticle(prev => ({ ...prev, content: newContent }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/makaleler')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isNew ? 'Yeni Makale' : 'Makale Düzenle'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-500">ID: {id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye size={20} />
            Önizleme
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Makale Başlığı *
            </label>
            <input
              type="text"
              name="title"
              value={article.title}
              onChange={handleTitleChange}
              placeholder="Makale başlığını girin..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              URL: /makale/<span className="font-mono text-amber-600">{article.slug || 'otomatik-olusturulacak'}</span>
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kısa Açıklama (Excerpt)
            </label>
            <textarea
              name="excerpt"
              value={article.excerpt}
              onChange={handleChange}
              placeholder="Makalenin kısa özeti (liste görünümünde gösterilir)..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                İçerik (Markdown) *
              </label>
              {/* Markdown Toolbar */}
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => insertMarkdown('bold', 'kalın metin')} className="p-2 hover:bg-gray-100 rounded font-bold" title="Kalın">B</button>
                <button type="button" onClick={() => insertMarkdown('italic', 'italik metin')} className="p-2 hover:bg-gray-100 rounded italic" title="İtalik">I</button>
                <button type="button" onClick={() => insertMarkdown('h2', 'Başlık')} className="p-2 hover:bg-gray-100 rounded text-sm font-bold" title="Başlık 2">H2</button>
                <button type="button" onClick={() => insertMarkdown('h3', 'Alt Başlık')} className="p-2 hover:bg-gray-100 rounded text-xs font-bold" title="Başlık 3">H3</button>
                <button type="button" onClick={() => insertMarkdown('link', 'link metni')} className="p-2 hover:bg-gray-100 rounded text-blue-600" title="Link">🔗</button>
                <button type="button" onClick={() => insertMarkdown('image', 'görsel açıklama')} className="p-2 hover:bg-gray-100 rounded" title="Görsel">🖼️</button>
                <button type="button" onClick={() => insertMarkdown('list', 'Madde 1')} className="p-2 hover:bg-gray-100 rounded" title="Liste">📋</button>
                <button type="button" onClick={() => insertMarkdown('quote', 'Alıntı metni')} className="p-2 hover:bg-gray-100 rounded" title="Alıntı">💬</button>
              </div>
            </div>
            
            {showPreview ? (
              <div 
                className="prose prose-lg max-w-none min-h-[400px] p-4 border border-gray-200 rounded-lg bg-gray-50"
                dangerouslySetInnerHTML={{ __html: marked(article.content || '') }}
              />
            ) : (
              <textarea
                name="content"
                value={article.content}
                onChange={handleChange}
                placeholder="Makale içeriğini Markdown formatında yazın..."
                rows={20}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                required
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Kapak Görseli
            </label>
            
            {article.image?.url ? (
              <div className="relative">
                <img 
                  src={article.image.url.startsWith('http') ? article.image.url : `http://localhost:5173${article.image.url}`}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setArticle(prev => ({ ...prev, image: null }))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors"
              >
                {uploadingImage ? (
                  <Loader className="mx-auto mb-2 animate-spin text-amber-600" size={32} />
                ) : (
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                )}
                <p className="text-sm text-gray-500">
                  {uploadingImage ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın'}
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Manual URL input */}
            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-1">veya URL girin:</label>
              <input
                type="text"
                placeholder="https://..."
                value={article.image?.url || ''}
                onChange={(e) => setArticle(prev => ({
                  ...prev,
                  image: e.target.value ? { url: e.target.value, name: 'external' } : null
                }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Category & Meta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                name="category"
                value={article.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yazar
              </label>
              <input
                type="text"
                name="author"
                value={article.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Okuma Süresi
              </label>
              <input
                type="text"
                name="readTime"
                value={article.readTime}
                onChange={handleChange}
                placeholder="5 dk"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              🔍 SEO Ayarları
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Başlığı
              </label>
              <input
                type="text"
                name="seoTitle"
                value={article.seoTitle}
                onChange={handleChange}
                placeholder="Arama motorlarında görünecek başlık"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {article.seoTitle?.length || 0}/60 karakter
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Açıklaması
              </label>
              <textarea
                name="seoDescription"
                value={article.seoDescription}
                onChange={handleChange}
                placeholder="Arama sonuçlarında görünecek açıklama"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {article.seoDescription?.length || 0}/160 karakter
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anahtar Kelimeler
              </label>
              <input
                type="text"
                name="keywords"
                value={article.keywords}
                onChange={handleChange}
                placeholder="kelime1, kelime2, kelime3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ArticleEditor
