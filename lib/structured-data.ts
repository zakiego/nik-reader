/**
 * Builders for JSON-LD structured data (schema.org). Keeping these in one place
 * means every page emits consistent entity references (WebSite, author,
 * WebApplication) and the search-facing schema stays close to the SEO copy.
 */
import { SITE } from "~/lib/site";

/**
 * Absolute URL for a given path, matching the canonical form the Seo component
 * emits (Next's default: no trailing slash except the root).
 */
export const abs = (path: string) => `${SITE.url}${path === "/" ? "/" : path}`;

const ORG_ID = `${SITE.url}/#website`;
const AUTHOR_ID = `${SITE.url}/#author`;

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface Crumb {
  name: string;
  path: string;
}

/** The publishing person (site author). Referenced by other schemas via @id. */
export const authorSchema = () => ({
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: SITE.author,
  url: SITE.authorUrl,
});

export const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": ORG_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  inLanguage: "id-ID",
  publisher: { "@id": AUTHOR_ID },
});

export const webApplicationSchema = () => ({
  "@type": "WebApplication",
  name: SITE.name,
  url: `${SITE.url}/`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript.",
  inLanguage: "id-ID",
  description: SITE.description,
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  featureList: [
    "Baca dan cek detail NIK",
    "Cek tanggal lahir dari NIK",
    "Cek jenis kelamin dari NIK",
    "Cek provinsi, kabupaten, dan kecamatan dari NIK",
    "Generate contoh NIK",
  ],
  author: { "@id": AUTHOR_ID },
});

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: abs(c.path),
  })),
});

export const faqSchema = (items: FaqItem[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

export const howToSchema = (input: {
  name: string;
  description: string;
  steps: HowToStep[];
}) => ({
  "@type": "HowTo",
  name: input.name,
  description: input.description,
  inLanguage: "id-ID",
  step: input.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});

export const articleSchema = (input: {
  title: string;
  description: string;
  path: string;
}) => ({
  "@type": "Article",
  headline: input.title,
  description: input.description,
  inLanguage: "id-ID",
  mainEntityOfPage: abs(input.path),
  image: `${SITE.url}/og.png`,
  datePublished: SITE.datePublished,
  dateModified: SITE.dateModified,
  author: { "@id": AUTHOR_ID },
  publisher: { "@id": AUTHOR_ID },
});

/**
 * Wrap one or more schema objects into a single @graph document. Emitting one
 * script per page (rather than many) keeps the markup tidy and lets nodes share
 * @id references cleanly.
 */
export const graph = (...nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});
