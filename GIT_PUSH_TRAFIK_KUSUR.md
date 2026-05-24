# Git Push — Trafik Kazalarında Kusur Tespiti Makalesi (19 Mayıs 2026)

Bu push tek bir commit'te şunları yayına alır:

**Yeni içerik**
- Yeni makale id 38, kategori: Sigorta Hukuku
- Slug: `trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026`
- Uzunluk: **7356 kelime** (Hibrit Pillar Page + 35 senaryo galerisi)
- Telif kontrolü: 6-gram %0.03 örtüşme (taşeron makalesinde %0.84 idi — daha da güvenli)
- TRAMER itiraz, sigorta tahkim, değer kaybı, maluliyet, taksirle yaralama gibi 6 mevcut makaleye iç link verir → tüm trafik makalelerinin SEO otoritesini yukarı çeker

**Görsel paketi**
- Kapak görseli orijinal (1200x630)
- 4 responsive varyant: 384w, 512w, 768w, 1200w (JPG + WebP, toplam 10 dosya)
- Mobilde 384w WebP yalnızca 4 KB (önceki taşeron pattern'i ile aynı)

**Sitemap**
- Yeni URL priority 0.9 ile en üste eklendi (yeni içerik vurgusu)

## Adım 1: Proje klasörüne git

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

## Adım 2: Stage et (12 dosya)

```powershell
# Makale içeriği
git add articles.json
git add public/articles.json
git add public/sitemap.xml

# Kapak görselleri (orijinal + 4 responsive varyant, JPG + WebP)
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026.jpg"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026.webp"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-384w.jpg"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-384w.webp"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-512w.jpg"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-512w.webp"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-768w.jpg"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-768w.webp"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-1200w.jpg"
git add "public/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-1200w.webp"

# Push talimatı (bu dosya)
git add GIT_PUSH_TRAFIK_KUSUR.md
```

> **Not:** `articles_backup_before_trafik_kusur_*.json` yedek dosyaları commit etmiyoruz.

## Adım 3: Doğrula

```powershell
git status
```

Beklenti: 14 dosya — 3 modified + 10 new image + 1 new push doc.

## Adım 4: Commit ve push

```powershell
git commit -m "feat(makale): Trafik kazalarinda kusur tespiti ve bilirkisi raporu rehberi (id 38, 7356 kelime)"
git push origin main
```

## Adım 5: Vercel deploy + doğrulama

Push'tan ~2-3 dk sonra Vercel deploy'unu kontrol et, sonra:

```powershell
# 1) Makale canlıda
curl.exe -s https://koptay.av.tr/makale/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026 | Select-String "<title>"

# 2) Sitemap yeni URL'yi içeriyor
curl.exe -s https://koptay.av.tr/sitemap.xml | Select-String "kusur-tespiti"

# 3) Görsel varyantları erişilebilir
curl.exe -I https://koptay.av.tr/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026-384w.webp
curl.exe -I https://koptay.av.tr/images/articles/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026.jpg

# 4) responsive preload HTML'e basıldı mı (perf v2 prerender)
curl.exe -s https://koptay.av.tr/makale/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026 | Select-String "imagesrcset"
```

## Adım 6: Google Search Console

1. https://search.google.com/search-console
2. **Sitemaps** → "sitemap.xml" → "Yeniden Gönder"
3. **URL Inspection** → şu URL → "Live test" → "Request Indexing":
   ```
   https://koptay.av.tr/makale/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026
   ```

## SEO ve Trafik Stratejisi

Bu makale şu hedef sorgular için konumlanmıştır (Google Search):

**Pillar sorgular (yüksek hacim):**
- "trafik kazası kusur tespiti"
- "bilirkişi raporu trafik kazası"
- "trafik kazası kusur oranı nasıl belirlenir"
- "trafik bilirkişi raporuna itiraz"
- "asli kusur trafik kazası"
- "müterafik kusur"

**Long-tail (senaryo) sorgular:**
- "kırmızı ışıkta geçen yayaya çarpma kim kusurlu"
- "arkadan çarpma kusur oranı"
- "kavşakta sağdan gelen yol vermeme"
- "u-dönüşü kazası kim kusurlu"
- "yaya geçidi kazası kim suçlu"
- "alkollü kaza müterafik kusur"

**İç linkleme stratejisi:** Mevcut TRAMER itirazı, sigorta tahkim, değer kaybı, maluliyet ve taksirle yaralama makalelerine internal link verildi. Bu, hem yeni makaleye anchor text gücü taşır, hem mevcut makalelerin tıklanma oranını artırır.

## Geri alma

```powershell
git revert HEAD
git push origin main
```

veya yerel yedekleri kullan:
```powershell
Copy-Item articles_backup_before_trafik_kusur_*.json articles.json -Force
Copy-Item public\articles_backup_before_trafik_kusur_*.json public\articles.json -Force
```
