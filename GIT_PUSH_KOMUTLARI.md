# Git Push Komutları — Tüm SEO + Yeni Makale Değişiklikleri

Bu dosya, biriken tüm değişiklikleri (SEO altyapısı + konsol fixleri + yeni "Fazla Mesai Alacağı" makalesi + iç linkleme) GitHub'a push etmek için.

## Önemli: CRLF / index.lock Sorunlarına Dikkat

1. PowerShell'de **çok satırlı** commit mesajı `>>` continuation bekler — kaçırılırsa lock takılır. Bu yüzden tek satırlı mesaj kullanıyoruz.
2. Önceki başarısız commit'ten kalmış bir `.git/index.lock` varsa silinmeli (komut aşağıda).
3. `git status` 130+ false-positive (CRLF) dosya gösterebilir; biz sadece kendi dosyalarımızı ekleyeceğiz.

## Adım 1: Proje klasörüne git ve kilidi temizle

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

## Adım 2: Sadece bizim dosyalarımızı stage'le

```powershell
# 1) Modified files - SEO altyapısı
git add index.html
git add vercel.json
git add package.json
git add public/robots.txt
git add public/generate-sitemap.js
git add public/sitemap.xml
git add public/articles.json
git add articles.json
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

# 2) Modified files - Konsol hata fixleri
git add src/utils/analytics.js
git add src/utils/analyticsTracker.js
git add src/services/articleViewsService.js

# 3) Yeni dosyalar - SEO ve dokümantasyon
git add scripts/prerender.js
git add SEO_INCELEME_RAPORU.md
git add SEO_UYGULAMA_OZET.md
git add GIT_PUSH_KOMUTLARI.md
git add YENI_MAKALE_FAZLA_MESAI.md

# 4) Yeni görseller (WebP/AVIF)
git add public/images/hero-bg-1.webp
git add public/images/hero-bg-1.avif
git add public/images/articles/*.webp

# 5) Yeni makale görseli (eğer hazırladıysan ekle, hazırlamadıysan satırı atla)
# git add public/images/articles/fazla-mesai-alacagi-hesaplama-2026.jpg
```

## Adım 3: Stage'lenenleri doğrula

```powershell
git status
```

Beklenti: "Changes to be committed" altında **40+ dosya**. CRLF false-positive'leri "Changes not staged" altında bırakılır, dokunulmaz.

## Adım 4: Commit ve push (TEK SATIR mesaj)

```powershell
git commit -m "feat(seo): kapsamli SEO iyilestirmesi, yeni 'Fazla Mesai Alacagi' makalesi ve console hata fixleri"

git push origin main
```

## Adım 5: Vercel deploy takibi

Push'tan ~2-3 dakika sonra https://vercel.com/dashboard'tan deploy'un tamamlandığını kontrol et.

## Adım 6: Yayında doğrulama

```powershell
# Yeni makale URL'si açılmalı (canlıda title gözükmeli)
curl.exe -s https://koptay.av.tr/makale/fazla-mesai-alacagi-hesaplama-ispat-dava-sureci-2026 | Select-String "<title>"

# Anasayfa title artık jenerik degil
curl.exe -s https://koptay.av.tr/ | Select-String "<title>"

# Sitemap'te yeni makale gozukmeli
curl.exe -s https://koptay.av.tr/sitemap.xml | Select-String "fazla-mesai"

# Hesaplama aracinda yeni CTA bandi gozukmeli (browser'da kontrol)
# https://koptay.av.tr/hesaplama-araclari/iscilik-alacaklari
```

## Adım 7: Google Search Console'a bilgi ver

1. https://search.google.com/search-console adresine git
2. `koptay.av.tr` mülkiyetini seç
3. **Sitemaps** bölümünde "sitemap.xml" zaten eklenmişse "Yeniden Gönder"e tıkla
4. **URL Inspection** kutusuna yeni makale URL'sini yapıştır → "Live test" → "Request Indexing"

## Adım 8: Görseli sonra eklemek istersen

Görseli `public/images/articles/fazla-mesai-alacagi-hesaplama-2026.jpg` olarak hazırlayıp ekledikten sonra:

```powershell
git add public/images/articles/fazla-mesai-alacagi-hesaplama-2026.jpg
git commit -m "feat: fazla mesai makalesi gorseli eklendi"
git push origin main
```

## Sıkıntı çözümleri

**"Everything up-to-date"** → Aslında stage edilmedi; Adım 2'deki `git add` komutlarını yapıştırmadın. Önce `git status` ile kontrol et.

**"index.lock: File exists"** → `Remove-Item .git\index.lock -Force` çalıştır.

**`>>` continuation** → Çok satırlı commit mesajı yapıştırırken PowerShell takılır. Önce `Esc` veya `Ctrl+C` ile iptal, sonra TEK SATIR mesajı kullan.

**"pathspec did not match"** → O dosya yok, atla; diğer dosyalara geç.
