// === KOPTAY SITE — SELF-DESTRUCT SERVICE WORKER ===
//
// Onceki surumlerde sw.js asset/image cache'leme yapiyordu.
// Bazi tarayicilarda eski cache'lerden 404 yanitlari donmesi sorunu
// ortaya cikti. Bu surum:
//   1. Tum eski cache'leri siler
//   2. Hicbir fetch'i intercept ETMEZ (network direkt akar)
//   3. Aktive olur olmaz kendini unregister eder
//   4. Acik tum sekmeleri yeniden yukler
//
// Birkac gun sonra (kullanicilarin %95+ temizlenince) bu dosya
// tamamen kaldirilabilir.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}

    try {
      await self.registration.unregister();
    } catch (e) {}

    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        try { client.navigate(client.url); } catch (e) {}
      });
    } catch (e) {}
  })());
});

// Fetch handler EKLENMEDI — istek dogrudan network'e gider, hicbir
// cache stratejisi yoktur.
