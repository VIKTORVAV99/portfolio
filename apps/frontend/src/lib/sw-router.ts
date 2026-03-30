export interface RouterConfig {
  eagerAssets: Set<string>;
  offlinePage: string;
  imageRegex: RegExp;
  maxDynamicCacheSize: number;
}

export interface FetchContext {
  staticCache: Cache;
  dynamicCache: Cache;
  url: URL;
  request: Request;
  destination: RequestDestination;
  mode: RequestMode;
  preloadResponse: Promise<Response | undefined>;
  waitUntil: (p: Promise<unknown>) => void;
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const limitCacheSize = async (cache: Cache, maxItems: number) => {
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await Promise.all(keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key)));
  }
};

export const createRouter = (config: RouterConfig) => {
  const { eagerAssets, offlinePage, imageRegex, maxDynamicCacheSize } = config;

  return async (ctx: FetchContext): Promise<Response> => {
    const { staticCache, dynamicCache, url, request, destination, mode, waitUntil } = ctx;

    const cacheDynamic = (req: Request, res: Response) =>
      waitUntil(
        dynamicCache
          .put(req, res.clone())
          .then(() => limitCacheSize(dynamicCache, maxDynamicCacheSize)),
      );

    // ROUTE 1: Static Assets (The filtered eager cache) -> Cache-first
    if (eagerAssets.has(url.pathname)) {
      const response = await staticCache.match(url.pathname);
      if (response) return response;
    }

    // ROUTE 2: Images -> Cache-first (Runtime caching)
    if (destination === "image" || imageRegex.test(url.pathname)) {
      const cachedImage = await dynamicCache.match(request);

      if (cachedImage) {
        waitUntil(dynamicCache.put(request, cachedImage.clone()));
        return cachedImage;
      }

      try {
        const response = await ctx.fetch(request);
        if (response.status === 200 && response.type === "basic") {
          cacheDynamic(request, response);
        }
        return response;
      } catch {
        return new Response("", { status: 404 });
      }
    }

    // ROUTE 3: Everything else (HTML pages, dynamic API routes) -> Network-first
    try {
      const response = (await ctx.preloadResponse) || (await ctx.fetch(request));

      if (response.status === 200 && response.type === "basic") {
        cacheDynamic(request, response);
      }

      return response;
    } catch {
      const cachedResponse =
        (await dynamicCache.match(request)) || (await staticCache.match(request));

      if (cachedResponse) return cachedResponse;

      if (mode === "navigate") {
        const offlineResponse = await staticCache.match(offlinePage);
        if (offlineResponse) return offlineResponse;
      }

      return new Response("", { status: 404 });
    }
  };
};
