/**
 * Strapi'den makaleleri çekip articles.json dosyasını günceller
 * 
 * Kullanım:
 *   node scripts/sync-articles.js
 * 
 * Not: Strapi Cloud planı askıya alındığında çalışmaz.
 *      Ay başında veya plan yükseltildikten sonra çalıştırın.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRAPI_URL = 'https://passionate-basket-17f9c03fdf.strapiapp.com';
const OUTPUT_FILE = path.join(__dirname, '..', 'articles.json');
const PUBLIC_OUTPUT = path.join(__dirname, '..', 'public', 'articles.json');

async function syncArticles() {
  console.log('🔄 Strapi\'den makaleler çekiliyor...\n');
  console.log(`   URL: ${STRAPI_URL}/api/articles?populate=*\n`);

  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
    
    if (!response.ok) {
      if (response.status === 503) {
        console.error('❌ Strapi askıya alınmış (503 Service Unavailable)');
        console.error('   Strapi Cloud plan limitleri dolmuş olabilir.');
        console.error('   Ay başında tekrar deneyin veya planı yükseltin.\n');
        process.exit(1);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.warn('⚠️  Strapi\'de hiç makale bulunamadı.\n');
      process.exit(1);
    }

    // Dosyaya yaz
    const jsonContent = JSON.stringify(data, null, 2);
    
    fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf8');
    console.log(`✅ ${OUTPUT_FILE} güncellendi`);
    
    fs.writeFileSync(PUBLIC_OUTPUT, jsonContent, 'utf8');
    console.log(`✅ ${PUBLIC_OUTPUT} güncellendi`);
    
    console.log(`\n📊 Toplam ${data.data.length} makale senkronize edildi:\n`);
    
    data.data.forEach((article, index) => {
      const date = article.publishedat || article.publishedAt || article.createdAt;
      console.log(`   ${index + 1}. ${article.title}`);
      console.log(`      📅 ${date?.split('T')[0] || 'Tarih yok'}`);
      console.log(`      🏷️  ${article.category || 'Kategori yok'}\n`);
    });

    console.log('🎉 Senkronizasyon tamamlandı!\n');
    console.log('   Şimdi siteyi deploy edebilirsiniz:');
    console.log('   npm run build && netlify deploy --prod\n');

  } catch (error) {
    if (error.cause?.code === 'ENOTFOUND' || error.cause?.code === 'ECONNREFUSED') {
      console.error('❌ Strapi sunucusuna bağlanılamadı.');
      console.error('   İnternet bağlantınızı kontrol edin.\n');
    } else {
      console.error('❌ Hata:', error.message, '\n');
    }
    process.exit(1);
  }
}

// Script'i çalıştır
syncArticles();
