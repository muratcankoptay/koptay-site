import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3003

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}))
app.use(express.json())

// Analytics veri dosyası
const ANALYTICS_FILE = path.join(__dirname, 'analytics-data.json')

// Veri yapısını başlat
const initAnalyticsData = async () => {
  try {
    await fs.access(ANALYTICS_FILE)
  } catch {
    const initialData = {
      pageViews: [],
      sessions: [],
      events: [],
      visitors: [],
      performance: []
    }
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(initialData, null, 2))
  }
}

// Veri oku
const readAnalytics = async () => {
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return {
      pageViews: [],
      sessions: [],
      events: [],
      visitors: [],
      performance: []
    }
  }
}

// Veri yaz
const writeAnalytics = async (data) => {
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2))
}

// Session oluştur
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// IP'den lokasyon tahmini (basit)
const getLocationFromIP = (ip) => {
  // Gerçek uygulamada IP geolocation API kullanılabilir
  return {
    country: 'Türkiye',
    city: 'İstanbul',
    region: 'Marmara'
  }
}

// Universal tracking endpoint (yeni - Google Analytics alternatifi)
app.post('/api/analytics/track', async (req, res) => {
  try {
    const eventData = req.body
    const { eventType, sessionId, visitorId } = eventData

    const data = await readAnalytics()
    
    // Event kaydet
    const event = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString(),
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown'
    }
    data.events.push(event)

    // Session güncelle veya oluştur
    let session = data.sessions.find(s => s.id === sessionId)
    if (!session) {
      session = {
        id: sessionId,
        visitorId,
        startTime: eventData.timestamp,
        lastActivity: eventData.timestamp,
        pageViews: [],
        events: [],
        device: eventData.device,
        referrer: eventData.referrer,
        utm: eventData.utm || {}
      }
      data.sessions.push(session)
    } else {
      session.lastActivity = eventData.timestamp
    }

    if (eventType === 'pageview') {
      session.pageViews.push(event.id)
      data.pageViews.push(event)
    }

    if (eventType === 'session_end') {
      session.duration = eventData.duration
      session.endTime = eventData.timestamp
    }

    // Visitor güncelle
    if (!data.visitors) data.visitors = []
    let visitor = data.visitors.find(v => v.id === visitorId)
    if (!visitor) {
      visitor = {
        id: visitorId,
        firstSeen: eventData.timestamp,
        lastSeen: eventData.timestamp,
        sessions: [sessionId],
        totalPageviews: 0
      }
      data.visitors.push(visitor)
    } else {
      visitor.lastSeen = eventData.timestamp
      if (!visitor.sessions.includes(sessionId)) {
        visitor.sessions.push(sessionId)
      }
    }

    if (eventType === 'pageview') {
      visitor.totalPageviews++
    }

    await writeAnalytics(data)
    res.json({ success: true, sessionId, visitorId })
  } catch (error) {
    console.error('Tracking error:', error)
    res.status(500).json({ error: 'Tracking failed' })
  }
})

