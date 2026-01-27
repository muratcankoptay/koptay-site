// Makale görüntülenme sayacı - Netlify Function
// Upstash Redis kullanarak gerçek zamanlı view tracking

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Upstash yapılandırılmamışsa fallback JSON kullan
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    // Fallback: Statik veriler döndür
    const fallbackViews = {
      "arac-deger-kaybi-nedir-nasil-hesaplanir": 12457,
      "2026-avukatlik-asgari-ucret-tarifesi-detayli-analiz-ve-uygulama-rehberi": 8943,
      "sigorta-tahkim-komisyonu-basvurusu-ve-sureci": 6834,
      "trafik-kazasi-sonrasi-maluliyet-heyet-raporu-nasil-ve-nereden-alinir-2025-rehberi": 5692,
      "2026-ilave-tediye-hesaplama-ve-hukuki-nitelik-rehberi": 4521,
      "meslek-hastaligi-tazminati-hukuki-sartlari-surec-ve-hesaplama-yontemi-2025-uzman-rehberi": 4128,
      "tramer-kusur-oranina-itiraz-rehberi-yuzde-100-kusurlu": 3187,
      "ilave-tediye-alacak-tahsili-ve-dava-sureci-2026": 2834,
      "arac-mahrumiyet-tazminati-hesaplama-sartlari-2026": 1256,
      "pert-arac-rayic-deger-tespiti-tahkim-itiraz-rehberi-2026": 847
    };

    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ views: fallbackViews, source: 'fallback' })
      };
    }

    // POST için fallback
    const { slug } = JSON.parse(event.body || '{}');
    const currentViews = fallbackViews[slug] || 0;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ slug, views: currentViews + 1, source: 'fallback' })
    };
  }

  // Upstash Redis ile çalış
  const redis = async (command, ...args) => {
    const response = await fetch(`${UPSTASH_URL}/${command}/${args.join('/')}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    return response.json();
  };

  try {
    // GET: Tüm makale görüntülenme sayılarını getir
    if (event.httpMethod === 'GET') {
      const slug = event.queryStringParameters?.slug;
      
      if (slug) {
        // Tek makale
        const result = await redis('GET', `article:${slug}:views`);
        const views = parseInt(result.result) || 0;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ slug, views })
        };
      }

      // Tüm makaleler
      const keys = await redis('KEYS', 'article:*:views');
      const allViews = {};
      
      if (keys.result && keys.result.length > 0) {
        for (const key of keys.result) {
          const slug = key.replace('article:', '').replace(':views', '');
          const viewResult = await redis('GET', key);
          allViews[slug] = parseInt(viewResult.result) || 0;
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ views: allViews })
      };
    }

    // POST: Görüntülenme sayısını artır
    if (event.httpMethod === 'POST') {
      const { slug } = JSON.parse(event.body || '{}');
      
      if (!slug) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Slug gerekli' })
        };
      }

      // INCR komutu ile atomik artırma
      const result = await redis('INCR', `article:${slug}:views`);
      const newViews = parseInt(result.result) || 1;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ slug, views: newViews, incremented: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Article views error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Sunucu hatası', details: error.message })
    };
  }
};
