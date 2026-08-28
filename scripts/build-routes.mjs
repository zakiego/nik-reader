/**
 * Generates the root `_routes.json` that `@cloudflare/next-on-pages` merges into
 * the one it emits.
 *
 * Cloudflare Pages runs the Worker for every path in `include` and serves
 * everything else straight from the CDN as a static asset. A static asset costs
 * no Pages Function invocation, so the list below is deliberately the *complete*
 * set of paths that genuinely need server code:
 *
 *   - the routes under `pages/api`, minus the exclusions below
 *   - `/_next/data/*`, the JSON payloads Next fetches for client-side navigation
 *   - every `source` of a redirect or rewrite in `next.config.js`
 *
 * Deriving all of that rather than hand-writing it is what keeps the list from
 * drifting: a redirect whose source is missing from `include` never reaches the
 * Worker, so it silently stops redirecting, and a new API route would silently
 * 404.
 */
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import nextConfig from "../next.config.js";

/**
 * API routes that must NOT reach the Worker.
 *
 * Nothing in the app calls tRPC any more — reading a NIK and listing regions
 * both happen in the browser off a lazily loaded chunk. Leaving the endpoint
 * routed would bill a Worker invocation for every request from a tab still
 * running a pre-client-side bundle, which is roughly 69k a day against a 100k
 * daily limit. Served as a static asset instead, those requests 404 for free
 * and the stale tab recovers on its next reload.
 */
const EXCLUDED_API_ROUTES = ["/api/trpc"];

/** Paths that always need the Worker, whatever the filesystem says. */
const ALWAYS_INCLUDE = ["/_next/data/*"];

/**
 * Rewrite Next's path syntax into Cloudflare's, which understands only a
 * trailing `*`. `/blog/:slug` and `/blog/:path*` both become `/blog/*`.
 */
const toRoutePattern = (source) =>
  source.replace(/\/:[^/]+\*?/g, "/*").replace(/\/\*(?:\/\*)+/g, "/*");

/** Walk `pages/api` and return the route path each file serves. */
const listApiRoutes = async (dir = "pages/api", base = "/api") => {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      routes.push(
        ...(await listApiRoutes(
          join(dir, entry.name),
          `${base}/${entry.name}`,
        )),
      );
      continue;
    }

    const name = entry.name.replace(/\.(?:t|j)sx?$/, "");
    // `[param]` and `[...param]` segments match anything below them.
    const segment = name.startsWith("[") ? "*" : name;
    routes.push(segment === "index" ? base : `${base}/${segment}`);
  }

  return routes;
};

/** `rewrites()` may return an array or the beforeFiles/afterFiles/fallback form. */
const flattenRewrites = (rewrites) =>
  Array.isArray(rewrites)
    ? rewrites
    : [
        ...(rewrites?.beforeFiles ?? []),
        ...(rewrites?.afterFiles ?? []),
        ...(rewrites?.fallback ?? []),
      ];

const apiRoutes = (await listApiRoutes()).filter(
  (route) => !EXCLUDED_API_ROUTES.some((prefix) => route.startsWith(prefix)),
);

const redirects = (await nextConfig.redirects?.()) ?? [];
const rewrites = flattenRewrites(await nextConfig.rewrites?.());

const include = [
  ...new Set([
    ...ALWAYS_INCLUDE,
    ...apiRoutes,
    ...[...redirects, ...rewrites].map((rule) => toRoutePattern(rule.source)),
  ]),
].sort();

await writeFile(
  "_routes.json",
  `${JSON.stringify({ version: 1, include }, null, 2)}\n`,
);

console.log(`_routes.json: ${include.length} paths routed to the Worker`);
for (const path of include) {
  console.log(`  ${path}`);
}
for (const prefix of EXCLUDED_API_ROUTES) {
  console.log(`  (excluded: ${prefix}/* — served as a static asset)`);
}
