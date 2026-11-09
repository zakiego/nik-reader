import { GlobeIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "~/components/site/BrandMark";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ALL_ROUTES } from "~/lib/routes";
import { SITE } from "~/lib/site";

export const Navbar = ({ currentPath }: { currentPath: string }) => (
  <header className="flex h-16 items-center justify-between gap-4">
    <Link
      href="/"
      className="focus-ring -m-1 flex items-center gap-2.5 rounded-lg p-1"
      aria-label="NIK Reader, beranda"
    >
      <BrandMark />
      <span className="text-[0.9375rem] font-semibold tracking-tight">
        NIK Reader
      </span>
    </Link>

    <nav aria-label="Utama" className="hidden items-center gap-1 sm:flex">
      <ul className="flex items-center gap-0.5">
        {ALL_ROUTES.map((route) => {
          const current = route.path === currentPath;
          return (
            <li key={route.path}>
              <Button variant="nav" size="sm" asChild>
                <Link
                  href={route.path}
                  aria-current={current ? "page" : undefined}
                >
                  {route.navShort}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="ml-1 text-muted-foreground"
      >
        <a
          href={SITE.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kunjungi zakiego.com"
          title="zakiego.com"
          data-umami-event="zakiego-click"
          data-umami-event-location="navbar"
        >
          <GlobeIcon aria-hidden="true" />
        </a>
      </Button>
    </nav>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 size-11 sm:hidden"
          aria-label="Buka menu"
        >
          <MenuIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-56">
        <DropdownMenuGroup>
          {ALL_ROUTES.map((route) => (
            <DropdownMenuItem key={route.path} asChild>
              <Link
                href={route.path}
                aria-current={route.path === currentPath ? "page" : undefined}
                className="aria-[current=page]:font-medium"
              >
                {route.navLabel}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a
              href={SITE.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="zakiego-click"
              data-umami-event-location="navbar"
            >
              <GlobeIcon aria-hidden="true" />
              zakiego.com
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
);
