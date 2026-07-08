import { z } from "zod";
import { listKabupaten, listKecamatan, listProvinsi } from "~/lib/region";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";

/**
 * Serves the cascading region dropdowns for the "Generate NIK" feature.
 *
 * Previously the client bundled the full region datasets (~565 KB) and filtered
 * them in the browser. These queries keep the data on the server and hand the
 * client only the handful of options it actually needs at each step.
 */
export const regionRouter = createTRPCRouter({
  provinsi: publicProcedure.query(() =>
    listProvinsi().map((p) => ({ value: p.idProv, label: p.name })),
  ),

  kabupaten: publicProcedure
    .input(z.object({ idProv: z.string() }))
    .query(({ input }) =>
      listKabupaten(input.idProv).map((k) => ({
        value: k.idKab,
        label: k.name,
      })),
    ),

  kecamatan: publicProcedure
    .input(z.object({ idKab: z.string() }))
    .query(({ input }) =>
      listKecamatan(input.idKab).map((k) => ({
        value: k.idKec,
        label: k.name.toUpperCase(),
      })),
    ),
});
