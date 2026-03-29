/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files } from "$service-worker";
import { createRouter } from "$lib/sw-router";

// Explicitly type the global 'self' object for Service Workers
declare const self: ServiceWorkerGlobalScope;

/** Single unversioned static cache — entries are surgically added/pruned per deploy */
const CACHE = "static-cache";
/** Dynamic cache name, this is not versioned as it's meant to be a rolling cache */
const DYNAMIC_CACHE = "dynamic-cache";

/** Image regex with common extensions */
const imageRegex = /\.(avif|webp|jpe?g|png|svg|gif)$/i;

/** Filter function to exclude images from the eager cache, but allow the favicon we always want to cache */
const imageFilter = (url: string) => !imageRegex.test(url) || url.includes("favicon");

/** Assets with content hashes - safe to skip if already cached */
const HASHED_ASSETS = build.filter(imageFilter);

/** Assets without content hashes - must always be re-fetched */
const UNHASHED_ASSETS = files.filter(imageFilter);

const EAGER_ASSETS = new Set(HASHED_ASSETS.concat(UNHASHED_ASSETS));

/** The offline page is pre-cached so it's available before the user ever visits it */
const OFFLINE_PAGE = "/offline";

/** All assets stored in the static cache — EAGER_ASSETS (cache-first) + offline page */
const ALL_CACHED = new Set(EAGER_ASSETS).add(OFFLINE_PAGE);

const handleFetch = createRouter({
  eagerAssets: EAGER_ASSETS,
  offlinePage: OFFLINE_PAGE,
  imageRegex,
  maxDynamicCacheSize: 100,
});

/** Helper function to add files to the static cache */
const addFilesToCache = async () => {
  const cache = await caches.open(CACHE);
  const cached = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
  const newHashedAssets = HASHED_ASSETS.filter((asset) => !cached.has(asset));

  await cache.addAll(newHashedAssets.concat(UNHASHED_ASSETS, OFFLINE_PAGE));
};

/** Helper function to prune stale entries from the static cache */
const pruneStaleEntries = async () => {
  const cache = await caches.open(CACHE);
  const keys = await cache.keys();
  await Promise.all(
    keys.filter((r) => !ALL_CACHED.has(new URL(r.url).pathname)).map((r) => cache.delete(r)),
  );
};

/** Remove dynamic cache entries that are now covered by the static cache */
const pruneDynamicDuplicates = async () => {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  await Promise.all(
    keys.filter((r) => ALL_CACHED.has(new URL(r.url).pathname)).map((r) => cache.delete(r)),
  );
};

const KNOWN_CACHES = new Set([CACHE, DYNAMIC_CACHE]);
/**
 * Delete any caches not matching our known cache names.
 * This is a cleanup function if we ever rename caches
 */
const deleteUnknownCaches = async () => {
  const names = await caches.keys();
  await Promise.all(names.filter((key) => !KNOWN_CACHES.has(key)).map((key) => caches.delete(key)));
};

self.addEventListener("install", (event) => {
  event.waitUntil(addFilesToCache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.registration.navigationPreload?.enable(),
      pruneStaleEntries(),
      pruneDynamicDuplicates(),
      deleteUnknownCaches(),
    ]),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.protocol === "chrome-extension:") return;

  const respond = async () => {
    const [staticCache, dynamicCache] = await Promise.all([
      caches.open(CACHE),
      caches.open(DYNAMIC_CACHE),
    ]);

    return handleFetch({
      staticCache,
      dynamicCache,
      url,
      request: event.request,
      destination: event.request.destination,
      mode: event.request.mode,
      preloadResponse: event.preloadResponse,
      waitUntil: (p: Promise<unknown>) => event.waitUntil(p),
      fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init),
    });
  };

  event.respondWith(respond());
});
