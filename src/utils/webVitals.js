/**
 * Web Vitals monitoring for Google Core Web Vitals
 * Reports to console in development, can be sent to analytics in production
 */

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator.connection &&
    'effectiveType' in navigator.connection
    ? navigator.connection.effectiveType
    : '';
}

export function sendToAnalytics(metric) {
  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric);
    return;
  }

  // Send to Vercel Analytics in production
  const analyticsId = import.meta.env.VITE_VERCEL_ANALYTICS_ID;
  if (!analyticsId) {
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 * Measures: LCP, FID, CLS, FCP, TTFB
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Dynamically import web-vitals library
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }).catch((err) => {
    console.warn('Failed to load web-vitals:', err);
  });
}
