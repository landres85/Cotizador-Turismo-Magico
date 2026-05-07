// Service Worker básico con más eventos

self.addEventListener("install", event => {
  console.log("Service Worker instalado");
});

self.addEventListener("activate", event => {
  console.log("Service Worker activado");
});

self.addEventListener("fetch", event => {
  console.log("Interceptando:", event.request.url);
  event.respondWith(fetch(event.request));
});