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
 * The backstop for the promise above. The tracker hands every payload, page
 * views included, to `window.umamiBeforeSend` before it sends, and this swaps
 * anything shaped like a NIK (16 digits, optionally split by spaces, dots,
 * dashes, `+` or `%20`) in the URL, referrer, title or event data for "[nik]".
 * A NIK stored as a JSON number can't be swapped without breaking the JSON, so
 * that payload is dropped instead. Nothing sends a NIK today; this keeps a
 * future `?nik=` link or a careless event from putting one in Umami.
 *
 * `_document.tsx` inlines it ahead of the tracker, so it's in place before the
 * first page view goes out.
 */
export const UMAMI_BEFORE_SEND = String.raw`window.umamiBeforeSend = function (type, payload) {
  var json = JSON.stringify(payload).replace(/\d(?:(?:[\s.+-]|%20)?\d){15}/g, "[nik]");
  try { return JSON.parse(json); } catch (error) { return null; }
};`;

/**
 * Sends a custom event. The tracker is deferred, can be blocked, and only
 * reports from nik.zakiego.com (`data-domains`), so a missing or silent
 * `window.umami` is normal and the call does nothing.
 */
export const track = <E extends keyof Events>(event: E, data?: Events[E]) => {
  window.umami?.track(event, data);
};
