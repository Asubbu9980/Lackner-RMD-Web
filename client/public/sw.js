// Service worker for the installable (PWA) app.
// - Page navigations: network first, so a new deploy is picked up right away;
//   falls back to the cached app shell when offline.
// - Hashed build assets (/assets/*): cache first — their names change per build.
// - Other static files and Google Fonts: stale-while-revalidate.
// - API calls (/api/*) and other cross-origin requests are never cached, so
//   calculations always come from the server.

const VERSION = "v1";
const SHELL_CACHE = `rmd-shell-${VERSION}`;
const ASSET_CACHE = `rmd-assets-${VERSION}`;
const RUNTIME_CACHE = `rmd-runtime-${VERSION}`;

const SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/lackner.png",
  "/LeimbergLeClairLackner_logo.png",
  "/pwa-192.png",
  "/pwa-512.png",
];

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = [SHELL_CACHE, ASSET_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const networkFirstPage = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put("/index.html", response.clone());
    }
    return response;
  } catch {
    return (await caches.match("/index.html")) || Response.error();
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(ASSET_CACHE);
    cache.put(request, response.clone());
  }
  return response;
};

const staleWhileRevalidate = async (event) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(event.request);
  const refresh = fetch(event.request)
    .then((response) => {
      // opaque (cross-origin, no-cors) responses are fine to cache for fonts
      if (response.ok || response.type === "opaque") cache.put(event.request, response.clone());
      return response;
    })
    .catch(() => cached);
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  return refresh;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate" && sameOrigin) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (sameOrigin && url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (sameOrigin || FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event));
  }
});
