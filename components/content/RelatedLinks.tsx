import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { ALL_ROUTES } from "~/lib/routes";

/**
 * Cross-links to the other pages, with descriptive anchors. Internal linking
 * spreads crawl equity and gives each landing page a route in from every other.
 */
export const RelatedLinks = ({ currentPath }: { currentPath: string }) => {
  const others = ALL_ROUTES.filter((r) => r.path !== currentPath);

  if (others.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-lg font-semibold tracking-tight text-content"
      >
        Halaman terkait
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3">
        {others.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 shadow-sm transition-colors hover:border-primary/30 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-content">
                  {route.navLabel}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {route.navBlurb}
                </span>
              </span>
              <ArrowRightIcon
                className="h-4 w-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:text-content"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
