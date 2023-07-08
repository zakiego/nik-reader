import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/trpc";
import { extractDataFromNIK } from "~/utils/read";

export const nikRouter = createTRPCRouter({
  read: privateProcedure
    .input(
      z.object({
        nik: z.string().min(16).max(16),
      }),
    )
    .mutation(async ({ input }) => {
      const { nik } = input;

      return extractDataFromNIK(nik);
    }),
});
