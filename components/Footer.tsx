import Link from "next/link";
import { BrandMark } from "~/components/site/BrandMark";
import { Separator } from "~/components/ui/separator";
import { ALL_ROUTES } from "~/lib/routes";
import { SITE } from "~/lib/site";

const linkClass =
  "focus-ring rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 pb-10">
      <Separator />
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <Link
            href="/"
            className="focus-ring flex w-fit items-center gap-2.5 rounded-lg"
            aria-label="NIK Reader, beranda"
          >
            <BrandMark className="size-7" />
            <span className="text-sm font-semibold">NIK Reader</span>
          </Link>
          <p className="text-sm text-muted-foreground">NIK tidak disimpan.</p>
        </div>

        <nav aria-label="Peta situs">
          <ul className="flex flex-col gap-2.5">
            {ALL_ROUTES.map((route) => (
              <li key={route.path}>
                <Link href={route.path} className={linkClass}>
                  {route.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* The year comes from the build; a visitor's clock may disagree. */}
      <p
        className="mt-10 text-xs text-muted-foreground"
        suppressHydrationWarning
      >
        © {year}{" "}
        <a
          href={SITE.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="zakiego-click"
          data-umami-event-location="footer"
          className="focus-ring rounded-sm underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground"
        >
          {SITE.author}
        </a>
      </p>
    </footer>
  );
};
