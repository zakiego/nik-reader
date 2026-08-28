import { extractIdsFromNIK, getBirthDate, getGender } from "~/utils/extract";

/**
 * Reads the details encoded in a NIK.
 *
 * The region datasets are pulled in with a dynamic `import()` so this runs in the
 * browser too: webpack keeps them out of the initial bundle and emits them as a
 * lazy `_next/static` chunk (~50 KB brotli) that Cloudflare serves as a plain
 * static asset, fetched once and cached. That is why the UI can read a NIK
 * without a server round trip, and so without a Pages Function invocation.
 *
 * The same function still backs `/api/v0/nik` and the tRPC router, where the
 * import resolves eagerly and the `await` costs nothing.
 */
export const extractDataFromNIK = async (nik: string) => {
  const { findProvinsi, findKabupaten, findKecamatan } = await import(
    "~/lib/region"
  );

  const { idProv, idKab, idKec, idGender, idBirthDate, idUniqueId } =
    extractIdsFromNIK(nik);

  const data = {
    provinsi: findProvinsi(idProv)?.name ?? null,
    kabupaten: findKabupaten(idKab)?.name ?? null,
    kecamatan: findKecamatan(idKec)?.name?.toUpperCase() ?? null,
    gender: getGender({ idGender }),
    birthDate: getBirthDate({ idBirthDate }),
    uniqueId: idUniqueId,
  };

  return data;
};

export type ExtractedNik = Awaited<ReturnType<typeof extractDataFromNIK>>;
