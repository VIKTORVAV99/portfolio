/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from "$service-worker";

// Explicitly type the global 'self' object for Service Workers
declare const self: ServiceWorkerGlobalScope;

// Split caches to prevent infinite growth and manage lifecycles separately
const CACHE = `static-cache-${version}`;
const DYNAMIC_CACHE = `dynamic-cache-${version}`;

const ASSETS = [
  ...build,       // the app itself
  ...files,       // everything in `static`
  ...prerendered, // prerendered pages (make sure to include an '/offline' page here!)
];

self.addEventListener("install", (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      // Delete old versions of both static and dynamic caches
      if (key !== CACHE && key !== DYNAMIC_CACHE) {
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(deleteOldCaches());

  // Tell the active service worker to take control of the page immediately
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ignore POST requests, and ignore browser extension requests
  if (event.request.method !== "GET" || url.protocol.startsWith('chrome-extension')) {
      return;
  }

  async function respond() {
    const staticCache = await caches.open(CACHE);

    // 1. Static Assets: Cache-first strategy
    if (ASSETS.includes(url.pathname)) {
      const response = await staticCache.match(url.pathname);
      if (response) return response;
    }

    // 2. Everything else: Network-first strategy
    try {
      const response = await fetch(event.request);

      // Only cache valid, same-origin responses to avoid bloating storage with opaque responses
      if (response.status === 200 && response.type === 'basic') {
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        // Important: You must clone the response before putting it in the cache
        dynamicCache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      // Network failed (offline). Try the dynamic cache first
      const dynamicCache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await dynamicCache.match(event.request) || await staticCache.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      // If it's a page request and we are offline, show the offline page
      if (event.request.mode === 'navigate') {
          const offlinePage = await staticCache.match('/offline');
          if (offlinePage) return offlinePage;
      }

      // If there's no cache and no offline page, fail gracefully
      throw err;
    }
  }

  event.respondWith(respond());
});