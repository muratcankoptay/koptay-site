// RSS Feed Oluşturucu
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://koptay.av.tr';
const STRAPI_URL = 'https://passionate-basket-17f9c03fdf.strapiapp.com';

async function fetchArticles() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('RSS Feed fetch error:', error);
    return [];
  }
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateRSS() {
  console.log('📡 Generating RSS Feed...');
  
  const articles = await fetchArticles();
  const buildDate = new Date().toUTCString();
  
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Koptay Hukuk Bürosu - Makaleler</title>
    <link>${SITE_URL}</link>
    <description>Hukuk alanındaki güncel gelişmeler, yargıtay kararları ve uzman görüşlerimiz</description>
    <language>tr-TR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>Koptay Hukuk Bürosu</title>
      <link>${SITE_URL}</link>
    </image>
`;

  articles.slice(0, 20).forEach(article => {
    const pubDate = new Date(article.publishedAt || article.createdAt).toUTCString();
    const link = `${SITE_URL}/makale/${article.slug}`;
    
    rss += `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt || '')}</description>
      <content:encoded><![CDATA[${article.content || article.excerpt || ''}]]></content:encoded>
      <dc:creator>${escapeXml(article.author || 'Av. Murat Can Koptay')}</dc:creator>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category || 'Hukuk')}</category>
    </item>`;
  });

  rss += `
  </channel>
</rss>`;

  const rssPath = path.join(__dirname, 'rss.xml');
  fs.writeFileSync(rssPath, rss, 'utf8');
  
  console.log(`✅ RSS Feed generated: ${rssPath}`);
  console.log(`📊 Total articles in feed: ${Math.min(articles.length, 20)}`);
}

generateRSS().catch(console.error);
