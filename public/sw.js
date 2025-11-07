// Service Worker for adaptive caching
const CACHE_VERSION = 'v4';
const STATIC_CACHE = `koptay-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `koptay-runtime-${CACHE_VERSION}`;

// Assets to precache on install (avoid hashed assets here)
const PRECACHE_URLS = ['/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, RUNTIME_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Handle navigation requests with network-first strategy to avoid stale HTML
  const acceptHeader = request.headers.get('accept') || '';
  const isHTMLRequest = request.mode === 'navigate' || acceptHeader.includes('text/html');

  if (isHTMLRequest) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }))
    );
    return;
  }

  // Strapi API - network first
  if (url.hostname.includes('strapiapp.com')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Hashed static assets - cache first
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          const contentType = response.headers.get('content-type') || '';
          if (response && response.status === 200 && !contentType.includes('text/html')) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: try network, fall back to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        const contentType = response.headers.get('content-type') || '';
        if (response && response.status === 200 && !contentType.includes('text/html')) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
