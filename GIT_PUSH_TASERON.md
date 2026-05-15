# Git Push — Taşeron Makalesi + Promo/Ücretsiz Temizliği + Mobil Performans (15 Mayıs 2026)

Bu push tek bir commit'te şunları yayına alır:

**A) Yeni içerik**
- Yeni makale (`articles.json` ve `public/articles.json` — id 37, Taşeron İşçinin Hakları)
- Sitemap'e yeni URL ve görsel girişi
- Kapak görseli — orijinal + 3 responsive varyant (384w/768w/1200w, JPG + WebP)

**B) Pazarlama temizliği**
- `IscilikAlacaklariPage`: "Davanız İçin Kişiye Özel Hesap..." kutusu sadeleştirildi, "İlk değerlendirme ücretsizdir" + telefon CTA çıkarıldı
- `DavaSuresiPage`: "ücretsiz ön değerlendirme" çıkarıldı, kutu sadeleştirildi
- `HesaplamaAraclariPage`: "X adet ücretsiz" → "X adet"; alt CTA telefonu kaldırıldı
- `prerender.js`: Anasayfa ve hesaplama-araclari meta'larından "ücretsiz" çıkarıldı
- `articles.json` (Fazla Mesai): Sondaki pazarlama paragrafı + telefon satırı silindi
- `articles.json` (Araç Değer Kaybı, Maluliyet): "profesyonel hukuki destek" → "hukuki destek"
- `src/utils/api.js`, `scripts/sync-articles.js`: kod yorumlarından "ücretsiz" çıkarıldı

**C) Mobil performans iyileştirmesi (LCP düşürme + bundle azaltma)**
- `index.html`: Tam ekran "global-loader" kaldırıldı (LCP'yi 2-3 sn geciktiriyordu)
- `src/App.jsx`: Loader gizleme effect'i sadeleştirildi
- `src/pages/MeslekHastaligiPage.jsx`: `chart.js` static → dynamic import (chart-vendor 67 KiB ana sayfadan çıkar)
- `src/utils/imageOptimizer.js`: Gerçek responsive `<picture>` source helper'ları (WebP+JPG fallback)
- `src/pages/ArticlePage.jsx`: Yeni makaleler için `<picture>` rendering + responsive preload
- `src/components/SEO.jsx`: `imagesrcset`/`imagesizes` ile responsive preload desteği

## Adım 1: Proje klasörüne git ve kilidi temizle

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

## Adım 2: Değişen dosyaları stage'le

```powershell
# A) Makale + sitemap + içerik düzenleme
git add articles.json
git add public/articles.json
git add public/sitemap.xml

# A) Kapak görselleri — orijinal + responsive varyantlar
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.jpg"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.webp"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-384w.jpg"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-384w.webp"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-768w.jpg"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-768w.webp"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-1200w.jpg"
git add "public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-1200w.webp"

# B) Pazarlama temizliği
git add src/pages/IscilikAlacaklariPage.jsx
git add src/pages/DavaSuresiPage.jsx
git add src/pages/HesaplamaAraclariPage.jsx
git add scripts/prerender.js
git add scripts/sync-articles.js
git add src/utils/api.js

# C) Mobil performans
git add index.html
git add src/App.jsx
git add src/pages/MeslekHastaligiPage.jsx
git add src/utils/imageOptimizer.js
git add src/pages/ArticlePage.jsx
git add src/components/SEO.jsx

# Push talimatı (bu dosya)
git add GIT_PUSH_TASERON.md
```

> **Not:** `articles_backup_*.json` yedek dosyaları commit etmiyoruz; sadece yerel güvenlik kopyaları.

## Adım 3: Stage'lenenleri doğrula

```powershell
git status
```

Beklenti — "Changes to be committed" altında **24 dosya**:
- 8 modified (articles, sitemap, sayfalar, scripts, index.html, App, SEO, imageOptimizer)
- 8 new file (kapak görselinin orijinali + 3x2 responsive varyant)
- 1 modified (taseron makalesi içeriği — articles.json içinde)
- bu push talimat dosyası

## Adım 4: Commit ve push (TEK SATIR mesaj)

```powershell
git commit -m "feat: Taseron isci haklari makalesi + promo temizligi + mobil perf (loader, chart lazy, picture)"
git push origin main
```

## Adım 5: Vercel deploy takibi

Push'tan ~2-3 dakika sonra https://vercel.com/dashboard adresinden deploy'un tamamlandığını kontrol et.
Build sırasında `prerender.js` çalışacağı için anasayfa ve hesaplama-araclari meta'larındaki "ücretsiz" ifadeleri canlıdan da silinecek.

## Adım 6: Yayında doğrulama

```powershell
# Yeni makalenin canlıda title'ı görünmeli
curl.exe -s https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026 | Select-String "<title>"

# Sitemap'te yeni URL
curl.exe -s https://koptay.av.tr/sitemap.xml | Select-String "taseron"

# Kapak görseli + mobil varyant erişilebilir
curl.exe -I https://koptay.av.tr/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.jpg
curl.exe -I https://koptay.av.tr/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-384w.webp

# "ücretsiz" sıfır olmalı
curl.exe -s https://koptay.av.tr/ | Select-String -Pattern "ücretsiz"
curl.exe -s https://koptay.av.tr/hesaplama-araclari | Select-String -Pattern "ücretsiz"
curl.exe -s https://koptay.av.tr/hesaplama-araclari/iscilik-alacaklari | Select-String -Pattern "ücretsiz"
# >>> Hiçbiri sonuç dönmemeli

# Global loader kaldırıldı mı (eski cache değilse)
curl.exe -s https://koptay.av.tr/ | Select-String "global-loader"
# >>> Sonuç dönmemeli
```

## Adım 7: PageSpeed yeniden test

1. https://pagespeed.web.dev/ adresine git
2. URL: `https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026`
3. **Mobil** sekmesi → "Analiz et"
4. Beklenen değişim:
   - Performans skoru: 75 → **88-92 aralığı**
   - LCP: 6.1 sn → **2-3 sn**
   - "Resim yayınlamayı kolaylaştırın" uyarısı: **kaybolmalı veya çok düşük**
   - "Oluşturma engelleme istekleri" tasarrufu: **azalmalı**
   - Ağ bağımlılık ağacında **chart-vendor görünmemeli**

## Adım 8: Google Search Console

1. https://search.google.com/search-console
2. **Sitemaps** → "sitemap.xml" → "Yeniden Gönder"
3. **URL Inspection** → şu URL → "Live test" → "Request Indexing":
   ```
   https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026
   ```

## Sıkıntı çözümleri

**"Everything up-to-date"** → Adım 2'deki `git add` komutlarını yapıştırmadın. `git status` ile kontrol et.

**"index.lock: File exists"** → `Remove-Item .git\index.lock -Force` çalıştır.

**Görsel 404 dönüyorsa** → Vercel build log'unu kontrol et; `npm run build` lokal de başarılı oluyor mu?

**Hâlâ "global-loader" görünüyorsa** → Browser cache. CTRL+F5 ile yeniden yükle.

## Geri alma (gerekirse)

Yedekler hazır:
- `articles_backup_before_taseron_20260514_222300.json`
- `articles_backup_before_promo_clean_*.json`
- `public/articles_backup_*.json`

Geri almak istersen:
```powershell
Copy-Item articles_backup_before_promo_clean_<TARIH>.json articles.json -Force
Copy-Item public\articles_backup_before_promo_clean_<TARIH>.json public\articles.json -Force
git checkout HEAD~1 -- index.html src/App.jsx src/pages/MeslekHastaligiPage.jsx src/utils/imageOptimizer.js src/pages/ArticlePage.jsx src/components/SEO.jsx
```

## Yeni makale eklerken (gelecek için checklist)

Bu push ile gelen `responsive` flag'ı yeni makalelerde de kullanılabilir:

1. Kapak görselini 1200x630 olarak hazırla
2. ImageMagick ile 3 responsive varyant üret:
   ```bash
   for W in 384 768 1200; do
     convert original.jpg -resize ${W}x$((W*630/1200)) -quality 85 cover-${W}w.jpg
     convert cover-${W}w.jpg -quality 80 cover-${W}w.webp
   done
   ```
3. `public/images/articles/`'a koy
4. articles.json'da makalenin image obj'sine `"responsive": true` ekle
5. ArticlePage otomatik `<picture>` ile WebP+JPG fallback render eder
