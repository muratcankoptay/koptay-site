import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calculator, Home, ChevronRight, Info, Phone, ArrowLeft, Clock, Calendar, AlertTriangle, FileText, Scale, CheckCircle, RefreshCw, Check } from 'lucide-react'
import SEO from '../components/SEO'
import { jsPDF } from 'jspdf'
import Chart from 'chart.js/auto'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { calculateInfaz, calculateInfazAdvanced, getCrimeTypeText, loadFromStorage, parseFromSearchParams, saveToStorage, serializeToSearchParams, autoDetectOffenseCategory, offenseCategoryLabel } from '../utils/infaz'
import { calculateInfazGelismis, getSucTipiSeçenekleri, validateInfazInput } from '../utils/infazEnhanced'
import { isGeminiConfigured, suggestCrimeType, analyzeLegalCase, assessRisks, suggestAlternativeScenarios } from '../services/geminiService'

const InfazYatarPage = () => {
  const defaults = useMemo(() => ({
    crimeType: 'genel',
    years: '',
    months: '',
    days: '',
    convictionDate: '',
    preTrialDays: '',
    birthDate: '', // Doğum tarihi
    gender: '', // Cinsiyet seçimi
    isPregnant: false, // Hamilelik durumu
    hasGivenBirth: false, // Doğum yapmış mı
    goodBehavior: 'evet',
    isRecidivist: false,
    // Eski format için uyumluluk
    crimeDate: '',
    startDate: '',
    age: '',
    isJuvenile: false,
    pretrialDays: '0',
    hasBirth: 'hayır'
  }), [])

  const location = useLocation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(defaults)
  const [advanced, setAdvanced] = useState(true) // Start with advanced mode for Grok features
  const [offenseHint, setOffenseHint] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [validationWarnings, setValidationWarnings] = useState([])
  
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  
  // AI Related States
  const [aiEnabled, setAiEnabled] = useState(false)
  const [crimeDescription, setCrimeDescription] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiRisks, setAiRisks] = useState([])
  const [aiScenarios, setAiScenarios] = useState([])
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Yaş hesaplama fonksiyonu
  const calculateAge = (birthDate, referenceDate = new Date()) => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const reference = new Date(referenceDate)
    let age = reference.getFullYear() - birth.getFullYear()
    const monthDiff = reference.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Formdan yaş hesapla
  const calculatedAge = useMemo(() => {
    return calculateAge(formData.birthDate, formData.convictionDate || new Date())
  }, [formData.birthDate, formData.convictionDate])

  // Çocuk hükümlü kontrolü
  const isJuvenile = calculatedAge !== null && calculatedAge < 18

  // Özel durumları otomatik belirle
  const specialConditions = useMemo(() => {
    const conditions = []
    
    if (isJuvenile) {
      conditions.push('Çocuk Hükümlü (18 yaş altı)')
    }
    
    if (formData.gender === 'kadın' && formData.isPregnant) {
      conditions.push('Hamile Kadın Hükümlü')
    }
    
    if (formData.gender === 'kadın' && formData.hasGivenBirth) {
      conditions.push('Doğum Yapmış Kadın Hükümlü')
    }
    
    if (formData.isRecidivist) {
      conditions.push('Mükerrir (Tekrar Suç İşleyen)')
    }
    
    return conditions
  }, [calculatedAge, formData.gender, formData.isPregnant, formData.hasGivenBirth, formData.isRecidivist, isJuvenile])

  // AI fonksiyonları
  useEffect(() => {
    setAiEnabled(isGeminiConfigured())
  }, [])

  const handleCrimeSuggestion = async () => {
    if (!crimeDescription.trim() || !aiEnabled) return
    
    setIsAiLoading(true)
    try {
      const suggestion = await suggestCrimeType(crimeDescription)
      setAiSuggestion(suggestion)
      
      if (suggestion.success && suggestion.crimeType) {
        // Önerilen suç türünü form'a uygula
        setFormData(prev => ({
          ...prev,
          crimeType: suggestion.crimeType
        }))
      }
    } catch (error) {
      console.error('AI Suggestion Error:', error)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleAiAnalysis = async () => {
    if (!result || !aiEnabled) return
    
    setIsAiLoading(true)
    try {
      const [analysis, risks, scenarios] = await Promise.all([
        analyzeLegalCase(formData, result),
        assessRisks(formData),
        suggestAlternativeScenarios(formData, result)
      ])
      
      setAiAnalysis(analysis)
      setAiRisks(risks.risks || [])
      setAiScenarios(scenarios.scenarios || [])
    } catch (error) {
      console.error('AI Analysis Error:', error)
    } finally {
      setIsAiLoading(false)
    }
  }
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)
  const crimeDateRef = useRef(null)
  const startDateRef = useRef(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Initialize flatpickr date pickers
  useEffect(() => {
    if (crimeDateRef.current) {
      flatpickr(crimeDateRef.current, {
        dateFormat: 'd.m.Y',
        locale: 'tr',
        onChange: (dates, dateStr) => {
          setFormData(prev => ({ ...prev, crimeDate: dates[0]?.toISOString().split('T')[0] || '' }))
        }
      })
    }
    if (startDateRef.current) {
      flatpickr(startDateRef.current, {
        dateFormat: 'd.m.Y', 
        locale: 'tr',
        onChange: (dates, dateStr) => {
          setFormData(prev => ({ ...prev, startDate: dates[0]?.toISOString().split('T')[0] || '' }))
        }
      })
    }
  }, [])

  // Initialize flatpickr date pickers
  useEffect(() => {
    if (crimeDateRef.current) {
      flatpickr(crimeDateRef.current, {
        dateFormat: 'd.m.Y',
        locale: 'tr',
        onChange: (dates, dateStr) => {
          setFormData(prev => ({ ...prev, crimeDate: dates[0]?.toISOString().split('T')[0] || '' }))
        }
      })
    }
    if (startDateRef.current) {
      flatpickr(startDateRef.current, {
        dateFormat: 'd.m.Y', 
        locale: 'tr',
        onChange: (dates, dateStr) => {
          setFormData(prev => ({ ...prev, startDate: dates[0]?.toISOString().split('T')[0] || '' }))
        }
      })
    }
  }, [])

  const onCalculate = () => {
    // Validate input first
    const validation = validateInfazInput(formData)
    setValidationErrors(validation.errors)
    setValidationWarnings(validation.warnings)
    
    if (!validation.valid) {
      return // Don't calculate if there are errors
    }
    
    setIsCalculating(true)
    setTimeout(() => {
      // Prepare enhanced form data with calculated values
      const enhancedFormData = {
        ...formData,
        age: calculatedAge, // Calculated age from birth date
        isJuvenile: isJuvenile, // Auto-determined juvenile status
        // Add other special conditions for calculation
        specialConditions: specialConditions
      }
      
      // Use the enhanced calculator
      const r = calculateInfazGelismis(enhancedFormData)
      setResult(r)
      setIsCalculating(false)
    }, 600)
  }

  // Sync from URL or localStorage on mount
  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    const fromUrl = parseFromSearchParams(sp, defaults)
    const hasQuery = Array.from(sp.keys()).length > 0
    if (hasQuery) {
      setFormData(fromUrl)
      return
    }
    // else try storage
    const stored = loadFromStorage(defaults)
    setFormData(stored)
  }, [location.search, defaults])

  // Persist to storage whenever form changes
  useEffect(() => {
    saveToStorage(formData)
  }, [formData])

  const shareLink = () => {
    const sp = serializeToSearchParams(formData)
    const url = `${window.location.origin}/hesaplama-araclari/infaz-yatar?${sp.toString()}`
    navigator.clipboard.writeText(url)
  }

  const exportPDF = () => {
    if (!result) return
    const doc = new jsPDF()
    
    // Header with logo area
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text('İNFAZ SÜRESİ HESAPLAMA RAPORU', 14, 20)
    
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text('Koptay Hukuk Bürosu - Detaylı İnfaz Hesaplama Raporu', 14, 30)
    doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 38)
    
    // Draw line
    doc.line(14, 42, 200, 42)
    
    let y = 50
    
    // === GİRİŞ BİLGİLERİ ===
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('1. GİRİŞ BİLGİLERİ', 14, y)
    y += 10
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const girisInfo = [
      `Suç Türü: ${result.sucTuru || 'Belirtilmemiş'}`,
      `Toplam Ceza Süresi: ${formData.years || 0} yıl, ${formData.months || 0} ay, ${formData.days || 0} gün`,
      `Toplam Ceza (Gün): ${result.toplamCezaGun || 0} gün`,
      `Suç Tarihi: ${formData.crimeDate || '-'}`,
      `Mahkumiyet Tarihi: ${formData.convictionDate || '-'}`,
      `İnfaz Başlangıç: ${formData.startDate || '-'}`,
      `Mahsup Günler: ${result.mahsupGun || 0} gün`
    ]
    
    girisInfo.forEach(item => {
      doc.text(`• ${item}`, 20, y)
      y += 6
    })
    y += 8
    
    // === YASAL DAYANAK ===
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('2. YASAL DAYANAK', 14, y)
    y += 10
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const yasalInfo = [
      `İnfaz Oranı: ${result.infazOrani || 'N/A'}%`,
      `Denetimli Serbestlik Süresi: ${result.denetimliSerbestlikYil || 0} yıl`,
      `Yasal Açıklama: ${result.yasalAciklama || 'CGTİK m.107 genel hükümleri uygulanmıştır.'}`
    ]
    
    if (result.leheHukmumUygulandiMi) {
      yasalInfo.push(`✓ TCK m.7 Lehe Hüküm Uygulandı: ${result.leheAciklama || ''}`)
    }
    
    yasalInfo.forEach(item => {
      const lines = doc.splitTextToSize(item, 170)
      lines.forEach(line => {
        doc.text(`• ${line}`, 20, y)
        y += 6
      })
    })
    y += 8
    
    // === TARİHLER ===
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('3. HESAPLANAN TARİHLER', 14, y)
    y += 10
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const tarihler = [
      { label: 'Hakederek Tahliye Tarihi', tarih: result.tamTahliyeTarihi || result.tahliyeDate, gun: result.toplamCezaGun },
      { label: 'Koşullu Salıverilme Tarihi', tarih: result.kosulluSaliverme || result.kosulluDate, gun: result.infazSuresi },
      { label: 'Denetimli Serbestlik Tarihi', tarih: result.denetimliSerbestlik || result.dsDate, gun: result.cezaevindeGecen }
    ]
    
    if (result.acikCezaeviTarihi) {
      tarihler.push({ label: 'Açık Cezaevi Geçiş Tarihi', tarih: result.acikCezaeviTarihi, gun: result.acikGecisGunu })
    }
    
    tarihler.forEach(item => {
      doc.text(`• ${item.label}: ${item.tarih || '-'}`, 20, y)
      if (item.gun) {
        doc.text(`  (${item.gun} gün)`, 30, y + 4)
        y += 4
      }
      y += 6
    })
    y += 8
    
    // === ÖZEL DURUMLAR ===
    if (result.ozelDurumlar && result.ozelDurumlar.length > 0) {
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('4. ÖZEL DURUMLAR', 14, y)
      y += 10
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      result.ozelDurumlar.forEach(durum => {
        const lines = doc.splitTextToSize(`• ${durum}`, 170)
        lines.forEach(line => {
          doc.text(line, 20, y)
          y += 6
        })
      })
      y += 8
    }
    
    // New page if needed
    if (y > 250) {
      doc.addPage()
      y = 20
    }
    
    // === UYARILAR ===
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('5. ÖNEMLI UYARILAR', 14, y)
    y += 10
    
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    const uyarilar = [
      '• Bu hesaplama 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun\'a göre yapılmıştır.',
      '• TCK 7. madde gereği, lehe olan hükümler otomatik olarak uygulanmıştır.',
      '• Hesaplama sonuçları tahmini olup, kesin sonuç için İnfaz Hâkimliği\'ne başvurun.',
      '• Disiplin cezaları, iyi hal, hastalık durumu gibi faktörler sonuçları değiştirebilir.',
      '• Özel suç türleri ve istisnai durumlar için avukat görüşü alınız.',
      '• Bu rapor hukuki görüş niteliği taşımamaktadır.'
    ]
    
    uyarilar.forEach(uyari => {
      const lines = doc.splitTextToSize(uyari, 170)
      lines.forEach(line => {
        doc.text(line, 20, y)
        y += 5
      })
    })
    
    // Footer
    y = 280
    doc.setFontSize(8)
    doc.setFont(undefined, 'italic')
    doc.text('Koptay Hukuk Bürosu | www.koptay.av.tr | Detaylı İnfaz Hesaplama', 14, y)
    doc.text(`Rapor No: ${Date.now().toString().slice(-8)} | Sayfa 1/1`, 14, y + 6)
    
    const fileName = `infaz_raporu_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  // Initialize flatpickr date pickers
  useEffect(() => {
    if (crimeDateRef.current) {
      flatpickr(crimeDateRef.current, {
        dateFormat: 'd.m.Y',
        locale: 'tr',
        onChange: (dates, dateStr) => {
          setFormData(prev => ({ ...prev, crimeDate: dates[0]?.toISOString().split('T')[0] || '' }))
        }
      })
    }
    if (startDateRef.current) {
      flatpickr(startDateRef.current, {
        dateFormat: 'd.m.Y', 
        locale: 'tr',
        onChange: (dates, dateStr) => {
          setFormData(prev => ({ ...prev, startDate: dates[0]?.toISOString().split('T')[0] || '' }))
        }
      })
    }
  }, [])

  // Render result chart
  useEffect(() => {
    if (!result) return
    const ctx = chartRef.current?.getContext('2d')
    if (!ctx) return
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }
    
    // Calculate proper data for chart based on result type
    let yatar, denetimli, toplam
    if (advanced && result.yatar !== undefined) {
      yatar = result.yatar
      denetimli = result.denetimli || 0
      toplam = yatar + denetimli
    } else {
      yatar = result.kosullu || 0
      denetimli = Math.round((result.denetimliYears || 0) * 365)
      toplam = yatar + denetimli
    }
    
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Yatar', 'Denetimli', 'Toplam'],
        datasets: [{
          label: 'Süre (Gün)',
          data: [yatar, denetimli, toplam],
          backgroundColor: ['#007bff', '#28a745', '#ffc107']
        }]
      },
      options: { 
        responsive: true, 
        scales: { y: { beginAtZero: true } },
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'İnfaz Süresi Dağılımı' }
        }
      }
    })
  }, [result, advanced])

  const updateUrl = () => {
    const sp = serializeToSearchParams(formData)
    navigate({ search: `?${sp.toString()}` }, { replace: true })
  }

  const clearForm = () => {
    setFormData({
      crimeType: 'general_yaralama',
      years: '',
      months: '',
      days: '',
      crimeDate: '',
      startDate: '',
      mahsup: '0',
      discipline: '0',
      // Advanced defaults
      age: '',
      gender: 'erkek',
      offenseCategory: 'adi',
      recidivism: 'yok',
      goodBehavior: 'evet'
    })
    setResult(null)
  }

  return (
    <>
      <SEO 
        title="İnfaz Yatar Hesaplama: Cezaevinde Ne Kadar Kalınır? 2025 Güncel Rehber"
        description="İnfaz yatar hesaplama rehberi: Cezaevinde ne kadar kalınır, koşullu salıverilme tarihi nasıl hesaplanır? Ücretsiz infaz hesaplama aracı ve adım adım rehber. CGTİK m.107 hükümlerine göre."
        keywords="infaz yatar hesaplama, cezaevinde ne kadar kalınır, infaz süresi hesaplama, koşullu salıverilme hesaplama, denetimli serbestlik, CGTİK m.107, infaz hesaplayıcısı, ceza süresi hesaplama, tahliye tarihi hesaplama"
        url="/hesaplama-araclari/infaz-yatar"
        canonical="https://koptay.com/hesaplama-araclari/infaz-yatar"
      />
      
      {/* JSON-LD Structured Data - Article Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "İnfaz Yatar Hesaplama: Cezaevinde Ne Kadar Kalınır? 2025 Güncel Rehber",
          "description": "İnfaz yatar hesaplama rehberi: Cezaevinde ne kadar kalınır, koşullu salıverilme tarihi nasıl hesaplanır? Detaylı rehber ve ücretsiz hesaplama aracı.",
          "image": "https://koptay.com/images/infaz-yatar-hesaplama.jpg",
          "author": {
            "@type": "Organization",
            "name": "Koptay Hukuk Bürosu"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Koptay Hukuk Bürosu",
            "logo": {
              "@type": "ImageObject",
              "url": "https://koptay.com/logo.png"
            }
          },
          "datePublished": "2025-01-06",
          "dateModified": "2025-01-06",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://koptay.com/hesaplama-araclari/infaz-yatar"
          },
          "keywords": ["infaz yatar hesaplama", "cezaevinde ne kadar kalınır", "koşullu salıverilme", "denetimli serbestlik", "CGTİK"],
          "articleSection": "Ceza Hukuku",
          "inLanguage": "tr-TR"
        })}
      </script>
      
      {/* JSON-LD Structured Data - HowTo Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "İnfaz Yatar Nasıl Hesaplanır?",
          "description": "Ceza infazı süresini ve tahliye tarihini adım adım hesaplama rehberi",
          "image": "https://koptay.com/images/infaz-yatar-hesaplama.jpg",
          "totalTime": "PT5M",
          "tool": [
            {
              "@type": "HowToTool",
              "name": "İnfaz Hesaplama Aracı"
            },
            {
              "@type": "HowToTool",
              "name": "Mahkeme Kararı"
            }
          ],
          "step": [
            {
              "@type": "HowToStep",
              "name": "Toplam Ceza Süresini Belirleyin",
              "text": "Mahkeme kararındaki toplam hapis cezasını yıl, ay ve gün olarak not edin.",
              "position": 1
            },
            {
              "@type": "HowToStep",
              "name": "Mahkumiyet Tarihini Kontrol Edin",
              "text": "Kararın kesinleşme tarihini not edin. Bu tarih hangi yasal düzenlemenin uygulanacağını belirler.",
              "position": 2
            },
            {
              "@type": "HowToStep",
              "name": "Suç Türünü ve İnfaz Oranını Belirleyin",
              "text": "İşlenen suçun türüne göre uygulanacak infaz oranını tespit edin (1/2, 2/3 veya 3/4).",
              "position": 3
            },
            {
              "@type": "HowToStep",
              "name": "Koşullu Salıverilme Tarihini Hesaplayın",
              "text": "Toplam ceza günü × İnfaz Oranı = Koşullu salıverilme için gerekli gün sayısı.",
              "position": 4
            },
            {
              "@type": "HowToStep",
              "name": "Mahsup Günlerini Düşün",
              "text": "Gözaltı ve tutukluluk süresini hesaplamadan düşün. Bu süreler cezadan düşülür.",
              "position": 5
            },
            {
              "@type": "HowToStep",
              "name": "Tahliye Tarihini Belirleyin",
              "text": "İnfaz başlangıç tarihi + Koşullu salıverilme gün sayısı - Mahsup günleri = Tahmini tahliye tarihi.",
              "position": 6
            }
          ]
        })}
      </script>
      
      {/* JSON-LD Structured Data - FAQPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "İnfaz yatar hesaplama nedir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "İnfaz yatar hesaplama, bir hükümlünün ceza infaz kurumunda (cezaevinde) ne kadar süre kalacağını belirleyen hukuki bir işlemdir. Türk hukuk sisteminde, mahkeme tarafından verilen cezanın tamamı cezaevinde çekilmez; hükümlü, belirli koşulları yerine getirdiğinde koşullu salıverme ve denetimli serbestlik sisteminden yararlanabilir."
              }
            },
            {
              "@type": "Question",
              "name": "Cezaevinde ne kadar kalınır?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Cezaevinde kalma süresi, suçun türüne, işlenme tarihine ve hükümlünün kişisel durumuna göre değişir. Genel suçlar için 1/2 (50%), cinsel suçlar için 2/3 (67%), ağır suçlar için 3/4 (75%) oranında infaz uygulanır. Örneğin 10 yıl ceza alan bir hükümlü, suç türüne göre 5-7.5 yıl cezaevinde kalabilir."
              }
            },
            {
              "@type": "Question",
              "name": "Koşullu salıverme nedir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Koşullu salıverme, hükümlünün cezasının belirli bir kısmını çektikten sonra, iyi halini göstermesi halinde geri kalan cezasını cezaevi dışında geçirmesine imkan veren bir infaz kurumudur. CGTİK m.107'ye göre, suç türüne göre 1/2, 2/3 veya 3/4 oranında ceza çekildikten sonra koşullu salıverilme mümkündür."
              }
            },
            {
              "@type": "Question",
              "name": "Denetimli serbestlik nedir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Denetimli serbestlik, hükümlünün toplumsal yaşama uyumunu sağlamak amacıyla, cezasının son kısmını belirli denetim ve yükümlülükler altında geçirmesini sağlar. 30 Mart 2020 öncesi suçlar için son 3 yıl, sonrası suçlar için son 1 yıl denetimli serbestlik uygulanır."
              }
            },
            {
              "@type": "Question",
              "name": "Mahsup nedir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Mahsup, tutukluluk süresi, gözaltı süresi gibi özgürlüğü kısıtlayan tedbirlerin ceza süresinden düşülmesi işlemidir. Bu süreler infaz süresini kısaltır ve tahliye tarihini öne çeker."
              }
            },
            {
              "@type": "Question",
              "name": "30 Mart 2020 tarihi neden önemli?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Bu tarihte yapılan yasal düzenleme ile denetimli serbestlik süreleri değişmiştir. Bu tarih öncesi suçlarda 3 yıl, sonrasında ise 1 yıl denetimli serbestlik uygulanır. TCK m.7 lehe hüküm gereği, hükümlü lehine olan düzenleme geriye dönük uygulanabilir."
              }
            }
          ]
        })}
      </script>
      
      {/* JSON-LD Structured Data - WebApplication Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "İnfaz Yatar Hesaplama Aracı",
          "description": "Ceza infazı süresi, koşullu salıverilme ve denetimli serbestlik hesaplama aracı",
          "url": "https://koptay.com/hesaplama-araclari/infaz-yatar",
          "applicationCategory": "LegalApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
          },
          "featureList": [
            "İnfaz süresi hesaplama",
            "Koşullu salıverilme tarihi hesaplama",
            "Denetimli serbestlik hesaplama",
            "TCK m.7 lehe hüküm otomatiği",
            "PDF rapor indirme",
            "Mahsup günü hesaplama"
          ]
        })}
      </script>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 mt-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-blue-100 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/hesaplama-araclari" className="hover:text-white transition-colors">
              Hesaplama Araçları
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">İnfaz Süresi Hesaplama</span>
          </nav>

          <div className="max-w-4xl">
            <Clock className="w-16 h-16 mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              İnfaz Süresi Hesaplama
            </h1>
            <p className="text-xl mb-8 max-w-3xl leading-relaxed">
              Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun'a göre 
              infaz süresi, koşullu salıverme ve denetimli serbestlik hesaplaması yapın.
            </p>
          </div>
        </div>
      </section>

      {/* Makale İçeriği - SEO İçin */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <article>
              {/* Giriş */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6">İnfaz Yatar Hesaplama Nedir?</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                İnfaz yatar hesaplama, bir hükümlünün ceza infaz kurumunda (cezaevinde) ne kadar süre 
                kalacağını belirleyen hukuki bir işlemdir. Türk hukuk sisteminde, mahkeme tarafından 
                verilen cezanın tamamı cezaevinde çekilmez; hükümlü, belirli koşulları yerine getirdiğinde 
                <strong> koşullu salıverme</strong> ve <strong>denetimli serbestlik</strong> sisteminden 
                yararlanabilir.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
                <p className="text-blue-900 font-medium">
                  💡 <strong>Önemli Not:</strong> İnfaz yatar hesaplaması, 5275 sayılı Ceza ve Güvenlik 
                  Tedbirlerinin İnfazı Hakkında Kanun (CGTİK) hükümlerine göre yapılır. Bu hesaplama, 
                  hükümlünün hangi tarihte tahliye olacağını, koşullu salıverilme hakkından ne zaman 
                  yararlanabileceğini ve denetimli serbestlik süresini belirler.
                </p>
              </div>

              {/* İnfaz ve Yatar Kavramları */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">İnfaz ve Yatar Kavramları</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">İnfaz Nedir?</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>İnfaz</strong>, mahkeme tarafından verilen hapis cezasının yerine getirilmesi 
                sürecidir. İnfaz süreci, hükümlünün ceza infaz kurumuna girdiği andan itibaren başlar 
                ve cezanın tamamının çekilmesi veya koşullu salıverilme ile sona erer. İnfaz süresi, 
                suçun türüne, işlenme tarihine ve hükümlünün kişisel durumuna göre değişiklik gösterir.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Yatar Nedir?</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Yatar</strong>, hükümlünün ceza infaz kurumunda fiilen kalacağı süreyi ifade eder. 
                Mahkemece verilen toplam ceza süresi ile yatar süresi genellikle aynı değildir. Çünkü 
                Türk hukuku, iyi hal gösteren hükümlülere koşullu salıverilme ve denetimli serbestlik 
                imkanı tanır. Bu nedenle, örneğin 10 yıl hapis cezası alan bir hükümlü, suçun türüne 
                göre 5-7.5 yıl kadar cezaevinde kalabilir.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-lg">
                <p className="text-yellow-900">
                  ⚠️ <strong>Dikkat:</strong> Yatar süresi, mahsup günleri, iyi hal indirimi, 
                  disiplin cezaları gibi faktörlere bağlı olarak değişebilir. Bu nedenle kesin sonuç 
                  için mutlaka bir ceza avukatına danışmanız önerilir.
                </p>
              </div>

              {/* Cezaevinde Ne Kadar Kalınır Kriterleri */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Cezaevinde Ne Kadar Kalınır? Belirleyici Kriterler</h2>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Bir hükümlünün cezaevinde ne kadar kalacağını belirleyen birçok önemli kriter vardır. 
                Bu kriterler doğru analiz edildiğinde, tahliye tarihinin tam olarak hesaplanması mümkündür.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">1. Suçun İşlenme Tarihi</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Suçun hangi tarihte işlendiği, uygulanacak infaz rejimini belirler:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                <li><strong>30 Mart 2020 öncesi suçlar:</strong> Son 3 yıl denetimli serbestlik uygulanır</li>
                <li><strong>30 Mart 2020 sonrası suçlar:</strong> Son 1 yıl denetimli serbestlik uygulanır</li>
                <li><strong>TCK m.7 Lehe Hüküm:</strong> Hükümlü lehine olan yeni düzenlemeler geriye dönük uygulanır</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">2. Suç Türü ve İnfaz Oranı</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Suçun türü, koşullu salıverilme için gereken infaz oranını belirler:
              </p>
              
              <div className="overflow-x-auto my-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Suç Kategorisi</th>
                      <th className="px-6 py-3 text-left font-semibold">İnfaz Oranı</th>
                      <th className="px-6 py-3 text-left font-semibold">Örnekler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Genel Suçlar</td>
                      <td className="px-6 py-4 font-semibold text-green-600">1/2 (50%)</td>
                      <td className="px-6 py-4 text-sm">Hırsızlık, Dolandırıcılık, Kasten Yaralama</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Cinsel Suçlar</td>
                      <td className="px-6 py-4 font-semibold text-orange-600">2/3 (67%)</td>
                      <td className="px-6 py-4 text-sm">Cinsel İstismar, Cinsel Saldırı</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Ağır Suçlar</td>
                      <td className="px-6 py-4 font-semibold text-red-600">3/4 (75%)</td>
                      <td className="px-6 py-4 text-sm">Terör, Uyuşturucu Ticareti, Örgütlü Suç</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Müebbet Hapis</td>
                      <td className="px-6 py-4 font-semibold text-purple-600">30 yıl</td>
                      <td className="px-6 py-4 text-sm">Kasten Adam Öldürme (Ağırlaştırılmış)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">3. Özel Durumlar</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bazı özel durumlar, infaz süresini doğrudan etkiler:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                <li><strong>Çocuk Hükümlü (18 yaş altı):</strong> Daha kısa infaz oranları uygulanır</li>
                <li><strong>Hamile veya Yeni Doğum Yapmış Kadın:</strong> Erteleme veya ev hapsi mümkün olabilir</li>
                <li><strong>Mükerrir (Tekrar Suç İşleyen):</strong> Koşullu salıverilme hakkı yoktur</li>
                <li><strong>İyi Hal Şartları:</strong> Eğitim, meslek kursları, disiplin ihlali yapmama</li>
                <li><strong>Gözaltı/Tutukluluk Süresi:</strong> Ceza süresinden düşülür (mahsup)</li>
              </ul>

              {/* Adım Adım Hesaplama Rehberi */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">İnfaz Yatar Hesaplama: Adım Adım Rehber</h2>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                İnfaz yatar hesaplamasını doğru yapmak için aşağıdaki adımları takip edebilirsiniz:
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-blue-900 mb-2">📋 Adım 1: Toplam Ceza Süresini Belirleyin</h4>
                  <p className="text-blue-800">
                    Mahkeme kararındaki toplam hapis cezasını yıl, ay ve gün olarak not edin. 
                    Örnek: 5 yıl 6 ay 15 gün = 2012 gün
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-green-900 mb-2">📅 Adım 2: Mahkumiyet Tarihini Kontrol Edin</h4>
                  <p className="text-green-800">
                    Kararın kesinleşme tarihini not edin. Bu tarih, hangi yasal düzenlemenin 
                    uygulanacağını belirler (30 Mart 2020 öncesi/sonrası).
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-yellow-900 mb-2">⚖️ Adım 3: Suç Türünü ve İnfaz Oranını Belirleyin</h4>
                  <p className="text-yellow-800">
                    İşlenen suçun türüne göre uygulanacak infaz oranını tespit edin (1/2, 2/3 veya 3/4). 
                    Yukarıdaki tabloya bakarak doğru oranı seçin.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-purple-900 mb-2">🧮 Adım 4: Koşullu Salıverilme Tarihini Hesaplayın</h4>
                  <p className="text-purple-800">
                    Toplam ceza günü × İnfaz Oranı = Koşullu salıverilme için gerekli gün sayısı. 
                    Örnek: 2012 gün × 1/2 = 1006 gün (yaklaşık 2 yıl 9 ay)
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">🔢 Adım 5: Mahsup Günlerini Düşün</h4>
                  <p className="text-red-800">
                    Gözaltı ve tutukluluk süresini hesaplamadan düşün. Bu süreler cezadan düşülür ve 
                    tahliye tarihini öne çeker.
                  </p>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-indigo-900 mb-2">📆 Adım 6: Tahliye Tarihini Belirleyin</h4>
                  <p className="text-indigo-800">
                    İnfaz başlangıç tarihi + Koşullu salıverilme gün sayısı - Mahsup günleri = 
                    Tahmini tahliye tarihi. Bu tarihte hükümlü denetimli serbestliğe çıkar.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-8 rounded-xl my-8">
                <h4 className="text-2xl font-bold mb-4">💻 Otomatik Hesaplama İçin Aracımızı Kullanın</h4>
                <p className="text-lg mb-4">
                  Yukarıdaki karmaşık hesaplamaları tek tıkla yapmak için aşağıdaki hesaplama 
                  aracımızı kullanabilirsiniz. Sadece bilgileri girin, hesaplama otomatik olarak 
                  yapılsın!
                </p>
                <a 
                  href="#hesaplama-formu" 
                  className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hesaplama Aracına Git →
                </a>
              </div>

              {/* Hesaplama Aracı Kullanım İpuçları */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Hesaplama Aracı Kullanım İpuçları</h2>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                İnfaz yatar hesaplama aracımızı kullanırken aşağıdaki ipuçlarını göz önünde 
                bulundurarak daha doğru sonuçlar elde edebilirsiniz:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">✅</div>
                  <h4 className="font-bold text-gray-900 mb-2">Doğru Bilgi Girişi</h4>
                  <p className="text-gray-700 text-sm">
                    Mahkeme kararınızı yanınızda bulundurarak tüm bilgileri eksiksiz ve doğru girin. 
                    Yanlış bilgi, yanlış hesaplama sonucu verir.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">📅</div>
                  <h4 className="font-bold text-gray-900 mb-2">Tarih Kontrolü</h4>
                  <p className="text-gray-700 text-sm">
                    Suçun işlenme tarihi ve mahkumiyet tarihini karıştırmayın. Her ikisi de 
                    hesaplama için kritik öneme sahiptir.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h4 className="font-bold text-gray-900 mb-2">Suç Türü Seçimi</h4>
                  <p className="text-gray-700 text-sm">
                    Suç türünü doğru seçin. Emin değilseniz, mahkeme kararındaki TCK madde 
                    numarasına bakarak seçim yapın veya avukata danışın.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">🔢</div>
                  <h4 className="font-bold text-gray-900 mb-2">Mahsup Hesabı</h4>
                  <p className="text-gray-700 text-sm">
                    Gözaltı ve tutukluluk günlerinizi toplamayı unutmayın. Bu günler cezanızdan 
                    düşüleceği için tahliye tarihinizi öne çeker.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">👶</div>
                  <h4 className="font-bold text-gray-900 mb-2">Özel Durumlar</h4>
                  <p className="text-gray-700 text-sm">
                    18 yaş altı, hamilelik, mükerirlik gibi özel durumları mutlaka belirtin. 
                    Bu faktörler hesaplamayı doğrudan etkiler.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">⚠️</div>
                  <h4 className="font-bold text-gray-900 mb-2">Avukat Danışmanlığı</h4>
                  <p className="text-gray-700 text-sm">
                    Hesaplama aracı tahmini sonuç verir. Kesin bilgi için mutlaka bir ceza avukatına 
                    danışın ve durumunuzu detaylı inceletin.
                  </p>
                </div>
              </div>

              {/* İlgili Konular ve İç Linkler */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
                <h4 className="text-xl font-bold text-blue-900 mb-4">📚 İlgili Konular</h4>
                <p className="text-blue-800 mb-4">
                  Ceza hukuku ile ilgili diğer önemli konular hakkında bilgi almak için:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <Link 
                    to="/makaleler" 
                    className="bg-white hover:bg-blue-50 text-blue-800 px-4 py-3 rounded-lg font-medium transition-colors border border-blue-200"
                  >
                    → Ceza Hukuku Makaleleri
                  </Link>
                  <Link 
                    to="/hizmetlerimiz" 
                    className="bg-white hover:bg-blue-50 text-blue-800 px-4 py-3 rounded-lg font-medium transition-colors border border-blue-200"
                  >
                    → Ceza Avukatı Hizmetleri
                  </Link>
                  <Link 
                    to="/hesaplama-araclari/tazminat-hesaplama" 
                    className="bg-white hover:bg-blue-50 text-blue-800 px-4 py-3 rounded-lg font-medium transition-colors border border-blue-200"
                  >
                    → Tazminat Hesaplama
                  </Link>
                  <Link 
                    to="/hesaplama-araclari" 
                    className="bg-white hover:bg-blue-50 text-blue-800 px-4 py-3 rounded-lg font-medium transition-colors border border-blue-200"
                  >
                    → Diğer Hesaplama Araçları
                  </Link>
                </div>
              </div>

              {/* Sonuç ve CTA */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-xl my-12">
                <h3 className="text-2xl font-bold mb-4">🎯 Sonuç</h3>
                <p className="text-lg leading-relaxed mb-6">
                  İnfaz yatar hesaplama, ceza hukukunun en karmaşık konularından biridir. Doğru 
                  hesaplama için suç türü, işlenme tarihi, özel durumlar ve güncel mevzuat bilgisi 
                  gereklidir. Yukarıdaki rehber ve hesaplama aracımız, size genel bir fikir verecektir. 
                  Ancak kesin sonuç için mutlaka <strong>deneyimli bir ceza avukatına danışmanızı</strong> 
                  öneririz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/iletisim"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    📞 Ücretsiz Ön Görüşme
                  </Link>
                  <Link 
                    to="/makaleler"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    📚 Ceza Hukuku Makaleleri
                  </Link>
                </div>
              </div>

              {/* Uzman Görüşü Uyarısı */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 my-8">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">⚖️ Profesyonel Hukuki Destek</h4>
                    <p className="text-amber-800 mb-4">
                      Bu hesaplama aracı ve rehber, genel bilgilendirme amaçlıdır ve hukuki görüş niteliği taşımaz. 
                      Her ceza dosyası kendine özgü özellikler içerir. <strong>Avukat danışmanlığı almadan</strong> 
                      önemli kararlar vermeyin.
                    </p>
                    <ul className="text-sm text-amber-700 space-y-1 mb-4">
                      <li>✓ Dosyanızın detaylı incelenmesi</li>
                      <li>✓ İnfaz hâkimliği başvuruları</li>
                      <li>✓ Koşullu salıverme prosedürleri</li>
                      <li>✓ İyi hal belgesi hazırlama</li>
                      <li>✓ Açık cezaevi geçiş başvuruları</li>
                    </ul>
                    <Link 
                      to="/iletisim"
                      className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Hemen Avukat Desteği Alın →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Bilgilendirme Bölümü */}
      <section id="hesaplama-formu" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start space-x-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ceza İnfaz Süresi Hesaplama Aracı</h2>
                  <div className="prose max-w-none text-gray-700 space-y-4">
                    <p className="text-lg font-medium text-blue-800 bg-blue-100 p-4 rounded-lg">
                      Bu araç <strong>Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun m.107 ve m.105/A</strong> esas alınarak geliştirilmiştir.
                      <br />
                      <strong>Bilgi amaçlıdır, kesin sonuç için infaz hâkimliği ve avukatınıza başvurun.</strong>
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Suç Türlerine Göre Oranlar:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Genel Suçlar (1/2 oranı):</strong> Kasten yaralama, hırsızlık, dolandırıcılık, tehdit, zimmet</li>
                      <li><strong>Ağır Suçlar (3/4 oranı):</strong> Terör, örgütlü, uyuşturucu, cinsel suçlar</li>
                      <li><strong>Müebbet Hapis:</strong> 30 yıl infaz süresi</li>
                      <li><strong>Ağırlaştırılmış Müebbet:</strong> 36 yıl infaz süresi</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Denetimli Serbestlik Süreleri:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>30 Mart 2020 sonrası suçlar:</strong> Son 1 yıl denetimli serbestlik</li>
                      <li><strong>30 Mart 2020 öncesi suçlar:</strong> Son 3 yıl denetimli serbestlik</li>
                      <li><strong>Müebbet cezalar:</strong> Son 3 yıl denetimli serbestlik</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Mahsup Günleri:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Tutukluluk süresi</li>
                      <li>Gözaltı süresi</li>
                      <li>Diğer yasal mahsup sebepleri</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hesaplama Formu */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                  Hesaplama Formu
                </h2>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Gelişmiş İnfaz Hesaplama Aracı</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>TCK m.7 Lehe Hükümler</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Validation Errors and Warnings */}
                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-medium text-red-800">Hatalar</h4>
                      </div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {validationErrors.map((error, idx) => (
                          <li key={idx}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {validationWarnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Info className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-800">Uyarılar</h4>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {validationWarnings.map((warning, idx) => (
                          <li key={idx}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suç Türü * 
                      <span className="text-xs text-gray-500 ml-2">(Oran otomatik hesaplanır)</span>
                    </label>
                    <select
                      name="crimeType"
                      value={formData.crimeType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {/* Uluslararası Suçlar */}
                      <optgroup label="🌍 Uluslararası Suçlar">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'uluslararasi')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Kişilere Karşı Suçlar */}
                      <optgroup label="👤 Kişilere Karşı Suçlar">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'kişilere_karsi')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Cinsel Suçlar */}
                      <optgroup label="⚠️ Cinsel Suçlar">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'cinsel')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Terör ve Örgüt Suçları */}
                      <optgroup label="🔴 Terör ve Örgüt Suçları">
                        {getSucTipiSeçenekleri()
                          .filter(suc => ['terror_orgut', 'tmk'].includes(suc.kategori))
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Uyuşturucu Suçları */}
                      <optgroup label="💊 Uyuşturucu Suçları">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'uyusturucu')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Malvarlığına Karşı Suçlar */}
                      <optgroup label="💰 Malvarlığına Karşı Suçlar">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'malvarligina_karsi')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Kamu İdaresine Karşı Suçlar */}
                      <optgroup label="🏛️ Kamu İdaresine Karşı Suçlar">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'kamu_idaresi')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Devlet Güvenliği Suçları */}
                      <optgroup label="🛡️ Devlet Güvenliği Suçları">
                        {getSucTipiSeçenekleri()
                          .filter(suc => ['devlet_guvenlik', 'devlet_sirlari'].includes(suc.kategori))
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Müebbet Cezalar */}
                      <optgroup label="⚫ Müebbet Cezalar">
                        {getSucTipiSeçenekleri()
                          .filter(suc => suc.kategori === 'muebbet')
                          .map(suc => (
                            <option key={suc.value} value={suc.value}>
                              {suc.label} - {suc.oran}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Genel ve Diğer Kategoriler */}
                      {['şeref', 'ozel_hayat', 'topluma_karsi', 'cevre', 'kamu_sagligi', 'aile', 'ekonomi', 'bilişim', 'adliye', 'silah', 'kacakcilik', 'genel'].map(kategori => {
                        const filteredCrimes = getSucTipiSeçenekleri().filter(suc => suc.kategori === kategori)
                        if (filteredCrimes.length === 0) return null
                        
                        const categoryLabels = {
                          'şeref': 'Şerefe Karşı',
                          'ozel_hayat': 'Özel Hayata Karşı', 
                          'topluma_karsi': 'Topluma Karşı',
                          'cevre': 'Çevre',
                          'kamu_sagligi': 'Kamu Sağlığı',
                          'aile': 'Aile Düzenine Karşı',
                          'ekonomi': 'Ekonomi, Sanayi ve Ticaret',
                          'bilişim': 'Bilişim',
                          'adliye': 'Adliyeye Karşı',
                          'silah': 'Silah',
                          'kacakcilik': 'Kaçakçılık',
                          'genel': 'Genel Suçlar'
                        }
                        
                        return (
                          <optgroup key={kategori} label={`📋 ${categoryLabels[kategori]} Suçları`}>
                            {filteredCrimes.map(suc => (
                              <option key={suc.value} value={suc.value}>
                                {suc.label} - {suc.oran}
                              </option>
                            ))}
                          </optgroup>
                        )
                      })}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Suç türüne göre infaz oranı otomatik belirlenir. Lehe hükümler (TCK m.7) otomatik uygulanır.
                    </p>
                  </div>

                  {/* AI SUÇTURU ÖNERİSİ */}
                  {aiEnabled && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">🤖</span>
                        <h4 className="font-medium text-blue-800">AI Suç Türü Tespiti</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">BETA</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Suçu Yazınız
                          </label>
                          <textarea
                            value={crimeDescription}
                            onChange={(e) => setCrimeDescription(e.target.value)}
                            placeholder="Örn: Kişiye bıçakla saldırıp yaraladı ve cebindeki parayı aldı..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            İşlenen suçu kısaca açıklayın, AI otomatik olarak doğru suç türünü belirleyecek.
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleCrimeSuggestion}
                          disabled={!crimeDescription.trim() || isAiLoading}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {isAiLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Analiz ediliyor...</span>
                            </>
                          ) : (
                            <>
                              <span>🧠</span>
                              <span>Suç Türünü Belirle</span>
                            </>
                          )}
                        </button>

                        {aiSuggestion && (
                          <div className="mt-3">
                            {aiSuggestion.success ? (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-green-600">✅</span>
                                  <span className="font-medium text-green-800">Belirlenen Suç Türü</span>
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                    %{aiSuggestion.confidence} doğruluk
                                  </span>
                                  {aiSuggestion.modelUsed && (
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                      {aiSuggestion.modelUsed}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-green-700 mb-2">
                                  <strong>Suç Türü:</strong> {aiSuggestion.crimeType}
                                </p>
                                <p className="text-xs text-green-600">
                                  <strong>Açıklama:</strong> {aiSuggestion.explanation}
                                </p>
                                <div className="mt-2">
                                  <button
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        crimeType: aiSuggestion.crimeType
                                      }))
                                    }}
                                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-medium transition-colors"
                                  >
                                    ✅ Bu Suç Türünü Kullan
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-red-600">❌</span>
                                  <span className="font-medium text-red-800">AI Hatası</span>
                                </div>
                                <p className="text-sm text-red-700">{aiSuggestion.message}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!aiEnabled && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-yellow-600">🔑</span>
                        <span className="font-medium text-yellow-800">AI Özellikleri</span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-2">
                        AI destekli otomatik suç türü tespiti ve hukuki analiz için Google Gemini API anahtarı gerekli.
                      </p>
                      <p className="text-xs text-yellow-600">
                        API anahtarı: <code className="bg-yellow-100 px-1 rounded">.env</code> dosyasına <code className="bg-yellow-100 px-1 rounded">VITE_GEMINI_API_KEY</code> olarak ekleyin.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ceza Süresi *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          name="years"
                          value={formData.years}
                          onChange={handleInputChange}
                          placeholder="Yıl"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Yıl</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          name="months"
                          value={formData.months}
                          onChange={handleInputChange}
                          placeholder="Ay"
                          min="0"
                          max="11"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Ay</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          name="days"
                          value={formData.days}
                          onChange={handleInputChange}
                          placeholder="Gün"
                          min="0"
                          max="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Gün</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Toplam hapis cezası süresini yıl, ay ve gün olarak giriniz. Müebbet cezaları için süre girmenize gerek yok.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mahkumiyet Tarihi *
                    </label>
                    <input
                      type="date"
                      name="convictionDate"
                      value={formData.convictionDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Kararın kesinleşme tarihini giriniz. Bu tarih, hangi yasal düzenlemenin uygulanacağını belirler.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suç Tarihi *
                    </label>
                    <input
                      type="date"
                      name="crimeDate"
                      value={formData.crimeDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suçun işlendiği tarihi giriniz. Bu tarih, 30 Mart 2020 değişikliğinden yararlanma durumunu belirler.
                    </p>
                    {formData.crimeDate && new Date(formData.crimeDate) < new Date('2020-03-31') && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✅ <strong>30 Mart 2020 öncesi suç:</strong> Daha avantajlı infaz rejiminden yararlanabilir.
                        </p>
                      </div>
                    )}
                    {formData.crimeDate && new Date(formData.crimeDate) >= new Date('2020-03-31') && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          ⚠️ <strong>30 Mart 2020 sonrası suç:</strong> Yeni infaz rejimi uygulanır.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* KİŞİSEL BİLGİLER BÖLÜMÜ */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Kişisel Bilgiler</h3>
                    
                    {/* Doğum Tarihi */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doğum Tarihi
                        <span className="text-xs text-gray-500 ml-2">(Yaş otomatik hesaplanır)</span>
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {calculatedAge !== null && (
                        <p className="text-sm text-blue-600 mt-1">
                          📅 Hesaplanan yaş: {calculatedAge} yaşında
                          {isJuvenile && <span className="text-orange-600 font-medium"> (Çocuk Hükümlü)</span>}
                        </p>
                      )}
                    </div>

                    {/* Cinsiyet */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cinsiyet
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="erkek"
                            checked={formData.gender === 'erkek'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          👨 Erkek
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="kadın"
                            checked={formData.gender === 'kadın'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          👩 Kadın
                        </label>
                      </div>
                    </div>

                    {/* Kadınlar için özel durumlar */}
                    {formData.gender === 'kadın' && (
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-pink-800 mb-3">👶 Kadın Hükümlü Özel Durumları</h4>
                        
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="isPregnant"
                              checked={formData.isPregnant}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                isPregnant: e.target.checked
                              }))}
                              className="mr-2"
                            />
                            🤰 Hamile
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="hasGivenBirth"
                              checked={formData.hasGivenBirth}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                hasGivenBirth: e.target.checked
                              }))}
                              className="mr-2"
                            />
                            👶 Doğum yapmış (son 1 yıl içinde)
                          </label>
                        </div>
                        
                        <p className="text-xs text-pink-600 mt-2">
                          Bu durumlar infaz süresini ve koşulları etkileyebilir.
                        </p>
                      </div>
                    )}

                    {/* Özel Durumlar Özeti */}
                    {specialConditions.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">⚖️ Tespit Edilen Özel Durumlar:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {specialConditions.map((condition, idx) => (
                            <li key={idx}>• {condition}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-blue-600 mt-2">
                          Bu durumlar hesaplamada otomatik olarak dikkate alınacaktır.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gözaltı/Tutukluluk Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      name="preTrialDays"
                      value={formData.preTrialDays}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Varsa gözaltı ve tutukluluk günlerini giriniz"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Gözaltı ve tutukluluk süreleri cezadan düşülür.
                    </p>
                  </div>

                  {/* DİĞER ÖZEL DURUMLAR */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">⚖️ Diğer Özel Durumlar</h3>
                    
                    {/* Mükerrir */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-medium text-red-800">Tekrar Suç (Mükerrir)</h4>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isRecidivist"
                          checked={formData.isRecidivist}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            isRecidivist: e.target.checked
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-red-700">
                          🔄 Bu kişi mükerrir (daha önce suç işlemiş ve tekrar suç işlemiş) midir?
                        </span>
                      </label>
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Mükerrir hükümlüler için koşullu salıverilme uygulanmaz!
                      </p>
                    </div>

                    {/* İyi Hal */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-green-800">İyi Hal Durumu</h4>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="goodBehavior"
                            value="evet"
                            checked={formData.goodBehavior === 'evet'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          ✅ İyi hal şartlarını sağlıyor
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="goodBehavior"
                            value="hayır"
                            checked={formData.goodBehavior === 'hayır'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          ❌ İyi hal şartlarını sağlamıyor
                        </label>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        İyi hal, koşullu salıverilme için zorunlu şarttır. İyi hal şartları: eğitim, meslek öğrenme, cezaevinde disiplin ihlali yapmama vb.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Tekrar Suç</h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isRecidivist"
                          checked={formData.isRecidivist}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-blue-700">
                          Bu kişi mükerrir (tekrar suç işleyen) midir?
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Mükerrir hükümlüler için infaz oranı 3/4'tür.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Info className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Çocuk Hükümlü</h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isJuvenile"
                          checked={formData.isJuvenile}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-green-700">
                          Suç işlendiği sırada 18 yaşından küçük müydü?
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      18 yaşından küçükler için özel infaz oranları uygulanır.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={onCalculate}
                      disabled={(!formData.years && !formData.months && !formData.days) || !formData.convictionDate}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Calculator className="w-5 h-5" />
                      <span>Hesapla</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearForm}
                      className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Temizle</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sonuç Bölümü */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-green-600" />
                  Hesaplama Sonucu
                </h2>

                {!result ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                      Hesaplama yapmak için formu doldurun ve "Hesapla" butonuna tıklayın.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Ceza Süre Özeti */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">Ceza Süresi Özeti</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{formData.years || 0}</div>
                          <div className="text-sm text-blue-700">Yıl</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{formData.months || 0}</div>
                          <div className="text-sm text-blue-700">Ay</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{formData.days || 0}</div>
                          <div className="text-sm text-blue-700">Gün</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">Toplam Ceza Süresi:</span>
                          <span className="text-xl font-bold text-blue-900">{result.toplamCezaGun || 0} gün</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Hesaplama Detayları</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Suç Türü:</span>
                          <span className="font-medium text-gray-900">{result.sucTuru || result.crimeTypeText}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">İnfaz Oranı:</span>
                          <span className="font-medium text-gray-900">{result.infazOrani || result.fraction}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Denetimli serbestlik süresi:</span>
                          <span className="font-medium text-gray-900">{result.denetimliSerbestlikYil || result.denetimliYears} yıl</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Mahsup edilen günler:</span>
                          <span className="font-medium text-green-600">{result.mahsupGun || result.mahsupDays || 0} gün</span>
                        </div>
                        {result.leheHukmumUygulandiMi && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-yellow-800">TCK m.7 Lehe Hükmü Uygulandı</span>
                            </div>
                            <p className="text-xs text-yellow-700 mt-1">{result.leheAciklama}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Yasal Açıklamalar */}
                    {result.yasalAciklama && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Yasal Dayanak</h3>
                        <p className="text-sm text-blue-700">{result.yasalAciklama}</p>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-800">İnfaz Takvimi</h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="text-sm text-blue-700 hover:text-blue-900 underline"
                          >
                            Yazdır
                          </button>
                          <button
                            type="button"
                            onClick={exportPDF}
                            className="text-sm text-green-700 hover:text-green-900 underline"
                          >
                            PDF İndir
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Hakederek Tahliye Tarihi:</span>
                            <span className="font-bold text-red-900 text-lg">{result.tamTahliyeTarihi || result.tahliyeDate}</span>
                          </div>
                          <span className="text-sm text-gray-500">({result.toplamCezaGun || result.fullTerm} gün - Ceza süresinin tamamı)</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Koşullu Salıverilme Tarihi:</span>
                            <span className="font-bold text-blue-900 text-lg">{result.kosulluSaliverme || result.kosulluDate}</span>
                          </div>
                          <span className="text-sm text-gray-500">({result.infazSuresi || result.kosullu} gün - {result.infazOrani || result.fraction}% oranında)</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Denetimli Serbestlik Tarihi:</span>
                            <span className="font-bold text-green-900 text-lg">{result.denetimliSerbestlik || result.dsDate}</span>
                          </div>
                          <span className="text-sm text-gray-500">({result.cezaevindeGecen || result.denetimliS} gün - Fiilen cezaevinde)</span>
                        </div>

                        {/* Açık Cezaevi Tarihi */}
                        {result.acikCezaeviTarihi && (
                          <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">Açık Cezaevi Geçiş:</span>
                              <span className="font-bold text-yellow-900 text-lg">{result.acikCezaeviTarihi}</span>
                            </div>
                            <span className="text-sm text-gray-500">Açık cezaevine geçiş hakkı doğan tarih</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detaylı Hesaplama Tablosu */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Detaylı Hesaplama Analizi</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2 font-semibold text-gray-700">Hesaplama Adımı</th>
                              <th className="text-right py-2 font-semibold text-gray-700">Gün</th>
                              <th className="text-right py-2 font-semibold text-gray-700">Tarih</th>
                            </tr>
                          </thead>
                          <tbody className="space-y-2">
                            <tr className="border-b border-gray-200">
                              <td className="py-2 text-gray-700">Toplam Ceza Süresi</td>
                              <td className="py-2 text-right font-medium">{result.toplamCezaGun || 0}</td>
                              <td className="py-2 text-right text-gray-600">-</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 text-gray-700">Mahsup Edilen Günler</td>
                              <td className="py-2 text-right font-medium text-red-600">-{result.mahsupGun || 0}</td>
                              <td className="py-2 text-right text-gray-600">-</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 text-gray-700">Net Çekilecek Ceza</td>
                              <td className="py-2 text-right font-medium">{(result.toplamCezaGun || 0) - (result.mahsupGun || 0)}</td>
                              <td className="py-2 text-right text-gray-600">-</td>
                            </tr>
                            <tr className="border-b border-gray-200 bg-blue-50">
                              <td className="py-2 text-blue-700 font-medium">Koşullu Salıverilme ({result.infazOrani}%)</td>
                              <td className="py-2 text-right font-bold text-blue-900">{result.infazSuresi || 0}</td>
                              <td className="py-2 text-right font-bold text-blue-900">{result.kosulluSaliverme || result.kosulluDate}</td>
                            </tr>
                            <tr className="border-b border-gray-200 bg-green-50">
                              <td className="py-2 text-green-700 font-medium">Denetimli Serbestlik Başlangıcı</td>
                              <td className="py-2 text-right font-bold text-green-900">{result.cezaevindeGecen || 0}</td>
                              <td className="py-2 text-right font-bold text-green-900">{result.denetimliSerbestlik || result.dsDate}</td>
                            </tr>
                            {result.acikCezaeviTarihi && (
                              <tr className="border-b border-gray-200 bg-yellow-50">
                                <td className="py-2 text-yellow-700 font-medium">Açık Cezaevi Geçişi</td>
                                <td className="py-2 text-right font-bold text-yellow-900">{result.acikGecisGunu || 0}</td>
                                <td className="py-2 text-right font-bold text-yellow-900">{result.acikCezaeviTarihi}</td>
                              </tr>
                            )}
                            <tr className="border-b border-gray-200 bg-red-50">
                              <td className="py-2 text-red-700 font-medium">Hakederek Tahliye</td>
                              <td className="py-2 text-right font-bold text-red-900">{result.toplamCezaGun || 0}</td>
                              <td className="py-2 text-right font-bold text-red-900">{result.tamTahliyeTarihi || result.tahliyeDate}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {advanced && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-indigo-800 mb-4">Gelişmiş Sonuçlar</h3>
                        <div className="space-y-2 text-sm text-indigo-900">
                          <div className="flex justify-between"><span>Toplam Ceza (gün):</span><span>{result.toplamGun ?? '-'}</span></div>
                          <div className="flex justify-between"><span>Yatar (gün):</span><span>{result.yatar ?? '-'}</span></div>
                          <div className="flex justify-between"><span>Denetimli (gün):</span><span>{result.denetimli ?? '-'}</span></div>
                          <div className="flex justify-between"><span>Koşullu Tarih:</span><span>{result.kosulTarih ?? '-'}</span></div>
                          <div className="flex justify-between"><span>Denetimli Başlangıç:</span><span>{result.dsBaslangic ?? '-'}</span></div>
                          <div className="flex justify-between"><span>Toplam Tahliye Tarihi:</span><span>{result.toplamTahliyeTarih ?? '-'}</span></div>
                        </div>
                      </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800 mb-1">Önemli Uyarı</h4>
                          <p className="text-sm text-amber-700">
                            Bu hesaplama genel esaslara göre yapılmıştır. Suç türüne, mükerrirlik, 
                            disiplin cezası, infaz hakimliği kararları gibi faktörlere göre değişebilir.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* AI ANALİZ PANELİ */}
                    {aiEnabled && (
                      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">🤖</span>
                            <div>
                              <h3 className="text-lg font-semibold text-blue-800">AI Hukuki Analiz</h3>
                              <p className="text-sm text-blue-600">Google Gemini AI ile desteklenen profesyonel analiz</p>
                            </div>
                          </div>
                          <button
                            onClick={handleAiAnalysis}
                            disabled={isAiLoading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 disabled:transform-none"
                          >
                            {isAiLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Analiz ediliyor...</span>
                              </>
                            ) : (
                              <>
                                <span>🧠</span>
                                <span>AI Analizi Başlat</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* AI ANALİZ SONUÇLARI */}
                        {(aiAnalysis || aiRisks.length > 0 || aiScenarios.length > 0) && (
                          <div className="space-y-6">
                            
                            {/* Hukuki Analiz */}
                            {aiAnalysis && aiAnalysis.success && (
                              <div className="bg-white rounded-lg p-5 border border-blue-200">
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-blue-600">⚖️</span>
                                  <h4 className="font-semibold text-blue-800">Hukuki Değerlendirme</h4>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-700">
                                  {aiAnalysis.analysis.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-2">{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Risk Değerlendirmesi */}
                            {aiRisks.length > 0 && (
                              <div className="bg-white rounded-lg p-5 border border-orange-200">
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-orange-600">⚠️</span>
                                  <h4 className="font-semibold text-orange-800">Risk Değerlendirmesi</h4>
                                </div>
                                <div className="space-y-3">
                                  {aiRisks.map((risk, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                                      risk.level === 'YÜKSEK' ? 'bg-red-50 border-red-400' :
                                      risk.level === 'ORTA' ? 'bg-yellow-50 border-yellow-400' :
                                      'bg-green-50 border-green-400'
                                    }`}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-800">{risk.category}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          risk.level === 'YÜKSEK' ? 'bg-red-100 text-red-700' :
                                          risk.level === 'ORTA' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-green-100 text-green-700'
                                        }`}>
                                          {risk.level}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                                      <p className="text-xs text-blue-600"><strong>Öneri:</strong> {risk.recommendation}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Alternatif Senaryolar */}
                            {aiScenarios.length > 0 && (
                              <div className="bg-white rounded-lg p-5 border border-indigo-200">
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-indigo-600">🔮</span>
                                  <h4 className="font-semibold text-indigo-800">Alternatif Senaryolar</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {aiScenarios.map((scenario, idx) => (
                                    <div key={idx} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                      <h5 className="font-medium text-indigo-800 mb-2">{scenario.title}</h5>
                                      <p className="text-sm text-indigo-700 mb-2">{scenario.description}</p>
                                      <p className="text-sm text-indigo-600 mb-2"><strong>Etki:</strong> {scenario.impact}</p>
                                      {scenario.newRatio && (
                                        <div className="bg-white rounded px-2 py-1 text-xs font-medium text-indigo-800">
                                          Yeni Oran: {scenario.newRatio}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {!aiAnalysis && !isAiLoading && (
                          <div className="text-center py-8 text-blue-600">
                            <span className="text-4xl mb-2 block">🤔</span>
                            <p>AI analizi başlatmak için yukarıdaki butona tıklayın</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Chart */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Görsel Dağılım</h3>
                <canvas ref={chartRef} height="120" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sıkça Sorulan Sorular</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Koşullu salıverme nedir?</h3>
                <p className="text-gray-700">
                  Koşullu salıverme, hükümlünün cezasının belirli bir kısmını çektikten sonra, 
                  iyi halini göstermesi halinde geri kalan cezasını cezaevi dışında geçirmesine 
                  imkan veren bir infaz kurumudur.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Denetimli serbestlik nedir?</h3>
                <p className="text-gray-700">
                  Denetimli serbestlik, hükümlünün toplumsal yaşama uyumunu sağlamak amacıyla, 
                  cezasının son kısmını belirli denetim ve yükümlülükler altında geçirmesini sağlar.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mahsup nedir?</h3>
                <p className="text-gray-700">
                  Mahsup, tutukluluk süresi, gözaltı süresi gibi özgürlüğü kısıtlayan tedbirlerin 
                  ceza süresinden düşülmesi işlemidir. Bu süreler infaz süresini kısaltır.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">30 Mart 2020 tarihi neden önemli?</h3>
                <p className="text-gray-700">
                  Bu tarihte yapılan yasal düzenleme ile denetimli serbestlik süreleri değişmiştir. 
                  Bu tarih öncesi suçlarda 3 yıl, sonrasında ise 1 yıl denetimli serbestlik uygulanır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim CTA - Güçlendirilmiş */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Ana CTA */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ceza Davası İçin Profesyonel Hukuki Destek
              </h2>
              <p className="text-xl mb-2 leading-relaxed">
                İnfaz süreci karmaşık ve stresli olabilir. <strong>20+ yıllık deneyimli</strong> ceza avukatlarımızdan 
                ücretsiz ön görüşme alın.
              </p>
              <p className="text-lg opacity-90">
                📞 7/24 İletişim | 🏛️ Tüm Mahkemelerde Temsil | ⚖️ Başarı Odaklı Çözümler
              </p>
            </div>

            {/* Hizmet Kartları */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center border border-white border-opacity-20">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-bold text-lg mb-2">İnfaz Danışmanlığı</h3>
                <p className="text-sm opacity-90">
                  Koşullu salıverilme, denetimli serbestlik ve açık cezaevi başvuruları
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center border border-white border-opacity-20">
                <div className="text-4xl mb-3">⚖️</div>
                <h3 className="font-bold text-lg mb-2">Ceza Davası Savunma</h3>
                <p className="text-sm opacity-90">
                  Soruşturma ve kovuşturma aşamalarında güçlü savunma stratejileri
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center border border-white border-opacity-20">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="font-bold text-lg mb-2">7/24 Acil Destek</h3>
                <p className="text-sm opacity-90">
                  Gözaltı, tutuklama ve acil durumlarda anında müdahale
                </p>
              </div>
            </div>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/iletisim"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-lg"
              >
                <Phone className="w-6 h-6 mr-2" />
                Ücretsiz Ön Görüşme
              </Link>
              <Link 
                to="/ekibimiz"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center"
              >
                👨‍⚖️ Avukat Ekibimiz
              </Link>
              <Link 
                to="/hesaplama-araclari"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Diğer Araçlar
              </Link>
            </div>

            {/* Güven İşaretleri */}
            <div className="mt-10 pt-8 border-t border-white border-opacity-20 text-center">
              <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>20+ Yıl Deneyim</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>1000+ Başarılı Dava</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>%98 Müvekkil Memnuniyeti</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Bu hesaplama aracı CGTİK m.107 ve m.105/A hükümlerine göre hazırlanmıştır. 
            Güncel mevzuat değişiklikleri için avukatınıza danışın.
          </p>
        </div>
      </section>
    </>
  )
}

export default InfazYatarPage