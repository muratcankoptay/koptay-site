# 📊 Gerçek Zamanlı Analytics Sistemi

## 🎯 Özellikler

Artık **kendi analytics sisteminiz** var! Google Analytics'e bağımlı olmadan:

### ✅ Toplanılan Veriler:
- 📈 **Sayfa görüntülemeleri** - Her sayfa ziyareti
- 👥 **Benzersiz ziyaretçiler** - Tekrar eden kullanıcılar
- ⏱️ **Oturum süreleri** - Sitede geçirilen zaman
- 🔄 **Hemen çıkma oranı** - Tek sayfa görüntülemeleri
- 📱 **Cihaz dağılımı** - Mobile, Desktop, Tablet
- 🌐 **Tarayıcı bilgisi** - Chrome, Firefox, Safari vs.
- 🗺️ **Trafik kaynakları** - Direct, Google, Sosyal medya
- 🖱️ **Kullanıcı etkileşimleri** - Tıklamalar, scroll, form gönderimi
- ⚡ **Sayfa performansı** - Yüklenme süreleri
- 🔴 **Canlı ziyaretçiler** - Şu an sitede olanlar (10 saniyede bir güncellenir)

### 📊 Admin Panel - Analytics Sayfası:
- Gerçek zamanlı grafikler (Recharts ile)
- 7 gün / 30 gün / 90 gün filtreleme
- Canlı ziyaretçi sayacı
- Trafik analizi
- Cihaz ve tarayıcı dağılımı

## 🚀 Kurulum ve Kullanım

### 1. Sunucuları Başlatın:

```bash
npm run admin
```

Bu komut 3 sunucuyu birden başlatır:
- ✅ Admin Server (Port 3002) - Makale/görsel yönetimi
- ✅ Analytics Server (Port 3003) - Veri toplama
- ✅ Vite Dev Server (Port 5173) - Frontend

### 2. Analytics Verilerini Görüntüleyin:

Admin paneline girin: `http://localhost:5173/admin`

**Analytics** sekmesine tıklayın ve:
- Canlı ziyaretçileri görün
- Sayfa görüntülemelerini takip edin
- Trafik kaynaklarını analiz edin
- Cihaz dağılımını inceleyin

## 📁 Dosya Yapısı

```
├── analytics-server.js          # Analytics API sunucusu
├── analytics-data.json          # Toplanan veriler (otomatik oluşur)
├── src/
│   ├── utils/analytics.js       # Frontend tracking kodu
│   └── admin/Analytics.jsx      # Admin panel analytics sayfası
```

## 🔧 Nasıl Çalışır?

### Frontend (Kullanıcı Tarafı):
1. Kullanıcı siteyi ziyaret eder
2. `analytics.js` otomatik çalışır
3. Her sayfa görüntüleme kaydedilir
4. Kullanıcı etkileşimleri izlenir (tıklama, scroll vs.)
5. Veriler `analytics-server.js`'e gönderilir

### Backend (Sunucu Tarafı):
1. `analytics-server.js` verileri alır
2. `analytics-data.json` dosyasına yazar
3. Session ve visitor ID'leri yönetir
4. İstatistikleri hesaplar

### Admin Panel:
1. Admin **Analytics** sayfasını açar
2. Gerçek zamanlı veriler çekilir
3. Grafikler ve tablolar güncellenir
4. Her 10 saniyede canlı ziyaretçi sayısı yenilenir

## 🎨 Avantajlar

✅ **Tamamen size ait** - Verileriniz kendi sunucunuzda
✅ **Gerçek zamanlı** - Anında güncellenen veriler
✅ **Detaylı** - Her şeyi takip edebilirsiniz
✅ **Özelleştirilebilir** - İstediğiniz metriği ekleyebilirsiniz
✅ **Ücretsiz** - Harici servis maliyeti yok
✅ **KVKK uyumlu** - Kendi verilerinizi kontrol edersiniz
✅ **Privacy-first** - Kullanıcı gizliliğine saygılı

## 📈 Gelecek Geliştirmeler

İsterseniz ekleyebiliriz:
- 🗺️ **Heatmap** - Tıklama haritaları
- 🎯 **Conversion tracking** - Hedef takibi
- 📧 **E-posta raporları** - Haftalık/aylık otomatik raporlar
- 🔔 **Bildirimler** - Belirli olaylarda uyarı
- 🌍 **IP Geolocation** - Detaylı konum analizi
- 📊 **A/B Testing** - Sayfa versiyonu testleri
- 🤖 **Bot detection** - Sahte trafiği filtreleme

## 🛠️ API Endpoints

Analytics Server API'leri:

```javascript
// Sayfa görüntüleme kaydet
POST http://localhost:3003/api/analytics/pageview

// Event kaydet (click, scroll vs.)
POST http://localhost:3003/api/analytics/event

// Performans metrikleri
POST http://localhost:3003/api/analytics/performance

// İstatistikleri getir
GET http://localhost:3003/api/analytics/stats?period=7days

// Canlı ziyaretçiler
GET http://localhost:3003/api/analytics/live
```

## 📝 Notlar

- Veriler `analytics-data.json` dosyasında saklanır
- Son 30 günün verisi tutulur (değiştirilebilir)
- Performans verileri 7 gün tutulur
- Admin paneli hariç tüm sayfalarda tracking aktif
- Production'da otomatik çalışır

## 🎯 Sonuç

Artık Google Analytics, Microsoft Clarity gibi dış servislere bağımlı olmadan **kendi analytics sisteminiz** var! Tüm veriler size ait ve tamamen kontrol altında.

**Not:** İsterseniz Google Analytics'i de paralel çalıştırabilirsiniz. İkisi birlikte sorunsuz çalışır.
