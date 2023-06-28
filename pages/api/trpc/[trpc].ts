import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "~/server/app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
