import { z } from "zod";
import { nikRouter } from "~/server/routers/nik";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";

export const appRouter = createTRPCRouter({
  nik: nikRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
