const CACHE_NAME = "cotizador-cache-v1";
const urlsToCache = [
  "/Cotizador-Turismo-Magico/index.html",
  "/Cotizador-Turismo-Magico/manifest.json",
  "/Cotizador-Turismo-Magico/icon-192.png",
  "/Cotizador-Turismo-Magico/icon-512.png",
  "/Cotizador-Turismo-Magico/logo_turismo.png"
];

// Instalar y cachear recursos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log("Service Worker instalado");
});

// Activar y limpiar cachés viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  console.log("Service Worker activado");
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en caché, lo devuelve
      if (response) {
        return response;
      }
      // Si no, intenta desde la red
      return fetch(event.request).catch(() => {
        // Si falla, devuelve index.html como fallback
        return caches.match("/Cotizador-Turismo-Magico/index.html");
      });
    })
  );
});
