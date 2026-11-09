import { NIK_LENGTH } from "~/lib/const";

/**
 * The five parts of a NIK, in order. The reader, the generator preview and the
 * explainer all draw from this list, so a digit range or a label can't drift
 * between them. `key` doubles as the `data-seg` value that picks the segment
 * color in styles/globals.css.
 */
export const SEGMENTS = [
  {
    key: "provinsi",
    label: "Provinsi",
    short: "Prov",
    name: "Kode provinsi",
    /** Mid-sentence form of `name`. */
    hint: "kode provinsi",
    start: 0,
    end: 2,
  },
  {
    key: "kabupaten",
    label: "Kab/Kota",
    short: "Kab",
    name: "Kode kabupaten/kota",
    /** Mid-sentence form of `name`. */
    hint: "kode kabupaten/kota",
    start: 2,
    end: 4,
  },
  {
    key: "kecamatan",
    label: "Kecamatan",
    short: "Kec",
    name: "Kode kecamatan",
    /** Mid-sentence form of `name`. */
    hint: "kode kecamatan",
    start: 4,
    end: 6,
  },
  {
    key: "birthDate",
    label: "Tanggal lahir",
    short: "Tgl lahir",
    name: "Tanggal lahir (DDMMYY)",
    /** Mid-sentence form of `name`. */
    hint: "tanggal lahir (DDMMYY)",
    start: 6,
    end: 12,
  },
  {
    key: "urut",
    label: "No. urut",
    short: "Urut",
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

/** "Digit 7–12", 1-based, for labels. */
export const digitRange = (segment: Segment) =>
  segment.end - segment.start === 1
    ? `Digit ${segment.end}`
    : `Digit ${segment.start + 1}–${segment.end}`;

/** The segment the next typed digit lands in, or null once all 16 are in. */
export const segmentAt = (length: number): Segment | null =>
  length >= NIK_LENGTH
    ? null
    : SEGMENTS.find((s) => length >= s.start && length < s.end) ?? null;

/** "3204054501900001" -> "32 04 05 450190 0001", split by meaning. */
export const splitNik = (nik: string) =>
  SEGMENTS.map((s) => nik.slice(s.start, s.end)).join(" ");
