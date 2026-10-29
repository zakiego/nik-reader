import type { Feature } from "~/lib/const";

/**
 * Custom events for the self-hosted Umami tracker loaded in `_document.tsx`,
 * keyed by name with the data each one carries. They show up under Events for
 * nik.zakiego.com in Umami, and the dashboard's goals match on these names, so
 * renaming one breaks its goal.
 *
 * Event data never holds the NIK or anything decoded from it (region, gender,
 * birth date). The site promises the NIK isn't stored, and that covers
 * analytics too.
 */
type Events = {
  /** A NIK was read. `missing` lists the fields that didn't decode, or "none". */
  "nik-read": { missing: string };
  /** Reading threw, most likely because the region chunk failed to load. */
  "nik-read-error": { error: string };
  /** The generator preview filled in: region, gender and birth date are set. */
  "nik-generate": undefined;
  /** The home page tool switched tabs. */
  "tab-switch": { tab: Feature };
  /** An FAQ answer was opened. */
  "faq-open": { question: string };
  /**
   * A link out to zakiego.com was clicked. The tracker sends this one itself,
   * from the `data-umami-event` attributes on the navbar and footer links.
   */
  "zakiego-click": { location: "navbar" | "footer" };
};

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
  }
}

/**
 * Sends a custom event. The tracker is deferred, can be blocked, and only
 * reports from nik.zakiego.com (`data-domains`), so a missing or silent
 * `window.umami` is normal and the call does nothing.
 */
export const track = <E extends keyof Events>(event: E, data?: Events[E]) => {
  window.umami?.track(event, data);
};
