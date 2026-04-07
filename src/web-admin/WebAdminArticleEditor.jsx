import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import {
  Save, Eye, ArrowLeft, Upload, X, Check, AlertCircle, Loader,
  Search, Target, BarChart3, FileText, Globe, Hash, Link2,
  ChevronDown, ChevronUp, Zap, Award, AlertTriangle, Info,
  Type, AlignLeft, List, Quote, Bold, Italic,
  Image as ImageIcon, Code, Minus, Plus, HelpCircle, RefreshCw,
  Clock, Calendar, BookOpen, Send, Archive, Layers, Copy,
  Sparkles, TrendingUp, ExternalLink, Table, ListOrdered,
  Undo2, Redo2, Maximize2, Minimize2, CheckCircle2,
  BookMarked, Tag, Share2, LayoutTemplate
} from 'lucide-react'

const API_URL = '/api/admin-articles'

marked.setOptions({ breaks: true, gfm: true })

/* ==================== SEO ANALİZ ==================== */

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
  const h4Count = (content.match(/^####\s/gm) || []).length
  const internalLinks = (content.match(/\[.*?\]\(\/.*?\)/g) || []).length
  const externalLinks = (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length
  const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length
  const lists = (content.match(/^[-*]\s/gm) || []).length + (content.match(/^\d+\.\s/gm) || []).length
  const tables = (content.match(/\|.*\|/gm) || []).length
  const blockquotes = (content.match(/^>\s/gm) || []).length

  if (focusKw) {
    checks.push({ id: 'kw-title', label: 'Odak anahtar kelime başlıkta', status: title.includes(focusKw) ? 'good' : 'bad', tip: title.includes(focusKw) ? 'Odak kelime başlıkta mevcut' : 'Odak anahtar kelimeyi SEO başlığına ekleyin' })
    checks.push({ id: 'kw-desc', label: 'Odak anahtar kelime meta açıklamada', status: desc.includes(focusKw) ? 'good' : 'bad', tip: desc.includes(focusKw) ? 'Odak kelime açıklamada mevcut' : 'Odak kelimeyi meta açıklamaya ekleyin' })
    const kwSlug = focusKw.replace(/\s+/g, '-')
    checks.push({ id: 'kw-slug', label: 'Odak anahtar kelime URL\'de', status: slug.includes(kwSlug) ? 'good' : 'warning', tip: 'Odak kelime URL yapısında bulunmalı' })
    const firstParagraph = content.split('\n').find(p => p.trim() && !p.startsWith('#'))?.toLowerCase() || ''
    checks.push({ id: 'kw-intro', label: 'Odak kelime giriş paragrafında', status: firstParagraph.includes(focusKw) ? 'good' : 'warning', tip: 'İlk 150 karakterde odak kelimeyi kullanın' })
    const kwInHeadings = headings.some(h => h.toLowerCase().includes(focusKw))
    checks.push({ id: 'kw-headings', label: 'Odak kelime alt başlıklarda', status: kwInHeadings ? 'good' : 'warning', tip: 'H2/H3 başlıklardan en az birinde odak kelimeyi kullanın' })
    const kwRegex = new RegExp(focusKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const kwCount = (content.match(kwRegex) || []).length
    const density = wordCount > 0 ? ((kwCount / wordCount) * 100).toFixed(1) : 0
    checks.push({ id: 'kw-density', label: `Anahtar kelime yoğunluğu: %${density}`, status: density >= 0.5 && density <= 3 ? 'good' : density > 3 ? 'bad' : 'warning', tip: 'İdeal yoğunluk %1-2 arasıdır' })
    checks.push({ id: 'kw-excerpt', label: 'Odak kelime kısa açıklamada', status: excerpt.includes(focusKw) ? 'good' : 'warning', tip: 'Kısa açıklamada odak kelimeyi kullanın' })
  } else {
    checks.push({ id: 'kw-missing', label: 'Odak anahtar kelime belirlenmemiş', status: 'bad', tip: 'SEO optimizasyonu için mutlaka bir odak anahtar kelime belirleyin' })
  }

  const titleLen = (article.seoTitle || '').length
  checks.push({ id: 'title-length', label: `SEO başlık uzunluğu: ${titleLen}/60`, status: titleLen >= 30 && titleLen <= 65 ? 'good' : titleLen > 0 ? 'warning' : 'bad', tip: 'İdeal SEO başlık uzunluğu 50-60 karakter' })
  const descLen = (article.seoDescription || '').length
  checks.push({ id: 'desc-length', label: `Meta açıklama: ${descLen}/160`, status: descLen >= 120 && descLen <= 160 ? 'good' : descLen >= 80 ? 'warning' : 'bad', tip: 'İdeal meta açıklama 120-158 karakter' })
  checks.push({ id: 'content-length', label: `İçerik uzunluğu: ${wordCount} kelime`, status: wordCount >= 1500 ? 'good' : wordCount >= 800 ? 'warning' : 'bad', tip: 'Hukuk makaleleri için min 1500 kelime önerilir' })
  checks.push({ id: 'heading-structure', label: `Başlık yapısı: ${h2Count} H2, ${h3Count} H3`, status: h2Count >= 2 && h3Count >= 1 ? 'good' : h2Count >= 1 ? 'warning' : 'bad', tip: 'En az 3 H2 ve 2 H3 başlık kullanın' })
  checks.push({ id: 'featured-image', label: 'Kapak görseli', status: article.image?.url ? 'good' : 'bad', tip: 'Sosyal medya ve SEO için kapak görseli ekleyin' })
  if (article.image?.url) {
    checks.push({ id: 'image-alt', label: 'Görsel alt metni', status: article.image.alternativeText ? 'good' : 'warning', tip: 'Görsele açıklayıcı alt metin ekleyin' })
  }
  checks.push({ id: 'content-images', label: `İçerik görselleri: ${images} adet`, status: images >= 2 ? 'good' : images >= 1 ? 'warning' : 'bad', tip: 'İçeriğe en az 2 görsel ekleyin' })
  checks.push({ id: 'slug', label: `URL uzunluğu: ${slug.length} karakter`, status: slug.length > 0 && slug.length <= 75 ? 'good' : slug.length > 75 ? 'warning' : 'bad', tip: 'URL 75 karakterden kısa olmalı' })
  checks.push({ id: 'excerpt', label: 'Kısa açıklama (excerpt)', status: excerpt.length >= 50 ? 'good' : excerpt.length > 0 ? 'warning' : 'bad', tip: 'Makale listelerinde gösterilen kısa açıklamayı yazın' })
  const kwList = (article.keywords || '').split(',').filter(k => k.trim())
  checks.push({ id: 'keywords', label: `Anahtar kelimeler: ${kwList.length} adet`, status: kwList.length >= 3 && kwList.length <= 10 ? 'good' : kwList.length > 0 ? 'warning' : 'bad', tip: '3-8 alakalı anahtar kelime ekleyin' })
  checks.push({ id: 'internal-links', label: `İç bağlantılar: ${internalLinks}`, status: internalLinks >= 3 ? 'good' : internalLinks >= 1 ? 'warning' : 'bad', tip: 'Sitenizdeki diğer sayfalara en az 3 bağlantı ekleyin' })
  checks.push({ id: 'external-links', label: `Dış bağlantılar: ${externalLinks}`, status: externalLinks >= 1 ? 'good' : 'warning', tip: 'Güvenilir kaynaklara dış bağlantı ekleyin' })
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim() && !p.startsWith('#'))
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150)
  checks.push({ id: 'paragraph-length', label: 'Paragraf uzunlukları', status: longParagraphs.length === 0 ? 'good' : 'warning', tip: longParagraphs.length > 0 ? `${longParagraphs.length} paragraf çok uzun` : 'Uygun' })
  checks.push({ id: 'lists-usage', label: `Liste kullanımı: ${lists} madde`, status: lists >= 3 ? 'good' : lists >= 1 ? 'warning' : 'bad', tip: 'Maddeli listeler okunabilirliği artırır' })
  checks.push({ id: 'tables-usage', label: `Tablo kullanımı: ${tables > 0 ? 'Var' : 'Yok'}`, status: tables > 0 ? 'good' : 'warning', tip: 'Tablolar featured snippet şansını artırır' })
  checks.push({ id: 'blockquotes', label: `Alıntı blokları: ${blockquotes}`, status: blockquotes >= 1 ? 'good' : 'warning', tip: 'Önemli bilgileri alıntı bloğu ile vurgulayın' })
  checks.push({ id: 'faq-schema', label: `FAQ Schema: ${(article.faqItems || []).length} soru`, status: (article.faqItems || []).length >= 3 ? 'good' : (article.faqItems || []).length >= 1 ? 'warning' : 'bad', tip: 'En az 3 SSS ile Google zengin sonuç elde edin' })
  checks.push({ id: 'og-tags', label: 'Sosyal medya etiketleri (OG)', status: (article.ogTitle || article.seoTitle) && (article.ogDescription || article.seoDescription) ? 'good' : 'warning', tip: 'OG etiketlerini doldurun' })
  checks.push({ id: 'canonical', label: 'Canonical URL', status: article.canonicalUrl ? 'good' : 'warning', tip: 'Duplicate content sorunlarını önlemek için canonical URL belirleyin' })

  const goodCount = checks.filter(c => c.status === 'good').length
  const score = Math.round((goodCount / checks.length) * 100)
  return { checks, score, wordCount, headings: { h2: h2Count, h3: h3Count, h4: h4Count }, internalLinks, externalLinks, images, lists, tables, blockquotes, paragraphCount: paragraphs.length }
}

const analyzeReadability = (content) => {
  if (!content || content.length < 100) return { score: 0, level: 'Yetersiz içerik', color: 'gray', avgWordsPerSentence: 0, sentenceCount: 0 }
  const cleanContent = content.replace(/^#{1,6}\s.+$/gm, '').replace(/[*_`~[\]()!|>-]/g, '').trim()
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const words = cleanContent.split(/\s+/).filter(Boolean)
  const syllables = words.reduce((count, word) => {
    const vowels = word.match(/[aeıioöuü]/gi) || []
    return count + Math.max(1, vowels.length)
  }, 0)
  if (sentences.length === 0 || words.length === 0) return { score: 0, level: 'Yetersiz', color: 'gray', avgWordsPerSentence: 0, sentenceCount: 0 }
  const avgWordsPerSentence = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length
  const score = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)))
  let level, color
  if (score >= 70) { level = 'Kolay okunur'; color = 'green' }
  else if (score >= 50) { level = 'Orta düzey'; color = 'blue' }
  else if (score >= 30) { level = 'Zor'; color = 'amber' }
  else { level = 'Çok zor'; color = 'red' }
  return { score: Math.round(score), level, color, avgWordsPerSentence: Math.round(avgWordsPerSentence), sentenceCount: sentences.length }
}

