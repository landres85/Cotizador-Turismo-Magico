const CACHE_NAME = "cotizador-cache-v10";
const urlsToCache = [
  "/Cotizador-Turismo-Magico/",
  "/Cotizador-Turismo-Magico/index.html",
  "/Cotizador-Turismo-Magico/manifest.json",
  "/Cotizador-Turismo-Magico/sw.js",
  "/Cotizador-Turismo-Magico/icon-192.png",
  "/Cotizador-Turismo-Magico/icon-512.png",
  "/Cotizador-Turismo-Magico/logo_turismo.png",
  "/Cotizador-Turismo-Magico/favicon.ico",
  // Archivos CSS
  "/Cotizador-Turismo-Magico/styles.css",
  "/Cotizador-Turismo-Magico/responsive.css",
  // Archivos JS
  "/Cotizador-Turismo-Magico/app.js",
  "/Cotizador-Turismo-Magico/utilidades.js",
  "/Cotizador-Turismo-Magico/formulario.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log("📦 Archivos a cachear:", urlsToCache);
      try {
        await cache.addAll(urlsToCache);
        console.log("✅ Cache completo:", urlsToCache.length, "archivos");
      } catch (error) {
        console.error("❌ Error cacheando archivos:", error);
      }
    })
  );
  self.skipWaiting();
  console.log("Service Worker instalado");
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
  console.log("Service Worker activado");
});

self.addEventListener("fetch", event => {
  console.log("🔎 Petición interceptada:", event.request.url);
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        console.log("🌐 Respuesta de red:", event.request.url);
        return networkResponse;
      } catch (error) {
        console.warn("⚠️ Error de red, buscando en caché:", event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          console.log("📂 Respuesta desde caché:", event.request.url);
          return cachedResponse;
        }

        // 🔹 Fallback solo para documentos HTML
        if (event.request.destination === "document") {
          const fallback =
            (await caches.match("/Cotizador-Turismo-Magico/index.html")) ||
            (await caches.match("/index.html")) ||
            (await caches.match("/Cotizador-Turismo-Magico/"));
          if (fallback) {
            console.log("↩️ Respuesta fallback index.html");
            return fallback;
          }
          return new Response("<h1>Estás offline</h1>", {
            headers: { "Content-Type": "text/html" },
            status: 503
          });
        }

        // 🔹 Para otros recursos (CSS, JS, imágenes)
        return new Response("", { status: 503 });
      }
    })()
  );
});
