import Head from "next/head";
import { SITE } from "~/lib/site";

interface Props {
  /** Page-specific title; site name is appended automatically. Omit for home. */
  title?: string;
  /** Full <title> content used verbatim (overrides `title`). */
  titleFull?: string;
  description?: string;
  /** Path portion of the canonical URL, e.g. "/" or "/nik-generator". */
  path?: string;
  /** Path of this page's Open Graph card, e.g. "/og/generator.png". */
  ogImage?: string;
  /** The heading printed on that card, for its alt text. */
  ogHeading?: string;
  noindex?: boolean;
}

export const Seo = ({
  title,
  titleFull,
  description,
  path = "/",
  ogImage: ogImagePath = "/og.png",
  ogHeading,
  noindex,
}: Props) => {
  const pageTitle =
    titleFull ?? (title ? `${title} · ${SITE.name}` : SITE.title);
  const desc = description ?? SITE.description;
  const url = `${SITE.url}${path}`;
  const ogImage = `${SITE.url}${ogImagePath}`;
  const ogAlt = `${SITE.name}: ${
    ogHeading ?? SITE.tagline
  }. Contoh 16 digit NIK yang dibagi per bagian.`;

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
