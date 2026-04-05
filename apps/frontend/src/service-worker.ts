/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((names) => Promise.all(names.map((name) => caches.delete(name))))
			.then(() => self.registration.unregister()),
	);
	self.clients.claim();
});
