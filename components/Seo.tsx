import Head from "next/head";
import { SITE } from "~/lib/site";

interface Props {
  /** Page-specific title; site name is appended automatically. Omit for home. */
  title?: string;
  description?: string;
  /** Path portion of the canonical URL, e.g. "/" or "/login". */
  path?: string;
  noindex?: boolean;
}

export const Seo = ({ title, description, path = "/", noindex }: Props) => {
  const pageTitle = title ? `${title} · ${SITE.name}` : SITE.title;
  const desc = description ?? SITE.description;
  const url = `${SITE.url}${path}`;
  const ogImage = `${SITE.url}/og.png`;
  const ogAlt = `${SITE.name} · ${SITE.tagline}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={SITE.keywords.join(", ")} />
      <meta name="author" content={SITE.author} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogAlt} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogAlt} />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:creator" content={SITE.twitter} />
    </Head>
  );
};
