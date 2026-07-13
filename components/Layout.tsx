import type { ReactNode } from "react";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { RelatedLinks } from "~/components/content/RelatedLinks";
import type { Crumb } from "~/lib/structured-data";

/**
 * Shared page shell: navbar, optional breadcrumbs, page content, related-page
 * links, and footer. Navigation to the other pages lives at the bottom (the
 * related-page cards and the footer sitemap), keeping the top of each page,
 * especially the home page, clean.
 */
export const Layout = ({
  children,
  currentPath,
  breadcrumbs,
}: {
  children: ReactNode;
  /** Path of the current page (excluded from the related-links block). */
  currentPath: string;
  breadcrumbs?: Crumb[];
}) => {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <Navbar />
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      {children}
      <RelatedLinks currentPath={currentPath} />
      <Footer />
    </main>
  );
};
