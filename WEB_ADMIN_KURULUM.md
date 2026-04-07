# Web Admin Paneli Kurulum Rehberi

## Ne Oluşturuldu?

Mevcut yerel admin panelinize (`/admin`) dokunmadan, web üzerinde çalışan yeni bir admin paneli (`/web-admin`) kuruldu.

### Özellikler

**Yönetim:**
- Dashboard (makale istatistikleri, kategori dağılımı, SEO uyarıları)
- Makale listesi (arama, filtreleme, SEO skor göstergesi)
- Makale oluşturma / düzenleme / silme (GitHub API üzerinden)

**Gelişmiş SEO Editörü:**
- ✅ Google SERP Önizleme (başlık, açıklama, URL gerçek zamanlı)
- ✅ SEO Skor Analizi (0-100 puan, 15+ kontrol)
- ✅ Odak Anahtar Kelime takibi (başlık, açıklama, URL, giriş, başlıklar, yoğunluk)
- ✅ Keyword Density (anahtar kelime yoğunluğu %1-3)
- ✅ Başlık yapısı analizi (H2, H3 hiyerarşisi)
- ✅ İçerik uzunluğu kontrolü (1500+ kelime hedefi)
- ✅ Paragraf uzunluğu kontrolü
- ✅ İç/Dış bağlantı analizi
- ✅ Görsel ve alt metin kontrolü
- ✅ Open Graph etiketleri (sosyal medya önizleme)
- ✅ Schema Markup Generator (Article, LegalService, HowTo, BlogPosting)
- ✅ FAQ Schema Builder (zengin sonuçlar için soru-cevap)
- ✅ Canonical URL desteği
- ✅ noIndex / noFollow ayarları
- ✅ Otomatik okuma süresi hesaplama
- ✅ Zengin Markdown editörü (tablo, iç bağlantı, SSS şablonu)

---

## Kurulum (Netlify Ortam Değişkenleri)

Netlify Dashboard → Site Settings → Environment Variables yolundan aşağıdaki değişkenleri ekleyin:

### Zorunlu (Auth için):
```
ADMIN_PASSWORD = SizinGüçlüŞifreniz
ADMIN_SECRET   = RastgeleBirUzunString123!@#$%
```

### Zorunlu (Makale yazma/düzenleme için):
```
GITHUB_TOKEN  = ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO   = kullanici-adi/koptay-site
GITHUB_BRANCH = main
```

### GitHub Token Oluşturma:
1. https://github.com/settings/tokens/new adresine gidin
2. "Fine-grained personal access tokens" seçin
3. Sadece ilgili repo'yu seçin
4. İzinler: **Contents → Read and write**
5. Token'ı kopyalayıp `GITHUB_TOKEN` olarak kaydedin

---

## Kullanım

### Erişim:
```
https://siteniz.netlify.app/web-admin/login
```

### Yerel Geliştirme:
Web admin Netlify Functions kullandığı için yerel geliştirmede:
```bash
npx netlify dev
```
komutuyla çalıştırın (standart `npm run dev` yerine).

### İş Akışı:
1. `/web-admin/login` adresinden şifre ile giriş yapın
2. Dashboard'da genel bakışı görün
3. "Yeni Makale" ile gelişmiş SEO editörünü açın
4. Odak anahtar kelime belirleyin → SEO skoru takip edin
5. "Kaydet & Deploy" butonuna tıklayın
6. Değişiklik GitHub'a commit olarak yazılır
7. Netlify otomatik rebuild yaparak siteyi günceller

---

## Dosya Yapısı

```
netlify/functions/
  admin-auth.js          → JWT tabanlı kimlik doğrulama
  admin-articles.js      → Makale CRUD (GitHub API)

src/web-admin/
  WebAdminLogin.jsx      → Giriş sayfası
  WebAdminProtectedRoute.jsx → Auth guard
  WebAdminLayout.jsx     → Sidebar layout
  WebAdminDashboard.jsx  → Dashboard
  WebAdminArticleList.jsx → Makale listesi
  WebAdminArticleEditor.jsx → Gelişmiş SEO editörü
```

---

## Mevcut Admin Panel

Yerel admin paneli (`/admin`) aynen korunmuştur. İki panel bağımsız çalışır:

| Özellik | Yerel Admin (`/admin`) | Web Admin (`/web-admin`) |
|---------|----------------------|------------------------|
| Çalışma | localhost:3002 Express | Netlify Functions |
| Auth | Sabit şifre | JWT + env variable |
| Veri | Dosya sistemi | GitHub API |
| Deploy | Manual git push | Otomatik rebuild |
| SEO | Temel alanlar | Gelişmiş analiz |
