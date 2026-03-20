# Personal Website

Bun monorepo containing my personal website frontend and backend API worker.

## Structure

```
apps/
  frontend/   SvelteKit app deployed to Cloudflare Workers
  backend/    Hono API worker deployed to Cloudflare Workers
```

## Prerequisites

- [Bun](https://bun.sh) v1+

## Getting Started

```bash
bun install

# start both frontend and backend dev servers
bun run dev

# or start them individually
bun run dev:frontend
bun run dev:backend
```

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `bun run dev`        | Start all dev servers              |
| `bun run build`      | Build frontend for production      |
| `bun run test:unit`  | Run unit tests across all apps     |
| `bun run lint`       | Lint all apps                      |
| `bun run format`     | Format all apps                    |
| `bun run format:check` | Check formatting without writing |
| `bun run check:ci`   | SvelteKit sync + svelte-check      |
