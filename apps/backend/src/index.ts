import { Hono } from "hono";
import { cache } from "hono/cache";

type Bindings = {};

const app = new Hono<{ Bindings: Bindings }>()
  .use(
    "*",
    cache({
      cacheName: "portfolio-backend",
      cacheControl: "max-age=3600",
    }),
  )
  .get("/", (c) => {
    console.log("Received request at /");
    return c.json({ message: "Hello from backend worker!" });
  });

export type AppType = typeof app;

export default app;
