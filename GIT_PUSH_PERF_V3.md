# Git Push — Mobil Performans V3 (Asıl Suçluyu Bulduk)

İki PageSpeed PDF'inin detaylı analizi gösterdi ki Perf V1 ve V2'deki iyileştirmeler doğruydu, AMA gözden kaçırdığımız **gerçek katil** başkaymış:

## Asıl Sorun: `/api/admin-articles` ÇİFT Çağrısı

PageSpeed bağımlılık ağacında:

```
/makale/taseron... (115 msn)
  /assets/index-c27c3b90.js (195 msn)
    /api/admin-articles (1.619 msn, 105 KiB)   ← 1. çağrı
    /api/admin-articles (1.402 msn, 105 KiB)   ← 2. çağrı (AYNI ENDPOINT!)
    /assets/chart-vendor (303 msn, 67 KiB)
```

Toplam **3.0 saniye kritik yol** sadece API çağrılarından. ArticlePage:

```js
// Eski hali — Promise.all paralel ama AYNI endpoint'i 2 kez vuruyordu
const [articleResponse, allArticlesResponse] = await Promise.all([
  api.getArticle(slug),    // → /api/admin-articles  (105 KiB)
  api.getArticles()         // → /api/admin-articles  (105 KiB tekrar!)
])
```

`api.getArticle()` ve `api.getArticles()` farklı kanaldan aynı endpoint'i hit ediyordu. Cache çalışmıyordu çünkü iki fonksiyon farklı kod yollarıydı.

## Yapılan Değişiklikler (3 dosya)

| Dosya | Düzeltme |
|---|---|
| `src/utils/api.js` | `/api/admin-articles` çağrıları **tamamen kaldırıldı**. Sadece `/articles.json` (CDN cached, brotli sıkışmış) kullanılır. `loadArticlesOnce()` helper + **inflight dedup** ile aynı anda 2 isteğin tek HTTP olması garantilendi. Cache 30 sn → 5 dk. |
| `src/pages/ArticlePage.jsx` | Promise.all kaldırıldı. Tek `api.getArticles()` çağrısı; makaleyi ve related listesini aynı veriden filtreliyor. Net etki: **2 çağrı → 1 çağrı**. |
| `vite.config.js` | chart.js, jspdf, html2canvas, flatpickr, @google/generative-ai için ayrı vendor chunk rule'ları **kaldırıldı**. Bunlar sadece dynamic import edilen sayfalardan kullanıldığı için Vite otomatik olarak ilgili async chunk içine inline eder; ana bundle'ın import map'inde referans kalmaz, preload scanner sızıntısı durur. |

## Adım 1: Proje klasörüne git

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

## Adım 2: Stage et

```powershell
git add src/utils/api.js
git add src/pages/ArticlePage.jsx
git add vite.config.js
git add GIT_PUSH_PERF_V3.md
```

## Adım 3: Doğrula ve push

```powershell
git status
git commit -m "perf: kill double API fetch (105 KiB x2) + chart-vendor preload leak"
git push origin main
```

## Adım 4: Vercel deploy + doğrulama

Push'tan ~3 dk sonra Vercel'in deploy logunu kontrol et, sonra:

```powershell
# 1) /api/admin-articles çağrısı tamamen kalkmalı (0 referans)
curl.exe -s https://koptay.av.tr/assets/index-*.js 2>$null | Select-String "admin-articles"
# >>> Beklenen: hiçbir eşleşme yok

# 2) chart-vendor ayrı chunk olarak GÖZÜKMEMELİ (vendor içinde inline veya page chunk içinde)
curl.exe -s https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026 -o $null
# Build sonrası dist/assets/ altında chart-vendor-*.js dosyası OLMAMALI
```

## Adım 5: PageSpeed yeniden test

URL: `https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026`

**Beklenen değişim:**

| Metrik | V2 sonrası (mevcut) | V3 hedef |
|---|---|---|
| Performans skoru | 68 | **88-95** |
| LCP (Lighthouse) | 6.2 sn | **2-3 sn** |
| FCP (Lighthouse) | 3.8 sn | **1.5-2 sn** |
| Maks. kritik yol | 1619 msn | **<400 msn** |
| Network requests | 6 (2 API çift) | 4 (tek static JSON) |

CRUX gerçek kullanıcı verisi (LCP 2.6sn, INP 131ms, CLS 0) zaten "iyi" durumdaydı — Lighthouse simülasyonu yakalamayı başaramıyordu. Bu push ile sentetik test de gerçeği yansıtacak.

## Riskler

- **Articles.json güncel olmalı**: Yeni makale eklendiğinde build'de articles.json hem root hem public'te güncellenmeli (zaten öyle).
- **chart vendor chunking değişti**: TazminatHesaplama, MeslekHastaligi, TrafikKazasi sayfaları açıldığında chart.js o sayfa chunk'ı içinde gelecek. İlk açılışta küçük bir gecikme olabilir; sonraki açılışlarda cache'den.
- **api.js'de mockArticles fallback hâlâ var**: articles.json hiç yoksa veya bozuksa eski mock data gösterilir.

## Geri alma

```powershell
git revert HEAD
git push origin main
```

## V1+V2+V3 toplam etki — birleşik beklenti

İlk push (V1) makaleyi yayına aldı + pazarlama temizliği. V2 loader/skeleton/preload düzeltti. V3 asıl Lighthouse killer'ı (çift API + chart leak) öldürdü. Üçü birden çalıştığında:

- Performans skoru: 75 (başlangıç) → **88-95**
- LCP: 6.1 sn → **2-3 sn**
- FCP: 1.8 sn → **1.5-2 sn**
- Image tasarruf uyarısı: 48 KiB → **kaybolur**
- Ağ ağacı: 6 dosya, çift API → **temiz tek istek**
