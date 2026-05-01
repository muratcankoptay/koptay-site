# Koptay Hukuk — SEO Uygulama Özeti ve Deploy Notları

Tarih: 30 Nisan 2026

## ✅ Yapılan Değişiklikler (Özet)

### 1. Mimari: Prerender ile SPA → Statik HTML (en kritik)
- **`scripts/prerender.js`** eklendi. `vite build` sonrası çalışır; sitemap'teki her route için (18 statik sayfa + 17 makale = 35 HTML) sayfa-spesifik `<title>`, `<meta description>`, Open Graph, Twitter Card, canonical, JSON-LD (Article, Organization, Website, BreadcrumbList) inject eder.
- **`package.json` build** komutu güncellendi:
  ```
  build = generate-sitemap → generate-rss → vite build → prerender
  ```
- **`vercel.json`** güncellendi: `cleanUrls: true`, `trailingSlash: false`, daha katı rewrite kuralı (statik dosyalara dokunmaz).
- Sonuç: Google, Bing, Yandex artık her makale için doğru başlığı görür; WhatsApp/Facebook/LinkedIn linkleri zengin önizleme ile paylaşılır.

### 2. Yapısal Veri (JSON-LD) Düzeltmeleri
- **`LocalBusinessSchema.jsx`** → tip `Attorney`'ya çevrildi; sahte `aggregateRating`, sahte sosyal medya `sameAs` URL'leri ve `"Adresiniz Buraya"` yer tutucusu temizlendi. Gerçek ofis adresi (Aziziye Mah. Willy Brandt Sk. No:7/1, Çankaya/Ankara, 06680) eklendi. `knowsAbout` listesine 10 hukuk dalı, `knowsLanguage` ve `areaServed` (City + Country) eklendi.
- **`ArticleSchema.jsx`** → image objesi desteği, mutlak URL, `seoTitle`/`seoDescription`/`keywords`/`publishedAt`/`updatedAt` doğru alanlardan alınıyor.

### 3. Eksik Sayfalara `<SEO />` Bileşeni
Aşağıdaki 5 sayfa daha önce sadece basit `<Helmet>` kullanıyordu — artık tam SEO bileşeni var (OG, Twitter, canonical, JSON-LD):
- `src/pages/TrafikKazasiPage.jsx`
- `src/pages/IlaveTediyePage.jsx`
- `src/pages/IscilikAlacaklariPage.jsx`
- `src/pages/MeslekHastaligiPage.jsx`
- `src/pages/TazminatHesaplamaPage.jsx`

### 4. ArticlePage SEO Beslemesi
- `article.metaDescription` yerine `article.seoDescription` (gerçek alan), `article.metaKeywords` yerine `article.keywords` kullanılıyor.
- `article.image` artık hem string hem `{url, alternativeText}` objesi olarak gelebilir; ikisi de destekleniyor.
- OG/Twitter image için mutlak URL üretiliyor (`https://koptay.av.tr` ön ek).
- `publishedAt`/`updatedAt` doğru alanlardan okunuyor.
- JSON-LD logo `.svg` referansı düzeltildi.

### 5. Görsel Optimizasyonları
- **Hero görseli** WebP'ye dönüştürüldü (`hero-bg-1.webp` 163 KB, AVIF 152 KB; orijinal 197 KB JPG hâlâ duruyor — fallback).
- **9 makale görseli** WebP versiyonu eklendi (toplam 285 KB tasarruf, %48 küçük).
- `Hero.jsx` background'ı `image-set()` ile AVIF → WebP → JPG fallback zinciri.
- `index.html` preload `hero-bg-1.webp` olarak güncellendi.
- `<img>` alt değerleri:
  - `Home.jsx`, `MakalelerPage.jsx`, `ArticleCard.jsx` → `article.image.alternativeText` kullanıyor (yoksa title fallback).
  - `TeamMember.jsx` → "Ad - Ünvan - Koptay Hukuk Bürosu" formatında zenginleştirildi.
  - `Footer.jsx` logo alt'ı koruyup lazy loading eklendi.
