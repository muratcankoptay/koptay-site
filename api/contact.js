// api/contact.js
// Vercel serverless function: POST /api/contact
// Gereksinim: Vercel ENV -> RESEND_API_KEY

export default async function handler(req, res) {
  // Sadece POST kabul et
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, subject, message, recaptchaToken } = body || {};

    // Basit validasyon
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Eksik alan: name, email ve message zorunlu.' });
    }
    // Basit email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Geçersiz e-posta adresi.' });
    }

    // --- (opsiyonel) reCAPTCHA doğrulama ---
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
    if (RECAPTCHA_SECRET) {
      if (!recaptchaToken) {
        return res.status(400).json({ error: 'reCAPTCHA token eksik.' });
      }
      const rcRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(recaptchaToken)}`,
      });
      const rcJson = await rcRes.json();
      if (!rcJson.success || (rcJson.score && rcJson.score < 0.3)) {
        return res.status(400).json({ error: 'reCAPTCHA doğrulaması başarısız.' });
      }
    }

    // --- Basit rate-limit (in-memory) - prod için Redis/DB tavsiye edilir ---
    // Bu basit örnek process belleğinde çalışır. Vercel serverless resetlenebilir.
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const now = Date.now();
    if (!global.__contactRate) global.__contactRate = {};
    const entry = global.__contactRate[ip] || { count: 0, last: now };
    if (now - entry.last > 1000 * 60 * 15) { // 15 dk sonra reset
      entry.count = 0;
      entry.last = now;
    }
    entry.count += 1;
    entry.last = now;
    global.__contactRate[ip] = entry;
    if (entry.count > 10) {
      return res.status(429).json({ error: 'Çok fazla istek, lütfen 15 dakika sonra tekrar deneyin.' });
    }

    // --- Mail gönderme (Resend) ---
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      return res.status(500).json({ error: 'Mail hizmeti yapılandırılmamış (RESEND_API_KEY eksik).' });
    }

    // Temiz bir HTML e-posta şablonu
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #B8860B; border-bottom: 3px solid #B8860B; padding-bottom: 15px; margin-top: 0;">
            🏛️ Yeni İletişim Formu Mesajı
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #B8860B;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px;">📋 İletişim Bilgileri</h3>
            <p><strong>👤 İsim:</strong> ${escapeHtml(name)}</p>
            <p><strong>📧 E-posta:</strong> ${escapeHtml(email)}</p>
            ${subject ? `<p><strong>� Konu:</strong> ${escapeHtml(subject)}</p>` : ''}
          </div>
          
          <div style="background-color: white; padding: 25px; border: 2px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px;">💬 Mesaj İçeriği</h3>
            <div style="line-height: 1.8; color: #555; font-size: 16px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              ${escapeHtml(message).replace(/\n/g, '<br/>')}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            <strong>IP:</strong> ${ip}<br>
            <strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}
          </p>
          
          <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #B8860B, #DAA520); border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: white; font-size: 14px; font-weight: 500;">
              🌐 Bu mesaj <strong>koptay.av.tr</strong> web sitesinin iletişim formundan gönderilmiştir.
            </p>
          </div>
        </div>
      </div>
    `;

    // Not: "from" olarak domaininizden göndermek istersen Resend üzerinde domain doğrulaması yapın.
    // Eğer henüz doğrulanmadıysa "from" alanını resend'in izin verdiği şekilde ayarlayın.
    const payload = {
      from: `Koptay Hukuk <onboarding@resend.dev>`,
      to: ['info@koptay.av.tr'],
      reply_to: email,
      subject: `[Web - İletişim] ${subject || 'Yeni mesaj'}`,
      html
    };

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    if (!r.ok) {
      console.error('Resend error:', r.status, text);
      return res.status(500).json({ error: 'E-posta gönderilemedi', detail: text });
    }

    // Başarılı
    return res.status(200).json({ ok: true, message: 'Mesaj gönderildi.' });
  } catch (err) {
    console.error('Contact function error:', err);
    return res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
  }
}

// Basit HTML escape (XSS önlemi)
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}