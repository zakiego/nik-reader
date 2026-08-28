/**
 * Generates the root `_routes.json` that `@cloudflare/next-on-pages` merges into
 * the one it emits.
 *
 * Cloudflare Pages runs the Worker for every path in `include` and serves
 * everything else straight from the CDN as a static asset. A static asset costs
 * no Pages Function invocation, so the list below is deliberately the *complete*
 * set of paths that genuinely need server code:
 *
 *   - the routes under `pages/api`
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

const apiRoutes = await listApiRoutes();

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
