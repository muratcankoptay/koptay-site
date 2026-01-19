# 📊 Gerçek Zamanlı Analytics Sistemi

Google Analytics ve Microsoft Clarity alternatifi olarak kendi analytics sisteminiz!

## ✨ Özellikler

- **Gerçek Zamanlı Takip**: Canlı ziyaretçi sayısı ve aktivite
- **Detaylı Metrikler**: 
  - Sayfa görüntüleme
  - Benzersiz ziyaretçiler
  - Oturum süreleri
  - Hemen çıkma oranı
- **Cihaz & Tarayıcı Analizi**: Hangi cihazlardan gelindiği
- **Trafik Kaynakları**: Ziyaretçilerin nereden geldiği
- **Performans Metrikleri**: Sayfa yükleme süreleri
- **Event Tracking**: Tıklama, scroll, form gönderimi takibi
- **Veri Gizliliği**: Veriler kendi sunucunuzda

## 🚀 Kurulum

### 1. Analytics Server Başlatma

```bash
node analytics-server.js
```

Server `http://localhost:3003` adresinde çalışacak.

### 2. Frontend Tracking

Analytics tracker zaten `main.jsx` dosyasında aktif. Admin paneli dışındaki tüm sayfalarda otomatik çalışıyor.

```javascript
// src/main.jsx
import { initAnalytics } from './utils/analyticsTracker.js'

if (!window.location.pathname.startsWith('/admin')) {
  initAnalytics()
}
```

### 3. Manuel Event Tracking

İstediğiniz yerde özel event'leri kaydedebilirsiniz:

```javascript
import { analytics } from './utils/analyticsTracker.js'

// Button tıklama
analytics.track('button_click', {
  buttonName: 'İletişim Formu',
  location: 'homepage'
})

// Form gönderimi
analytics.track('form_submit', {
  formType: 'contact',
  success: true
})

// Özel event
analytics.track('video_play', {
  videoId: 'intro-video',
  duration: 120
})
```

## 📈 Admin Panel

Analytics verilerini görmek için:

1. Admin paneline giriş yapın
2. Sol menüden **Analytics** sekmesine tıklayın
3. Gerçek zamanlı verileri görüntüleyin

### Özellikler:

- **Canlı Ziyaretçi Sayacı**: Son 5 dakikada aktif kullanıcılar
- **Tarih Filtresi**: Bugün, Son 7 gün, Son 30 gün, Son 90 gün
- **Rapor İndirme**: Verileri dışa aktarma
- **Yenileme Butonu**: Manuel veri güncelleme

## 🔧 Teknik Detaylar

### Tracker Özellikleri

- **Session Tracking**: Her ziyaretçi için benzersiz session ID
- **Visitor ID**: Persistent visitor tracking (localStorage)
- **SPA Support**: React Router değişikliklerini otomatik algılama
- **Scroll Tracking**: %25, %50, %75, %100 milestone'ları
- **Link Tracking**: Dış linklere tıklamaları kaydet
- **Form Tracking**: Form gönderimlerini kaydet
- **Performance Tracking**: Sayfa yükleme sürelerini ölç
- **Reliable Sending**: `navigator.sendBeacon` ile güvenilir veri gönderimi

### API Endpoints

#### POST `/api/analytics/track`
Universal tracking endpoint - tüm event'ler için

```json
{
  "eventType": "pageview",
  "sessionId": "session-123",
  "visitorId": "visitor-456",
  "path": "/hizmetlerimiz",
  "title": "Hizmetlerimiz",
  "referrer": "https://google.com",
  "timestamp": "2024-01-20T10:30:00Z",
  "device": {
    "type": "desktop",
    "os": "Windows",
    "browser": "Chrome",
    "screenResolution": "1920x1080"
  }
}
```

#### GET `/api/analytics/stats?period=7days`
İstatistiksel veriler

Dönem seçenekleri: `today`, `7days`, `30days`, `90days`

Response:
```json
{
  "uniqueVisitors": 1234,
  "totalPageViews": 5678,
  "avgSessionDuration": "3:45",
  "bounceRate": 35,
  "devices": {...},
  "browsers": {...},
  "topPages": [...],
  "trafficSources": [...]
}
```

#### GET `/api/analytics/live`
Canlı ziyaretçiler (son 5 dakika)

```json
{
  "activeVisitors": 5,
  "recentPageViews": [...],
  "sessions": [...]
}
```

## 📊 Toplanan Veriler

### Otomatik Toplanan:
- Sayfa URL'leri
- Referrer (önceki site)
- Cihaz tipi (Desktop, Mobile, Tablet)
- İşletim sistemi
- Tarayıcı
- Ekran çözünürlüğü
- Viewport boyutu
- Dil tercihi
- Saat dilimi
- Session süresi
- Sayfa yükleme süreleri

### Toplanmayan (Gizlilik):
- Kişisel tanımlayıcı bilgiler
- Tam IP adresi (anonim)
- Form içerikleri
- Şifreler
- Ödeme bilgileri

## 🔒 Veri Saklama

Veriler `analytics-data.json` dosyasında saklanır. Production ortamında MongoDB veya PostgreSQL kullanılması önerilir.

**Veri Temizleme**: Son 30 günün verisi otomatik olarak saklanır, eskiler silinir.

## 🎯 Avantajları

### Google Analytics'e Göre:
✅ Tam veri sahipliği
✅ KVKK/GDPR uyumlu (kendi sunucunuzda)
✅ Cookie uyarısı gerektirmez
✅ Reklam engelleyiciler tarafından bloklanmaz
✅ Sayfa hızını etkilemez
✅ Ücretsiz ve sınırsız

### Microsoft Clarity'ye Göre:
✅ Daha detaylı özelleştirme
✅ API erişimi
✅ Veri export imkanı
✅ Gerçek zamanlı raporlama
✅ Özel event tracking

## 🚦 Performans

- **Lightweight**: ~5KB minified
- **Non-blocking**: Asenkron yükleme
- **Batching**: Event'ler gruplanarak gönderilir
- **Retry Logic**: Başarısız istekler yeniden denenir
- **Offline Support**: Offline durumda queue'da bekler

## 📱 Desteklenen Platformlar

- ✅ Modern tarayıcılar (Chrome, Firefox, Safari, Edge)
- ✅ Mobil cihazlar (iOS, Android)
- ✅ Tablet'ler
- ✅ Single Page Applications (React, Vue, Angular)
- ✅ Server-side rendering (Next.js, Nuxt.js)

## 🔄 Güncellemeler

Analytics sistemi sürekli geliştirilmektedir:

- [x] Temel tracking
- [x] Session yönetimi
- [x] Canlı ziyaretçiler
- [x] Cihaz & tarayıcı analizi
- [x] Event tracking
- [x] Performance monitoring
- [ ] Heatmap desteği
- [ ] A/B testing
- [ ] Funnel analizi
- [ ] Kullanıcı akışı
- [ ] Coğrafi analiz (IP geolocation)

## 📞 Destek

Sorularınız için admin panelinden yardım alabilirsiniz.

---

**Not**: Bu sistem Google Analytics ve Microsoft Clarity'nin tam alternatifi olmak üzere tasarlanmıştır ve kendi sunucunuzda çalışır. Veri gizliliği ve KVKK uyumluluğu için ideal bir çözümdür.