// Page view tracking (eski endpoint - geriye uyumluluk için)
app.post('/api/analytics/pageview', async (req, res) => {
  try {
    const {
      path: pagePath,
      referrer,
      userAgent,
      screenResolution,
      sessionId: clientSessionId,
      timestamp
    } = req.body

    const data = await readAnalytics()
    
    const sessionId = clientSessionId || generateSessionId()
    const visitorId = req.headers['x-visitor-id'] || `visitor_${Date.now()}`
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown'
    
    // Page view kaydet
    const pageView = {
      id: `pv_${Date.now()}`,
      sessionId,
      visitorId,
      path: pagePath,
      referrer: referrer || 'direct',
      userAgent,
      screenResolution,
      ip,
      location: getLocationFromIP(ip),
      timestamp: timestamp || new Date().toISOString()
    }
    
    data.pageViews.push(pageView)
    
    // Session güncelle veya oluştur
    let session = data.sessions.find(s => s.id === sessionId)
    if (!session) {
      session = {
        id: sessionId,
        visitorId,
        startTime: pageView.timestamp,
        lastActivity: pageView.timestamp,
        pageViews: [],
        events: [],
        userAgent,
        location: pageView.location,
        device: detectDevice(userAgent),
        browser: detectBrowser(userAgent)
      }
      data.sessions.push(session)
    }
    
    session.pageViews.push(pageView.id)
    session.lastActivity = pageView.timestamp
    
    // Son 30 günün verisini tut
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    data.pageViews = data.pageViews.filter(pv => new Date(pv.timestamp) > thirtyDaysAgo)
    data.sessions = data.sessions.filter(s => new Date(s.lastActivity) > thirtyDaysAgo)
    
    await writeAnalytics(data)
    
    res.json({ success: true, sessionId, visitorId })
  } catch (error) {
    console.error('PageView tracking error:', error)
    res.status(500).json({ error: 'Failed to track pageview' })
  }
})

// Event tracking (click, scroll, etc.)
app.post('/api/analytics/event', async (req, res) => {
  try {
    const { sessionId, type, data: eventData, timestamp } = req.body
    
    const data = await readAnalytics()
    
    const event = {
      id: `event_${Date.now()}`,
      sessionId,
      type,
      data: eventData,
      timestamp: timestamp || new Date().toISOString()
    }
    
    data.events.push(event)
    
    // Session'a event ekle
    const session = data.sessions.find(s => s.id === sessionId)
    if (session) {
      session.events.push(event.id)
      session.lastActivity = event.timestamp
    }
    
    await writeAnalytics(data)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Event tracking error:', error)
    res.status(500).json({ error: 'Failed to track event' })
  }
})

// Performance tracking
app.post('/api/analytics/performance', async (req, res) => {
  try {
    const { path: pagePath, metrics, timestamp } = req.body
    
    const data = await readAnalytics()
    
    const performance = {
      id: `perf_${Date.now()}`,
      path: pagePath,
      metrics,
      timestamp: timestamp || new Date().toISOString()
    }
    
    data.performance.push(performance)
    
    // Son 7 günün performans verisini tut
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    data.performance = data.performance.filter(p => new Date(p.timestamp) > sevenDaysAgo)
    
    await writeAnalytics(data)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Performance tracking error:', error)
    res.status(500).json({ error: 'Failed to track performance' })
  }
})

// Analytics verilerini getir
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const { startDate, endDate, period = '7days' } = req.query
    
    const data = await readAnalytics()
    
    // Tarih filtreleme
    let filterDate = new Date()
    switch (period) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        break
      case '7days':
        filterDate.setDate(filterDate.getDate() - 7)
        break
      case '30days':
        filterDate.setDate(filterDate.getDate() - 30)
        break
      case '90days':
        filterDate.setDate(filterDate.getDate() - 90)
        break
    }
    
    const filteredPageViews = data.pageViews.filter(pv => 
      new Date(pv.timestamp) >= filterDate
    )
    
    const filteredSessions = data.sessions.filter(s => 
      new Date(s.startTime) >= filterDate
    )
    
    // İstatistikleri hesapla
    const stats = calculateStats(filteredPageViews, filteredSessions, data.events)
    
    res.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// Canlı ziyaretçiler
app.get('/api/analytics/live', async (req, res) => {
  try {
    const data = await readAnalytics()
    
    // Son 5 dakikada aktif olan sessionlar
    const fiveMinutesAgo = new Date()
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
    
    const liveSessions = data.sessions.filter(s => 
      new Date(s.lastActivity) >= fiveMinutesAgo
    )
    
    const livePageViews = data.pageViews.filter(pv =>
      new Date(pv.timestamp) >= fiveMinutesAgo
    )
    
    res.json({
      activeVisitors: liveSessions.length,
      recentPageViews: livePageViews,
      sessions: liveSessions
    })
  } catch (error) {
    console.error('Live stats error:', error)
    res.status(500).json({ error: 'Failed to get live stats' })
  }
})

