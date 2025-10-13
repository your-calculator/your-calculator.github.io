const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./alerts.js",
  "./calculators.js",
  "./charts.js",
  "./data-handler.js",
  "./icons/icon-128.png",
  "./icons/icon-512.png",
  "./icons/icon-256.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
