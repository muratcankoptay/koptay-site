// Makale görüntülenme sayacı servisi
// NOT: Eski Netlify Functions endpoint'i devre dışı (site Vercel'de).
// Görüntülenme sayıları şu an localStorage'da tutulur (basit fallback).
// Sunucu tarafı sayım gerekirse api/article-views.js Vercel function eklenmeli.
const API_BASE = '/.netlify/functions/article-views';
const USE_LOCAL_FALLBACK = true;  // Sunucu tarafı endpoint hazırlanana kadar

const localGet = () => {
  try { return JSON.parse(localStorage.getItem('articleViews') || '{}'); }
  catch { return {}; }
};
const localSet = (views) => {
  try { localStorage.setItem('articleViews', JSON.stringify(views)); } catch {}
};

// Tüm makale görüntülenme sayılarını getir
export const getAllArticleViews = async () => {
  if (USE_LOCAL_FALLBACK) return localGet();
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Views fetch failed');
    const data = await response.json();
    return data.views || {};
  } catch (error) {
    console.error('getAllArticleViews error:', error);
    return {};
  }
};

// Tek makale görüntülenme sayısını getir
export const getArticleViews = async (slug) => {
  if (USE_LOCAL_FALLBACK) return localGet()[slug] || 0;
  try {
    const response = await fetch(`${API_BASE}?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error('View fetch failed');
    const data = await response.json();
    return data.views || 0;
  } catch (error) {
    console.error('getArticleViews error:', error);
    return 0;
  }
};

// Görüntülenme sayısını artır
export const incrementArticleViews = async (slug) => {
  // Session'da zaten sayıldı mı kontrol et (aynı oturumda tekrar sayma)
  const viewedKey = `viewed_${slug}`;
  if (sessionStorage.getItem(viewedKey)) {
    return null;
  }

  if (USE_LOCAL_FALLBACK) {
    const views = localGet();
    views[slug] = (views[slug] || 0) + 1;
    localSet(views);
    sessionStorage.setItem(viewedKey, 'true');
    return views[slug];
  }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    });

    if (!response.ok) throw new Error('Increment failed');

    const data = await response.json();
    sessionStorage.setItem(viewedKey, 'true');
    return data.views;
  } catch (error) {
    return null;  // Sessizce başarısız ol; konsola yazma
  }
};

// Toplam görüntülenme sayısını hesapla
export const getTotalViews = async () => {
  const allViews = await getAllArticleViews();
  return Object.values(allViews).reduce((sum, views) => sum + views, 0);
};
