// Makale görüntülenme sayacı servisi
const API_BASE = '/.netlify/functions/article-views';

// Tüm makale görüntülenme sayılarını getir
export const getAllArticleViews = async () => {
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
  try {
    // Session'da zaten sayıldı mı kontrol et (aynı oturumda tekrar sayma)
    const viewedKey = `viewed_${slug}`;
    if (sessionStorage.getItem(viewedKey)) {
      return null; // Zaten bu oturumda sayıldı
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    });

    if (!response.ok) throw new Error('Increment failed');
    
    const data = await response.json();
    
    // Bu oturumda sayıldı olarak işaretle
    sessionStorage.setItem(viewedKey, 'true');
    
    return data.views;
  } catch (error) {
    console.error('incrementArticleViews error:', error);
    return null;
  }
};

// Toplam görüntülenme sayısını hesapla
export const getTotalViews = async () => {
  const allViews = await getAllArticleViews();
  return Object.values(allViews).reduce((sum, views) => sum + views, 0);
};
