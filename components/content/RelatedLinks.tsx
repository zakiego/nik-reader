import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { RouteIcon } from "~/components/RouteIcon";
import { ALL_ROUTES } from "~/lib/routes";

/**
 * Feature cards linking to the other pages, with icons and descriptive anchors.
 * On the home page it reads as "other features"; elsewhere as "related pages".
 * Either way it spreads crawl equity and gives every page a route to the rest.
 */
export const RelatedLinks = ({ currentPath }: { currentPath: string }) => {
  const others = ALL_ROUTES.filter((r) => r.path !== currentPath);

  if (others.length === 0) return null;

  const isHome = currentPath === "/";

  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-lg font-semibold tracking-tight text-content"
      >
        {isHome ? "Fitur lainnya" : "Halaman terkait"}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {others.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm outline-none transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-content ring-1 ring-line">
                  <RouteIcon iconKey={route.iconKey} className="h-5 w-5" />
                </span>
                <ArrowRightIcon
                  className="h-4 w-4 text-faint transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-content"
                  aria-hidden="true"
                />
              </span>
              <span>
                <span className="block text-sm font-semibold text-content">
                  {route.navLabel}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {route.navBlurb}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
