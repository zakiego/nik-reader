import type { GetServerSideProps } from "next";
import { ALL_ROUTES } from "~/lib/routes";
import { SITE } from "~/lib/site";
import { abs } from "~/lib/structured-data";

/**
 * Dynamic sitemap served at /sitemap.xml. Built from the central route registry
 * so new pages appear automatically and the URLs match the canonical form
 * (SITE.url + path, no trailing slash except root).
 */
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

// The XML is written directly to the response in getServerSideProps.
export default function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200",
  );
  res.write(generateSiteMap());
  res.end();

  return { props: {} };
};
