// api/kusur-analizi.js
// Vercel serverless proxy: POST /api/kusur-analizi
// KUSURAI backend'ine (Railway) güvenli köprü. Gizli API anahtarı YALNIZ burada,
// sunucu tarafında tutulur; tarayıcıya asla gönderilmez.
//
// Gerekli Vercel ortam değişkenleri (Settings -> Environment Variables):
//   KUSURAI_API_URL  -> https://www.kusurtespiti.com.tr   (sondaki / olmadan)
//   KUSURAI_API_KEY  -> KUSURAI backend'indeki SITE_API_KEY ile AYNI değer

export default async function handler(req, res) {
  // Sadece POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const API_URL = process.env.KUSURAI_API_URL;
    const API_KEY = process.env.KUSURAI_API_KEY;

    if (!API_URL || !API_KEY) {
      return res.status(500).json({
        error: 'Kusur analizi servisi yapılandırılmamış (KUSURAI_API_URL / KUSURAI_API_KEY eksik).',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const senaryo = (body.senaryo_aciklama || '').toString().trim();

    // Basit doğrulama
    if (!senaryo || senaryo.length < 15) {
      return res.status(400).json({ error: 'Lütfen kazayı en az birkaç cümleyle açıklayın.' });
    }
    if (senaryo.length > 5000) {
      return res.status(400).json({ error: 'Açıklama çok uzun (en fazla 5000 karakter).' });
    }

    // --- Basit hız sınırı (in-memory; prod için Redis önerilir) ---
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    if (!global.__kusurRate) global.__kusurRate = {};
    const entry = global.__kusurRate[ip] || { count: 0, last: now };
    if (now - entry.last > 1000 * 60 * 10) { entry.count = 0; entry.last = now; }
    entry.count += 1; entry.last = now;
    global.__kusurRate[ip] = entry;
    if (entry.count > 20) {
      return res.status(429).json({ error: 'Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin.' });
    }

    // --- KUSURAI backend'ine güvenli istek ---
    const payload = {
      senaryo_aciklama: senaryo,
      taraf_a_isim: body.taraf_a_isim || 'Taraf A',
      taraf_b_isim: body.taraf_b_isim || 'Taraf B',
      taraf_a_arac: body.taraf_a_arac || null,
      taraf_b_arac: body.taraf_b_arac || null,
      taraf_a_kural_ihlali: body.taraf_a_kural_ihlali || null,
      taraf_b_kural_ihlali: body.taraf_b_kural_ihlali || null,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55 sn

    let upstream;
    try {
      upstream = await fetch(`${API_URL.replace(/\/$/, '')}/api/partner/kusur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      const msg = err.name === 'AbortError'
        ? 'Analiz zaman aşımına uğradı. Lütfen tekrar deneyin.'
        : 'Kusur analizi servisine ulaşılamadı.';
      return res.status(502).json({ error: msg });
    }
    clearTimeout(timeout);

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!upstream.ok) {
      const detail = (data && (data.detail || data.error)) || 'Analiz başarısız oldu.';
      return res.status(upstream.status).json({ error: detail });
    }

    // Başarılı sonucu olduğu gibi döndür
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
  }
}
