import kabupatenJson from "~/data/kabupaten.json";

export type Kabupaten = { idKab: string; idProv: string; name: string };

export const KABUPATEN: readonly Kabupaten[] = kabupatenJson;
