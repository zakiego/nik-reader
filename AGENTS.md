# AGENTS.md

## Project overview

NIK Reader (nik.zakiego.com) decodes an Indonesian NIK (16-digit Nomor Induk Kependudukan) into province, regency/city, district, gender and birth date, and generates sample NIKs. Copy is Bahasa Indonesia; code, comments and commits are English.

- Next.js 13.4.7, **Pages Router** (`pages/`), React 18, TypeScript.
- Tailwind CSS **v3** with shadcn/ui (new-york, Radix base) in `components/ui`.
- React Query for the read mutation and the region lists, react-hook-form + zod for the reader form.
- Deployed to Cloudflare Pages with `@cloudflare/next-on-pages`.
- Product context lives in `PRODUCT.md`, the design system in `DESIGN.md`. Read both before UI work.

## Commands

Use pnpm (Node 22, see `.node-version`).

- Install: `pnpm install`
- Dev server: `pnpm dev` (Next falls back to another port if 3000 is taken; read the startup log)
- Typecheck: `pnpm typecheck`
- Lint and format check: `pnpm check` (Biome). Auto-fix: `pnpm biome check --apply .`
- Tests: `pnpm test` (Vitest)
- Production build: `pnpm build`
- Cloudflare build / preview / deploy: `pnpm pages:build`, `pnpm pages:preview`, `pnpm pages:deploy`
- T3 Code worktree setup: `bash scripts/setup-worktree.sh` (runs when T3 creates a worktree; copies gitignored `.env*` files from the main checkout and installs from the lockfile)
- T3 Code worktree clean: `bash scripts/clean-worktree.sh` (runs when a thread settles; deletes `node_modules` and `.next` in that worktree, does nothing in the main checkout)

The T3 actions are in `t3.json`. T3 runs a project's saved actions, not the file, so after a change to it, import them again in Settings > Projects > Actions.

Before calling work done, run `pnpm typecheck`, `pnpm check` and `pnpm test`, and `pnpm build` for anything that touches pages or config. Don't run `pnpm build` while `pnpm dev` is running: both write `.next`.

No env file is needed. `NEXT_PUBLIC_SITE_URL` is optional and defaults to `https://nik.zakiego.com` (`lib/site.ts`). The `.conductor/settings.toml` comments about Supabase and tRPC are out of date; neither exists anymore.

## Architecture

- `pages/`: four indexable pages (`index`, `cek-tanggal-lahir-dari-nik`, `nik-generator`, `cara-membaca-nik`) plus `api/v0/nik.ts` (JSON API) and `api/sitemap.xml.ts`.
- `components/pages/Read.tsx` is the reader, `components/pages/Predict.tsx` the generator, `components/NikTool.tsx` the home tabs that hold both.
- `components/Layout.tsx` wraps every page: `Navbar`, breadcrumbs, content, `RelatedLinks`, `Footer`.
- `lib/routes.ts` is the single source for each page's path, titles, description, nav labels and OG image. The sitemap, nav, footer, related links and `components/Seo.tsx` all read it.
- `lib/nik-segments.ts` holds the five NIK parts (digit ranges) and the fictional `SAMPLE_NIK`.
- `utils/extract.ts` decodes gender and birth date; `utils/read.ts` turns a NIK into region names.

### Keep work off the Worker

The free Workers plan counts every request that runs server code. Two rules keep the site under it:

- **Reading a NIK and filling the region pickers run in the browser.** The region data (~550 KB in `lib/region.ts` and `data/*.json`) loads as a lazy chunk. Client code must import `~/lib/region-client` or `~/utils/read`, never `~/lib/region` directly, or the whole dataset lands in the initial bundle.
- **`_routes.json` lists only paths that need server code.** `scripts/build-routes.mjs` generates it at the start of `pages:build` from `pages/api` and the redirect/rewrite sources in `next.config.js`. Adding a redirect there is enough.

API routes use `export const config = { runtime: "edge" }` because next-on-pages requires it. Keep it.

## Privacy and analytics

- The NIK is never stored or sent anywhere, analytics included. `lib/analytics.ts` events carry only field names that failed to decode, never values. `UMAMI_BEFORE_SEND` (inlined in `pages/_document.tsx`) scrubs anything NIK-shaped as a backstop.
- Umami goals match on the event names in `lib/analytics.ts`. Renaming one breaks its goal.

## UI rules

- KISS. One plain input, one button, the shortest copy that works. No helper paragraphs, instruction lists, sample/demo buttons or clever widgets unless asked.
- Mono palette: warm white, near-black, warm grays, no accent color; red only for errors. Light and dark follow the system. Tokens are OKLCH channels in `styles/globals.css`, mapped in `tailwind.config.js`. Use semantic classes (`bg-background`, `text-muted-foreground`), never raw colors.
- Build from shadcn components (`pnpm dlx shadcn@latest add <name>`), and restyle by editing the component's variants in `components/ui`, not with one-off class overrides.
- Radius scale: 6px chips, 12px controls, 16px panels (`rounded-md`, `rounded-lg`/`rounded-xl`, `rounded-2xl`). Panels use a 1px border, no shadow.
- Fonts: Public Sans and JetBrains Mono via `next/font` in `pages/_app.tsx`, set on `:root` so portalled popovers get them. Next 13.4's font list is old (no Geist).
- Tailwind is v3: v4-only syntax such as `[a]:hover:`, `has-data-[...]` or `@container` variants silently does nothing.
- Inputs need a 16px font on phones to avoid iOS zoom. Hover styles only apply on hover-capable devices (`future.hoverOnlyWhenSupported`).
- Visible UI changes need before/after screenshots, with production (nik.zakiego.com) as the "before".

## SEO assets

- Every page renders `<Seo>` with its `ROUTES` entry and `<JsonLd>` built from `lib/structured-data.ts`. Keep one h1 per page. FAQ items feed both the visible accordion and the FAQPage JSON-LD.
- OG cards: edit `scripts/og/template.html`, then run `bash scripts/og/generate.sh` (needs `agent-browser`) to rebuild `public/og/*.png`. Copy `public/og/home.png` to `public/og.png`.
- Icons: `uv run scripts/generate-icons.py` (needs Google Chrome) rebuilds the favicon set and manifest icons.

## Tests

- Vitest picks up `**/*.test.ts` only (`vitest.config.mts`). There are no component tests; `utils/extract.test.ts` covers birth date and century logic.
- Run one test: `pnpm vitest run -t "<name>"`.
- Add or update tests when changing decoding logic in `utils/`.

## Code style

- Biome formats and lints (2 spaces, 80 columns, organized imports). `lib/provinsi.ts`, `lib/kabupaten.ts` and `lib/kecamatan.ts` are generated data and ignored.
- Import alias `~/` maps to the repo root.
- Comments explain why, in plain English.

## Commits and PRs

- Conventional Commits, lowercase and imperative: `type(scope): description` (e.g. `fix(read): keep focus after a failed read`). One logical change per commit, and every commit must typecheck and pass tests.
- PRs are drafts with a TL;DR first, a Demo section with before/after images for UI changes, and a test plan that quotes real results.