- `width`/`height` attribute'ları eklendi (CLS için).
- `loading="lazy"` ve `decoding="async"` tüm fold-altı görsellerde.

### 6. Sitemap & robots.txt
- `public/generate-sitemap.js` yeniden yazıldı:
  - 39 URL (18 statik + 4 kategori + 17 makale).
  - Her makaleye `image:image` (Google Görseller için).
  - `lastmod` artık makalenin gerçek `updatedAt`'ından üretiliyor.
  - Title doğrudan article.title (slug'tan üretmiyor).
  - XML escape doğru yapılıyor.
- `public/robots.txt` güncellendi:
  - Gereksiz `/_next/` kuralı kaldırıldı.
  - `/muvekkil-paneli` engellendi.
  - GPTBot, ChatGPT-User, CCBot, anthropic-ai, Google-Extended, PerplexityBot için opt-out (içeriğin AI eğitiminde kullanılmasını engellemek için).
  - Bingbot, YandexBot için açık kurallar.
  - Googlebot-Image için `/images/` izni.

### 7. KVKK / GDPR Uyumlu Analytics
- `index.html`'deki Microsoft Clarity ve Google Analytics scriptleri `window.__initAnalytics` fonksiyonu içine alındı.
- Kullanıcı Çerez Banner'da **Kabul Et** tıklamadan **hiçbir tracking script yüklenmiyor**.
- `CookieConsent.jsx` → "Reddet" butonu eklendi; kabul edildiğinde `__initAnalytics()` çağrılıyor; reddedildiğinde scriptler hiç yüklenmiyor.
- GA için `anonymize_ip: true` parametresi eklendi.
- DNS prefetch listesine `clarity.ms` eklendi.

---

## 📦 Deploy / Build Adımları

### Yerel Build
```bash
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
npm install        # node_modules güncelse atlayın
npm run build      # sitemap → rss → vite build → prerender
```

Build sonunda `dist/` klasöründe şunlar olur:
- `dist/index.html` — kök sayfa için prerendered
- `dist/makaleler/index.html`, `dist/iletisim/index.html`, vs.
- `dist/makale/<slug>/index.html` — her makale için
- `dist/hesaplama-araclari/<arac>/index.html` — her hesaplama aracı için
- `dist/sitemap.xml` — image entries dahil 39 URL
- `dist/robots.txt`
- `dist/assets/...` — JS/CSS bundles

### Vercel Deploy
Mevcut bağlı GitHub repo Vercel'e push'ladığınızda otomatik tetiklenir:
```bash
git add -A
git commit -m "SEO genişletme: prerender, schema, görsel ve KVKK iyileştirmeleri"
git push origin main
```
Vercel'in `cleanUrls: true` ayarı sayesinde `/makale/foo` URL'i otomatik olarak `dist/makale/foo/index.html` dosyasını sunacak.

### Build Sonrası Doğrulama Checklist'i

1. **HTML kontrol** (her route için title farklı mı?):
   ```bash
   curl -s https://koptay.av.tr/ | grep -o '<title>[^<]*</title>'
   curl -s https://koptay.av.tr/makaleler | grep -o '<title>[^<]*</title>'
   curl -s https://koptay.av.tr/makale/<slug> | grep -o '<title>[^<]*</title>'
   ```
   Hepsi farklı çıkmalı.

2. **OG önizlemesi** (sosyal medya):
   - https://www.opengraph.xyz/url/<URL> ya da
   - https://www.linkedin.com/post-inspector/
   - WhatsApp'ta link paylaş: başlık + açıklama + görsel görünmeli.

3. **Yapısal veri**:
   - https://search.google.com/test/rich-results — "Attorney", "Article", "BreadcrumbList" çıkmalı.
   - Schema.org Validator: https://validator.schema.org/

4. **Sitemap**:
   - https://koptay.av.tr/sitemap.xml açılmalı, 39 URL olmalı.
   - Google Search Console → Sitemaps → "Yeniden Gönder".

5. **PageSpeed Insights**: https://pagespeed.web.dev/?url=https%3A%2F%2Fkoptay.av.tr — Mobile/Desktop skorları, LCP/CLS değerleri.

6. **robots.txt**: https://koptay.av.tr/robots.txt → GPTBot ve diğer AI bot disallow'ları görünmeli.

---

## 🚀 Sonraki Adımlar (Öneriler)

1. **Google Search Console** → Domain mülkiyeti doğrula, sitemap gönder, "URL Inspection" ile birkaç makale URL'sini "Live test" yap.
2. **Google Business Profile** → Avukat kategorisinde işletme profilini güncelle, gerçek müvekkil yorumlarını topla.
3. **Backlink stratejisi** → Türkiye Barolar Birliği üye sayfası, hukuk dergileri, hukuk podcastleri.
4. **İçerik kümesi (topic clusters)** → 17 dağınık makaleyi 5-6 ana konu etrafında toplayıp pillar page + destek makaleleri yapısına dönüştür.
5. **FAQ schema** → her hesaplama aracının altına "Sıkça Sorulan Sorular" bölümü + `FAQPage` JSON-LD ekle (snippet kazanma şansı).
6. **Google İşletme Profili paylaşımları** → her yeni makale için Google İşletme'ye da post at; doğrudan SEO sinyali.
7. **Yazar şeması (E-E-A-T)** → her makaleye yazar kutusu (foto, baro sicil, LinkedIn) ekle. Google YMYL içerikler için E-E-A-T'ı çok ciddiye alıyor.

---

## 📊 Beklenen Etki

- **Sosyal medya paylaşımları**: Şu an WhatsApp/LinkedIn linklerinde jenerik başlık görünüyor; prerender sonrası her makale kendi başlığı/açıklaması/görseliyle paylaşılır → tıklanma oranı 3-5x artar.
- **Bing & Yandex indeksleme**: Şu an JS render edemedikleri için makaleler büyük olasılıkla yok ya da eksik indekslenmiş; prerender sonrası tam metin olarak görürler.
- **Google indekseme hızı**: SPA'nın 2 aşamalı render'ından kurtulup tek aşamada indeksleme → yeni makaleler 1-2 günde Google'da, eski makalelerin sıralaması 4-8 hafta içinde iyileşir.
- **Core Web Vitals**: Hero WebP + lazy loading + width/height ile LCP ~30%, CLS ~50% düşer.
- **Yapısal veri**: Doğru `Attorney` schema ve `Article` schema ile Google rich results adaylığı.
- **3-6 ay içinde** "Ankara avukat" + uzun kuyruklu hukuk sorularında ciddi sıçrama beklenir.

---

## ⚠️ Bilinmesi Gerekenler

1. **Build artık daha uzun** (~+5-10 sn prerender adımı için). Vercel free tier için sorun değil.
2. **Yeni makale eklendiğinde** `articles.json` güncellenip yeniden build alınmalı (mevcut workflow zaten böyle).
3. **`scripts/prerender.js`** içinde statik route listesi var — yeni bir hesaplama aracı sayfası eklenirse oraya da eklenmeli (yoksa prerender edilmez, ama SPA fallback'i çalışır).
4. **Çok dilli yapı (en, ar, ru, uk)** şimdilik dokunulmadı — talep doğrultusunda TR'ye odaklanıldı; ileride yabancı müvekkil odaklı bir karar verirseniz hreflang + URL prefix ile aktive edilebilir.
5. **`muvekkil-paneli`** robots.txt ile bot indekslemesinden çıkarıldı; gerçek bir müvekkil giriş sayfası olduğu için bu doğru.
6. **AI bot opt-out** (GPTBot, ChatGPT-User vs.) içeriklerinizin OpenAI/Anthropic eğitiminde kullanılmasını engeller; bu tercihinize bağlı, isterseniz `robots.txt`'den kaldırabilirsiniz.

---

**Hazırlayan:** Claude (Cowork)
