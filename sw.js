const CACHE_NAME = 'bin-app-v1';
const urlsToCache = [
    '/bin-storage-app/',
    '/bin-storage-app/index.html',
    '/bin-storage-app/styles.css',
    '/bin-storage-app/app.js',
    '/bin-storage-app/idb.js',
    '/bin-storage-app/manifest.json'
    // Add your icons too if you want them cached/offline:
    // '/bin-storage-app/icon-192.png',
    // '/bin-storage-app/icon-512.png'
];

// The rest of the install/fetch listeners stay the same
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});