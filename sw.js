const CACHE_NAME = 'study-tracker-v4';
const OFFLINE_URL = 'offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('تم تخزين الموارد في ذاكرة التخزين المؤقت');
        return cache.addAll(urlsToCache)
          .then(() => cache.add(OFFLINE_URL));
      })
  );
});

self.addEventListener('fetch', (event) => {
  // تجاهل طلبات POST أو غير GET
  if (event.request.method !== 'GET') return;

  // معالجة طلبات الصفحات
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    // معالجة الطلبات الأخرى
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((response) => {
              // تخزين الموارد الجديدة في الكاش
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
              return response;
            });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// معالجة المزامنة في الخلفية
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      syncPendingData()
    );
  }
});

async function syncPendingData() {
  // هنا يمكنك إضافة منطق لمزامنة البيانات المحفوظة
  console.log('Syncing pending data in background...');
}