// Yardımcı fonksiyonlar
const detectDevice = (userAgent) => {
  if (/mobile/i.test(userAgent)) return 'Mobile'
  if (/tablet/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}

const detectBrowser = (userAgent) => {
  if (/chrome/i.test(userAgent)) return 'Chrome'
  if (/safari/i.test(userAgent)) return 'Safari'
  if (/firefox/i.test(userAgent)) return 'Firefox'
  if (/edge/i.test(userAgent)) return 'Edge'
  return 'Other'
}

const calculateStats = (pageViews, sessions, events) => {
  // Benzersiz ziyaretçiler
  const uniqueVisitors = new Set(pageViews.map(pv => pv.visitorId)).size
  
  // Toplam sayfa görüntüleme
  const totalPageViews = pageViews.length
  
  // Ortalama oturum süresi
  const avgSessionDuration = sessions.reduce((acc, session) => {
    const start = new Date(session.startTime).getTime()
    const end = new Date(session.lastActivity).getTime()
    return acc + (end - start)
  }, 0) / (sessions.length || 1) / 1000 / 60 // dakika
  
  // Bounce rate (tek sayfa görüntülemeli oturumlar)
  const bouncedSessions = sessions.filter(s => s.pageViews.length === 1).length
  const bounceRate = (bouncedSessions / (sessions.length || 1)) * 100
  
  // Cihaz dağılımı
  const devices = sessions.reduce((acc, s) => {
    acc[s.device] = (acc[s.device] || 0) + 1
    return acc
  }, {})
  
  // Tarayıcı dağılımı
  const browsers = sessions.reduce((acc, s) => {
    acc[s.browser] = (acc[s.browser] || 0) + 1
    return acc
  }, {})
  
  // En çok ziyaret edilen sayfalar
  const topPages = pageViews.reduce((acc, pv) => {
    acc[pv.path] = (acc[pv.path] || 0) + 1
    return acc
  }, {})
  
  // Trafik kaynakları
  const sources = pageViews.reduce((acc, pv) => {
    const source = pv.referrer === 'direct' ? 'Direct' : 
                   pv.referrer.includes('google') ? 'Google' :
                   pv.referrer.includes('facebook') ? 'Facebook' :
                   pv.referrer.includes('twitter') ? 'Twitter' :
                   'Referral'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})
  
  // Günlük trend
  const dailyTrend = pageViews.reduce((acc, pv) => {
    const date = new Date(pv.timestamp).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, visitors: new Set(), pageViews: 0 }
    }
    acc[date].visitors.add(pv.visitorId)
    acc[date].pageViews++
    return acc
  }, {})
  
  const trendData = Object.values(dailyTrend).map(day => ({
    date: day.date,
    visitors: day.visitors.size,
    pageViews: day.pageViews
  })).sort((a, b) => a.date.localeCompare(b.date))
  
  return {
    uniqueVisitors,
    totalPageViews,
    avgSessionDuration: `${Math.floor(avgSessionDuration)}:${Math.round((avgSessionDuration % 1) * 60).toString().padStart(2, '0')}`,
    bounceRate: Math.round(bounceRate),
    visitorChange: 0, // Önceki periyotla karşılaştırma için (şimdilik 0)
    pageViewChange: 0,
    durationChange: 0,
    bounceRateChange: 0,
    devices,
    browsers,
    topPages: Object.entries(topPages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views })),
    sources: Object.entries(sources)
      .map(([source, count]) => ({ source, count })),
    trendData
  }
}

// Sunucuyu başlat
initAnalyticsData().then(() => {
  app.listen(PORT, () => {
    console.log(`🔥 Analytics Server running on http://localhost:${PORT}`)
    console.log(`📊 Real-time tracking active`)
  })
})
