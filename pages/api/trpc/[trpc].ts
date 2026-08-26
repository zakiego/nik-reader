import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/app";
import { createTRPCContext } from "~/server/trpc";

// Cloudflare Pages runs every server route on the Workers runtime, so the
// handler uses tRPC's fetch adapter (Request in, Response out) instead of the
// Node-only Next.js adapter.
export const config = {
  runtime: "edge",
};

export default function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ path, error }) => {
      console.error(`tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
    },
  });
}
