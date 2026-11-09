import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type { Crumb } from "~/lib/structured-data";

/**
 * Visible breadcrumb trail for sub-pages. The matching BreadcrumbList JSON-LD is
 * emitted separately by each page (see lib/structured-data).
 */
export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <Breadcrumb className="mt-4">
    <BreadcrumbList>
      {items.map((item, i) => (
        <Fragment key={item.path}>
          {i > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            {i === items.length - 1 ? (
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={item.path}>{item.name}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);
