import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import {
  Save, Eye, ArrowLeft, Upload, X, Check, AlertCircle, Loader,
  Search, Target, BarChart3, FileText, Globe, Hash, Link2,
  ChevronDown, ChevronUp, Zap, Award, AlertTriangle, Info,
  Type, AlignLeft, List, Quote, Bold, Italic, Heading2, Heading3,
  Image as ImageIcon, Code, Minus, Plus, HelpCircle, RefreshCw
} from 'lucide-react'

const API_URL = '/api/admin-articles'

marked.setOptions({ breaks: true, gfm: true })

// ==================== SEO ANALİZ FONKSİYONLARI ====================

const analyzeSEO = (article) => {
  const checks = []
  const focusKw = (article.focusKeyword || '').toLowerCase().trim()
  const title = (article.seoTitle || article.title || '').toLowerCase()
  const desc = (article.seoDescription || '').toLowerCase()
  const content = (article.content || '').toLowerCase()
  const slug = (article.slug || '').toLowerCase()
  const excerpt = (article.excerpt || '').toLowerCase()
  const words = content.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const headings = content.match(/^#{1,6}\s.+/gm) || []
  const h2Count = (content.match(/^##\s/gm) || []).length
  const h3Count = (content.match(/^###\s/gm) || []).length
  const internalLinks = (content.match(/\[.*?\]\(\/.*?\)/g) || []).length
  const externalLinks = (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length
  const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length

  // 1. Focus keyword varlığı
  if (focusKw) {
    // Başlıkta focus keyword
    checks.push({
      id: 'kw-title',
      label: 'Odak anahtar kelime başlıkta',
      status: title.includes(focusKw) ? 'good' : 'bad',
      tip: title.includes(focusKw)
        ? 'Odak kelime başlıkta mevcut'
        : 'Odak anahtar kelimeyi SEO başlığına ekleyin'
    })

    // Meta açıklamada
    checks.push({
      id: 'kw-desc',
      label: 'Odak anahtar kelime meta açıklamada',
      status: desc.includes(focusKw) ? 'good' : 'bad',
      tip: desc.includes(focusKw)
        ? 'Odak kelime açıklamada mevcut'
        : 'Odak kelimeyi meta açıklamaya ekleyin'
    })

    // URL/Slug'da
    const kwSlug = focusKw.replace(/\s+/g, '-')
    checks.push({
      id: 'kw-slug',
      label: 'Odak anahtar kelime URL\'de',
      status: slug.includes(kwSlug) || slug.includes(focusKw.replace(/\s+/g, '-')) ? 'good' : 'warning',
      tip: 'Odak kelime URL yapısında bulunmalı'
    })

    // İlk paragrafta
    const firstParagraph = content.split('\n').find(p => p.trim() && !p.startsWith('#'))?.toLowerCase() || ''
    checks.push({
      id: 'kw-intro',
      label: 'Odak kelime giriş paragrafında',
      status: firstParagraph.includes(focusKw) ? 'good' : 'warning',
      tip: 'İlk 150 karakterde odak kelimeyi kullanın'
    })

    // Başlıklarda (H2/H3)
    const kwInHeadings = headings.some(h => h.toLowerCase().includes(focusKw))
    checks.push({
      id: 'kw-headings',
      label: 'Odak kelime alt başlıklarda',
      status: kwInHeadings ? 'good' : 'warning',
      tip: 'H2/H3 başlıklardan en az birinde odak kelimeyi kullanın'
    })

    // Keyword density
    const kwRegex = new RegExp(focusKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const kwCount = (content.match(kwRegex) || []).length
    const density = wordCount > 0 ? ((kwCount / wordCount) * 100).toFixed(1) : 0
    checks.push({
      id: 'kw-density',
      label: `Anahtar kelime yoğunluğu: %${density}`,
      status: density >= 0.5 && density <= 3 ? 'good' : density > 3 ? 'bad' : 'warning',
      tip: 'İdeal yoğunluk %1-2 arasıdır. Aşırı kullanımdan kaçının.'
    })
  } else {
    checks.push({
      id: 'kw-missing',
      label: 'Odak anahtar kelime belirlenmemiş',
      status: 'bad',
      tip: 'SEO optimizasyonu için mutlaka bir odak anahtar kelime belirleyin'
    })
  }

  // 2. SEO Başlık analizi
  const titleLen = (article.seoTitle || '').length
  checks.push({
    id: 'title-length',
    label: `SEO başlık uzunluğu: ${titleLen}/60 karakter`,
    status: titleLen >= 30 && titleLen <= 65 ? 'good' : titleLen > 0 ? 'warning' : 'bad',
    tip: 'İdeal SEO başlık uzunluğu 50-60 karakter arasıdır'
  })

  // 3. Meta açıklama analizi
  const descLen = (article.seoDescription || '').length
  checks.push({
    id: 'desc-length',
    label: `Meta açıklama: ${descLen}/160 karakter`,
    status: descLen >= 120 && descLen <= 160 ? 'good' : descLen >= 80 ? 'warning' : 'bad',
    tip: 'İdeal meta açıklama 120-158 karakter arasıdır'
  })

  // 4. İçerik uzunluğu
  checks.push({
    id: 'content-length',
    label: `İçerik uzunluğu: ${wordCount} kelime`,
    status: wordCount >= 1500 ? 'good' : wordCount >= 800 ? 'warning' : 'bad',
    tip: 'Hukuk makaleleri için en az 1500 kelime önerilir'
  })

  // 5. Başlık yapısı
  checks.push({
    id: 'heading-structure',
    label: `Başlık yapısı: ${h2Count} H2, ${h3Count} H3`,
    status: h2Count >= 2 && h3Count >= 1 ? 'good' : h2Count >= 1 ? 'warning' : 'bad',
    tip: 'En az 2 adet H2 ve 1 adet H3 başlık kullanın'
  })

  // 6. Görsel
  checks.push({
    id: 'featured-image',
    label: 'Kapak görseli',
    status: article.image?.url ? 'good' : 'bad',
    tip: 'Sosyal medya paylaşımları ve SEO için kapak görseli ekleyin'
  })

  // 7. Görsel alt text
  if (article.image?.url) {
    checks.push({
      id: 'image-alt',
      label: 'Görsel alt metni',
      status: article.image.alternativeText ? 'good' : 'warning',
      tip: 'Görsellerinize açıklayıcı alt metin ekleyin'
    })
  }

  // 8. Slug/URL
  checks.push({
    id: 'slug',
    label: `URL uzunluğu: ${slug.length} karakter`,
    status: slug.length > 0 && slug.length <= 75 ? 'good' : slug.length > 75 ? 'warning' : 'bad',
    tip: 'URL 75 karakterden kısa olmalı ve anlam taşımalı'
  })

  // 9. Excerpt
  checks.push({
    id: 'excerpt',
    label: 'Kısa açıklama (excerpt)',
    status: excerpt.length >= 50 ? 'good' : excerpt.length > 0 ? 'warning' : 'bad',
    tip: 'Makale listelerinde gösterilen kısa açıklamayı yazın'
  })

  // 10. Anahtar kelimeler
  const kwList = (article.keywords || '').split(',').filter(k => k.trim())
  checks.push({
    id: 'keywords',
    label: `Anahtar kelimeler: ${kwList.length} adet`,
    status: kwList.length >= 3 && kwList.length <= 10 ? 'good' : kwList.length > 0 ? 'warning' : 'bad',
    tip: '3-8 arasında alakalı anahtar kelime ekleyin'
  })

  // 11. İç bağlantılar
  checks.push({
    id: 'internal-links',
    label: `İç bağlantılar: ${internalLinks} adet`,
    status: internalLinks >= 2 ? 'good' : internalLinks >= 1 ? 'warning' : 'bad',
    tip: 'Sitenizdeki diğer sayfalara bağlantı verin (en az 2)'
  })

  // 12. Dış bağlantılar
  checks.push({
    id: 'external-links',
    label: `Dış bağlantılar: ${externalLinks} adet`,
    status: externalLinks >= 1 ? 'good' : 'warning',
    tip: 'Güvenilir kaynaklara dış bağlantı ekleyin (otorite artırır)'
  })

  // 13. Paragraf uzunluğu kontrolü
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim() && !p.startsWith('#'))
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150)
  checks.push({
    id: 'paragraph-length',
    label: 'Paragraf uzunlukları',
    status: longParagraphs.length === 0 ? 'good' : 'warning',
    tip: longParagraphs.length > 0
      ? `${longParagraphs.length} paragraf çok uzun. Okunabilirlik için kısa tutun.`
      : 'Paragraf uzunlukları uygun'
  })

  // Skor hesapla
  const goodCount = checks.filter(c => c.status === 'good').length
  const totalChecks = checks.length
  const score = Math.round((goodCount / totalChecks) * 100)

  return { checks, score, wordCount, headings: { h2: h2Count, h3: h3Count }, internalLinks, externalLinks }
}

// Okuma süresi hesapla
const calculateReadTime = (content) => {
  const words = (content || '').split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} dk`
}

// ==================== ANA COMPONENT ====================

const WebAdminArticleEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'yeni'
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [notification, setNotification] = useState(null)
  const [activeTab, setActiveTab] = useState('seo') // seo, og, schema, advanced
  const [seoCollapsed, setSeoCollapsed] = useState({})

  const today = new Date().toISOString().split('T')[0]

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
    image: null,
    publishedat: today,
    // Gelişmiş SEO alanları
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    schemaType: 'Article',
    faqItems: [],
    noIndex: false,
    noFollow: false
  })

  const categories = [
    'İş Hukuku', 'Sigorta Hukuku', 'Trafik Hukuku', 'Avukatlık Ücretleri',
    'Ceza Hukuku', 'Aile Hukuku', 'Miras Hukuku', 'Ticaret Hukuku', 'Genel Hukuk'
  ]

  // SEO analiz sonuçları
  const seoAnalysis = analyzeSEO(article)

  useEffect(() => {
    if (!isNew) fetchArticle()
  }, [id])

  // Otomatik okuma süresi hesaplama
  useEffect(() => {
    const readTime = calculateReadTime(article.content)
    if (readTime !== article.readTime) {
      setArticle(prev => ({ ...prev, readTime }))
    }
  }, [article.content])

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('webAdminToken')
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      const found = (data.data || []).find(a => a.id === parseInt(id))
      if (found) {
        setArticle(found)
      } else {
        showNotif('Makale bulunamadı', 'error')
        navigate('/web-admin/makaleler')
      }
    } catch {
      showNotif('Bağlantı hatası', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
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
      slug: isNew ? generateSlug(title) : prev.slug,
      seoTitle: prev.seoTitle || title.substring(0, 60)
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setArticle(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!article.title || !article.content) {
      showNotif('Başlık ve içerik zorunludur', 'error')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('webAdminToken')
      const url = isNew ? API_URL : `${API_URL}?id=${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article)
      })

      if (res.ok) {
        const data = await res.json()
        showNotif(isNew ? 'Makale oluşturuldu! Netlify rebuild başlatıldı.' : 'Makale güncellendi!')
        if (isNew && data.id) {
          navigate(`/web-admin/makale/${data.id}`)
        }
      } else {
        const errData = await res.json()
        showNotif(errData.error || 'Kaydetme hatası', 'error')
      }
    } catch (err) {
      showNotif('Bağlantı hatası: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // Markdown toolbar
  const insertMarkdown = (syntax, placeholder = '') => {
    const textarea = document.querySelector('textarea[name="content"]')
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = article.content.substring(start, end) || placeholder

    const syntaxMap = {
      bold: `**${selectedText}**`,
      italic: `*${selectedText}*`,
      h2: `\n## ${selectedText}\n`,
      h3: `\n### ${selectedText}\n`,
      link: `[${selectedText}](url)`,
      internalLink: `[${selectedText}](/makale/slug)`,
      image: `![${selectedText}](gorsel-url)`,
      list: `\n- ${selectedText}\n- Madde 2\n- Madde 3\n`,
      orderedList: `\n1. ${selectedText}\n2. Madde 2\n3. Madde 3\n`,
      quote: `\n> ${selectedText}\n`,
      code: `\`${selectedText}\``,
      table: `\n| Başlık 1 | Başlık 2 | Başlık 3 |\n| :--- | :--- | :--- |\n| ${selectedText} | Veri | Veri |\n| Satır 2 | Veri | Veri |\n`,
      hr: `\n---\n`,
      faq: `\n## Sıkça Sorulan Sorular (SSS)\n\n**${selectedText || 'Soru 1?'}**\nCevap buraya yazılır.\n\n**Soru 2?**\nCevap buraya yazılır.\n`
    }

    const newText = syntaxMap[syntax] || selectedText
    const newContent = article.content.substring(0, start) + newText + article.content.substring(end)
    setArticle(prev => ({ ...prev, content: newContent }))
  }

  // FAQ yönetimi
  const addFaqItem = () => {
    setArticle(prev => ({
      ...prev,
      faqItems: [...(prev.faqItems || []), { question: '', answer: '' }]
    }))
  }

  const updateFaqItem = (index, field, value) => {
    setArticle(prev => {
      const items = [...(prev.faqItems || [])]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, faqItems: items }
    })
  }

  const removeFaqItem = (index) => {
    setArticle(prev => ({
      ...prev,
      faqItems: (prev.faqItems || []).filter((_, i) => i !== index)
    }))
  }

  // SEO Skor rengi
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Mükemmel' }
    if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600', label: 'İyi' }
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Orta' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Düşük' }
  }

  const scoreInfo = getScoreColor(seoAnalysis.score)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/web-admin/makaleler')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {isNew ? 'Yeni Makale Oluştur' : 'Makale Düzenle'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Gelişmiş SEO Editörü {!isNew && `• ID: ${id}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* SEO Score Badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${scoreInfo.text} bg-opacity-10 border`} style={{ borderColor: 'currentColor', backgroundColor: `${scoreInfo.bg.replace('bg-', '')}10` }}>
            <div className={`w-8 h-8 rounded-full ${scoreInfo.bg} text-white text-xs font-bold flex items-center justify-center`}>
              {seoAnalysis.score}
            </div>
            <div className="text-xs">
              <div className="font-semibold">SEO Skor</div>
              <div className="opacity-70">{scoreInfo.label}</div>
            </div>
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors text-sm ${
              showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye size={16} />
            Önizleme
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Kaydediliyor...' : 'Kaydet & Deploy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ==================== SOL PANEL - İÇERİK ==================== */}
        <div className="xl:col-span-8 space-y-4">

          {/* SERP Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search size={14} />
              Google Arama Önizlemesi
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl">
              <div className="text-sm text-green-700 truncate">
                koptay.av.tr › makale › {article.slug || 'url-slug'}
              </div>
              <div className="text-lg text-blue-800 hover:underline cursor-pointer mt-0.5 line-clamp-1 font-medium">
                {article.seoTitle || article.title || 'SEO Başlığı Girilmemiş'}
              </div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                {article.seoDescription || article.excerpt || 'Meta açıklama girilmemiş. Bu alan arama sonuçlarında gösterilecektir.'}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>Başlık: <span className={`font-medium ${(article.seoTitle || '').length > 60 ? 'text-red-500' : (article.seoTitle || '').length >= 30 ? 'text-green-500' : 'text-amber-500'}`}>{(article.seoTitle || '').length}/60</span></span>
              <span>Açıklama: <span className={`font-medium ${(article.seoDescription || '').length > 160 ? 'text-red-500' : (article.seoDescription || '').length >= 120 ? 'text-green-500' : 'text-amber-500'}`}>{(article.seoDescription || '').length}/160</span></span>
              <span>URL: <span className={`font-medium ${(article.slug || '').length > 75 ? 'text-red-500' : 'text-green-500'}`}>{(article.slug || '').length}/75</span></span>
            </div>
          </div>

          {/* Title & Slug */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Makale Başlığı *
              </label>
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleTitleChange}
                placeholder="Dikkat çekici ve SEO uyumlu bir başlık yazın..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  URL (Slug)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">/makale/</span>
                  <input
                    type="text"
                    name="slug"
                    value={article.slug}
                    onChange={handleChange}
                    placeholder="seo-uyumlu-url"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Target size={12} className="inline mr-1" />
                  Odak Anahtar Kelime
                </label>
                <input
                  type="text"
                  name="focusKeyword"
                  value={article.focusKeyword || ''}
                  onChange={handleChange}
                  placeholder="ör: araç değer kaybı"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Kısa Açıklama (Excerpt)
            </label>
            <textarea
              name="excerpt"
              value={article.excerpt}
              onChange={handleChange}
              placeholder="Makale listelerinde gösterilecek kısa özet (150-250 karakter)..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">{(article.excerpt || '').length} karakter</p>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                İçerik (Markdown) *
              </label>
              <span className="text-xs text-gray-400">
                {seoAnalysis.wordCount} kelime • {article.readTime}
              </span>
            </div>

            {/* Markdown Toolbar */}
            <div className="flex items-center gap-0.5 mb-3 p-1.5 bg-gray-50 rounded-lg flex-wrap">
              <button type="button" onClick={() => insertMarkdown('bold', 'kalın')} className="p-1.5 hover:bg-white rounded text-sm font-bold text-gray-600" title="Kalın"><Bold size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('italic', 'italik')} className="p-1.5 hover:bg-white rounded text-sm text-gray-600" title="İtalik"><Italic size={16} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('h2', 'Başlık')} className="p-1.5 hover:bg-white rounded text-xs font-bold text-gray-600" title="H2">H2</button>
              <button type="button" onClick={() => insertMarkdown('h3', 'Alt Başlık')} className="p-1.5 hover:bg-white rounded text-xs font-bold text-gray-600" title="H3">H3</button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('link', 'link metni')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Dış Link"><Link2 size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('internalLink', 'link metni')} className="p-1.5 hover:bg-white rounded text-blue-600" title="İç Link (SEO+)"><Link2 size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('image', 'açıklama')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Görsel"><ImageIcon size={16} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('list', 'Madde 1')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Sırasız Liste"><List size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('orderedList', 'Madde 1')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Sıralı Liste"><Hash size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('quote', 'Alıntı')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Alıntı"><Quote size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('table')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Tablo"><BarChart3 size={16} /></button>
              <button type="button" onClick={() => insertMarkdown('hr')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Ayırıcı"><Minus size={16} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('faq')} className="p-1.5 hover:bg-white rounded text-amber-600 text-xs font-semibold" title="SSS Bölümü (Schema)">SSS</button>
            </div>

            {showPreview ? (
              <div 
                className="prose prose-lg max-w-none min-h-[450px] p-4 border border-gray-200 rounded-xl bg-gray-50 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: marked(article.content || '*İçerik önizlemesi burada görünecek...*') }}
              />
            ) : (
              <textarea
                name="content"
                value={article.content}
                onChange={handleChange}
                placeholder="Makale içeriğini Markdown formatında yazın...&#10;&#10;## Başlık kullanarak yapılandırın&#10;&#10;İlk paragrafta odak anahtar kelimeyi kullanın.&#10;&#10;- Madde işaretleri ile okunabilirliği artırın&#10;- [İç bağlantılar](/makale/slug) ekleyin&#10;&#10;> Önemli bilgileri alıntı bloğuna alın"
                rows={22}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                required
              />
            )}
          </div>

          {/* FAQ Schema Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle size={14} />
                  SSS Schema Markup (FAQ)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Google'da zengin sonuç (rich snippet) olarak görünür</p>
              </div>
              <button
                type="button"
                onClick={addFaqItem}
                className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus size={14} />
                Soru Ekle
              </button>
            </div>

            {(article.faqItems || []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Henüz SSS eklenmedi. Google zengin sonuçlar için soru-cevap ekleyin.
              </p>
            ) : (
              <div className="space-y-3">
                {(article.faqItems || []).map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-400 mt-1">S{index + 1}</span>
                      <input
                        value={faq.question}
                        onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                        placeholder="Soru yazın..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                      />
                      <button onClick={() => removeFaqItem(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <X size={16} />
                      </button>
                    </div>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      placeholder="Cevap yazın..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ml-6"
                      style={{ width: 'calc(100% - 1.5rem)' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================== SAĞ PANEL - SEO & AYARLAR ==================== */}
        <div className="xl:col-span-4 space-y-4">

          {/* SEO Score Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={14} />
              SEO Analiz Skoru
            </h3>

            {/* Score Circle */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke={seoAnalysis.score >= 80 ? '#22c55e' : seoAnalysis.score >= 60 ? '#3b82f6' : seoAnalysis.score >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(seoAnalysis.score / 100) * 264} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${scoreInfo.text}`}>{seoAnalysis.score}</span>
                  <span className="text-[10px] text-gray-400">/100</span>
                </div>
              </div>
            </div>

            {/* Checks */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {seoAnalysis.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 group">
                  {check.status === 'good' ? (
                    <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  ) : check.status === 'warning' ? (
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700">{check.label}</p>
                    <p className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{check.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { key: 'seo', label: 'SEO' },
                { key: 'og', label: 'Open Graph' },
                { key: 'schema', label: 'Schema' },
                { key: 'settings', label: 'Ayarlar' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      SEO Başlığı
                      <span className={`ml-2 ${(article.seoTitle || '').length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                        {(article.seoTitle || '').length}/60
                      </span>
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={article.seoTitle}
                      onChange={handleChange}
                      placeholder="Google'da görünecek başlık"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {/* Character bar */}
                    <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (article.seoTitle || '').length > 60 ? 'bg-red-500' :
                          (article.seoTitle || '').length >= 30 ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, ((article.seoTitle || '').length / 60) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Meta Açıklama
                      <span className={`ml-2 ${(article.seoDescription || '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                        {(article.seoDescription || '').length}/160
                      </span>
                    </label>
                    <textarea
                      name="seoDescription"
                      value={article.seoDescription}
                      onChange={handleChange}
                      placeholder="Arama sonuçlarında görünecek açıklama"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (article.seoDescription || '').length > 160 ? 'bg-red-500' :
                          (article.seoDescription || '').length >= 120 ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, ((article.seoDescription || '').length / 160) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Anahtar Kelimeler
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={article.keywords}
                      onChange={handleChange}
                      placeholder="kelime1, kelime2, kelime3"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {article.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.keywords.split(',').filter(k => k.trim()).map((kw, i) => (
                          <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      name="canonicalUrl"
                      value={article.canonicalUrl || ''}
                      onChange={handleChange}
                      placeholder="https://koptay.av.tr/makale/..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Boş bırakılırsa otomatik oluşturulur</p>
                  </div>
                </>
              )}

              {/* Open Graph Tab */}
              {activeTab === 'og' && (
                <>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-600">
                      Open Graph etiketleri, sosyal medyada paylaşıldığında görselin ve metnin nasıl görüneceğini belirler.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">OG Başlık</label>
                    <input
                      type="text"
                      name="ogTitle"
                      value={article.ogTitle || ''}
                      onChange={handleChange}
                      placeholder={article.seoTitle || article.title || 'Sosyal medya başlığı'}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Boş: SEO başlığı kullanılır</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">OG Açıklama</label>
                    <textarea
                      name="ogDescription"
                      value={article.ogDescription || ''}
                      onChange={handleChange}
                      placeholder={article.seoDescription || 'Sosyal medya açıklaması'}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">OG Görsel URL</label>
                    <input
                      type="text"
                      name="ogImage"
                      value={article.ogImage || ''}
                      onChange={handleChange}
                      placeholder={article.image?.url || 'https://...'}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">İdeal: 1200x630px. Boş: Kapak görseli kullanılır</p>
                  </div>

                  {/* OG Preview */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Sosyal Medya Önizleme</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        {(article.ogImage || article.image?.url) ? (
                          <img src={article.ogImage || article.image.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-300" size={32} />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] text-gray-400 uppercase">koptay.av.tr</p>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5">
                          {article.ogTitle || article.seoTitle || article.title || 'Başlık'}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {article.ogDescription || article.seoDescription || 'Açıklama'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Schema Tipi</label>
                    <select
                      name="schemaType"
                      value={article.schemaType || 'Article'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Article">Article (Standart Makale)</option>
                      <option value="LegalService">LegalService (Hukuki Hizmet)</option>
                      <option value="HowTo">HowTo (Nasıl Yapılır)</option>
                      <option value="BlogPosting">BlogPosting (Blog Yazısı)</option>
                    </select>
                  </div>

                  {(article.faqItems || []).length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-700 flex items-center gap-1">
                        <Check size={14} />
                        FAQ Schema aktif: {article.faqItems.length} soru-cevap çifti
                      </p>
                      <p className="text-[10px] text-green-600 mt-1">
                        Bu sorular Google'da zengin sonuç olarak görünecek
                      </p>
                    </div>
                  )}

                  {/* Schema Preview */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Oluşturulacak Schema</p>
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-[10px] text-gray-600 overflow-x-auto max-h-48">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": article.schemaType || "Article",
  "headline": article.seoTitle || article.title,
  "description": article.seoDescription,
  "author": { "@type": "Person", "name": article.author },
  "datePublished": article.publishedat,
  "keywords": article.keywords,
  ...(article.faqItems?.length > 0 ? {
    "mainEntity": article.faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : {})
}, null, 2)}
                    </pre>
                  </div>
                </>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
                    <select
                      name="category"
                      value={article.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Yazar</label>
                    <input
                      type="text"
                      name="author"
                      value={article.author}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Okuma Süresi</label>
                    <input
                      type="text"
                      name="readTime"
                      value={article.readTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">İçerik uzunluğuna göre otomatik hesaplanır</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Yayın Tarihi</label>
                    <input
                      type="date"
                      name="publishedat"
                      value={article.publishedat || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Kapak Görseli</label>
                    {article.image?.url ? (
                      <div className="relative">
                        <img
                          src={article.image.url}
                          alt={article.title}
                          className="w-full h-36 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setArticle(prev => ({ ...prev, image: null }))}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                        <ImageIcon className="mx-auto mb-2 text-gray-300" size={28} />
                        <p className="text-xs text-gray-400">URL ile görsel ekleyin</p>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Görsel URL'si girin..."
                      value={article.image?.url || ''}
                      onChange={(e) => setArticle(prev => ({
                        ...prev,
                        image: e.target.value ? {
                          url: e.target.value,
                          name: 'web-upload',
                          alternativeText: prev.title
                        } : null
                      }))}
                      className="w-full px-3 py-2 mt-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Görsel Alt Text */}
                  {article.image?.url && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Görsel Alt Metni (SEO)</label>
                      <input
                        type="text"
                        value={article.image?.alternativeText || ''}
                        onChange={(e) => setArticle(prev => ({
                          ...prev,
                          image: { ...prev.image, alternativeText: e.target.value }
                        }))}
                        placeholder="Görseli tanımlayan metin"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}

                  {/* Indexing */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <p className="text-xs font-medium text-gray-600 mb-2">İndeksleme Ayarları</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="noIndex"
                        checked={article.noIndex || false}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">noindex - Google'da listeleme</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="noFollow"
                        checked={article.noFollow || false}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">nofollow - Bağlantıları takip etme</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick SEO Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1.5">
              <Zap size={14} />
              SEO İpuçları
            </h4>
            <ul className="space-y-1.5 text-[11px] text-indigo-600">
              <li>• Başlığa yıl ekleyin (2026) - güncellik sinyali</li>
              <li>• İlk 150 karakterde odak kelimeyi kullanın</li>
              <li>• En az 2 adet iç bağlantı ekleyin</li>
              <li>• SSS bölümü ekleyerek zengin sonuç elde edin</li>
              <li>• Tablolar ve listeler okuyuculuğu artırır</li>
              <li>• Hukuk makaleleri için 1500+ kelime hedefleyin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebAdminArticleEditor
