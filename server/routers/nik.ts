import { nikSchema } from "~/lib/nik-schema";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { extractDataFromNIK } from "~/utils/read";

export const nikRouter = createTRPCRouter({
  read: publicProcedure.input(nikSchema).mutation(async ({ input }) => {
    return extractDataFromNIK(input.nik);
  }),
});
