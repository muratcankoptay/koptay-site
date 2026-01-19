// Gerçek zamanlı analytics tracker
// Google Analytics ve Microsoft Clarity alternatifi

class AnalyticsTracker {
  constructor() {
    this.apiUrl = 'http://localhost:3003/api/analytics'
    this.sessionId = this.getOrCreateSessionId()
    this.visitorId = this.getOrCreateVisitorId()
    this.startTime = Date.now()
    this.isActive = true
    
    // Sayfa değişikliklerini izle
    this.initPageTracking()
    
    // Kullanıcı etkileşimlerini izle
    this.initInteractionTracking()
    
    // Performans metriklerini izle
    this.initPerformanceTracking()
    
    // Sayfa kapatıldığında son verileri gönder
    this.initBeforeUnload()
  }

  // Session ID oluştur/al
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = this.generateId()
      sessionStorage.setItem('analytics_session_id', sessionId)
      sessionStorage.setItem('session_start', Date.now().toString())
    }
    return sessionId
  }

  // Visitor ID oluştur/al (persistent)
  getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('analytics_visitor_id')
    if (!visitorId) {
      visitorId = this.generateId()
      localStorage.setItem('analytics_visitor_id', visitorId)
      localStorage.setItem('first_visit', new Date().toISOString())
    }
    return visitorId
  }

  // Benzersiz ID oluştur
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Cihaz bilgilerini topla
  getDeviceInfo() {
    const ua = navigator.userAgent
    let deviceType = 'desktop'
    
    if (/mobile/i.test(ua)) deviceType = 'mobile'
    else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet'
    
    return {
      type: deviceType,
      os: this.getOS(ua),
      browser: this.getBrowser(ua),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || navigator.userLanguage,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: ua
    }
  }

  getOS(ua) {
    if (ua.indexOf('Win') !== -1) return 'Windows'
    if (ua.indexOf('Mac') !== -1) return 'MacOS'
    if (ua.indexOf('Linux') !== -1) return 'Linux'
    if (ua.indexOf('Android') !== -1) return 'Android'
    if (ua.indexOf('iOS') !== -1) return 'iOS'
    return 'Unknown'
  }

  getBrowser(ua) {
    if (ua.indexOf('Firefox') !== -1) return 'Firefox'
    if (ua.indexOf('Chrome') !== -1) return 'Chrome'
    if (ua.indexOf('Safari') !== -1) return 'Safari'
    if (ua.indexOf('Edge') !== -1) return 'Edge'
    if (ua.indexOf('Opera') !== -1) return 'Opera'
    return 'Unknown'
  }

  // Sayfa görüntüleme kaydı
  async trackPageView(path = window.location.pathname) {
    const data = {
      eventType: 'pageview',
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      path: path,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      device: this.getDeviceInfo(),
      utm: this.getUTMParameters()
    }

    await this.sendEvent(data)
  }

  // UTM parametrelerini al
  getUTMParameters() {
    const params = new URLSearchParams(window.location.search)
    return {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      term: params.get('utm_term'),
      content: params.get('utm_content')
    }
  }

  // Olay takibi (button clicks, form submits, vb)
  async trackEvent(eventName, properties = {}) {
    const data = {
      eventType: 'event',
      eventName,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      properties,
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    }

    await this.sendEvent(data)
  }

  // Sayfa değişikliklerini izle (SPA için)
  initPageTracking() {
    // İlk yükleme
    this.trackPageView()

    // History API değişikliklerini izle
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      this.trackPageView()
    }

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      this.trackPageView()
    }

    // Popstate olaylarını izle
    window.addEventListener('popstate', () => {
      this.trackPageView()
    })
  }

  // Kullanıcı etkileşimlerini izle
  initInteractionTracking() {
    // Scroll derinliği
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100
      if (scrollPercentage > maxScroll) {
        maxScroll = Math.round(scrollPercentage)
        
        // %25, %50, %75, %100 milestone'larını kaydet
        if ([25, 50, 75, 100].includes(maxScroll)) {
          this.trackEvent('scroll_depth', { depth: maxScroll })
        }
      }
    })

    // Link tıklamaları
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link) {
        const href = link.getAttribute('href')
        const isExternal = href && (href.startsWith('http') && !href.includes(window.location.hostname))
        
        if (isExternal) {
          this.trackEvent('outbound_link', {
            url: href,
            text: link.textContent.trim()
          })
        }
      }
    })

    // Form gönderileri
    document.addEventListener('submit', (e) => {
      const form = e.target
      if (form.tagName === 'FORM') {
        this.trackEvent('form_submit', {
          formId: form.id || 'unnamed',
          action: form.action
        })
      }
    })
  }

  // Performans metriklerini izle
  initPerformanceTracking() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = window.performance.timing
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart
          const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart
          
          this.trackEvent('performance', {
            pageLoadTime,
            domReadyTime,
            path: window.location.pathname
          })
        }, 0)
      })
    }
  }

  // Sayfa kapatıldığında
  initBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.startTime
      
      // Navigator.sendBeacon kullanarak güvenilir veri gönderimi
      const data = {
        eventType: 'session_end',
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        duration: sessionDuration,
        timestamp: new Date().toISOString()
      }
      
      navigator.sendBeacon(this.apiUrl + '/track', JSON.stringify(data))
    })
  }

  // Event'i sunucuya gönder
  async sendEvent(data) {
    try {
      // Batch gönderim için queue kullanabiliriz
      await fetch(this.apiUrl + '/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: true // Sayfa kapatıldığında bile gönderilsin
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Public API - Manuel event tracking için
  track(eventName, properties) {
    return this.trackEvent(eventName, properties)
  }
}

// Singleton instance
let trackerInstance = null

export const initAnalytics = () => {
  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker()
  }
  return trackerInstance
}

export const analytics = {
  track: (eventName, properties) => {
    if (trackerInstance) {
      trackerInstance.track(eventName, properties)
    }
  }
}

export default AnalyticsTracker
