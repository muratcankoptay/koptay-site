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
    path: '/hesaplama-araclari/trafik-kazasi',
    title: 'Trafik Kazası Tazminat Hesaplama 2026 | Aktüerya | Koptay Hukuk',
    description: 'Araç değer kaybı, ikame araç, sürekli sakatlık ve geçici iş göremezlik tazminatı hesaplama. KTK m.85 ve TBK m.49 uyumlu aktüerya.',
    keywords: 'trafik kazası tazminat, araç değer kaybı, ikame araç, sürekli sakatlık, KTK 85, TBK 49'
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
    extraJsonLd: [orgJsonLd, websiteJsonLd]
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
