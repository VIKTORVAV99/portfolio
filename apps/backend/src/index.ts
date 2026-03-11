import { Hono } from "hono";

type Bindings = {};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
	return c.json({ message: "Hello from backend worker!" });
});

export default app;
