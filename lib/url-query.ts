import type { NextRouter } from "next/router";

/** Query params the tools write, so a tab switch can clear the other tool's. */
export const TOOL_PARAMS = ["nik", "region", "gender", "birth"] as const;
export type ToolParam = (typeof TOOL_PARAMS)[number];

/** A single string param, or undefined when it's missing or repeated. */
export const getParam = (router: NextRouter, key: ToolParam) => {
  const value = router.query[key];
  return typeof value === "string" ? value : undefined;
};

/**
 * Sets or removes params in place, without a history entry or a scroll jump.
 * It starts from the live URL rather than `router.query`, so two writes in a
 * row (one per keystroke) don't overwrite each other with a stale copy.
 */
export const replaceParams = (
  router: NextRouter,
  params: Partial<Record<ToolParam, string | null>>,
) => {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  router.replace(next, undefined, { shallow: true, scroll: false });
};
