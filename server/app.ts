import { nikRouter } from "~/server/routers/nik";
import { regionRouter } from "~/server/routers/region";
import { createTRPCRouter } from "~/server/trpc";

export const appRouter = createTRPCRouter({
  nik: nikRouter,
  region: regionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
