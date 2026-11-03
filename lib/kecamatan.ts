import kecamatanJson from "~/data/kecamatan.json";

export type Kecamatan = { idKec: string; idKab: string; name: string };

export const KECAMATEN: readonly Kecamatan[] = kecamatanJson;
