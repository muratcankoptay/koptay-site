# Git Push Komutları — SEO + Console Hata Düzeltmeleri

Bu dosya, yapılan tüm değişiklikleri Windows PowerShell veya Git Bash üzerinden GitHub'a push etmek için hazırlanmıştır.

## Önemli: CRLF Sorunu

Linux mount'tan baktığımda 158 dosya "değişmiş" gözüküyor ama gerçekten değişen 23 dosya. Geri kalanı CRLF/LF satır sonu farkından gelen false positive. Aşağıdaki komutlar SADECE gerçek değişiklikleri stage'ler.

## Adım 1: Proje klasörüne git

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
```

## Adım 2: Sadece bizim değiştirdiğimiz dosyaları stage'le

```powershell
# Modified files (içerik gerçekten değişti)
git add index.html
git add vercel.json
git add package.json
git add public/robots.txt
git add public/generate-sitemap.js
git add public/sitemap.xml
git add src/components/CookieConsent.jsx
git add src/components/LocalBusinessSchema.jsx
git add src/components/ArticleSchema.jsx
git add src/components/Hero.jsx
git add src/components/ArticleCard.jsx
git add src/components/Footer.jsx
git add src/components/TeamMember.jsx
git add src/pages/Home.jsx
git add src/pages/MakalelerPage.jsx
git add src/pages/ArticlePage.jsx
git add src/pages/IlaveTediyePage.jsx
git add src/pages/IscilikAlacaklariPage.jsx
git add src/pages/MeslekHastaligiPage.jsx
git add src/pages/TazminatHesaplamaPage.jsx
git add src/pages/TrafikKazasiPage.jsx

# Konsol hata fixleri (yeni eklenenler)
git add src/utils/analytics.js
git add src/utils/analyticsTracker.js
git add src/services/articleViewsService.js

# Yeni dosyalar
git add scripts/prerender.js
git add SEO_INCELEME_RAPORU.md
git add SEO_UYGULAMA_OZET.md
git add GIT_PUSH_KOMUTLARI.md

# Yeni görseller (WebP/AVIF)
git add public/images/hero-bg-1.webp
git add public/images/hero-bg-1.avif
git add public/images/articles/*.webp
```

## Adım 3: Stage edilenleri kontrol et

```powershell
git status
```

`Changes to be committed` listesi yukarıdaki ~45 dosyayı içermeli. `Changes not staged` kısmında 130+ dosya görebilirsiniz — onlar CRLF false-positive, **dokunmuyoruz**.

## Adım 4: Commit ve push

```powershell
git commit -m "feat(seo): kapsamli SEO iyilestirmeleri ve console hata duzeltmeleri

SEO altyapisi:
- scripts/prerender.js: build sonrasi her route icin statik HTML uretir (35 sayfa)
- LocalBusinessSchema: sahte rating/sosyal medya kaldirildi, gercek adres eklendi
- 5 hesaplama sayfasina <SEO /> bileseni eklendi (TrafikKazasi, IlaveTediye, IscilikAlacaklari, MeslekHastaligi, TazminatHesaplama)
- ArticlePage: seoTitle/seoDescription/keywords/publishedAt dogru alanlardan okunuyor
- Hero gorseli WebP/AVIF + image-set fallback chain
- 9 makale gorseli WebP versiyonu (-285 KB)
- Tum gorsellere width/height + loading=lazy + alternativeText alt
- Sitemap: image:image entries, kategori sayfalari, dogru lastmod (39 URL)
- robots.txt: AI bot opt-out, /muvekkil-paneli engellendi
- KVKK uyumlu analytics: Clarity ve GA artik consent sonrasi yukleniyor
- vercel.json: cleanUrls, daha kati rewrite kurallari

Konsol hata duzeltmeleri:
- analytics.js / analyticsTracker.js: production'da no-op (DEV-only)
- articleViewsService.js: localStorage fallback (Netlify endpoint disable)"

git push origin main
```

## Adım 5: Vercel deploy takibi

Push sonrası Vercel otomatik build başlatır. https://vercel.com/dashboard'dan takip edin (~2-3 dakika).

## Adım 6: Doğrulama

Build tamamlandıktan ~1 dk sonra:

```powershell
# Yeni meta verisi gorunmeli (artik jenerik degil)
curl.exe -s https://koptay.av.tr/ | Select-String "<title>"
# Bekleniyor: "Koptay Hukuk Burosu | Ankara Avukat..."

# Bir makalenin OG tag'i de prerender edilmis olmali
curl.exe -s https://koptay.av.tr/makale/trafik-kazasinda-taksirle-yaralama-sucu-hapis-cezasi-rehberi | Select-String "og:title"

# Konsol hatalari gitmeli (Chrome DevTools'ta sayfayi yenile)
```

## Bonus: CRLF sorunu kalici cozum (opsiyonel)

```powershell
git config core.autocrlf true
```

Bu ayarla bir daha tarihinizi kirletmezsiniz; yine de zaten commit yapilmis dosyalari etkilemez, sadece yeni edit'lerde devreye girer.

## Push Sonrasi Kontrol Listesi

- [ ] Vercel deploy "Ready" oldu mu? (Dashboard'da yesil)
- [ ] https://koptay.av.tr/ acildiginda title'da "Ankara Avukat" geciyor mu?
- [ ] Bir makale URL'sini WhatsApp'ta paylas — onizleme cikiyor mu?
- [ ] Chrome DevTools konsol temiz mi? (localhost:3003 ve Netlify hatalari gitmis olmali)
- [ ] Google Search Console'a yeniden sitemap gonder: https://search.google.com/search-console
- [ ] PageSpeed Insights testi: https://pagespeed.web.dev/?url=https%3A%2F%2Fkoptay.av.tr
