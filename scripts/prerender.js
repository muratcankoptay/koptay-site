#!/usr/bin/env node
/**
 * Static Prerender — koptay.av.tr
 *
 * Vite build sonrası dist/index.html'i şablon olarak alıp, her route için
 * o route'a özel <title>, <meta description>, Open Graph, Twitter Card,
 * canonical ve JSON-LD verilerini sunucu tarafında HTML'e enjekte eder.
 *
 * Sonuç: Vercel'da her URL için "bot-dostu" statik HTML dönüşür. Google,
 * Bing, Yandex, WhatsApp, Facebook, LinkedIn vs. tam metadata görür.
 * Gerçek kullanıcılar yine React SPA'yı yükler; bu HTML sadece ilk yanıttır.
 *
 * Bu yaklaşım Puppeteer/Headless Chrome gerektirmez — saniyeler içinde çalışır.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRACTICE_AREAS } from '../src/data/services.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://koptay.av.tr';
const DIST = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const ARTICLES_JSON = path.resolve(__dirname, '../articles.json');

// XML/HTML special characters
const escapeHtml = (str = '') => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ dist/index.html bulunamadı. Önce `vite build` çalıştırın.');
  process.exit(1);
}

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
const articlesData = fs.existsSync(ARTICLES_JSON)
  ? JSON.parse(fs.readFileSync(ARTICLES_JSON, 'utf-8'))
  : { data: [] };
const articles = articlesData.data || [];

// Tek bir HTML üretici: title, description, OG/Twitter, canonical, json-ld bloklarını ekler.
// preloadImage true ise LCP optimizasyonu için <link rel="preload" as="image"> eklenir;
// responsive flag varsa imagesrcset/imagesizes ile mobil önce yapısı kullanılır.
function buildHtml({ title, description, keywords, url, image, type = 'website', extraJsonLd = [], publishedTime, modifiedTime, author, preloadImage = false, responsiveImage = false }) {
  const absoluteImage = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
    : `${SITE_URL}/images/og/og-default.jpg`;

  // Replace <title> and <meta name="description">
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(description)}" />`);

  // LCP image preload — build-time HTML'e basılır, böylece tarayıcı React mount olmadan görseli çekmeye başlar
  let preloadBlock = '';
  if (preloadImage && image && !image.startsWith('http')) {
    if (responsiveImage) {
      // Beklenen convention: image -> /images/articles/foo.jpg
      // Varyantlar: foo-384w.webp, foo-768w.webp, foo-1200w.webp
      const lastDot = image.lastIndexOf('.');
      const base = image.slice(0, lastDot);
      const webpSrcSet = [384, 512, 768, 1200].map(w => `${SITE_URL}${base}-${w}w.webp ${w}w`).join(', ');
      const sizes = '(max-width: 768px) min(100vw, 512px), (max-width: 1280px) min(80vw, 768px), 1024px';
      preloadBlock = `
    <!-- LCP cover image preload (responsive WebP) -->
    <link rel="preload" as="image" type="image/webp" imagesrcset="${escapeHtml(webpSrcSet)}" imagesizes="${escapeHtml(sizes)}" fetchpriority="high">`;
    } else {
      preloadBlock = `
    <!-- LCP cover image preload -->
    <link rel="preload" as="image" href="${escapeHtml(absoluteImage)}" fetchpriority="high">`;
    }
  }

  // Build SEO meta block
  const seoBlock = `${preloadBlock}
    <!-- Prerendered SEO meta — kullanıcılar React'i yüklerken botlar bu bloğu görür -->
    <meta name="keywords" content="${escapeHtml(keywords || '')}" />
    <meta name="author" content="${escapeHtml(author || 'Av. Murat Can Koptay')}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="language" content="Turkish" />
    <meta name="geo.region" content="TR-06" />
    <meta name="geo.placename" content="Ankara" />
    <link rel="canonical" href="${escapeHtml(url)}" />

    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(absoluteImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:site_name" content="Koptay Hukuk Bürosu" />
    <meta property="og:locale" content="tr_TR" />
    ${publishedTime ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />` : ''}
    ${modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />` : ''}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(absoluteImage)}" />
  `;

  const jsonLdBlock = extraJsonLd
    .map(obj => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ');

  // Insert before </head>
  html = html.replace('</head>', `${seoBlock}\n    ${jsonLdBlock}\n  </head>`);

  return html;
}

// TBB Madde 7/e uyumlu LegalService JSON-LD (priceRange / knowsAbout yok)
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": `${SITE_URL}/#legal-service`,
  "name": "Koptay Hukuk Bürosu",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.svg`,
  "image": `${SITE_URL}/images/og/og-default.jpg`,
  "telephone": "+905307111864",
  "email": "info@koptay.av.tr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Aziziye Mah. Willy Brandt Sk. No:7/1",
    "addressLocality": "Çankaya",
    "addressRegion": "Ankara",
    "postalCode": "06690",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.9208,
    "longitude": 32.8541
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }],
  "areaServed": { "@type": "City", "name": "Ankara" },
  "inLanguage": "tr-TR"
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "url": SITE_URL,
  "name": "Koptay Hukuk Bürosu",
  "inLanguage": "tr-TR",
  "publisher": { "@id": `${SITE_URL}/#organization` }
};

// --- Hesaplama aracı JSON-LD yardımcıları ---
const buildCalculatorJsonLd = ({ name, description, url }) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": name,
  "description": description,
  "url": url,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
  "provider": { "@id": `${SITE_URL}/#legal-service` },
  "inLanguage": "tr-TR"
});

const buildFaqJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": { "@type": "Answer", "text": item.a }
  }))
});

const buildToolBreadcrumb = (name, url) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": `${SITE_URL}/` },
    { "@type": "ListItem", "position": 2, "name": "Hesaplama Araçları", "item": `${SITE_URL}/hesaplama-araclari` },
    { "@type": "ListItem", "position": 3, "name": name, "item": url }
  ]
});

const buildMaluliyetHowTo = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Trafik kazası maluliyet (engellilik) oranı nasıl hesaplanır?",
  "description": "Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik (Ek-2 cetveli) ve Balthazard formülü esas alınarak, soru-cevap akışıyla maluliyet oranının adım adım hesaplanması.",
  "totalTime": "PT3M",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Yaralanan bölgeyi seçin", "text": "Vücudunuzun hangi bölgesinin yaralandığını seçin (kol, bacak, omurga, kafa, göz, kulak, iç organlar vb.)." },
    { "@type": "HowToStep", "position": 2, "name": "Yaralanma türünü ve kalıcı durumu belirtin", "text": "Yaralanma türünü (kırık, çıkık, ampütasyon, sinir hasarı) ve iyileşme sonrası kalıcı kısıtlılık derecesini işaretleyin. Araç, Ek-2 cetvelindeki kesin değeri veya tahmini aralığı bulur." },
    { "@type": "HowToStep", "position": 3, "name": "Tüm yaralanmaları ekleyin", "text": "Birden fazla yaralanma varsa hepsini tek tek ekleyin; oranlar daha sonra Balthazard formülüyle birleştirilecektir." },
    { "@type": "HowToStep", "position": 4, "name": "Yaş ve kaza tarihini girin", "text": "Yaşınızı (65 ve üzeri ise orana %10 eklenir) ve kaza tarihini (uygulanacak yönetmeliği belirler) girin." },
    { "@type": "HowToStep", "position": 5, "name": "Birleştirilmiş maluliyet oranını görün", "text": "Hesapla butonuna basın; araç Balthazard formülüyle birleştirilmiş maluliyet oranını ve adım adım dökümünü gösterir." }
  ]
});

// Sayfadaki görünür SSS ile birebir eşleşmelidir (TrafikKazasiTazminatiPage.jsx FAQ_ITEMS)
const FAQ_TRAFIK_TAZMINAT = [
  { q: 'Trafik kazasında maluliyet tazminatı nasıl hesaplanır?', a: 'Sürekli sakatlık tazminatı; kişinin yaş ve cinsiyetine göre TRH-2010 yaşam tablosundan bulunan bakiye ömür, yıllık net kazanç ve maluliyet oranının çarpımıyla hesaplanır. Hesap aktif (60 yaşa kadar) ve pasif (sonrası) dönem olarak ikiye ayrılır; bulunan tutardan mağdurun kusuru oranında indirim yapılır.' },
  { q: 'Maluliyet oranı nereden ve nasıl belirlenir?', a: 'Maluliyet oranı; Adli Tıp Kurumu veya sağlık kurulu raporu vermeye yetkili üniversite, eğitim-araştırma ve devlet hastanelerinden alınan sağlık kurulu (heyet) raporuyla belirlenir. Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik esas alınır; rapora itiraz hakkınız saklıdır.' },
  { q: 'Geçici iş göremezlik tazminatı nedir?', a: 'Kaza sonrası iyileşme sürecinde çalışamadığınız (raporlu) günler için ödenen tazminattır. Raporlu gün sayısı ile günlük net kazancınız çarpılarak bulunur; gerçek kazanç ispat edilemiyorsa asgari ücret esas alınır.' },
  { q: 'Bakıcı gideri hangi ücret üzerinden hesaplanır?', a: 'Yargıtay yerleşik içtihatlarına göre bakıcı gideri, başkasının bakımına muhtaç kalınan gün sayısı ile brüt asgari ücretin çarpımı üzerinden hesaplanır. Profesyonel bakıcı tutulmasa dahi bu gider talep edilebilir.' },
  { q: 'Trafik kazası tazminat davasının zamanaşımı kaç yıldır?', a: 'TBK m.72 uyarınca haksız fiilden doğan tazminat davası, zararın ve failin öğrenilmesinden itibaren 2 yıl, her hâlde 10 yıl içinde açılmalıdır. Kaza suç teşkil ediyorsa daha uzun ceza zamanaşımı süresi uygulanır. Sigortacıya karşı taleplerde KTK m.109 gereği 2 yıllık özel zamanaşımı geçerlidir.' },
  { q: 'Maluliyet tazminatını sigorta mı yoksa kusurlu sürücü mü öder?', a: 'Bedensel zararlar, teminat limitleri dahilinde aracın zorunlu trafik sigortasından ödenir (KTK m.85). Sigorta limitini aşan kısım ve manevi tazminat için kusurlu sürücüye karşı dava açılır. Manevi tazminat zorunlu trafik sigortası teminatı dışındadır.' }
];

// Sayfadaki görünür SSS ile birebir eşleşmelidir (AracHasarIkamePage.jsx FAQ_ITEMS)
const FAQ_IKAME_ARAC = [
  { q: 'İkame araç (mahrumiyet) bedeli nasıl hesaplanır?', a: 'İkame araç bedeli; aracın fiilen kullanılamadığı makul onarım süresi (gün) ile aynı segment aracın günlük emsal kira bedelinin çarpımıyla hesaplanır. Elde edilen tutardan mağdurun kusuru oranında indirim yapılır. Onarımın makul süreyi aşan kısmı tazminata dahil edilmez.' },
  { q: 'İkame araç için fiilen kiralık araç tutmam şart mı?', a: 'Hayır. Yargıtay 17. Hukuk Dairesi yerleşik içtihatlarına göre, mağdur fiilen kiralık araç tutmasa dahi aracından mahrum kaldığı makul süre için emsal kira bedeli üzerinden mahrumiyet tazminatı talep edebilir. Fatura ibrazı zorunlu değildir.' },
  { q: 'Mahrumiyet bedelini sigorta mı öder?', a: 'Karşı tarafın zorunlu trafik sigortası (ZMSS), kusuru oranında maddi zararları teminat limiti dahilinde öder (KTK m.85). Standart kasko kural olarak mahrumiyet bedelini ve değer kaybını ödemez; bu kalemler kusurlu sürücüden veya onun trafik sigortasından talep edilir.' },
  { q: 'İkame araç bedeli ile araç değer kaybı aynı şey mi?', a: 'Hayır, ayrı kalemlerdir ve birlikte talep edilebilir. İkame araç bedeli, aracın onarımda olduğu dönemdeki geçici kullanım kaybıdır. Değer kaybı ise hasar onarılsa bile aracın ikinci el piyasa değerindeki kalıcı düşüştür. Değer kaybının ayrıntılı hesabı için ayrı aracımızı kullanabilirsiniz.' },
  { q: 'Onarım süresi tartışmalıysa ne olur?', a: 'Makul onarım süresi; servis kayıtları, parça temin süreleri ve ekspertiz/bilirkişi değerlendirmesiyle belirlenir. Servisin ihmalinden kaynaklanan gecikmeler genellikle kusurlu tarafa yüklenmez. Uyuşmazlıkta Sigorta Tahkim Komisyonu veya mahkeme bilirkişisi süreyi takdir eder.' },
  { q: 'Mahrumiyet bedeli talebinin zamanaşımı ne kadar?', a: 'Sigortacıya karşı taleplerde KTK m.109 uyarınca 2 yıllık özel zamanaşımı uygulanır. Kusurlu sürücüye karşı açılacak haksız fiil davasında TBK m.72 gereği zararın ve failin öğrenilmesinden itibaren 2 yıl, her hâlde 10 yıllık süre geçerlidir.' }
];

// Sayfadaki görünür SSS ile birebir eşleşmelidir (MaluliyetHesaplamaPage.jsx FAQ_ITEMS)
const FAQ_MALULIYET = [
  { q: 'Maluliyet (engellilik) oranı nasıl hesaplanır?', a: 'Maluliyet oranı, Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik ekindeki Ek-2 Engel Oranları Cetveli esas alınarak belirlenir. Her yaralanma veya fonksiyon kaybı için cetvelde karşılık gelen yüzde bulunur; birden fazla arıza varsa Balthazard formülüyle birleştirilir ve 65 yaş üzeri bireylerde orana %10 ilave edilir.' },
  { q: 'Balthazard formülü nedir ve oranlar neden toplanmaz?', a: 'Balthazard formülü, birden fazla engellilik oranını birleştirmek için kullanılır. Oranlar doğrudan toplanmaz; çünkü her yeni arıza, geriye kalan sağlam beden fonksiyonu üzerinden etki eder. Formül: Birleşik = 100 × (1 − çarpım(1 − rᵢ/100)). Örneğin %40, %30 ve %20 birleştiğinde sonuç %90 değil, yaklaşık %66,4 olur.' },
  { q: 'Bu araç kesin maluliyet oranımı verir mi?', a: 'Hayır. Bu araç ön tahmin verir ve sizi yönlendirir. Kesin maluliyet oranı yalnızca Adli Tıp Kurumu veya yetkili sağlık kurulu (heyet) raporuyla; muayene ve ölçümlerle (eklem hareket açıklığı, odyometri, görme alanı, nöropsikolojik test vb.) belirlenir. Özellikle kırık ve eklem kısıtlılığı gibi ölçüme dayalı kalemlerde aracın verdiği değer bir aralık tahminidir.' },
  { q: '65 yaş ve üzeri için neden orana %10 ekleniyor?', a: 'Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik gereği, 65 yaş ve üzerindeki bireylerde bulunan engellilik oranına kalan beden fonksiyonu üzerinden ayrıca %10 ilave yapılır. Araç, yaş bilgisini girdiğinizde bu ilaveyi otomatik uygular.' },
  { q: 'Maluliyet oranı tazminat tutarını nasıl etkiler?', a: 'Maluliyet oranı, sürekli sakatlık (iş göremezlik) tazminatının doğrudan çarpanıdır. Tazminat; bakiye ömür, yıllık kazanç ve maluliyet oranının çarpımıyla hesaplanır. Oran arttıkça tazminat da artar. Oranı bulduktan sonra Trafik Kazası Maluliyet Tazminatı Hesaplama aracımızla tutarı hesaplayabilirsiniz.' },
  { q: 'Kaza tarihi maluliyet oranını neden etkiler?', a: 'Maluliyet oranı, kaza tarihinde yürürlükte olan yönetmeliğe göre belirlenir. 20.02.2019 ve sonrasındaki kazalarda Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik (Ek-2 cetveli) uygulanır. Daha eski kazalarda 2013 veya 2015 tarihli yönetmelikler gibi farklı mevzuat geçerli olabilir; bu nedenle araç kaza tarihini girdiğinizde uygulanacak yönetmeliği belirtir.' },
  { q: 'En düşük kaç maluliyet oranından tazminat alınır?', a: 'Trafik kazası kaynaklı bedensel zararlarda sürekli sakatlık tazminatı için yasal bir alt sınır yoktur; %1 düzeyinde sürekli bir maluliyet dahi tazminat hakkı doğurur ve oran arttıkça tazminat tutarı da artar. (Not: SGK tarafından sürekli iş göremezlik geliri bağlanması için %10 gibi eşikler aranır; bu, kusurlu tarafa/sigortaya karşı açılan trafik kazası tazminat davasından farklı bir konudur.)' },
  { q: 'Kol veya bacak kırığı kaç maluliyet oranı verir?', a: 'Basit ve sorunsuz kaynayan bir kırık çoğunlukla kalıcı maluliyet bırakmaz (yaklaşık %0). Maluliyet, kırığın iyileşme sonrası bıraktığı kalıcı sonuçtan doğar: eklemde hareket kısıtlılığı, kaynamama (psödoartroz), kısalık veya sinir hasarı. Hafif kısıtlılıkta tek haneli, ileri kısıtlılık veya ankilozda daha yüksek oranlar çıkabilir. Kesin oran eklem hareket açıklığı ölçümüyle belirlenir; aracın rehberli akışı size bir tahmin aralığı verir.' },
  { q: 'Bel fıtığı veya omurga (vertebra) kırığı maluliyet oranı kaç?', a: 'Omurga yaralanmalarında oran; etkilenen bölgeye (boyun/sırt/bel) ve hasarın türüne göre değişir. Örneğin bir bel vertebrasının kompresyon kırığında çökme miktarına göre yaklaşık %5–12; ameliyatlı disk lezyonunda birkaç puan düzeyinde değerler söz konusudur. Omurilik veya sinir kökü tutulumu varsa oran çok daha yüksek olur. Birden fazla omur etkilendiyse her birinin oranı Balthazard formülüyle birleştirilir.' },
  { q: 'Bir uzvun (kol, bacak, parmak) tamamen kaybı yüzde kaç maluliyettir?', a: 'Ampütasyonların cetvelde sabit (kesin) oranı vardır: omuzdan kol kaybı yaklaşık %60, ön kol/el düzeyinde %56, başparmak %22; kalçadan bacak kaybı %50, diz altı %43, ayak bileğinden (Syme) %38. Tam liste için aracın "ampütasyon" adımını kullanabilirsiniz.' },
  { q: 'Maluliyet oranına nasıl itiraz edilir?', a: 'Sağlık kurulu raporundaki orana katılmıyorsanız itiraz edebilirsiniz. Uygulamada rapora karşı bir üst sağlık kuruluna ya da Adli Tıp Kurumu’na yeniden değerlendirme için başvurulabilir; dava aşamasında mahkemeden yeni bir heyet veya bilirkişi raporu talep edilebilir. Süreç teknik ve süreye tabi olduğundan bir avukatla yürütmeniz önerilir.' },
  { q: 'Maluliyet (heyet) raporu nereden alınır?', a: 'Rapor; Sağlık Bakanlığınca yetkilendirilmiş üniversite, eğitim-araştırma ve tam teşekküllü devlet hastanelerinin sağlık kurullarından ya da Adli Tıp Kurumu’ndan alınır. Dava sürecinde mahkeme genellikle ATK veya üniversite hastanesinden rapor ister. Ayrıntı için "Maluliyet (Heyet) Raporu Nasıl Alınır?" rehberimize bakabilirsiniz.' },
  { q: 'Geçici iş göremezlik ile sürekli maluliyet arasındaki fark nedir?', a: 'Geçici iş göremezlik, tedavi ve iyileşme süresince işe/günlük yaşama ara verilen dönemdeki geçici kayıptır ve ayrı hesaplanır. Sürekli maluliyet ise iyileşme tamamlandıktan sonra geriye kalan kalıcı engellilik oranıdır. Bu araç sürekli (kalıcı) maluliyet oranını tahmin eder.' },
  { q: 'Bu araç çocuklar için de kullanılabilir mi?', a: 'Hayır. Bu araç 18 yaş ve üzeri erişkinler için, Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmeliğe dayanır. 18 yaş altı bireyler için "Çocuklar İçin Özel Gereksinim Raporu (ÇÖZGER)" mevzuatı uygulanır ve oranlandırma esasları farklıdır.' },
  { q: 'Maluliyet tazminatı ne zaman zamanaşımına uğrar?', a: 'Trafik kazası tazminat taleplerinde kural olarak zararı ve sorumluyu öğrenmeden itibaren 2 yıllık ve her hâlde olay tarihinden itibaren 10 yıllık zamanaşımı uygulanır; ancak fiil aynı zamanda suç teşkil ediyorsa daha uzun ceza zamanaşımı süreleri devreye girebilir. Hak kaybı yaşamamak için en kısa sürede bir avukata danışmanız önerilir.' },
  { q: 'Diz bağ kopması veya menisküs yaralanması maluliyet oranı kaç?', a: 'Diz içi yaralanmalarda (ön/arka çapraz bağ, menisküs) maluliyet, ameliyat sonrası kalan instabilite ve hareket kısıtlılığına göre belirlenir. Hafif kısıtlılıkta tek haneli, ileri kısıtlılık veya diz ankilozunda yaklaşık %20–40’a varan oranlar söz konusu olabilir. Kesin oran diz hareket açıklığı ve stabilite muayenesiyle belirlenir.' },
  { q: 'Kaburga kırığı maluliyet oranı kaç?', a: 'Sorunsuz iyileşen kaburga kırıkları çoğunlukla kalıcı maluliyet bırakmaz (yaklaşık %0–5). Ancak çok sayıda kaburga kırığı, akciğer hasarı veya kalıcı solunum kısıtlılığı eşlik ediyorsa oran yükselir; bu durumda solunum fonksiyon testi esas alınır.' },
  { q: 'Kalça kırığı veya kalça protezi maluliyet oranı kaç?', a: 'Kalça kırıklarında oran kalan hareket kısıtlılığına göre yaklaşık %2–20; ileri kısıtlılık veya ankilozda daha yüksektir. Başarılı bir kalça protezinde fonksiyon büyük ölçüde düzelse de cetvel, protez sonrası belirli bir kalıcı kısıtlılık öngörür; kesin oran muayeneyle belirlenir.' },
  { q: 'Omuz çıkığı veya kırığı maluliyet oranı kaç?', a: 'Omuz yaralanmalarında oran, kolun yukarı kaldırılması ve döndürülmesindeki kalıcı kısıtlılığa göre değişir: hafifte %2–8, ortada %8–20, ileri kısıtlılık veya ankilozda yaklaşık %20–45. Tekrarlayan çıkık (instabilite) ayrıca değerlendirilir.' },
  { q: 'El veya parmak kırığı ya da kaybı maluliyet oranı kaç?', a: 'El ve parmak yaralanmalarında oran, hareket kısıtlılığına ve varsa parmak kaybına göre belirlenir. Hareket kısıtlılığında yaklaşık %1–25; tam kayıpta cetveldeki sabit değerler geçerlidir: başparmak kaybı %22, işaret veya orta parmak %11, yüzük veya küçük parmak %5.' },
  { q: 'Ayak bileği kırığı maluliyet oranı kaç?', a: 'Ayak bileği kırıklarında oran, kalan hareket kısıtlılığı ve instabiliteye göre yaklaşık %2–6 (hafif), %6–15 (orta), %15–30 (ileri veya ankiloz) aralığındadır. Eklem içi kırıklar ve kaynama bozuklukları oranı yükseltir.' },
  { q: 'Kafa travması veya beyin hasarı maluliyet oranı kaç?', a: 'Kafa travmasında oran, kalıcı nörolojik ve bilişsel etkilenmeye göre çok geniş bir aralıkta değişir: süregelen baş ağrısı veya baş dönmesinde tek haneli; hafıza-dikkat gibi bilişsel kayıplarda yaklaşık %10–90; post-travmatik epilepside nöbet sıklığına göre %10–90. Kesin oran nöroloji ve nöropsikolojik testlerle belirlenir.' },
  { q: 'Tek gözün görme kaybı maluliyet oranı kaç?', a: 'Bir gözün tamamen görme kaybında oran yaklaşık %20–30 düzeyindedir; kısmi görme azalmasında değer, görme keskinliği ve görme alanı skoruna (GSYO) göre düşer. İki gözde ileri kayıp veya körlükte oran %85–100’e ulaşır. Kesin oran göz muayenesiyle belirlenir.' },
  { q: 'İşitme kaybı maluliyet oranı kaç?', a: 'İşitme kaybında oran odyometri (işitme testi) sonucuna göre belirlenir: tek kulakta kısmi kayıpta tek haneli, tek kulak tam sağırlıkta yaklaşık %6–15, iki taraflı ileri veya tam kayıpta yaklaşık %25–50.' },
  { q: 'Dalak veya böbrek kaybı gibi iç organ yaralanmalarında maluliyet oranı kaç?', a: 'İç organ kayıplarında oran organa göre değişir: dalağın alınması (splenektomi) yaklaşık %3–10; tek böbreğin kaybı (diğeri sağlam) yaklaşık %15–25; her iki böbreğin işlevsizliği (diyaliz bağımlılığı) %90; tek akciğerin alınması (pnömonektomi) yaklaşık %10.' },
  { q: 'Menisküs ameliyatı (artroskopi) sonrası maluliyet oranı kaç?', a: 'Menisküs yırtığında, özellikle menisektomi (menisküsün alınması) sonrası dizde kalıcı kısıtlılık veya erken kireçlenme gelişebilir. Maluliyet, ameliyat sonrası kalan diz hareket kısıtlılığı ve instabiliteye göre belirlenir; çoğu olguda tek haneli, ileri durumlarda daha yüksek oranlar söz konusudur. Kesin oran diz muayenesiyle saptanır.' },
  { q: 'Platin, vida veya çivi takılması tek başına maluliyet verir mi?', a: 'Hayır; kırık için takılan platin, vida veya çivi (osteosentez) tek başına maluliyet oranı doğurmaz. Maluliyet, implanttan değil kırığın bıraktığı kalıcı sonuçtan (hareket kısıtlılığı, kaynamama, kısalık) doğar. Donanım nedeniyle ileride hareket kısıtlılığı veya kalıcı ağrı kalırsa, bu ilgili eklem üzerinden değerlendirilir.' },
  { q: 'Boyun fıtığı (servikal disk) maluliyet oranı kaç?', a: 'Boyun (servikal) bölgesinde travmaya bağlı disk lezyonunda oran düşük seviyededir; ameliyatsız ancak kalıcı bulgulu olgularda yaklaşık %4, ameliyatlı disk lezyonunda birkaç puan civarındadır. Kola yayılan kuvvet veya his kaybı (radikülopati) varsa oran, sinir tutulumu üzerinden ayrıca değerlendirilir.' },
  { q: 'El bileği veya kol kemiğinde kaynamama (psödoartroz) maluliyet oranı kaç?', a: 'Kırığın kaynamaması (psödoartroz), kaynamış bir kırığa göre daha yüksek maluliyet verir; çünkü ilgili bölgede kalıcı işlev kaybı sürer. Oran, etkilenen ekleme ve kalan hareket veya kuvvet kaybına göre belirlenir ve genellikle orta-ileri kısıtlılık bandında değerlendirilir.' },
  { q: 'Çene (mandibula) kırığı maluliyet oranı kaç?', a: 'Sorunsuz iyileşen çene kırığı genelde kalıcı maluliyet bırakmaz. Çiğneme fonksiyonunda kalıcı bozukluk, ağız açıklığında kısıtlılık ya da cerrahi rezeksiyon varsa oran yükselir; örneğin mandibulanın bir segmentinin alınmasında yaklaşık %13, çenenin yarısının alınmasında (hemimandibulektomi) %33 gibi değerler söz konusudur.' },
  { q: 'Burun kırığı maluliyet oranı kaç?', a: 'Şekil bozukluğu bırakmadan iyileşen burun kırığı genelde maluliyet vermez. Kalıcı şekil bozukluğu veya nefes almayı bozan eğrilik varsa düşük oranlar (yaklaşık %2–12); burnun tamamen kaybı gibi ağır durumlarda %47 gibi sabit bir değer söz konusudur.' },
  { q: 'Köprücük kemiği (klavikula) kırığı maluliyet oranı kaç?', a: 'Köprücük kemiği kırıkları çoğunlukla sorunsuz iyileşir ve kalıcı maluliyet bırakmaz. Kaynamama veya omuz hareketlerinde kalıcı kısıtlılık kalırsa oran, omuz fonksiyonu üzerinden (hafifte tek haneli) değerlendirilir.' },
  { q: 'Diz protezi (total diz replasmanı) sonrası maluliyet oranı kaç?', a: 'Başarılı bir diz protezinde fonksiyon büyük ölçüde düzelse de cetvel, protez sonrası belirli bir kalıcı kısıtlılık öngörür. Oran, ameliyat sonrası kalan hareket açıklığı ve stabiliteye göre belirlenir; kesin değer muayeneyle saptanır.' },
  { q: 'Bacakta kısalık kalması maluliyet oranını etkiler mi?', a: 'Evet. Kırık sonrası bacakta kalıcı kısalık; aksamaya ve yük dağılımının bozulmasına yol açtığından ayrı bir engel unsuru olarak değerlendirilir ve diğer kısıtlılıklarla birlikte orana yansır. Kısalık miktarı ölçülerek dikkate alınır.' },
  { q: 'Yüzde kalıcı iz veya yara izi maluliyet sayılır mı?', a: 'Yüzdeki kalıcı izler, büyüklüğüne ve belirginliğine göre değerlendirilebilir; geniş veya fonksiyonu (göz kapağı, dudak hareketi gibi) bozan izlerde oran artar. Ayrıca yüzde sabit eser veya iz, trafik kazası davalarında manevi tazminatın da önemli bir gerekçesidir.' },
  { q: 'Travma sonrası düşük ayak (ayağı yukarı kaldıramama) maluliyet oranı kaç?', a: 'Düşük ayak genellikle peroneal sinir hasarına bağlıdır ve yürümeyi belirgin biçimde etkiler. Maluliyet, sinir hasarının derecesine göre belirlenir; kısmi olgularda orta, kalıcı tam kayıpta daha yüksek oranlar söz konusudur. Kesin oran nörolojik muayene ve EMG ile değerlendirilir.' },
  { q: 'Elde tendon veya sinir kesisi maluliyet oranı kaç?', a: 'El ve bilekteki tendon veya sinir kesilerinde oran, parmak ve elin kalıcı hareket ve his kaybına göre belirlenir. Hafif olgularda düşük, birden fazla parmağı tutan kalıcı kayıplarda daha yüksek oranlar çıkar; kesin oran el fonksiyon muayenesiyle saptanır.' },
  { q: 'Birden çok bölgede kırığım var (kol, bacak, kaburga), toplam maluliyet nasıl bulunur?', a: 'Her kırığın bıraktığı kalıcı oran ayrı ayrı belirlenir, sonra Balthazard formülüyle birleştirilir (toplanmaz). Örneğin %15, %10 ve %5’lik üç ayrı oran birleştiğinde sonuç %30 değil, yaklaşık %27,6 olur. Aracımız bu birleştirmeyi otomatik ve adım adım yapar.' },
  { q: 'Maluliyet oranı kaza sonrası ne zaman, kaç ay sonra belirlenir?', a: 'Maluliyet, iyileşme tamamlanıp kalıcı durum oturduktan sonra belirlenir. Uygulamada genellikle kaza veya tedavi sonrası belirli bir süre (çoğu olguda yaklaşık 12-18 ay) beklenir; erken alınan raporlarda oran eksik tespit edilebilir ve itiraza konu olabilir.' },
  { q: 'Maluliyet oranı sonradan artırılabilir veya yeniden değerlendirilebilir mi?', a: 'Evet. Durumda kötüleşme ya da yeni bir engelin ortaya çıkması hâlinde, süreli raporlarda kontrol muayenesiyle oran yeniden değerlendirilebilir. Dava sürecinde de mevcut rapora itiraz edilerek yeni bir heyet veya bilirkişi raporu talep edilebilir.' },
];

// Statik sayfalar
const staticRoutes = [
  {
    path: '/',
    title: 'Koptay Hukuk Bürosu | Ankara Avukat — İş, Trafik, Ceza, Aile Hukuku',
    description: 'Ankara\'da iş hukuku, trafik kazası, ceza, aile ve tazminat davalarında avukatlık hizmetleri. Hukuki hesaplama araçları ve uzman makaleler. Av. Murat Can Koptay.',
    keywords: 'ankara avukat, iş hukuku avukatı, trafik kazası avukatı, ceza avukatı, aile hukuku, tazminat davası, koptay hukuk, avukatlık hizmetleri ankara',
    image: '/images/og/og-default.jpg'
  },
  {
    path: '/hakkimizda',
    title: 'Hakkımızda | Koptay Hukuk Bürosu — Ankara',
    description: 'Koptay Hukuk Bürosu hakkında bilgi: deneyim, uzmanlık alanları, çalışma prensipleri ve müvekkil yaklaşımımız. Av. Murat Can Koptay.',
    keywords: 'koptay hukuk hakkında, ankara avukatlık bürosu, av murat can koptay, hukuk bürosu deneyim'
  },
  {
    path: '/hizmetlerimiz',
    title: 'Hizmetlerimiz | İş, Ceza, Aile, Trafik, Ticaret Hukuku — Koptay Hukuk',
    description: 'Hukuk bürosu hizmetlerimiz: iş hukuku, ceza hukuku, aile hukuku, trafik kazası, ticaret hukuku, gayrimenkul hukuku, icra ve iflas. Ankara avukat.',
    keywords: 'avukatlık hizmetleri, iş hukuku, ceza hukuku, aile hukuku, trafik kazası, ticaret hukuku, gayrimenkul, icra iflas, ankara',
    image: '/images/og/og-hizmetler.jpg'
  },
  {
    path: '/ekibimiz',
    title: 'Ekibimiz | Koptay Hukuk Bürosu Avukat Kadrosu',
    description: 'Koptay Hukuk Bürosu deneyimli avukat kadrosu. Uzmanlık alanlarımız ve ekip üyelerimiz hakkında bilgi alın.',
    keywords: 'koptay hukuk ekibi, avukat kadrosu, ankara avukat ekibi, hukuk uzmanları'
  },
  {
    path: '/makaleler',
    title: 'Hukuk Makaleleri | Güncel İçtihat ve Rehberler — Koptay Hukuk',
    description: 'Trafik kazası, iş hukuku, tazminat ve ceza hukukuna dair güncel makaleler, Yargıtay kararları ve pratik rehberler. 2026 güncel mevzuat.',
    keywords: 'hukuk makaleleri, yargıtay kararları, trafik kazası rehberi, iş hukuku makaleleri, tazminat rehberi'
  },
  {
    path: '/iletisim',
    title: 'İletişim | Koptay Hukuk Bürosu — Ankara Avukat',
    description: 'Koptay Hukuk Bürosu ile iletişime geçin. Telefon: 0530 711 18 64. E-posta: info@koptay.av.tr. Ankara merkezli avukatlık hizmetleri.',
    keywords: 'koptay hukuk iletişim, ankara avukat telefon, avukat randevu, hukuki danışmanlık'
  },
  {
    path: '/hesaplama-araclari',
    title: 'Hukuki Hesaplama Araçları | Koptay Hukuk',
    description: 'İnfaz yatar, vekâlet ücreti, tazminat, araç değer kaybı, dava süresi, ilave tediye, işçilik alacakları ve daha fazlası — 9 hukuki hesaplama aracı.',
    keywords: 'hukuki hesaplama, infaz yatar hesaplama, vekalet ücreti, tazminat hesaplama, değer kaybı hesaplama, ilave tediye, işçilik alacakları'
  },
  {
    path: '/hesaplama-araclari/infaz-yatar',
    title: 'İnfaz Yatar Hesaplama 2026 | Koptay Hukuk',
    description: 'Hapis cezası ne kadar yatar? 2026 güncel mevzuata göre infaz yatar hesaplama aracı. Koşullu salıverme ve denetimli serbestlik dahil.',
    keywords: 'infaz yatar hesaplama, hapis cezası ne kadar yatar, koşullu salıverme, denetimli serbestlik, infaz hesaplama 2026'
  },
  {
    path: '/hesaplama-araclari/vekalet-ucreti',
    title: 'Avukatlık Vekâlet Ücreti Hesaplama 2026 | Koptay Hukuk',
    description: 'Türkiye Barolar Birliği 2026 tarifesine göre vekâlet ücreti hesaplama aracı. Maktu ve nisbi vekâlet ücreti hesaplaması.',
    keywords: 'vekalet ücreti hesaplama, avukatlık ücreti, TBB tarifesi 2026, maktu nisbi vekalet'
  },
  {
    path: '/hesaplama-araclari/tazminat-hesaplama',
    title: 'Tazminat Hesaplama 2026 | İş Kazası & Meslek Hastalığı | Koptay Hukuk',
    description: 'TRH-2010 yaşam tablosuna göre iş kazası ve meslek hastalığı tazminat hesaplama. Maluliyet, kusur ve aktüerya analizi ile detaylı rapor.',
    keywords: 'tazminat hesaplama, iş kazası tazminatı, meslek hastalığı tazminatı, TRH-2010, maluliyet'
  },
  {
    path: '/hesaplama-araclari/arac-deger-kaybi',
    title: 'Araç Değer Kaybı Hesaplama 2026 | Trafik Sigortası | Koptay Hukuk',
    description: 'Kaza sonrası aracınızın değer kaybını 2026 mevzuatına göre hesaplayın. Trafik sigortası ve tahkim itirazı için profesyonel rapor.',
    keywords: 'araç değer kaybı hesaplama, trafik sigortası, tahkim itirazı, değer kaybı davası, sigorta tazminatı'
  },
  {
    path: '/hesaplama-araclari/dava-suresi',
    title: 'Dava Süresi Hesaplama | Hukuki Süre Hesaplama | Koptay Hukuk',
    description: 'Dava süresi, zamanaşımı, hak düşürücü süre ve usul süreleri hesaplama aracı. Hukuki süre hesabı ve ihtarname rehberi.',
    keywords: 'dava süresi hesaplama, zamanaşımı, hak düşürücü süre, usul süreleri, hukuki süre hesabı'
  },
  {
    path: '/hesaplama-araclari/ilave-tediye',
    title: 'İlave Tediye Hesaplama 2026 | 6772 Sayılı Kanun | Koptay Hukuk',
    description: '6772 sayılı kanun kapsamında kamu işçileri için ilave tediye hesaplama aracı. 2026 güncel parametreleriyle brüt-net tediye hesaplayın.',
    keywords: 'ilave tediye hesaplama, ilave tediye 2026, 6772 sayılı kanun, kamu işçisi ilave tediye'
  },
  {
    path: '/hesaplama-araclari/iscilik-alacaklari',
    title: 'İşçilik Alacakları Hesaplama 2026 | Kıdem, İhbar, İzin, Mesai | Koptay Hukuk',
    description: 'Kıdem, ihbar, yıllık izin ve fazla mesai alacaklarını 2026 oranlarıyla hesaplayın. Profesyonel işçilik alacakları aracı.',
    keywords: 'işçilik alacakları, kıdem tazminatı, ihbar tazminatı, yıllık izin, fazla mesai, iş hukuku ankara'
  },
  {
    path: '/hesaplama-araclari/meslek-hastaligi',
    title: 'Meslek Hastalığı Tazminat Hesaplama 2026 | TRH-2010 | Koptay Hukuk',
    description: 'TRH-2010 tablosuna göre meslek hastalığı tazminat hesaplama. Yükümlülük süresi, maluliyet oranı ve Yargıtay içtihatlarına uygun.',
    keywords: 'meslek hastalığı tazminat, TRH-2010, maluliyet oranı, sürekli iş göremezlik, meslek hastalığı avukatı'
  },
  {
    path: '/hesaplama-araclari/trafik-kazasi-tazminati',
    title: 'Trafik Kazası Maluliyet Tazminatı Hesaplama 2026 | İş Göremezlik | Koptay Hukuk',
    description: 'Trafik kazası sonrası sürekli sakatlık (maluliyet), geçici iş göremezlik ve bakıcı gideri tazminatını hesaplayın. TRH-2010 yaşam tablosu, KTK m.90 ve TBK m.55 esaslı aktüerya. Ankara avukat — Koptay Hukuk.',
    keywords: 'trafik kazası maluliyet tazminatı hesaplama, sürekli sakatlık tazminatı hesaplama, geçici iş göremezlik tazminatı, trafik kazası iş göremezlik hesaplama, maluliyet oranı tazminat, TRH-2010 hesaplama, bakıcı gideri tazminatı, trafik kazası avukatı ankara',
    image: '/images/articles/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir.jpg',
    extraJsonLd: [
      buildCalculatorJsonLd({
        name: 'Trafik Kazası Maluliyet Tazminatı Hesaplama',
        description: 'Sürekli sakatlık, geçici iş göremezlik ve bakıcı gideri tazminatını TRH-2010 yaşam tablosuna göre hesaplayan aktüerya aracı.',
        url: `${SITE_URL}/hesaplama-araclari/trafik-kazasi-tazminati`
      }),
      buildFaqJsonLd(FAQ_TRAFIK_TAZMINAT),
      buildToolBreadcrumb('Trafik Kazası Maluliyet Tazminatı Hesaplama', `${SITE_URL}/hesaplama-araclari/trafik-kazasi-tazminati`)
    ]
  },
  {
    path: '/hesaplama-araclari/trafik-kazasi-maluliyet-hesaplama',
    title: 'Maluliyet (Engellilik) Oranı Hesaplama 2026 | Trafik Kazası Rehberli Araç | Koptay Hukuk',
    description: 'Trafik kazası sonrası maluliyet (engellilik) oranınızı soru-cevap ile adım adım hesaplayın. Hiçbir tıbbi bilgi gerektirmez; Erişkinler İçin Engellilik Değerlendirmesi Yönetmeliği (Ek-2 cetveli), Balthazard formülü ve 65+ yaş %10 kuralı esaslı. Ankara avukat — Koptay Hukuk Bürosu.',
    keywords: 'maluliyet oranı hesaplama, engellilik oranı hesaplama, trafik kazası maluliyet hesaplama, balthazard formülü hesaplama, ek-2 cetveli engel oranı, engellilik değerlendirme yönetmeliği, maluliyet oranı nasıl hesaplanır, birden fazla yaralanma maluliyet, kaza sonrası engel oranı, trafik kazası avukatı ankara',
    image: '/images/articles/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir.jpg',
    extraJsonLd: [
      buildCalculatorJsonLd({
        name: 'Maluliyet (Engellilik) Oranı Hesaplama Aracı',
        description: 'Trafik kazası ve yaralanmalara bağlı engellilik oranını soru-cevap akışıyla, Ek-2 cetveli ve Balthazard formülü esas alınarak adım adım hesaplayan rehberli araç.',
        url: `${SITE_URL}/hesaplama-araclari/trafik-kazasi-maluliyet-hesaplama`
      }),
      buildFaqJsonLd(FAQ_MALULIYET),
      buildMaluliyetHowTo(),
      buildToolBreadcrumb('Maluliyet (Engellilik) Oranı Hesaplama', `${SITE_URL}/hesaplama-araclari/trafik-kazasi-maluliyet-hesaplama`)
    ]
  },
  {
    path: '/hesaplama-araclari/arac-hasar-ikame-arac',
    title: 'İkame Araç ve Araç Hasar Tazminatı Hesaplama 2026 | Mahrumiyet Bedeli | Koptay Hukuk',
    description: 'Trafik kazası sonrası ikame araç (mahrumiyet) bedeli ve maddi araç hasar tazminatını hesaplayın. Onarım süresi, günlük kira ve kusur oranına göre Yargıtay 17. HD içtihatlarına uygun. Ankara avukat — Koptay Hukuk.',
    keywords: 'ikame araç bedeli hesaplama, araç mahrumiyet bedeli hesaplama, araç hasar tazminatı hesaplama, kaza sonrası ikame araç hakkı, mahrumiyet tazminatı, onarım süresi tazminatı, trafik kazası maddi hasar, ikame araç ücreti, araç kullanım kaybı tazminatı',
    image: '/images/articles/arac-mahrumiyet-bedeli-ikame-arac.jpg',
    extraJsonLd: [
      buildCalculatorJsonLd({
        name: 'İkame Araç ve Araç Hasar Tazminatı Hesaplama',
        description: 'İkame araç (mahrumiyet) bedeli ve maddi araç hasar tazminatını onarım süresi ve günlük kira bedeline göre hesaplayan araç.',
        url: `${SITE_URL}/hesaplama-araclari/arac-hasar-ikame-arac`
      }),
      buildFaqJsonLd(FAQ_IKAME_ARAC),
      buildToolBreadcrumb('İkame Araç ve Araç Hasar Tazminatı Hesaplama', `${SITE_URL}/hesaplama-araclari/arac-hasar-ikame-arac`)
    ]
  },
  {
    path: '/kvkk',
    title: 'KVKK ve Çerez Politikası | Koptay Hukuk',
    description: 'Kişisel verilerin korunması, çerez kullanımı ve aydınlatma metni. KVKK kapsamındaki haklarınız.',
    keywords: 'kvkk, çerez politikası, aydınlatma metni, kişisel veri, gizlilik'
  }
];

let writtenCount = 0;

function writePrerenderedPage(routePath, html) {
  // routePath '/' → dist/index.html (zaten var, üzerine yaz)
  // routePath '/foo' → dist/foo/index.html
  // routePath '/foo/bar' → dist/foo/bar/index.html
  const cleanPath = routePath === '/' ? '' : routePath.replace(/^\/|\/$/g, '');
  const targetDir = cleanPath ? path.join(DIST, cleanPath) : DIST;
  const targetFile = path.join(targetDir, 'index.html');
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, html, 'utf-8');
  writtenCount++;
}

console.log('🚀 Prerender başlatılıyor...');

// Statik sayfalar
staticRoutes.forEach(route => {
  const url = `${SITE_URL}${route.path}`;
  const html = buildHtml({
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    url,
    image: route.image || '/images/og/og-default.jpg',
    type: 'website',
    extraJsonLd: [orgJsonLd, websiteJsonLd, ...(route.extraJsonLd || [])]
  });
  writePrerenderedPage(route.path, html);
});

console.log(`📄 ${staticRoutes.length} statik sayfa prerender edildi.`);

// Hizmet detay sayfaları
PRACTICE_AREAS.forEach((service) => {
  const url = `${SITE_URL}/hizmetler/${service.slug}`;
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Çalışma Alanları', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: service.title, item: url }
    ]
  };
  const html = buildHtml({
    title: service.seoTitle,
    description: service.seoDescription,
    keywords: service.title,
    url,
    image: service.ogImage,
    type: 'website',
    extraJsonLd: [orgJsonLd, websiteJsonLd, faqJsonLd, breadcrumbJsonLd]
  });
  writePrerenderedPage(`/hizmetler/${service.slug}`, html);
});

console.log(`⚖️  ${PRACTICE_AREAS.length} hizmet sayfası prerender edildi.`);

// Makale sayfaları
articles.forEach(article => {
  const slug = article.slug;
  if (!slug) return;

  const imageUrl = (article.image && typeof article.image === 'object')
    ? article.image.url
    : article.image;
  const imageAlt = (article.image && typeof article.image === 'object' && article.image.alternativeText)
    ? article.image.alternativeText
    : article.title;

  const url = `${SITE_URL}/makale/${slug}`;
  const title = article.seoTitle || `${article.title} | Koptay Hukuk Bürosu`;
  const description = article.seoDescription || article.excerpt || article.title;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": description,
    "image": imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`) : `${SITE_URL}/images/hero-bg-1.jpg`,
    "author": {
      "@type": "Person",
      "name": article.author || "Av. Murat Can Koptay",
      "url": `${SITE_URL}/ekibimiz`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Koptay Hukuk Bürosu",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.svg` },
      "url": SITE_URL
    },
    "datePublished": article.publishedAt || article.createdAt,
    "dateModified": article.updatedAt || article.publishedAt || article.createdAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "articleSection": article.category || "Hukuk",
    "keywords": article.keywords || "",
    "inLanguage": "tr-TR"
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Makaleler", "item": `${SITE_URL}/makaleler` },
      { "@type": "ListItem", "position": 3, "name": article.category || "Hukuk", "item": `${SITE_URL}/makaleler?kategori=${encodeURIComponent(article.category || "")}` },
      { "@type": "ListItem", "position": 4, "name": article.title, "item": url }
    ]
  };

  // Responsive cover variants varsa LCP için imagesrcset ile preload, yoksa basit href preload
  const isResponsiveImage = !!(article.image && typeof article.image === 'object' && article.image.responsive);

  const html = buildHtml({
    title,
    description,
    keywords: article.keywords || '',
    url,
    image: imageUrl,
    type: 'article',
    author: article.author,
    publishedTime: article.publishedAt || article.createdAt,
    modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
    extraJsonLd: [orgJsonLd, websiteJsonLd, articleJsonLd, breadcrumbJsonLd],
    preloadImage: !!imageUrl,
    responsiveImage: isResponsiveImage
  });

  writePrerenderedPage(`/makale/${slug}`, html);
});

console.log(`📚 ${articles.length} makale prerender edildi.`);
console.log(`✅ Toplam ${writtenCount} HTML dosyası dist/ altında oluşturuldu.`);
