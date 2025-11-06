// Dinamik Sitemap Oluşturucu
// Strapi'den makaleleri çekip sitemap.xml'e yazar

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Site URL'i - kendi domaininizi buraya yazın
const SITE_URL = 'https://koptay.av.tr';

// Strapi API URL
const STRAPI_URL = 'https://passionate-basket-17f9c03fdf.strapiapp.com';

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
  { url: '/hesaplama-araclari/tazminat-hesaplama', changefreq: 'weekly', priority: '0.8' },
  { url: '/muvekkil-paneli', changefreq: 'monthly', priority: '0.6' }
];

async function fetchArticles() {
  try {
    console.log('📡 Fetching articles from Strapi...');
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
    
    if (!response.ok) {
      console.error('❌ Strapi fetch failed:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.data.length} articles`);
    
    return data.data.map(article => ({
      slug: article.slug,
      updatedAt: article.updatedAt,
      category: article.category
    }));
  } catch (error) {
    console.error('❌ Error fetching articles:', error.message);
    return [];
  }
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  // Makaleleri çek
  const articles = await fetchArticles();
  
  // Sitemap başlangıcı
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Statik sayfalar ekle
  console.log('📄 Adding static pages...');
  staticPages.forEach(page => {
    const lastmod = new Date().toISOString().split('T')[0];
    sitemap += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Makale sayfaları ekle
  console.log('📚 Adding article pages...');
  articles.forEach(article => {
    const lastmod = article.updatedAt ? article.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0];
    sitemap += `  <url>
    <loc>${SITE_URL}/makale/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Sitemap sonu
  sitemap += `</urlset>`;

  // Dosyaya yaz
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📊 Total URLs: ${staticPages.length + articles.length}`);
  console.log(`   - Static pages: ${staticPages.length}`);
  console.log(`   - Article pages: ${articles.length}`);
  console.log(`📁 File: ${sitemapPath}`);
}

// Script çalıştır
generateSitemap().catch(console.error);
