// Dinamik Sitemap Oluşturucu
// articles.json'dan makaleleri okuyup sitemap.xml'e yazar.
// SEO: image:image entries, gerçek updatedAt tarihleri, kategori sayfaları, hesaplama araçları kümesi.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://koptay.av.tr';

// XML special characters'ı escape et
const escapeXml = (str = '') => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

// Statik sayfalar
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/hakkimizda', changefreq: 'monthly', priority: '0.8' },
  { url: '/hizmetlerimiz', changefreq: 'monthly', priority: '0.8' },
  { url: '/ekibimiz', changefreq: 'monthly', priority: '0.7' },
  { url: '/makaleler', changefreq: 'daily', priority: '0.9' },
  { url: '/iletisim', changefreq: 'monthly', priority: '0.7' },
  { url: '/hesaplama-araclari', changefreq: 'monthly', priority: '0.8' },
  { url: '/hesaplama-araclari/infaz-yatar', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/vekalet-ucreti', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/tazminat-hesaplama', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/arac-deger-kaybi', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/dava-suresi', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/ilave-tediye', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/iscilik-alacaklari', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/meslek-hastaligi', changefreq: 'weekly', priority: '0.9' },
  { url: '/hesaplama-araclari/trafik-kazasi', changefreq: 'weekly', priority: '0.9' },
  { url: '/kvkk', changefreq: 'yearly', priority: '0.3' }
];

async function fetchArticles() {
  try {
    console.log('📂 Reading articles from local JSON file...');
    const articlesPath = path.join(__dirname, '../articles.json');

    if (!fs.existsSync(articlesPath)) {
      console.error('❌ articles.json not found at:', articlesPath);
      return [];
    }

    const fileContent = fs.readFileSync(articlesPath, 'utf-8');
    const data = JSON.parse(fileContent);

    console.log(`✅ Found ${data.data.length} articles in local file`);

    return data.data.map(article => {
      const imageUrl = (article.image && typeof article.image === 'object')
        ? article.image.url
        : article.image;
      const imageAlt = (article.image && typeof article.image === 'object' && article.image.alternativeText)
        ? article.image.alternativeText
        : article.title;
      return {
        slug: article.slug,
        title: article.title,
        updatedAt: article.updatedAt || article.publishedAt || new Date().toISOString(),
        publishedAt: article.publishedAt || article.updatedAt,
        category: article.category,
        imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`) : null,
        imageAlt
      };
    });
  } catch (error) {
    console.error('❌ Error reading articles:', error.message);
    return [];
  }
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');

  const articles = await fetchArticles();
  const buildDate = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Statik sayfalar
  console.log('📄 Adding static pages...');
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Kategori sayfaları (her kategori için /makaleler?kategori=...)
  console.log('🏷️  Adding category pages...');
  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];
  categories.forEach(cat => {
    sitemap += `  <url>
    <loc>${SITE_URL}/makaleler?kategori=${encodeURIComponent(cat)}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Makale sayfaları
  console.log('📚 Adding article pages...');
  articles.forEach(article => {
    const lastmod = article.updatedAt ? article.updatedAt.split('T')[0] : buildDate;
    const pubDate = article.publishedAt ? article.publishedAt.split('T')[0] : lastmod;
    sitemap += `  <url>
    <loc>${SITE_URL}/makale/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
`;
    if (article.imageUrl) {
      sitemap += `    <image:image>
      <image:loc>${escapeXml(article.imageUrl)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
      <image:caption>${escapeXml(article.imageAlt)}</image:caption>
    </image:image>
`;
    }
    sitemap += `    <news:news>
      <news:publication>
        <news:name>Koptay Hukuk Bürosu</news:name>
        <news:language>tr</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>
`;
  });

  sitemap += `</urlset>`;

  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📊 Total URLs: ${staticPages.length + categories.length + articles.length}`);
  console.log(`   - Static pages: ${staticPages.length}`);
  console.log(`   - Category pages: ${categories.length}`);
  console.log(`   - Article pages: ${articles.length}`);
  console.log(`📁 File: ${sitemapPath}`);
}

generateSitemap().catch(console.error);
