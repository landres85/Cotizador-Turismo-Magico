
const CACHE_NAME = "cotizador-cache-v4";
const urlsToCache = [
  "/Cotizador-Turismo-Magico/",
  "/Cotizador-Turismo-Magico/index.html",
  "/Cotizador-Turismo-Magico/manifest.json",
  "/Cotizador-Turismo-Magico/icon-192.png",
  "/Cotizador-Turismo-Magico/icon-512.png",
  "/Cotizador-Turismo-Magico/logo_turismo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  console.log("Service Worker instalado");
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  console.log("Service Worker activado");
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, la devuelve
        return response;
      })
      .catch(() => {
        // Si falla, devuelve index.html como fallback
        return caches.match("/Cotizador-Turismo-Magico/index.html");
      })
  );
});
