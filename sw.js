const CACHE_NAME = 'among-us-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/html5-qrcode.min.js',
  '/manifest.json'
  // Wichtig: Wenn du das erste Mal hochlädst, passe die Liste an. 
  // Bilder wie '/images/map-alpha.jpg' werden automatisch vom Browser gecached, sobald sie aufgerufen werden, 
  // aber man kann sie hier auch direkt eintragen.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache Treffer - Rückgabe aus dem Cache (Offline!)
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
