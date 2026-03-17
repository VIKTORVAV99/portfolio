/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from "$service-worker";

// Explicitly type the global 'self' object for Service Workers
declare const self: ServiceWorkerGlobalScope;

/** Versioned static cache name, this will be deleted when a new version is installed */
const CACHE = `static-cache-${version}`;
/** Dynamic cache name, this is not versioned as it's meant to be a rolling cache */
const DYNAMIC_CACHE = `dynamic-cache`;

/** Image regex with common extensions */
const imageRegex = /\.(avif|webp|jpe?g|png|svg|gif)$/i;

/** Filter function to exclude images from the eager cache, but allow the favicon we always want to cache */
const imageFilter = (url: string) => !imageRegex.test(url) || url.includes("favicon");

/** List of assets to precache */
const EAGER_ASSETS = [
  ...build.filter(imageFilter),
  ...files.filter(imageFilter),
  ...prerendered.filter(imageFilter),
];

/** Helper function to trim the dynamic cache to a maximum number of items */
async function limitCacheSize(cacheName: string, maxItems: number) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Delete the oldest items until we are back under the limit
    for (let i = 0; i < keys.length - maxItems; i++) {
      await cache.delete(keys[i]);
    }
  }
}

self.addEventListener("install", (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(EAGER_ASSETS);
  }

  event.waitUntil(addFilesToCache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE && key !== DYNAMIC_CACHE) {
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(deleteOldCaches());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.protocol.startsWith("chrome-extension")) {
    return;
  }

  async function respond() {
    const staticCache = await caches.open(CACHE);
    const dynamicCache = await caches.open(DYNAMIC_CACHE);

    // ROUTE 1: Static Assets (The filtered eager cache) -> Cache-first
    if (EAGER_ASSETS.includes(url.pathname)) {
      const response = await staticCache.match(url.pathname);
      if (response) return response;
    }

    // ROUTE 2: Images -> Cache-first (Runtime caching)
    if (event.request.destination === "image" || imageRegex.test(url.pathname)) {
      const cachedImage = await dynamicCache.match(event.request);

      if (cachedImage) {
        // "Bump" the frequently accessed image to the back of the queue
        event.waitUntil(dynamicCache.put(event.request, cachedImage.clone()));
        return cachedImage;
      }

      // Fetch from network. If it fails (offline), the browser naturally handles the error.
      const response = await fetch(event.request);
      if (response.status === 200 && response.type === "basic") {
        dynamicCache.put(event.request, response.clone());
        limitCacheSize(DYNAMIC_CACHE, 50);
      }

      return response;
    }

    // ROUTE 3: Everything else (HTML pages, dynamic API routes) -> Network-first
    try {
      const response = await fetch(event.request);

      if (response.status === 200 && response.type === "basic") {
        dynamicCache.put(event.request, response.clone());
        limitCacheSize(DYNAMIC_CACHE, 50);
      }

      return response;
    } catch (err) {
      // Offline fallback
      const cachedResponse =
        (await dynamicCache.match(event.request)) || (await staticCache.match(event.request));

      if (cachedResponse) return cachedResponse;

      if (event.request.mode === "navigate") {
        const offlinePage = await staticCache.match("/offline");
        if (offlinePage) return offlinePage;
      }

      throw err;
    }
  }

  event.respondWith(respond());
});
