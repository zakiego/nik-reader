/**
 * The five parts of a NIK, in order. The explainer, the generator preview and
 * the reader all draw from this list, so a digit range can't drift between
 * them.
 */
export const SEGMENTS = [
  {
    key: "provinsi",
    name: "Provinsi",
    /** Mid-sentence form of `name`. */
    hint: "provinsi",
    start: 0,
    end: 2,
  },
  {
    key: "kabupaten",
    name: "Kabupaten/kota",
    /** Mid-sentence form of `name`. */
    hint: "kabupaten/kota",
    start: 2,
    end: 4,
  },
  {
    key: "kecamatan",
    name: "Kecamatan",
    /** Mid-sentence form of `name`. */
    hint: "kecamatan",
    start: 4,
    end: 6,
  },
  {
    key: "birthDate",
    name: "Tanggal lahir",
    /** Mid-sentence form of `name`. */
    hint: "tanggal lahir",
    start: 6,
    end: 12,
  },
  {
    key: "urut",
    name: "Nomor urut",
    /** Mid-sentence form of `name`. */
    hint: "nomor urut",
    start: 12,
    end: 16,
  },
] as const;

export type Segment = (typeof SEGMENTS)[number];
export type SegmentKey = Segment["key"];

/** A fictional NIK that decodes fully: Cileunyi, Kab. Bandung, a woman born 5 January 1990. */
export const SAMPLE_NIK = "3204054501900001";

/** "3204054501900001" -> "32 04 05 450190 0001", split by meaning. */
export const splitNik = (nik: string) =>
  SEGMENTS.map((s) => nik.slice(s.start, s.end)).join(" ");
