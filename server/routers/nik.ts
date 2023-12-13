import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/trpc";
import { extractDataFromNIK } from "~/utils/read";

export const nikRouter = createTRPCRouter({
  read: publicProcedure
    .input(
      z.object({
        nik: z.string().length(16),
      }),
    )
    .mutation(async ({ input }) => {
      const { nik } = input;

      return extractDataFromNIK(nik);
    }),
});
