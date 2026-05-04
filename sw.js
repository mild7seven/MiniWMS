// Ganti versi cache setiap kali ada pembaruan pada index.html atau aset lainnya
const CACHE_NAME = 'wms-agri-v4-cache';

// Daftar file dan aset eksternal yang harus disimpan untuk penggunaan offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Cache Bootstrap dari CDN agar UI tetap rapi dan modal berfungsi saat offline
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// --- 1. Event Install: Menyimpan aset ke Cache ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker v4] Caching App Shell & Assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  // Memaksa service worker versi baru untuk segera mengambil alih tanpa menunggu tab ditutup
  self.skipWaiting(); 
});

// --- 2. Event Activate: Membersihkan Cache versi lama ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Jika nama cache tidak sama dengan versi saat ini, hapus cache lama
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker v4] Menghapus cache usang:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Memastikan service worker langsung mengontrol halaman saat itu juga
  self.clients.claim();
});

// --- 3. Event Fetch: Menyajikan data dari Cache jika offline ---
self.addEventListener('fetch', event => {
  // Hanya proses request dengan metode GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Jika ada di cache lokal, sajikan langsung (Offline First)
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Jika tidak ada di cache, coba ambil dari jaringan (Internet)
        return fetch(event.request).catch(() => {
          console.warn('[Service Worker] Fetch gagal. Perangkat offline dan resource tidak di-cache:', event.request.url);
        });
      })
  );
});
