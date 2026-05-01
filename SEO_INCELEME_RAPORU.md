# Koptay.av.tr — SEO İnceleme ve Yol Haritası

Hazırlayan: Claude (Cowork) | Tarih: 30 Nisan 2026
Kapsam: koptay.av.tr canlı sitesi + kaynak kodu (Vite + React SPA, Vercel'da yayında)

---

## Özet

Site içerik bakımından oldukça güçlü: 17 adet özgün, anahtar kelime hedefli makale, 6 ayrı hesaplama aracı (infaz yatar, vekâlet ücreti, tazminat, değer kaybı, dava süresi), düzgün bir sitemap, robots.txt, RSS ve manifest dosyası mevcut. SEO için kullanılabilecek altyapı (`SEO.jsx`, `LocalBusinessSchema.jsx`, `ArticleSchema.jsx`) kurulmuş.

Ancak tek bir kritik mimari sorun, bu içerik gücünü Google ve sosyal medya gözünde **görünmez** kılıyor: site bir Single Page Application (SPA) ve sunucudan dönen HTML her URL için aynı, jenerik. Bu sorun çözülmeden yapılacak diğer SEO çalışmaları sınırlı etki yaratır. Aşağıda öncelik sırasına göre 4 başlık altında bulguları topladım.

---

## 1) Kritik — Mutlaka Çözülmesi Gerekenler

### 1.1 SPA mimarisinden kaynaklı "boş HTML" sorunu (en yüksek öncelik)

`https://koptay.av.tr/` ve `https://koptay.av.tr/makale/trafik-kazasinda-taksirle-yaralama-sucu-hapis-cezasi-rehberi` sayfalarına `curl` ile bakıldığında **iki sayfa da bire bir aynı HTML'i** döndürüyor:

- Title: "Koptay Hukuk Bürosu - Profesyonel Avukatlık Hizmetleri"
- Description: "Profesyonel avukatlık hizmetleri ve hukuki danışmanlık. Deneyimli avukat kadromuzla yanınızdayız."
- `<div id="root"></div>` içi tamamen boş
- Hiçbir `og:`, `twitter:`, `canonical`, `hreflang` etiketi yok
- Yapısal veri (`application/ld+json`) yok

`SEO.jsx` ve `react-helmet-async` ancak JavaScript çalıştıktan sonra `<head>`'i güncelliyor. Sonuçları:

- WhatsApp, LinkedIn, Facebook, Twitter, Slack önizlemeleri JS çalıştırmaz; bağlantı paylaşıldığında **hep aynı genel başlık/açıklama** ve hatta görsel olmadan görünür.
- Googlebot JS render edebilir ama bu iki aşamalı bir süreçtir; indeksleme gecikir, "render budget" riskli içeriklerde (uzun makaleler, chart kütüphanesi yüklenen sayfalar) eksik indekslemeye yol açar.
- Bing, Yandex (Türkiye trafiğinin önemli kısmı) ve diğer botlar JS render konusunda zayıftır → makaleler ve hesaplama araçları sayfaları onlarda neredeyse hiç indekslenmez.

**Çözüm seçenekleri (önerilen sırayla):**

1. **Prerender (en hızlı kazanım, mevcut yapıya az dokunur)** — `vite-plugin-prerender` veya `react-snap` ile build sırasında her route için statik HTML üretmek. Vercel zaten statik dosyaları hızlı sunuyor; sitemap.xml'deki 31 URL için ~30 saniyelik bir build adımı yeterli.
2. **Vercel'in `@vercel/og` + serverless prerender** veya **Astro'ya geçiş** — orta vadede; içerik odaklı sayfalar için Astro ya da Next.js ideal.
3. **Next.js'e taşıma (uzun vadeli)** — App Router + ISR ile makaleler statik üretilir, hesaplama araçları client-side kalır. En sağlam çözüm.

İlk adımda prerender önerisi, `npm i -D vite-plugin-prerender` ile bir hafta içinde uygulanabilir; etkisi anında görülür.

### 1.2 LocalBusinessSchema'da yer tutucu (placeholder) veriler

`src/components/LocalBusinessSchema.jsx` dosyasında Google'ın indekslediği yapısal veride şu sorunlar var:

- `streetAddress: "Adresiniz Buraya"` — gerçek adres yazılmamış
- `postalCode: "06xxx"` — gerçek değer değil
- `sameAs: ["facebook.com/yourpage", "linkedin.com/in/yourprofile", "instagram.com/yourpage"]` — hepsi şablon
- `aggregateRating: { ratingValue: "5", reviewCount: "10" }` — **gerçek olmayan** yıldız puanı

Bu kritik: Google "fake review" yapısal verilerini tespit ettiğinde manuel ceza verebiliyor (Search Console'da "Yapılandırılmış veri içeren spam" ihlali). Aşağıdaki düzenlemeler yapılmalı:

- Gerçek ofis adresi, posta kodu, koordinat girilmeli
- Sosyal medya hesaplarının gerçek URL'leri konmalı (yoksa `sameAs` kaldırılmalı)
- `aggregateRating` **kaldırılmalı**; Google İşletme Profili (eski Google My Business) üzerinden gerçek yorumlar geldiğinde Google bunları kendi gösterir
- `LegalService` yerine daha spesifik `Attorney` türü tercih edilebilir

### 1.3 Çift dilli/çok dilli yapı eksik etiketler

`public/locales/` altında `tr, en, ar, ru, uk` çevirileri var ama:

- HTML'de `<link rel="alternate" hreflang="…" />` etiketi yok
- URL'lerde dil ön eki yok (`/en/...`, `/ar/...`)
- Dil seçici çalışsa bile arama motorları farklı dilleri ayrı ayrı indeksleyemez

Şu an çok dilli yapı SEO açısından "harcanmış efor" durumunda. İki seçenek:
1. Bir an önce tek dilli (TR) olarak konsolide et, çevirileri kaldır
2. Diğer dilleri de gerçekten yayınla → URL prefix + hreflang + dil bazlı sitemap

### 1.4 5 sayfada SEO bileşeni eksik

`<SEO />` bileşeni şu sayfalarda **kullanılmamış**:

- `IlaveTediyePage.jsx`
- `IscilikAlacaklariPage.jsx`
- `MeslekHastaligiPage.jsx`
- `TazminatHesaplamaPage.jsx`
- `TrafikKazasiPage.jsx`

Bu sayfalar (özellikle hesaplama araçları ve hukuk dalı landing'leri) tam da Google'da rekabet etmesi gereken sayfalar. Hepsine sayfa-spesifik `<SEO title=… description=… keywords=… />` eklenmeli.

---

## 2) Önemli — Yakın Zamanda Düzeltilmeli

### 2.1 Görsel optimizasyonu

- `public/images/hero-bg-1.jpg` 197 KB JPEG → WebP'ye dönüştürüldüğünde ~50–70 KB'a iner. AVIF ile daha da küçülür.
- `public/images/hero.jpg` sadece **43 byte** — bozuk veya yer tutucu dosya, kaldırılmalı.
- Makale görselleri 35–165 KB arasında; `<picture>` içinde WebP+JPG fallback iyi olur.
- `loading="lazy"` sadece `ArticleCard.jsx`'te var. Tüm fold-altı görsellere eklenmeli (`TeamMember`, `Insights`, `Hero` dışındakiler).
- `<img>` etiketlerine `width` ve `height` attribute'ları konmalı → CLS (Cumulative Layout Shift) düşer.
- Makale `image.alternativeText` alanı `articles.json`'da dolu — `alt={article.title}` yerine `alt={article.image?.alternativeText}` kullanılmalı.

### 2.2 Üçüncü taraf script'lerin yükleme sırası

`index.html` 58–64. satırda Microsoft Clarity **render-blocking** (async ama document.head'e yazılırken senkron). Google Analytics doğru biçimde `load` event'inden sonra yükleniyor. Clarity da aynı stratejiye geçirilmeli. Daha iyisi: ikisini de yalnızca cookie consent verildiğinde yükle (KVKK uyumu için gerekli).

### 2.3 KVKK / Cookie banner ve consent

`CookieConsent.jsx` mevcut ama Clarity ve GA banner'dan **önce** yükleniyor. Türkiye'de KVKK + AB ziyaretçiler için GDPR açısından bu yapılandırma riskli. Consent verilene kadar tracking script'leri tetiklenmemeli.

### 2.4 Makale sayfası SEO meta entegrasyonu

`articles.json` içinde her makalede `seoTitle`, `seoDescription`, `keywords`, `image.alternativeText` alanları zaten dolu. Ancak makale render'ında bunların `SEO.jsx` bileşenine doğru beslendiğini doğrulamak gerekiyor. `ArticlePage.jsx`'te:

```jsx
<SEO
  title={article.seoTitle || article.title}
  description={article.seoDescription || article.excerpt}
  keywords={article.keywords}
  image={article.image?.url}
  type="article"
  author={article.author}
  publishedTime={article.publishedAt}
  modifiedTime={article.updatedAt}
  url={`https://koptay.av.tr/makale/${article.slug}`}
/>
```

şeklinde olmalı. (Prerender uyguladıktan sonra bunlar build-time'da HTML'e işlenir.)

### 2.5 Sitemap ve robots.txt iyileştirmeleri

- `robots.txt` içinde `Disallow: /_next/` var ama site Next.js değil, gereksiz. Kaldırılabilir.
- Sitemap'te `lastmod` tarihleri hep `2026-04-26` (build tarihi). Makaleler için `articles.json`'daki gerçek `updatedAt` kullanılmalı → Google'ın taze içerik algısı güçlenir. `public/generate-sitemap.js`'te zaten data var, sadece tarih alanı yanlış kaynaktan geliyor olabilir.
- Sitemap'te makaleler dışında "kategori" sayfaları yok (örn. `/makaleler?kategori=is-hukuku`) — eklenirse iç linkleme ve indeksleme genişler.
- `image:image` namespace tanımlı ama makale URL'leri için kullanılmıyor. Her makale URL'sine `<image:image><image:loc>` eklenirse Google Görseller'de görünürlük artar.

### 2.6 İç linkleme ve içerik mimarisi

- Makaleler arası "ilgili makaleler" linki yok gibi görünüyor; eklenirse hem kullanıcı süresi hem PageRank dağılımı artar.
- Hesaplama aracı sayfaları (`/hesaplama-araclari/tazminat-hesaplama`) ile ilgili makaleler arasında çift yönlü link kurulmalı. Örn. tazminat hesaplama aracı → "tazminat hesaplama nasıl yapılır" makalesine, makale de araca bağlanmalı.
- Footer'da **şehir + hizmet** kombinasyonlu linkler ("Ankara İş Hukuku Avukatı", "Ankara Boşanma Avukatı") yerel SEO için çok güçlü. Ancak gerçekten o sayfalar varsa eklenmeli; yoksa landing oluşturulmalı.

---

## 3) İyileştirme Fırsatları — Sıra Geldiğinde

### 3.1 İçerik stratejisi

17 makale iyi bir başlangıç. Trafik çekecek konular için ipuçları:

- **Long-tail anahtar kelime** olan ve hesaplama aracı varsa (örn. "araç değer kaybı hesaplama 2026", "infaz yatar hesaplama 2026"), bu makalelere düzenli **yıl güncellemesi** yap. Tarih başlığa girince Google "evergreen" sinyalini güçlendiriyor.
- "Sıkça Sorulan Sorular" bölümü her makaleye eklensin → `FAQPage` schema ile rich result kazanırsınız.
- "How-to" tipi içeriklerde `HowTo` schema kullanılabilir (örn. "İşçilik alacağı davası nasıl açılır").
- Tablolu içerikler ("Tazminat oranları tablosu", "Yıllara göre asgari ücret") snippet'a girme şansı yüksek.

### 3.2 Yerel SEO (Ankara avukat aramaları)

- **Google İşletme Profili (Google Business Profile)** mutlaka açık ve güncel olmalı. Hizmet kategorisi "Avukat" + alt kategoriler.
- NAP tutarlılığı: Site, Google İşletme, sosyal medya, Avukatlar Birliği sayfasında **aynı isim/adres/telefon** yazsın.
- Gerçek müvekkil yorumları (Google'da, iş gelmesini istediğiniz yerde) — Trustpilot, e-Devlet'in avukat sorgu sayfası gibi otoriter kaynaklara link ver.

### 3.3 Yetkinlik / E-E-A-T sinyalleri

YMYL (Your Money, Your Life) kapsamında hukuk sitesi olarak Google E-E-A-T'i (Experience, Expertise, Authoritativeness, Trust) çok ciddiye alıyor:

- Her makaleye **yazar kutusu** (avukatın foto, baro sicil, tecrübe, alanı, LinkedIn) eklenmeli — `Person` ve `author` schema bağlanmalı.
- "Hakkımızda" sayfasında baro sicil numarası, mezun olunan üniversite, yayınlar gibi **doğrulanabilir** veriler olmalı.
- Mümkünse içeriklerde Yargıtay/Danıştay kararları, kanun maddeleri ile referans gösterilmeli.

### 3.4 Performans (Core Web Vitals)

`index.html` çok düzgün hazırlanmış (preconnect, preload, critical CSS inline, font-display:swap). Birkaç ek optimizasyon:

- Build çıktısında `vendor`, `react-vendor`, `chart-vendor`, `pdf-vendor` chunk'ları var — `pdf-vendor` (jspdf+html2canvas) sadece bazı hesaplama sayfalarında kullanılıyorsa **route-level lazy import** ile ana sayfadan çıkarılmalı; `chart-vendor` da öyle.
- LCP için hero görseli WebP/AVIF + `srcset` ile çoklu boyut olsa hız büyük artar.
- Font Awesome / lucide-react bundle boyutu kontrol edilmeli; 50+ ikon import ediliyor.

### 3.5 Erişilebilirlik (a11y → SEO'ya da yarar)

- Tüm `<img>` etiketlerinde anlamlı `alt`
- `<a>` linklerinde anlamlı metin (sadece "Devamı oku" yerine "Trafik kazası ceza davası rehberini oku")
- Renk kontrast oranı ≥ 4.5:1 (özellikle `#548c8d` üzerine beyaz metin)
- Form inputlarına `<label>` bağlama (`htmlFor`)

---

## 4) "Hızlı Kazanımlar" Listesi (1 hafta içinde uygulanabilir)

Aşağıdaki 8 madde mimariye dokunmadan, 1 sprintte tamamlanabilir ve etkisi büyük olur:

1. `LocalBusinessSchema.jsx` içindeki gerçek olmayan veriyi (adres, sosyal medya, fake rating) düzelt veya kaldır.
2. 5 sayfaya `<SEO />` bileşeni ekle (hesaplama araçları + hukuk dalı landing'leri).
3. `<img>` etiketlerinde `alt` değerini `article.image?.alternativeText` ile değiştir.
4. Makale görsellerini `loading="lazy"` ile işaretle, `width/height` ekle.
5. Hero görselini WebP'ye dönüştür (Sharp zaten devDependency'de var, küçük bir build script'i yeter).
6. Microsoft Clarity'yi consent + load event'ine taşı.
7. Sitemap `lastmod` alanını makalenin `updatedAt`'ından üret.
8. `robots.txt`'teki `Disallow: /_next/` satırını kaldır; `Disallow: /muvekkil-paneli` ve `/admin` korunsun.

Sonra orta vadeli bir karar verilmesi gereken büyük adım: **prerender ya da Next.js'e taşıma**. Bu olmadan diğer SEO çalışmalarının etkisi sınırlı kalır.

---

## 5) Ön Plana Çıkmak İçin Stratejik Öneriler

Teknik düzeltmelerin ötesinde, bir hukuk bürosunun Google'da fark yaratması için şu üç koldan ilerlemek gerekir:

**İçerik otoritesi:** Anahtar konularda (trafik, iş kazası, boşanma, ceza) **kümeleme (topic cluster)** stratejisi. Bir "pillar page" (örn. "Trafik Kazası Avukatı – Tam Rehber") + 10–15 destek makalesi + iç linkleme. Şu anda 17 dağınık makale var; 5–6 kümeye dönüşürse otorite ciddi artar.

**Yerel ve sosyal sinyaller:** Google İşletme Profili'nde her hafta paylaşım, gerçek müvekkillerden Google yorumu, LinkedIn'de avukatın aktif olması. Hukuk podcast'i, YouTube'da kısa video (kanun maddesi açıklayan 60-90 saniyelik dikey videolar) — bunlar arama dışından da trafik getirir ve "Av. Murat Can Koptay" markasını arayan kişi sayısını artırır.

**Hesaplama araçları stratejisi:** Site zaten 6 hesaplama aracı sunuyor — bu **çok değerli, herkeste yok**. Her aracın altında "Bu hesaplama nasıl yapılır?", "Mevzuat dayanağı", "Örnek karar", "Bir avukatla görüşmem gerekir mi?" CTA'sı + ilgili makale linki olmalı. Bu sayfalar için ayrıca `WebApplication` ya da `Calculator` schema kullanılabilir. Düzgün SEO ile bu sayfalar her ay **binlerce** ziyaret çekebilir; oradan müvekkil dönüşümü en kıymetli trafik tipidir.

---

## Ek: Şu an çalışan ve dokunulmaması gereken iyi şeyler

- Başlık etiketleri (`<title>`) ve `description` formatı doğru uzunlukta
- `manifest.json`, çok boyutlu favicon seti, `theme-color` mobilde mükemmel
- robots.txt + sitemap.xml + RSS üçlüsü mevcut ve doğru yerde
- Vercel cache header'ları (`max-age=31536000, immutable`) ideal
- Güvenlik header'ları (X-Frame-Options, CSP yan etkileri, Referrer-Policy) hazır
- React Helmet Async, react-router-dom, web-vitals — modern bir altyapı
- 17 makale Türkçe SEO için iyi yazılmış (anahtar kelime, başlık, açıklama bilinçli seçilmiş)
- Hesaplama araçları sektörde rakiplerin çoğunda yok → güçlü diferansiyasyon

---

**Sonuç:** Sitenin "iskeleti" sağlam, içeriği iyi. Tek bir mimari engel (SPA → boş HTML) çözülünce, mevcut emek meyveye dönecek. Önce 4 numaralı bölümdeki "Hızlı Kazanımlar"ı uygula, ardından prerender/Next.js geçişi planla. 3–6 ay içinde "Ankara avukat" + uzun kuyruklu sorgularda ciddi sıçrama beklenebilir.
