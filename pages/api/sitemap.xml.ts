import { ALL_ROUTES } from "~/lib/routes";
import { SITE } from "~/lib/site";
import { abs } from "~/lib/structured-data";

/**
 * Serves /sitemap.xml (rewritten to this route in next.config.js). Built from
 * the central route registry so new pages appear automatically and the URLs
 * match the canonical form (SITE.url + path, no trailing slash except root).
 */
export const config = {
  runtime: "edge",
};

function generateSiteMap() {
  const urls = ALL_ROUTES.map(
    (route) => `  <url>
    <loc>${abs(route.path)}</loc>
    <lastmod>${SITE.dateModified}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export default function handler() {
  return new Response(generateSiteMap(), {
    headers: {
      "content-type": "text/xml; charset=utf-8",
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