const generateTOC = (content) => {
  const headings = content.match(/^#{2,4}\s.+$/gm) || []
  return headings.map(h => {
    const level = h.match(/^#+/)[0].length
    const text = h.replace(/^#+\s/, '').trim()
    const id = text.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    return { level, text, id }
  })
}

const calculateReadTime = (content) => {
  const words = (content || '').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} dk`
}

/* ==================== İÇERİK ŞABLONLARI ==================== */

const CONTENT_TEMPLATES = [
  {
    name: 'Hukuk Makalesi (Kapsamlı)',
    icon: '⚖️',
    template: `# [BAŞLIK]: 2026 Güncel Rehber

[Giriş paragrafı - Odak anahtar kelimeyi ilk cümlede kullanın.]

---

## 1. [Konu] Nedir? Temel Kavramlar

[Tanım ve kapsamı açıklayın.]

### Yasal Tanım ve Kapsamı

[Kanun maddelerine atıf yaparak tanımlayın.]

### Güncel Hukuki Durumu

[2026 itibarıyla mevcut durum ve son değişiklikler.]

---

## 2. [Konu] Şartları ve Koşulları

* **Şart 1:** Açıklama
* **Şart 2:** Açıklama
* **Şart 3:** Açıklama

### Yargıtay İçtihatları

> **Yargıtay X. Hukuk Dairesi, E. 2025/XXXX, K. 2025/XXXX:** "[İçtihat özeti]"

---

## 3. Başvuru Süreci: Adım Adım Rehber

| Adım | İşlem | Süre | Gerekli Belge |
| :--- | :--- | :--- | :--- |
| 1 | [İşlem 1] | [Süre] | [Belge] |
| 2 | [İşlem 2] | [Süre] | [Belge] |
| 3 | [İşlem 3] | [Süre] | [Belge] |

---

## 4. Hesaplama Yöntemi ve Güncel Tutarlar (2026)

[Hesaplama formülü ve güncel rakamları paylaşın.]

### Örnek Hesaplama

[Somut bir örnek üzerinden hesaplama yapın.]

---

## 5. Zamanaşımı ve Hak Düşürücü Süreler

> **Kritik Uyarı:** [Zamanaşımı süresini ve başlangıç tarihini belirtin.]

---

## Sıkça Sorulan Sorular (SSS)

**[Soru 1]?**
[Detaylı ve anlaşılır cevap.]

**[Soru 2]?**
[Detaylı ve anlaşılır cevap.]

**[Soru 3]?**
[Detaylı ve anlaşılır cevap.]

---

## Sonuç ve Uzman Değerlendirmesi

[Konuyu özetleyin, okuyucuya somut bir eylem önerisi sunun.]

*Bu makale bilgilendirme amaçlıdır. Somut hukuki sorunlarınız için bir avukattan profesyonel destek alınız.*`
  },
  {
    name: 'Yargıtay Karar Analizi',
    icon: '🔍',
    template: `# Yargıtay [Daire] Kararı Analizi: [Konu] (2026)

[Kararın pratikte ne anlama geldiğini detaylı şekilde inceliyoruz.]

---

## 1. Karar Bilgileri

| Alan | Bilgi |
| :--- | :--- |
| **Mahkeme** | Yargıtay X. Hukuk Dairesi |
| **Esas No** | 2025/XXXX |
| **Karar No** | 2025/XXXX |
| **Karar Tarihi** | XX.XX.2025 |

---

## 2. Olayın Özeti

[Davaya konu olan olayları kronolojik sırayla anlatın.]

## 3. Tarafların İddiaları

### Davacı Taraf
[Talepler ve dayanaklar]

### Davalı Taraf
[Savunma]

## 4. Yargıtay'ın Değerlendirmesi

> "[Karardan doğrudan alıntı]"

### Kritik Gerekçeler

1. [Gerekçe 1]
2. [Gerekçe 2]
3. [Gerekçe 3]

## 5. Kararın Pratikte Anlamı

[Benzer davalara etkisi, emsal niteliği.]

## Sonuç

[Kararın önemi ve uygulamada dikkat edilmesi gereken noktalar.]`
  },
  {
    name: 'Hesaplama/Araç Rehberi',
    icon: '🧮',
    template: `# [Konu] Nasıl Hesaplanır? (2026 Güncel Tablo ve Örnekler)

[Hesaplama konusu ve güncel düzenlemeleri açıklayın.]

---

## 1. [Konu] Nedir?

[Tanım ve yasal dayanak.]

## 2. Hesaplama Parametreleri

| Parametre | Açıklama | 2026 Değeri |
| :--- | :--- | :--- |
| [Parametre 1] | [Açıklama] | [Değer] |
| [Parametre 2] | [Açıklama] | [Değer] |

## 3. Hesaplama Formülü

> **Formül:** [Hesaplama formülünü yazın]

### Örnek 1: [Senaryo]

[Adım adım hesaplama]

### Örnek 2: [Senaryo]

[Adım adım hesaplama]

## 4. Dikkat Edilmesi Gerekenler

* [Uyarı 1]
* [Uyarı 2]

## SSS

**[Soru 1]?**
[Cevap]

## Sonuç

[Özet ve profesyonel destek önerisi.]`
  },
  {
    name: 'Karşılaştırmalı Analiz',
    icon: '📊',
    template: `# [Konu A] vs [Konu B]: Farklar, Avantajlar ve Hangisi Seçilmeli?

[Karşılaştırmanın neden önemli olduğunu açıklayın.]

---

## Hızlı Karşılaştırma Tablosu

| Kriter | [Konu A] | [Konu B] |
| :--- | :--- | :--- |
| **Tanım** | | |
| **Yasal Dayanak** | | |
| **Süre** | | |
| **Maliyet** | | |

---

## 1. [Konu A] Detaylı İnceleme

### Avantajları
- [Avantaj 1]
- [Avantaj 2]

### Dezavantajları
- [Dezavantaj 1]

---

## 2. [Konu B] Detaylı İnceleme

### Avantajları
- [Avantaj 1]

### Dezavantajları
- [Dezavantaj 1]

---

## Hangi Durumda Hangisi Tercih Edilmeli?

[Somut senaryolar ve tavsiyeler]

## Sonuç

[Karşılaştırma özeti ve tavsiye.]`
  }
]

/* ==================== ANA COMPONENT ==================== */

const WebAdminArticleEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'yeni'
  const contentRef = useRef(null)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [activeTab, setActiveTab] = useState('seo')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showTOC, setShowTOC] = useState(false)
  const [allArticles, setAllArticles] = useState([])
  const [contentHistory, setContentHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [lastSaved, setLastSaved] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const [article, setArticle] = useState({
    title: '', slug: '', excerpt: '', content: '',
    category: 'İş Hukuku', author: 'Av. Murat Can Koptay',
    seoTitle: '', seoDescription: '', keywords: '',
    readTime: '5 dk', image: null, publishedat: today,
    status: 'draft', focusKeyword: '',
    ogTitle: '', ogDescription: '', ogImage: '',
    canonicalUrl: '', schemaType: 'Article',
    faqItems: [], noIndex: false, noFollow: false,
    relatedArticles: [], tags: ''
  })

  const categories = [
    'İş Hukuku', 'Sigorta Hukuku', 'Trafik Hukuku', 'Avukatlık Ücretleri',
    'Ceza Hukuku', 'Aile Hukuku', 'Miras Hukuku', 'Ticaret Hukuku',
    'İcra ve İflas Hukuku', 'Tüketici Hukuku', 'İdare Hukuku', 'Genel Hukuk'
  ]

  const seoAnalysis = useMemo(() => analyzeSEO(article), [article])
  const readability = useMemo(() => analyzeReadability(article.content), [article.content])
  const toc = useMemo(() => generateTOC(article.content || ''), [article.content])
  const wordCountGoal = 1500

  useEffect(() => {
    fetchAllArticles()
    if (!isNew) fetchArticle()
  }, [id])

  useEffect(() => {
    const rt = calculateReadTime(article.content)
    if (rt !== article.readTime) setArticle(prev => ({ ...prev, readTime: rt }))
  }, [article.content])

  useEffect(() => {
    if (article.content && (contentHistory.length === 0 || contentHistory[contentHistory.length - 1] !== article.content)) {
      const timer = setTimeout(() => {
        setContentHistory(prev => [...prev.slice(-20), article.content])
        setHistoryIndex(-1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [article.content])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (article.title || article.content) {
        localStorage.setItem(`webadmin_draft_${id}`, JSON.stringify(article))
        setLastSaved(new Date())
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [article])

  useEffect(() => {
    if (isNew) {
      const savedDraft = localStorage.getItem('webadmin_draft_yeni')
      if (savedDraft) { try { const d = JSON.parse(savedDraft); if (d.title || d.content) setArticle(prev => ({ ...prev, ...d })) } catch {} }
    }
  }, [])

  const fetchAllArticles = async () => {
    try {
      const token = localStorage.getItem('webAdminToken')
      const res = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await res.json()
      setAllArticles(data.data || [])
    } catch {}
  }

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('webAdminToken')
      const res = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await res.json()
      const found = (data.data || []).find(a => a.id === parseInt(id))
      if (found) { setArticle({ ...found, status: found.status || 'published' }) }
      else { showNotif('Makale bulunamadı', 'error'); navigate('/web-admin/makaleler') }
    } catch { showNotif('Bağlantı hatası', 'error') }
    finally { setLoading(false) }
  }

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setArticle(prev => ({
      ...prev, title,
      slug: isNew ? generateSlug(title) : prev.slug,
      seoTitle: prev.seoTitle || title.substring(0, 60)
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setArticle(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async (publishStatus) => {
    if (!article.title || !article.content) { showNotif('Başlık ve içerik zorunludur', 'error'); return }
    setSaving(true)
    try {
      const token = localStorage.getItem('webAdminToken')
      const url = isNew ? API_URL : `${API_URL}?id=${id}`
      const method = isNew ? 'POST' : 'PUT'
      const payload = { ...article, status: publishStatus || article.status }
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        const statusMsg = publishStatus === 'published' ? 'yayınlandı' : publishStatus === 'draft' ? 'taslak olarak kaydedildi' : 'güncellendi'
        showNotif(`Makale ${statusMsg}!${publishStatus === 'published' ? ' Vercel rebuild başlatıldı.' : ''}`)
        localStorage.removeItem(`webadmin_draft_${id}`)
        if (isNew && data.id) navigate(`/web-admin/makale/${data.id}`)
        setArticle(prev => ({ ...prev, status: publishStatus || prev.status }))
      } else {
        const errData = await res.json().catch(() => ({}))
        showNotif(errData.error || 'Kaydetme hatası', 'error')
      }
    } catch (err) { showNotif('Bağlantı hatası: ' + err.message, 'error') }
    finally { setSaving(false) }
  }

  const insertMarkdown = (syntax, placeholder = '') => {
    const textarea = contentRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const sel = article.content.substring(start, end) || placeholder
    const map = {
      bold: `**${sel}**`, italic: `*${sel}*`,
      h2: `\n## ${sel}\n`, h3: `\n### ${sel}\n`, h4: `\n#### ${sel}\n`,
      link: `[${sel}](url)`, internalLink: `[${sel}](/makale/slug)`,
      image: `![${sel}](gorsel-url)`,
      list: `\n- ${sel}\n- Madde 2\n- Madde 3\n`,
      orderedList: `\n1. ${sel}\n2. Madde 2\n3. Madde 3\n`,
      quote: `\n> ${sel}\n`,
      legalQuote: `\n> **Yargıtay Kararı:** "${sel}"\n`,
      law: `\n> **📜 Kanun Maddesi:** ${sel}\n`,
      callout: `\n> **💡 İpucu:** ${sel}\n`,
      warning: `\n> **⚠️ Dikkat:** ${sel}\n`,
      code: `\`${sel}\``,
      table: `\n| Başlık 1 | Başlık 2 | Başlık 3 |\n| :--- | :--- | :--- |\n| ${sel} | Veri | Veri |\n| Satır 2 | Veri | Veri |\n`,
      comparisonTable: `\n| Kriter | Seçenek A | Seçenek B |\n| :--- | :--- | :--- |\n| **Tanım** | ${sel} | |\n| **Süre** | | |\n| **Maliyet** | | |\n`,
      hr: `\n---\n`,
      faq: `\n## Sıkça Sorulan Sorular (SSS)\n\n**${sel || 'Soru 1?'}**\nCevap buraya.\n\n**Soru 2?**\nCevap buraya.\n\n**Soru 3?**\nCevap buraya.\n`,
      conclusion: `\n## Sonuç ve Değerlendirme\n\n${sel || '[Konuyu özetleyin ve okuyucuya eylem önerisi sunun.]'}\n\n*Bu makale bilgilendirme amaçlıdır. Hukuki sorunlarınız için mutlaka bir avukattan profesyonel destek alınız.*\n`
    }
    const newText = map[syntax] || sel
    const newContent = article.content.substring(0, start) + newText + article.content.substring(end)
    setArticle(prev => ({ ...prev, content: newContent }))
    setTimeout(() => { if (textarea) { textarea.focus(); textarea.setSelectionRange(start + newText.length, start + newText.length) } }, 0)
  }

  const handleUndo = () => {
    if (contentHistory.length > 1) {
      const ni = historyIndex === -1 ? contentHistory.length - 2 : Math.max(0, historyIndex - 1)
      setHistoryIndex(ni)
      setArticle(prev => ({ ...prev, content: contentHistory[ni] }))
    }
  }
  const handleRedo = () => {
    if (historyIndex >= 0 && historyIndex < contentHistory.length - 1) {
      const ni = historyIndex + 1
      setHistoryIndex(ni)
      setArticle(prev => ({ ...prev, content: contentHistory[ni] }))
    }
  }

  const applyTemplate = (template) => {
    if (article.content && !window.confirm('Mevcut içerik şablonla değiştirilecek. Devam?')) return
    setArticle(prev => ({ ...prev, content: template.template }))
    setShowTemplates(false)
    showNotif(`"${template.name}" şablonu uygulandı`)
  }

  const copySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(generateSchemaJSON(), null, 2))
    showNotif('Schema JSON kopyalandı')
  }

  const generateSchemaJSON = () => ({
    "@context": "https://schema.org",
    "@type": article.schemaType || "Article",
    "headline": article.seoTitle || article.title,
    "description": article.seoDescription,
    "author": { "@type": "Person", "name": article.author },
    "publisher": { "@type": "Organization", "name": "Koptay Hukuk Bürosu" },
    "datePublished": article.publishedat,
    "dateModified": new Date().toISOString().split('T')[0],
    "keywords": article.keywords,
    "image": article.image?.url || article.ogImage,
    "url": `https://koptay.av.tr/makale/${article.slug}`,
    ...(article.faqItems?.length > 0 ? {
      "mainEntity": article.faqItems.filter(f => f.question && f.answer).map(faq => ({
        "@type": "Question", "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
      }))
    } : {})
  })

  const addFaqItem = () => setArticle(prev => ({ ...prev, faqItems: [...(prev.faqItems || []), { question: '', answer: '' }] }))
  const updateFaqItem = (i, field, value) => {
    setArticle(prev => { const items = [...(prev.faqItems || [])]; items[i] = { ...items[i], [field]: value }; return { ...prev, faqItems: items } })
  }
  const removeFaqItem = (i) => setArticle(prev => ({ ...prev, faqItems: (prev.faqItems || []).filter((_, idx) => idx !== i) }))

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Mükemmel', ring: 'ring-green-200' }
    if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600', label: 'İyi', ring: 'ring-blue-200' }
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Orta', ring: 'ring-amber-200' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Düşük', ring: 'ring-red-200' }
  }

  const scoreInfo = getScoreColor(seoAnalysis.score)
  const wordProgress = Math.min(100, (seoAnalysis.wordCount / wordCountGoal) * 100)

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
  }

  return (
    <div className={`space-y-4 ${fullscreen ? 'fixed inset-0 z-50 bg-gray-50 p-4 overflow-y-auto' : ''}`}>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          {notification.message}
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/web-admin/makaleler')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft size={22} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-800">{isNew ? 'Yeni Makale Oluştur' : 'Makale Düzenle'}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {article.status === 'published' ? '● Yayında' : '○ Taslak'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                {!isNew && <span>ID: {id}</span>}
                {lastSaved && <span>Otomatik kayıt: {lastSaved.toLocaleTimeString('tr-TR')}</span>}
                <span>{seoAnalysis.wordCount} kelime</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${scoreInfo.ring} ${scoreInfo.text} bg-white`}>
              <div className={`w-9 h-9 rounded-full ${scoreInfo.bg} text-white text-xs font-bold flex items-center justify-center`}>{seoAnalysis.score}</div>
              <div className="text-xs leading-tight"><div className="font-semibold">SEO</div><div className="opacity-70">{scoreInfo.label}</div></div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-white`}>
              <BookOpen size={16} className={`text-${readability.color}-600`} />
              <div className="text-xs leading-tight"><div className="font-semibold">{readability.score}/100</div><div className="opacity-70">{readability.level}</div></div>
            </div>
            <button onClick={() => setFullscreen(!fullscreen)} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200" title={fullscreen ? 'Normal' : 'Tam ekran'}>
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm ${showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Eye size={16} /> Önizleme
            </button>
            <button onClick={() => handleSave('draft')} disabled={saving}
              className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm font-medium disabled:opacity-50">
              <Archive size={16} /> Taslak Kaydet
            </button>
            <button onClick={() => handleSave('published')} disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-semibold disabled:opacity-50 shadow-lg shadow-green-200">
              {saving ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              {saving ? 'Kaydediliyor...' : 'Yayınla'}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== WORD COUNT PROGRESS ==================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500">Kelime Hedefi</span>
          <span className="text-xs text-gray-400">{seoAnalysis.wordCount} / {wordCountGoal} kelime</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${wordProgress >= 100 ? 'bg-green-500' : wordProgress >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
            style={{ width: `${wordProgress}%` }}></div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
          <span>📊 {seoAnalysis.headings.h2} H2 • {seoAnalysis.headings.h3} H3</span>
          <span>🔗 {seoAnalysis.internalLinks} iç • {seoAnalysis.externalLinks} dış bağlantı</span>
          <span>📝 {seoAnalysis.paragraphCount} paragraf</span>
          <span>📋 {seoAnalysis.lists} liste</span>
          <span>🖼️ {seoAnalysis.images} görsel</span>
          {readability.sentenceCount > 0 && <span>📖 Ort. {readability.avgWordsPerSentence} kelime/cümle</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ==================== SOL PANEL ==================== */}
        <div className="xl:col-span-8 space-y-4">

          {/* SERP Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search size={14} /> Google Arama Önizlemesi (SERP)
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl">
              <div className="text-sm text-green-700 truncate">koptay.av.tr › makale › {article.slug || 'url-slug'}</div>
              <div className="text-lg text-blue-800 hover:underline cursor-pointer mt-0.5 line-clamp-1 font-medium">
                {article.seoTitle || article.title || 'SEO Başlığı Girilmemiş'}
              </div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                {article.seoDescription || article.excerpt || 'Meta açıklama girilmemiş.'}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>Başlık: <span className={`font-medium ${(article.seoTitle || '').length > 60 ? 'text-red-500' : (article.seoTitle || '').length >= 30 ? 'text-green-500' : 'text-amber-500'}`}>{(article.seoTitle || '').length}/60</span></span>
              <span>Açıklama: <span className={`font-medium ${(article.seoDescription || '').length > 160 ? 'text-red-500' : (article.seoDescription || '').length >= 120 ? 'text-green-500' : 'text-amber-500'}`}>{(article.seoDescription || '').length}/160</span></span>
              <span>URL: <span className={`font-medium ${(article.slug || '').length > 75 ? 'text-red-500' : 'text-green-500'}`}>{(article.slug || '').length}/75</span></span>
            </div>
          </div>

          {/* Title & Slug & Focus Keyword */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Makale Başlığı *</label>
              <input type="text" name="title" value={article.title} onChange={handleTitleChange}
                placeholder="Dikkat çekici ve SEO uyumlu bir başlık yazın..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium" required />
              <p className="text-[11px] text-gray-400 mt-1">İpucu: Yıl ekleyin (2026), sayılar kullanın, soru formatı deneyin</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">URL (Slug)</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm whitespace-nowrap">/makale/</span>
                  <input type="text" name="slug" value={article.slug} onChange={handleChange} placeholder="seo-uyumlu-url"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><Target size={12} className="inline mr-1" />Odak Anahtar Kelime</label>
                <input type="text" name="focusKeyword" value={article.focusKeyword || ''} onChange={handleChange} placeholder="ör: araç değer kaybı"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><Tag size={12} className="inline mr-1" />Etiketler</label>
                <input type="text" name="tags" value={article.tags || ''} onChange={handleChange} placeholder="etiket1, etiket2, etiket3"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kısa Açıklama (Excerpt) *</label>
              <span className={`text-xs ${(article.excerpt || '').length > 250 ? 'text-red-500' : (article.excerpt || '').length >= 100 ? 'text-green-500' : 'text-amber-500'}`}>{(article.excerpt || '').length}/250</span>
            </div>
            <textarea name="excerpt" value={article.excerpt} onChange={handleChange}
              placeholder="Makale listelerinde ve sosyal medya paylaşımlarında gösterilecek çekici bir özet (150-250 karakter)..."
              rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          {/* Content Templates */}
          {showTemplates && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <LayoutTemplate size={16} className="text-blue-600" /> İçerik Şablonları
                </h3>
                <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTENT_TEMPLATES.map((tpl, i) => (
                  <button key={i} onClick={() => applyTemplate(tpl)}
                    className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{tpl.icon}</span>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{tpl.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{tpl.template.substring(0, 80)}...</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">İçerik (Markdown) *</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowTemplates(!showTemplates)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${showTemplates ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}>
                  <LayoutTemplate size={13} /> Şablonlar
                </button>
                <button onClick={() => setShowTOC(!showTOC)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${showTOC ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}>
                  <BookMarked size={13} /> İçindekiler
                </button>
                <span className="text-xs text-gray-400">{seoAnalysis.wordCount} kelime • {article.readTime}</span>
              </div>
            </div>

            {/* TOC */}
            {showTOC && toc.length > 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">📑 İçindekiler Tablosu ({toc.length} başlık)</h4>
                <div className="space-y-0.5">
                  {toc.map((item, i) => (
                    <div key={i} className="text-xs text-gray-600" style={{ paddingLeft: `${(item.level - 2) * 16}px` }}>
                      {item.level === 2 ? '■' : item.level === 3 ? '▪' : '•'} {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Markdown Toolbar */}
            <div className="flex items-center gap-0.5 mb-3 p-2 bg-gray-50 rounded-xl flex-wrap border border-gray-100">
              <button type="button" onClick={handleUndo} className="p-1.5 hover:bg-white rounded text-gray-400 hover:text-gray-600" title="Geri al"><Undo2 size={15} /></button>
              <button type="button" onClick={handleRedo} className="p-1.5 hover:bg-white rounded text-gray-400 hover:text-gray-600" title="İleri al"><Redo2 size={15} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('bold', 'kalın')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Kalın"><Bold size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('italic', 'italik')} className="p-1.5 hover:bg-white rounded text-gray-600" title="İtalik"><Italic size={15} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('h2', 'Başlık')} className="p-1.5 hover:bg-white rounded text-xs font-bold text-gray-600" title="H2">H2</button>
              <button type="button" onClick={() => insertMarkdown('h3', 'Alt Başlık')} className="p-1.5 hover:bg-white rounded text-xs font-bold text-gray-600" title="H3">H3</button>
              <button type="button" onClick={() => insertMarkdown('h4', 'Alt Alt Başlık')} className="p-1.5 hover:bg-white rounded text-xs font-bold text-gray-500" title="H4">H4</button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('link', 'link metni')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Dış Link"><Link2 size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('internalLink', 'içerik')} className="p-1.5 hover:bg-white rounded text-blue-500" title="İç Link (SEO+)"><ExternalLink size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('image', 'açıklama')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Görsel"><ImageIcon size={15} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('list', 'Madde 1')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Sırasız Liste"><List size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('orderedList', 'Madde 1')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Sıralı Liste"><ListOrdered size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('table')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Tablo"><Table size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('comparisonTable')} className="p-1.5 hover:bg-white rounded text-indigo-500" title="Karşılaştırma Tablosu"><BarChart3 size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('hr')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Ayırıcı"><Minus size={15} /></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('quote', 'Alıntı')} className="p-1.5 hover:bg-white rounded text-gray-600" title="Alıntı"><Quote size={15} /></button>
              <button type="button" onClick={() => insertMarkdown('legalQuote', 'Yargıtay kararı metni')} className="p-1.5 hover:bg-white rounded text-purple-500" title="Yargıtay Kararı">⚖️</button>
              <button type="button" onClick={() => insertMarkdown('law', 'Kanun maddesi')} className="p-1.5 hover:bg-white rounded text-blue-600" title="Kanun Maddesi">📜</button>
              <button type="button" onClick={() => insertMarkdown('callout', 'İpucu metni')} className="p-1.5 hover:bg-white rounded text-green-600" title="İpucu">💡</button>
              <button type="button" onClick={() => insertMarkdown('warning', 'Uyarı metni')} className="p-1.5 hover:bg-white rounded text-amber-600" title="Uyarı">⚠️</button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <button type="button" onClick={() => insertMarkdown('faq')} className="p-1.5 hover:bg-white rounded text-amber-600 text-xs font-semibold" title="SSS Bölümü">SSS</button>
              <button type="button" onClick={() => insertMarkdown('conclusion')} className="p-1.5 hover:bg-white rounded text-green-600 text-xs font-semibold" title="Sonuç Bölümü">SONUÇ</button>
            </div>

            {showPreview ? (
              <div className="prose prose-lg max-w-none min-h-[500px] p-6 border border-gray-200 rounded-xl bg-white overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: marked(article.content || '*İçerik önizlemesi burada görünecek...*') }} />
            ) : (
              <textarea ref={contentRef} name="content" value={article.content} onChange={handleChange}
                placeholder={`Makale içeriğini Markdown formatında yazın...\n\n# Ana Başlık\n\nGiriş paragrafı...\n\n---\n\n## 1. Birinci Bölüm\n\n- Madde 1\n- Madde 2\n\n> Alıntı bloğu\n\n| Kriter | Değer |\n| :--- | :--- |\n| Süre | 30 gün |`}
                rows={28} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed resize-y" required />
            )}
          </div>

          {/* FAQ Schema Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <HelpCircle size={16} className="text-amber-500" /> SSS Schema Markup (FAQ)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Google zengin sonuç (rich snippet) olarak görünür • En az 3 soru önerilir</p>
              </div>
              <button type="button" onClick={addFaqItem}
                className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium">
                <Plus size={14} /> Soru Ekle
              </button>
            </div>
            {(article.faqItems || []).length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <HelpCircle className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-sm text-gray-500 font-medium">SSS henüz eklenmedi</p>
                <p className="text-xs text-gray-400 mt-1">Google zengin sonuçlar için soru-cevap ekleyin</p>
                <button onClick={addFaqItem} className="mt-3 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">İlk Soruyu Ekle</button>
              </div>
            ) : (
              <div className="space-y-3">
                {(article.faqItems || []).map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">S{index + 1}</span>
                      <input value={faq.question} onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                        placeholder="Soru yazın..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white" />
                      <button onClick={() => removeFaqItem(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><X size={16} /></button>
                    </div>
                    <div className="ml-8">
                      <textarea value={faq.answer} onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                        placeholder="Detaylı ve anlaşılır bir cevap yazın..."
                        rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* İlişkili Makaleler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Layers size={16} className="text-indigo-500" /> İlişkili Makaleler (Internal Linking)
            </h3>
            <p className="text-xs text-gray-400 mb-3">Mevcut makalelerinize bağlantı vererek iç link ağınızı güçlendirin</p>
            {allArticles.filter(a => a.id !== parseInt(id)).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {allArticles.filter(a => a.id !== parseInt(id)).slice(0, 10).map(a => (
                  <button key={a.id} type="button" onClick={() => insertMarkdown('internalLink', a.title)}
                    className="text-left p-2.5 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-xs group">
                    <p className="font-medium text-gray-700 group-hover:text-blue-700 truncate">{a.title}</p>
                    <p className="text-gray-400 truncate">/makale/{a.slug}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">Henüz başka makale yok</p>
            )}
          </div>
        </div>

        {/* ==================== SAĞ PANEL ==================== */}
        <div className="xl:col-span-4 space-y-4">

          {/* SEO Score Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Award size={14} /> SEO Analiz Skoru</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#e5e7eb" strokeWidth="7" fill="none" />
                  <circle cx="50" cy="50" r="42"
                    stroke={seoAnalysis.score >= 80 ? '#22c55e' : seoAnalysis.score >= 60 ? '#3b82f6' : seoAnalysis.score >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="7" fill="none"
                    strokeDasharray={`${(seoAnalysis.score / 100) * 264} 264`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${scoreInfo.text}`}>{seoAnalysis.score}</span>
                  <span className="text-[10px] text-gray-400">{scoreInfo.label}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded-lg"><p className="text-lg font-bold text-green-600">{seoAnalysis.checks.filter(c => c.status === 'good').length}</p><p className="text-[10px] text-green-500">İyi</p></div>
              <div className="text-center p-2 bg-amber-50 rounded-lg"><p className="text-lg font-bold text-amber-600">{seoAnalysis.checks.filter(c => c.status === 'warning').length}</p><p className="text-[10px] text-amber-500">Uyarı</p></div>
              <div className="text-center p-2 bg-red-50 rounded-lg"><p className="text-lg font-bold text-red-600">{seoAnalysis.checks.filter(c => c.status === 'bad').length}</p><p className="text-[10px] text-red-500">Hata</p></div>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {seoAnalysis.checks.filter(c => c.status === 'bad').map((ch) => (
                <div key={ch.id} className="flex items-start gap-2 py-1.5 px-2 rounded-lg bg-red-50/50 border border-red-100">
                  <X size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-[11px] text-gray-700 font-medium">{ch.label}</p><p className="text-[10px] text-gray-400">{ch.tip}</p></div>
                </div>
              ))}
              {seoAnalysis.checks.filter(c => c.status === 'warning').map((ch) => (
                <div key={ch.id} className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-amber-50/50">
                  <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-[11px] text-gray-700">{ch.label}</p><p className="text-[10px] text-gray-400">{ch.tip}</p></div>
                </div>
              ))}
              {seoAnalysis.checks.filter(c => c.status === 'good').map((ch) => (
                <div key={ch.id} className="flex items-start gap-2 py-1 px-2 rounded-lg hover:bg-green-50/50">
                  <CheckCircle2 size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-gray-500">{ch.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { key: 'seo', label: 'SEO', icon: Search },
                { key: 'og', label: 'Sosyal', icon: Share2 },
                { key: 'schema', label: 'Schema', icon: Code },
                { key: 'settings', label: 'Ayarlar', icon: Layers }
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'}`}>
                  <tab.icon size={12} /> {tab.label}
                </button>
              ))}
            </div>
            <div className="p-4 space-y-4">
              {/* SEO Tab */}
              {activeTab === 'seo' && (<>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">SEO Başlığı <span className={`ml-1 ${(article.seoTitle || '').length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{(article.seoTitle || '').length}/60</span></label>
                  <input type="text" name="seoTitle" value={article.seoTitle} onChange={handleChange} placeholder="Google'da görünecek başlık"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${(article.seoTitle || '').length > 60 ? 'bg-red-500' : (article.seoTitle || '').length >= 30 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, ((article.seoTitle || '').length / 60) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Meta Açıklama <span className={`ml-1 ${(article.seoDescription || '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{(article.seoDescription || '').length}/160</span></label>
                  <textarea name="seoDescription" value={article.seoDescription} onChange={handleChange} placeholder="Arama sonuçlarında görünecek açıklama" rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${(article.seoDescription || '').length > 160 ? 'bg-red-500' : (article.seoDescription || '').length >= 120 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, ((article.seoDescription || '').length / 160) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Anahtar Kelimeler</label>
                  <input type="text" name="keywords" value={article.keywords} onChange={handleChange} placeholder="virgülle ayırın: trafik kazası, tazminat, avukat"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  {article.keywords && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.keywords.split(',').filter(k => k.trim()).map((kw, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{kw.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Canonical URL</label>
                  <input type="text" name="canonicalUrl" value={article.canonicalUrl || ''} onChange={handleChange} placeholder="https://koptay.av.tr/makale/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  <p className="text-[10px] text-gray-400 mt-1">Boş bırakılırsa otomatik oluşturulur</p>
                </div>
              </>)}

              {/* OG Tab */}
              {activeTab === 'og' && (<>
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-600">Sosyal medyada paylaşıldığında görselin ve metnin nasıl görüneceğini belirler.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">OG Başlık</label>
                  <input type="text" name="ogTitle" value={article.ogTitle || ''} onChange={handleChange}
                    placeholder={article.seoTitle || article.title || 'Sosyal medya başlığı'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">OG Açıklama</label>
                  <textarea name="ogDescription" value={article.ogDescription || ''} onChange={handleChange}
                    placeholder={article.seoDescription || 'Sosyal medya açıklaması'} rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">OG Görsel URL</label>
                  <input type="text" name="ogImage" value={article.ogImage || ''} onChange={handleChange}
                    placeholder="https://... (İdeal: 1200x630px)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="h-36 bg-gray-100 flex items-center justify-center">
                    {(article.ogImage || article.image?.url) ? (
                      <img src={article.ogImage || article.image.url} alt="" className="w-full h-full object-cover" />
                    ) : <ImageIcon className="text-gray-300" size={32} />}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gray-400 uppercase">koptay.av.tr</p>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{article.ogTitle || article.seoTitle || article.title || 'Başlık'}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{article.ogDescription || article.seoDescription || 'Açıklama'}</p>
                  </div>
                </div>
              </>)}

              {/* Schema Tab */}
              {activeTab === 'schema' && (<>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Schema Tipi</label>
                  <select name="schemaType" value={article.schemaType || 'Article'} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="Article">Article (Standart Makale)</option>
                    <option value="LegalService">LegalService (Hukuki Hizmet)</option>
                    <option value="HowTo">HowTo (Nasıl Yapılır)</option>
                    <option value="BlogPosting">BlogPosting (Blog Yazısı)</option>
                  </select>
                </div>
                {(article.faqItems || []).length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700 flex items-center gap-1"><Check size={14} /> FAQ Schema aktif: {article.faqItems.filter(f => f.question && f.answer).length} soru</p>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600">Schema JSON</p>
                    <button onClick={copySchema} className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1"><Copy size={12} /> Kopyala</button>
                  </div>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-[10px] text-gray-600 overflow-x-auto max-h-48">
                    {JSON.stringify(generateSchemaJSON(), null, 2)}
                  </pre>
                </div>
              </>)}

              {/* Settings Tab */}
              {activeTab === 'settings' && (<>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
                    <select name="category" value={article.category} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Durum</label>
                    <select name="status" value={article.status || 'draft'} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="draft">Taslak</option>
                      <option value="published">Yayında</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Yazar</label>
                  <input type="text" name="author" value={article.author} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Yayın Tarihi</label>
                    <input type="date" name="publishedat" value={article.publishedat || ''} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Okuma Süresi</label>
                    <input type="text" name="readTime" value={article.readTime} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Kapak Görseli</label>
                  {article.image?.url ? (
                    <div className="relative">
                      <img src={article.image.url} alt={article.title} className="w-full h-36 object-cover rounded-lg" />
                      <button type="button" onClick={() => setArticle(prev => ({ ...prev, image: null }))}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <ImageIcon className="mx-auto mb-2 text-gray-300" size={28} />
                      <p className="text-xs text-gray-400">URL ile görsel ekleyin</p>
                    </div>
                  )}
                  <input type="text" placeholder="Görsel URL'si girin..."
                    value={article.image?.url || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, image: e.target.value ? { url: e.target.value, name: 'web-upload', alternativeText: prev.title } : null }))}
                    className="w-full px-3 py-2 mt-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                {article.image?.url && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Görsel Alt Metni (SEO)</label>
                    <input type="text" value={article.image?.alternativeText || ''}
                      onChange={(e) => setArticle(prev => ({ ...prev, image: { ...prev.image, alternativeText: e.target.value } }))}
                      placeholder="Görseli tanımlayan metin"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">İndeksleme Ayarları</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="noIndex" checked={article.noIndex || false} onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs text-gray-600">noindex - Google'da listeleme</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="noFollow" checked={article.noFollow || false} onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs text-gray-600">nofollow - Bağlantıları takip etme</span>
                  </label>
                </div>
              </>)}
            </div>
          </div>

          {/* SEO Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1.5">
              <Sparkles size={14} /> SEO İpuçları ve En İyi Pratikler
            </h4>
            <ul className="space-y-1.5 text-[11px] text-indigo-600">
              <li>📅 Başlığa yıl ekleyin (2026) - güncellik sinyali</li>
              <li>🎯 İlk 150 karakterde odak kelimeyi kullanın</li>
              <li>🔗 En az 3 iç bağlantı + 1 dış bağlantı ekleyin</li>
              <li>❓ SSS bölümü ile zengin sonuç (rich snippet) elde edin</li>
              <li>📊 Tablolar ve listeler featured snippet şansını artırır</li>
              <li>⚖️ Hukuk makaleleri için 1500+ kelime hedefleyin</li>
              <li>📜 Yargıtay kararlarına ve kanun maddelerine atıf yapın</li>
              <li>🖼️ İçeriğe en az 2 infografik/görsel ekleyin</li>
              <li>📝 Her 300 kelimede bir H2/H3 başlık kullanın</li>
              <li>🎯 Cümleleri 20 kelimeden kısa tutun (okunabilirlik)</li>
            </ul>
          </div>

          {/* Sticky Publish Buttons */}
          <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 space-y-2">
            <button onClick={() => handleSave('published')} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold text-sm disabled:opacity-50 shadow-lg">
              {saving ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              {saving ? 'Yayınlanıyor...' : 'Makaleyi Yayınla'}
            </button>
            <button onClick={() => handleSave('draft')} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 text-sm font-medium disabled:opacity-50">
              <Archive size={14} /> Taslak Olarak Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebAdminArticleEditor
