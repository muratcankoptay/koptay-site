# Git Push — Taşeron Makalesi + Promo/Ücretsiz Temizliği (15 Mayıs 2026)

Bu push tek bir commit'te şunları yayına alır:

**Yeni içerik**
- Yeni makale (`articles.json` ve `public/articles.json` — id 37, Taşeron İşçinin Hakları)
- Sitemap'e yeni URL ve görsel girişi
- Kapak görseli (`taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.jpg` + `.webp`)

**Pazarlama temizliği (4 sayfa, 1 prerender, 1 utils, 1 script + tüm makale içerikleri)**
- `IscilikAlacaklariPage`: "Davanız İçin Kişiye Özel Hesap..." kutusu sadeleştirildi, "İlk değerlendirme ücretsizdir" kaldırıldı, telefon CTA'sı kaldırıldı
- `DavaSuresiPage`: "ücretsiz ön değerlendirme" ifadesi kaldırıldı, kutu sadeleştirildi
- `HesaplamaAraclariPage`: "X adet ücretsiz hesaplama aracı" → "X adet hesaplama aracı"; alt CTA'daki telefon kaldırıldı
- `prerender.js`: Anasayfa ve hesaplama-araclari meta'larından "ücretsiz" çıkarıldı
- `articles.json` (Fazla Mesai): Sondaki pazarlama paragrafı + telefon satırı silindi
- `articles.json` (Araç Değer Kaybı, Maluliyet): "profesyonel hukuki destek" → "hukuki destek"
- `src/utils/api.js`, `scripts/sync-articles.js`: kod yorumlarından "ücretsiz" çıkarıldı

## Adım 1: Proje klasörüne git ve kilidi temizle

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

## Adım 2: Değişen dosyaları stage'le

```powershell
# Yeni makale + içerik
git add articles.json
git add public/articles.json
git add public/sitemap.xml

# Yeni dosyalar - kapak görselleri
git add public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.jpg
git add public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.webp

# Pazarlama temizliği yapılan sayfalar
git add src/pages/IscilikAlacaklariPage.jsx
git add src/pages/DavaSuresiPage.jsx
git add src/pages/HesaplamaAraclariPage.jsx

# Meta description ve script temizliği
git add scripts/prerender.js
git add scripts/sync-articles.js
git add src/utils/api.js

# Push talimat dosyası (kendisi)
git add GIT_PUSH_TASERON.md
```

> **Not:** `articles_backup_*.json` yedek dosyaları commit etmiyoruz; sadece yerel güvenlik kopyaları.

## Adım 3: Stage'lenenleri doğrula

```powershell
git status
```

Beklenti — "Changes to be committed" altında **11 dosya**:
- modified: articles.json, public/articles.json, public/sitemap.xml
- modified: src/pages/IscilikAlacaklariPage.jsx, DavaSuresiPage.jsx, HesaplamaAraclariPage.jsx
- modified: scripts/prerender.js, scripts/sync-articles.js, src/utils/api.js
- new file: public/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.jpg / .webp
- new file: GIT_PUSH_TASERON.md

## Adım 4: Commit ve push (TEK SATIR mesaj)

```powershell
git commit -m "feat: Taseron isci haklari makalesi (id 37) + promo/ucretsiz ifade temizligi"
git push origin main
```

## Adım 5: Vercel deploy takibi

Push'tan ~2-3 dakika sonra https://vercel.com/dashboard adresinden deploy'un tamamlandığını kontrol et.

## Adım 6: Yayında doğrulama

```powershell
# Yeni makalenin canlıda title'ı görünmeli
curl.exe -s https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026 | Select-String "<title>"

# Sitemap'te yeni URL
curl.exe -s https://koptay.av.tr/sitemap.xml | Select-String "taseron"

# Kapak görseli erişilebilir
curl.exe -I https://koptay.av.tr/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026.jpg

# "ücretsiz" sıfır olmalı (anasayfa + hesaplama-araclari + iscilik-alacaklari)
curl.exe -s https://koptay.av.tr/ | Select-String -Pattern "ücretsiz"
curl.exe -s https://koptay.av.tr/hesaplama-araclari | Select-String -Pattern "ücretsiz"
curl.exe -s https://koptay.av.tr/hesaplama-araclari/iscilik-alacaklari | Select-String -Pattern "ücretsiz"
# >>> Hiçbiri sonuç dönmemeli
```

## Adım 7: Google Search Console'a bilgi ver

1. https://search.google.com/search-console adresine git
2. `koptay.av.tr` mülkiyetini seç
3. **Sitemaps** → "sitemap.xml" → "Yeniden Gönder"
4. **URL Inspection** → şu URL'yi yapıştır → "Live test" → "Request Indexing":
   ```
   https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026
   ```

## Sıkıntı çözümleri

**"Everything up-to-date"** → Adım 2'deki `git add` komutlarını yapıştırmadın. `git status` ile kontrol et.

**"index.lock: File exists"** → `Remove-Item .git\index.lock -Force` çalıştır.

**Görsel 404 dönüyorsa** → Vercel build log'unu kontrol et; build başarısızsa manuel `npm run build` yapıp tekrar push et.

## Geri alma (gerekirse)

Yedekler hazır:
- `articles_backup_before_taseron_20260514_222300.json`
- `articles_backup_before_promo_clean_*.json`
- `public/articles_backup_before_taseron_20260514_222748.json`
- `public/articles_backup_before_promo_clean_*.json`

Geri almak istersen:
```powershell
Copy-Item articles_backup_before_promo_clean_<TARIH>.json articles.json -Force
Copy-Item public\articles_backup_before_promo_clean_<TARIH>.json public\articles.json -Force
```
