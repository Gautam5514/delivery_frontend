// FaceDeliver service worker — minimal shell required for Android PWA install prompt.
// Strategy: network-first for all requests (always fresh data), with a
// graceful offline fallback for navigation requests only.

const CACHE_NAME = "gopo-shell-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  // Pre-cache the root page so the app shell is available offline.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Remove caches from previous versions.
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Only intercept navigation (page load) requests.
  // API calls and asset fetches are passed through normally so data is always
  // live — this is a photo-matching app, stale data is never acceptable.
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(OFFLINE_URL)
    )
  );
});
