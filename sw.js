const CACHE_NAME = "spaniel-smash-v1.2.4";
const APP_SHELL = [
  "/",
  "/index.html",
  "/site.webmanifest",
  "/favicon.svg",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/og-image.png",
  "/dist/main.js",
  "/dist/game.js",
  "/docs/images/obstacles/player.svg",
  "/docs/images/obstacles/spaniel.svg",
  "/docs/images/obstacles/andy.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const stale = cacheNames.filter((name) => name.startsWith("spaniel-smash-v") && name !== CACHE_NAME);
      return Promise.all(stale.map((name) => caches.delete(name)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response.ok) {
          return response;
        }

        const shouldCache = requestUrl.pathname.startsWith("/dist/")
          || requestUrl.pathname.startsWith("/docs/images/")
          || requestUrl.pathname.endsWith(".png")
          || requestUrl.pathname.endsWith(".svg")
          || requestUrl.pathname.endsWith(".webmanifest")
          || requestUrl.pathname.endsWith(".ico");

        if (shouldCache) {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy).catch(() => undefined);
          });
        }

        return response;
      }).catch(() => caches.match(event.request));
    })
  );
});
