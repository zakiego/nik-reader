import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import type { Crumb } from "~/lib/structured-data";

/**
 * Visible breadcrumb trail for sub-pages. The matching BreadcrumbList JSON-LD is
 * emitted separately by each page (see lib/structured-data).
 */
export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="mt-6">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="font-medium text-content">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="rounded transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.name}
                  </Link>
                  <ChevronRightIcon
                    className="h-3.5 w-3.5 shrink-0 text-faint"
                    aria-hidden="true"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
