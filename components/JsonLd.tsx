/**
 * Renders a JSON-LD structured-data block. Placed in the page body (rather than
 * <head>) which Google reads fine and avoids next/head script serialization
 * quirks. Pass a schema object built by lib/structured-data.
 */
export const JsonLd = ({ data }: { data: object }) => {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output of trusted, static schema objects
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
