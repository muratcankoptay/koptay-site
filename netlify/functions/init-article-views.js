// Makale görüntülenme sayılarını başlat - Netlify Function
// Bu fonksiyon bir kez çağrılarak başlangıç değerlerini yükler

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Sadece POST kabul et
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'POST method required' })
    };
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Upstash credentials not configured' })
    };
  }

  // Başlangıç değerleri
  const initialViews = {
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

  const redis = async (command, ...args) => {
    const response = await fetch(`${UPSTASH_URL}/${command}/${args.join('/')}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    return response.json();
  };

  try {
    const results = [];
    
    for (const [slug, views] of Object.entries(initialViews)) {
      // SETNX: Sadece key yoksa set et (mevcut değerleri korur)
      const key = `article:${slug}:views`;
      const result = await redis('SETNX', key, views);
      results.push({ slug, set: result.result === 1 });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Initial views set (only for new keys)',
        results 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
