import { groupBy, keyBy } from "lodash";
import { KABUPATEN } from "~/lib/kabupaten";
import { KECAMATAN } from "~/lib/kecamatan";
import { PROVINSI } from "~/lib/provinsi";

/**
 * Single source of truth for looking up Indonesian administrative regions.
 *
 * This module imports the large region datasets (~565 KB) and is intended to be
 * used *server-side only* (tRPC routers / API routes). Do not import it from
 * client components, since that would ship the full datasets to the browser.
 *
 * Lookups are backed by maps built once at module load, so both the point
 * lookups (`find*`) and the cascading lists (`list*`) are O(1).
 */

const provinsiById = keyBy(PROVINSI, "idProv");
const kabupatenById = keyBy(KABUPATEN, "idKab");
const kecamatanById = keyBy(KECAMATAN, "idKec");

const kabupatenByProv = groupBy(KABUPATEN, "idProv");
const kecamatanByKab = groupBy(KECAMATAN, "idKab");

export const findProvinsi = (idProv: string) => provinsiById[idProv] ?? null;
export const findKabupaten = (idKab: string) => kabupatenById[idKab] ?? null;
export const findKecamatan = (idKec: string) => kecamatanById[idKec] ?? null;

export const listProvinsi = () => PROVINSI;
export const listKabupaten = (idProv: string) => kabupatenByProv[idProv] ?? [];
export const listKecamatan = (idKab: string) => kecamatanByKab[idKab] ?? [];
