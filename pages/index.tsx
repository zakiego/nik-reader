import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { match } from "ts-pattern";
import { Navbar } from "~/components/Navbar";
import { Seo } from "~/components/Seo";
import { Tab } from "~/components/Tab";
import { Predict } from "~/components/pages/Predict";
import { Read } from "~/components/pages/Read";
import type { Feature } from "~/lib/const";
import { SITE } from "~/lib/site";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<Feature>("read");

  const title = match(selectedTab)
    .with("read", () => "Baca & Cek Detail NIK")
    .with("predict", () => "Generate & Buat Contoh NIK")
    .otherwise(() => SITE.title);

  const year = new Date().getFullYear();

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <Seo title={title} />
      <Navbar />
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div key={selectedTab} role="tabpanel" className="animate-fade-in">
        {match(selectedTab)
          .with("read", () => <Read />)
          .with("predict", () => <Predict />)
          .exhaustive()}
      </div>

      <footer className="mt-16 border-t border-line pt-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-primary-fg">
              <IdentificationIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-content">
                NIK Reader
              </div>
              <div className="text-xs text-muted">Reader &amp; Generator</div>
            </div>
          </div>

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
    </main>
  );
}
