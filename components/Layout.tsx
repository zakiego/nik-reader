import type { ReactNode } from "react";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { RelatedLinks } from "~/components/content/RelatedLinks";
import type { Crumb } from "~/lib/structured-data";

/**
 * Shared page shell: header with the site nav, optional breadcrumbs, the page
 * content, links to the other pages, and the footer.
 */
export const Layout = ({
  children,
  currentPath,
  breadcrumbs,
}: {
  children: ReactNode;
  /** Path of the current page (marked in the nav, left out of related links). */
  currentPath: string;
  breadcrumbs?: Crumb[];
}) => (
  <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
    <a
      href="#isi"
      className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
    >
      Langsung ke isi
    </a>
    <Navbar currentPath={currentPath} />
    <main id="isi" className="scroll-mt-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      {children}
      <RelatedLinks currentPath={currentPath} />
    </main>
    <Footer />
  </div>
);
