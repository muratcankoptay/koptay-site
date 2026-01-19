// Gerçek zamanlı analytics tracking sistemi
const ANALYTICS_API = 'http://localhost:3003/api/analytics'

class AnalyticsTracker {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.visitorId = this.getOrCreateVisitorId()
    this.isTracking = false
    this.init()
  }

  init() {
    if (typeof window === 'undefined') return
    
    // Sayfa yüklendiğinde track
    this.trackPageView()
    
    // Sayfa değişimlerini dinle (SPA için)
    this.observeRouteChanges()
    
    // Performance metrikleri
    this.trackPerformance()
    
    // Kullanıcı etkileşimlerini track et
    this.trackEvents()
    
    // Sayfa kapatılırken session bilgisini kaydet
    window.addEventListener('beforeunload', () => {
      this.endSession()
    })
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analyticsSessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analyticsSessionId', sessionId)
    }
    return sessionId
  }

  getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('analyticsVisitorId')
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('analyticsVisitorId', visitorId)
    }
    return visitorId
  }

  async trackPageView() {
    try {
      const data = {
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      }

      await fetch(`${ANALYTICS_API}/pageview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Visitor-Id': this.visitorId
        },
        body: JSON.stringify(data)
      })

      console.log('📊 Page view tracked:', window.location.pathname)
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  observeRouteChanges() {
    // React Router için
    let lastPath = window.location.pathname
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname
        this.trackPageView()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Popstate eventi için (back/forward button)
    window.addEventListener('popstate', () => {
      this.trackPageView()
    })
  }

  async trackEvent(type, data) {
    try {
      await fetch(`${ANALYTICS_API}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          type,
          data,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Event tracking error:', error)
    }
  }

  trackEvents() {
    // Link tıklamaları
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link) {
        this.trackEvent('click', {
          element: 'link',
          href: link.href,
          text: link.textContent,
          path: window.location.pathname
        })
      }
    })

    // Button tıklamaları
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button')
      if (button) {
        this.trackEvent('click', {
          element: 'button',
          text: button.textContent,
          path: window.location.pathname
        })
      }
    })

    // Scroll depth tracking
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        this.trackEvent('scroll', {
          depth: scrollPercent,
          path: window.location.pathname
        })
      }
    })

    // Form gönderimleri
    document.addEventListener('submit', (e) => {
      const form = e.target
      this.trackEvent('form_submit', {
        formId: form.id,
        formAction: form.action,
        path: window.location.pathname
      })
    })
  }

  async trackPerformance() {
    // Sayfa yüklenme metrikleri
    window.addEventListener('load', () => {
      setTimeout(async () => {
        const perfData = performance.getEntriesByType('navigation')[0]
        
        if (perfData) {
          const metrics = {
            loadTime: perfData.loadEventEnd - perfData.fetchStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          }

          await fetch(`${ANALYTICS_API}/performance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              path: window.location.pathname,
              metrics,
              timestamp: new Date().toISOString()
            })
          })
        }
      }, 1000)
    })
  }

  endSession() {
    // Session sonlandırma
    navigator.sendBeacon(`${ANALYTICS_API}/event`, JSON.stringify({
      sessionId: this.sessionId,
      type: 'session_end',
      data: {
        duration: Date.now() - parseInt(this.sessionId.split('_')[1])
      },
      timestamp: new Date().toISOString()
    }))
  }

  // Manuel event tracking için public method
  track(eventName, data = {}) {
    this.trackEvent(eventName, data)
  }
}

// Global analytics instance
let analytics = null

export const initAnalytics = () => {
  if (typeof window !== 'undefined' && !analytics) {
    analytics = new AnalyticsTracker()
  }
  return analytics
}

export const trackEvent = (eventName, data) => {
  if (analytics) {
    analytics.track(eventName, data)
  }
}

export default { initAnalytics, trackEvent }
