import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/trpc";
import {
  extractIdsFromNIK,
  getBirthDate,
  getGender,
  getKabupaten,
  getKecamatan,
  getProvinsi,
} from "~/utils/extract";

export const nikRouter = createTRPCRouter({
  read: privateProcedure
    .input(
      z.object({
        nik: z.string().min(16).max(16),
      }),
    )
    .mutation(async ({ input }) => {
      const { nik } = input;

      const { idProv, idKab, idKec, idGender, idBirthDate, idUniqueId } =
        extractIdsFromNIK(nik);

      const prov = getProvinsi({ idProv });
      const kab = getKabupaten({ idKab });
      const kec = getKecamatan({ idKec });
      const gender = getGender({ idGender });
      const birthDate = getBirthDate({ idBirthDate });

      const data = {
        provinsi: prov,
        kabupaten: kab,
        kecamatan: kec,
        gender: gender,
        birthDate: birthDate,
        uniqueId: idUniqueId,
      };

      return data;
    }),
});
