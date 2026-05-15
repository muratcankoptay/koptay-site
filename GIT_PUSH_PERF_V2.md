# Git Push — Mobil Performans V2 (15 Mayıs 2026, akşam)

İlk perf paketinin Lighthouse skorunu 75'ten 69'a düşürmesinin sebebi tespit edildi:

1. **FCP +2.1 sn arttı** — Global loader kaldırılınca body boş kalıp tarayıcı paint edemedi
2. **chart-vendor hâlâ kritik yolda** — Vite modulePreload filter yetersiz; preload scanner agresif
3. **Cover image preload runtime'da geliyordu** — Helmet React mount sonrası ekliyordu, çok geç
4. **Logo preload israfı** — Tüm sayfalarda statik logo preload yapılıyordu

Bu push **dört düzeltmeyi** birden uygular:

## Yapılan Değişiklikler (6 dosya)

| Dosya | Düzeltme |
|---|---|
| `index.html` | Global loader yerine paint edilebilir minimal **boot skeleton** (top bar + spacer) eklendi → FCP düşer; logo.svg preload kaldırıldı |
| `src/App.jsx` | `boot-skeleton` ve eski `global-loader` mount'ta temizleniyor |
| `vite.config.js` | `modulePreload: false` — Vite'ın agresif preload davranışı kapatıldı; chart-vendor sadece gerçek ihtiyaç olunca yüklenir |
| `scripts/prerender.js` | Makale sayfalarına **build-time** `<link rel="preload" as="image" imagesrcset>` ekleniyor (responsive, mobile-first) |
| `src/components/SEO.jsx` | `imageSrcSet` / `imageSizes` (camelCase) — React'in preload attribute'larını doğru DOM'a basması için |
| `src/pages/ArticlePage.jsx` | `<picture>` içindeki `<img>` artık küçük JPG varyantlardan birini fallback yapıyor (büyük 1200w'i değil) |

## Adım 1: Proje klasörüne git ve kilidi temizle

```powershell
cd C:\Users\KOPTAY\Desktop\PROJELER\koptay-site
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

## Adım 2: Stage et

```powershell
git add index.html
git add src/App.jsx
git add vite.config.js
git add scripts/prerender.js
git add src/components/SEO.jsx
git add src/pages/ArticlePage.jsx
git add GIT_PUSH_PERF_V2.md
```

## Adım 3: Doğrula

```powershell
git status
```

Beklenti — "Changes to be committed" altında **7 dosya** (6 modified + 1 new push talimatı).

## Adım 4: Commit ve push

```powershell
git commit -m "perf: FCP recovery skeleton, chart-vendor isolation, build-time LCP preload"
git push origin main
```

## Adım 5: Vercel deploy + doğrulama

Push'tan ~2-3 dk sonra:

```powershell
# 1) Cover image preload HTML'de var mı? (build-time, en kritik kontrol)
curl.exe -s https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026 | Select-String "rel=`"preload`" as=`"image`""
# >>> Beklenen: bir satır eşleşme; imagesrcset içermesi lazım

# 2) Boot skeleton HTML'de var mı?
curl.exe -s https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026 | Select-String "boot-skeleton"
# >>> Beklenen: bir eşleşme

# 3) Logo preload kaldırıldı mı?
curl.exe -s https://koptay.av.tr/ | Select-String "preload.*logo.svg"
# >>> Beklenen: sonuç yok

# 4) chart-vendor hâlâ modulepreload listesinde mi? Olmamalı.
curl.exe -s https://koptay.av.tr/makale/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026 | Select-String "modulepreload.*chart"
# >>> Beklenen: sonuç yok

# 5) Görsel varyantları erişilebilir
curl.exe -I https://koptay.av.tr/images/articles/taseron-isci-haklari-asil-isveren-alt-isveren-muvazaa-2026-384w.webp
# >>> 200 OK
```

## Adım 6: PageSpeed yeniden test

1. https://pagespeed.web.dev/ → URL: makale sayfası → **Mobil**
2. Beklenen değişim:
   - **FCP**: 3.9 sn → **1.5-2 sn** (skeleton sayesinde)
   - **LCP (Lighthouse)**: 6.0 sn → **2.5-3 sn** (build-time preload sayesinde)
   - **Performans**: 69 → **88-92**
   - **Ağ ağacı**: chart-vendor görünmemeli
   - **"Resim yayınlamayı kolaylaştırın"** uyarısı: kaybolur veya çok düşer

## Riskler ve geri alma

- **Boot skeleton görünümü garip olursa**: index.html'deki div'in stilini düzenle, devre dışı bırakmak için sil
- **chart sayfaları yavaş yüklenirse** (chart-vendor artık preload edilmiyor): TazminatHesaplama, MeslekHastaligi, TrafikKazasi sayfa açıldığında ilk render'da küçük bir gecikme olur. Bunlar zaten loader gösteriyor (Suspense fallback), kullanıcı algılamaz.
- **Geri alma**: `git revert HEAD` tek commit'i geri alır; push'la canlıya döner.

## Bilgi: Neden bu sefer çalışacak?

Önceki paketin çalışmamasının kanıtları PageSpeed çıktısında somuttu:

- `<link rel="preload" as="image" href="/logo.svg">` — sadece **logo** preload ediliyordu (cover değil)
- Ağ ağacında `index.js → chart-vendor` edge'i — Vite filter'ı yetersizdi
- Body'de paint edilebilir hiçbir şey yoktu — FCP 3.9 sn

Bu paket bu üç sorunu HTML çıktısında doğrudan çözer:

- Build-time `<link rel="preload" as="image" imagesrcset>` HTML'in `<head>` bölümünde olur — React mount beklenmez
- `modulePreload: false` Vite'ın preload scanner besleme davranışını tamamen kapatır
- Boot skeleton tarayıcının ilk paint'i için somut DOM verir
