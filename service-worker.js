const CACHE_NAME = "financecalc-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./calculators.js",
  "./data-handler.js",
  "./charts.js",
  "./alerts.js",
  "./adv-calculator.js",
  "./tax-calculator.js",
  "./script.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request)); // always fetch fresh copy
});
