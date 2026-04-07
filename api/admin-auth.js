// Web Admin Panel - Kimlik Doğrulama (Vercel API Route)
// Vercel Environment Variables gerekli:
// - ADMIN_PASSWORD: Admin panel şifresi
// - ADMIN_SECRET: JWT imzalama anahtarı (rastgele uzun string)

import crypto from 'crypto';

// Basit JWT oluşturma
function createToken(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

// JWT doğrulama
function verifyToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    return res.status(500).json({ error: 'Sunucu yapılandırması eksik. Vercel ortam değişkenlerini ayarlayın.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { password, action } = body || {};

    // Token doğrulama isteği
    if (action === 'verify') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false });
      }
      const token = authHeader.replace('Bearer ', '');
      const payload = verifyToken(token, ADMIN_SECRET);
      return res.status(payload ? 200 : 401).json({ valid: !!payload, user: payload?.user || null });
    }

    // Login isteği
    if (!password) {
      return res.status(400).json({ error: 'Şifre gerekli' });
    }

    // Sabit zamanlı karşılaştırma (timing attack koruması)
    const passwordBuffer = Buffer.from(password);
    const adminBuffer = Buffer.from(ADMIN_PASSWORD);

    const isValid = passwordBuffer.length === adminBuffer.length &&
                    crypto.timingSafeEqual(passwordBuffer, adminBuffer);

    if (!isValid) {
      return res.status(401).json({ error: 'Yanlış şifre' });
    }

    const token = createToken({ user: 'admin', role: 'admin' }, ADMIN_SECRET);

    return res.status(200).json({ success: true, token, message: 'Giriş başarılı' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
}
