import type { ReactNode } from "react";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { RelatedLinks } from "~/components/content/RelatedLinks";
import type { Crumb } from "~/lib/structured-data";

/**
 * Shared page shell: navbar, optional breadcrumbs, page content, related-page
 * links, and footer. Every indexable page renders through this so the header,
 * internal linking, and footer stay identical across the site.
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
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
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
