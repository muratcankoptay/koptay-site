/**
 * Performance Helper Utilities
 * INP ve LCP optimizasyonları için yardımcı fonksiyonlar
 */

/**
 * Ağır hesaplamaları ana thread'i bloke etmeden çalıştırır
 * INP skorunu iyileştirmek için kritik
 * @param {Function} fn - Çalıştırılacak hesaplama fonksiyonu
 * @param {number} delay - Bekleme süresi (ms)
 */
export const deferHeavyComputation = (fn, delay = 0) => {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const result = fn();
        resolve(result);
      }, { timeout: 1000 });
    } else {
      setTimeout(() => {
        const result = fn();
        resolve(result);
      }, delay);
    }
  });
};

/**
 * Uzun görevleri parçalara ayırır (Long Task chunking)
 * 50ms üzeri görevleri önler
 * @param {Array} items - İşlenecek öğeler
 * @param {Function} processor - Her öğe için işlem fonksiyonu
 * @param {number} chunkSize - Her parçadaki öğe sayısı
 */
export const processInChunks = async (items, processor, chunkSize = 10) => {
  const results = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    // Her chunk arasında browser'a nefes aldır
    await new Promise(resolve => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(resolve, { timeout: 100 });
      } else {
        setTimeout(resolve, 0);
      }
    });
    
    const chunkResults = chunk.map(processor);
    results.push(...chunkResults);
  }
  
  return results;
};

/**
 * Event handler'ları debounce eder
 * INP için önemli - hızlı tekrarlanan input'ları birleştirir
 * @param {Function} fn - Debounce edilecek fonksiyon
 * @param {number} delay - Bekleme süresi (ms)
 */
export const debounce = (fn, delay = 150) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Event handler'ları throttle eder
 * Scroll, resize gibi yoğun event'ler için
 * @param {Function} fn - Throttle edilecek fonksiyon
 * @param {number} limit - Minimum aralık (ms)
 */
export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load için Intersection Observer wrapper
 * Görsel ve ağır component'ler için
 * @param {Element} element - İzlenecek element
 * @param {Function} callback - Görünür olunca çalışacak fonksiyon
 * @param {Object} options - Observer options
 */
export const lazyLoad = (element, callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { ...defaultOptions, ...options });

  observer.observe(element);
  return observer;
};

/**
 * Sayfa görünürlüğünü izler
 * Tab değiştiğinde gereksiz işlemleri durdur
 */
export const onVisibilityChange = (onVisible, onHidden) => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      onHidden?.();
    } else {
      onVisible?.();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * Kritik kaynakları preload eder
 * LCP için önemli
 * @param {string} href - Kaynak URL'i
 * @param {string} as - Kaynak tipi (image, script, style, font)
 */
export const preloadResource = (href, as = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};

/**
 * Network durumunu kontrol eder
 * Yavaş bağlantıda ağır özellikler kapatılabilir
 */
export const getNetworkInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return { type: 'unknown', effectiveType: '4g', saveData: false };
  }
  
  return {
    type: connection.type,
    effectiveType: connection.effectiveType,
    saveData: connection.saveData,
    downlink: connection.downlink,
    rtt: connection.rtt
  };
};

/**
 * Yavaş bağlantı kontrolü
 * 2g veya slow-2g bağlantılarda ağır özellikleri devre dışı bırak
 */
export const isSlowConnection = () => {
  const info = getNetworkInfo();
  return info.effectiveType === '2g' || info.effectiveType === 'slow-2g' || info.saveData;
};
