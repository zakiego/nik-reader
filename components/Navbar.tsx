import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { SITE } from "~/lib/site";

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        aria-label="NIK Reader beranda"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-primary-fg shadow-sm ring-1 ring-black/5">
          <IdentificationIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <div className="text-lg font-bold tracking-tight text-content">
            NIK
          </div>
          <div className="text-xs font-medium text-muted">
            Reader &amp; Generator
          </div>
        </div>
      </Link>

      <a
        href={SITE.authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kunjungi zakiego.com"
        title="zakiego.com"
        className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
      </a>
    </header>
  );
};
