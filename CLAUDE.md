# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Bun workspaces monorepo for my personal website, deployed to Cloudflare Workers:
- **apps/frontend/** — SvelteKit personal website (Svelte 5, Tailwind CSS v4, adapter-cloudflare)
- **apps/backend/** — Hono API worker (minimal scaffold, has Secrets Store binding with `GITHUB_PORTFOLIO_TOKEN`)

## Commands

```bash
bun install                  # install all workspace deps (run from root)
bun run dev                  # start both frontend + backend dev servers
bun run dev:frontend         # start only frontend (Vite)
bun run dev:backend          # start only backend (Wrangler)
bun run build                # production build (frontend only)
bun run lint                 # oxlint across all apps
bun run format               # oxfmt across all apps
bun run format:check         # check formatting without writing
bun run test:unit            # bun test across all apps
bun run check:ci             # svelte-kit sync + svelte-check (strict)
```

Run a single test file: `cd apps/frontend && bun test src/components/timeline/nodes.test.ts`
Update snapshots: `cd apps/frontend && bun test --update-snapshots`

All root scripts use `bun --filter` to proxy into workspaces. You can also run workspace scripts directly: `cd apps/frontend && bun run build`.

## Architecture

### Frontend (apps/frontend/)

SvelteKit file-based routing with Svelte 5 runes (`$props()`, `$state()`, etc.).

**Path aliases** (defined in svelte.config.js):
- `$blogs` → `./src/blog_posts`
- `$components` → `./src/components`
- `$data` → `./src/data`
- `$images` → `./src/images`
- `$lib` → `./src/lib`
- `$interfaces` → `./src/interfaces`

**Key directories:**
- `src/routes/` — Pages and endpoints (+page.svelte, +page.ts, +server.ts, +layout.svelte)
- `src/components/` — Reusable Svelte components
- `src/blog_posts/` — Markdown blog posts processed by mdsvex
- `src/data/` — Static content (projects.json, timeline.ts)
- `src/interfaces/` — TypeScript interfaces (ProjectConfig, TimelineEntry)
- `src/lib/seo/` — Structured data (JSON-LD) schemas and SEO component
- `src/lib/actions/` — Svelte actions (inview)
- `src/lib/helpers/` — Utility functions (groupBy)
- `src/lib/config.ts` — Site-wide constants (SITE_URL)
- `src/theme.css` — Tailwind v4 @theme color tokens (no tailwind.config.js)
- `src/app.css` — Global styles with custom utility classes (.btn, .card, .h1-.h4, .preset-*)

**Styling:** Tailwind CSS v4 using @theme syntax in theme.css. Dark mode via `.dark` class.

**Blog:** Markdown files in `src/blog_posts/` with YAML frontmatter (title, date, last_updated, description, tags). Processed by mdsvex. Paginated listing at `/blog`, individual posts at `/blog/[slug]`.

**SEO:** Custom `SEO.svelte` component injects JSON-LD structured data, Open Graph tags, Twitter Card tags, canonical URLs, and robots meta into `<svelte:head>`. Schema types include Person, WebSite, BlogPosting, ProfilePage, CollectionPage, BreadcrumbList, and SoftwareSourceCode.

**Service worker:** Offline-first caching with cache-first for static assets/images and network-first for HTML/API. Includes offline fallback page.

**Data is static** — projects, timeline entries, and blog posts are defined in source files, no database.

### Backend (apps/backend/)

Hono app on Cloudflare Workers. Single entry point at src/index.ts. Cache middleware enabled (1-hour max-age). Secrets Store binding configured but not yet used in code.

## Testing

Bun's built-in test runner. Tests are co-located with source files (`*.test.ts` next to the code they test). Snapshots live in `__snapshots__/*.snap`.

```typescript
import { describe, it, expect } from "bun:test";
```

## Tooling

- **Formatter:** oxfmt (no config file, uses defaults)
- **Linter:** oxlint (no config file, uses defaults, lints `src/` only)
- **No Prettier or ESLint** — uses Rust-based tooling exclusively
- **Engine constraint:** `.npmrc` has `engine-strict=true`, requires Bun v1+

## CI Pipeline (.github/workflows/CI.yaml)

Jobs run on push to main, PRs, and weekly schedule:
1. **oxfmt** — format check
2. **oxlint** — lint (depends on oxfmt)
3. **svelte-check** — type checking (depends on oxfmt)
4. **test** — unit tests (depends on oxfmt, syncs SvelteKit first)
5. **build** — production build + upload artifact (depends on oxlint, svelte-check, test)
6. **CodeQL** — security analysis (independent)

Deploy job exists but is commented out.
