/**
 * Generates the root `_routes.json` that `@cloudflare/next-on-pages` merges into
 * the one it emits.
 *
 * Cloudflare Pages runs the Worker for every path in `include` and serves
 * everything else straight from the CDN as a static asset. A static asset costs
 * no Pages Function invocation, so the list below is deliberately the *complete*
 * set of paths that genuinely need server code:
 *
 *   - `/api/*`        the edge routes under `pages/api`
 *   - `/_next/data/*` the JSON payloads Next fetches for client-side navigation
 *   - every `source` of a redirect or rewrite in `next.config.js`
 *
 * That last group is why this is generated rather than hand-written: a redirect
 * whose source is not in `include` never reaches the Worker, so it silently
 * stops redirecting. Deriving the list from `next.config.js` keeps the two from
 * drifting apart.
 */
import { writeFile } from "node:fs/promises";
import nextConfig from "../next.config.js";

/** Paths that always need the Worker, whatever `next.config.js` says. */
const ALWAYS_INCLUDE = ["/api/*", "/_next/data/*"];

/**
 * Rewrite Next's path syntax into Cloudflare's, which understands only a
 * trailing `*`. `/blog/:slug` and `/blog/:path*` both become `/blog/*`.
 */
const toRoutePattern = (source) =>
  source.replace(/\/:[^/]+\*?/g, "/*").replace(/\/\*(?:\/\*)+/g, "/*");

/** `rewrites()` may return an array or the beforeFiles/afterFiles/fallback form. */
const flattenRewrites = (rewrites) =>
  Array.isArray(rewrites)
    ? rewrites
    : [
        ...(rewrites?.beforeFiles ?? []),
        ...(rewrites?.afterFiles ?? []),
        ...(rewrites?.fallback ?? []),
      ];

const redirects = (await nextConfig.redirects?.()) ?? [];
const rewrites = flattenRewrites(await nextConfig.rewrites?.());

const include = [
  ...new Set([
    ...ALWAYS_INCLUDE,
    ...[...redirects, ...rewrites].map((rule) => toRoutePattern(rule.source)),
  ]),
].sort();

await writeFile("_routes.json", `${JSON.stringify({ version: 1, include }, null, 2)}\n`);

console.log(`_routes.json: ${include.length} paths routed to the Worker`);
for (const path of include) {
  console.log(`  ${path}`);
}
