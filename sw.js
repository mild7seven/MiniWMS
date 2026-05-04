const CACHE_NAME = 'wms-agri-v6-pwabuilder';

// Aset inti yang WAJIB tersimpan di HP/Laptop saat pertama kali diinstal
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Library Bootstrap & Icons dari CDN (Wajib di-cache agar tampilan tidak hancur saat offline)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css'
];

// --- 1. Event INSTALL: Melakukan Pre-cache aset ---
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Paksa SW baru langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).catch(err => console.error('[Service Worker] Precache gagal:', err))
  );
});

// --- 2. Event ACTIVATE: Membersihkan sisa cache versi lama ---
self.addEventListener('activate', (event) => {
  self.clients.claim(); // Langsung ambil kontrol halaman
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// --- 3. Event FETCH: Strategi Hibrida (PWABuilder Standard) ---
self.addEventListener('fetch', (event) => {
  // Hanya tangani request tipe GET (Abaikan POST, PUT, dll)
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // STRATEGI 1: NETWORK FIRST, FALLBACK TO CACHE
  // Digunakan untuk navigasi HTML. Tujuannya: Selalu cari versi web terbaru, jika internet mati, pakai yang di cache.
  if (event.request.mode === 'navigate' || requestUrl.pathname === '/' || requestUrl.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Simpan versi terbaru ke cache secara diam-diam
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          // Jika offline, ambil index.html dari cache
          console.warn('[Service Worker] Offline: Melayani halaman dari Cache.');
          return caches.match('./index.html');
        })
    );
    return; // Hentikan eksekusi di sini
  }

  // STRATEGI 2: CACHE FIRST, FALLBACK TO NETWORK
  // Digunakan untuk CSS, JS, dan Gambar. Tujuannya: Loading instan.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Langsung kembalikan dari Cache
      }
      
      // Jika tidak ada di cache, ambil dari Internet
      return fetch(event.request)
        .then((networkResponse) => {
          // Pastikan response valid sebelum di-cache (menghindari caching halaman error)
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            // Jika request mengarah ke domain luar (seperti CDN Bootstrap), type-nya 'cors' atau 'opaque', kita tetap simpan
            if (networkResponse.status === 200) {
               const responseClone = networkResponse.clone();
               caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
            return networkResponse;
          }
          
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          console.error('[Service Worker] Gagal mengambil aset:', event.request.url);
        });
    })
  );
});
