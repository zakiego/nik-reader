import provinsiJson from "~/data/provinsi.json";

export type Provinsi = { idProv: string; name: string };

export const PROVINSI: readonly Provinsi[] = provinsiJson;
