const CACHE_NAME = 'capital-flow-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];

// Instalación del Service Worker (Guarda la app)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Interceptar las peticiones de red (Sirve la app sin internet)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en la memoria, lo muestra. Si no, va a internet.
        return response || fetch(event.request);
      })
  );
});

// Limpieza de cachés viejos al actualizar la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
