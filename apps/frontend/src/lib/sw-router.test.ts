import { describe, it, expect } from "bun:test";

import { createRouter, type FetchContext } from "./sw-router";

const OFFLINE_PAGE = "/offline";
const IMAGE_REGEX = /\.(avif|webp|jpe?g|png|svg|gif)$/i;

const router = createRouter({
  eagerAssets: new Set(["/_app/immutable/chunks/abc123.js", "/_app/immutable/assets/style.css"]),
  offlinePage: OFFLINE_PAGE,
  imageRegex: IMAGE_REGEX,
  maxDynamicCacheSize: 100,
});

/** Create a minimal mock Cache */
const createMockCache = (entries: Record<string, Response> = {}): Cache => {
  const store = new Map<string, Response>(Object.entries(entries));

  return {
    match: async (key: RequestInfo | URL) => {
      const url = typeof key === "string" ? key : key instanceof URL ? key.toString() : key.url;
      return store.get(url)?.clone();
    },
    put: async (key: RequestInfo | URL, response: Response) => {
      const url = typeof key === "string" ? key : key instanceof URL ? key.toString() : key.url;
      store.set(url, response.clone());
    },
    keys: async () => [...store.keys()].map((url) => new Request(url)),
    delete: async (key: RequestInfo | URL) => {
      const url = typeof key === "string" ? key : key instanceof URL ? key.toString() : key.url;
      return store.delete(url);
    },
    add: async () => {},
    addAll: async () => {},
    matchAll: async () => [],
  };
};

const ok = (body = "ok", type: ResponseType = "basic"): Response => {
  const res = new Response(body, { status: 200 });
  Object.defineProperty(res, "type", { value: type });
  return res;
};

const createCtx = (
  overrides: Partial<FetchContext> & { url: URL; request: Request },
): FetchContext => ({
  staticCache: createMockCache(),
  dynamicCache: createMockCache(),
  destination: "" as RequestDestination,
  mode: "navigate" as RequestMode,
  preloadResponse: Promise.resolve(undefined),
  waitUntil: () => {},
  fetch: () => Promise.resolve(ok()),
  ...overrides,
});

const req = (
  url: string,
  _destination: RequestDestination = "",
): { url: URL; request: Request } => ({
  url: new URL(url, "https://example.com"),
  request: new Request(new URL(url, "https://example.com")),
});

// ─── ROUTE 1: Static Assets (cache-first) ───

describe("ROUTE 1: Static Assets", () => {
  it("returns cached response for eager asset", async () => {
    const cached = ok("cached-js");
    const ctx = createCtx({
      ...req("/_app/immutable/chunks/abc123.js"),
      staticCache: createMockCache({
        "/_app/immutable/chunks/abc123.js": cached,
      }),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("cached-js");
  });

  it("falls through when eager asset is not in static cache", async () => {
    const networkResponse = ok("from-network");
    const ctx = createCtx({
      ...req("/_app/immutable/chunks/abc123.js"),
      fetch: () => Promise.resolve(networkResponse),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("from-network");
  });

  it("falls through when pathname is not in eager set", async () => {
    const networkResponse = ok("not-eager");
    const ctx = createCtx({
      ...req("/some-page"),
      fetch: () => Promise.resolve(networkResponse),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("not-eager");
  });
});

// ─── ROUTE 2: Images (cache-first, runtime) ───

describe("ROUTE 2: Images", () => {
  it("returns cached image from dynamic cache", async () => {
    const cached = ok("cached-image");
    const { url, request } = req("/photo.webp");
    const ctx = createCtx({
      url,
      request,
      dynamicCache: createMockCache({ [request.url]: cached }),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("cached-image");
  });

  it("returns cached image when destination is 'image'", async () => {
    const cached = ok("cached-image");
    const { url } = req("/api/avatar");
    const request = new Request(url);
    Object.defineProperty(request, "destination", { value: "image" });

    const ctx = createCtx({
      url,
      request,
      destination: "image",
      dynamicCache: createMockCache({ [request.url]: cached }),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("cached-image");
  });

  it("fetches from network when image is not cached", async () => {
    const networkResponse = ok("network-image");
    const ctx = createCtx({
      ...req("/photo.avif"),
      fetch: () => Promise.resolve(networkResponse),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("network-image");
  });

  it("caches successful network response in dynamic cache", async () => {
    const dynamicCache = createMockCache();
    const { url, request } = req("/photo.png");
    const ctx = createCtx({
      url,
      request,
      dynamicCache,
      waitUntil: (p) => {
        p.catch(() => {});
      },
      fetch: () => Promise.resolve(ok("new-image")),
    });

    await router(ctx);
    const cached = await dynamicCache.match(request);
    expect(cached).toBeDefined();
    expect(await cached!.text()).toBe("new-image");
  });

  it("returns 408 when offline and image is not cached", async () => {
    const ctx = createCtx({
      ...req("/photo.jpg"),
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    const res = await router(ctx);
    expect(res.status).toBe(408);
  });

  it("does not throw when offline and image is not cached", async () => {
    const ctx = createCtx({
      ...req("/photo.jpg"),
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    expect(router(ctx)).resolves.toBeDefined();
  });
});

// ─── ROUTE 3: HTML / API (network-first) ───

describe("ROUTE 3: HTML / API", () => {
  it("returns network response when online", async () => {
    const ctx = createCtx({
      ...req("/blog"),
      fetch: () => Promise.resolve(ok("fresh-html")),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("fresh-html");
  });

  it("caches successful network response in dynamic cache", async () => {
    const dynamicCache = createMockCache();
    const { url, request } = req("/about");
    const ctx = createCtx({
      url,
      request,
      dynamicCache,
      waitUntil: (p) => {
        p.catch(() => {});
      },
      fetch: () => Promise.resolve(ok("about-page")),
    });

    await router(ctx);
    const cached = await dynamicCache.match(request);
    expect(cached).toBeDefined();
    expect(await cached!.text()).toBe("about-page");
  });

  it("uses preloadResponse when available", async () => {
    const ctx = createCtx({
      ...req("/"),
      preloadResponse: Promise.resolve(ok("preloaded")),
      fetch: () => {
        throw new Error("fetch should not be called");
      },
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("preloaded");
  });

  it("falls back to fetch when preloadResponse is undefined", async () => {
    const ctx = createCtx({
      ...req("/"),
      preloadResponse: Promise.resolve(undefined),
      fetch: () => Promise.resolve(ok("fetched")),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("fetched");
  });

  it("falls back to dynamic cache when offline", async () => {
    const { url, request } = req("/blog");
    const ctx = createCtx({
      url,
      request,
      dynamicCache: createMockCache({ [request.url]: ok("cached-blog") }),
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("cached-blog");
  });

  it("falls back to static cache when not in dynamic cache", async () => {
    const { url, request } = req("/about");
    const ctx = createCtx({
      url,
      request,
      staticCache: createMockCache({ [request.url]: ok("static-about") }),
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("static-about");
  });

  it("returns offline page for navigation requests when no cache hit", async () => {
    const offlineResponse = ok("offline-page");
    const ctx = createCtx({
      ...req("/never-visited"),
      mode: "navigate",
      staticCache: createMockCache({ [OFFLINE_PAGE]: offlineResponse }),
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    const res = await router(ctx);
    expect(await res.text()).toBe("offline-page");
  });

  it("throws when offline, no cache, and not a navigation", async () => {
    const ctx = createCtx({
      ...req("/api/data"),
      mode: "cors",
      fetch: () => Promise.reject(new TypeError("Failed to fetch")),
    });

    expect(router(ctx)).rejects.toThrow("Failed to fetch");
  });
});
