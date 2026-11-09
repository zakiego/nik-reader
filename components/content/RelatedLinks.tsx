import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { RouteIcon } from "~/components/RouteIcon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "~/components/ui/item";
import { ALL_ROUTES } from "~/lib/routes";

/**
 * Links to the other pages. On the home page it reads as "other tools";
 * elsewhere as "related pages". Either way every page links to the rest.
 */
export const RelatedLinks = ({ currentPath }: { currentPath: string }) => {
  const others = ALL_ROUTES.filter((r) => r.path !== currentPath);

  if (others.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-xl font-semibold tracking-[-0.015em] sm:text-[1.375rem]"
      >
        {currentPath === "/" ? "Alat lainnya" : "Halaman terkait"}
      </h2>
      <ItemGroup className="mt-4 rounded-2xl border bg-card">
        {others.map((route, index) => (
          <Fragment key={route.path}>
            {index > 0 && <ItemSeparator />}
            <Item
              asChild
              className="rounded-none first:rounded-t-2xl last:rounded-b-2xl"
            >
              <Link href={route.path}>
                <ItemMedia variant="icon">
                  <RouteIcon iconKey={route.iconKey} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{route.navLabel}</ItemTitle>
                  <ItemDescription>{route.navBlurb}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover/item:translate-x-0.5"
                  />
                </ItemActions>
              </Link>
            </Item>
          </Fragment>
        ))}
      </ItemGroup>
    </section>
  );
};
