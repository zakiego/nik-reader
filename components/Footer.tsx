import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { SITE } from "~/lib/site";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line pt-8">
      <div className="flex items-start justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label="NIK Reader beranda"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-primary-fg">
            <IdentificationIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-content">NIK Reader</div>
            <div className="text-xs text-muted">Reader &amp; Generator</div>
          </div>
        </Link>

        <a
          href={SITE.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kunjungi zakiego.com"
          title="zakiego.com"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Baca &amp; generate contoh NIK untuk keperluan edukasi.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-5">
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
          <ShieldCheckIcon
            className="h-3.5 w-3.5 shrink-0 text-success"
            aria-hidden="true"
          />
          Data tidak disimpan
        </div>
        <span className="text-xs text-faint">
          © {year} {SITE.author}
        </span>
      </div>
    </footer>
  );
};
