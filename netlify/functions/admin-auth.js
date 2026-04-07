// Web Admin Panel - Kimlik Doğrulama Fonksiyonu
// Netlify Environment Variables gerekli:
// - ADMIN_PASSWORD: Admin panel şifresi
// - ADMIN_SECRET: JWT imzalama anahtarı (rastgele uzun string)

const crypto = require('crypto');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Basit JWT oluşturma (harici kütüphane gerektirmez)
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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Sunucu yapılandırması eksik. Netlify ortam değişkenlerini ayarlayın.' })
    };
  }

  try {
    const { password, action } = JSON.parse(event.body || '{}');

    // Token doğrulama isteği
    if (action === 'verify') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { statusCode: 401, headers, body: JSON.stringify({ valid: false }) };
      }
      const token = authHeader.replace('Bearer ', '');
      const payload = verifyToken(token, ADMIN_SECRET);
      return {
        statusCode: payload ? 200 : 401,
        headers,
        body: JSON.stringify({ valid: !!payload, user: payload?.user || null })
      };
    }

    // Login isteği
    if (!password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Şifre gerekli' }) };
    }

    // Sabit zamanlı karşılaştırma (timing attack koruması)
    const passwordBuffer = Buffer.from(password);
    const adminBuffer = Buffer.from(ADMIN_PASSWORD);
    
    const isValid = passwordBuffer.length === adminBuffer.length && 
                    crypto.timingSafeEqual(passwordBuffer, adminBuffer);

    if (!isValid) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Yanlış şifre' }) };
    }

    const token = createToken({ user: 'admin', role: 'admin' }, ADMIN_SECRET);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, token, message: 'Giriş başarılı' })
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Sunucu hatası' }) };
  }
};

// Token doğrulama yardımcı fonksiyonu - diğer fonksiyonlar tarafından kullanılır
exports.verifyToken = verifyToken;
